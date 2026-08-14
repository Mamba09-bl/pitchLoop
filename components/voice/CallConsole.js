"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Mic } from "lucide-react";

const EASE = [0.22, 0.9, 0.24, 1];

const PHASE_COPY = {
  idle: {
    title: "Ready when you are.",
    body: "Starting the call connects your microphone and opens the line to the buyer.",
  },
  connecting: {
    title: "Connecting…",
    body: "Opening the line and syncing the call context.",
  },
  listening: {
    title: "Listening — go ahead.",
    body: "Speak naturally, {name} hears you live and will respond by voice.",
  },
  "user-speaking": {
    title: "You're speaking…",
    body: "{name} is listening.",
  },
  processing: {
    title: "Thinking…",
    body: "{name} is weighing your answer.",
  },
  "ai-speaking": {
    title: "{name} is speaking…",
    body: "Listen, then respond when you're ready.",
  },
};

const AVATAR_TONE = {
  idle: "border-pl-rule-2 bg-pl-raised",
  connecting: "border-pl-rule-2 bg-pl-raised",
  listening: "border-pl-ink/25 bg-pl-raised",
  "user-speaking": "border-pl-ink bg-pl-raised",
  processing: "border-pl-ink/25 bg-pl-raised",
  "ai-speaking": "border-pl-mute bg-pl-raised",
};

const RING_TONES = {
  "user-speaking": ["border-pl-ink/40", "border-pl-ink/25", "border-pl-ink/10"],
  "ai-speaking": ["border-pl-mute/45", "border-pl-mute/28", "border-pl-mute/12"],
};

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** The live-call visualizer — the one place on the page that must make
    IDLE → LISTENING → USER SPEAKING → AI SPEAKING legible at a glance. */
export default function CallConsole({
  persona,
  callActive,
  callPhase,
  currentStage,
  elapsedSeconds,
  onStart,
  onEnd,
  limitReached,
}) {
  const firstName = persona?.name ? persona.name.split(" ")[0] : "the buyer";
  const copy = PHASE_COPY[callPhase] || PHASE_COPY.idle;
  const title = copy.title.replace("{name}", firstName);
  const body = copy.body.replace("{name}", firstName);

  const speaking = callPhase === "user-speaking" || callPhase === "ai-speaking";
  const rings = RING_TONES[callPhase] || [];

  const barActive = speaking;
  const barColor =
    callPhase === "user-speaking" ? "bg-pl-ink" : callPhase === "ai-speaking" ? "bg-pl-mute" : "bg-pl-rule-2";
  const levelLabel =
    callPhase === "user-speaking"
      ? "You're speaking"
      : callPhase === "ai-speaking"
        ? `${firstName} is speaking`
        : callPhase === "processing"
          ? "Processing your answer"
          : "Mic live";

  return (
    <div className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white">
      {/* Console header — same grammar as the landing page's live-session preview */}
      <div className="pl-on-ink flex items-center justify-between gap-3 bg-pl-ink px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {callActive ? (
            <span className="relative flex h-[7px] w-[7px] shrink-0">
              <span className="absolute inset-0 rounded-full bg-pl-gain" />
              <span className="pl-ping absolute inset-0 rounded-full bg-pl-gain" />
            </span>
          ) : (
            <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-pl-onink-3" />
          )}
          <span className="pl-label shrink-0 text-pl-onink">
            {callActive ? "Live call" : "Call console"}
          </span>
          {currentStage && (
            <span className="pl-label hidden truncate capitalize text-pl-onink-3 sm:inline">
              {currentStage.replace(/_/g, " ")}
            </span>
          )}
        </div>
        <span className="pl-mono shrink-0 text-[11px] tracking-wider text-pl-onink-2">
          {formatDuration(elapsedSeconds)}
        </span>
      </div>

      <div className="flex flex-col items-center px-6 py-10 md:py-12">
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-[13.5px] font-semibold text-pl-ink">{persona?.name || "Loading buyer…"}</p>
          {persona?.job && (
            <p className="text-[11.5px] text-pl-mute">
              {persona.job}
              {persona.company ? ` · ${persona.company}` : ""}
            </p>
          )}
        </div>

        {/* Call state visual */}
        <div className="relative mt-7 flex h-40 w-40 items-center justify-center">
          <AnimatePresence>
            {rings.map((tone, i) => (
              <motion.span
                key={`${callPhase}-${i}`}
                className={`absolute h-32 w-32 rounded-full border ${tone}`}
                initial={{ scale: 1, opacity: 0.55 }}
                animate={{ scale: 1.6, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: i * 0.55 }}
              />
            ))}
          </AnimatePresence>

          <motion.div
            animate={{ scale: speaking ? [1, 1.035, 1] : 1 }}
            transition={{
              duration: 0.7,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut",
            }}
            className={`relative flex h-28 w-28 items-center justify-center rounded-full border transition-colors duration-500 ${AVATAR_TONE[callPhase] || AVATAR_TONE.idle}`}
          >
            {persona?.image ? (
              <img
                src={persona.image}
                alt={persona.name}
                className={`h-24 w-24 rounded-full object-cover transition-opacity duration-500 ${
                  callActive ? "opacity-100" : "opacity-60"
                }`}
              />
            ) : callActive ? (
              <Mic className="h-9 w-9 text-pl-ink" />
            ) : (
              <Phone className="h-9 w-9 text-pl-mute" />
            )}
            <span
              className={`absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-pl-white ${
                callActive ? "bg-pl-gain" : "bg-pl-mute/50"
              }`}
              title={callActive ? "On call" : "Offline"}
            />
          </motion.div>
        </div>

        {/* Status copy */}
        <div className="mt-7 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={callPhase}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <p className="text-[15px] font-semibold text-pl-ink">{title}</p>
              <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-pl-mute">
                {body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Audio level — which side of the call is talking right now */}
        {callActive && (
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-4 items-center gap-[2px]">
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-full w-[2px] rounded-[1px] ${barColor} ${barActive ? "pl-level-bar" : ""}`}
                  style={
                    barActive
                      ? {
                          animationDelay: `${(i % 7) * 110}ms`,
                          animationDuration: `${760 + (i % 5) * 90}ms`,
                        }
                      : { transform: "scaleY(0.28)" }
                  }
                />
              ))}
            </div>
            <span className="pl-label text-pl-mute">{levelLabel}</span>
          </div>
        )}

        {/* Controls */}
        <div className="mt-9 w-full max-w-xs">
          {!callActive ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: EASE }}
              onClick={onStart}
              disabled={callPhase === "connecting" || limitReached}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pl-ink text-[14px] font-semibold text-pl-onink transition-colors duration-200 hover:bg-pl-ink-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {callPhase === "connecting" ? (
                <motion.span
                  className="h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-pl-onink-3 border-t-pl-onink"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              {callPhase === "connecting"
                ? "Connecting…"
                : limitReached
                  ? "Both calls used"
                  : "Start call"}
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: EASE }}
              onClick={onEnd}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-pl-alert/40 bg-pl-alert/10 text-[14px] font-semibold text-pl-alert transition-colors duration-200 hover:border-pl-alert/60 hover:bg-pl-alert/20"
            >
              <PhoneOff className="h-4 w-4" />
              End call
            </motion.button>
          )}
          <p className="mt-3 text-center text-[11.5px] text-pl-mute">
            {callActive
              ? "Ending the call disconnects the buyer."
              : limitReached
                ? "You've used both calls for this session."
                : "Your browser will ask for microphone access."}
          </p>
        </div>
      </div>
    </div>
  );
}
