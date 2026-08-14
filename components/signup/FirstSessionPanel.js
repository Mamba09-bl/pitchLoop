"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SegMeter } from "../ui/primitives";

/* The buyer waiting on the other side of the form. Same persona, same
   console chrome as the landing hero — signing up is framed as being
   handed session 01 rather than filling in a form. */

const BUYER = {
  initials: "MR",
  name: "Michael Reyes",
  role: "VP Engineering · 240 seats",
  tags: ["Skeptical", "Has incumbent", "Low patience"],
  opener: "We already have a vendor for this. I'm not sure why we're talking.",
  difficulty: 80,
};

const EASE = [0.22, 0.9, 0.24, 1];

/** idle → the form is empty · named → a username exists · ready → form valid */
const STATUS_LINE = {
  idle: { dot: "bg-pl-rule-2", text: "Waiting for your name" },
  named: { dot: "bg-pl-ink", text: null }, // filled in with the username
  ready: { dot: "bg-pl-gain", text: "Ready when you are" },
};

function StatusLine({ status, username }) {
  const state = STATUS_LINE[status];
  const label =
    status === "named" ? `Reserved for ${username}` : state.text;

  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${state.dot}`} />
      <AnimatePresence mode="wait">
        <motion.span
          key={label}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.24, ease: EASE }}
          className={`pl-label truncate ${
            status === "ready" ? "text-pl-gain" : "text-pl-mute"
          }`}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function ConsoleHeader({ status }) {
  const ready = status === "ready";
  return (
    <div className="pl-on-ink flex items-center justify-between gap-4 bg-pl-ink px-4 py-2.5 sm:px-5">
      <div className="flex items-center gap-3">
        <span className="relative flex h-[7px] w-[7px]">
          <span
            className={`absolute inset-0 rounded-full ${
              ready ? "bg-pl-gain" : "bg-pl-signal"
            }`}
          />
          {ready && (
            <span className="pl-ping absolute inset-0 rounded-full bg-pl-gain" />
          )}
        </span>
        <span className="pl-label text-pl-onink">Session 01</span>
        <span className="pl-label hidden text-pl-onink-3 sm:inline">
          Discovery call
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={ready ? "ready" : "queued"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`pl-label ${ready ? "text-pl-gain" : "text-pl-onink-2"}`}
        >
          {ready ? "Ready" : "Queued"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/** Full panel — desktop. */
export default function FirstSessionPanel({ status, username }) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white shadow-[0_1px_0_rgba(14,26,22,0.04),0_24px_60px_-40px_rgba(14,26,22,0.45)]">
      <ConsoleHeader status={status} />

      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] bg-pl-ink text-[15px] font-semibold text-pl-onink">
            {BUYER.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="pl-label text-pl-mute">Your first buyer</p>
            <p className="mt-2 text-[16px] font-semibold leading-tight text-pl-ink">
              {BUYER.name}
            </p>
            <p className="mt-0.5 text-[12.5px] text-pl-mute">{BUYER.role}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {BUYER.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-pl-rule px-2 py-[3px] text-[10.5px] font-medium text-pl-body"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 border-l-2 border-pl-signal pl-3.5">
          <p className="pl-label text-pl-signal-2">Opens with</p>
          <p className="mt-2 text-[13.5px] leading-[1.5] text-pl-body">
            &ldquo;{BUYER.opener}&rdquo;
          </p>
        </div>

        {/* One instrument row — a full-width meter would leave the ticks
            stranded, since each caps at 5px. */}
        <div className="mt-6 flex items-center gap-4 border-t border-pl-rule pt-5">
          <span className="pl-label shrink-0 text-pl-mute">Difficulty</span>
          <SegMeter
            value={BUYER.difficulty}
            segments={18}
            className="h-3.5 w-[124px] shrink-0"
          />
          <span className="pl-mono ml-auto text-[11px] font-medium text-pl-ink">
            4 / 5
          </span>
        </div>
      </div>

      <div className="border-t border-pl-rule bg-pl-raised px-6 py-3.5">
        <StatusLine status={status} username={username} />
      </div>
    </div>
  );
}

/** Compact strip — mobile. Carries the same idea without eating the viewport. */
export function FirstSessionStrip({ status, username }) {
  return (
    <div className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white">
      <ConsoleHeader status={status} />
      <div className="flex items-center gap-3.5 px-4 py-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-pl-ink text-[13px] font-semibold text-pl-onink">
          {BUYER.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-pl-ink">
            {BUYER.name}
          </p>
          <p className="truncate text-[11.5px] text-pl-mute">
            VP Engineering · difficulty 4/5
          </p>
        </div>
        <SegMeter
          value={BUYER.difficulty}
          segments={10}
          className="hidden h-3 w-20 shrink-0 sm:flex"
        />
      </div>
      <div className="border-t border-pl-rule bg-pl-raised px-4 py-3">
        <StatusLine status={status} username={username} />
      </div>
    </div>
  );
}
