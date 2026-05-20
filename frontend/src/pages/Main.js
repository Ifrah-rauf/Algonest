import { Link } from "react-router-dom";
import AlgoPlane from "../static/AlgoPlane.png";
import AlgoNest2 from "../static/AlgoNest2.PNG";
import bg7 from "../static/bg7.png";
import m1 from "../static/m1.png";
import m2 from "../static/m2.png";
import m3 from "../static/m3.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useInView } from "react-intersection-observer";
import HowItWorksScroll from "../components/howitworks.jsx";
import roadmap from "../static/roadmap.png"
import Paper from "../static/paper2.jpg";
import review from "../static/review.png"
import StudentDashboard from "../components/s_dashboard2.jsx"
import TeacherDashboard from "../components/t_dashboard.jsx"
import Comparison from "../components/comparison.jsx";
const C = {
  purple: "#6b46c1",
  purpleDark: "#4c1d95",
  purpleLight: "#f3eeff",
  purpleTint: "#ede9fa",
  yellow: "#f6c90e",
  yellowLight: "#fff8dd",
  ink: "#21153f",
  muted: "#766f8e",
  border: "#e8e1f5",
  bg: "#faf8ff",
  white: "#ffffff",
  green: "#16a34a",
  greenLight: "#dcfce7",
  blue: "#0ea5e9",
  blueLight: "#e0f2fe",
  red: "#dc2626",
  redLight: "#fef2f2",
};
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

const PAID_FEATURES = [
  { icon: "👨‍💻", title: "1+4 Live Checkpoint Reviews",   desc: "Your mentor assesses your work like a senior colleague — not grading, but asking if you're truly ready." },
  { icon: "🎤", title: "Interview Coaching Sessions",    desc: "2–3 sessions on how you communicate under pressure. Confidence, clarity, real feedback." },
  { icon: "🏆", title: "Mentor Scorecards & Cohort Access",   desc: "Track readiness with your mentor and stay aligned with the cohort without turning it into a leaderboard." },
  { icon: "✅", title: "Verified Portfolio Entry",       desc: "Checkpoint history + mentor sign-off = evidence employers can actually assess." },
  { icon: "🤝", title: "Mentor Referral Network",       desc: "When you're ready, your mentor opens doors backed by real evidence — not a hollow LinkedIn endorsement." },
  { icon: "📊", title: "Progress Tracking Dashboard",   desc: "Every session, streak, and checkpoint — visible to you and your mentor. No hiding, no coasting." },
];

const AI_CHAT = [
  { role: "user", msg: "Can you just write the auth middleware for me?" },
  { role: "ai",   msg: "I won't write it — but let's think through it. What should middleware do before a request reaches your route handler?" },
  { role: "user", msg: "Validate the token…" },
  { role: "ai",   msg: "Exactly. And what if it's invalid? Now write just that logic — one function, 8 lines max. Show me when ready." },
];

const TESTIMONIALS = [
  { name: "Aakash Verma", role: "Now @ Razorpay", text: "I finished 4 online programs and still couldn't answer 'tell me about a project you built.' AlgoNest fixed that in 3 months.", av: "AV" },
  { name: "Sneha Patel",  role: "Now @ Zepto",    text: "The mentor didn't teach me — they pushed me to think. That difference got me the offer.", av: "SP" },
  { name: "Ravi Kumar",   role: "Now @ Groww",    text: "The AI companion blocked me from copy-pasting. Annoying at first. Best thing that happened to me.", av: "RK" },
];

/* ── pill badge ── */
function Pill({ children, light }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
      light
        ? "bg-white/10 border-white/20 text-white"
        : "bg-[#6b46c1]/10 border-[#6b46c1]/20 text-[#6b46c1]"
    }`}>
      {children}
    </span>
  );
}

/* ── section label ── */
function SectionLabel({ children, dark }) {
  return (
    <div className={`inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6 ${
      dark
        ? "bg-[#f6c90e]/15 text-[#f6c90e]"
        : "bg-[#6b46c1]/10 text-[#6b46c1]"
    }`}>
      {children}
    </div>
  );
}

/* ── screenshot collage card ── */
function CollageSection({ label, headline, sub, cta, ctaLink, children, dark, flip }) {
  return (
    <section className={`py-24 ${dark ? "bg-[#0f0020]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${flip ? "lg:grid-flow-col-dense" : ""}`}>

          {/* Text */}
          <motion.div
            variants={containerVariants} initial="hidden"
            whileInView="show" viewport={{ once: true, amount: 0.3 }}
            className={flip ? "lg:col-start-2" : ""}
          >
            <motion.div variants={itemVariants}>
              <SectionLabel dark={dark}>{label}</SectionLabel>
            </motion.div>
            <motion.h2 variants={itemVariants}
              className={`text-4xl lg:text-5xl font-bold leading-tight mb-5 ${dark ? "text-gray-300" : "text-[#1a0533]"}`}
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <motion.p variants={itemVariants}
              className={`text-lg leading-relaxed mb-8 max-w-md ${dark ? "text-white" : "text-gray-400"}`}>
              {sub}
            </motion.p>
            {cta && (
              <motion.div variants={itemVariants}>
                <Link to={ctaLink || "/"} className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all ${
                  dark
                    ? "bg-[#f6c90e] text-[#1a0533] hover:bg-yellow-300"
                    : "bg-[#6b46c1] text-white hover:bg-purple-700"
                }`}>
                  {cta} →
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Screenshot collage */}
          <motion.div
            variants={fadeIn} initial="hidden"
            whileInView="show" viewport={{ once: true, amount: 0.2 }}
            className={`relative ${flip ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ExecutionTimelineSection() {
  const steps = [
    {
      step: "01",
      title: "Project Roadmaps",
      tone: "#0ea5e9",
      glow: "rgba(14,165,233,0.16)",
      text: "Build the project first. Prove you can ship, document, and explain the decisions behind the work.",
    },
    {
      step: "02",
      title: "CS Fundamentals",
      tone: "#7c3aed",
      glow: "rgba(124,58,237,0.16)",
      text: "Lock down DSA, OOP, DBMS, OS, and DCCN so the interview room cannot shake the foundation.",
    },
    {
      step: "03",
      title: "Grill Sessions",
      tone: "#f59e0b",
      glow: "rgba(245,158,11,0.16)",
      text: "Pressure-test the story with a placed professional who reviews your resume, choices, and depth like an interviewer.",
    },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em]" style={{ color: C.purple }}>
              Execution timeline
            </div>
            <h3 className="mt-2 text-3xl font-bold leading-tight md:text-4xl" style={{ color: C.ink }}>
              Project first, fundamentals second, pressure last.
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 md:text-base" style={{ color: C.muted }}>
            The order matters. Each stage sets up the next one, so the line moves left to right with no shortcuts.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-10 hidden h-[3px] rounded-full bg-gray-200 md:block" />
          <motion.div
            className="absolute left-0 right-0 top-10 hidden h-[3px] rounded-full md:block"
            style={{
              background: "linear-gradient(90deg, #0ea5e9 0%, #7c3aed 54%, #f59e0b 100%)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.4 }}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.35 }}
                className="relative pt-0 md:pt-14"
              >
                <div className="mb-4 flex items-center gap-3 md:mb-6 md:block">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 bg-white shadow-[0_10px_30px_rgba(33,21,63,0.08)]"
                    style={{ borderColor: step.tone }}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        background: step.tone,
                        boxShadow: `0 0 0 12px ${step.glow}`,
                        animation: "nodePulse 2.4s ease-in-out infinite",
                        animationDelay: `${index * 180}ms`,
                      }}
                    />
                  </div>
                  <div className="md:mt-3">
                    <div className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: step.tone }}>
                      {step.step}
                    </div>
                    <h4 className="mt-1 text-2xl font-bold" style={{ color: C.ink }}>
                      {step.title}
                    </h4>
                  </div>
                </div>

                <div
                  className="rounded-3xl border bg-white p-5 shadow-[0_16px_36px_rgba(33,21,63,0.06)]"
                  style={{ borderColor: `${step.tone}28` }}
                >
                  <div
                    className="mb-4 h-1.5 w-20 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${step.tone}, transparent)` }}
                  />
                  <p className="text-sm leading-7" style={{ color: C.muted }}>
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes nodePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
        `}</style>
      </div>
    </section>
  );
}

function JourneyPathSection() {
  return (
    <section className="relative bg-[#0f0020] py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[-8%] h-72 w-72 rounded-full bg-[#6b46c1]/25 blur-3xl" />
        <div className="absolute top-8 right-[-6%] h-80 w-80 rounded-full bg-[#f6c90e]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionLabel dark>Path to Opportunity</SectionLabel>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Build the route. Defend the route. Place with evidence.
            </h2>
            <p className="text-white/60 text-lg leading-8 max-w-2xl">
              The timeline above sets the order. This visual shows the same system in action:
              a project route, an AI companion that challenges your thinking, and the checkpoint trail that proves the work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Project first",
                "CS second",
                "Grill last",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative h-[420px] w-full max-w-[560px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f0ecfc] to-[#e8e3f8] border border-white/10 shadow-2xl shadow-black/20">
                <img src={roadmap} alt="Platform roadmap" className="w-full h-full object-cover object-top opacity-90 p-2" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#1a0533] rounded-2xl p-5 w-64 shadow-2xl border border-white/10">
                <p className="text-[#f6c90e] text-xs font-bold mb-3">🤖 AI Build Companion</p>
                <div className="space-y-2">
                  <div className="bg-white/10 rounded-lg p-2.5">
                    <p className="text-white/50 text-[10px] mb-1">You</p>
                    <p className="text-white text-xs">Write middleware for me?</p>
                  </div>
                  <div className="bg-[#6b46c1]/40 rounded-lg p-2.5">
                    <p className="text-[#f6c90e] text-[10px] mb-1">Companion</p>
                    <p className="text-white text-xs">What should middleware check before the route runs?</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 rounded-xl bg-[#f6c90e] px-4 py-3 shadow-lg">
                <p className="text-[#1a0533] text-xs font-bold">⚡ Quiz Passed</p>
                <p className="text-[#1a0533]/70 text-[10px]">Express Routing · 9/10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Landing() {
  const [aiTab, setAiTab] = useState("free");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!user?.uid) {
    setLoading(false);
    return;
  }

  async function loadDashboard() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/dashboard/getDashboard/${user.uid}`
      );
      const data = await res.json();

      if (data.success) {
        setRole(data.message);
        setDashboardData(data.data);
        console.log("ROLE: ", data.message);
        console.log("DASHBOARD DATA: ", data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadDashboard();
}, [user]);
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-[60vh] flex items-center justify-center text-gray-500">
          Loading your dashboard...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
        {role === "STUDENT" && (
          <StudentDashboard 
            data={dashboardData}
          />
        )}

        {role === "TEACHER" && (
          <TeacherDashboard data={dashboardData} />
        )}
        {!role && (
        <main className="text-[#333333] overflow-x-hidden">
        <section
          className="relative bg-no-repeat bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${bg7})` }}
        >
          <div className="relative max-w-7xl mx-auto px-6 pt-[7%] pb-0 text-center">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-white/80 border border-purple-200 rounded-full px-5 py-2 text-sm font-semibold text-[#6b46c1] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#f6c90e] animate-pulse" />
                One stop for Placement preparation
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight pt-[3%]"
            >
              Get job-ready results with
              <br />
              <span className="text-[#6b46c1]">
                 expert, clear milestones, and guaranteed outcomes.</span><br />
              {/* <span className="text-[#f6c90e] text-shadow-lg">sharper</span> */}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed"
            >
              <span className="text-[#f6c90e]">Ditch the hype, build real skills.</span>
              <br />Take ownership of the work. Prepare the fundamentals, build the proof,
              and walk into the room with someone who can vouch for you at the end.
            </motion.p>

            {/* Product strong points — pill grid */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
              className="mt-8 flex flex-wrap justify-center gap-2.5"
            >
              {[
                ["• Build your own idea on structured path"],
                ["• Mentors who guide you on your idea and tech stack"],
                ["• Interview Preparation of the same idea"],
                ["• Deploy and showcase publicly"],
                ["• Unlock Job Opportunities"],
              ].map(([icon, label]) => (
                <span key={label} className="inline-flex items-center gap-1.5 bg-white/80 border border-purple-100 rounded-full px-4 py-2 text-sm font-medium text-[#4a3080] shadow-sm backdrop-blur-sm">
                  <span>{icon}</span> {label}
                </span>
              ))}
            </motion.div> */}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="mt-8 flex flex-wrap justify-center gap-4 items-center mb-24 "
            >
              <Link to="/careerQuiz"
                className="bg-[#6b46c1] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300">
                Start Free Preview →
              </Link>
              <Link to="/#journey"
                className="text-[#6b46c1] font-semibold hover:underline underline-offset-4 flex items-center gap-1.5">
                See the assessment system ↓
              </Link>
            </motion.div>
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
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <svg width="400" height="200" viewBox="0 0 400 200">
              <circle cx="350" cy="50" r="120" fill="white"/>
              <circle cx="200" cy="160" r="80" fill="white"/>
            </svg>
          </div>
          <div className="max-w-6xl mx-auto text-center px-6 relative z-10">
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="text-3xl md:text-4xl font-medium leading-relaxed max-w-3xl mx-auto"
            >
              AlgoNest does not teach students.{" "}
              <span className="bg-[#f6c90e] text-[#1a0533] px-2 rounded font-bold">It prepares them to prove</span>{" "}
              what they know in front of a human who will not let them bluff.
            </motion.p>

            <motion.div
              variants={containerVariants} initial="hidden"
              whileInView="show" viewport={{ once: true }}
              className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { v: "80%",    l: "Engineers struggle to defend project decisions" },
                { v: "~5%",    l: "People finish passive online programs" },
                { v: "₹9,999", l: "Full assessment system. No hidden fees." },
                { v: "1+4",     l: "Live mentor checkpoint reviews" },
              ].map((s, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="text-4xl font-extrabold text-[#f6c90e] mb-2">{s.v}</div>
                  <div className="text-white/65 text-sm leading-relaxed">{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none">
            <path fill="#ffffff" d="M0,20 C24,36 72,36 96,20 C120,4 168,4 192,20 C216,36 264,36 288,20 C312,4 360,4 384,20 C408,36 456,36 480,20 C504,4 552,4 576,20 C600,36 648,36 672,20 C696,4 744,4 768,20 C792,36 840,36 864,20 C888,4 936,4 960,20 C984,36 1032,36 1056,20 C1080,4 1128,4 1152,20 C1176,36 1224,36 1248,20 C1272,4 1320,4 1344,20 C1368,36 1416,36 1440,20 L1440,40 L0,40 Z"/>
          </svg>
        </section>

        {/* ══════════════════════════════════════════
            THE PROBLEM
        ══════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div variants={itemVariants}>
                  <div className="inline-flex items-center rounded-full border border-[#6b46c1]/15 bg-[#f4efff] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#6b46c1]">
                    THE REAL PROBLEM
                  </div>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#1a0533] md:text-5xl"
                >
                  You have studied for months.
                  <br />
                  Still not ready
                </motion.h2>



                <div className="relative z-10 mt-8 space-y-3">
                  {[
                    "You can list three projects on your resume but cannot explain why you made the decisions in any",
                    "You have watched DSA videos for six months but you freeze when someone asks you to explain",
                    "You don't know which companies you can actually crack now and which ones need four more weeks of specific work.",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(33,21,63,0.04)]"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f6c90e]/20 text-xs font-bold text-[#b7791f]">
                        •
                      </span>
                      <p className="text-sm leading-7 text-gray-700">{t}</p>
                    </div>
                  ))}
                </div>

                <motion.p
                  variants={itemVariants}
                  className="mt-8 max-w-2xl text-xl font-semibold leading-8 text-[#1a0533]"
                >
                  That honest conversation is exactly what AlgoNest is built around.
                </motion.p>

                <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/careerQuiz"
                    className="rounded-lg bg-[#6b46c1] px-8 py-3.5 font-semibold text-white shadow-lg shadow-purple-100 transition-all hover:bg-purple-700"
                  >
                    Start Free Preview →
                  </Link>
                  <Link
                    to="/#howitworks"
                    className="self-center font-semibold text-[#6b46c1] underline-offset-4 hover:underline"
                  >
                    See how it works ↓
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                className="flex items-start justify-center"
              >
                <div
                  className="mt-8 w-full max-w-xl rounded-3xl border border-gray-200 p-6 shadow-[0_18px_50px_rgba(33,21,63,0.08)]"
                  style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.48)), url(${Paper})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="flex items-center justify-between gap-4 mt-8">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: C.purple }}>
                        Scorecard
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-[#1a0533]">
                        Readiness Verdict - 2 weeks away
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-gray-500">
                        Session notes from a placed reviewer, written the way a mentor would record them.
                      </p>
                    </div>
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-8 border-[#f3eeff] bg-white shadow-inner">
                      <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                        <path
                          d="M18 2.2a15.8 15.8 0 1 1 0 31.6a15.8 15.8 0 1 1 0-31.6"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="4"
                        />
                        <motion.path
                          d="M18 2.2a15.8 15.8 0 1 1 0 31.6a15.8 15.8 0 1 1 0-31.6"
                          fill="none"
                          stroke="#6b46c1"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="78.8"
                          initial={{ strokeDashoffset: 78.8 }}
                          whileInView={{ strokeDashoffset: 18.5 }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                          viewport={{ once: true, amount: 0.4 }}
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f8fbff] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#0369a1" }}>
                          Companies you can target now
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {["Zoho", "Capgemini", "Infosys Digital"].map((company) => (
                            <span
                              key={company}
                              className="rounded-full border border-[#93c5fd] bg-white px-3 py-1 text-xs font-semibold text-[#1d4ed8]"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#fee2e2] bg-[#fffafa] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: "#b91c1c" }}>
                          Biggest gap
                        </div>
                        <p className="mt-2 text-sm leading-7 text-gray-700">
                          Cannot explain auth flow decisions under pressure.
                        </p>
                      </div>
                    </div>

                    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-[#fafafa] p-4">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.purple }}>
                          Mentor note
                        </div>
                        <p className="mt-3 text-sm leading-7 text-gray-700">
                          “You know the solution. Now make the reasoning impossible to shake.”
                        </p>
                      </div>
                      <div className="mt-6 rounded-2xl bg-[#f4efff] p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.purple }}>
                          Skill confidence
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #6b46c1, #f6c90e)" }}
                            initial={{ width: 0 }}
                            whileInView={{ width: "68%" }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true, amount: 0.4 }}
                          />
                        </div>
                        <div className="mt-2 text-xs font-medium text-gray-600">Gap narrowed by session feedback</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        <ExecutionTimelineSection />
        <div id="journey">
          <JourneyPathSection />
        </div>

        {/* ══════════════════════════════════════════
            CS FUNDAMENTALS
        ══════════════════════════════════════════ */}
        <CollageSection
          label="CS Fundamentals"
          headline='Know it. Explain it. Defend it.<br /><span class="text-[#6b46c1]">Company-wise curated patterns + quizzes</span>'
          sub="DSA, OOP, DBMS, OS, and DCCN. Curated by company, backed by quiz prompts, and mapped to the patterns interviewers actually press on."
          cta="Explore CS Fundamentals + Quiz + Pattern Plans"
          ctaLink="/roadmaps"
          dark={false}
        >
          <div className="grid h-[420px] rounded-3xl border border-purple-100 bg-[#faf8ff] p-6 shadow-[0_18px_50px_rgba(107,70,193,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: C.purple }}>
                  Company-wise curated
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#1a0533]">
                  Pattern plans that force explanation under pressure.
                </h3>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#6b46c1] shadow-sm">
                Quiz + Pattern Plans
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
                  Topics
                </div>
                <div className="">
                  {[
                    ["DSA", "Prove the approach, not just the answer."],
                    ["OOP", "Defend design choices and tradeoffs."],
                    ["DBMS", "Explain how data survives pressure."],
                    ["OS", "Show process, memory, and concurrency control."],
                    ["DCCN", "Speak clearly about networks under stress."],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-xl border border-gray-100 px-3 py-3">
                      <div className="text-sm font-bold text-[#1a0533]">{title}</div>
                      <div className="mt-1 text-xs leading-6 text-gray-500">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-[#ddd6fe] bg-[#f4efff] p-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: C.purple }}>
                    Curated by company
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Zoho", "Capgemini", "Infosys", "TCS", "Cognizant"].map((company) => (
                      <span key={company} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4c1d95] shadow-sm">
                        {company}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#1a0533]">
                    Pattern plans show what each company tends to press on, so preparation stays specific.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.purple }}>
                    Quiz readiness
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #6b46c1, #f6c90e)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "76%" }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true, amount: 0.3 }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Curated quizzes + pattern plans loaded</div>
                </div>
              </div>
            </div>
          </div>
        </CollageSection>

        {/* ══════════════════════════════════════════
            GRILL SESSIONS
        ══════════════════════════════════════════ */}
        <CollageSection
          label="Grill Sessions"
          headline='Pressure-test the truth.<br /><span class="text-[#f6c90e]">One session tells you what&apos;s real.</span>'
          sub="A placed professional reviews your resume, your project decisions, and your depth. You leave with a verdict, gaps, and what to change next."
          cta="Explore Grill Study Plan"
          ctaLink="/consult"
          dark={true}
          flip={true}
        >
          <div className="relative h-[420px] mt-8">
            <div className="absolute inset-0 rounded-2xl border border-white/10 bg-gradient-to-br from-[#2a0f4a] via-[#1a0533] to-[#0f0020] p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/35 font-bold">Grill Session Result</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Readiness verdict - 2 weeks away
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    Clear, honest feedback. No softening.
                  </p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-8 border-white/10 bg-white/5">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <path
                      d="M18 2.2a15.8 15.8 0 1 1 0 31.6a15.8 15.8 0 1 1 0-31.6"
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="4"
                    />
                    <motion.path
                      d="M18 2.2a15.8 15.8 0 1 1 0 31.6a15.8 15.8 0 1 1 0-31.6"
                      fill="none"
                      stroke="#f6c90e"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="78.8"
                      initial={{ strokeDashoffset: 78.8 }}
                      whileInView={{ strokeDashoffset: 28 }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true, amount: 0.4 }}
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                      Companies you can target now
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Zoho", "Capgemini", "Infosys Digital"].map((company) => (
                        <span key={company} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6c90e]">
                      Biggest gap
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/85">
                      Cannot explain auth flow decisions under pressure.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
                      Mentor note
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/85">
                      “You know the solution. Now make the reasoning impossible to shake.”
                    </p>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#f6c90e]/10 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f6c90e]">
                      Session outcome
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #f6c90e, #fff2ad)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "68%" }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true, amount: 0.3 }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-white/65">Gap narrowed by session feedback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CollageSection>

        {/* ══════════════════════════════════════════
            SECTION 6 — BUILD CV + OPPORTUNITIES
        ══════════════════════════════════════════ */}
        <CollageSection
          label="The Outcome"
          headline='Build your CV.<br /><span class="text-[#f6c90e]">Get real opportunities.</span>'
          sub="Not a certificate. A verified portfolio entry — deployed project, decisions documented, mentor sign-off on record. A professional willing to vouch for you by name."
          cta="Get The Full Package"
          ctaLink="/start"
          dark={true}
          flip={true}
        >
          {/* Portfolio card collage */}
          <div className="relative h-[420px]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2a0f4a] to-[#0f0020] border border-white/10 shadow-2xl p-6">
              {/* Profile header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6b46c1] to-[#f6c90e] flex items-center justify-center text-white font-bold text-lg">IR</div>
                <div>
                  <p className="text-white font-bold">Ifrah Rauf</p>
                  <p className="text-white/50 text-sm">Backend Developer · AlgoNest Verified</p>
                </div>
                <div className="ml-auto">
                  <span className="bg-green-400/20 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-green-400/30">✓ Verified</span>
                </div>
              </div>
              {/* Project card */}
              <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold text-sm">Job Tracker API</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-[#6b46c1]/40 text-[#c4b5fd] px-2 py-0.5 rounded font-mono">Node.js</span>
                    <span className="text-[10px] bg-[#6b46c1]/40 text-[#c4b5fd] px-2 py-0.5 rounded font-mono">Express</span>
                    <span className="text-[10px] bg-[#6b46c1]/40 text-[#c4b5fd] px-2 py-0.5 rounded font-mono">Supabase</span>
                  </div>
                </div>
                <p className="text-white/50 text-xs mb-3">REST API with auth, CRUD, deployment to Render. 6 checkpoints passed.</p>
                <div className="flex gap-2">
                  <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-lg font-mono">🔗 Live Demo</span>
                  <span className="text-xs bg-white/10 text-white/60 px-2.5 py-1 rounded-lg font-mono">📦 GitHub</span>
                </div>
              </div>
              {/* Mentor sign-off */}
              <div className="bg-[#f6c90e]/10 border border-[#f6c90e]/20 rounded-xl p-4">
                <p className="text-[#f6c90e] text-xs font-bold mb-1">Mentor Sign-off</p>
                <p className="text-white/70 text-xs italic">"Ifrah understands every architectural decision. I'd hire her — and I'm referring her to my team at Razorpay."</p>
                <p className="text-white/40 text-[10px] mt-2">— Aryan M., SDE-2 · Razorpay</p>
              </div>
            </div>
          </div>
        </CollageSection>

        {/* ══════════════════════════════════════════
            PATH TO OPPORTUNITY
        ══════════════════════════════════════════ */}
        <Comparison />
        {/* ══════════════════════════════════════════
            FREE vs PAID — TABS
        ══════════════════════════════════════════ */}
        <section id="pricing" className="bg-[#1a0533] py-16">
  <div className="max-w-7xl mx-auto px-6">
    {/* Header */}
    <div className="text-center mb-10">
      <SectionLabel dark>Two Ways In</SectionLabel>
      <h2 className="text-3xl font-bold text-white mb-2">
        Start free. Upgrade when serious.
      </h2>
      <p className="text-white/50 text-sm">
        No credit card. No catch. Just execution.
      </p>
    </div>

    {/* SIDE BY SIDE */}
    <div className="grid md:grid-cols-2 gap-6 items-stretch">

      {/* LEFT — FREE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <span className="inline-block bg-green-400/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Free Tier
          </span>

          <h3 className="text-2xl font-bold text-white mb-4">
            Build with structure. Zero cost.
          </h3>

          <ul className="space-y-3">
            {[
              "Project-first roadmaps from real job descriptions",
              "AI Companion — guides, never builds for you",
              "Role-specific paths (Backend, ML, Frontend, etc.)",
              "Leaderboard — visible progress vs peers",
              "Public profile — proof of work"
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-[#f6c90e] text-lg mt-0.5">✓</span>
                <span className="text-gray-300 text-lg leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/roadmaps"
          className="mt-6 inline-block text-center bg-white text-[#6b46c1] font-semibold px-5 py-3 rounded-lg text-sm hover:bg-gray-100 transition"
        >
          Start Free →
        </Link>
      </div>

      {/* RIGHT — PAID (DOMINANT) */}
      <div className="bg-gradient-to-br from-[#f6c90e]/20 to-[#6b46c1]/20 border border-[#f6c90e]/30 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-extrabold text-white">₹9,999</span>
            <span className="text-white/40 text-sm">/ full route</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-4">
            Outcome. Not content.
          </h3>

          <div className="space-y-3">
            {PAID_FEATURES.slice(0, 5).map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3"
              >
                <div className="text-lg">{f.icon}</div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">
                    {f.title}
                  </p>
                  <p className="text-white/50 text-xs leading-snug">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/start"
          className="mt-6 inline-block text-center bg-[#f6c90e] text-[#333] font-bold px-6 py-3 rounded-lg text-sm hover:bg-yellow-400 transition shadow-md"
        >
          Get Full Package →
        </Link>
      </div>
    </div>
  </div>
</section>

        {/* ══════════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════════ */}
        <div id="howitworks">
          <HowItWorksScroll />
        </div>

        {/* ══════════════════════════════════════════
            MENTORS
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <SectionLabel>Human Layer</SectionLabel>
            <h2 className="text-4xl font-semibold mb-4 text-[#1a0533]">
              Your mentor isn't a teacher.<br />
              <span className="text-[#6b46c1]">They're your advocate.</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              AlgoNest mentors are recent placements (1–3 years in) who remember your exact
              struggle — and have network access you don't yet have.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 justify-items-center"
            variants={containerVariants} initial="hidden"
            whileInView="show" viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { img: m1, title: "Student Mentors",  sub: "Strong fundamentals & execution",  role: "Checkpoint assessment + progress tracking" },
              { img: m2, title: "Corporate Mentors", sub: "Real-world project exposure",      role: "Coaching on professional communication" },
              { img: m3, title: "Industry Experts",  sub: "Advanced guidance & mastery",      role: "Referrals + network introductions" },
            ].map((m, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center">
                <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-[#f6c90e] mb-5 shadow-xl shadow-purple-100">
                  <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-xl text-[#1a0533] mb-1">{m.title}</p>
                <p className="text-sm text-gray-500 mb-3">{m.sub}</p>
                <span className="text-xs bg-[#6b46c1]/10 text-[#6b46c1] px-3 py-1.5 rounded-full font-semibold">{m.role}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 bg-[#f9f7ff] rounded-2xl p-8 border border-purple-100">
            <p className="text-center text-xs text-gray-400 mb-5 font-bold uppercase tracking-widest">Mentors on AlgoNest are NOT</p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Teachers who explain concepts","Tutors who answer every question","On-call WhatsApp support","Code writers who do it for you"].map((t) => (
                <div key={t} className="flex items-center gap-2 bg-white border border-red-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
                  {t}
                </div>
              ))}
            </div>
            <p className="text-center text-[#6b46c1] font-semibold mt-5 text-sm">AI handles Q&A. Mentors handle judgment, coaching, and referrals.</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════ */}
        <section className="bg-[#f9f7ff] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <SectionLabel>Results</SectionLabel>
              <h2 className="text-4xl font-semibold text-[#1a0533]">
                From uncertain candidates<br />
                <span className="text-[#6b46c1]">to placed professionals</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-purple-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="text-5xl text-[#6b46c1]/15 font-serif mb-3">"</div>
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
              <h2 className="text-5xl font-bold leading-tight mb-6 text-white">
                Stop preparing in circles.<br />
                <span className="text-[#f6c90e]">Start proving with intent.</span>
              </h2>
              <p className="text-lg text-purple-100 max-w-xl mb-10 leading-relaxed">
                Real progress comes from a clear plan, an AI that challenges you to think,
                a mentor who validates you under pressure, and a community that keeps you moving.
              </p>
              <div className="flex flex-wrap gap-5 items-center">
                <Link to="/start"
                  className="px-8 py-3.5 rounded-lg font-semibold text-[#333] bg-[#f6c90e] hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">
                  Start with a structured plan →
                </Link>
                <Link to="/consult" className="font-medium text-white underline underline-offset-4">
                  Consult before starting
                </Link>
              </div>
            </div>

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
                <h3 className="text-lg font-bold text-[#1a0533] mb-3">AlgoNest</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  In the AI era, proof beats credentials. AlgoNest turns candidates into
                  placed professionals through structured execution and human validation.
                </p>
              </div>
              {[
                { title: "Product", links: [["How it works","/how-it-works"],["Roadmaps","/roadmaps"],["AI Companion","/ai"],["Mentorship","/mentorship"],["Leaderboard","/community"]] },
                { title: "Paths",   links: [["Backend Dev","/paths"],["Full Stack","/paths"],["ML Engineer","/paths"],["Frontend Dev","/paths"],["DevOps","/paths"]] },
                { title: "Company", links: [["About AlgoNest","/about"],["For Mentors","/mentors"],["Consult","/consult"],["Contact","/contact"],["Privacy","/policies/privacy"]] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-bold text-[#1a0533] mb-4">{col.title}</h4>
                  <ul className="space-y-3 text-sm text-gray-500">
                    {col.links.map(([label, href]) => (
                      <li key={label}><Link to={href} className="hover:text-[#6b46c1] transition-colors">{label}</Link></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} AlgoNest. All rights reserved.</p>
              <p className="text-sm text-gray-400">Built for proof, not passive consumption.</p>
            </div>
          </div>
        </footer>
      </main>)}
    </>
  );
}
