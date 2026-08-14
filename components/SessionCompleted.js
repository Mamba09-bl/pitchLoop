"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Brain, Lock, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

const ROWS = [
  { icon: CheckCircle2, label: "Session status", value: "Completed", tone: "text-pl-gain" },
  { icon: Brain, label: "AI feedback", value: "Generated", tone: "text-pl-gain" },
  { icon: Lock, label: "Conversation", value: "Locked", tone: "text-pl-mute" },
];

export default function SessionCompleted({ onViewFeedback }) {
  const router = useRouter();

  return (
    <div className="pl flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto w-full max-w-[440px] text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[6px] bg-pl-gain">
          <svg viewBox="0 0 20 15" className="h-4 w-5" fill="none" aria-hidden="true">
            <path d="M1.5 7.5 7 13 18.5 1.5" stroke="#fff" strokeWidth="2.4" />
          </svg>
        </span>

        <h1 className="pl-display mt-7 text-[clamp(1.9rem,4vw,2.5rem)] font-bold text-pl-ink">
          Session complete.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-pl-body">
          This call has been analyzed and can no longer be continued.
        </p>

        <div className="mt-8 rounded-[6px] border border-pl-rule-2 bg-pl-white p-4 text-left">
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-3 py-2.5 ${
                i !== ROWS.length - 1 ? "border-b border-pl-rule" : ""
              }`}
            >
              <span className="flex items-center gap-2.5 text-[13px] font-medium text-pl-body">
                <row.icon className="h-3.5 w-3.5 text-pl-mute" />
                {row.label}
              </span>
              <span className={`text-[13px] font-semibold ${row.tone}`}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2.5">
          <Button variant="signal" arrow onClick={onViewFeedback} className="w-full">
            View feedback
          </Button>
          <button
            type="button"
            onClick={() => router.push("/personas")}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-pl-rule-2 text-[14px] font-semibold text-pl-ink transition-colors hover:border-pl-ink hover:bg-pl-ink hover:text-pl-onink"
          >
            <Play className="h-3.5 w-3.5" />
            Start new session
          </button>
          <button
            type="button"
            onClick={() => router.push("/personas")}
            className="mt-1 inline-flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-pl-mute transition-colors hover:text-pl-ink"
          >
            <Users className="h-3.5 w-3.5" />
            Back to personas
          </button>
        </div>
      </motion.div>
    </div>
  );
}
