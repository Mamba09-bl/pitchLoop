"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 0.9, 0.24, 1];

const TONES = {
  neutral: "border-pl-rule-2 bg-pl-raised text-pl-mute",
  alert: "border-pl-alert/30 bg-pl-alert/[0.08] text-pl-alert",
  gain: "border-pl-gain/30 bg-pl-gain/10 text-pl-gain",
};

/** Shared empty/error/no-data card — icon, heading, description, optional
    action. Used by /history, /pre-call, /voice-feedback and /coaching so
    every "nothing to show" moment in the app reads the same way. */
export default function StatusCard({
  tone = "neutral",
  icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className={`mx-auto w-full max-w-[440px] rounded-[6px] border border-pl-rule-2 bg-pl-white p-8 text-center sm:p-9 ${className}`}
    >
      {icon && (
        <div
          className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border ${TONES[tone]}`}
        >
          {icon}
        </div>
      )}
      <h2 className="text-[18px] font-semibold tracking-tight text-pl-ink">{title}</h2>
      {description && (
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-pl-body">{description}</p>
      )}
      {action && <div className="mt-7">{action}</div>}
    </motion.div>
  );
}
