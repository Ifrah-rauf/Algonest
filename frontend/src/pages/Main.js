import { Link } from "react-router-dom";
import AlgoPlane from "../static/AlgoPlane.png";
import AlgoNest2 from "../static/AlgoNest2.PNG";
import page from "../static/page.jpg";
import bg7 from "../static/bg7.png";
import m1 from "../static/m1.png";
import m2 from "../static/m2.png";
import m3 from "../static/m3.png";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useInView } from "react-intersection-observer";
import HowItWorksScroll from "../components/howitworks.jsx";
import RoadmapsSection from "../components/roadmaps.jsx";
import Illustration from "../components/illustration.jsx";

/* ── animation variants ── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: -36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/* ── leaderboard mock data ── */
const LEADERBOARD = [
  { rank: 1, name: "Priya S.", path: "Backend Dev", cp: 5, score: 94, streak: 18, medal: "🥇" },
  { rank: 2, name: "Arjun M.", path: "Full Stack",  cp: 4, score: 91, streak: 14, medal: "🥈" },
  { rank: 3, name: "Neha K.", path: "ML Engineer",  cp: 6, score: 89, streak: 21, medal: "🥉" },
  { rank: 4, name: "Rohit V.", path: "Backend Dev", cp: 3, score: 85, streak: 9,  medal: null },
  { rank: 5, name: "Fatima Z.", path: "Frontend Dev",cp: 4, score: 83, streak: 12, medal: null },
];

/* ── paid features ── */
const PAID_FEATURES = [
  { icon: "👨‍💻", title: "12 Live Checkpoint Reviews", desc: "At each milestone, your mentor assesses your work like a senior colleague — not grading, but asking if you're truly ready." },
  { icon: "🎤", title: "Interview Coaching Sessions", desc: "2–3 sessions focused on how you communicate, not just what you know. Confidence, clarity, real feedback." },
  { icon: "🏆", title: "Leaderboard & Cohort Access", desc: "Compete with peers on quality, consistency, and communication — not just speed." },
  { icon: "✅", title: "Verified Portfolio Entry", desc: "Checkpoint history + mentor sign-off = evidence of understanding employers can actually assess." },
  { icon: "🤝", title: "Mentor Referral Network", desc: "When you're ready, your mentor opens doors backed by real evidence — not a hollow LinkedIn endorsement." },
  { icon: "📊", title: "Progress Tracking Dashboard", desc: "Every session, streak, and checkpoint — visible to you and your mentor. No hiding, no coasting." },
];

/* ── AI chat demo ── */
const AI_CHAT = [
  { role: "user", msg: "Can you just write the auth middleware for me?" },
  { role: "ai",   msg: "I won't write it — but let's think through it. What should middleware do before a request reaches your route handler?" },
  { role: "user", msg: "Validate the token…" },
  { role: "ai",   msg: "Exactly. And what if it's invalid? Now write just that logic — one function, 8 lines max. Show me when ready." },
];

/* ── testimonials ── */
const TESTIMONIALS = [
  { name: "Aakash Verma",  role: "Now @ Razorpay", text: "I finished 4 Udemy courses and still couldn't answer 'tell me about a project you built.' AlgoNest fixed that in 3 months.", av: "AV" },
  { name: "Sneha Patel",   role: "Now @ Zepto",    text: "The mentor didn't teach me — they pushed me to think. That difference got me the offer.", av: "SP" },
  { name: "Ravi Kumar",    role: "Now @ Groww",    text: "The AI companion blocked me from copy-pasting. Annoying at first. Best thing that happened to me.", av: "RK" },
];

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Landing() {
  const [aiTab, setAiTab] = useState("free");

  return (
    <>
      <Navbar />
      <main className="text-[#333333] overflow-x-hidden">

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section
          className="relative bg-no-repeat bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${bg7})` }}
        >
          <div className="relative max-w-7xl mx-auto grid gap-16 items-center justify-center text-center px-6">

            {/* Badge */}
            <div className="mt-8 flex justify-center">
              <span className="inline-flex items-center gap-2 bg-white/80 border border-purple-200 rounded-full px-4 py-1.5 text-sm font-medium text-[#6b46c1] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#f6c90e] animate-pulse" />
                AI-Augmented. Human-Validated. Job-Ready.
              </span>
            </div>

            <div className="mt-[-20px]">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                In the AI era,<br />
                <span className="text-[#6b46c1]">proof beats</span>{" "}
                <span className="text-[#f6c90e]">credentials.</span>
              </h1>

              <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
                Cover your skills gap today. AlgoNest doesn't teach you to code. It proves you can build, explain, and think like a
                professional — then puts a mentor in the room to vouch for you.
              </p>

              {/* Social proof bar */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {["AV","SP","RK","NM","FZ"].map((i, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `hsl(${270+idx*15},60%,${48+idx*4}%)` }}>{i}</div>
                  ))}
                </div>
                <p className="text-sm text-gray-500"><span className="font-semibold text-[#333]">850+ students</span> currently on their path</p>
              </div>

              <div className="mt-8 flex gap-5 justify-center flex-wrap">
                <Link to="/start" className="bg-[#6b46c1] text-white px-8 py-3 rounded-md font-medium hover:bg-[#5a38a8] transition-colors">
                  Start Free — Pick Your Path →
                </Link>
                <Link to="/tour" className="text-[#6b46c1] font-medium self-center hover:underline">
                  See how it works ↓
                </Link>
              </div>
            </div>

            {/* Hero image + floating cards */}
            <div className="hidden md:flex justify-center mt-[-18%] mb-6">
              <img src={AlgoNest2} alt="AlgoNest" className="w-[360px]" />

              {/* AI card */}
              {/* <motion.div
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
                className="absolute right-[10%] top-[5%] bg-white rounded-2xl shadow-xl p-4 max-w-[200px] z-20 border border-purple-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#6b46c1] flex items-center justify-center text-white text-xs">🤖</div>
                  <span className="text-xs font-semibold">AI Companion</span>
                </div>
                <p className="text-xs text-gray-500">"What data structure would work best here — and why?"</p>
              </motion.div> */}
            </div>
          </div>

          {/* Wave */}
          <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
            <path fill="#6b46c1" d="M0,20 C24,36 72,36 96,20 C120,4 168,4 192,20 C216,36 264,36 288,20 C312,4 360,4 384,20 C408,36 456,36 480,20 C504,4 552,4 576,20 C600,36 648,36 672,20 C696,4 744,4 768,20 C792,36 840,36 864,20 C888,4 936,4 960,20 C984,36 1032,36 1056,20 C1080,4 1128,4 1152,20 C1176,36 1224,36 1248,20 C1272,4 1320,4 1344,20 C1368,36 1416,36 1440,20 L1440,40 L0,40 Z"/>
          </svg>
        </section>

        {/* ══════════════════════════════════════════
            PURPLE TAGLINE BAND
        ══════════════════════════════════════════ */}
        <section className="relative bg-[#6b46c1] text-white py-20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 opacity-10">
            <svg width="400" height="200" viewBox="0 0 400 200">
              <circle cx="350" cy="50" r="120" fill="white" />
              <circle cx="200" cy="160" r="80" fill="white" />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
            <p className="text-3xl font-medium leading-relaxed max-w-3xl mx-auto">
              AlgoNest doesn't sell courses.{" "}
              <span className="bg-[#f6c90e] text-[#333333] px-2 rounded">It sells completion</span>{" "}
              — with an AI that guides you and a human who vouches for you.
            </p>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { v: "80%", l: "Eng grads can't find relevant roles" },
                { v: "~5%", l: "MOOC completion rate globally" },
                { v: "₹9,999", l: "All-in package. No hidden fees." },
                { v: "12", l: "Live mentor checkpoint reviews" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-4xl font-extrabold text-[#f6c90e] mb-1">{s.v}</div>
                  <div className="text-white/70 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,20 C24,36 72,36 96,20 C120,4 168,4 192,20 C216,36 264,36 288,20 C312,4 360,4 384,20 C408,36 456,36 480,20 C504,4 552,4 576,20 C600,36 648,36 672,20 C696,4 744,4 768,20 C792,36 840,36 864,20 C888,4 936,4 960,20 C984,36 1032,36 1056,20 C1080,4 1128,4 1152,20 C1176,36 1224,36 1248,20 C1272,4 1320,4 1344,20 C1368,36 1416,36 1440,20 L1440,40 L0,40 Z"/>
          </svg>
        </section>

        {/* ══════════════════════════════════════════
            THE PROBLEM
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              <h2 className="text-4xl font-bold leading-tight mb-6">
                You've watched the tutorials.<br />
                <span className="text-[#6b46c1]">Facing tutorial burnout?</span>
              </h2>
              {/* <p className="text-gray-800 mb-4 leading-relaxed">
                Your current situation could be:<br/>
                • Few months before job application?<br/>
                • Studies and work exhaustion<br/>
                • DSA explode<br/>
                • No time for project building?<br/>

              </p> */}
                <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "No fixed roadmap or guidance?",
                  "Few months before job application?",
                  "Studies, DSA and work exhaustion",
                  "No time for project building?",
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-m text-gray-700 bg-white shadow-sm">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
                    {t}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-2xl font-semibold">
                Stop hopping.<br /><span className="text-[#6b46c1]">Start building.</span>
              </p>
            </div>

            {/* Right — illustration */}
            <div className="flex justify-center">
              <svg width="340" height="300" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background card */}
                <rect x="20" y="30" width="300" height="240" rx="20" fill="#f9f7ff" stroke="#e9e3ff" strokeWidth="1.5"/>
                {/* Progress bar rows */}
                {[60, 110, 160, 210].map((y, i) => (
                  <g key={i}>
                    <circle cx="55" cy={y} r="16" fill={i < 2 ? "#6b46c1" : "#e5e7eb"}/>
                    <text x="55" y={y+5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{i+1}</text>
                    <rect x="80" y={y-8} width={i < 2 ? 180 : 60} height="16" rx="8" fill={i < 2 ? "#6b46c1" : "#e5e7eb"} opacity={i < 2 ? 1 : 0.5}/>
                    {i < 2 && <text x="270" y={y+5} fill="#6b46c1" fontSize="11" fontWeight="bold">✓</text>}
                  </g>
                ))}
                {/* "You are here" label */}
                <rect x="82" y="144" width="100" height="28" rx="6" fill="#f6c90e"/>
                <text x="132" y="163" textAnchor="middle" fill="#333" fontSize="11" fontWeight="bold">You are here</text>
                {/* Checkpoint badge */}
                <rect x="190" y="20" width="110" height="40" rx="10" fill="white" stroke="#e9e3ff" strokeWidth="1.5"/>
                <text x="245" y="38" textAnchor="middle" fill="#6b46c1" fontSize="11" fontWeight="600">Checkpoint 2</text>
                <text x="245" y="52" textAnchor="middle" fill="#6b46c1" fontSize="10">In Progress</text>
              </svg>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════
            ROADMAPS
        ══════════════════════════════════════════ */}
        {/* <div id="roadmaps">
          <RoadmapsSection />
        </div> */}
<Illustration/>
        {/* ══════════════════════════════════════════
            FREE vs PAID — TABS
        ══════════════════════════════════════════ */}
        <section id="pricing" className="bg-[#1a0533] py-24">
          <div className="max-w-6xl mx-auto px-6">

            <div className="text-center mb-14">
              <span className="inline-block bg-[#f6c90e]/20 text-[#f6c90e] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">Two Ways In</span>
              <h2 className="text-4xl font-bold text-white mb-3">Start free. Upgrade when serious.</h2>
              <p className="text-white/60">The free tier never expires. No credit card. No catch.</p>
            </div>

            {/* Tab switcher */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/10 rounded-full p-1 flex">
                {[["free","🆓 Free Tier"],["paid","⭐ Paid Package"]].map(([k, label]) => (
                  <button key={k} onClick={() => setAiTab(k)}
                    className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${aiTab === k ? "bg-[#f6c90e] text-[#333]" : "text-white/60 hover:text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {aiTab === "free" ? (
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block bg-green-400/20 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">Always Free</span>
                  <h3 className="text-3xl font-bold text-white mb-6">Everything you need to start building seriously</h3>
                  <ul className="space-y-4">
                    {[
                      "Project-first roadmaps built from real job descriptions",
                      "AI Build Companion — scaffolds, never does it for you",
                      "Role-specific paths: Backend, Full Stack, ML, Frontend & more",
                      "Community leaderboard — see peers on the same path",
                      "Profile & progress visibility — shareable, competitive",
                    ].map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#f6c90e] mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-white/80 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/start" className="mt-8 inline-block bg-white text-[#6b46c1] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
                    Start Free — No Card Needed →
                  </Link>
                </div>

                {/* AI chat demo */}
                <div className="bg-[#0d0020] rounded-3xl p-6 border border-white/10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-2 text-white/40 text-xs">AI Build Companion</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 mb-4">
                    <p className="text-[#f6c90e] text-xs">📍 Backend Dev · Checkpoint 2 · Designing REST API</p>
                  </div>
                  <div className="space-y-3">
                    {AI_CHAT.map((m, i) => (
                      <div key={i} className={`rounded-xl p-3 ${m.role === "user" ? "bg-white/10 ml-8" : "bg-[#6b46c1]/30"}`}>
                        <p className={`text-xs mb-1 ${m.role === "user" ? "text-white/40" : "text-[#f6c90e]"}`}>
                          {m.role === "user" ? "You" : "AI Companion"}
                        </p>
                        <p className="text-white/90 text-xs leading-relaxed">{m.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-10">
                  <div className="inline-flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-extrabold text-white">₹9,999</span>
                    <span className="text-white/40 text-lg">/ complete package</span>
                  </div>
                  <p className="text-white/60">One payment. 3–4 months. One deployed project. One job-ready professional.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {PAID_FEATURES.map((f, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#f6c90e]/30 transition-colors">
                      <div className="text-3xl mb-4">{f.icon}</div>
                      <h4 className="text-white font-bold mb-2">{f.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-10">
                  <Link to="/start" className="inline-block bg-[#f6c90e] text-[#333] font-bold px-10 py-5 rounded-xl text-lg hover:bg-yellow-400 transition-all hover:shadow-2xl hover:shadow-yellow-400/20">
                    Get The Full Package — ₹9,999 →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STICKY NOTES — WHAT YOU GET
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-semibold leading-tight mb-4">
              Stop choosing random mentors.<br />
              <span className="text-[#6b46c1]">Choose the right system.</span>
            </h2>
            <p className="text-gray-600">
              Completion doesn't happen by chance. It needs structure, flexibility, and visibility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            {[
              { title: "AI Build Companion",    desc: "Your 24/7 guide that asks you questions instead of writing code for you. Contextually aware of your project, your stage, and your weak spots.", pin: "purple" },
              { title: "Live Checkpoint Reviews", desc: "At each milestone, your mentor assesses your explanation like a senior colleague — not a grade, but a readiness check.", pin: "yellow" },
              { title: "Verified Portfolio",    desc: "Not a certificate. A public record of what you built, how you explained it, and that a professional vouched for it.", pin: "purple" },
              { title: "Leaderboard & Community", desc: "See where you stand among peers on the same path. Progress is more motivating when it's visible.", pin: "yellow" },
              { title: "Interview Coaching",    desc: "Your mentor coaches how you communicate under pressure — the thing that separates candidates who know their stuff from those who land the offer.", pin: "purple" },
              { title: "Mentor Referral",       desc: "When you finish, your mentor opens a door. A real introduction backed by real evidence of your work.", pin: "yellow" },
            ].map((n, i) => (
              <div key={i} className={`relative bg-white p-6 w-full max-w-sm rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,0.18)] ${i%3===0?"rotate-[-2deg]":i%3===1?"rotate-[1.5deg]":"rotate-[-1deg]"}`}>
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${n.pin==="purple"?"bg-purple-400":"bg-yellow-400"}`} />
                <h3 className="font-semibold text-lg mb-2">{n.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════ */}
        <div id="howitworks">
          <HowItWorksScroll />
        </div>

        {/* ══════════════════════════════════════════
            LEADERBOARD SECTION
        ══════════════════════════════════════════ */}
        <section className="bg-[#1a0533] py-24">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            <div>
              <span className="inline-block bg-[#f6c90e]/20 text-[#f6c90e] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">Compete and win your spot</span>
              <h2 className="text-4xl font-bold text-white mb-5">
                Progress is more fun<br />
                <span className="text-[#f6c90e]">when it's visible.</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Your rank among peers on the same career path. Updated as you hit checkpoints.
                Ranked on quality, consistency, and communication — not just speed.
              </p>
              <div className="space-y-3">
                {[
                  { l: "Checkpoint Quality",      pct: 40, c: "#6b46c1" },
                  { l: "Weekly Consistency",      pct: 25, c: "#f6c90e" },
                  { l: "Explanation Clarity",     pct: 20, c: "#8b5cf6" },
                  { l: "Community Contribution",  pct: 15, c: "#a78bfa" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">{m.l}</span>
                      <span className="text-white/40">{m.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct*2.2}%`, background: m.c }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard card */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-bold">Backend Developer Path</h4>
                <span className="text-white/40 text-xs">Live Rankings</span>
              </div>
              <div className="space-y-3">
                {LEADERBOARD.map((s, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${i===0?"bg-[#f6c90e]/10 border border-[#f6c90e]/20":"bg-white/5 hover:bg-white/10 transition-colors"}`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i===0?"bg-[#f6c90e] text-[#333]":i===1?"bg-white/20 text-white":i===2?"bg-orange-400/20 text-orange-300":"bg-white/10 text-white/40"}`}>
                      {s.medal || s.rank}
                    </span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{s.name}</p>
                      <p className="text-white/40 text-xs">Checkpoint {s.cp}/6 · {s.streak}-day streak</p>
                    </div>
                    <span className={`font-bold text-sm ${i===0?"text-[#f6c90e]":"text-white/60"}`}>{s.score}</span>
                  </div>
                ))}
                {/* You row */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#6b46c1]/20 border border-[#6b46c1]/40 mt-2">
                  <span className="w-7 h-7 rounded-full bg-[#6b46c1] flex items-center justify-center text-white text-xs font-bold">You</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">Your position</p>
                    <p className="text-white/40 text-xs">Checkpoint 1/6 · Just started</p>
                  </div>
                  <span className="text-[#6b46c1] text-sm font-bold">#24</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════
            MENTORS
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#6b46c1]/10 text-[#6b46c1] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">Human Layer</span>
            <h2 className="text-4xl font-semibold mb-4">
              Your mentor isn't a teacher.<br />
              <span className="text-[#6b46c1]">They're your advocate.</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              AlgoNest mentors are recent placements (1–3 years in) who remember your exact
              struggle — and have network access you don't yet have.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 justify-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { img: m1, title: "Student Mentors",   sub: "Strong fundamentals & execution",  role: "Checkpoint assessment + progress tracking" },
              { img: m2, title: "Corporate Mentors",  sub: "Real-world project exposure",      role: "Coaching on professional communication" },
              { img: m3, title: "Industry Experts",   sub: "Advanced guidance & mastery",      role: "Referrals + network introductions" },
            ].map((m, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center">
                <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-[#f6c90e] mb-5 shadow-lg">
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <p className="font-semibold text-xl text-[#333] mb-1">{m.title}</p>
                <p className="text-sm text-gray-500 mb-2">{m.sub}</p>
                <span className="text-xs bg-[#6b46c1]/10 text-[#6b46c1] px-3 py-1 rounded-full font-medium">{m.role}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* What mentors do NOT do */}
          <div className="mt-16 bg-[#f9f7ff] rounded-2xl p-8 border border-purple-100">
            <p className="text-center text-sm text-gray-500 mb-5 font-medium uppercase tracking-wider">Mentors on AlgoNest are NOT</p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Teachers who explain concepts","Tutors who answer every question","On-call WhatsApp support","Code writers who do it for you"].map((t, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-red-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
                  {t}
                </div>
              ))}
            </div>
            <p className="text-center text-[#6b46c1] font-semibold mt-5">AI handles Q&A. Mentors handle judgment, coaching, and referrals.</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════ */}
        <section className="bg-[#f9f7ff] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-semibold">
                From confused learners<br />
                <span className="text-[#6b46c1]">to placed professionals</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-5xl text-[#6b46c1]/20 font-serif mb-3">"</div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#6b46c1] flex items-center justify-center text-white text-sm font-bold">{t.av}</div>
                    <div>
                      <p className="font-bold text-[#333] text-sm">{t.name}</p>
                      <p className="text-[#6b46c1] text-xs font-semibold">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            OUTRO CTA
        ══════════════════════════════════════════ */}
        <section className="relative bg-[#6b46c1] px-6 py-24 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="500" height="300" viewBox="0 0 500 300">
                <circle cx="400" cy="80" r="160" fill="white"/>
                <circle cx="250" cy="260" r="100" fill="white"/>
              </svg>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-5xl font-semibold leading-tight mb-6 text-white">
                Stop hopping mentors.<br />
                <span className="text-[#f6c90e]">Take a structured flight.</span>
              </h2>
              <p className="text-lg text-purple-100 max-w-xl mb-10 leading-relaxed">
                Real progress comes from a clear plan, an AI that challenges you to think,
                a mentor who validates you're ready, and a community that keeps you moving.
              </p>
              <div className="flex flex-wrap gap-5 items-center">
                <Link to="/start" className="px-8 py-3 rounded-md font-medium text-[#333] bg-[#f6c90e] hover:bg-yellow-400 transition-colors">
                  Start with a structured plan →
                </Link>
                <Link to="/consult" className="font-medium text-white underline underline-offset-4">
                  Consult before starting
                </Link>
              </div>
            </div>

            {/* Airplane */}
            <div className="relative h-[320px]">
              <svg className="absolute inset-0" viewBox="0 0 400 300" fill="none">
                <path d="M20 240 C120 160, 220 180, 340 80" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="6 6"/>
              </svg>
              <div className="relative top-[-210px] right-[-160px]">
                <img src={AlgoPlane} alt="AlgoNest plane" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

              <div>
                <h3 className="text-lg font-semibold text-[#333] mb-3">AlgoNest</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                  In the AI era, proof beats credentials. AlgoNest turns learners into
                  placed professionals through structured execution and human validation.
                </p>
              </div>

              {[
                { title: "Product", links: [["How it works","/how-it-works"],["Roadmaps","/roadmaps"],["AI Companion","/ai"],["Mentorship","/mentorship"],["Leaderboard","/community"]] },
                { title: "Paths",   links: [["Backend Dev","/paths"],["Full Stack","/paths"],["ML Engineer","/paths"],["Frontend Dev","/paths"],["DevOps","/paths"]] },
                { title: "Company", links: [["About AlgoNest","/about"],["For Mentors","/mentors"],["Consult","/consult"],["Contact","/contact"],["Privacy","/policies/privacy"]] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-medium text-[#333] mb-4">{col.title}</h4>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {col.links.map(([label, href]) => (
                      <li key={label}><Link to={href} className="hover:text-[#333]">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>

            <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} AlgoNest. All rights reserved.</p>
              <p className="text-sm text-gray-500">Built for completion, not consumption.</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}