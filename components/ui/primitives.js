"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
// `useReducedMotion` is used only inside effects (CountUp), never to pick
// what gets rendered — see the note above Reveal.

/* ------------------------------------------------------------------
   Motion primitives
   ------------------------------------------------------------------ */

const EASE = [0.22, 0.9, 0.24, 1];

/* Nothing here branches its rendered output on `useReducedMotion()` —
   that would produce different server and client markup and break
   hydration. Reduced motion is handled by MotionProvider and CSS. */

/** Single restrained scroll reveal used everywhere on the page. */
export function Reveal({ children, delay = 0, y = 18, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Headline reveal: lines rise out from behind a mask. */
export function MaskLines({ lines, className = "", delay = 0, stagger = 0.09 }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <motion.span
            className="block"
            initial={{ y: "108%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.95,
              ease: EASE,
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Counts to `value` when scrolled into view. Used for score figures. */
export function CountUp({ value, duration = 1100, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    // Reduced motion runs the same loop with a zero duration, so it lands on
    // the value in one frame rather than branching the render.
    const ms = reduced ? 0 : duration;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
      // ease-out cubic: fast commitment, soft landing
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("en-US")}
    </span>
  );
}

/* ------------------------------------------------------------------
   Segmented meter — the page's signature element.

   A broadcast level meter rather than a rounded progress bar: discrete
   ticks, so a score reads as a measurement instead of a decoration.
   `target` puts a marigold marker at the level being coached toward.
   ------------------------------------------------------------------ */

const METER_TONES = {
  ink: "bg-pl-ink",
  gain: "bg-pl-gain",
  signal: "bg-pl-signal",
  onink: "bg-pl-onink",
};

const METER_TRACKS = {
  light: "bg-pl-rule",
  ink: "bg-pl-onink-3",
};

export function SegMeter({
  value,
  segments = 20,
  tone = "ink",
  track = "light",
  target = null,
  animate = true,
  className = "",
}) {
  const filled = Math.round((value / 100) * segments);
  const targetIndex =
    target === null ? -1 : Math.min(segments - 1, Math.round((target / 100) * segments) - 1);

  return (
    <div
      className={`flex items-end gap-[2px] ${className}`}
      role="meter"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: segments }).map((_, i) => {
        const on = i < filled;
        const isTarget = i === targetIndex;
        return (
          <span
            key={i}
            className={`pl-seg h-full w-full max-w-[5px] flex-1 origin-bottom rounded-[1px] ${
              isTarget
                ? "bg-pl-signal"
                : on
                  ? METER_TONES[tone]
                  : METER_TRACKS[track]
            }`}
            style={{
              transform: isTarget || on ? "scaleY(1)" : "scaleY(0.45)",
              transition: animate
                ? `transform 320ms cubic-bezier(0.22,0.9,0.24,1) ${i * 14}ms, background-color 260ms ease ${i * 14}ms`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

/** Shared 0-100 score → tone mapping, used anywhere a score needs a
    color and a one-word read (voice feedback, history rows). Reuses the
    same ink/gain/signal vocabulary as everything else — signal marks
    "the thing to work on," which a low score literally is. */
export function scoreTone(value) {
  if (value >= 75) return { tone: "gain", label: "Strong" };
  if (value >= 50) return { tone: "ink", label: "Solid" };
  return { tone: "signal", label: "Needs work" };
}

const RING_COLORS = {
  gain: "var(--color-pl-gain)",
  ink: "var(--color-pl-ink)",
  signal: "var(--color-pl-signal-2)",
};

/** A ring, not a gauge — the hero score gets a single deliberate mark
    instead of a dashboard gauge cluster. */
export function ScoreRing({ value, size = 128, strokeWidth = 7, className = "" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const { tone } = scoreTone(value);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-pl-rule)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={RING_COLORS[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - Math.min(100, Math.max(0, value)) / 100) }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="pl-mono text-[30px] font-semibold leading-none text-pl-ink">
          <CountUp value={value} />
        </span>
        <span className="pl-label mt-1.5 text-pl-mute">/ 100</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Chrome
   ------------------------------------------------------------------ */

/** Mono eyebrow with a rule — the page's section marker. */
export function SectionLabel({ children, onInk = false }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-[7px] w-[7px] shrink-0 rounded-[1px] ${
          onInk ? "bg-pl-signal" : "bg-pl-ink"
        }`}
      />
      <span className={`pl-label ${onInk ? "text-pl-onink-2" : "text-pl-mute"}`}>
        {children}
      </span>
    </div>
  );
}

/** Loop mark: a circuit that returns to where it started. */
export function LoopMark({ className = "h-4 w-7" }) {
  return (
    <svg viewBox="0 0 28 16" fill="none" className={className} aria-hidden="true">
      <rect
        x="1"
        y="1"
        width="26"
        height="14"
        rx="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="20" cy="8" r="3.2" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "", onInk = false }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LoopMark className={onInk ? "h-[15px] w-[26px] text-pl-signal" : "h-[15px] w-[26px] text-pl-ink"} />
      <span className="pl-display-tight text-[19px] font-bold">Pitchloop</span>
    </span>
  );
}

/* ------------------------------------------------------------------
   Buttons — ink on light ground, marigold on ink ground. No glow,
   no gradient; the motion is the arrow committing forward.
   ------------------------------------------------------------------ */

const BUTTON_BASE =
  "group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[14px] font-semibold transition-colors duration-200";

const BUTTON_VARIANTS = {
  ink: "bg-pl-ink text-pl-onink hover:bg-pl-ink-2",
  signal: "bg-pl-signal text-pl-ink hover:bg-[#eeae2b]",
  outline:
    "border border-pl-rule-2 text-pl-ink hover:border-pl-ink hover:bg-pl-ink hover:text-pl-onink",
  ghostInk:
    "border border-pl-inkrule text-pl-onink hover:border-pl-onink-2 hover:bg-pl-onink hover:text-pl-ink",
};

export function ActionLink({ href, variant = "ink", children, arrow = true, className = "" }) {
  const isHash = typeof href === "string" && href.startsWith("#");
  const inner = (
    <>
      {children}
      {arrow && <Arrow />}
    </>
  );
  const cls = `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`;

  if (isHash) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden="true"
      className="h-3 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
    >
      <path d="M0 6h14M9.5 1.5 14 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Small spinner for inline loading states — same mark used on the
    signup/login submit buttons, lifted out so every async action across
    the app spins the same way. */
export function Spinner({ className = "h-3.5 w-3.5 border-pl-onink-3 border-t-pl-onink" }) {
  return (
    <motion.span
      className={`shrink-0 rounded-full border-[1.5px] ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

/** A real <button> in the same visual language as ActionLink, for actions
    that aren't navigation — form submits, async handlers. */
export function Button({
  type = "button",
  variant = "ink",
  onClick,
  disabled = false,
  loading = false,
  arrow = false,
  children,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-[14px] font-semibold transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {loading && (
        <Spinner
          className={
            variant === "outline"
              ? "h-3.5 w-3.5 border-pl-rule-2 border-t-pl-ink"
              : "h-3.5 w-3.5 border-pl-onink-3 border-t-pl-onink"
          }
        />
      )}
      {children}
      {!loading && arrow && <Arrow />}
    </button>
  );
}
