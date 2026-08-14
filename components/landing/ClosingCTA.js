"use client";

import Link from "next/link";
import { ActionLink, MaskLines, Reveal, Wordmark } from "../ui/primitives";
import { NAV_LINKS } from "./data";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: NAV_LINKS,
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/signup" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function ClosingCTA() {
  return (
    <footer className="pl-on-ink border-t border-pl-ink bg-pl-ink text-pl-onink">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Close */}
        <div className="grid grid-cols-1 items-end gap-x-10 gap-y-8 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="pl-display text-[clamp(2.4rem,7vw,4.8rem)] font-bold text-pl-onink">
                <MaskLines lines={["Get the reps in."]} />
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5 lg:pb-3">
            <p className="max-w-[38ch] text-[15.5px] leading-[1.6] text-pl-onink-2">
              Your first session takes about eleven minutes and costs nothing.
              The buyer will not go easy on you.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ActionLink href="/signup" variant="signal">
                Start practicing free
              </ActionLink>
              <ActionLink href="/login" variant="ghostInk" arrow={false}>
                Log in
              </ActionLink>
            </div>
          </Reveal>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-pl-inkrule py-12 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Wordmark onInk className="text-pl-onink" />
            <p className="mt-4 max-w-[26ch] text-[12.5px] leading-[1.55] text-pl-onink-3">
              Sales practice, scoring and coaching for people who have to make
              the call tomorrow.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="pl-label text-pl-onink-3">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.href.startsWith("#") ? (
                      <a
                        href={l.href}
                        className="text-[13px] text-pl-onink-2 transition-colors hover:text-pl-onink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[13px] text-pl-onink-2 transition-colors hover:text-pl-onink"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-pl-inkrule py-7">
          <span className="pl-mono text-[11.5px] text-pl-onink-3">
            © {new Date().getFullYear()} Pitchloop
          </span>
          <span className="pl-label text-pl-onink-3">Practice · Score · Coach · Repeat</span>
        </div>
      </div>
    </footer>
  );
}
