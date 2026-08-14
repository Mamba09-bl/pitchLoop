"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SegMeter } from "../ui/primitives";
import { SESSION_BEATS, SESSION_SKILLS } from "./data";

const BEAT_MS = 2600;
const RESTART_MS = 4200;
const STAMPS = ["00:08", "00:19", "00:27", "00:38", "00:51"];
const LAST = SESSION_BEATS.length - 1;

/** Tweens the displayed score whenever the beat changes. */
function useRollingNumber(target, reduced) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const ms = reduced ? 0 : 700;
    const start = performance.now();
    const origin = from.current;
    const delta = target - origin;
    let frame;
    const tick = (now) => {
      const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
      setShown(Math.round(origin + delta * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced]);

  return shown;
}

export default function SessionConsole() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  // Plays the exchange through, holds on the finished scorecard, restarts.
  // Reduced motion skips straight to the finished session and stays there.
  useEffect(() => {
    if (reduced && step === LAST) return;
    const delay = reduced ? 0 : step === LAST ? RESTART_MS : BEAT_MS;
    const id = setTimeout(
      () => setStep((s) => (reduced ? LAST : s === LAST ? 0 : s + 1)),
      delay,
    );
    return () => clearTimeout(id);
  }, [step, reduced]);

  const beat = SESSION_BEATS[step];
  const score = useRollingNumber(beat.score, reduced);
  const speaking = beat.who;
  const finished = step === LAST;

  return (
    <div className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white shadow-[0_1px_0_rgba(14,26,22,0.04),0_24px_60px_-40px_rgba(14,26,22,0.45)]">
      {/* Console header */}
      <div className="pl-on-ink flex items-center justify-between gap-4 bg-pl-ink px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-[7px] w-[7px]">
            <span className="absolute inset-0 rounded-full bg-pl-gain" />
            <span className="pl-ping absolute inset-0 rounded-full bg-pl-gain" />
          </span>
          <span className="pl-label text-pl-onink">Live session</span>
          <span className="pl-label hidden text-pl-onink-3 sm:inline">
            Discovery call
          </span>
        </div>
        <span className="pl-mono text-[11px] tracking-wider text-pl-onink-2">
          {STAMPS[step]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[218px_minmax(0,1fr)_248px]">
        {/* ---------------- Buyer ---------------- */}
        <div className="flex gap-4 border-b border-pl-rule p-4 sm:p-5 lg:flex-col lg:gap-0 lg:border-b-0 lg:border-r">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-pl-ink text-[15px] font-semibold text-pl-onink lg:h-14 lg:w-14 lg:text-[17px]">
            MR
          </div>
          <div className="min-w-0 flex-1 lg:mt-4">
            <p className="pl-label text-pl-mute">Buyer persona</p>
            <p className="mt-2 text-[15px] font-semibold leading-tight text-pl-ink">
              Michael Reyes
            </p>
            <p className="mt-0.5 text-[12.5px] text-pl-mute">VP Engineering · 240 seats</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Skeptical", "Has incumbent", "Low patience"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-pl-rule px-2 py-[3px] text-[10.5px] font-medium text-pl-body"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden lg:mt-auto lg:block lg:pt-6">
            <div className="flex items-center justify-between">
              <span className="pl-label text-pl-mute">Difficulty</span>
              <span className="pl-mono text-[11px] font-medium text-pl-ink">4 / 5</span>
            </div>
            <SegMeter value={80} segments={14} className="mt-2 h-3.5" />
          </div>
        </div>

        {/* ---------------- Transcript ---------------- */}
        <div className="flex min-h-[300px] flex-col border-b border-pl-rule p-4 sm:p-5 lg:min-h-[356px] lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <span className="pl-label text-pl-mute">Transcript</span>
            <span className="pl-label text-pl-mute">Turn {step + 1}/5</span>
          </div>

          <div className="mt-4 flex flex-1 flex-col gap-3.5">
            <AnimatePresence initial={false}>
              {SESSION_BEATS.slice(0, step + 1).map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.45, ease: [0.22, 0.9, 0.24, 1] }}
                  className={b.who === "rep" ? "border-l-2 border-pl-ink pl-3" : ""}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`pl-label ${
                        b.who === "rep" ? "text-pl-ink" : "text-pl-mute"
                      }`}
                    >
                      {b.who === "rep" ? "You" : "Michael"}
                    </span>
                    <span className="pl-mono text-[10px] text-pl-mute">{STAMPS[i]}</span>
                    {i === 0 && (
                      <span className="rounded-[3px] bg-pl-signal/20 px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-wider text-pl-signal-2">
                        Objection
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1.5 text-[13.5px] leading-[1.5] ${
                      b.who === "rep" ? "font-medium text-pl-ink" : "text-pl-body"
                    }`}
                  >
                    {b.text}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Voice level — which side of the call is talking right now */}
          <div className="mt-5 flex items-center gap-3 border-t border-pl-rule pt-3.5">
            <div className="flex h-4 items-center gap-[2px]">
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className={`pl-level-bar h-full w-[2px] rounded-[1px] ${
                    speaking === "rep" ? "bg-pl-ink" : "bg-pl-rule-2"
                  }`}
                  style={{
                    animationDelay: `${(i % 7) * 110}ms`,
                    animationDuration: `${760 + (i % 5) * 90}ms`,
                  }}
                />
              ))}
            </div>
            <span className="pl-label text-pl-mute">
              {speaking === "rep" ? "You're speaking" : "Michael is speaking"}
            </span>
          </div>
        </div>

        {/* ---------------- Live read ---------------- */}
        <div className="flex flex-col p-4 sm:p-5">
          <span className="pl-label text-pl-mute">Live score</span>

          <div className="mt-3 flex items-end gap-2">
            <span className="pl-mono text-[46px] font-medium leading-none tracking-tight text-pl-ink tabular-nums">
              {score}
            </span>
            <span className="pl-mono mb-1.5 text-[13px] text-pl-mute">/100</span>
            {step > 0 && (
              <span className="pl-mono mb-1.5 ml-auto text-[12px] font-medium text-pl-gain">
                +{beat.score - SESSION_BEATS[step - 1].score}
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3.5">
            {SESSION_SKILLS.map((s) => (
              <div key={s.key}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11.5px] font-medium text-pl-body">{s.label}</span>
                  <span className="pl-mono text-[10.5px] text-pl-mute tabular-nums">
                    {beat.skills[s.key]}
                  </span>
                </div>
                <SegMeter
                  value={beat.skills[s.key]}
                  segments={16}
                  tone={beat.skills[s.key] >= 70 ? "gain" : "ink"}
                  className="mt-1.5 h-3"
                />
              </div>
            ))}
          </div>

          {/* Coaching note lands only once the session has run its course */}
          <div className="mt-auto pt-5">
            <AnimatePresence mode="wait">
              {finished ? (
                <motion.div
                  key="note"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 0.9, 0.24, 1] }}
                  className="border-l-2 border-pl-signal bg-pl-signal/10 px-3 py-2.5"
                >
                  <p className="pl-label text-pl-signal-2">Work on this</p>
                  <p className="mt-1.5 text-[12px] leading-[1.45] text-pl-body">
                    You traded a question for a discount at turn 4. Drill:
                    <span className="font-semibold text-pl-ink"> hold price, ask again.</span>
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pl-label text-pl-mute"
                >
                  Scoring in progress
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
