import { useState } from "react";

/* ── Google Fonts injected via style tag ── */
const fontStyle = `

  .dot-grid {
    background-image: radial-gradient(circle, rgba(107,70,193,0.08) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .spine::before {
    content: '';
    position: absolute;
    left: 24px; top: 52px; bottom: 52px;
    width: 2px;
    background: linear-gradient(to bottom, #8b5cf6, #e8e3f8);
    border-radius: 99px;
  }
  .active-card {
    border-color: #6b46c1 !important;
    box-shadow: 0 0 0 3px rgba(107,70,193,0.08), 0 4px 16px rgba(107,70,193,0.12) !important;
  }
  .pulse-ring {
    box-shadow: 0 0 0 5px rgba(107,70,193,0.08), 0 4px 16px rgba(107,70,193,0.2);
  }
  .nudge-enter {
    animation: nudgeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  @keyframes nudgeUp {
    from { opacity:0; transform: translateX(-50%) translateY(16px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
  .xp-bar { background: linear-gradient(90deg, #6b46c1, #8b5cf6); }
  .prog-bar { background: linear-gradient(90deg, #6b46c1, #f6c90e); }
`;

/* ── Data ── */
const MILESTONES = [
  { id: 1, icon: "✅", label: "Foundation & Setup",      lessons: 3, status: "done",   pct: 100 },
  { id: 2, icon: "⚡", label: "REST API Design",          lessons: 4, status: "active", pct: 60  },
  { id: 3, icon: "🔒", label: "Auth & Middleware",        lessons: 4, status: "locked", pct: 0   },
  { id: 4, icon: "🔒", label: "Database Integration",     lessons: 5, status: "locked", pct: 0   },
  { id: 5, icon: "🔒", label: "Testing & Error Handling", lessons: 3, status: "locked", pct: 0   },
  { id: 6, icon: "🔒", label: "Deployment & CI/CD",       lessons: 3, status: "locked", pct: 0   },
];

const LEADERBOARD = [
  { rank: 1, medal: "🥇", name: "Priya S.",   pts: 94 },
  { rank: 2, medal: "🥈", name: "Arjun M.",   pts: 91 },
  { rank: 3, medal: "🥉", name: "Neha K.",    pts: 89 },
  { rank: 4, medal: null,  name: "Rohit V.",   pts: 85 },
  { rank: 5, medal: null,  name: "Fatima Z.",  pts: 83 },
  { rank: 6, medal: null,  name: "Dev P.",     pts: 82 },
  { rank: 7, medal: null,  name: "You",        pts: 82, isYou: true },
];

const CHAT = [
  { role: "user", text: "can you show me a Joi example?" },
  { role: "ai",   text: "Not yet — let's think first. What fields does POST /jobs accept in your tracker? List them and tell me which are required." },
  { role: "user", text: "title, company, status... title + company required" },
  { role: "ai",   text: "Good. Now — what should happen if someone sends a request missing title? What HTTP status fits? What should the error say?" },
];

/* ── Tag component ── */
function Tag({ type, label }) {
  const styles = {
    concept: "bg-purple-100 text-purple-700",
    build:   "bg-yellow-50 text-yellow-800 border border-yellow-200",
    ai:      "bg-sky-50 text-sky-700 border border-sky-200",
    cp:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };
  return (
    <span className={`text-[10px] font-mono-custom font-medium px-2 py-0.5 rounded-md ${styles[type]}`}>
      {label}
    </span>
  );
}

/* ── Item chip ── */
function Item({ status = "default", children }) {
  const base = "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono-custom border transition-all";
  const styles = {
    done:    `${base} text-slate-400 line-through bg-slate-50 border-slate-100`,
    active:  `${base} bg-purple-50 border-purple-200 text-purple-700`,
    dim:     `${base} bg-slate-50 border-slate-100 text-slate-400 opacity-60`,
    default: `${base} bg-slate-50 border-slate-100 text-slate-600`,
  };
  return (
    <span className={styles[status]}>
      {status === "done" && <span className="text-emerald-500 no-underline not-italic">✓</span>}
      {(status === "active" || status === "default") && (
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
      )}
      {status === "dim" && (
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
      )}
      {children}
    </span>
  );
}

/* ── AI Hint ── */
function AiHint({ label, children }) {
  return (
    <div className="flex gap-3 bg-sky-50 border border-sky-200 rounded-xl p-3.5">
      <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sm flex-shrink-0">🤖</div>
      <div>
        <div className="text-[10px] font-mono-custom text-sky-600 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-xs text-sky-900 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ── Section Label ── */
function SecLabel({ children }) {
  return (
    <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-2">{children}</div>
  );
}

/* ── Lesson Card wrapper ── */
function LessonCard({ dot, dotStyle, isActive, isDone, isDim, children }) {
  return (
    <div className="flex gap-4 mb-2.5 relative">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-base flex-shrink-0 z-10 border-2 transition-all ${dotStyle}`}>
        {dot}
      </div>
      <div className="flex-1 pb-5">
        <div className={`bg-white rounded-2xl overflow-hidden transition-all border
          ${isActive ? "active-card" : "border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-px"}
          ${isDone ? "opacity-80" : ""}
          ${isDim ? "opacity-50" : ""}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function RoadmapUI() {
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(2);

  return (
    <>
      <style>{fontStyle}</style>

      <div className="flex flex-col h-screen bg-[#faf9ff] overflow-hidden">

        {/* ══ TOPBAR ══ */}
        <header className="h-[60px] flex items-center gap-5 px-5 bg-white/90 backdrop-blur-xl border-b border-purple-100 z-50 flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-sm shadow-lg shadow-purple-200">
              🪺
            </div>
            <span className="font-display font-bold text-[17px] text-purple-700 tracking-tight">AlgoNest</span>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 font-mono-custom text-[11px] text-slate-400">
            <span className="text-slate-600">Paths</span>
            <span className="text-purple-200">/</span>
            <span className="text-slate-600">Backend Dev</span>
            <span className="text-purple-200">/</span>
            <span className="text-purple-600 font-semibold">Node.js + Express</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* XP */}
            <div className="flex items-center gap-2 font-mono-custom text-[11px] text-slate-500">
              <span className="text-purple-600 font-semibold">XP</span>
              <div className="w-24 h-[5px] bg-purple-100 rounded-full overflow-hidden">
                <div className="xp-bar h-full w-[62%] rounded-full" />
              </div>
              <span className="text-purple-700 font-semibold">620/1000</span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1 text-[11px] font-mono-custom text-orange-600">
              🔥 12-day streak
            </div>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-xs font-display font-bold border-2 border-purple-100 shadow-md shadow-purple-100">
              IY
            </div>
          </div>
        </header>

        {/* ══ BODY ══ */}
        <div className="flex flex-1 overflow-hidden">

          {/* ══ LEFT SIDEBAR ══ */}
          <nav className="w-[252px] flex-shrink-0 bg-white border-r border-purple-100 overflow-y-auto">
            <div className="pt-5 pb-2 px-[18px]">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Your Milestones</div>
            </div>

            {MILESTONES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMilestone(m.id)}
                className={`w-full flex items-center gap-3 px-[18px] py-2.5 relative transition-all text-left
                  ${activeMilestone === m.id ? "bg-purple-50" : "hover:bg-purple-50/60"}
                `}
              >
                {activeMilestone === m.id && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-purple-600 rounded-r-full" />
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0
                  ${m.status === "done"   ? "bg-emerald-50"  : ""}
                  ${m.status === "active" ? "bg-purple-100"  : ""}
                  ${m.status === "locked" ? "bg-slate-50 opacity-50 grayscale" : ""}
                `}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[13px] font-semibold truncate
                    ${m.status === "locked" ? "text-slate-400" : "text-slate-800"}
                  `}>{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{m.lessons} lessons</div>
                </div>
                <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                  ${m.status === "done"   ? "bg-emerald-50 text-emerald-700"   : ""}
                  ${m.status === "active" ? "bg-yellow-50 border border-yellow-200 text-yellow-800" : ""}
                  ${m.status === "locked" ? "text-slate-300"                    : ""}
                `}>
                  {m.status === "done" ? "Done" : m.status === "active" ? `${m.pct}%` : "🔒"}
                </div>
              </button>
            ))}

            <div className="h-px bg-purple-50 mx-[18px] my-4" />

            {/* Progress summary */}
            <div className="px-3 pb-3">
              <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-3 px-1">Overall Progress</div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono-custom text-slate-500">Milestones</span>
                  <span className="text-[11px] font-mono-custom font-semibold text-purple-600">1 / 6</span>
                </div>
                <div className="h-[5px] bg-purple-100 rounded-full overflow-hidden">
                  <div className="prog-bar h-full w-[16%] rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono-custom text-slate-500">Checkpoints</span>
                  <span className="text-[11px] font-mono-custom font-semibold text-purple-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono-custom text-slate-500">Streak</span>
                  <span className="text-[11px] font-mono-custom font-semibold text-orange-500">🔥 12 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono-custom text-slate-500">Rank</span>
                  <span className="text-[11px] font-mono-custom font-semibold text-purple-600">#7</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-purple-50 mx-[18px] my-1" />

            {/* Project */}
            <div className="px-[18px] py-4">
              <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-2">Your Project</div>
              <div className="font-display font-bold text-[13px] text-slate-800">Job Tracker API</div>
              <div className="inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-mono-custom text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ✓ Session 0 — Mentor Approved
              </div>
              <div className="text-[11px] font-mono-custom text-purple-600 mt-2 cursor-pointer hover:underline">
                View project details →
              </div>
            </div>
          </nav>

          {/* ══ MAIN CANVAS ══ */}
          <main className="flex-1 overflow-y-auto px-7 py-7 pb-20 dot-grid">

            {/* Milestone header */}
            <div className="flex items-start gap-5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-purple-200">
                🔌
              </div>
              <div>
                <div className="text-[10px] font-mono-custom text-purple-500 uppercase tracking-widest mb-1">
                  Milestone 02 · Backend Developer Path
                </div>
                <h1 className="font-display font-extrabold text-2xl text-slate-900 leading-tight mb-1.5">
                  REST API Design
                </h1>
                <p className="text-[13px] text-slate-500 leading-relaxed max-w-md">
                  Design clean, predictable APIs — applied directly to your Job Tracker project, not a tutorial clone.
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-[7px] bg-purple-100 rounded-full overflow-hidden">
                <div className="prog-bar h-full w-[60%] rounded-full" />
              </div>
              <span className="text-[12px] font-mono-custom text-purple-600 font-medium whitespace-nowrap">
                3 of 4 lessons · Checkpoint pending
              </span>
            </div>

            {/* ── Lessons ── */}
            <div className="relative spine">

              {/* L1 — done */}
              <LessonCard
                dot="✓" isDone
                dotStyle="bg-emerald-50 border-emerald-200 text-emerald-500"
              >
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-purple-50">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">📐</span>
                    <div>
                      <div className="font-display font-bold text-[14px] text-slate-800">REST Fundamentals</div>
                      <div className="text-[11px] font-mono-custom text-slate-400 mt-0.5">Lesson 2.1 · Completed</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Tag type="concept" label="Concept" />
                    <Tag type="build" label="Build" />
                  </div>
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <SecLabel>What you learned</SecLabel>
                    <div className="flex flex-wrap gap-2">
                      <Item status="done">HTTP verbs &amp; status codes</Item>
                      <Item status="done">Resource naming conventions</Item>
                      <Item status="done">Stateless architecture</Item>
                      <Item status="done">JSON response structure</Item>
                    </div>
                  </div>
                  <div>
                    <SecLabel>Applied to your project</SecLabel>
                    <div className="flex flex-wrap gap-2">
                      <Item status="done">Designed 6 endpoints for Job Tracker</Item>
                      <Item status="done">Defined response schema</Item>
                    </div>
                  </div>
                </div>
              </LessonCard>

              {/* L2 — done */}
              <LessonCard
                dot="✓" isDone
                dotStyle="bg-emerald-50 border-emerald-200 text-emerald-500"
              >
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-purple-50">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🔀</span>
                    <div>
                      <div className="font-display font-bold text-[14px] text-slate-800">Express Routing &amp; Methods</div>
                      <div className="text-[11px] font-mono-custom text-slate-400 mt-0.5">Lesson 2.2 · Completed</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Tag type="concept" label="Concept" />
                    <Tag type="build" label="Build" />
                    <Tag type="ai" label="AI Guided" />
                  </div>
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <SecLabel>Topics covered</SecLabel>
                    <div className="flex flex-wrap gap-2">
                      <Item status="done">GET / POST / PUT / DELETE routes</Item>
                      <Item status="done">req.params &amp; req.query</Item>
                      <Item status="done">Router modularisation</Item>
                    </div>
                  </div>
                  <AiHint label="AI Companion saved note">
                    In your Job Tracker, use params for resource IDs{" "}
                    <code className="font-mono-custom bg-sky-100 text-sky-700 px-1 py-0.5 rounded text-[10px]">/jobs/:id</code>{" "}
                    and query for filters{" "}
                    <code className="font-mono-custom bg-sky-100 text-sky-700 px-1 py-0.5 rounded text-[10px]">?status=applied</code>.
                    You figured this out after being asked — that's the correct instinct.
                  </AiHint>
                </div>
              </LessonCard>

              {/* L3 — active */}
              <LessonCard
                dot="3" isActive
                dotStyle="bg-purple-100 border-purple-600 text-purple-700 pulse-ring"
              >
                <div className="flex items-center justify-between px-5 py-3.5 bg-purple-50/50 border-b border-purple-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🏗️</span>
                    <div>
                      <div className="font-display font-bold text-[14px] text-slate-800">API Structure &amp; Validation</div>
                      <div className="text-[11px] font-mono-custom text-purple-500 mt-0.5">Lesson 2.3 · In Progress</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Tag type="concept" label="Concept" />
                    <Tag type="build" label="Build" />
                    <Tag type="ai" label="AI Guided" />
                  </div>
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <SecLabel>Currently learning</SecLabel>
                    <div className="flex flex-wrap gap-2">
                      <Item status="active">Input validation with Joi</Item>
                      <Item status="active">Consistent error response format</Item>
                      <Item status="dim">Controller separation pattern</Item>
                      <Item status="dim">Service layer abstraction</Item>
                    </div>
                  </div>
                  <div>
                    <SecLabel>Your project task</SecLabel>
                    <div className="flex flex-wrap gap-2">
                      <Item status="active">Add validation to POST /jobs in your tracker</Item>
                      <Item status="dim">Extract job logic into a service file</Item>
                    </div>
                  </div>
                  <AiHint label="AI Companion · Active right now">
                    <strong className="text-sky-900">You're stuck on error format?</strong> Think — if every error your Job Tracker returns looks different,
                    what problem does that create for whoever calls your API? What would make their life easier?
                  </AiHint>
                </div>
              </LessonCard>

              {/* L4 — locked */}
              <LessonCard
                dot="4" isDim
                dotStyle="bg-slate-50 border-slate-200 text-slate-400"
              >
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🔒</span>
                    <div>
                      <div className="font-display font-bold text-[14px] text-slate-500">CORS, Security Headers &amp; Finish</div>
                      <div className="text-[11px] font-mono-custom text-slate-400 mt-0.5">Lesson 2.4 · Locked</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Tag type="concept" label="Concept" />
                    <Tag type="build" label="Build" />
                  </div>
                </div>
                <div className="px-5 py-4">
                  <SecLabel>Unlocks after Lesson 2.3</SecLabel>
                  <div className="flex flex-wrap gap-2">
                    <Item status="dim">CORS configuration</Item>
                    <Item status="dim">Helmet.js security headers</Item>
                    <Item status="dim">Rate limiting basics</Item>
                  </div>
                </div>
              </LessonCard>

              {/* Checkpoint */}
              <div className="flex gap-4 mb-2.5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 z-10 bg-yellow-50 border-2 border-yellow-300 text-yellow-700">
                  ⚑
                </div>
                <div className="flex-1 pb-5">
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-yellow-400 text-slate-800 text-[10px] font-mono-custom font-bold px-2.5 py-1 rounded-lg">
                        CHECKPOINT 2
                      </span>
                      <span className="font-display font-bold text-[14px] text-slate-800">Live Milestone Review with Mentor</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        "Explain your Job Tracker's API design decisions — why these endpoints?",
                        "Walk through your validation logic without reading the code",
                        "Identify one architectural decision you'd change and why",
                        "Mentor signs off → Milestone 3 unlocks",
                      ].map((t, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[12px] font-mono-custom text-slate-600">
                          <span className="text-yellow-600 mt-0.5 flex-shrink-0">→</span>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Unlock banner */}
              <div className="flex gap-4 mt-2">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300 flex-shrink-0 z-10 bg-slate-50 border-2 border-slate-100 text-lg">
                  🔒
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-6 py-5 relative overflow-hidden">
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-5xl opacity-10">✨</div>
                    <span className="text-4xl flex-shrink-0">🏆</span>
                    <div className="flex-1">
                      <div className="font-display font-extrabold text-[16px] text-emerald-800 mb-1">
                        Milestone 3 awaits: Auth &amp; Middleware
                      </div>
                      <div className="text-[12px] text-emerald-700">
                        Complete Checkpoint 2 to unlock JWT auth, sessions, and role-based access control.
                      </div>
                    </div>
                    <button className="bg-emerald-500 text-white font-display font-bold text-[12px] px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0">
                      Book Checkpoint →
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </main>

          {/* ══ RIGHT PANEL ══ */}
          <aside className="w-[308px] flex-shrink-0 bg-white border-l border-purple-100 overflow-y-auto">
            <div className="p-5 space-y-6">

              {/* Stats */}
              <div>
                <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-3">At a Glance</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "3",    color: "text-emerald-500", lbl: "Checkpoints" },
                    { val: "🔥 12", color: "text-orange-500",  lbl: "Day streak" },
                    { val: "#7",   color: "text-purple-600",  lbl: "Leaderboard" },
                    { val: "82",   color: "text-slate-800",   lbl: "Avg. score" },
                  ].map(({ val, color, lbl }) => (
                    <div key={lbl} className="bg-slate-50 border border-purple-50 rounded-2xl p-3.5 text-center hover:border-purple-100 transition-colors">
                      <div className={`font-display font-extrabold text-2xl ${color} leading-none mb-1`}>{val}</div>
                      <div className="text-[10px] font-mono-custom text-slate-400">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chat */}
              <div>
                <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-3">AI Build Companion</div>
                <div className="bg-slate-50 border border-purple-100 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-purple-50 border-b border-purple-100">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="ml-1.5 text-[11px] font-mono-custom text-purple-500">companion · Lesson 2.3</span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {CHAT.map((m, i) => (
                      <div key={i} className={`flex gap-2 ${m.role === "user" ? "" : ""}`}>
                        <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-mono-custom font-semibold mt-0.5
                          ${m.role === "user" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" : "bg-purple-100 text-purple-700"}
                        `}>
                          {m.role === "user" ? "You" : "🤖"}
                        </div>
                        <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed max-w-[calc(100%-32px)]
                          ${m.role === "user"
                            ? "bg-yellow-50 border border-yellow-200 text-slate-700 font-mono-custom"
                            : "bg-purple-50 border border-purple-100 text-slate-600"
                          }
                        `}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 border-t border-purple-50">
                    <input
                      readOnly
                      placeholder="Ask anything about Lesson 2.3…"
                      className="flex-1 bg-white border border-purple-100 rounded-lg px-3 py-1.5 text-[11px] font-mono-custom text-slate-400 outline-none"
                    />
                    <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xs cursor-pointer hover:opacity-85 transition-opacity shadow-md shadow-purple-200">
                      ↑
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentor */}
              <div>
                <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-3">Your Mentor</div>
                <div className="bg-slate-50 border border-purple-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xl border-2 border-purple-100 flex-shrink-0">
                      👨‍💻
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-bold text-[14px] text-slate-800">Aryan Mehta</div>
                      <div className="text-[11px] font-mono-custom text-slate-400 mt-0.5">SDE-2 @ Razorpay · 2 yrs exp</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-custom text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      Online
                    </div>
                  </div>
                  <div className="bg-white border border-yellow-200 rounded-xl p-3.5 text-[12px] text-slate-500 leading-relaxed">
                    Checkpoint 2 review ready to schedule. Aryan reviewed Lessons 2.1–2.2 and left pre-notes for you.
                    <button className="mt-2.5 w-full bg-yellow-400 text-slate-800 font-display font-bold text-[12px] py-2.5 rounded-xl shadow-md shadow-yellow-100 hover:opacity-90 transition-opacity">
                      📅 Book Checkpoint 2 Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Leaderboard */}
              <div>
                <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-3">Backend Path · Leaderboard</div>
                <div className="space-y-1.5">
                  {LEADERBOARD.map((s) => (
                    <div key={s.rank} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-colors
                      ${s.isYou
                        ? "bg-purple-50 border-purple-200"
                        : "bg-slate-50 border-transparent hover:border-purple-100"
                      }`}
                    >
                      <div className="w-6 text-center text-sm flex-shrink-0">
                        {s.medal || <span className="text-[11px] font-mono-custom text-slate-400">{s.rank}</span>}
                      </div>
                      <div className={`flex-1 text-[12px] font-mono-custom ${s.isYou ? "text-purple-700 font-semibold" : "text-slate-600"}`}>
                        {s.name}
                      </div>
                      <div className={`text-[11px] font-mono-custom font-semibold ${s.isYou ? "text-purple-600" : "text-slate-400"}`}>
                        {s.pts} pts{s.isYou ? " · ↑2" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Up next */}
              <div>
                <div className="text-[10px] font-mono-custom text-slate-400 uppercase tracking-widest mb-3">Up Next</div>
                <div className="bg-slate-50 border border-purple-100 rounded-2xl p-4 space-y-0">
                  {[
                    { dot: "purple", text: <><strong className="text-slate-700">Checkpoint 2</strong> review with Aryan — explain your API design live</> },
                    { dot: "muted",  text: <>Unlock <strong className="text-slate-700">Milestone 3: Auth &amp; Middleware</strong> — JWT, sessions, RBAC</> },
                    { dot: "muted",  text: <>Apply auth to <strong className="text-slate-700">Job Tracker</strong> — protect routes with role-based access</> },
                  ].map(({ dot, text }, i) => (
                    <div key={i} className={`flex items-start gap-2.5 py-2.5 ${i < 2 ? "border-b border-purple-50" : ""}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dot === "purple" ? "bg-purple-500" : "bg-slate-300"}`} />
                      <div className="text-[12px] font-mono-custom text-slate-500 leading-relaxed">{text}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* ══ FLOATING NUDGE ══ */}
      {!nudgeDismissed && (
        <div className="fixed bottom-6 left-1/2 nudge-enter flex items-center gap-3 bg-white border-2 border-purple-200 rounded-2xl px-5 py-3 shadow-2xl shadow-purple-100 z-[200]">
          <span className="text-lg">🤖</span>
          <span className="text-[13px] text-slate-600">
            <strong className="text-purple-700">AI Companion</strong> — you've been on Lesson 2.3 for 25 mins. Still stuck?
          </span>
          <button className="bg-purple-600 text-white font-display font-bold text-[12px] px-4 py-2 rounded-xl shadow-md shadow-purple-200 hover:opacity-90 transition-opacity whitespace-nowrap ml-1">
            Ask it →
          </button>
          <button
            onClick={() => setNudgeDismissed(true)}
            className="text-slate-300 hover:text-slate-500 text-xl leading-none transition-colors ml-1"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}