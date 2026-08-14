"use client";

import { motion } from "framer-motion";
import { Clock, CalendarClock, Hourglass } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

export default function DailySessionLimitReached({ sessionsUsed = 2, sessionsLimit = 2 }) {
  const router = useRouter();

  const rows = [
    {
      icon: CalendarClock,
      label: "Sessions used today",
      value: `${sessionsUsed} / ${sessionsLimit}`,
      tone: "text-pl-signal-2",
    },
    {
      icon: Hourglass,
      label: "Next session",
      value: "In 24 hours",
      tone: "text-pl-gain",
    },
  ];

  return (
    <div className="pl flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mx-auto w-full max-w-[440px] text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[6px] bg-pl-signal">
          <Clock className="h-5 w-5 text-pl-ink" />
        </span>

        <h1 className="pl-display mt-7 text-[clamp(1.9rem,4vw,2.5rem)] font-bold text-pl-ink">
          Daily limit reached.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-pl-body">
          You can only start {sessionsLimit} sessions per day. Your next session will be
          available in 24 hours.
        </p>

        <div className="mt-8 rounded-[6px] border border-pl-rule-2 bg-pl-white p-4 text-left">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-3 py-2.5 ${
                i !== rows.length - 1 ? "border-b border-pl-rule" : ""
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
          <Button
            variant="signal"
            arrow
            onClick={() => router.push("/history")}
            className="w-full"
          >
            View session history
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
