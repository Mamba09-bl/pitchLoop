"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  CircleAlert,
  ThumbsUp,
  MessageSquareQuote,
  Phone,
  Lock,
  Unlock,
  ArrowRight,
} from "lucide-react";
import AppShell from "../app/AppShell";
import StatusCard from "../app/StatusCard";
import BackLink from "../app/BackLink";
import StepRail from "../app/StepRail";
import { SectionLabel, Reveal, SegMeter, ScoreRing, scoreTone, Button } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

const SKILLS = [
  { key: "openingAndRelevance", label: "Opening & Relevance" },
  { key: "clarityAndConciseness", label: "Clarity & Conciseness" },
  { key: "objectionHandling", label: "Objection Handling" },
  { key: "goalAchievement", label: "Goal Achievement" },
];

const STEPS_AFTER_CALL_1 = [
  { label: "Call 1", state: "done" },
  { label: "Call 2", state: "current" },
  { label: "Coaching", state: "locked" },
];

const STEPS_AFTER_CALL_2 = [
  { label: "Call 1", state: "done" },
  { label: "Call 2", state: "done" },
  { label: "Coaching", state: "done" },
];

function ScoreTag({ value }) {
  const { tone, label } = scoreTone(value);
  const dot = tone === "gain" ? "bg-pl-gain" : tone === "signal" ? "bg-pl-signal" : "bg-pl-ink";
  const text = tone === "gain" ? "text-pl-gain" : tone === "signal" ? "text-pl-signal-2" : "text-pl-body";
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-[6px] w-[6px] shrink-0 rounded-[1px] ${dot}`} />
      <span className={`pl-label ${text}`}>{label}</span>
    </span>
  );
}

export default function VoiceFeedbackView() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const voiceId = params.voiceId;
  const requestedCall = searchParams.get("call");
  const [feedback, setFeedback] = useState(null);
  const [callNumber, setCallNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const coachingUnlocked = callNumber >= 2;
  const viewedCallNumber = feedback?.callNumber || Number(requestedCall) || callNumber;

  useEffect(() => {
    if (!voiceId) {
      const timeoutId = window.setTimeout(() => {
        setLoading(false);
        setError("Missing session ID");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        const query = requestedCall
          ? `voiceId=${voiceId}&callNumber=${requestedCall}`
          : `voiceId=${voiceId}`;
        const res = await fetch(`/api/voice-feedback?${query}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Unable to load feedback");
        }

        setFeedback(data.feedback);
        setCallNumber(data.callNumber || 1);
      } catch (err) {
        console.error("Failed to load voice feedback:", err);
        setError(err.message || "Unable to load feedback");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [voiceId, requestedCall]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-pl-ink border-t-transparent" />
          <p className="text-[13.5px] text-pl-mute">Loading your call review…</p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <StatusCard
            tone="alert"
            icon={<CircleAlert className="h-5 w-5" />}
            title="Unable to load feedback"
            description={error}
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="pb-6 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <BackLink onClick={() => router.push("/history")}>Back to history</BackLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <SectionLabel>Training session</SectionLabel>
              {coachingUnlocked && (
                <div className="flex items-center gap-2">
                  {[1, 2].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => router.push(`/voice-feedback/${voiceId}?call=${n}`)}
                      className={`rounded-full border px-3 py-1 pl-label transition-colors duration-200 ${
                        viewedCallNumber === n
                          ? "border-pl-ink bg-pl-ink text-pl-onink"
                          : "border-pl-rule-2 text-pl-mute hover:border-pl-ink hover:text-pl-ink"
                      }`}
                    >
                      Call {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <h1 className="pl-display mt-4 text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold text-pl-ink">
              {coachingUnlocked ? `Call ${viewedCallNumber} review.` : "First call complete."}
            </h1>
            <p className="mt-2.5 max-w-[52ch] text-[14px] leading-relaxed text-pl-body">
              {coachingUnlocked
                ? "Both calls are done — your full coaching report is ready."
                : "Review your feedback, then make your second call to unlock your full coaching report."}
            </p>
            {coachingUnlocked && (
              <Button
                variant="signal"
                arrow
                className="mt-5"
                onClick={() => router.push(`/coaching/${voiceId}`)}
              >
                <Unlock className="h-3.5 w-3.5" />
                View your coaching report
              </Button>
            )}
          </div>
          <div className="shrink-0">
            <StepRail steps={coachingUnlocked ? STEPS_AFTER_CALL_2 : STEPS_AFTER_CALL_1} />
          </div>
        </motion.div>
      </section>

      <section className="flex flex-col gap-5 pb-20 sm:pb-28">
        {/* Outcome + score + skills */}
        <Reveal className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]" delay={0.1}>
          <div className="flex flex-col gap-5">
            <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
              <span className="pl-label text-pl-mute">Call outcome</span>
              <div className="mt-4 flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                    feedback.callOutcome.achieved
                      ? "border-pl-gain/30 bg-pl-gain/10 text-pl-gain"
                      : "border-pl-signal/40 bg-pl-signal/10 text-pl-signal-2"
                  }`}
                >
                  {feedback.callOutcome.achieved ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <CircleAlert className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-[15.5px] font-semibold leading-snug text-pl-ink">
                    {feedback.callOutcome.goal}
                  </p>
                  <p
                    className={`mt-1 pl-label ${
                      feedback.callOutcome.achieved ? "text-pl-gain" : "text-pl-signal-2"
                    }`}
                  >
                    {feedback.callOutcome.achieved ? "Achieved" : "Not achieved"}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-pl-body">
                    {feedback.callOutcome.reason}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-6 rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
              <ScoreRing value={feedback.overallScore.score} />
              <div className="min-w-0">
                <span className="pl-label text-pl-mute">Overall score</span>
                <p className="mt-2 text-[15px] font-semibold text-pl-ink">
                  {feedback.overallScore.label}
                </p>
                <div className="mt-2.5">
                  <ScoreTag value={feedback.overallScore.score} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
            <span className="pl-label text-pl-mute">Skill breakdown</span>
            <div className="mt-5 flex flex-col gap-5">
              {SKILLS.map((skill) => {
                const value = feedback.skillBreakdown[skill.key];
                const { tone } = scoreTone(value);
                return (
                  <div key={skill.key}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[13px] text-pl-body">{skill.label}</p>
                      <p className="pl-mono text-[12.5px] font-medium text-pl-ink">
                        {value}
                        <span className="text-pl-mute">/100</span>
                      </p>
                    </div>
                    <SegMeter value={value} segments={20} tone={tone} className="h-2" />
                  </div>
                );
              })}
            </div>
            <p className="mt-6 border-t border-pl-rule pt-4 text-[11.5px] leading-relaxed text-pl-mute">
              Scored against the goal and context you set before the call.
            </p>
          </div>
        </Reveal>

        {/* Strengths + improvements */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal delay={0.16}>
            <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
              <div className="flex items-center gap-2.5">
                <ThumbsUp className="h-4 w-4 text-pl-gain" />
                <h2 className="text-[15px] font-semibold text-pl-ink">What you did well</h2>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {feedback.strengths.map((strength, index) => (
                  <div
                    key={`${strength.title}-${index}`}
                    className="border-l-2 border-pl-gain/50 bg-pl-raised py-2.5 pl-4"
                  >
                    <p className="text-[13.5px] font-semibold text-pl-ink">{strength.title}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-pl-body">
                      {strength.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
              <div className="flex items-center gap-2.5">
                <CircleAlert className="h-4 w-4 text-pl-signal-2" />
                <h2 className="text-[15px] font-semibold text-pl-ink">What to improve</h2>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                {feedback.improvements.map((item, index) => (
                  <div
                    key={`${item.mistake}-${index}`}
                    className="border-l-2 border-pl-signal/50 bg-pl-raised py-2.5 pl-4"
                  >
                    <p className="text-[13.5px] font-semibold text-pl-ink">{item.mistake}</p>
                    <div className="mt-2 flex flex-col gap-1.5 text-[13px] leading-relaxed text-pl-body">
                      <p>
                        <span className="font-semibold text-pl-ink">Why it matters: </span>
                        {item.whyItMatters}
                      </p>
                      <p>
                        <span className="font-semibold text-pl-ink">How to improve: </span>
                        {item.howToImprove}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Conversation moments */}
        <Reveal delay={0.28}>
          <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
            <div className="flex items-center gap-2.5">
              <MessageSquareQuote className="h-4 w-4 text-pl-ink" />
              <h2 className="text-[15px] font-semibold text-pl-ink">
                Your answer vs. better answer
              </h2>
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {feedback.conversationMoments.map((moment, index) => (
                <div
                  key={`${moment.buyerMessage}-${index}`}
                  className="grid gap-4 border-t border-pl-rule pt-4 first:border-t-0 first:pt-0 lg:grid-cols-3"
                >
                  <div>
                    <span className="pl-label text-pl-mute">Buyer asked</span>
                    <p className="mt-2 text-[13px] leading-relaxed text-pl-body">
                      {moment.buyerMessage}
                    </p>
                  </div>
                  <div>
                    <span className="pl-label text-pl-mute">You answered</span>
                    <p className="mt-2 text-[13px] leading-relaxed text-pl-body">
                      {moment.sellerAnswer}
                    </p>
                  </div>
                  <div className="border-l-2 border-pl-ink/70 bg-pl-raised py-1 pl-4">
                    <span className="pl-label text-pl-mute">Better answer</span>
                    <p className="mt-2 text-[13px] leading-relaxed text-pl-ink">
                      {moment.betterAnswer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Next call CTA */}
        {!coachingUnlocked && (
          <Reveal delay={0.34}>
            <div className="rounded-[6px] border border-pl-rule-2 bg-pl-ink p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <span className="pl-label text-pl-signal">One focus for your next call</span>
                  <h2 className="pl-display-tight mt-2.5 text-[19px] font-bold text-pl-onink">
                    {feedback.nextFocus.title}
                  </h2>
                  <p className="mt-2.5 max-w-[52ch] text-[13.5px] leading-relaxed text-pl-onink-2">
                    {feedback.nextFocus.explanation}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 pl-label text-pl-onink-3">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-pl-gain" />
                      Call 1 completed
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="inline-flex items-center gap-1.5 text-pl-onink-2">
                      <Phone className="h-3.5 w-3.5 text-pl-signal" />
                      Practice what you learned
                    </span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      Full coaching unlocks
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Button
                    variant="signal"
                    arrow
                    className="w-full lg:w-auto"
                    onClick={() => router.push(`/voice/${voiceId}`)}
                  >
                    Make your second call
                  </Button>
                  <p className="mt-2.5 text-center pl-label text-pl-onink-3 lg:text-right">
                    Unlocks after call 2
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </section>
    </AppShell>
  );
}
