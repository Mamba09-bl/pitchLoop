"use client";

import { Lock } from "lucide-react";
import { SectionLabel } from "../ui/primitives";

const STAGES = [
  {
    n: "01",
    title: "Call 1",
    desc: "Practice the conversation. You'll get feedback the moment it ends.",
    locked: false,
  },
  {
    n: "02",
    title: "Call 2",
    desc: "Practice again and apply what you learned from Call 1.",
    locked: false,
  },
  {
    n: "03",
    title: "Coaching",
    desc: "Unlocks once both calls are complete, with a personalized breakdown.",
    locked: true,
  },
];

/** Explains the session structure before the user commits to a call — not
    a warning, just the rules of the room. Mirrors the numbered-stage
    pattern from the landing page's "How it works" (TheLoop), scaled down
    for a supporting panel rather than a hero section. */
export default function SessionRulesPanel() {
  return (
    <section className="rounded-[6px] border border-pl-rule-2 bg-pl-white p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <SectionLabel>Your practice session</SectionLabel>
        <div className="flex items-center gap-5">
          <Stat value="2" label="Calls / session" />
          <Stat value="2" label="Sessions / 24h" />
        </div>
      </div>

      <div className="relative mt-7 grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-6">
        <span className="absolute left-0 right-0 top-4 hidden h-px bg-pl-rule sm:block" />
        {STAGES.map((stage) => (
          <div key={stage.n} className="relative">
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold ${
                stage.locked
                  ? "border border-pl-rule-2 bg-pl-raised text-pl-mute"
                  : "bg-pl-ink text-pl-onink"
              }`}
            >
              {stage.locked ? <Lock className="h-3.5 w-3.5" /> : stage.n}
            </span>
            <h3 className="pl-display-tight mt-3 text-[15px] font-bold text-pl-ink">
              {stage.title}
            </h3>
            <p className="mt-1.5 max-w-[32ch] text-[12.5px] leading-relaxed text-pl-body">
              {stage.desc}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-pl-rule pt-4 text-[11.5px] leading-relaxed text-pl-mute">
        Heads up — a call counts as soon as you start it, even if you end early or stay
        silent.
      </p>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="pl-mono text-[15px] font-semibold text-pl-ink">{value}</span>
      <span className="pl-label text-pl-mute">{label}</span>
    </div>
  );
}
