"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MaskLines, SectionLabel, Wordmark } from "../ui/primitives";
import ProofPanel, { ProofStrip } from "./ProofPanel";
import LoginForm from "./LoginForm";

const EASE = [0.22, 0.9, 0.24, 1];

export default function LoginView() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // Owned here rather than in the form: the form unmounts as soon as the
  // handoff renders, which would cancel the pending redirect.
  useEffect(() => {
    if (!loggedIn) return;
    const id = setTimeout(() => router.push("/personas"), 1000);
    return () => clearTimeout(id);
  }, [loggedIn, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-pl-rule">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="Pitchloop home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-pl-mute sm:inline">
              New to Pitchloop?
            </span>
            <Link
              href="/signup"
              className="rounded-full border border-pl-rule-2 px-4 py-2 text-[13.5px] font-semibold text-pl-ink transition-colors hover:bg-pl-ink hover:text-pl-onink"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center px-5 py-12 sm:px-8 sm:py-16 lg:py-12">
        <div className="mx-auto w-full max-w-[1180px]">
          <AnimatePresence mode="wait">
            {loggedIn ? (
              <Handoff key="handoff" />
            ) : (
              <motion.div
                key="form"
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="grid grid-cols-1 items-stretch gap-y-10 lg:grid-cols-12 lg:gap-x-16"
              >
                {/* Proof panel — left, desktop only. Mirrors signup's grid
                    mechanics but flips the composition: form reads on the
                    right, since a returning rep already knows where they're
                    going. */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
                  className="hidden lg:col-span-6 lg:block"
                >
                  <ProofPanel />
                </motion.div>

                <div className="lg:col-span-5 lg:col-start-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <SectionLabel>Log in</SectionLabel>
                  </motion.div>

                  <h1 className="pl-display mt-6 text-[clamp(2.1rem,4.2vw,3rem)] font-bold text-pl-ink">
                    <MaskLines
                      lines={["Pick up where", "you left off."]}
                      delay={0.08}
                    />
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                    className="mt-5 max-w-[42ch] text-[15.5px] leading-[1.6] text-pl-body"
                  >
                    Log back in and keep drilling the skill that&apos;s
                    slipping.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.38 }}
                    className="mt-8 lg:hidden"
                  >
                    <ProofStrip />
                  </motion.div>

                  <LoginForm onSuccess={() => setLoggedIn(true)} />

                  <p className="mt-6 text-center text-[13px] text-pl-mute lg:text-left">
                    New here?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-pl-ink underline underline-offset-2"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="shrink-0 border-t border-pl-rule">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <span className="pl-mono text-[11.5px] text-pl-mute">
            © {new Date().getFullYear()} Pitchloop
          </span>
          <span className="pl-label hidden text-pl-mute sm:inline">
            Practice · Score · Coach · Repeat
          </span>
        </div>
      </footer>
    </div>
  );
}

/** Confirmation held for a beat before the redirect home. */
function Handoff() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="mx-auto max-w-[520px] text-center"
      role="status"
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[6px] bg-pl-gain">
        <svg
          viewBox="0 0 20 15"
          className="h-4 w-5"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1.5 7.5 7 13 18.5 1.5" stroke="#fff" strokeWidth="2.4" />
        </svg>
      </span>

      <h1 className="pl-display mt-7 text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-pl-ink">
        Welcome back.
      </h1>
      <p className="mt-4 text-[15px] leading-[1.6] text-pl-body">
        Taking you home &mdash; the buyer&apos;s been waiting.
      </p>

      <div className="mx-auto mt-9 h-px w-full max-w-[280px] bg-pl-rule">
        <div className="pl-handoff h-px w-full bg-pl-ink" />
      </div>
    </motion.div>
  );
}
