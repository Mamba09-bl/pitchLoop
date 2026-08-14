// "use client";
// this is original new working
// import { useState, useEffect } from "react";
// import {
//   Zap,
//   Target,
//   MessageSquare,
//   TrendingUp,
//   TrendingDown,
//   CheckCircle2,
//   AlertTriangle,
//   Lightbulb,
//   Clock,
//   BarChart2,
//   HelpCircle,
//   ShieldAlert,
//   ChevronRight,
//   Download,
//   History,
//   Play,
//   Brain,
//   Layers,
//   Settings,
//   Users,
//   Sparkles,
//   ArrowUpRight,
//   Minus,
//   CircleDot,
//   Menu,
//   X,
// } from "lucide-react";
// import { useParams } from "next/navigation";

// const SESSION = {
//   score: 8.4,
//   maxScore: 10,
//   label: "Strong",
//   summary:
//     "You built rapport effectively and maintained a professional tone throughout. However, you transitioned into the product pitch before fully understanding the prospect's pain points, and missed several high-value discovery moments.",
//   kpis: [
//     {
//       label: "Discovery",
//       score: 7.2,
//       icon: Target,
//       trend: "up",
//       delta: "+0.8",
//       color: "violet",
//     },
//     {
//       label: "Objection Handling",
//       score: 8.9,
//       icon: ShieldAlert,
//       trend: "up",
//       delta: "+1.2",
//       color: "purple",
//     },
//     {
//       label: "Communication",
//       score: 9.1,
//       icon: MessageSquare,
//       trend: "neutral",
//       delta: "—",
//       color: "indigo",
//     },
//     {
//       label: "Closing Ability",
//       score: 6.8,
//       icon: Zap,
//       trend: "down",
//       delta: "-0.3",
//       color: "fuchsia",
//     },
//   ],
//   strengths: [
//     {
//       title: "Strong Rapport Building",
//       detail:
//         "You opened with a relevant industry reference and matched the prospect's communication style within the first two exchanges — reducing friction immediately.",
//     },
//     {
//       title: "Confident Objection Response",
//       detail:
//         'When Michael challenged your "60% improvement" stat, you reframed it as a floor, not a ceiling, and backed it with a named reference. That\'s a senior-level move.',
//     },
//     {
//       title: "Professional Tone Maintained",
//       detail:
//         "You avoided filler language and stayed composed under pressure. No over-apologizing, no backpedaling — the prospect stayed engaged throughout.",
//     },
//   ],
//   improvements: [
//     {
//       title: "Pitched Too Early",
//       detail:
//         "You introduced product capabilities at message 4, before confirming the prospect's core pain. Discovery should come first — always qualify before you pitch.",
//     },
//     {
//       title: "Missed Follow-Up Questions",
//       detail:
//         'Michael hinted at infrastructure concerns twice. You acknowledged them but never probed deeper. "Tell me more about that" was the right move — you skipped it.',
//     },
//     {
//       title: "No Business Impact Quantification",
//       detail:
//         "You cited time savings but never connected them to revenue impact or headcount. Translating features into dollars is what gets VP-level buy-in.",
//     },
//   ],
//   missed: [
//     {
//       moment: "Michael mentioned a failed vendor migration",
//       missed:
//         "You moved to a product feature instead of asking what went wrong. That concern was a direct buying signal — exploring it could have unlocked trust.",
//     },
//     {
//       moment: 'Prospect asked "how does pricing work?"',
//       missed:
//         "You deflected to a later call. Anchoring a rough range here would have kept momentum. Prospects disengage when pricing feels hidden.",
//     },
//     {
//       moment: "Michael referenced a Q3 deadline",
//       missed:
//         "You never returned to this. Timelines are urgency levers — connecting your solution to their deadline is a closing shortcut you left unused.",
//     },
//   ],
//   recommendation:
//     "Run at least 3 targeted discovery questions before any product mention. Focus the next session on timeline and budget qualification — those two signals determine deal velocity more than anything else. Your rapport skills are a real asset; now pair them with structured discovery.",
//   metrics: [
//     { label: "Total Messages", value: "24", icon: MessageSquare },
//     { label: "Session Duration", value: "18m 42s", icon: Clock },
//     { label: "Questions Asked", value: "7", icon: HelpCircle },
//     { label: "Objections Encountered", value: "4", icon: ShieldAlert },
//     { label: "Follow-Up Questions", value: "2", icon: ChevronRight },
//     { label: "Avg Response Time", value: "12s", icon: BarChart2 },
//   ],
// };

// const NAV = [
//   { label: "AI Roleplays", icon: Play },
//   { label: "Feedback History", icon: History },
//   { label: "Analytics", icon: BarChart2 },
//   { label: "Personas", icon: Users },
//   { label: "Settings", icon: Settings },
// ];

// function AnimatedRing({ score, max = 10, size = 160 }) {
//   const [progress, setProgress] = useState(0);
//   const radius = (size - 20) / 2;
//   const circ = 2 * Math.PI * radius;
//   const pct = progress / max;
//   const dash = circ * pct;
//   const gap = circ - dash;

//   useEffect(() => {
//     const timer = setTimeout(() => setProgress(score), 300);
//     return () => clearTimeout(timer);
//   }, [score]);

//   return (
//     <div className="relative" style={{ width: size, height: size }}>
//       <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
//         <defs>
//           <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#7c3aed" />
//             <stop offset="100%" stopColor="#a855f7" />
//           </linearGradient>
//           <filter id="ringGlow">
//             <feGaussianBlur stdDeviation="3" result="blur" />
//             <feMerge>
//               <feMergeNode in="blur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           fill="none"
//           stroke="rgba(139,92,246,0.1)"
//           strokeWidth="10"
//         />
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           fill="none"
//           stroke="url(#ringGrad)"
//           strokeWidth="10"
//           strokeLinecap="round"
//           strokeDasharray={`${dash} ${gap}`}
//           filter="url(#ringGlow)"
//           style={{
//             transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
//           }}
//         />
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-4xl font-black text-white tracking-tight leading-none">
//           {score}
//         </span>
//         <span className="text-xs text-purple-400/70 font-semibold mt-1 tracking-widest uppercase">
//           / {max}
//         </span>
//       </div>
//     </div>
//   );
// }

// function AnimatedBar({ value, max = 10, color }) {
//   const [width, setWidth] = useState(0);
//   useEffect(() => {
//     const t = setTimeout(() => setWidth((value / max) * 100), 400);
//     return () => clearTimeout(t);
//   }, [value, max]);

//   const colors = {
//     violet: "from-violet-600 to-violet-400",
//     purple: "from-purple-600 to-purple-400",
//     indigo: "from-indigo-600 to-indigo-400",
//     fuchsia: "from-fuchsia-600 to-fuchsia-400",
//   };

//   return (
//     <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
//       <div
//         className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
//         style={{
//           width: `${width}%`,
//           transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
//           boxShadow: "0 0 8px rgba(139,92,246,0.5)",
//         }}
//       />
//     </div>
//   );
// }

// function TrendIcon({ trend, delta }) {
//   if (trend === "up")
//     return (
//       <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-semibold">
//         <TrendingUp className="w-3 h-3" /> {delta}
//       </span>
//     );
//   if (trend === "down")
//     return (
//       <span className="flex items-center gap-0.5 text-rose-400 text-[11px] font-semibold">
//         <TrendingDown className="w-3 h-3" /> {delta}
//       </span>
//     );
//   return (
//     <span className="flex items-center gap-0.5 text-slate-500 text-[11px] font-semibold">
//       <Minus className="w-3 h-3" /> {delta}
//     </span>
//   );
// }

// export default function FeedbackDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeNav, setActiveNav] = useState("Feedback History");
//   const [feedback, setFeedBack] = useState({
//     overallScore: 0,
//     strengths: [],
//     weaknesses: [],
//     missedOpportunities: [],
//     recommendation: "",
//   });
//   const params = useParams();
//   const sessionId = params.sessionId;
//   useEffect(() => {
//     const fetchSession = async () => {
//       const res = await fetch(`/api/end-session?sessionId=${sessionId}`);

//       const result = await res.json();
//       setFeedBack(result.session);
//       console.log(result);
//     };

//     fetchSession();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#080612] text-white font-sans flex overflow-hidden">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
//         * { font-family: 'Inter', system-ui, sans-serif; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 99px; }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
//         .fade-up { animation: fadeUp 0.5s ease forwards; }
//         .fade-up-1 { animation: fadeUp 0.5s ease 0.05s both; }
//         .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
//         .fade-up-3 { animation: fadeUp 0.5s ease 0.15s both; }
//         .fade-up-4 { animation: fadeUp 0.5s ease 0.2s both; }
//         .fade-up-5 { animation: fadeUp 0.5s ease 0.25s both; }
//         .fade-up-6 { animation: fadeUp 0.5s ease 0.3s both; }
//         .glass { background: rgba(18, 10, 40, 0.85); border: 1px solid rgba(139, 92, 246, 0.2); backdrop-filter: blur(20px); }
//         .glass-hover:hover { background: rgba(18, 10, 40, 0.92); border-color: rgba(168, 85, 247, 0.35); transition: all 0.2s ease; }
//       `}</style>

//       {/* ── BACKGROUND ORBS ─────────────────────────────── */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
//         <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-[120px]" />
//         <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-violet-600/8 blur-[100px]" />
//         <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-900/12 blur-[100px]" />
//       </div>

//       {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────── */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* ── SIDEBAR ─────────────────────────────────────── */}
//       <aside
//         className={`fixed lg:sticky top-0 left-0 h-screen w-60 z-50 flex flex-col flex-shrink-0 border-r border-white/[0.06] bg-[#07050f]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <div className="flex items-center justify-between px-5 pt-6 pb-8">
//           <div className="flex items-center gap-2.5">
//             <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.45)]">
//               <Sparkles className="w-3.5 h-3.5 text-white" />
//             </div>
//             <span className="text-[15px] font-bold tracking-tight text-white">
//               PitchIQ
//             </span>
//           </div>
//           <button
//             className="lg:hidden text-slate-500 hover:text-white"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <nav className="flex-1 px-3 space-y-0.5">
//           {NAV.map(({ label, icon: Icon }) => {
//             const active = activeNav === label;
//             return (
//               <button
//                 key={label}
//                 onClick={() => {
//                   setActiveNav(label);
//                   setSidebarOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
//                   active
//                     ? "bg-purple-600/15 text-purple-300 border border-purple-500/20"
//                     : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
//                 }`}
//               >
//                 <Icon
//                   className={`w-4 h-4 flex-shrink-0 ${active ? "text-purple-400" : ""}`}
//                 />
//                 {label}
//                 {active && (
//                   <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-500/60" />
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="px-3 pb-6 mt-auto">
//           <div className="rounded-xl bg-purple-600/8 border border-purple-500/15 px-3 py-3">
//             <div className="flex items-center gap-2 mb-1.5">
//               <Layers className="w-3.5 h-3.5 text-purple-400" />
//               <span className="text-xs font-semibold text-purple-300">
//                 Pro Plan
//               </span>
//             </div>
//             <p className="text-[11px] text-slate-500 leading-relaxed">
//               Unlimited sessions & full AI analytics
//             </p>
//           </div>
//         </div>
//       </aside>

//       {/* ── MAIN ────────────────────────────────────────── */}
//       <main className="flex-1 min-w-0 overflow-y-auto relative z-10 bg-[#080612]/40">
//         {/* Top bar */}
//         <div className="sticky top-0 z-30 bg-[#080612]/80 backdrop-blur-xl border-b border-white/[0.05] px-4 md:px-8 py-3.5 flex items-center gap-4">
//           <button
//             className="lg:hidden text-slate-500 hover:text-white"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-sm font-semibold text-white leading-tight">
//               Feedback Report
//             </h1>
//             <p className="text-[11px] text-slate-600 mt-0.5">
//               Michael Thompson · VP of Engineering · Today, 9:18 AM
//             </p>
//           </div>
//           <div className="ml-auto flex items-center gap-2">
//             <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
//               <CircleDot className="w-2.5 h-2.5" /> Session Complete
//             </span>
//           </div>
//         </div>

//         <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-8">
//           {/* ── HERO ──────────────────────────────────────── */}
//           <section className="fade-up-1">
//             <div className="relative overflow-hidden rounded-2xl glass p-6 md:p-8">
//               <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-700/6 to-transparent pointer-events-none" />
//               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

//               {/* <div className="relative flex flex-col md:flex-row items-center gap-8">
//                <div className="relative flex flex-col items-center justify-center">
//                   <AnimatedRing score={SESSION.score} size={160} />
//                   <div className="text-center">
//                     <span className="text-[11px] font-bold tracking-widest text-purple-400/80 uppercase">
//                       Overall Score
//                     </span>
//                     <div className="mt-1 flex items-center gap-2 justify-center">
//                       <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
//                         {SESSION.label} Performance
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <p className="text-slate-300 text-[15px] leading-relaxed mb-6">
//                     {SESSION.summary}
//                   </p>
//                   <div className="grid grid-cols-2 gap-3">
//                     {SESSION.kpis.map(
//                       ({ label, score, icon: Icon, trend, delta, color }) => (
//                         <div
//                           key={label}
//                           className="glass glass-hover rounded-xl p-3.5"
//                         >
//                           <div className="flex items-center justify-between mb-2">
//                             <div className="flex items-center gap-2">
//                               <div className="w-6 h-6 rounded-lg bg-purple-600/15 flex items-center justify-center">
//                                 <Icon className="w-3 h-3 text-purple-400" />
//                               </div>
//                               <span className="text-[11px] font-medium text-slate-400">
//                                 {label}
//                               </span>
//                             </div>
//                             <TrendIcon trend={trend} delta={delta} />
//                           </div>
//                           <div className="flex items-baseline gap-1 mb-2">
//                             <span className="text-xl font-black text-white">
//                               {score}
//                             </span>
//                             <span className="text-xs text-slate-600">/10</span>
//                           </div>
//                           <AnimatedBar value={score} color={color} />
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               </div> */}

//               <div className="relative flex justify-center items-center">
//                 <AnimatedRing score={feedback.overallScore} size={160} />

//                 <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
//                   {feedback.overallScore >= 8
//                     ? "Excellent"
//                     : feedback.overallScore >= 6
//                       ? "Good"
//                       : feedback.overallScore >= 4
//                         ? "Average"
//                         : "Needs Improvement"}
//                 </span>
//               </div>
//             </div>
//           </section>

//           {/* ── STRENGTHS ──────────────────────────────────── */}
//           <section className="fade-up-2">
//             <span className="text-[11px] text-slate-600">
//               {feedback.strengths.length} identified
//             </span>

//             <div className="grid md:grid-cols-3 gap-3">
//               {feedback.strengths.map((strength, i) => (
//                 <div key={i} className="glass glass-hover rounded-xl p-4 group">
//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 rounded-full bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <CheckCircle2 className="w-3 h-3 text-emerald-400" />
//                     </div>

//                     <div>
//                       <h3 className="text-[13px] font-semibold text-emerald-300 mb-1.5 leading-tight">
//                         Strength {i + 1}
//                       </h3>

//                       <p className="text-[12px] text-slate-500 leading-relaxed">
//                         {strength}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ── IMPROVEMENTS ──────────────────────────────── */}
//           <section className="fade-up-3">
//             <span className="text-[11px] text-slate-600">
//               {feedback.weaknesses.length} flagged
//             </span>

//             <div className="grid md:grid-cols-3 gap-3">
//               {feedback.weaknesses.map((weakness, i) => (
//                 <div
//                   key={i}
//                   className="rounded-xl p-4 border border-amber-500/12 bg-amber-500/[0.04] hover:bg-amber-500/[0.07] hover:border-amber-500/25 transition-all duration-200 group"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="w-6 h-6 rounded-full bg-amber-500/12 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <AlertTriangle className="w-3 h-3 text-amber-400" />
//                     </div>

//                     <div>
//                       <h3 className="text-[13px] font-semibold text-amber-300/90 mb-1.5 leading-tight">
//                         Weakness {i + 1}
//                       </h3>

//                       <p className="text-[12px] text-slate-500 leading-relaxed">
//                         {weakness}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ── MISSED OPPORTUNITIES ──────────────────────── */}
//           <section className="fade-up-4">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-7 h-7 rounded-lg bg-rose-500/12 border border-rose-500/20 flex items-center justify-center">
//                 <Lightbulb className="w-3.5 h-3.5 text-rose-400" />
//               </div>
//               <h2 className="text-sm font-bold text-white tracking-wide uppercase">
//                 Missed Opportunities
//               </h2>
//               <div className="flex-1 h-px bg-white/[0.05]" />
//               <span className="text-[11px] text-slate-600">
//                 {SESSION.missed.length} moments
//               </span>
//             </div>
//             <span className="text-[11px] text-slate-600">
//               {feedback.missedOpportunities.length} moments
//             </span>

//             <div className="space-y-3">
//               {feedback.missedOpportunities.map((opportunity, i) => (
//                 <div key={i} className="flex gap-4">
//                   <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center z-10">
//                     <span className="text-[11px] font-bold text-rose-400">
//                       {i + 1}
//                     </span>
//                   </div>

//                   <div className="flex-1 glass glass-hover rounded-xl p-4 mb-0.5">
//                     <p className="text-[12px] text-slate-300 leading-relaxed">
//                       {opportunity}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ── AI RECOMMENDATION ─────────────────────────── */}
//           <section className="fade-up-5">
//             <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-600/10 via-violet-700/8 to-transparent p-6 md:p-8">
//               <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
//               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

//               <div className="relative flex items-start gap-5">
//                 <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
//                   <Brain className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-[11px] font-bold tracking-widest text-purple-400/80 uppercase">
//                       AI Coach Recommendation
//                     </span>
//                     <Sparkles className="w-3 h-3 text-purple-400/60" />
//                   </div>
//                   <p className="text-[15px] text-slate-200 leading-relaxed max-w-2xl">
//                     {SESSION.recommendation}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ── CONVERSATION METRICS ──────────────────────── */}
//           {/* <section className="fade-up-6">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-7 h-7 rounded-lg bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center">
//                 <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
//               </div>
//               <h2 className="text-sm font-bold text-white tracking-wide uppercase">
//                 Conversation Metrics
//               </h2>
//               <div className="flex-1 h-px bg-white/[0.05]" />
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {SESSION.metrics.map(({ label, value, icon: Icon }) => (
//                 <div
//                   key={label}
//                   className="glass glass-hover rounded-xl px-4 py-4 flex items-center gap-3"
//                 >
//                   <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0">
//                     <Icon className="w-3.5 h-3.5 text-indigo-400" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-[18px] font-black text-white leading-tight">
//                       {value}
//                     </p>
//                     <p className="text-[11px] text-slate-600 truncate">
//                       {label}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section> */}

//           {/* ── ACTION BUTTONS ────────────────────────────── */}
//           <section className="fade-up-6 pb-8">
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//               <div className="relative group flex-1 sm:flex-initial">
//                 <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 blur-md opacity-40 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none" />
//                 <button className="relative w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-purple-600 active:scale-[0.98] transition-all duration-150">
//                   <Play className="w-4 h-4" />
//                   Start New Roleplay
//                   <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
//                 </button>
//               </div>

//               <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass glass-hover text-sm font-semibold text-slate-300 hover:text-white active:scale-[0.98] transition-all duration-150">
//                 <History className="w-4 h-4 text-purple-400" />
//                 View Session History
//               </button>

//               <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass glass-hover text-sm font-semibold text-slate-500 hover:text-slate-300 active:scale-[0.98] transition-all duration-150">
//                 <Download className="w-4 h-4" />
//                 Download Feedback
//               </button>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Zap,
//   Target,
//   MessageSquare,
//   TrendingUp,
//   TrendingDown,
//   CheckCircle2,
//   AlertTriangle,
//   Lightbulb,
//   Clock,
//   BarChart2,
//   HelpCircle,
//   ShieldAlert,
//   ChevronRight,
//   Download,
//   History,
//   Play,
//   Brain,
//   Layers,
//   Settings,
//   Users,
//   Sparkles,
//   ArrowUpRight,
//   Minus,
//   CircleDot,
//   Menu,
//   X,
// } from "lucide-react";

// const NAV = [
//   { label: "AI Roleplays", icon: Play },
//   { label: "Feedback History", icon: History },
//   { label: "Analytics", icon: BarChart2 },
//   { label: "Personas", icon: Users },
//   { label: "Settings", icon: Settings },
// ];

// function AnimatedRing({ score, max = 10, size = 160 }) {
//   const [progress, setProgress] = useState(0);
//   const radius = (size - 20) / 2;
//   const circ = 2 * Math.PI * radius;
//   const pct = progress / max;
//   const dash = circ * pct;
//   const gap = circ - dash;

//   useEffect(() => {
//     // Only animate if score is valid
//     if (score !== undefined && score !== null) {
//       const timer = setTimeout(() => setProgress(score), 300);
//       return () => clearTimeout(timer);
//     }
//   }, [score]);

//   return (
//     <div className="relative" style={{ width: size, height: size }}>
//       <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
//         <defs>
//           <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#7c3aed" />
//             <stop offset="100%" stopColor="#a855f7" />
//           </linearGradient>
//           <filter id="ringGlow">
//             <feGaussianBlur stdDeviation="3" result="blur" />
//             <feMerge>
//               <feMergeNode in="blur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           fill="none"
//           stroke="rgba(139,92,246,0.1)"
//           strokeWidth="10"
//         />
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           fill="none"
//           stroke="url(#ringGrad)"
//           strokeWidth="10"
//           strokeLinecap="round"
//           strokeDasharray={`${dash} ${gap}`}
//           filter="url(#ringGlow)"
//           style={{
//             transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
//           }}
//         />
//       </svg>
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <span className="text-4xl font-black text-white tracking-tight leading-none">
//           {score || 0}
//         </span>
//         <span className="text-xs text-purple-400/70 font-semibold mt-1 tracking-widest uppercase">
//           / {max}
//         </span>
//       </div>
//     </div>
//   );
// }

// // Reusable Insight Card for long text items
// function InsightCard({ type, index, content }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const config = {
//     strength: {
//       borderClass: "border-l-emerald-500",
//       bgClass: "bg-emerald-500/10",
//       iconBorder: "border-emerald-500/20",
//       textClass: "text-emerald-400",
//       label: "Strength",
//       Icon: CheckCircle2,
//     },
//     weakness: {
//       borderClass: "border-l-amber-500",
//       bgClass: "bg-amber-500/10",
//       iconBorder: "border-amber-500/20",
//       textClass: "text-amber-400",
//       label: "Area to Improve",
//       Icon: AlertTriangle,
//     },
//     missed: {
//       borderClass: "border-l-rose-500",
//       bgClass: "bg-rose-500/10",
//       iconBorder: "border-rose-500/20",
//       textClass: "text-rose-400",
//       label: "Missed Opportunity",
//       Icon: Lightbulb,
//     },
//   }[type];

//   const { Icon } = config;
//   const isLongContent = content?.length > 140;

//   return (
//     <div
//       className={`glass glass-hover rounded-xl p-5 border-l-4 ${config.borderClass} flex flex-col transition-all duration-300 h-full`}
//     >
//       <div className="flex gap-4">
//         <div
//           className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgClass} ${config.iconBorder} border mt-0.5`}
//         >
//           <Icon className={`w-4 h-4 ${config.textClass}`} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3
//             className={`text-[13px] font-bold uppercase tracking-wider mb-2 ${config.textClass}`}
//           >
//             {config.label} {index + 1}
//           </h3>
//           <p
//             className={`text-[14px] text-slate-300 leading-relaxed transition-all duration-300 ${isExpanded ? "" : "line-clamp-4"}`}
//           >
//             {content}
//           </p>
//           {isLongContent && (
//             <button
//               onClick={() => setIsExpanded(!isExpanded)}
//               className={`mt-3 text-xs font-semibold ${config.textClass} hover:text-white transition-colors focus:outline-none`}
//             >
//               {isExpanded ? "Show less" : "Read full insight →"}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function FeedbackDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [activeNav, setActiveNav] = useState("Feedback History");

//   const [feedback, setFeedBack] = useState({
//     overallScore: 0,
//     strengths: [],
//     weaknesses: [],
//     missedOpportunities: [],
//     recommendation: "",
//     summary: "",
//   });

//   const sessionId = "default";

//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const res = await fetch(`/api/end-session?sessionId=${sessionId}`);
//         if (res.ok) {
//           const result = await res.json();
//           setFeedBack(result.session);
//         }
//       } catch (error) {
//         console.error("Failed to fetch session data:", error);
//       }
//     };

//     fetchSession();
//   }, [sessionId]);

//   const getScoreLabel = (score) => {
//     if (score >= 8) return "Excellent";
//     if (score >= 6) return "Good";
//     if (score >= 4) return "Average";
//     return "Needs Improvement";
//   };

//   return (
//     <div className="min-h-screen bg-[#080612] text-white font-sans flex overflow-hidden">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
//         * { font-family: 'Inter', system-ui, sans-serif; }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 99px; }
//         @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
//         .fade-up { animation: fadeUp 0.5s ease forwards; }
//         .fade-up-1 { animation: fadeUp 0.5s ease 0.05s both; }
//         .fade-up-2 { animation: fadeUp 0.5s ease 0.1s both; }
//         .fade-up-3 { animation: fadeUp 0.5s ease 0.15s both; }
//         .fade-up-4 { animation: fadeUp 0.5s ease 0.2s both; }
//         .fade-up-5 { animation: fadeUp 0.5s ease 0.25s both; }
//         .fade-up-6 { animation: fadeUp 0.5s ease 0.3s both; }
//         .glass { background: rgba(18, 10, 40, 0.85); border: 1px solid rgba(139, 92, 246, 0.2); backdrop-filter: blur(20px); }
//         .glass-hover:hover { background: rgba(18, 10, 40, 0.92); border-color: rgba(168, 85, 247, 0.35); transition: all 0.2s ease; }
//       `}</style>

//       {/* ── BACKGROUND ORBS ─────────────────────────────── */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
//         <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-[120px]" />
//         <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-violet-600/8 blur-[100px]" />
//         <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-900/12 blur-[100px]" />
//       </div>

//       {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────── */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* ── SIDEBAR ─────────────────────────────────────── */}
//       <aside
//         className={`fixed lg:sticky top-0 left-0 h-screen w-60 z-50 flex flex-col flex-shrink-0 border-r border-white/[0.06] bg-[#07050f]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <div className="flex items-center justify-between px-5 pt-6 pb-8">
//           <div className="flex items-center gap-2.5">
//             <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.45)]">
//               <Sparkles className="w-3.5 h-3.5 text-white" />
//             </div>
//             <span className="text-[15px] font-bold tracking-tight text-white">
//               PitchIQ
//             </span>
//           </div>
//           <button
//             className="lg:hidden text-slate-500 hover:text-white"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <nav className="flex-1 px-3 space-y-0.5">
//           {NAV.map(({ label, icon: Icon }) => {
//             const active = activeNav === label;
//             return (
//               <button
//                 key={label}
//                 onClick={() => {
//                   setActiveNav(label);
//                   setSidebarOpen(false);
//                 }}
//                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
//                   active
//                     ? "bg-purple-600/15 text-purple-300 border border-purple-500/20"
//                     : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
//                 }`}
//               >
//                 <Icon
//                   className={`w-4 h-4 flex-shrink-0 ${active ? "text-purple-400" : ""}`}
//                 />
//                 {label}
//                 {active && (
//                   <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-500/60" />
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="px-3 pb-6 mt-auto">
//           <div className="rounded-xl bg-purple-600/8 border border-purple-500/15 px-3 py-3">
//             <div className="flex items-center gap-2 mb-1.5">
//               <Layers className="w-3.5 h-3.5 text-purple-400" />
//               <span className="text-xs font-semibold text-purple-300">
//                 Pro Plan
//               </span>
//             </div>
//             <p className="text-[11px] text-slate-500 leading-relaxed">
//               Unlimited sessions & full AI analytics
//             </p>
//           </div>
//         </div>
//       </aside>

//       {/* ── MAIN ────────────────────────────────────────── */}
//       <main className="flex-1 min-w-0 overflow-y-auto relative z-10 bg-[#080612]/40">
//         {/* Top bar */}
//         <div className="sticky top-0 z-30 bg-[#080612]/80 backdrop-blur-xl border-b border-white/[0.05] px-4 md:px-8 py-3.5 flex items-center gap-4">
//           <button
//             className="lg:hidden text-slate-500 hover:text-white"
//             onClick={() => setSidebarOpen(true)}
//           >
//             <Menu className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-sm font-semibold text-white leading-tight">
//               Feedback Report
//             </h1>
//             <p className="text-[11px] text-slate-600 mt-0.5">
//               Session Review · Evaluated by PitchIQ AI
//             </p>
//           </div>
//           <div className="ml-auto flex items-center gap-2">
//             <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
//               <CircleDot className="w-2.5 h-2.5" /> Session Complete
//             </span>
//           </div>
//         </div>

//         <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-10">
//           {/* ── HERO: SCORE & COACH SUMMARY ────────────────── */}
//           <section className="fade-up-1">
//             <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 border border-purple-500/30 shadow-[0_8px_32px_rgba(139,92,246,0.15)]">
//               <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-700/5 to-transparent pointer-events-none" />
//               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

//               <div className="relative flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-12">
//                 {/* Score Section */}
//                 <div className="flex flex-col items-center justify-center w-full lg:w-1/3 bg-black/20 rounded-2xl p-8 border border-white/[0.05]">
//                   <AnimatedRing score={feedback.overallScore} size={160} />
//                   <div className="mt-5 text-center">
//                     <span className="text-[11px] font-bold tracking-widest text-purple-400/80 uppercase block mb-2">
//                       Overall Score
//                     </span>
//                     <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-bold">
//                       {getScoreLabel(feedback.overallScore)} Performance
//                     </span>
//                   </div>
//                 </div>

//                 {/* Coach Summary Section */}
//                 <div className="flex-1 flex flex-col justify-center w-full">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
//                       <Brain className="w-5 h-5 text-purple-400" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-white tracking-tight">
//                       Coach Summary
//                     </h2>
//                   </div>
//                   <div className="glass rounded-2xl p-6 flex-1 border border-white/[0.08]">
//                     <p className="text-[15px] leading-relaxed text-slate-300">
//                       {feedback.summary ||
//                         "Complete a session to generate your AI coach summary."}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* ── STRENGTHS ──────────────────────────────────── */}
//           {feedback.strengths?.length > 0 && (
//             <section className="fade-up-2">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-8 h-8 rounded-lg bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
//                   <CheckCircle2 className="w-4 h-4 text-emerald-400" />
//                 </div>
//                 <h2 className="text-lg font-bold text-white tracking-wide">
//                   Key Strengths
//                 </h2>
//                 <div className="flex-1 h-px bg-white/[0.05]" />
//                 <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
//                   {feedback.strengths.length} Insights
//                 </span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-5">
//                 {feedback.strengths.map((content, i) => (
//                   <InsightCard
//                     key={i}
//                     type="strength"
//                     index={i}
//                     content={content}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* ── IMPROVEMENTS ──────────────────────────────── */}
//           {feedback.weaknesses?.length > 0 && (
//             <section className="fade-up-3">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-8 h-8 rounded-lg bg-amber-500/12 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
//                   <AlertTriangle className="w-4 h-4 text-amber-400" />
//                 </div>
//                 <h2 className="text-lg font-bold text-white tracking-wide">
//                   Areas for Improvement
//                 </h2>
//                 <div className="flex-1 h-px bg-white/[0.05]" />
//                 <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
//                   {feedback.weaknesses.length} Flags
//                 </span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-5">
//                 {feedback.weaknesses.map((content, i) => (
//                   <InsightCard
//                     key={i}
//                     type="weakness"
//                     index={i}
//                     content={content}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* ── MISSED OPPORTUNITIES ──────────────────────── */}
//           {feedback.missedOpportunities?.length > 0 && (
//             <section className="fade-up-4">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="w-8 h-8 rounded-lg bg-rose-500/12 border border-rose-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
//                   <Lightbulb className="w-4 h-4 text-rose-400" />
//                 </div>
//                 <h2 className="text-lg font-bold text-white tracking-wide">
//                   Missed Opportunities
//                 </h2>
//                 <div className="flex-1 h-px bg-white/[0.05]" />
//                 <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
//                   {feedback.missedOpportunities.length} Moments
//                 </span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-5">
//                 {feedback.missedOpportunities.map((content, i) => (
//                   <InsightCard
//                     key={i}
//                     type="missed"
//                     index={i}
//                     content={content}
//                   />
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* ── AI RECOMMENDATION ─────────────────────────── */}
//           {feedback.recommendation && (
//             <section className="fade-up-5">
//               <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600/10 via-violet-700/10 to-transparent p-8 md:p-10 shadow-[0_8px_32px_rgba(139,92,246,0.15)]">
//                 <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
//                 <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
//                 <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

//                 <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
//                   <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
//                     <Sparkles className="w-8 h-8 text-white" />
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="text-[12px] font-bold tracking-widest text-purple-400/90 uppercase">
//                         Actionable AI Recommendation
//                       </span>
//                     </div>
//                     <p className="text-[16px] text-slate-200 leading-relaxed max-w-3xl">
//                       {feedback.recommendation}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </section>
//           )}

//           {/* ── ACTION BUTTONS ────────────────────────────── */}
//           <section className="fade-up-6 pb-12 pt-4">
//             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
//               <div className="relative group flex-1 sm:flex-initial">
//                 <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none" />
//                 <button className="relative w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-purple-600 active:scale-[0.98] transition-all duration-150">
//                   <Play className="w-4 h-4" />
//                   Start Next Roleplay
//                   <ArrowUpRight className="w-4 h-4 opacity-70" />
//                 </button>
//               </div>

//               <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-4 rounded-xl glass glass-hover text-[15px] font-semibold text-slate-300 hover:text-white active:scale-[0.98] transition-all duration-150">
//                 <History className="w-4 h-4 text-purple-400" />
//                 View Session History
//               </button>
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  Target,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart2,
  ShieldAlert,
  ChevronRight,
  Download,
  History,
  Play,
  Brain,
  Layers,
  Settings,
  Users,
  Sparkles,
  ArrowUpRight,
  CircleDot,
  Menu,
  X,
  Quote,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

const NAV = [
  {
    label: "Session History",
    icon: History,
    path: "/history",
  },
  {
    label: "Personas",
    icon: Users,
    path: "/personas",
  },
];

function AnimatedRing({ score, max = 10, size = 160 }) {
  const [progress, setProgress] = useState(0);
  const radius = (size - 20) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = progress / max;
  const dash = circ * pct;
  const gap = circ - dash;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(139,92,246,0.1)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          filter="url(#ringGlow)"
          style={{
            transition: "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white tracking-tight leading-none">
          {score}
        </span>
        <span className="text-xs text-purple-400/70 font-semibold mt-1 tracking-widest uppercase">
          / {max}
        </span>
      </div>
    </div>
  );
}

function AnimatedBar({ value, max = 10, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 500);
    return () => clearTimeout(t);
  }, [value, max]);

  const colors = {
    violet: "from-violet-600 to-violet-400",
    purple: "from-purple-600 to-purple-400",
    indigo: "from-indigo-600 to-indigo-400",
    fuchsia: "from-fuchsia-600 to-fuchsia-400",
  };

  return (
    <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
        style={{
          width: `${width}%`,
          transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "0 0 8px rgba(139,92,246,0.5)",
        }}
      />
    </div>
  );
}

function ScoreLabel({ score }) {
  if (score >= 8)
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
        Excellent
      </span>
    );
  if (score >= 6)
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold">
        Good
      </span>
    );
  if (score >= 4)
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
        Average
      </span>
    );
  return (
    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold">
      Needs Work
    </span>
  );
}

function SectionHeader({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  count,
  countLabel,
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
      >
        <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      </div>
      <h2 className="text-sm font-bold text-white tracking-wide uppercase">
        {title}
      </h2>
      <div className="flex-1 h-px bg-white/[0.05]" />
      {count !== undefined && (
        <span className="text-[11px] text-slate-600">
          {count} {countLabel}
        </span>
      )}
    </div>
  );
}

export default function FeedbackDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Feedback History");
  const [feedback, setFeedBack] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const sessionId = params.sessionId;
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch(`/api/end-session?sessionId=${sessionId}`);
      const result = await res.json();
      setFeedBack(result.session);
      setLoading(false);
      console.log(result);
    };
    fetchSession();
  }, []);

  const kpis = feedback
    ? [
        {
          label: "Discovery",
          score: feedback.discoveryScore,
          icon: Target,
          color: "violet",
        },
        {
          label: "Objection Handling",
          score: feedback.objectionHandlingScore,
          icon: ShieldAlert,
          color: "purple",
        },
        {
          label: "Communication",
          score: feedback.communicationScore,
          icon: MessageSquare,
          color: "indigo",
        },
        {
          label: "Closing Ability",
          score: feedback.closingScore,
          icon: Zap,
          color: "fuchsia",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080612] flex items-center justify-center">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          <p className="text-purple-300/60 text-sm tracking-widest uppercase font-medium">
            Generating Feedback
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080612] text-white font-sans flex overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 99px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up-1 { animation: fadeUp 0.5s ease 0.05s both; }
        .fade-up-2 { animation: fadeUp 0.5s ease 0.10s both; }
        .fade-up-3 { animation: fadeUp 0.5s ease 0.15s both; }
        .fade-up-4 { animation: fadeUp 0.5s ease 0.20s both; }
        .fade-up-5 { animation: fadeUp 0.5s ease 0.25s both; }
        .fade-up-6 { animation: fadeUp 0.5s ease 0.30s both; }
        .fade-up-7 { animation: fadeUp 0.5s ease 0.35s both; }
        .glass { background: rgba(18,10,40,0.85); border: 1px solid rgba(139,92,246,0.2); backdrop-filter: blur(20px); }
        .glass-hover:hover { background: rgba(18,10,40,0.92); border-color: rgba(168,85,247,0.35); transition: all 0.2s ease; }
      `}</style>

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-violet-600/8 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-900/12 blur-[100px]" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-60 z-50 flex flex-col flex-shrink-0 border-r border-white/[0.06] bg-[#07050f]/95 backdrop-blur-xl transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.45)]">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">
              PitchIQ
            </span>
          </div>
          <button
            className="lg:hidden text-slate-500 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV.map(({ label, icon: Icon, path }) => {
            const active = activeNav === label;

            return (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setSidebarOpen(false);
                  router.push(path);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                  active
                    ? "bg-purple-600/15 text-purple-300 border border-purple-500/20"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    active ? "text-purple-400" : ""
                  }`}
                />

                {label}

                {active && (
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-500/60" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-6 mt-auto">
          <div className="rounded-xl bg-purple-600/8 border border-purple-500/15 px-3 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300">
                Pro Plan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Unlimited sessions & full AI analytics
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto relative z-10 bg-[#080612]/40">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-[#080612]/80 backdrop-blur-xl border-b border-white/[0.05] px-4 md:px-8 py-3.5 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-500 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight">
              Feedback Report
            </h1>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Session complete · AI-generated coaching analysis
            </p>
          </div>
          <div className="ml-auto">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
              <CircleDot className="w-2.5 h-2.5" /> Session Complete
            </span>
          </div>
        </div>

        <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto space-y-8">
          {/* ── HERO: Score + KPI cards ── */}
          <section className="fade-up-1">
            <div className="relative overflow-hidden rounded-2xl glass p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-purple-700/6 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

              <div className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Score ring */}
                <div className="flex flex-col items-center gap-3 flex-shrink-0">
                  <AnimatedRing score={feedback.overallScore} size={160} />
                  <div className="text-center space-y-1.5">
                    <p className="text-[11px] font-bold tracking-widest text-purple-400/80 uppercase">
                      Overall Score
                    </p>
                    <ScoreLabel score={feedback.overallScore} />
                  </div>
                </div>

                {/* KPI grid */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="grid grid-cols-2 gap-3">
                    {kpis.map(({ label, score, icon: Icon, color }) => (
                      <div
                        key={label}
                        className="glass glass-hover rounded-xl p-3.5"
                      >
                        <div className="flex items-center gap-2 mb-2.5">
                          <div className="w-6 h-6 rounded-lg bg-purple-600/15 flex items-center justify-center">
                            <Icon className="w-3 h-3 text-purple-400" />
                          </div>
                          <span className="text-[11px] font-medium text-slate-400">
                            {label}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-xl font-black text-white">
                            {score}
                          </span>
                          <span className="text-xs text-slate-600">/10</span>
                        </div>
                        <AnimatedBar value={score} color={color} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── COACH SUMMARY ── */}
          <section className="fade-up-2">
            <SectionHeader
              icon={Brain}
              iconBg="bg-violet-500/12 border border-violet-500/20"
              iconColor="text-violet-400"
              title="Coach Summary"
            />
            <div className="relative overflow-hidden rounded-2xl glass p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/6 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
              <div className="relative flex items-start gap-4">
                <Quote className="w-5 h-5 text-purple-500/40 flex-shrink-0 mt-0.5" />
                <p className="text-[15px] text-slate-300 leading-relaxed">
                  {feedback.summary}
                </p>
              </div>
            </div>
          </section>

          {/* ── STRENGTHS ── */}
          <section className="fade-up-3">
            <SectionHeader
              icon={CheckCircle2}
              iconBg="bg-emerald-500/12 border border-emerald-500/20"
              iconColor="text-emerald-400"
              title="Strengths"
              count={feedback.strengths?.length}
              countLabel="identified"
            />
            <div className="grid md:grid-cols-3 gap-3">
              {feedback.strengths?.map((s, i) => (
                <div
                  key={s._id ?? i}
                  className="glass glass-hover rounded-xl p-4 flex flex-col gap-3 group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <h3 className="text-[13px] font-semibold text-emerald-300 leading-tight">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-[12.5px] text-slate-400 leading-relaxed">
                    {s.explanation}
                  </p>

                  {s.evidence && (
                    <div className="mt-auto pt-3 border-t border-white/[0.05]">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">
                        Evidence
                      </p>
                      <p className="text-[12px] text-slate-500 leading-relaxed italic">
                        "{s.evidence}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── WEAKNESSES ── */}
          <section className="fade-up-4">
            <SectionHeader
              icon={AlertTriangle}
              iconBg="bg-amber-500/12 border border-amber-500/20"
              iconColor="text-amber-400"
              title="Areas for Improvement"
              count={feedback.weaknesses?.length}
              countLabel="flagged"
            />
            <div className="grid md:grid-cols-3 gap-3">
              {feedback.weaknesses?.map((w, i) => (
                <div
                  key={w._id ?? i}
                  className="rounded-xl p-4 flex flex-col gap-3 border border-amber-500/12 bg-amber-500/[0.04] hover:bg-amber-500/[0.07] hover:border-amber-500/25 transition-all duration-200"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/12 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                    </div>
                    <h3 className="text-[13px] font-semibold text-amber-300/90 leading-tight">
                      {w.title}
                    </h3>
                  </div>

                  <p className="text-[12.5px] text-slate-400 leading-relaxed">
                    {w.explanation}
                  </p>

                  {w.evidence && (
                    <div className="mt-auto pt-3 border-t border-amber-500/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600/60 mb-1.5">
                        From the conversation
                      </p>
                      <p className="text-[12px] text-slate-500 leading-relaxed italic">
                        "{w.evidence}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── MISSED OPPORTUNITIES ── */}
          <section className="fade-up-5">
            <SectionHeader
              icon={Lightbulb}
              iconBg="bg-rose-500/12 border border-rose-500/20"
              iconColor="text-rose-400"
              title="Missed Opportunities"
              count={feedback.missedOpportunities?.length}
              countLabel="moments"
            />
            <div className="relative">
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-rose-500/30 via-rose-500/10 to-transparent" />
              <div className="space-y-3">
                {feedback.missedOpportunities?.map((m, i) => (
                  <div key={m._id ?? i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center z-10">
                      <span className="text-[11px] font-bold text-rose-400">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 glass glass-hover rounded-xl p-4 mb-0.5 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400/70 mb-1">
                          Situation
                        </p>
                        <p className="text-[13px] font-semibold text-slate-200 leading-snug">
                          "{m.situation}"
                        </p>
                      </div>
                      <div className="pl-3 border-l border-amber-500/20">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/60 mb-1">
                          Why It Mattered
                        </p>
                        <p className="text-[12.5px] text-slate-400 leading-relaxed">
                          {m.whyItMattered}
                        </p>
                      </div>
                      <div className="pl-3 border-l border-emerald-500/20">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 mb-1">
                          Better Response
                        </p>
                        <p className="text-[12.5px] text-slate-400 leading-relaxed">
                          {m.betterResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── AI RECOMMENDATION ── */}
          <section className="fade-up-6">
            <div className="relative overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-600/12 via-violet-700/8 to-transparent p-6 md:p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
              <div className="relative flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)]">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-bold tracking-widest text-purple-400/80 uppercase">
                      AI Coach Recommendation
                    </span>
                    <Sparkles className="w-3 h-3 text-purple-400/60" />
                  </div>
                  <p className="text-[15px] text-slate-200 leading-relaxed max-w-2xl">
                    {feedback.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── ACTION BUTTONS ── */}
          <section className="fade-up-7 pb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative group flex-1 sm:flex-initial">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 blur-md opacity-40 group-hover:opacity-65 transition-opacity duration-300 pointer-events-none" />
                <button className="relative w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-sm font-bold text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:from-violet-500 hover:to-purple-600 active:scale-[0.98] transition-all duration-150">
                  <Play className="w-4 h-4" />
                  Start New Roleplay
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              </div>
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass glass-hover text-sm font-semibold text-slate-300 hover:text-white active:scale-[0.98] transition-all duration-150">
                <History className="w-4 h-4 text-purple-400" />
                View Session History
              </button>
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl glass glass-hover text-sm font-semibold text-slate-500 hover:text-slate-300 active:scale-[0.98] transition-all duration-150">
                <Download className="w-4 h-4" />
                Download Feedback
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
