"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Brain,
  CheckCircle2,
  AlertTriangle,
  MinusCircle,
  TrendingUp,
  Unlock,
} from "lucide-react";
import AppShell from "../app/AppShell";
import StatusCard from "../app/StatusCard";
import BackLink from "../app/BackLink";
import { SectionLabel, Reveal, Button } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

/* Real values coming out of the API are "Strong" | "Needs Improvement" |
   "Not Evaluated", plus a derived "Improved" once a drill is completed —
   the previous UI's switch statement checked for "Good", which the API
   never actually sends, so every Strong skill silently rendered neutral. */
const STATUS_STYLE = {
  Strong: {
    badge: "border-pl-gain/30 bg-pl-gain/10 text-pl-gain",
    bar: "border-l-pl-gain/60",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  Improved: {
    badge: "border-pl-gain/30 bg-pl-gain/10 text-pl-gain",
    bar: "border-l-pl-gain/60",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  },
  "Needs Improvement": {
    badge: "border-pl-signal/40 bg-pl-signal/10 text-pl-signal-2",
    bar: "border-l-pl-signal/60",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  "Not Evaluated": {
    badge: "border-pl-rule-2 bg-pl-raised text-pl-mute",
    bar: "border-l-pl-rule-2",
    icon: <MinusCircle className="h-3.5 w-3.5" />,
  },
};

function statusStyle(status) {
  return STATUS_STYLE[status] || STATUS_STYLE["Not Evaluated"];
}

export default function CoachingView() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId;
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [practice, setPractice] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      const timeoutId = window.setTimeout(() => {
        setLoading(false);
        setError("Missing session ID");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    async function fetchEvaluation() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/coaching?sessionId=${sessionId}`);

        if (response.status === 403) {
          router.replace(`/voice-feedback/${sessionId}`);
          return;
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch evaluation");
        }

        let data = await response.json();

        // The session's `coaching` field carries schema defaults
        // (overallSummary: "", skills: []), so it's always truthy even
        // when nothing has been generated yet — check for real content
        // before deciding coaching already exists.
        const hasCoaching = Boolean(
          data?.coaching?.overallSummary || data?.coaching?.skills?.length,
        );

        if (!hasCoaching) {
          const generateResponse = await fetch("/api/coaching", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: sessionId, evaluateFull: true }),
          });

          if (!generateResponse.ok) {
            const errorData = await generateResponse.json();
            throw new Error(errorData.error || "Failed to generate evaluation");
          }

          data = await generateResponse.json();
        }

        const coachingData = data?.coaching || data?.evaluation;
        setEvaluation(coachingData);
        setPractice(data?.practice);
      } catch (err) {
        console.error("Failed to load coaching:", err);
        setError(err.message || "Unable to load coaching");
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluation();
  }, [sessionId, router]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-pl-ink border-t-transparent" />
          <p className="text-[13.5px] text-pl-mute">Loading your coaching report…</p>
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
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Failed to load evaluation"
            description={error}
          />
        </div>
      </AppShell>
    );
  }

  if (!evaluation) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <StatusCard
            icon={<Brain className="h-5 w-5" />}
            title="No evaluation available"
            description="Complete a practice session to get coaching feedback."
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
          className="mt-7 flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pl-gain/30 bg-pl-gain/10 px-2.5 py-1 pl-label text-pl-gain">
            <CheckCircle2 className="h-3 w-3" />
            Session complete
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-pl-rule-2 bg-pl-raised px-2.5 py-1 pl-label text-pl-mute">
            <Sparkles className="h-3 w-3 text-pl-signal-2" />
            Generated by AI
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-pl-gain/30 bg-pl-gain/10 px-2.5 py-1 pl-label text-pl-gain">
            <Unlock className="h-3 w-3" />
            Coaching unlocked
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
          className="pl-display mt-6 text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-pl-ink"
        >
          Your coaching report.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
          className="mt-2.5 max-w-[56ch] text-[14px] leading-relaxed text-pl-body"
        >
          You completed your sales training session. Here&apos;s what you learned — and where to
          focus next.
        </motion.p>
      </section>

      <section className="flex flex-col gap-5 pb-20 sm:pb-28">
        <Reveal delay={0.1}>
          <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6 sm:p-7">
            <div className="flex items-center gap-2.5">
              <Target className="h-4 w-4 text-pl-ink" />
              <h2 className="text-[15px] font-semibold text-pl-ink">Overall assessment</h2>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-pl-body">
              {evaluation?.overallSummary || "No overall summary available yet."}
            </p>
          </div>
        </Reveal>

        <div>
          <div className="mb-4 flex items-center justify-between px-1">
            <span className="pl-label text-pl-mute">Skill review</span>
            <span className="pl-mono text-[11px] text-pl-mute">
              {(evaluation?.skills || []).length} evaluated
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {(evaluation?.skills || []).map((skill, index) => {
              const displayStatus = skill.practiceCompleted ? "Improved" : skill.status;
              const style = statusStyle(displayStatus);

              return (
                <Reveal key={skill.name || index} delay={0.14 + Math.min(index, 6) * 0.05}>
                  <article
                    className={`rounded-[6px] border border-pl-rule-2 border-l-2 bg-pl-white p-6 ${style.bar}`}
                  >
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-[16px] font-semibold tracking-tight text-pl-ink">
                        {skill.name}
                      </h3>
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-semibold ${style.badge}`}
                      >
                        {style.icon}
                        {displayStatus}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="pl-label text-pl-mute">Why this matters</p>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-pl-body">
                          {skill.whyItMatters}
                        </p>
                      </div>
                      <div>
                        <p className="pl-label text-pl-mute">What happened</p>
                        <p className="mt-1.5 text-[13.5px] leading-relaxed text-pl-body">
                          {skill.whatHappened}
                        </p>
                      </div>

                      {displayStatus === "Improved" && (
                        <p className="flex items-center gap-1.5 border-t border-pl-rule pt-4 text-[12.5px] font-medium text-pl-gain">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Practice completed — this skill improved.
                        </p>
                      )}

                      {displayStatus === "Not Evaluated" && (
                        <p className="flex items-center gap-1.5 border-t border-pl-rule pt-4 text-[12.5px] font-medium text-pl-mute">
                          <MinusCircle className="h-3.5 w-3.5 shrink-0" />
                          This skill wasn&apos;t demonstrated enough during the calls to evaluate
                          it — it&apos;s not a mark against your performance.
                        </p>
                      )}

                      {displayStatus === "Needs Improvement" && (
                        <div className="border-t border-pl-rule pt-4">
                          <Button
                            variant="ink"
                            onClick={() =>
                              router.push(
                                `/practice/${sessionId}/${encodeURIComponent(skill.name)}`,
                              )
                            }
                            className="px-5 py-2.5 text-[13px]"
                          >
                            <Target className="h-3.5 w-3.5" />
                            Practice this skill
                          </Button>
                          <p className="mt-2 text-[11.5px] text-pl-mute">
                            A focused drill built from this exact conversation.
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
