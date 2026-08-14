"use client";

import { Reveal, SectionLabel, SegMeter } from "../ui/primitives";
import { VOICES } from "./data";

export default function Voices() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 sm:py-28">
      <Reveal>
        <SectionLabel>From people getting reps</SectionLabel>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-3">
        {VOICES.map((v, i) => (
          <Reveal key={v.name} delay={i * 0.08} className="h-full">
            <figure className="flex h-full flex-col border-t-2 border-pl-ink pt-6">
              <div className="flex items-baseline justify-between">
                <span className="pl-label text-pl-mute">Best score</span>
                <span className="pl-mono text-[22px] font-medium leading-none text-pl-ink">
                  {v.score}
                </span>
              </div>
              <SegMeter value={v.score} segments={20} tone="gain" className="mt-3 h-2.5" />

              <blockquote className="mt-6 text-[15px] leading-[1.6] text-pl-ink">
                {v.text}
              </blockquote>

              <figcaption className="mt-auto pt-6">
                <p className="text-[13.5px] font-semibold text-pl-ink">{v.name}</p>
                <p className="mt-0.5 text-[12.5px] text-pl-mute">{v.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
