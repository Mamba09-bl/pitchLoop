"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, RefreshCw } from "lucide-react";
import AppShell from "../app/AppShell";
import StatusCard from "../app/StatusCard";
import { SectionLabel, Button } from "../ui/primitives";
import SessionRow from "./SessionRow";

const EASE = [0.22, 0.9, 0.24, 1];

export default function HistoryView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/sessions");

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  const handleViewFeedback = (sessionId, callNumber) =>
    router.push(
      callNumber ? `/voice-feedback/${sessionId}?call=${callNumber}` : `/voice-feedback/${sessionId}`,
    );
  const handleViewTranscript = (sessionId, callNumber) =>
    router.push(
      callNumber ? `/transcript/${sessionId}?call=${callNumber}` : `/transcript/${sessionId}`,
    );

  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length)
      : 0;

  return (
    <AppShell>
      <section className="pb-6 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <SectionLabel>Practice</SectionLabel>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="pl-display mt-5 text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-pl-ink"
        >
          Your practice history.
        </motion.h1>

        {!loading && !error && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.18 }}
            className="mt-8 flex items-center gap-8 border-y border-pl-rule py-5"
          >
            <div>
              <p className="pl-mono text-[26px] font-semibold leading-none text-pl-ink">
                {sessions.length}
              </p>
              <p className="pl-label mt-2 text-pl-mute">
                Total session{sessions.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="h-8 w-px bg-pl-rule-2" />
            <div>
              <p className="pl-mono text-[26px] font-semibold leading-none text-pl-ink">
                {avgScore}
              </p>
              <p className="pl-label mt-2 text-pl-mute">Average score</p>
            </div>
          </motion.div>
        )}
      </section>

      <section className="pb-20 sm:pb-28">
        {loading ? (
          <div className="divide-y divide-pl-rule border-y border-pl-rule">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-6">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-[4px] bg-pl-raised" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-40 animate-pulse rounded-[2px] bg-pl-raised" />
                  <div className="h-3 w-28 animate-pulse rounded-[2px] bg-pl-raised" />
                </div>
                <div className="hidden h-3 w-16 animate-pulse rounded-[2px] bg-pl-raised sm:block" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex justify-center py-10">
            <StatusCard
              tone="alert"
              icon={<AlertTriangle className="h-5 w-5" />}
              title="Unable to load sessions"
              description={error}
              action={
                <Button variant="outline" className="w-full" onClick={fetchSessions}>
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </Button>
              }
            />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex justify-center py-10">
            <StatusCard
              tone="gain"
              icon={<Sparkles className="h-5 w-5" />}
              title="No training sessions yet."
              description="Complete a sales simulation with one of our AI personas and it will show up here, along with your score, duration, and feedback."
              action={
                <Button className="w-full" arrow onClick={() => router.push("/personas")}>
                  Start your first session
                </Button>
              }
            />
          </div>
        ) : (
          <div className="border-y border-pl-rule">
            {sessions.map((session, i) => (
              <SessionRow
                key={session.id}
                session={session}
                index={i}
                onFeedback={handleViewFeedback}
                onTranscript={handleViewTranscript}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
