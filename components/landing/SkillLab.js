"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionLabel, SegMeter } from "../ui/primitives";
import { SECONDARY_FEATURES, SKILL_TABS } from "./data";

const EASE = [0.22, 0.9, 0.24, 1];

export default function SkillLab() {
  const [active, setActive] = useState(SKILL_TABS[0].id);
  const tab = SKILL_TABS.find((t) => t.id === active);

  return (
    <section id="skills" className="border-t border-pl-rule bg-pl-raised">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel>What a session gives you</SectionLabel>
          <h2 className="pl-display mt-6 max-w-[18ch] text-[clamp(2rem,4.6vw,3.4rem)] font-bold text-pl-ink">
            Four things practice has to do.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Selector */}
            <div
              role="tablist"
              aria-label="Session capabilities"
              className="flex flex-col lg:col-span-4"
            >
              {SKILL_TABS.map((t, i) => {
                const on = t.id === active;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    id={`skill-tab-${t.id}`}
                    aria-selected={on}
                    aria-controls={`skill-panel-${t.id}`}
                    type="button"
                    onClick={() => setActive(t.id)}
                    className="group relative border-t border-pl-rule py-5 text-left last:border-b"
                  >
                    {on && (
                      <motion.span
                        layoutId="skill-active"
                        className="absolute inset-x-0 -top-px h-[2px] bg-pl-ink"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    )}
                    <span className="flex items-baseline gap-3">
                      <span className="pl-mono text-[11px] tracking-[0.14em] text-pl-mute">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`pl-display-tight text-[20px] font-bold transition-colors sm:text-[22px] ${
                          on ? "text-pl-ink" : "text-pl-mute group-hover:text-pl-body"
                        }`}
                      >
                        {t.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Panel */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.id}
                  id={`skill-panel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`skill-tab-${tab.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.34, ease: EASE }}
                  className="grid grid-cols-1 gap-8 rounded-[6px] border border-pl-rule bg-pl-white p-6 sm:p-8 md:min-h-[440px] md:grid-cols-2 md:gap-10"
                >
                  <div className="flex flex-col">
                    <h3 className="pl-display-tight text-[24px] font-bold leading-[1.15] text-pl-ink sm:text-[27px]">
                      {tab.heading}
                    </h3>
                    <p className="mt-4 text-[14.5px] leading-[1.65] text-pl-body">
                      {tab.body}
                    </p>
                    {/* Anchored to the bottom so the figure holds the same
                        baseline whichever tab is open */}
                    <div className="mt-auto flex items-baseline gap-3 border-t border-pl-rule pt-6">
                      <span className="pl-mono text-[30px] font-medium leading-none text-pl-ink">
                        {tab.stat[0]}
                      </span>
                      <span className="text-[12.5px] text-pl-mute">{tab.stat[1]}</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <Visual id={tab.id} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* Everything else worth knowing, without another card grid */}
        <Reveal delay={0.12}>
          <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-8 border-t border-pl-rule pt-10 sm:grid-cols-2">
            {SECONDARY_FEATURES.map((f) => (
              <div key={f.title}>
                <h4 className="text-[15px] font-semibold text-pl-ink">{f.title}</h4>
                <p className="mt-2 max-w-[46ch] text-[13.5px] leading-[1.6] text-pl-body">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Panel visuals — each is built from the same parts the product uses
   (persona chips, transcript lines, segmented meters) so the section
   reads as four views of one system rather than four illustrations.
   ------------------------------------------------------------------ */

function Visual({ id }) {
  if (id === "personas") return <PersonasVisual />;
  if (id === "objections") return <ObjectionsVisual />;
  if (id === "scoring") return <ScoringVisual />;
  return <CoachingVisual />;
}

const PERSONAS = [
  { initials: "MR", name: "Michael Reyes", role: "VP Engineering", tag: "Skeptical", diff: 80 },
  { initials: "DA", name: "Dana Alvarez", role: "CFO", tag: "Budget-led", diff: 92 },
  { initials: "TO", name: "Tom Okafor", role: "Ops Manager", tag: "Went quiet", diff: 60 },
];

function PersonasVisual() {
  return (
    <div className="flex flex-col divide-y divide-pl-rule border border-pl-rule">
      {PERSONAS.map((p) => (
        <div key={p.initials} className="flex items-center gap-3.5 p-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] bg-pl-ink text-[12.5px] font-semibold text-pl-onink">
            {p.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold text-pl-ink">{p.name}</p>
            <p className="truncate text-[11.5px] text-pl-mute">{p.role}</p>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
            <span className="rounded-full border border-pl-rule px-2 py-[2px] text-[10px] font-medium text-pl-body">
              {p.tag}
            </span>
            <SegMeter value={p.diff} segments={10} className="h-2 w-16" />
          </div>
        </div>
      ))}
      <div className="p-3.5">
        <p className="pl-label text-pl-mute">+ 9 more personas</p>
      </div>
    </div>
  );
}

function ObjectionsVisual() {
  return (
    <div className="flex flex-col gap-3 border border-pl-rule p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="pl-label text-pl-mute">Dana</span>
          <span className="rounded-[3px] bg-pl-signal/20 px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-wider text-pl-signal-2">
            Price
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-[1.5] text-pl-body">
          You&apos;re 30% over what we set aside. I can&apos;t take that upstairs.
        </p>
      </div>

      <div className="border-l-2 border-pl-ink pl-3">
        <span className="pl-label text-pl-ink">You</span>
        <p className="mt-1.5 text-[13px] font-medium leading-[1.5] text-pl-ink">
          What did the budget get set against — last year&apos;s tooling, or the
          rollout you&apos;re planning?
        </p>
      </div>

      <div className="mt-1 flex items-center gap-2.5 border-t border-pl-rule pt-3">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pl-gain">
          <svg viewBox="0 0 10 8" className="h-2 w-2.5" fill="none" aria-hidden="true">
            <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.8" />
          </svg>
        </span>
        <span className="text-[12px] font-medium text-pl-ink">Objection held</span>
        <span className="pl-mono ml-auto text-[11px] text-pl-mute">+9 objections</span>
      </div>
    </div>
  );
}

const SCORE_ROWS = [
  { label: "Discovery", value: 90 },
  { label: "Objections", value: 64 },
  { label: "Value framing", value: 71 },
  { label: "Closing", value: 52 },
];

function ScoringVisual() {
  return (
    <div className="border border-pl-rule p-4">
      <div className="flex items-end justify-between border-b border-pl-rule pb-4">
        <div>
          <p className="pl-label text-pl-mute">Session score</p>
          <p className="pl-mono mt-2 text-[44px] font-medium leading-none text-pl-ink">
            82
          </p>
        </div>
        <div className="text-right">
          <p className="pl-mono text-[12px] font-medium text-pl-gain">+7 vs last</p>
          <p className="pl-mono mt-1 text-[11px] text-pl-mute">11:04 · 5 turns</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {SCORE_ROWS.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-[11.5px] font-medium text-pl-body">{r.label}</span>
              <span className="pl-mono text-[10.5px] text-pl-mute">{r.value}</span>
            </div>
            <SegMeter
              value={r.value}
              segments={18}
              tone={r.value >= 70 ? "gain" : "ink"}
              className="mt-1.5 h-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachingVisual() {
  return (
    <div className="border border-pl-rule">
      <div className="flex items-center justify-between border-b border-pl-rule px-4 py-3">
        <span className="pl-label text-pl-mute">Assigned drill</span>
        <span className="pl-mono text-[11px] text-pl-mute">3 reps</span>
      </div>

      <div className="border-l-2 border-pl-signal px-4 py-4">
        <p className="pl-label text-pl-signal-2">Lowest skill</p>
        <p className="pl-display-tight mt-2 text-[21px] font-bold text-pl-ink">
          Closing
        </p>
        <p className="mt-2 text-[12.5px] leading-[1.55] text-pl-body">
          You asked for the next step twice and softened it both times. The drill
          runs the same close until you stop apologizing for it.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-pl-rule px-4 py-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="pl-label text-pl-mute">Before</span>
            <span className="pl-mono text-[10.5px] text-pl-mute">52</span>
          </div>
          <SegMeter value={52} segments={18} target={78} className="mt-1.5 h-3" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <span className="pl-label text-pl-mute">After 3 drills</span>
            <span className="pl-mono text-[10.5px] font-medium text-pl-gain">78</span>
          </div>
          <SegMeter value={78} segments={18} tone="gain" className="mt-1.5 h-3" />
        </div>
      </div>
    </div>
  );
}
