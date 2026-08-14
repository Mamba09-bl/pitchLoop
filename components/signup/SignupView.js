"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MaskLines, SectionLabel, Wordmark } from "../ui/primitives";
import FirstSessionPanel, { FirstSessionStrip } from "./FirstSessionPanel";
import SignupForm from "./SignupForm";

const EASE = [0.22, 0.9, 0.24, 1];

export default function SignupView() {
  const [progress, setProgress] = useState({ username: "", ready: false });
  const [signedUpAs, setSignedUpAs] = useState(null);
  const router = useRouter();

  // Owned here rather than in the form: the form unmounts as soon as the
  // confirmation renders, which would cancel the pending redirect.
  useEffect(() => {
    if (!signedUpAs) return;
    const id = setTimeout(() => router.push("/personas"), 1100);
    return () => clearTimeout(id);
  }, [signedUpAs, router]);

  // The panel tracks the form: nobody yet → a name → everything valid.
  const status = signedUpAs
    ? "ready"
    : progress.ready
      ? "ready"
      : progress.username.length >= 3
        ? "named"
        : "idle";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-pl-rule">
        <div className="mx-auto flex h-[68px] max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="Pitchloop home">
            <Wordmark />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-[13px] text-pl-mute sm:inline">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="rounded-full border border-pl-rule-2 px-4 py-2 text-[13.5px] font-semibold text-pl-ink transition-colors hover:bg-pl-ink hover:text-pl-onink"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center px-5 py-12 sm:px-8 sm:py-16 lg:py-12">
        <div className="mx-auto w-full max-w-[1180px]">
          <AnimatePresence mode="wait">
            {signedUpAs ? (
              <Handoff key="handoff" username={signedUpAs} />
            ) : (
              <motion.div
                key="form"
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="grid grid-cols-1 items-center gap-y-10 lg:grid-cols-12 lg:gap-x-16"
              >
                {/* Form column — primary reading position. Five columns
                    keeps the inputs near a 440px measure; six was too wide
                    to read comfortably. */}
                <div className="lg:col-span-5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <SectionLabel>Create account</SectionLabel>
                  </motion.div>

                  <h1 className="pl-display mt-6 text-[clamp(2.1rem,4.6vw,3.25rem)] font-bold text-pl-ink">
                    <MaskLines lines={["Your first buyer", "is waiting."]} delay={0.08} />
                  </h1>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                    className="mt-5 max-w-[46ch] text-[15.5px] leading-[1.6] text-pl-body"
                  >
                    Free forever on Starter — no card, no trial clock. Michael
                    opens with an objection about eleven seconds in.
                  </motion.p>

                  {/* Mobile carries the same idea as a strip rather than a
                      full panel, so the form stays above the fold. */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.38 }}
                    className="mt-8 lg:hidden"
                  >
                    <FirstSessionStrip
                      status={status}
                      username={progress.username}
                    />
                  </motion.div>

                  <SignupForm onProgress={setProgress} onSuccess={setSignedUpAs} />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.75, ease: EASE, delay: 0.42 }}
                  className="hidden lg:col-span-6 lg:col-start-7 lg:block"
                >
                  <FirstSessionPanel
                    status={status}
                    username={progress.username}
                  />
                </motion.div>
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

/** Confirmation held for a beat before the redirect to /personas. */
function Handoff({ username }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="mx-auto max-w-[520px] text-center"
      role="status"
    >
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[6px] bg-pl-gain">
        <svg viewBox="0 0 20 15" className="h-4 w-5" fill="none" aria-hidden="true">
          <path d="M1.5 7.5 7 13 18.5 1.5" stroke="#fff" strokeWidth="2.4" />
        </svg>
      </span>

      <h1 className="pl-display mt-7 text-[clamp(1.9rem,4vw,2.75rem)] font-bold text-pl-ink">
        You&apos;re in, {username}.
      </h1>
      <p className="mt-4 text-[15px] leading-[1.6] text-pl-body">
        Session 01 is queued. Michael is not going to go easy on you.
      </p>

      <div className="mx-auto mt-9 h-px w-full max-w-[280px] bg-pl-rule">
        <div className="pl-handoff h-px w-full bg-pl-ink" />
      </div>
      <p className="pl-label mt-4 text-pl-mute">Taking you to your personas</p>
    </motion.div>
  );
}
