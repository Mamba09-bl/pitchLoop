// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function PersonasPage() {
//   const [detailsPersona, setDetailsPersona] = useState(null);
//   const router = useRouter();
//   const persona = {
//     name: "Michael Thompson",
//     description: "VP of Engineering at CodePilot",
//     personality: "Skeptical",
//     difficulty: "Hard",
//     language: "English",
//     image:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
//   };
//   useEffect(() => {
//     const fetchpersonas = async () => {
//       const res = await fetch("/api/personas");
//       const result = await res.json();
//       setDetailsPersona(result.persona);
//       console.log(result);
//     };
//     fetchpersonas();
//   }, []);

//   useEffect(() => {
//     console.log(persona);
//   }, [persona]);

//   if (!detailsPersona) {
//     return (
//       <div className="min-h-screen bg-[#080612] flex items-center justify-center">
//         {/* Background orbs */}
//         <div className="fixed inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
//           <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl" />
//         </div>
//         <div className="relative flex flex-col items-center gap-4">
//           <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
//           <p className="text-purple-300/60 text-sm tracking-widest uppercase font-medium">
//             Loading Persona
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#080612] flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Decorative background effects */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[100px]" />
//         <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[120px]" />
//       </div>

//       {/* Card */}
//       <div className="relative w-full max-w-sm">
//         {/* Gradient border wrapper */}
//         <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-b from-purple-500/40 via-purple-600/20 to-transparent" />

//         <div className="relative w-full overflow-hidden rounded-[27px] bg-[#0e0920]/90 backdrop-blur-xl shadow-[0_32px_80px_rgba(124,58,237,0.18)]">
//           {/* ── HEADER ── */}
//           <div className="relative px-6 pt-10 pb-8 overflow-hidden">
//             {/* Header background mesh */}
//             <div className="absolute inset-0 bg-gradient-to-br from-violet-600/25 via-purple-700/20 to-transparent" />
//             <div className="absolute inset-0 bg-gradient-to-t from-[#0e0920] via-transparent to-transparent" />

//             {/* Decorative ring behind avatar */}
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-purple-600/10 blur-2xl" />

//             {/* AI badge */}
//             <div className="relative flex justify-center mb-6">
//               <span className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-400/20 rounded-full px-3 py-1 text-xs font-semibold text-purple-300 tracking-wide backdrop-blur-sm">
//                 <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,1)] animate-pulse" />
//                 AI Sales Persona
//               </span>
//             </div>

//             {/* Avatar */}
//             <div className="relative flex justify-center">
//               {/* Outer glow ring */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-600/20 blur-xl" />
//               </div>

//               {/* Gradient border ring */}
//               <div className="relative p-[2px] rounded-full bg-gradient-to-br from-purple-400/60 via-violet-500/40 to-purple-800/30 shadow-[0_0_32px_rgba(139,92,246,0.35)]">
//                 <div className="p-[3px] rounded-full bg-[#0e0920]/60">
//                   <div className="relative h-28 w-28 overflow-hidden rounded-full">
//                     <img
//                       src={persona.image}
//                       alt={detailsPersona.name}
//                       className="h-full w-full object-cover scale-105"
//                     />
//                     {/* Subtle overlay */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
//                   </div>
//                 </div>
//               </div>

//               {/* Online indicator */}
//               <div className="absolute bottom-1 right-[calc(50%-52px)] w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0e0920] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
//             </div>

//             {/* Name & title */}
//             <div className="relative mt-5 text-center">
//               <h2 className="text-[1.75rem] font-bold text-white tracking-tight leading-none">
//                 {detailsPersona.name}
//               </h2>
//             </div>

//             {/* Tags */}
//           </div>

//           {/* ── BODY ── */}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Mic,
  PhoneOff,
  Zap,
  Brain,
  Clock,
  ChevronDown,
  Sparkles,
  BarChart2,
  Shield,
} from "lucide-react";
import { useParams } from "next/navigation";
import SessionCompleted from "@/components/SessionCompleted";

// ─── Hardcoded conversation ───────────────────────────────────────────────────

const persona = {
  name: "Michael Thompson",
  role: "VP of Engineering, CodePilot",
  personality: "Skeptical",
  difficulty: "Hard",
  image:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DifficultyBadge({ level }) {
  const map = {
    Hard: "bg-rose-500/15 text-rose-300 border-rose-500/25",
    Medium: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    Easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide ${
        map[level] ?? map.Hard
      }`}
    >
      <Zap className="w-2.5 h-2.5" />
      {level}
    </span>
  );
}

function PersonalityBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-violet-500/12 text-violet-300 border-violet-500/25 tracking-wide">
      <Brain className="w-2.5 h-2.5" />
      {label}
    </span>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-4 md:px-6">
      <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10 flex-shrink-0">
        <img
          src={persona.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-bl-sm px-4 py-3 backdrop-blur-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-purple-400/70"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, showAvatar }) {
  const isAI = msg.role === "ai";

  if (isAI) {
    return (
      <div className="flex items-end gap-3 px-4 md:px-6 group">
        {/* Avatar col */}
        <div className="flex-shrink-0 w-8">
          {showAvatar && (
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/10">
              <img
                src={persona.image}
                alt={persona.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Bubble */}
        <div className="max-w-[75%] md:max-w-[60%]">
          <div className="relative bg-white/[0.055] border border-white/[0.08] rounded-2xl rounded-bl-sm px-4 py-3 backdrop-blur-sm shadow-sm">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 rounded-2xl rounded-bl-sm bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
            <p className="relative text-[14px] leading-relaxed text-slate-200">
              {msg.text}
            </p>
          </div>
          <span className="mt-1 ml-1 block text-[11px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {msg.time}
          </span>
        </div>
      </div>
    );
  }

  // User bubble (right-aligned)
  return (
    <div className="flex items-end justify-end px-4 md:px-6 group">
      <div className="max-w-[75%] md:max-w-[60%]">
        <div className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl rounded-br-sm px-4 py-3 shadow-[0_4px_20px_rgba(139,92,246,0.3)]">
          <p className="text-[14px] leading-relaxed text-white/95">
            {msg.text}
          </p>
        </div>
        <span className="mt-1 mr-1 block text-[11px] text-slate-600 text-right opacity-0 group-hover:opacity-100 transition-opacity">
          {msg.time}
        </span>
      </div>
    </div>
  );
}

// ─── Session stat pill ────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
      <Icon className="w-3.5 h-3.5 text-purple-400/70" />
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[11px] font-semibold text-slate-300">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const router = useRouter();

  const [input, setInput] = useState("");
  const [detailsPersona, setDetailsPersona] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [oldMessges, setOldMessages] = useState([]);
  const [sessionEnded, setSessionEnded] = useState(false);
  const params = useParams();
  const sessionId = params.sessionId;

  const scrollRef = useRef(null);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);
  const fetchSession = async () => {
    const res = await fetch(`/api/chat?sessionId=${sessionId}`);

    const result = await res.json();

    console.log(result);
    if (result.sessionEnded) {
      setSessionEnded(true);
      return;
    }
    setOldMessages(result?.session?.messages);
  };
  // Session timer
  useEffect(() => {
    const t = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    console.log(sessionEnded);
  }, [sessionEnded]);

  useEffect(() => {
    const fetchpersonas = async () => {
      const res = await fetch("/api/personas");
      const result = await res.json();
      setDetailsPersona(result.persona);

      console.log(result);
    };
    fetchpersonas();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [oldMessges]);

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    console.log(detailsPersona?._id);
  }, [detailsPersona]);

  // Auto-scroll on new messages

  // Track scroll to show/hide scroll-to-bottom button
  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollBtn(!nearBottom);
  }

  // Auto-grow textarea
  function handleInputChange(e) {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: params.sessionId,
        input: text,
        personaId: detailsPersona?._id,
      }),
    });
    fetchSession();
    setInput("");
    // scrollToBottom();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
  if (sessionEnded) {
    return (
      <SessionCompleted
        onViewFeedback={() => router.push(`/end-session/${sessionId}`)}
        onStartNew={() => router.push("/persona")}
        onBackToPersonas={() => router.push("/persona")}
      />
    );
  }
  return (
    <>
      {/* Bounce keyframe — injected once */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-enter { animation: fadeSlideUp 0.25s ease forwards; }
      `}</style>

      <div className="h-screen bg-[#080612] flex flex-col overflow-hidden font-sans relative">
        {/* ── Background orbs ───────────────────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[560px] h-[560px] bg-purple-700/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 left-1/3 w-[380px] h-[380px] bg-purple-900/12 rounded-full blur-[100px]" />
        </div>

        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <header className="relative z-10 flex-shrink-0">
          {/* Gradient border bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent" />

          <div className="bg-[#0a0818]/80 backdrop-blur-xl px-4 md:px-6 py-3">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              {/* Avatar + online dot */}
              <div className="relative flex-shrink-0">
                <div className="p-[1.5px] rounded-full bg-gradient-to-br from-purple-400/50 via-violet-500/30 to-transparent">
                  <div className="p-[2px] rounded-full bg-[#0a0818]">
                    <img
                      src={persona.image}
                      alt={persona.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                </div>
                {/* Online dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0818] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-sm font-semibold text-white leading-tight truncate">
                    {persona.name}
                  </h1>
                  <DifficultyBadge level={persona.difficulty} />
                  <PersonalityBadge label={persona.personality} />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {persona.role}
                </p>
              </div>

              {/* Session timer + End */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={async () => {
                    const res = await fetch("/api/end-session", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: params.sessionId,
                      }),
                    });

                    router.push(`/end-session/${sessionId}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/18 hover:border-rose-500/35 transition-all active:scale-95"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">End Session</span>
                </button>
              </div>
            </div>

            {/* Session stats row */}
          </div>
        </header>

        {/* ── CHAT AREA ────────────────────────────────────────────────────── */}
        <main className="relative flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto scroll-smooth"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(139,92,246,0.2) transparent",
            }}
          >
            <div className="max-w-4xl mx-auto py-6 space-y-2">
              {/* Session start divider */}
              <div className="flex items-center gap-3 px-4 md:px-6 mb-6">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-[11px] text-slate-600 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  Session started · Today 9:01 AM
                </span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Messages */}

              {oldMessges?.map((msg, idx) => {
                const prevRole = idx > 0 ? oldMessges[idx - 1].role : null;

                const showAvatar =
                  msg.role === "assistant" && prevRole !== "assistant";

                return (
                  <div key={idx} className="msg-enter">
                    <MessageBubble
                      msg={{
                        role: msg.role === "assistant" ? "ai" : "user",
                        text: msg.content,
                        time: new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      }}
                      showAvatar={showAvatar}
                    />
                    <div ref={bottomRef} />
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="msg-enter">
                  <TypingIndicator />
                </div>
              )}

              {/* Bottom anchor */}
              <div ref={bottomRef} className="h-2" />
            </div>
          </div>

          {/* Scroll-to-bottom button */}
          {showScrollBtn && (
            <button
              onClick={() =>
                bottomRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="absolute bottom-4 right-4 md:right-8 w-9 h-9 rounded-full bg-purple-600/80 border border-purple-400/30 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:bg-purple-500/90 transition-all active:scale-95"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </button>
          )}
        </main>

        {/* ── INPUT AREA ───────────────────────────────────────────────────── */}
        <footer className="relative z-10 flex-shrink-0">
          {/* Gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="bg-[#0a0818]/80 backdrop-blur-xl px-4 md:px-6 py-4">
            <div className="max-w-4xl mx-auto">
              {/* Hint */}
              <p className="text-[11px] text-slate-600 mb-2 text-center">
                You're roleplaying as a sales rep — respond to Michael's
                objection
              </p>

              {/* Input row */}
              <div className="relative flex items-end gap-2">
                {/* Glow border wrapper */}
                <div className="relative flex-1 group">
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-500/20 via-violet-500/15 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative flex items-end bg-white/[0.05] border border-white/[0.09] rounded-2xl overflow-hidden backdrop-blur-sm group-focus-within:border-purple-500/30 transition-colors">
                    <textarea
                      ref={textareaRef}
                      disabled={sessionEnded}
                      rows={1}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Your response…"
                      className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 px-4 py-3.5 resize-none outline-none leading-relaxed"
                      style={{ minHeight: "48px", maxHeight: "140px" }}
                    />

                    {/* Mic button */}
                    <button className="flex-shrink-0 p-3 text-slate-600 hover:text-purple-400 transition-colors">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Send button */}
                <div className="relative flex-shrink-0 group/send">
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 blur-md opacity-40 group-hover/send:opacity-70 transition-opacity" />
                  <button
                    onClick={sendMessage}
                    className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Enter hint */}
              <p className="text-[11px] text-slate-700 mt-2 text-center">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.09] text-slate-500 font-mono text-[10px]">
                  Enter
                </kbd>{" "}
                to send ·{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.09] text-slate-500 font-mono text-[10px]">
                  Shift+Enter
                </kbd>{" "}
                for new line
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
