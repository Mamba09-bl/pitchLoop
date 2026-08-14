"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SectionLabel } from "../ui/primitives";
import AppShell from "../app/AppShell";
import PersonaCard from "./PersonaCard";

const EASE = [0.22, 0.9, 0.24, 1];

export default function PersonasView() {
  const [detailsPersona, setDetailsPersona] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchpersonas = async () => {
      const res = await fetch("/api/allPersona");
      const result = await res.json();
      setDetailsPersona(result.persona);
    };
    fetchpersonas();
  }, []);

  function handleCall(persona) {
    router.push(`/pre-call/${persona._id}`);
  }

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

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <h1 className="pl-display text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold text-pl-ink">
            Choose your buyer.
          </h1>
          <p className="max-w-[36ch] text-[14px] leading-[1.55] text-pl-body sm:text-right">
            Each persona pushes back differently. Pick one and run the call.
          </p>
        </motion.div>

        {detailsPersona && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="mt-7 flex items-center gap-2"
          >
            <span className="h-[6px] w-[6px] shrink-0 rounded-[1px] bg-pl-gain" />
            <span className="pl-label text-pl-mute">
              {detailsPersona.length}{" "}
              {detailsPersona.length === 1 ? "buyer" : "buyers"} available
            </span>
          </motion.div>
        )}
      </section>

      <section className="pb-20 pt-4 sm:pb-28">
        {!detailsPersona ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PersonaCardSkeleton key={i} />
            ))}
          </div>
        ) : detailsPersona.length === 0 ? (
          <div className="rounded-[6px] border border-pl-rule-2 bg-pl-white px-6 py-16 text-center">
            <p className="text-[15px] font-medium text-pl-ink">
              No personas yet.
            </p>
            <p className="mt-2 text-[13.5px] text-pl-mute">
              Check back once a buyer has been added to the roster.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {detailsPersona.map((persona, i) => (
              <PersonaCard
                key={persona._id}
                persona={persona}
                index={i}
                onCall={() => handleCall(persona)}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function PersonaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white">
      <div className="h-9 border-b border-pl-rule bg-pl-raised" />
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 shrink-0 animate-pulse rounded-[4px] bg-pl-ground" />
          <div className="flex-1 pt-1">
            <div className="h-4 w-2/3 animate-pulse rounded-[2px] bg-pl-ground" />
            <div className="mt-2.5 h-3 w-1/2 animate-pulse rounded-[2px] bg-pl-ground" />
          </div>
        </div>
        <div className="mt-4 h-3 w-full animate-pulse rounded-[2px] bg-pl-ground" />
        <div className="mt-2 h-3 w-4/5 animate-pulse rounded-[2px] bg-pl-ground" />
        <div className="mt-5 h-8 border-t border-pl-rule pt-4">
          <div className="h-3 w-2/5 animate-pulse rounded-[2px] bg-pl-ground" />
        </div>
      </div>
      <div className="h-16 border-t border-pl-rule bg-pl-raised" />
    </div>
  );
}
