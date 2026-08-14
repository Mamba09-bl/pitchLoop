"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AppShell from "../app/AppShell";
import StatusCard from "../app/StatusCard";
import BackLink from "../app/BackLink";
import StepRail from "../app/StepRail";
import { Button } from "../ui/primitives";
import BuyerBriefPanel from "./BuyerBriefPanel";
import PreCallForm from "./PreCallForm";
import SessionRulesPanel from "./SessionRulesPanel";
import DailySessionLimitReached from "./DailySessionLimitReached";

const EASE = [0.22, 0.9, 0.24, 1];

const STEPS = [
  { label: "Persona", state: "done" },
  { label: "Call brief", state: "current" },
  { label: "Live call", state: "next" },
];

export default function PreCallView() {
  const [persona, setPersona] = useState(null);
  const [error, setError] = useState(null);
  const [sessionLimit, setSessionLimit] = useState(null);
  const router = useRouter();
  const params = useParams();
  const personaId = params.personaId;

  useEffect(() => {
    if (!personaId) return;

    const fetchPersona = async () => {
      try {
        const response = await fetch("/api/allPersona");
        if (!response.ok) {
          throw new Error("Failed to fetch persona");
        }
        const data = await response.json();
        setPersona(data.persona);
      } catch (err) {
        console.error("Error fetching persona:", err);
        setError(err.message);
      }
    };

    fetchPersona();
  }, [personaId]);

  useEffect(() => {
    const fetchSessionLimit = async () => {
      try {
        const response = await fetch("/api/start-session");
        if (!response.ok) return;
        const data = await response.json();
        setSessionLimit(data);
      } catch (err) {
        console.error("Error fetching session limit:", err);
      }
    };

    fetchSessionLimit();
  }, []);

  // Display-only: the endpoint may return a single persona or the full list.
  const buyer = Array.isArray(persona) ? persona.find((p) => p?._id === personaId) : persona;

  if (error) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] items-center justify-center py-16">
          <StatusCard
            tone="alert"
            icon={<AlertCircle className="h-5 w-5" />}
            title="Error loading page"
            description={error}
            action={
              <Button variant="outline" className="w-full" onClick={() => router.back()}>
                Go back
              </Button>
            }
          />
        </div>
      </AppShell>
    );
  }

  if (sessionLimit?.limitReached) {
    return (
      <DailySessionLimitReached
        sessionsUsed={sessionLimit.count}
        sessionsLimit={sessionLimit.limit}
      />
    );
  }

  return (
    <AppShell>
      <section className="pb-6 pt-10 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <BackLink onClick={() => router.push("/personas")}>Back to personas</BackLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
          className="mt-7"
        >
          <StepRail steps={STEPS} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="pl-display mt-8 text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-pl-ink"
        >
          Prepare your call.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.22 }}
          className="mt-3 max-w-[56ch] text-[14.5px] leading-relaxed text-pl-body"
        >
          Give the AI buyer your sales context. It uses this to react the way a real prospect
          would — with objections that match what you&apos;re selling and why.
        </motion.p>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.28 }}
        className="pb-10 sm:pb-12"
      >
        <SessionRulesPanel />
      </motion.section>

      <section className="pb-20 sm:pb-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.34 }}
            className="order-2 lg:order-1"
          >
            <PreCallForm personaId={personaId} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <BuyerBriefPanel buyer={buyer} />
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
