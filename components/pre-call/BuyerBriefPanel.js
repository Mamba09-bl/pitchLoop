"use client";

function difficultyTone(level) {
  const l = (level || "").toLowerCase();
  if (l === "hard") return { dot: "bg-pl-signal", text: "text-pl-signal-2" };
  if (l === "easy") return { dot: "bg-pl-gain", text: "text-pl-gain" };
  return { dot: "bg-pl-ink", text: "text-pl-body" };
}

export default function BuyerBriefPanel({ buyer }) {
  return (
    <aside className="overflow-hidden rounded-[6px] border border-pl-rule-2 bg-pl-white">
      <div className="flex items-center justify-between gap-3 border-b border-pl-rule bg-pl-raised px-5 py-2.5">
        <span className="pl-label text-pl-mute">You&apos;re calling</span>
        {buyer?.difficulty &&
          (() => {
            const tone = difficultyTone(buyer.difficulty);
            return (
              <span className="flex shrink-0 items-center gap-2">
                <span className={`h-[6px] w-[6px] shrink-0 rounded-[1px] ${tone.dot}`} />
                <span className={`pl-label ${tone.text}`}>{buyer.difficulty}</span>
              </span>
            );
          })()}
      </div>

      {buyer ? (
        <div className="p-5">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[4px] bg-pl-ground">
              {buyer.image ? (
                <img src={buyer.image} alt={buyer.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[15px] font-semibold text-pl-ink">
                  {buyer.name?.[0]}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-pl-ink">{buyer.name}</p>
              <p className="truncate text-[12.5px] text-pl-mute">
                {buyer.job}
                {buyer.company ? ` · ${buyer.company}` : ""}
              </p>
            </div>
          </div>

          {buyer.description && (
            <p className="mt-4 line-clamp-4 text-[12.5px] leading-relaxed text-pl-body">
              {buyer.description}
            </p>
          )}

          {buyer.personality && (
            <span className="mt-4 inline-flex w-fit items-center rounded-full border border-pl-rule px-2.5 py-[3px] text-[10.5px] font-medium text-pl-body">
              {buyer.personality}
            </span>
          )}
        </div>
      ) : (
        <div className="p-5">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 shrink-0 animate-pulse rounded-[4px] bg-pl-ground" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-2/3 animate-pulse rounded-[2px] bg-pl-ground" />
              <div className="h-3 w-1/2 animate-pulse rounded-[2px] bg-pl-ground" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse rounded-[2px] bg-pl-ground" />
            <div className="h-3 w-5/6 animate-pulse rounded-[2px] bg-pl-ground" />
          </div>
        </div>
      )}

      <div className="border-t border-pl-rule px-5 py-4">
        <p className="text-[11.5px] leading-relaxed text-pl-mute">
          The buyer answers live by voice, pushes back in character, and is scored against the
          context you set here.
        </p>
      </div>
    </aside>
  );
}
