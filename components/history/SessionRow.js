"use client";

import { Calendar, Clock, MessageSquareText, FileText } from "lucide-react";
import { Reveal, SegMeter, scoreTone } from "../ui/primitives";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusTag({ status }) {
  const done = status === "Completed";
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-pl-mute">
      <span className={`h-[6px] w-[6px] rounded-full ${done ? "bg-pl-gain" : "bg-pl-signal"}`} />
      {status}
    </span>
  );
}

export default function SessionRow({ session, index, onFeedback, onTranscript }) {
  const { tone } = scoreTone(session.score);
  const scoreColor = tone === "gain" ? "text-pl-gain" : tone === "signal" ? "text-pl-signal-2" : "text-pl-ink";

  return (
    <Reveal delay={Math.min(index, 10) * 0.05}>
      <article className="group flex flex-col gap-4 border-b border-pl-rule py-5 transition-colors duration-200 hover:bg-pl-raised sm:flex-row sm:items-center sm:gap-6 sm:px-3 sm:py-6 sm:-mx-3">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-pl-ink text-[13px] font-semibold text-pl-onink">
            {getInitials(session.personaName)}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-tight text-pl-ink">
              {session.personaName}
            </h3>
            {session.personaTitle && (
              <p className="mt-0.5 truncate text-[12.5px] text-pl-mute">{session.personaTitle}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-pl-mute">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(session.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-pl-mute">
                <Clock className="h-3.5 w-3.5" />
                {session.duration}
              </span>
              <StatusTag status={session.status} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-6 sm:justify-end sm:gap-8">
          <div className="flex items-center gap-3">
            <SegMeter value={session.score} segments={12} tone={tone} className="h-3 w-[60px]" />
            <span className={`pl-mono w-[26px] text-right text-[15px] font-semibold ${scoreColor}`}>
              {session.score}
            </span>
          </div>

          {session.calls && session.calls.length > 0 ? (
            <div className="flex flex-wrap items-center justify-end gap-3">
              {session.calls.map((call) => (
                <div key={call.callNumber} className="flex items-center gap-1.5">
                  <span className="pl-label text-pl-mute">Call {call.callNumber}</span>
                  <button
                    onClick={() => onFeedback(session.id, call.callNumber)}
                    title={`Call ${call.callNumber} feedback`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-pl-rule-2 px-3 text-[12px] font-medium text-pl-ink transition-colors duration-200 hover:border-pl-ink hover:bg-pl-ink hover:text-pl-onink"
                  >
                    <MessageSquareText className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onTranscript(session.id, call.callNumber)}
                    title={`Call ${call.callNumber} transcript`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-pl-rule-2 px-3 text-[12px] font-medium text-pl-ink transition-colors duration-200 hover:border-pl-ink hover:bg-pl-ink hover:text-pl-onink"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onFeedback(session.id)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-pl-rule-2 px-3 text-[12px] font-medium text-pl-ink transition-colors duration-200 hover:border-pl-ink hover:bg-pl-ink hover:text-pl-onink"
              >
                <MessageSquareText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Feedback</span>
              </button>
              <button
                onClick={() => onTranscript(session.id)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-pl-rule-2 px-3 text-[12px] font-medium text-pl-ink transition-colors duration-200 hover:border-pl-ink hover:bg-pl-ink hover:text-pl-onink"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Transcript</span>
              </button>
            </div>
          )}
        </div>
      </article>
    </Reveal>
  );
}
