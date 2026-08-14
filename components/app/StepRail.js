"use client";

/* Shared "you are here" rail — the call-brief flow (Persona → Call brief →
   Live call) and the post-call flow (Call 1 → Call 2 → Coaching) are the
   same idea: a short, linear progression the user is partway through. */

function CircleIcon({ state }) {
  if (state === "done") {
    return (
      <svg viewBox="0 0 14 11" className="h-3 w-3.5" fill="none" aria-hidden="true">
        <path d="M1 5.5 5 9.5 13 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (state === "locked") {
    return (
      <svg viewBox="0 0 12 13" className="h-3 w-3" fill="none" aria-hidden="true">
        <rect x="1.5" y="5.5" width="9" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3.2 5.5V3.3a2.8 2.8 0 0 1 5.6 0V5.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  return null;
}

const CIRCLE_TONE = {
  done: "border border-pl-gain/40 bg-pl-gain/10 text-pl-gain",
  current: "bg-pl-ink text-pl-onink",
  next: "border border-pl-rule-2 bg-pl-raised text-pl-mute",
  locked: "border border-pl-rule-2 bg-pl-raised text-pl-mute",
};

const LABEL_TONE = {
  done: "text-pl-body",
  current: "text-pl-ink font-semibold",
  next: "text-pl-mute",
  locked: "text-pl-mute",
};

export default function StepRail({ steps }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${CIRCLE_TONE[step.state]}`}
            >
              <CircleIcon state={step.state} />
              {step.state === "current" && (i + 1)}
            </span>
            <span
              className={`text-[10.5px] font-medium ${LABEL_TONE[step.state]} ${
                step.state === "locked" ? "hidden sm:inline" : ""
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span
              className={`mb-4 h-px w-6 sm:w-10 ${
                step.state === "done" ? "bg-pl-gain/40" : "bg-pl-rule-2"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
