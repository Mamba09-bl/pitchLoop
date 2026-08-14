"use client";

export default function BackLink({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2 text-[13px] font-medium text-pl-mute transition-colors hover:text-pl-ink"
    >
      <svg viewBox="0 0 16 12" fill="none" aria-hidden="true" className="h-3 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-x-1">
        <path d="M16 6H2M6.5 1.5 2 6l4.5 4.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      {children}
    </button>
  );
}
