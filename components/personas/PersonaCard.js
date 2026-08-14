"use client";

import { motion } from "framer-motion";
import { Reveal, SegMeter } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

/* Difficulty borrows the same tone vocabulary as the rest of the product:
   signal marks the thing you have to stretch for, gain marks what's
   already comfortable, ink sits neutral in between. */
function difficultyTone(level) {
  const l = (level || "").toLowerCase();
  if (l === "hard") return { dot: "bg-pl-signal", text: "text-pl-signal-2" };
  if (l === "easy") return { dot: "bg-pl-gain", text: "text-pl-gain" };
  return { dot: "bg-pl-ink", text: "text-pl-body" };
}

export default function PersonaCard({ persona, index = 0, onCall }) {
  const tone = difficultyTone(persona.difficulty);

  return (
    <Reveal delay={Math.min(index, 8) * 0.06} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white transition-shadow duration-300 hover:shadow-[0_1px_0_rgba(14,26,22,0.04),0_28px_60px_-32px_rgba(14,26,22,0.4)]">
        {/* Header strip — same grammar as the session console on /signup */}
        <div className="flex items-center justify-between gap-3 border-b border-pl-rule bg-pl-raised px-5 py-2.5">
          <span className="pl-label truncate text-pl-mute">{persona.industry}</span>
          <span className="flex shrink-0 items-center gap-2">
            <span className={`h-[6px] w-[6px] shrink-0 rounded-[1px] ${tone.dot}`} />
            <span className={`pl-label ${tone.text}`}>{persona.difficulty}</span>
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] bg-pl-ground">
              <img
                src={persona.image}
                alt={persona.name}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-[16px] font-semibold leading-tight text-pl-ink">
                {persona.name}
              </h3>
              <p className="mt-1 truncate text-[12.5px] text-pl-mute">
                {persona.job} &middot; {persona.company}
              </p>
            </div>
          </div>

          <p className="mt-4 line-clamp-2 text-[13.5px] leading-[1.55] text-pl-body">
            {persona.description}
          </p>

          <span className="mt-4 inline-flex w-fit items-center rounded-full border border-pl-rule px-2.5 py-[3px] text-[10.5px] font-medium text-pl-body">
            {persona.personality}
          </span>

          <div className="mt-5 flex flex-col gap-2.5 border-t border-pl-rule pt-4">
            <MeterRow label="Interest" value={persona.willingnessToBuy} />
            <MeterRow label="Trust" value={persona.trustLevel} />
          </div>
        </div>

        {/* Actions — Call is the only path in */}
        <div className="border-t border-pl-rule bg-pl-raised p-3">
          <motion.button
            type="button"
            onClick={onCall}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: EASE }}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-pl-ink text-[13px] font-semibold text-pl-onink transition-colors duration-200 hover:bg-pl-ink-2"
          >
            <PhoneIcon />
            Call
          </motion.button>
        </div>
      </article>
    </Reveal>
  );
}

function MeterRow({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="pl-label w-[64px] shrink-0 whitespace-nowrap text-pl-mute">{label}</span>
      <SegMeter value={value * 10} segments={12} className="h-3 w-[90px] shrink-0" />
      <span className="pl-mono ml-auto text-[11px] font-medium text-pl-ink">{value}/10</span>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M3.4 2.2 5.6 4.4c.3.3.3.8-.1 1.1l-1.1 1c-.2.2-.2.5-.1.7 1 1.9 2.5 3.4 4.4 4.4.2.1.5.1.7-.1l1-1.1c.3-.4.8-.4 1.1-.1l2.2 2.2c.3.3.3.7 0 1-1 1-2.6 1.5-4.1.9-2.8-1-5.4-3.6-6.4-6.4-.6-1.5-.1-3.1.9-4.1.3-.3.7-.3 1 0Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
