"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  MessageSquareText,
  Gauge,
  AlertTriangle,
  RefreshCw,
  FileText,
} from "lucide-react";
import AppShell from "../app/AppShell";
import StatusCard from "../app/StatusCard";
import BackLink from "../app/BackLink";
import { SectionLabel, Reveal, scoreTone } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

function formatTime(value) {
  if (!value) return null;
  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

export default function TranscriptView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessionLasted, setSessionLasted] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [latestCallNumber, setLatestCallNumber] = useState(1);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId;
  const requestedCall = searchParams.get("call");
  const viewedCallNumber = Number(requestedCall) || latestCallNumber;

  async function fetchTranscript() {
    try {
      setLoading(true);
      setError(null);
      const query = requestedCall
        ? `sessionId=${sessionId}&callNumber=${requestedCall}`
        : `sessionId=${sessionId}`;
      const response = await fetch(`/api/transcript?${query}`);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Failed to fetch transcript");
      }
      const result = await response.json();
      setMessages(Array.isArray(result?.messages) ? result.messages : []);
      setSessionLasted(result?.sessionTime ?? null);
      setFinalScore(typeof result?.score === "number" ? result.score : null);
      setLatestCallNumber(result?.latestCallNumber || 1);
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sessionId) return;
    queueMicrotask(() => fetchTranscript());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, requestedCall]);

  const turns = useMemo(() => {
    return messages.map((m, i) => ({
      ...m,
      isSeller: m.role === "user",
      newTurn: i === 0 || messages[i - 1].role !== m.role,
    }));
  }, [messages]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-pl-ink border-t-transparent" />
          <p className="text-[13.5px] text-pl-mute">Loading your transcript…</p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <StatusCard
            tone="alert"
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Unable to load transcript"
            description={error}
            action={
              <button
                type="button"
                onClick={fetchTranscript}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-pl-ink px-5 py-2.5 text-[13.5px] font-semibold text-pl-onink transition-colors hover:bg-pl-ink-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            }
          />
        </div>
      </AppShell>
    );
  }

  const { tone: scoreToneKey } = finalScore !== null ? scoreTone(finalScore) : { tone: "ink" };
  const scoreColor =
    scoreToneKey === "gain" ? "text-pl-gain" : scoreToneKey === "signal" ? "text-pl-signal-2" : "text-pl-ink";

  return (
    <AppShell>
      <section className="pb-6 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <BackLink onClick={() => router.push("/history")}>Back to history</BackLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          className="mt-7 flex flex-wrap items-center justify-between gap-3"
        >
          <SectionLabel>Practice session</SectionLabel>
          {latestCallNumber >= 2 && (
            <div className="flex items-center gap-2">
              {[1, 2].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => router.push(`/transcript/${sessionId}?call=${n}`)}
                  className={`rounded-full border px-3 py-1 pl-label transition-colors duration-200 ${
                    viewedCallNumber === n
                      ? "border-pl-ink bg-pl-ink text-pl-onink"
                      : "border-pl-rule-2 text-pl-mute hover:border-pl-ink hover:text-pl-ink"
                  }`}
                >
                  Call {n}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.14 }}
          className="pl-display mt-5 text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-pl-ink"
        >
          {latestCallNumber >= 2 ? `Call ${viewedCallNumber} transcript.` : "Call transcript."}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className="mt-2.5 max-w-[56ch] text-[14px] leading-relaxed text-pl-body"
        >
          A complete, chronological record of what was said during this practice call.
        </motion.p>

        {!error && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.26 }}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-pl-rule py-5"
          >
            <div>
              <p className="pl-mono text-[24px] font-semibold leading-none text-pl-ink">
                {sessionLasted || "—"}
              </p>
              <p className="pl-label mt-2 flex items-center gap-1.5 text-pl-mute">
                <Clock className="h-3 w-3" />
                Duration
              </p>
            </div>
            <div className="h-8 w-px bg-pl-rule-2" />
            <div>
              <p className="pl-mono text-[24px] font-semibold leading-none text-pl-ink">
                {messages.length}
              </p>
              <p className="pl-label mt-2 flex items-center gap-1.5 text-pl-mute">
                <MessageSquareText className="h-3 w-3" />
                Message{messages.length === 1 ? "" : "s"}
              </p>
            </div>
            {finalScore !== null && (
              <>
                <div className="h-8 w-px bg-pl-rule-2" />
                <div>
                  <p className={`pl-mono text-[24px] font-semibold leading-none ${scoreColor}`}>
                    {finalScore}
                    <span className="text-[13px] font-normal text-pl-mute">/100</span>
                  </p>
                  <p className="pl-label mt-2 flex items-center gap-1.5 text-pl-mute">
                    <Gauge className="h-3 w-3" />
                    Overall score
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </section>

      <section className="pb-20 sm:pb-28">
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white">
            <div className="flex items-center justify-between gap-3 border-b border-pl-rule bg-pl-raised px-5 py-2.5 sm:px-7">
              <span className="pl-label flex items-center gap-2 text-pl-mute">
                <FileText className="h-3 w-3" />
                Conversation
              </span>
              {messages.length > 0 && (
                <span className="pl-label text-pl-mute">
                  {messages.length} turn{messages.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {messages.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-pl-rule-2 bg-pl-raised">
                  <MessageSquareText className="h-5 w-5 text-pl-mute" />
                </div>
                <h3 className="text-[15px] font-semibold text-pl-ink">
                  No conversation recorded
                </h3>
                <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-pl-mute">
                  This session doesn&apos;t have any transcript messages yet.
                </p>
              </div>
            ) : (
              <div className="px-5 py-2 sm:px-7">
                {turns.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: EASE,
                      delay: Math.min(index, 14) * 0.035,
                    }}
                    className={`group flex flex-col gap-1.5 rounded-[4px] px-2 py-3.5 transition-colors duration-200 hover:bg-pl-raised sm:flex-row sm:gap-5 sm:px-3 ${
                      message.newTurn && index !== 0 ? "mt-1 border-t border-pl-rule pt-5" : ""
                    }`}
                  >
                    <div className="flex w-full shrink-0 items-baseline gap-2 sm:w-[92px] sm:flex-col sm:items-start sm:gap-1">
                      <span
                        className={`pl-label ${message.isSeller ? "text-pl-ink" : "text-pl-mute"}`}
                      >
                        {message.isSeller ? "You" : "Buyer"}
                      </span>
                      {message.createdAt && (
                        <span className="pl-mono text-[10.5px] text-pl-mute">
                          {formatTime(message.createdAt)}
                        </span>
                      )}
                    </div>
                    <p
                      className={`min-w-0 flex-1 border-l-2 pl-4 text-[13.5px] leading-relaxed ${
                        message.isSeller
                          ? "border-pl-ink/70 font-medium text-pl-ink"
                          : "border-pl-rule-2 text-pl-body"
                      }`}
                    >
                      {message.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </AppShell>
  );
}
