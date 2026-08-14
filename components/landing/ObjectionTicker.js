"use client";

import { OBJECTIONS } from "./data";

/* A thin ink band between the hero and the page proper. It shows the
   product's raw material — the things buyers actually say — rather than
   a row of borrowed customer logos. */
export default function ObjectionTicker() {
  const run = [...OBJECTIONS, ...OBJECTIONS];

  return (
    <section
      aria-label="Objections in the Pitchloop library"
      className="pl-on-ink border-y border-pl-ink bg-pl-ink text-pl-onink"
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        <div className="flex shrink-0 items-center gap-3 border-b border-pl-inkrule px-5 py-3.5 sm:border-b-0 sm:border-r sm:px-8">
          <span className="pl-label text-pl-onink">Objections in rotation</span>
          <span className="pl-mono text-[11px] font-medium text-pl-signal">142</span>
        </div>

        <div className="pl-ticker relative min-w-0 flex-1 overflow-hidden py-3.5">
          <div className="pl-ticker-track flex w-max items-center">
            {run.map((o, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                <span className="pl-mono px-5 text-[12.5px] text-pl-onink-2 sm:px-7">
                  &ldquo;{o}&rdquo;
                </span>
                <span className="h-[3px] w-[3px] rotate-45 bg-pl-signal" />
              </span>
            ))}
          </div>
          {/* soften the band edges so phrases enter and leave rather than clip */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-pl-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-pl-ink to-transparent" />
        </div>
      </div>
    </section>
  );
}
