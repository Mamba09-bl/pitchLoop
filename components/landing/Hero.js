"use client";

import { motion } from "framer-motion";
import { ActionLink, MaskLines } from "../ui/primitives";
import SessionConsole from "./SessionConsole";

const EASE = [0.22, 0.9, 0.24, 1];

export default function Hero() {
  const fade = (delay) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
      <div className="grid grid-cols-1 items-end gap-x-10 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div {...fade(0)} className="flex items-center gap-3">
            <span className="pl-label text-pl-mute">Sales practice on demand</span>
            <span className="h-px w-10 bg-pl-rule-2" />
          </motion.div>

          {/* Sized so "before the call." always holds one line inside the
              7-column measure — at 8vw it broke to three lines on laptops. */}
          <h1 className="pl-display mt-6 text-[clamp(2.6rem,6.2vw,4.6rem)] font-bold text-pl-ink">
            <MaskLines lines={["Run the call", "before the call."]} delay={0.1} />
          </h1>
        </div>

        <motion.div {...fade(0.45)} className="lg:col-span-5 lg:pb-2">
          <p className="max-w-[46ch] text-[16px] leading-[1.6] text-pl-body sm:text-[17px]">
            Practice with AI buyers who push back, stall and haggle like the
            people already on your pipeline. Every session ends with a score,
            the moments that cost you, and one drill for the skill that&apos;s
            slipping.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ActionLink href="/signup">Start practicing free</ActionLink>
            <ActionLink href="#how-it-works" variant="outline" arrow={false}>
              See how a session runs
            </ActionLink>
          </div>

          <p className="pl-mono mt-5 text-[11.5px] text-pl-mute">
            Free forever plan · No card required
          </p>
        </motion.div>
      </div>

      <motion.div
        className="mt-12 sm:mt-16"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE, delay: 0.5 }}
      >
        <SessionConsole />
      </motion.div>
    </section>
  );
}
