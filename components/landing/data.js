export const BRAND = "Pitchloop";

export const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Skills", href: "#skills" },
  { label: "Progress", href: "#progress" },
];

/* The exchange that plays in the hero console. Each beat carries the
   score and skill readings the right-hand pane shows at that moment, so
   the console is one source of truth rather than three timers. */
export const SESSION_BEATS = [
  {
    who: "buyer",
    text: "We already have a vendor for this. I'm not sure why we're talking.",
    score: 41,
    skills: { discovery: 22, objections: 30, value: 18, closing: 12 },
  },
  {
    who: "rep",
    text: "Fair. What made you take the meeting anyway?",
    score: 58,
    skills: { discovery: 61, objections: 54, value: 30, closing: 18 },
  },
  {
    who: "buyer",
    text: "Honestly? Our renewal is in March and I'm not thrilled about it.",
    score: 63,
    skills: { discovery: 70, objections: 58, value: 38, closing: 24 },
  },
  {
    who: "rep",
    text: "What's the part you'd change if the contract were up tomorrow?",
    score: 76,
    skills: { discovery: 88, objections: 66, value: 58, closing: 41 },
  },
  {
    who: "buyer",
    text: "Support. Tickets sit for days, and that's when a deal is on the line.",
    score: 82,
    skills: { discovery: 90, objections: 64, value: 71, closing: 52 },
  },
];

export const SESSION_SKILLS = [
  { key: "discovery", label: "Discovery" },
  { key: "objections", label: "Objections" },
  { key: "value", label: "Value framing" },
  { key: "closing", label: "Closing" },
];

export const OBJECTIONS = [
  "We already have a vendor",
  "Send me a deck and I'll circle back",
  "You're 30% over budget",
  "I'm not the decision maker",
  "Now isn't the right quarter",
  "How is this different from what we use?",
  "We built something internal",
  "Call me after the reorg",
  "I've got five minutes",
  "Legal will never approve this",
  "Can you do it cheaper?",
  "We tried a tool like this. It didn't stick.",
];

export const LOOP_STEPS = [
  {
    index: "01",
    title: "Pick a buyer",
    desc: "A persona with a role, a temperament, and an objection style. Skeptical VP of engineering, budget-owning CFO, champion who went quiet.",
  },
  {
    index: "02",
    title: "Run the call",
    desc: "Speak it or type it. The buyer answers in character and pushes back exactly where a real one would.",
  },
  {
    index: "03",
    title: "Get scored",
    desc: "A 0–100 read across discovery, objection handling, value framing and close — plus the moments that moved each one.",
  },
  {
    index: "04",
    title: "Drill the gap",
    desc: "Pitchloop takes your lowest skill and builds a focused drill. Run it back until the score holds.",
  },
];

export const SKILL_TABS = [
  {
    id: "personas",
    label: "Buyer personas",
    heading: "Buyers who don't make it easy",
    body: "Twelve personas, each with their own priorities, patience and way of saying no. The skeptic interrogates your claims. The CFO wants the number. The champion goes quiet for a week.",
    stat: ["12", "personas in rotation"],
  },
  {
    id: "objections",
    label: "Objection handling",
    heading: "Pressure you can rehearse",
    body: "Price, timing, trust, competitors, internal builds. Objections arrive mid-sentence like they do on a real call, and the session marks whether you handled it or talked past it.",
    stat: ["142", "objections in the library"],
  },
  {
    id: "scoring",
    label: "Call scoring",
    heading: "A number, and the reason for it",
    body: "Every session closes with a 0–100 score broken into the four skills that decide deals — and each one links back to the exact line in the transcript that earned or cost you points.",
    stat: ["0–100", "scored every session"],
  },
  {
    id: "coaching",
    label: "Coaching drills",
    heading: "One weakness at a time",
    body: "Pitchloop finds your lowest skill and builds a drill for it — same objection, new angles, until you stop reaching for the discount and start reaching for the question.",
    stat: ["1", "skill per drill"],
  },
];

export const SECONDARY_FEATURES = [
  {
    title: "Every session, kept",
    desc: "Full transcripts and scores stay on file, so you can read back the call you bombed six weeks ago and see what you'd do differently now.",
  },
  {
    title: "Scenario modes",
    desc: "Discovery, demo, negotiation, or the renewal that's slipping. Each mode trains a different stretch of the sales cycle.",
  },
];

/* Score of one rep's first twelve sessions — the shape the progress
   chart draws. Real practice curves are not a clean line up. */
export const PROGRESS_SESSIONS = [
  41, 48, 44, 53, 59, 55, 64, 68, 66, 74, 79, 83,
];

export const PROGRESS_STATS = [
  { value: 2000, suffix: "+", label: "reps in practice" },
  { value: 31, suffix: "%", label: "average lift in objection scores" },
  { value: 11, suffix: " min", label: "median session length" },
];

export const VOICES = [
  {
    name: "Sarah K.",
    role: "Account Executive, Series B SaaS",
    text: "I ran twenty sessions before a big enterprise demo. It caught patterns in my pitch I had no idea existed.",
    score: 94,
  },
  {
    name: "Marcus T.",
    role: "SDR Team Lead",
    text: "My team runs this every morning for fifteen minutes. Our cold-call conversion is up meaningfully in six weeks.",
    score: 88,
  },
  {
    name: "Priya M.",
    role: "Founder, B2B startup",
    text: "As a technical founder learning sales, this is the closest thing to a coach on demand. The feedback doesn't sugarcoat.",
    score: 91,
  },
];