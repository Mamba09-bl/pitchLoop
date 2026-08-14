"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountUp, Reveal, SectionLabel } from "../ui/primitives";
import { PROGRESS_SESSIONS, PROGRESS_STATS } from "./data";

const EASE = [0.22, 0.9, 0.24, 1];
const TARGET = 80;
const CHART_MAX = 100;

export default function ProgressSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const on = inView;
  const last = PROGRESS_SESSIONS.length - 1;

  return (
    <section
      id="progress"
      className="pl-on-ink bg-pl-ink text-pl-onink"
    >
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <SectionLabel onInk>Progress</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-12">
            <h2 className="pl-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold text-pl-onink lg:col-span-7">
              Watch the number move.
            </h2>
            <p className="max-w-[42ch] text-[15.5px] leading-[1.6] text-pl-onink-2 lg:col-span-5 lg:self-end">
              One rep&apos;s first twelve sessions. The line isn&apos;t clean —
              practice never is — but the direction is the point, and every step
              of it is traceable back to a transcript.
            </p>
          </div>
        </Reveal>

        {/* Session-by-session score */}
        <div ref={ref} className="mt-14 sm:mt-16">
          <div className="flex items-end justify-between">
            <span className="pl-label text-pl-onink-3">Session score</span>
            <span className="pl-label text-pl-onink-3">
              Sessions 1&ndash;{PROGRESS_SESSIONS.length}
            </span>
          </div>

          <div className="relative mt-8 h-[180px] border-b border-pl-inkrule sm:h-[260px]">
            {/* Target line — marigold, the same "work toward this" role it
                plays on every meter elsewhere on the page */}
            <div
              className="pointer-events-none absolute inset-x-0 flex items-center gap-3"
              style={{ bottom: `${(TARGET / CHART_MAX) * 100}%` }}
            >
              <span className="pl-mono shrink-0 text-[10px] text-pl-signal">
                target {TARGET}
              </span>
              <div className="h-px flex-1 border-t border-dashed border-pl-signal/45" />
            </div>

            <div className="flex h-full items-end gap-1.5 sm:gap-3">
              {PROGRESS_SESSIONS.map((v, i) => {
                const marked = i === 0 || i === last;
                return (
                  <div
                    key={i}
                    className="relative flex h-full flex-1 items-end justify-center"
                  >
                    <motion.div
                      className={`w-full max-w-[40px] origin-bottom rounded-t-[2px] ${
                        i === last ? "bg-pl-gain" : "bg-pl-onink-3"
                      }`}
                      style={{ height: `${(v / CHART_MAX) * 100}%` }}
                      initial={{ scaleY: 0 }}
                      animate={on ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.7, ease: EASE, delay: i * 0.055 }}
                    />
                    {marked && (
                      <motion.span
                        className={`pl-mono absolute left-1/2 -translate-x-1/2 text-[12px] font-medium ${
                          i === last ? "text-pl-gain" : "text-pl-onink-2"
                        }`}
                        style={{ bottom: `calc(${(v / CHART_MAX) * 100}% + 8px)` }}
                        initial={{ opacity: 0, y: 6 }}
                        animate={on ? { opacity: 1, y: 0 } : {}}
                        transition={{
                          duration: 0.5,
                          ease: EASE,
                          delay: i * 0.055 + 0.5,
                        }}
                      >
                        {v}
                      </motion.span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="pl-mono text-[10.5px] text-pl-onink-3">first session</span>
            <span className="pl-mono text-[10.5px] text-pl-onink-3">six weeks later</span>
          </div>
        </div>

        {/* Aggregate proof */}
        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-pl-inkrule pt-10 sm:grid-cols-3">
          {PROGRESS_STATS.map((s) => (
            <div key={s.label}>
              <p className="pl-mono text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none text-pl-onink">
                <CountUp value={s.value} />
                {/* symbols carry full weight; unit words sit back */}
                <span
                  className={
                    s.suffix.trim().length > 1
                      ? "ml-2 text-[0.42em] text-pl-signal"
                      : "text-pl-signal"
                  }
                >
                  {s.suffix.trim()}
                </span>
              </p>
              <p className="mt-3 max-w-[24ch] text-[13px] leading-[1.5] text-pl-onink-2">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
