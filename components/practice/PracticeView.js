"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  SendHorizonal,
} from "lucide-react";
import AppShell from "../app/AppShell";
import StatusCard from "../app/StatusCard";
import BackLink from "../app/BackLink";
import { SectionLabel, Reveal, Button } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

function StatusPill({ status }) {
  if (status === "passed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-pl-gain/30 bg-pl-gain/10 px-2.5 py-1 pl-label text-pl-gain">
        <CheckCircle2 className="h-3 w-3" />
        Passed
      </span>
    );
  }
  if (status === "failed-final") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-pl-signal/40 bg-pl-signal/10 px-2.5 py-1 pl-label text-pl-signal-2">
        <AlertTriangle className="h-3 w-3" />
        Final attempt
      </span>
    );
  }
  if (status === "incorrect") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-pl-signal/40 bg-pl-signal/10 px-2.5 py-1 pl-label text-pl-signal-2">
        <AlertTriangle className="h-3 w-3" />
        Try again
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-pl-rule-2 bg-pl-raised px-2.5 py-1 pl-label text-pl-mute">
      <span className="h-1.5 w-1.5 rounded-full bg-pl-ink" />
      In progress
    </span>
  );
}

export default function PracticeView() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId;
  const skillParam = params?.skill;
  const skillName = useMemo(() => {
    if (!skillParam) return "";
    return decodeURIComponent(skillParam);
  }, [skillParam]);

  const [scenario, setScenario] = useState("");
  const [answer, setAnswer] = useState("");
  const [attempt, setAttempt] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);

  const generateScenario = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          skillName,
          sessionId,
        }),
      });

      const data = await res.json();
      console.log("i am data", data);

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to generate scenario");
      }

      setScenario(data.scenario || "");
      setAnswer("");
      setAttempt((data.sessionAttempts || 0) + 1);
      setStatus("idle");
      setResult(null);
    } catch (err) {
      console.error("Failed to generate practice scenario", err);
      setError(err.message || "Unable to generate scenario");
    } finally {
      setLoading(false);
    }
  }, [sessionId, skillName]);

  const fetchPractice = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/practice?sessionId=${sessionId}`);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to load practice");
      }

      if (!data.practice || !data.practice.scenario) {
        await generateScenario();
        return;
      }

      setScenario(data.practice.scenario || "");
      setAnswer("");
      setAttempt(Math.min((data.practice.attempts || 0) + 1, 4));

      if (data.practice.completed) {
        setStatus("passed");
        setResult({
          type: "passed",
          message:
            "Great job!\n\nYou answered this scenario correctly.\n\nThis skill has been demonstrated successfully.",
        });
      } else {
        setStatus("idle");
        setResult(null);
      }
    } catch (err) {
      console.error("Failed to load practice scenario", err);
      setError(err.message || "Unable to load practice");
    } finally {
      setLoading(false);
    }
  }, [sessionId, generateScenario]);

  useEffect(() => {
    if (!sessionId || !skillName) {
      const timeoutId = window.setTimeout(() => {
        setLoading(false);
        setError("Missing session or skill information");
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    const timeoutId = window.setTimeout(() => {
      void fetchPractice();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [sessionId, skillName, fetchPractice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      setError("Please enter an answer before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate",
          scenario,
          sellerAnswer: answer,
          skillName,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to evaluate answer");
      }
      console.log("secondData", data);

      if (data.passed) {
        setStatus("passed");
        setResult({
          type: "passed",
          message:
            "Great job!\n\nYou answered this scenario correctly.\n\nThis skill has been demonstrated successfully.",
        });
        return;
      }

      if (attempt >= 4) {
        setStatus("failed-final");
        setResult({
          type: "failed-final",
          idealAnswer: data.idealAnswer || "",
          explanation: data.explanation || "",
        });
        return;
      }

      setAttempt(data.currentAttempt + 1);
      setStatus("incorrect");
      setResult({ type: "incorrect" });
    } catch (err) {
      console.error("Failed to evaluate practice answer", err);
      setError(err.message || "Unable to evaluate answer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAnother = async () => {
    await generateScenario();
    console.log("hello");
  };

  if (loading && !scenario && !error) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-pl-ink border-t-transparent" />
          <p className="text-[13.5px] text-pl-mute">Preparing your practice scenario…</p>
        </div>
      </AppShell>
    );
  }

  if (!loading && error && !scenario) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <StatusCard
            tone="alert"
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Unable to load practice"
            description={error}
            action={
              <Button variant="outline" className="w-full" onClick={() => router.back()}>
                Go back
              </Button>
            }
          />
        </div>
      </AppShell>
    );
  }

  const progressCaption =
    status === "passed"
      ? "Skill demonstrated — nice work."
      : attempt < 4
        ? `${4 - attempt} attempt${4 - attempt === 1 ? "" : "s"} remaining before the ideal answer unlocks.`
        : "Final attempt — the ideal answer unlocks after this one.";

  return (
    <AppShell>
      <section className="pb-6 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <BackLink onClick={() => router.push(`/coaching/${sessionId}`)}>
            Back to coaching
          </BackLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          className="mt-7 flex flex-wrap items-center justify-between gap-3"
        >
          <SectionLabel>Skill practice</SectionLabel>
          <StatusPill status={status} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="pl-display mt-5 text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-pl-ink"
        >
          {skillName || "Selected skill"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.21 }}
          className="mt-2.5 max-w-[56ch] text-[14px] leading-relaxed text-pl-body"
        >
          A focused drill built from your coaching report. Respond to the buyer below the way
          you would on a real call.
        </motion.p>
      </section>

      <section className="flex flex-col gap-5 pb-20 sm:pb-28">
        <Reveal delay={0.1}>
          <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="pl-label flex items-center gap-2 text-pl-mute">
                <Sparkles className="h-3 w-3" />
                Practice progress
              </span>
              <span className="pl-mono text-[11px] text-pl-mute">Attempt {attempt} / 4</span>
            </div>
            <div className="mt-4 flex gap-1.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-[5px] flex-1 rounded-[1px] transition-colors duration-300 ${
                    index < attempt ? "bg-pl-ink" : "bg-pl-rule"
                  }`}
                />
              ))}
            </div>
            <p className="mt-3 text-[12px] text-pl-mute">{progressCaption}</p>
          </div>
        </Reveal>

        <Reveal delay={0.16} className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* ── SCENARIO ─────────────────────────────────────────── */}
          <article className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-pl-ink" />
              <h3 className="text-[15px] font-semibold text-pl-ink">Scenario</h3>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 text-pl-mute">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-pl-ink border-t-transparent" />
                <p className="text-[13.5px]">Generating your practice scenario…</p>
              </div>
            ) : error && !scenario ? (
              <p className="text-[13.5px] text-pl-body">{error}</p>
            ) : (
              <div className="rounded-[4px] border-l-2 border-pl-ink/70 bg-pl-raised p-5">
                <p className="pl-label text-pl-mute">Buyer</p>
                <p className="mt-3 text-[15px] leading-8 text-pl-ink">&ldquo;{scenario}&rdquo;</p>
              </div>
            )}
          </article>

          {/* ── ANSWER ───────────────────────────────────────────── */}
          <article className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <Target className="h-4 w-4 text-pl-ink" />
              <h3 id="practice-answer-heading" className="text-[15px] font-semibold text-pl-ink">
                Your answer
              </h3>
            </div>

            {status === "passed" && result?.type === "passed" ? (
              <div className="rounded-[4px] border-l-2 border-pl-gain/60 bg-pl-gain/10 p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-pl-gain" />
                  <h4 className="text-[15px] font-semibold text-pl-ink">Skill demonstrated</h4>
                </div>
                <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-pl-body">
                  {result.message}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button variant="ink" onClick={handleGenerateAnother}>
                    Generate another scenario
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/coaching/${sessionId}`)}
                  >
                    Back to coaching
                  </Button>
                </div>
              </div>
            ) : status === "failed-final" && result?.type === "failed-final" ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-[4px] border border-pl-rule-2 bg-pl-ink p-5">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-pl-signal" />
                    <h4 className="text-[15px] font-semibold text-pl-onink">Ideal answer</h4>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-pl-onink-2">
                    {result.idealAnswer}
                  </p>
                </div>

                <div className="rounded-[4px] border border-pl-rule-2 bg-pl-raised p-5">
                  <p className="pl-label text-pl-mute">Why this works</p>
                  <p className="mt-3 whitespace-pre-line text-[13.5px] leading-relaxed text-pl-body">
                    {result.explanation}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="ink" onClick={handleGenerateAnother}>
                    Generate another scenario
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/coaching/${sessionId}`)}
                  >
                    Back to coaching
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type how you'd respond to the buyer above..."
                  aria-labelledby="practice-answer-heading"
                  aria-label="Your answer"
                  className="min-h-[200px] w-full resize-none rounded-[4px] border border-pl-rule-2 bg-pl-white px-3.5 py-3 text-[14px] leading-relaxed text-pl-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-pl-mute/70 hover:border-pl-mute focus:border-pl-ink focus:shadow-[0_0_0_3px_rgba(14,26,22,0.08)]"
                />

                {status === "incorrect" && (
                  <div className="flex items-start gap-2.5 rounded-[4px] border border-pl-signal/40 bg-pl-signal/10 p-4 text-[13px] leading-relaxed text-pl-signal-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    That response didn&apos;t fully demonstrate the skill yet. Take another look
                    at the buyer&apos;s objection and try again.
                  </div>
                )}

                {error ? (
                  <div
                    role="alert"
                    className="flex gap-3 rounded-[4px] border border-pl-alert/35 bg-pl-alert/[0.07] px-4 py-3.5"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-pl-alert" />
                    <p className="text-[13px] leading-[1.45] text-pl-body">{error}</p>
                  </div>
                ) : null}

                <div>
                  <Button type="submit" variant="ink" loading={submitting}>
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <SendHorizonal className="h-3.5 w-3.5" />
                        Submit answer
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </article>
        </Reveal>
      </section>
    </AppShell>
  );
}
