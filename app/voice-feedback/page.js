"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Sparkles,
  Target,
  ThumbsUp,
  MessageSquareQuote,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";

const mockVoiceCallFeedback = {
  callOutcome: {
    goal: "Book a 15-minute demo",
    achieved: true,
    reason:
      "You established relevance quickly and handled the buyer's integration concern with confidence.",
  },
  overallScore: {
    score: 78,
    label: "Good Call",
  },
  skillBreakdown: {
    openingAndRelevance: 84,
    clarityAndConciseness: 76,
    objectionHandling: 81,
    goalAchievement: 72,
  },
  strengths: [
    {
      title: "Strong value framing",
      explanation:
        "You made the product's value easy to grasp without overloading the buyer with details.",
    },
    {
      title: "Calm objection handling",
      explanation:
        "You stayed composed and answered the integration concern in a way that kept momentum.",
    },
  ],
  improvements: [
    {
      mistake: "You jumped to pricing too early",
      whyItMatters:
        "The buyer still needed more context around fit, so pricing felt premature and reduced trust.",
      howToImprove:
        "Ask one more discovery question about urgency and implementation before introducing pricing.",
    },
    {
      mistake: "You did not close the next step explicitly",
      whyItMatters:
        "A clear next step helps the buyer move forward instead of leaving the meeting open-ended.",
      howToImprove:
        "End with a simple confirmation such as, 'Would you be open to a 15-minute follow-up next week?'",
    },
  ],
  conversationMoments: [
    {
      buyerMessage:
        "We are already using a tool for reporting, so I am not sure this adds much.",
      sellerAnswer:
        "That is fair. Our platform is built to reduce the manual work your team is doing today.",
      betterAnswer:
        "That makes sense. What part of reporting is currently taking the most time for your team, and how are you handling that today?",
    },
    {
      buyerMessage: "How quickly could we get this implemented?",
      sellerAnswer:
        "Implementation is usually smooth, and we can help with onboarding.",
      betterAnswer:
        "Typically we can get teams live in a couple of weeks, but the timeline depends on your current setup and data sources.",
    },
  ],
  nextFocus: {
    title: "Ask sharper discovery questions",
    explanation:
      "Use the next call to uncover urgency, timeline, and current workflow friction before pitching solutions.",
  },
};

const skillLabels = [
  { key: "openingAndRelevance", label: "Opening & Relevance" },
  { key: "clarityAndConciseness", label: "Clarity & Conciseness" },
  { key: "objectionHandling", label: "Objection Handling" },
  { key: "goalAchievement", label: "Goal Achievement" },
];

function ScoreBadge({ score }) {
  if (score >= 80) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
        Strong
      </span>
    );
  }

  if (score >= 60) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
        Solid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
      Needs work
    </span>
  );
}

export default function VoiceCallFeedbackPage() {
  const router = useRouter();

  const feedback = useMemo(() => mockVoiceCallFeedback, []);

  return (
    <main className="min-h-screen bg-[#060816] text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/70 via-slate-900 to-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_80px_rgba(15,23,42,0.5)]">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300/70">
                  Voice Call Feedback
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-white">
                  Call review overview
                </h1>
              </div>
              <button
                onClick={() => router.push("/history")}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                <Target className="mr-2 h-4 w-4 text-violet-300" />
                View history
              </button>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div className="space-y-5">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300/70">
                  Call outcome
                </p>
                <div className="mt-3 flex items-start gap-3">
                  {feedback.callOutcome.achieved ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />
                  ) : (
                    <CircleAlert className="mt-0.5 h-5 w-5 text-amber-400" />
                  )}
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {feedback.callOutcome.goal}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {feedback.callOutcome.achieved
                        ? "Achieved"
                        : "Not achieved"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {feedback.callOutcome.reason}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      Overall score
                    </p>
                    <p className="mt-2 text-5xl font-semibold text-white">
                      {feedback.overallScore.score}
                      <span className="ml-2 text-xl text-slate-400">/100</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-300">
                      {feedback.overallScore.label}
                    </p>
                    <div className="mt-2">
                      <ScoreBadge score={feedback.overallScore.score} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Skill breakdown
                </p>
              </div>
              <div className="mt-4 space-y-4">
                {skillLabels.map((skill) => {
                  const value = feedback.skillBreakdown[skill.key];
                  return (
                    <div key={skill.key}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm text-slate-300">{skill.label}</p>
                        <p className="text-sm font-semibold text-white">
                          {value}/100
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">
                What you did well
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {feedback.strengths.map((strength, index) => (
                <div
                  key={`${strength.title}-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <p className="text-sm font-semibold text-emerald-200">
                    {strength.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {strength.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="flex items-center gap-2">
              <CircleAlert className="h-4 w-4 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">
                What you need to improve
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {feedback.improvements.map((item, index) => (
                <div
                  key={`${item.mistake}-${index}`}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <p className="text-sm font-semibold text-amber-200">
                    {item.mistake}
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-100">
                        Why it matters:
                      </span>{" "}
                      {item.whyItMatters}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-100">
                        How to improve:
                      </span>{" "}
                      {item.howToImprove}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">
              Your answer vs better answer
            </h2>
          </div>
          <div className="mt-5 space-y-4">
            {feedback.conversationMoments.map((moment, index) => (
              <div
                key={`${moment.buyerMessage}-${index}`}
                className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 lg:grid-cols-3"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Buyer asked
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {moment.buyerMessage}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    You answered
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {moment.sellerAnswer}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Better answer
                  </p>
                  <p className="mt-2 text-sm leading-6 text-violet-200">
                    {moment.betterAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/15 to-fuchsia-500/10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-violet-300/70">
                One focus for your next call
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {feedback.nextFocus.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                {feedback.nextFocus.explanation}
              </p>
            </div>
            <button
              onClick={() => router.push("/voice")}
              className="inline-flex items-center justify-center rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Play className="mr-2 h-4 w-4" />
              Try Again
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
