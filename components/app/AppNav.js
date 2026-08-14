"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "../ui/primitives";

const APP_LINKS = [
  { label: "Personas", href: "/personas" },
  { label: "History", href: "/history" },
];

export default function AppNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-pl-rule bg-pl-ground/85 backdrop-blur-[10px]"
          : "border-transparent bg-pl-ground/0"
      }`}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/personas" aria-label="Pitchloop home" className="shrink-0">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {APP_LINKS.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`group relative px-3 py-2 text-[13.5px] font-medium transition-colors ${
                  active ? "text-pl-ink" : "text-pl-body hover:text-pl-ink"
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3 bottom-1 h-px origin-left bg-pl-ink transition-transform duration-300 ease-out ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-pl-rule-2 text-pl-ink md:hidden"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d={open ? "M3 3l10 10M13 3L3 13" : "M1.5 5h13M1.5 11h13"}
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 0.9, 0.24, 1] }}
            className="overflow-hidden border-t border-pl-rule bg-pl-ground md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4 sm:px-8">
              {APP_LINKS.map((l) => {
                const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`py-2.5 text-[15px] font-medium ${
                      active ? "text-pl-ink" : "text-pl-body"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
