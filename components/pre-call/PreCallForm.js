"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button, SectionLabel } from "../ui/primitives";

const EASE = [0.22, 0.9, 0.24, 1];

const formSchema = z.object({
  sellingProduct: z.string().min(1, "What are you selling? is required"),
  salesGoal: z.string().min(1, "What is your goal for this call? is required"),
  targetPain: z.string().optional(),
});

export default function PreCallForm({ personaId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellingProduct: "",
      salesGoal: "",
      targetPain: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    form.clearErrors("root");

    try {
      const response = await fetch("/api/start-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: personaId,
          ...values,
          mode: "voice",
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        if (data.reason) {
          form.setError("root", {
            type: "server",
            message: data.reason,
          });
          return;
        }

        throw new Error("Failed to start session");
      }

      router.push(`/voice/${data.sessionId}`);
    } catch (err) {
      console.error("Error starting session:", err);
      form.setError("root", {
        type: "server",
        message: err.message || "Failed to start session.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7">
      <div>
        <SectionLabel>Call context</SectionLabel>
        <p className="mt-3 max-w-[54ch] text-[13px] leading-relaxed text-pl-body">
          The AI buyer builds this entire conversation from what you tell it here — the
          more specific and detailed your context, the more relevant and realistic its
          responses will be.
        </p>
      </div>

      <Field
        label="What are you selling?"
        required
        helpText="Describe what you're selling, who it's for, the problem it solves, and what makes it valuable."
        placeholder="Example: PitchIQ — AI sales-call training for B2B reps who struggle with objection handling"
        as="textarea"
        rows={3}
        error={form.formState.errors.sellingProduct?.message}
        registration={form.register("sellingProduct")}
      />

      <Field
        label="What is your goal for this call?"
        required
        helpText="What you want to accomplish in this conversation — e.g. qualify the buyer, uncover pain points, handle an objection, book a meeting, or move the deal forward."
        placeholder="Example: Book a 15-minute demo with the VP of Sales"
        as="textarea"
        rows={3}
        error={form.formState.errors.salesGoal?.message}
        registration={form.register("salesGoal")}
      />

      <Field
        label="What pain are you solving?"
        optional
        helpText="The problem your buyer likely feels today. Sharper context here means sharper, more realistic objections from the AI buyer."
        placeholder="Example: Sales reps struggle with objection handling and lose deals to hesitation"
        as="textarea"
        rows={4}
        registration={form.register("targetPain")}
      />

      <AnimatePresence initial={false}>
        {form.formState.errors.root?.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className="flex gap-3 rounded-[4px] border border-pl-alert/35 bg-pl-alert/[0.07] px-4 py-3.5"
            >
              <span className="mt-[5px] h-[7px] w-[7px] shrink-0 rounded-[1px] bg-pl-alert" />
              <p className="text-[13px] leading-[1.45] text-pl-body">
                {form.formState.errors.root.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-pl-rule pt-6">
        <Button type="submit" loading={loading} arrow={!loading} className="w-full">
          {loading ? "Starting simulation" : "Start Call 1"}
        </Button>
        <p className="mt-3 text-center text-[12px] leading-relaxed text-pl-mute">
          This starts your 2-call session. Your microphone will be used once the call
          begins.
        </p>
      </div>
    </form>
  );
}

function markerTone({ error, focused }) {
  if (error) return "bg-pl-alert";
  if (focused) return "bg-pl-ink";
  return "bg-pl-rule-2";
}

function Field({
  label,
  helpText,
  required,
  optional,
  error,
  as = "input",
  rows,
  placeholder,
  registration,
}) {
  const [focused, setFocused] = useState(false);
  const Comp = as === "textarea" ? "textarea" : "input";
  const name = registration.name;
  const errorId = `${name}-error`;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={name} className="flex items-center gap-2.5">
          <span
            className={`h-[6px] w-[6px] shrink-0 rounded-[1px] transition-colors duration-200 ${markerTone({ error, focused })}`}
          />
          <span
            className={`pl-label transition-colors duration-200 ${error ? "text-pl-alert" : "text-pl-body"}`}
          >
            {label}
          </span>
        </label>
        {required && (
          <span className="text-pl-alert" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="text-[11px] text-pl-mute">(Optional)</span>}
      </div>

      {helpText && <p className="mb-2.5 text-[12px] leading-relaxed text-pl-mute">{helpText}</p>}

      <Comp
        id={name}
        rows={rows}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        {...registration}
        onBlur={(e) => {
          setFocused(false);
          registration.onBlur?.(e);
        }}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-[4px] border bg-pl-white px-3.5 text-[14.5px] text-pl-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-pl-mute/70 ${
          as === "textarea" ? "py-3 leading-relaxed resize-none" : "h-[50px]"
        } ${
          error
            ? "border-pl-alert/70 focus:border-pl-alert focus:shadow-[0_0_0_3px_rgba(179,52,30,0.12)]"
            : "border-pl-rule-2 hover:border-pl-mute focus:border-pl-ink focus:shadow-[0_0_0_3px_rgba(14,26,22,0.08)]"
        }`}
      />

      {error && (
        <p id={errorId} className="pt-2 text-[12px] text-pl-alert">
          {error}
        </p>
      )}
    </div>
  );
}
