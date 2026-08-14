"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal, SectionLabel } from "../ui/primitives";
import { LOOP_STEPS } from "./data";

const EASE = [0.22, 0.9, 0.24, 1];

export default function TheLoop() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const on = inView;

  return (
    <section id="how-it-works" className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel>How it works</SectionLabel>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-12">
          <h2 className="pl-display text-[clamp(2rem,4.6vw,3.4rem)] font-bold text-pl-ink lg:col-span-7">
            Four moves, then run it back.
          </h2>
          <p className="max-w-[42ch] text-[15.5px] leading-[1.6] text-pl-body lg:col-span-5 lg:self-end">
            A session is a closed circuit. You practice, the call gets scored,
            the weakest skill becomes the next drill — and the drill sends you
            back in. That circuit is the whole product.
          </p>
        </div>
      </Reveal>

      <div ref={ref} className="mt-16 sm:mt-20">
        {/* Desktop: the four stops sit on one track */}
        <div className="relative hidden md:block">
          <motion.div
            className="absolute left-0 right-0 top-[6px] h-px origin-left bg-pl-rule-2"
            initial={{ scaleX: 0 }}
            animate={on ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
          />

          <div className="grid grid-cols-4 gap-8 lg:gap-12">
            {LOOP_STEPS.map((s, i) => (
              <div key={s.index} className="relative">
                <motion.span
                  className="absolute left-0 top-0 block h-[13px] w-[13px] rounded-full border-2 border-pl-ink bg-pl-ground"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={on ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.35 + i * 0.13 }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={on ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.45 + i * 0.13 }}
                  className="pt-9"
                >
                  <StepBody step={s} />
                </motion.div>
              </div>
            ))}
          </div>

          {/* The return: the track curls back to step 01 */}
          <div className="relative mt-9 h-[78px]">
            <svg
              viewBox="0 0 12 10"
              className="absolute -left-[1px] -top-[1px] h-2.5 w-3 text-pl-rule-2"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 9L6 1l5 8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <svg
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                d="M996 0 V60 Q996 96 960 96 H40 Q4 96 4 60 V0"
                fill="none"
                stroke="var(--color-pl-rule-2)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="pl-loop-pulse"
                d="M996 0 V60 Q996 96 960 96 H40 Q4 96 4 60 V0"
                fill="none"
                stroke="var(--color-pl-signal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="70 1000"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <span className="pl-label absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-pl-ground px-4 text-pl-mute">
              Run it back
            </span>
          </div>
        </div>

        {/* Mobile: the same four stops, stacked on a rule */}
        <div className="md:hidden">
          <div className="border-l border-pl-rule-2 pl-6">
            {LOOP_STEPS.map((s, i) => (
              <div key={s.index} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[27px] top-[3px] block h-[11px] w-[11px] rounded-full border-2 border-pl-ink bg-pl-ground" />
                <StepBody step={s} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 pl-6">
            <span className="h-[1px] w-6 bg-pl-signal" />
            <span className="pl-label text-pl-mute">Run it back</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepBody({ step }) {
  return (
    <>
      <span className="pl-mono text-[11px] font-medium tracking-[0.14em] text-pl-mute">
        {step.index}
      </span>
      <h3 className="pl-display-tight mt-2 text-[19px] font-bold text-pl-ink">
        {step.title}
      </h3>
      <p className="mt-2.5 max-w-[34ch] text-[13.5px] leading-[1.6] text-pl-body">
        {step.desc}
      </p>
    </>
  );
}
