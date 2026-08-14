"use client";

import { CountUp, SectionLabel } from "../ui/primitives";
import { PROGRESS_STATS, VOICES } from "../landing/data";

/* Pulled straight from the landing page's own numbers rather than
   invented for this page — a returning rep sees the same proof a new
   visitor does, just recast as "here's why you keep coming back." */
const LIFT = PROGRESS_STATS.find((s) => s.label.includes("lift"));
const REPS = PROGRESS_STATS.find((s) => s.label.includes("reps"));
const SESSION = PROGRESS_STATS.find((s) => s.label.includes("session length"));
const QUOTE = VOICES.find((v) => v.name === "Marcus T.") ?? VOICES[0];

/** Full panel — desktop. Dark ink ground mirrors the landing page's
    Progress section, deliberately distinct from signup's white buyer card. */
export default function ProofPanel() {
  return (
    <div className="pl-on-ink flex h-full flex-col justify-between rounded-[6px] bg-pl-ink p-8 sm:p-10">
      <div>
        <SectionLabel onInk>Why reps come back</SectionLabel>

        <p className="pl-mono mt-8 text-[clamp(2.75rem,4vw,3.75rem)] font-medium leading-none text-pl-onink">
          <CountUp value={LIFT.value} />
          <span className="text-pl-signal">{LIFT.suffix.trim()}</span>
        </p>
        <p className="mt-3 max-w-[28ch] text-[14px] leading-[1.55] text-pl-onink-2">
          average lift in objection-handling scores within a few weeks of
          practice.
        </p>

        <div className="mt-8 flex items-center gap-8 border-t border-pl-inkrule pt-6">
          <div>
            <p className="pl-mono text-[20px] font-medium leading-none text-pl-onink">
              <CountUp value={REPS.value} />
              {REPS.suffix.trim()}
            </p>
            <p className="mt-1.5 text-[11.5px] text-pl-onink-3">reps in practice</p>
          </div>
          <div>
            <p className="pl-mono text-[20px] font-medium leading-none text-pl-onink">
              <CountUp value={SESSION.value} />
              {SESSION.suffix}
            </p>
            <p className="mt-1.5 text-[11.5px] text-pl-onink-3">median session</p>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-pl-inkrule pt-7">
        <blockquote className="text-[14.5px] leading-[1.6] text-pl-onink">
          &ldquo;{QUOTE.text}&rdquo;
        </blockquote>
        <p className="mt-4 text-[13px] font-semibold text-pl-onink">{QUOTE.name}</p>
        <p className="text-[12px] text-pl-onink-3">{QUOTE.role}</p>
      </div>
    </div>
  );
}

/** Compact strip — mobile. Same headline number, none of the depth. */
export function ProofStrip() {
  return (
    <div className="flex items-center gap-4 rounded-[6px] border border-pl-rule-2 bg-pl-white px-4 py-3.5">
      <p className="pl-mono shrink-0 text-[22px] font-medium leading-none text-pl-ink">
        <CountUp value={LIFT.value} />
        <span className="text-pl-signal-2">{LIFT.suffix.trim()}</span>
      </p>
      <p className="text-[12px] leading-[1.4] text-pl-mute">
        average lift in objection-handling scores &mdash; from reps already
        practicing.
      </p>
    </div>
  );
}
