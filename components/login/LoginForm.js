"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 0.9, 0.24, 1];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Login only ever needs to know "is there a value" — password complexity
   is a signup-time rule, not something to re-litigate on every visit. */
function fieldError(name, form) {
  if (name === "email") {
    const v = form.email.trim();
    if (!v) return "Email is required";
    if (!EMAIL_RE.test(v)) return "Enter a valid email";
    return "";
  }
  if (name === "password") {
    if (!form.password) return "Password is required";
    return "";
  }
  return "";
}

const FIELDS = ["email", "password"];

export default function LoginForm({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const passwordRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (serverError) setServerError("");
    if (errors[name] && !fieldError(name, next)) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setFocused(null);
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: fieldError(name, form) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const next = {};
    FIELDS.forEach((f) => {
      const msg = fieldError(f, form);
      if (msg) next[f] = msg;
    });
    setErrors(next);
    setTouched({ email: true, password: true });

    if (Object.keys(next).length > 0) {
      const first = FIELDS.find((f) => next[f]);
      document.getElementById(first)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const result = await res.json();

      if (result?.success) {
        onSuccess();
        return; // stay disabled through the handoff
      }

      setServerError(result?.error || "Couldn't log you in. Try again.");
      passwordRef.current?.focus();
    } catch {
      setServerError("Can't reach the server. Check your connection and try again.");
    }
    setSubmitting(false);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial="hidden"
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
      className="mt-9"
    >
      <div className="flex flex-col gap-5">
        <Row>
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={form.email}
            error={touched.email ? errors.email : ""}
            focused={focused === "email"}
            onChange={handleChange}
            onFocus={() => setFocused("email")}
            onBlur={handleBlur}
          />
        </Row>

        <Row>
          <Field
            ref={passwordRef}
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            autoComplete="current-password"
            value={form.password}
            error={touched.password ? errors.password : ""}
            focused={focused === "password"}
            onChange={handleChange}
            onFocus={() => setFocused("password")}
            onBlur={handleBlur}
            action={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="pl-label text-pl-mute transition-colors hover:text-pl-ink"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />
        </Row>
      </div>

      <AnimatePresence initial={false}>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-[4px] border border-pl-alert/35 bg-pl-alert/[0.07] px-4 py-3.5"
            >
              <span className="mt-[5px] h-[7px] w-[7px] shrink-0 rounded-[1px] bg-pl-alert" />
              <div>
                <p className="pl-label text-pl-alert">Couldn&apos;t log in</p>
                <p className="mt-1.5 text-[13px] leading-[1.45] text-pl-body">
                  {serverError}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Row>
        <button
          type="submit"
          disabled={submitting}
          className="group mt-7 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-pl-ink text-[14.5px] font-semibold text-pl-onink transition-[background-color,transform] duration-200 hover:bg-pl-ink-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
        >
          {submitting ? (
            <>
              <motion.span
                className="h-3.5 w-3.5 rounded-full border-[1.5px] border-pl-onink-3 border-t-pl-onink"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
              Logging in
            </>
          ) : (
            <>
              Log in
              <svg
                viewBox="0 0 16 12"
                fill="none"
                aria-hidden="true"
                className="h-3 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                <path
                  d="M0 6h14M9.5 1.5 14 6l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </>
          )}
        </button>
      </Row>
    </motion.form>
  );
}

/** One staggered step of the form's entrance. */
function Row({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

function markerTone({ error, focused, filled }) {
  if (error) return "bg-pl-alert";
  if (focused) return "bg-pl-ink";
  if (filled) return "bg-pl-gain";
  return "bg-pl-rule-2";
}

function Field({
  ref,
  label,
  name,
  type,
  placeholder,
  autoComplete,
  value,
  error,
  focused,
  onChange,
  onFocus,
  onBlur,
  action,
}) {
  const filled = value.length > 0 && !error;
  const errorId = `${name}-error`;

  return (
    <div className="relative">
      <div className="mb-2 flex h-[14px] items-center gap-3">
        <label htmlFor={name} className="flex items-center gap-2.5">
          <span
            className={`h-[6px] w-[6px] shrink-0 rounded-[1px] transition-colors duration-200 ${markerTone(
              { error, focused, filled },
            )}`}
          />
          <span
            className={`pl-label transition-colors duration-200 ${
              error ? "text-pl-alert" : "text-pl-body"
            }`}
          >
            {label}
          </span>
        </label>
      </div>

      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errorId : undefined}
        className={`h-[50px] w-full rounded-[4px] border bg-pl-white px-3.5 text-[14.5px] text-pl-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-pl-mute/70 ${
          error
            ? "border-pl-alert/70 focus:border-pl-alert focus:shadow-[0_0_0_3px_rgba(179,52,30,0.12)]"
            : "border-pl-rule-2 hover:border-pl-mute focus:border-pl-ink focus:shadow-[0_0_0_3px_rgba(14,26,22,0.08)]"
        }`}
      />

      {action && <div className="absolute right-0 top-0 flex h-[14px] items-center">{action}</div>}

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="overflow-hidden"
          >
            <p id={errorId} className="pt-2 text-[12px] text-pl-alert">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
