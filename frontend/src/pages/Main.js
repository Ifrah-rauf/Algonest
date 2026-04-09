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
import RoadmapsSection from "../components/roadmaps.jsx";
import Illustration from "../components/illustration.jsx";
import roadmap from "../static/roadmap.png"
import review from "../static/review.png"
import StudentDashboard from "../components/s_dashboard2.jsx"
import TeacherDashboard from "../components/t_dashboard.jsx"
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

const LEADERBOARD = [
  { rank: 1, name: "Priya S.",   path: "Backend Dev",  cp: 5, score: 94, streak: 18, medal: "🥇" },
  { rank: 2, name: "Arjun M.",   path: "Full Stack",   cp: 4, score: 91, streak: 14, medal: "🥈" },
  { rank: 3, name: "Neha K.",    path: "ML Engineer",  cp: 6, score: 89, streak: 21, medal: "🥉" },
  { rank: 4, name: "Rohit V.",   path: "Backend Dev",  cp: 3, score: 85, streak: 9,  medal: null },
  { rank: 5, name: "Fatima Z.",  path: "Frontend Dev", cp: 4, score: 83, streak: 12, medal: null },
];

const PAID_FEATURES = [
  { icon: "👨‍💻", title: "12 Live Checkpoint Reviews",   desc: "Your mentor assesses your work like a senior colleague — not grading, but asking if you're truly ready." },
  { icon: "🎤", title: "Interview Coaching Sessions",    desc: "2–3 sessions on how you communicate under pressure. Confidence, clarity, real feedback." },
  { icon: "🏆", title: "Leaderboard & Cohort Access",   desc: "Compete with peers on quality, consistency, and communication — not just speed." },
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
  { name: "Aakash Verma", role: "Now @ Razorpay", text: "I finished 4 Udemy courses and still couldn't answer 'tell me about a project you built.' AlgoNest fixed that in 3 months.", av: "AV" },
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
              className={`text-4xl lg:text-5xl font-bold leading-tight mb-5 ${dark ? "text-white" : "text-[#1a0533]"}`}
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <motion.p variants={itemVariants}
              className={`text-lg leading-relaxed mb-8 max-w-md ${dark ? "text-white/55" : "text-gray-500"}`}>
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
          <div className="relative max-w-7xl mx-auto px-6 pt-[3%] pb-0 text-center">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-6"
            >
              <span className="inline-flex items-center gap-2 bg-white/80 border border-purple-200 rounded-full px-5 py-2 text-sm font-semibold text-[#6b46c1] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#f6c90e] animate-pulse" />
                One stop for project launch
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-4xl lg:text-5xl font-bold leading-tight"
            >
              Self-paced, personalized project building,<br />
              <span className="text-[#6b46c1]">now <span className="text-[#f6c90e] text-shadow-lg">smarter</span> with AI  <br/>
                and 1:1 mentor.</span><br />
              {/* <span className="text-[#f6c90e]"></span> */}
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed"
            >
              Take your ownership on the project. Learn industry fundamentals
              and build your capstone project in parallel — with someone who vouches
              for you at the end.
            </motion.p>

            {/* Product strong points — pill grid */}
            <motion.div
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
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="mt-8 flex flex-wrap justify-center gap-4 items-center mb-24 "
            >
              <Link to="/careerQuiz"
                className="bg-[#6b46c1] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300">
                Start Free — Pick Your Path →
              </Link>
              <Link to="/#howitworks"
                className="text-[#6b46c1] font-semibold hover:underline underline-offset-4 flex items-center gap-1.5">
                See how it works ↓
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
              AlgoNest doesn't sell courses.{" "}
              <span className="bg-[#f6c90e] text-[#1a0533] px-2 rounded font-bold">It sells ownership</span>{" "}
              — bring your ideas live, with personal study plan.
            </motion.p>

            <motion.div
              variants={containerVariants} initial="hidden"
              whileInView="show" viewport={{ once: true }}
              className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { v: "80%",    l: "Eng grads can't find relevant roles" },
                { v: "~5%",    l: "MOOC completion rate globally" },
                { v: "₹9,999", l: "All-in package. No hidden fees." },
                { v: "12",     l: "Live mentor checkpoint reviews" },
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
            THE QUESTION — CAPSTONE
        ══════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              <motion.div
                variants={containerVariants} initial="hidden"
                whileInView="show" viewport={{ once: true, amount: 0.3 }}
              >
                <motion.div variants={itemVariants}>
                  <SectionLabel>The Problem</SectionLabel>
                </motion.div>
                <motion.h2 variants={itemVariants}
                  className="text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#1a0533]">
                  Have you not started<br />
                  your <span className="text-[#6b46c1]">CAPSTONE</span><br />
                  project yet?
                </motion.h2>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-8">
                  {[
                    "Don't know which cohort or bootcamp is reliable?",
                    "No fixed roadmap or guidance",
                    "Few months before job applications",
                    "Studies, DSA and work exhaustion",
                    "No time for project building",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2 border border-red-100 bg-red-50 rounded-xl px-4 py-2.5 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
                      {t}
                    </div>
                  ))}
                </motion.div>

                <motion.p variants={itemVariants} className="text-2xl font-bold text-[#1a0533] mb-8">
                  Stop hopping.<br />
                  <span className="text-[#6b46c1]">Start building with a plan.</span>
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  <Link to="/careerQuiz"
                    className="bg-[#6b46c1] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
                    Start Free — Pick Your Path →
                  </Link>
                  <Link to="/#howitworks"
                    className="text-[#6b46c1] font-semibold self-center hover:underline underline-offset-4">
                    See how it works ↓
                  </Link>
                </motion.div>
              </motion.div>

              {/* Roadmap mini visual */}
              <motion.div
                variants={fadeUp} initial="hidden"
                whileInView="show" viewport={{ once: true }}
                className="flex justify-center"
              >
                <div className="relative bg-[#faf8ff] border border-purple-100 rounded-3xl p-8 w-full max-w-md shadow-xl shadow-purple-50">
                  <p className="text-xs font-bold text-[#6b46c1] tracking-widest uppercase mb-6">Backend Developer · MERN Path</p>
                  <div className="space-y-4">
                    {[
                      { n: 1, t: "Node.js & JS Runtime",       done: true  },
                      { n: 2, t: "Express Setup & Routing",     done: true  },
                      { n: 3, t: "Middleware & Error Handling",  active: true },
                      { n: 4, t: "REST API Design",             locked: true },
                      { n: 5, t: "Database Integration",        locked: true },
                    ].map((l) => (
                      <div key={l.n} className={`flex items-center gap-4 p-3.5 rounded-xl transition-all ${
                        l.done   ? "bg-green-50 border border-green-200" :
                        l.active ? "bg-[#6b46c1] text-white shadow-lg shadow-purple-200" :
                        "bg-white border border-gray-100 opacity-50"
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          l.done   ? "bg-green-500 text-white" :
                          l.active ? "bg-white text-[#6b46c1]" :
                          "bg-gray-100 text-gray-400"
                        }`}>
                          {l.done ? "✓" : l.n}
                        </div>
                        <span className={`text-sm font-semibold ${l.active ? "text-white" : l.locked ? "text-gray-400" : "text-gray-700"}`}>
                          {l.t}
                        </span>
                        {l.active && <span className="ml-auto text-xs bg-[#f6c90e] text-[#1a0533] px-2.5 py-1 rounded-full font-bold">Active</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[37%] bg-gradient-to-r from-[#6b46c1] to-[#f6c90e] rounded-full" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">3 of 8 lessons · Checkpoint 1 in progress</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SECTION 3 — ROADMAP + AI + QUIZZES
            Screenshot collage block
        ══════════════════════════════════════════ */}
        <CollageSection
          label="Learn & Build in Parallel"
          headline='Roadmap + Quizzes +<br /><span class="text-[#6b46c1]">The AI teaches you how to think like the engineer you will claim to be</span>'
          sub="Follow a structured path built from 100+ real job descriptions. Learn exactly what companies hire for — in the order your project needs it. Every topic has a quiz, a build task, and an AI guide."
          cta="Explore Roadmaps"
          ctaLink="/roadmaps"
          dark={false}
        >
          {/* Screenshot collage */}
          <div className="relative h-[420px]">
            {/* Main screenshot placeholder */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f0ecfc] to-[#e8e3f8] border border-purple-100 shadow-2xl shadow-purple-100">
              <img src={roadmap} alt="Platform roadmap" className="w-full h-full object-cover object-top opacity-90 p-2" />
            </div>
            {/* Floating AI chat card */}
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
            {/* Quiz badge */}
            <div className="absolute -top-4 -right-4 bg-[#f6c90e] rounded-xl px-4 py-3 shadow-lg">
              <p className="text-[#1a0533] text-xs font-bold">⚡ Quiz Passed</p>
              <p className="text-[#1a0533]/70 text-[10px]">Express Routing · 9/10</p>
            </div>
          </div>
        </CollageSection>

        {/* ══════════════════════════════════════════
            SECTION 4 — CHECKPOINTS + MENTOR + GIT
        ══════════════════════════════════════════ */}
        <CollageSection
          label="Get Validated"
          headline='Checkpoints. Mentor reviews.<br /><span class="text-[#f6c90e]">Git repo that&apos;s yours.</span>'
          sub="At each milestone, your mentor reviews your actual project — not a quiz, not a test. A professional conversation: walk me through your auth flow, why JWT? Pass it and your verified badge goes live."
          cta="Book Session 0 — Free"
          ctaLink="/consult"
          dark={true}
          flip={true}
        >
          {/* Screenshot collage */}
          <div className="relative h-[420px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a0f4a] via-[#1a0533] to-[#110021] border border-white/10 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/35 font-bold">Checkpoint Review Room</p>
                  <p className="text-white font-semibold text-sm mt-2">Checkpoint 2 · Authentication & Middleware</p>
                </div>
                <span className="bg-[#f6c90e]/15 text-[#f6c90e] border border-[#f6c90e]/20 text-[10px] font-bold px-3 py-1.5 rounded-full">
                  Live Review
                </span>
              </div>

              <div className="grid grid-cols-[1.2fr_0.8fr] gap-4 h-[calc(100%-52px)]">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6b46c1] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm">
                      AN
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Aryan M.</p>
                      <p className="text-white/40 text-xs">Razorpay · SDE-2 · Mentor Reviewer</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-white/6 border border-white/8 p-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">Review Prompt</p>
                      <p className="text-white text-xs mt-2 leading-relaxed">
                        Walk me through your JWT auth flow. Where does validation happen, and why did you choose middleware over route-level checks?
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#6b46c1]/20 border border-[#8b5cf6]/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#d8ccff] font-bold">Student Explanation</p>
                      <p className="text-white/85 text-xs mt-2 leading-relaxed">
                        Token verification happens before protected routes run. I used middleware so auth logic stays reusable and routes only handle business flow.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        ["Reasoning", "8.8/10"],
                        ["Clarity", "9.1/10"],
                        ["Ownership", "Strong"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-white/6 border border-white/8 px-3 py-3">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 font-bold">{label}</p>
                          <p className="text-white text-xs font-semibold mt-2">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="rounded-xl bg-[#f6c90e]/10 border border-[#f6c90e]/20 px-4 py-3">
                      <p className="text-[#f6c90e] text-[10px] uppercase tracking-[0.18em] font-bold">Mentor Note</p>
                      <p className="text-white/80 text-xs mt-2 italic leading-relaxed">
                        “You didn’t just implement auth. You could explain the tradeoff clearly, which means the system is actually yours.”
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl bg-white text-[#1a0533] p-4 shadow-xl">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b46c1] font-bold">Review Outcome</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">✅</div>
                      <div>
                        <p className="font-bold text-sm">Checkpoint cleared</p>
                        <p className="text-xs text-gray-500">Verified by mentor review</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      <span className="text-[10px] bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">Auth reasoning ✓</span>
                      <span className="text-[10px] bg-purple-100 text-[#6b46c1] px-2.5 py-1 rounded-full font-semibold">Git verified ✓</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 font-bold">Git Activity</p>
                    <div className="mt-3 space-y-2">
                      {[
                        "feat: add auth middleware and token guard",
                        "refactor: protect job routes with reusable middleware",
                        "docs: explain JWT flow in project notes",
                      ].map((commit) => (
                        <div key={commit} className="rounded-xl bg-[#0f0020]/60 border border-white/8 px-3 py-2">
                          <p className="text-[#d6cfff] text-[11px] font-mono">{commit}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#6b46c1]/20 border border-[#8b5cf6]/20 p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#d8ccff] font-bold">Next Unlock</p>
                    <p className="text-white text-sm font-semibold mt-2">Checkpoint 3 opens after quiz + session sign-off</p>
                    <p className="text-white/55 text-xs mt-2 leading-relaxed">
                      Every review compounds into a project trail that mentors can genuinely stand behind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Checkpoint card */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-5 w-72 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-lg">✅</div>
                <div>
                  <p className="font-bold text-sm text-[#1a0533]">Checkpoint 2 — Passed</p>
                  <p className="text-xs text-gray-400">Mentor: Aryan M. · Razorpay SDE-2</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">"Explained JWT flow clearly. Auth middleware decision was well-justified."</p>
              <div className="flex gap-2 mt-3">
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">Explanation ✓</span>
                <span className="text-xs bg-purple-100 text-[#6b46c1] px-2.5 py-1 rounded-full font-semibold">Git Verified ✓</span>
              </div>
            </div>
          </div>
        </CollageSection>

        {/* ══════════════════════════════════════════
            SECTION 5 — COMPETE FOR BEST PROJECT
        ══════════════════════════════════════════ */}
        <CollageSection
          label="Compete & Win"
          headline='Best project wins.<br /><span class="text-[#6b46c1]">Titles + perks.</span>'
          sub="Ranked on checkpoint quality, consistency, explanation clarity, and community contribution. No single metric can be gamed — you have to actually do the work."
          cta="See Leaderboard"
          ctaLink="/community"
          dark={false}
        >
          {/* Leaderboard collage */}
          <div className="relative h-[420px]">
            <div className="absolute inset-4 rounded-2xl bg-[#1a0533] border border-white/10 shadow-2xl overflow-hidden p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-white font-bold text-sm">Backend Developer Path</p>
                <span className="text-[#f6c90e] text-xs font-semibold">Live Rankings</span>
              </div>
              <div className="space-y-3">
                {LEADERBOARD.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${
                    i === 0 ? "bg-[#f6c90e]/10 border border-[#f6c90e]/20" : "bg-white/5"
                  }`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-[#f6c90e] text-[#333]" :
                      i === 1 ? "bg-white/20 text-white" :
                      i === 2 ? "bg-orange-400/20 text-orange-300" :
                      "bg-white/10 text-white/40"
                    }`}>{s.medal || s.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-white/40 text-xs">CP {s.cp}/6 · {s.streak}d streak</p>
                    </div>
                    <span className={`font-bold text-sm ${i === 0 ? "text-[#f6c90e]" : "text-white/50"}`}>{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Scoring breakdown pill */}
            <div className="absolute -top-4 -right-2 bg-white rounded-2xl px-5 py-4 shadow-xl border border-purple-100">
              <p className="text-xs font-bold text-[#6b46c1] mb-2">Score Breakdown</p>
              {[["Quality", 40], ["Consistency", 25], ["Clarity", 20], ["Community", 15]].map(([l, p]) => (
                <div key={l} className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-gray-500 w-20">{l}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#6b46c1] rounded-full" style={{ width: `${p * 2}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400">{p}%</span>
                </div>
              ))}
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
            ILLUSTRATION COMPONENT
        ══════════════════════════════════════════ */}
        <Illustration />

        {/* ══════════════════════════════════════════
            FREE vs PAID — TABS
        ══════════════════════════════════════════ */}
        <section id="pricing" className="bg-[#1a0533] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <SectionLabel dark>Two Ways In</SectionLabel>
              <h2 className="text-4xl font-bold text-white mb-3">Start free. Upgrade when serious.</h2>
              <p className="text-white/50">The free tier never expires. No credit card. No catch.</p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="bg-white/10 rounded-full p-1 flex">
                {[["free","🆓 Free Tier"],["paid","⭐ Paid Package"]].map(([k, label]) => (
                  <button key={k} onClick={() => setAiTab(k)}
                    className={`px-8 py-3 rounded-full font-semibold text-sm transition-all ${
                      aiTab === k ? "bg-[#f6c90e] text-[#333]" : "text-white/60 hover:text-white"
                    }`}>
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
                        <span className="text-white/75 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/start"
                    className="mt-8 inline-block bg-white text-[#6b46c1] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all">
                    Start Free — No Card Needed →
                  </Link>
                </div>

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
                  <p className="text-white/55">One payment. 3–4 months. One deployed project. One job-ready professional.</p>
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
                  <Link to="/start"
                    className="inline-block bg-[#f6c90e] text-[#333] font-bold px-10 py-5 rounded-xl text-lg hover:bg-yellow-400 transition-all hover:shadow-2xl hover:shadow-yellow-400/20">
                    Get The Full Package — ₹9,999 →
                  </Link>
                </div>
              </div>
            )}
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
              <SectionLabel dark>Compete and Win</SectionLabel>
              <h2 className="text-4xl font-bold text-white mb-5">
                Progress is more fun<br />
                <span className="text-[#f6c90e]">when it's visible.</span>
              </h2>
              <p className="text-white/55 text-lg mb-8 leading-relaxed">
                Your rank among peers on the same career path. Updated as you hit checkpoints.
                Ranked on quality, consistency, and communication — not just speed.
              </p>
              <div className="space-y-3">
                {[
                  { l: "Checkpoint Quality",     pct: 40, c: "#6b46c1" },
                  { l: "Weekly Consistency",     pct: 25, c: "#f6c90e" },
                  { l: "Explanation Clarity",    pct: 20, c: "#8b5cf6" },
                  { l: "Community Contribution", pct: 15, c: "#a78bfa" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/65">{m.l}</span>
                      <span className="text-white/35">{m.pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${m.pct * 2.2}%` }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ background: m.c }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-bold">Backend Developer Path</h4>
                <span className="text-white/40 text-xs">Live Rankings</span>
              </div>
              <div className="space-y-3">
                {LEADERBOARD.map((s, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                    i === 0 ? "bg-[#f6c90e]/10 border border-[#f6c90e]/20" : "bg-white/5 hover:bg-white/10"
                  }`}>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-[#f6c90e] text-[#333]" :
                      i === 1 ? "bg-white/20 text-white" :
                      i === 2 ? "bg-orange-400/20 text-orange-300" :
                      "bg-white/10 text-white/40"
                    }`}>{s.medal || s.rank}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">{s.name}</p>
                      <p className="text-white/40 text-xs">Checkpoint {s.cp}/6 · {s.streak}-day streak</p>
                    </div>
                    <span className={`font-bold text-sm ${i === 0 ? "text-[#f6c90e]" : "text-white/55"}`}>{s.score}</span>
                  </div>
                ))}
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
                From confused learners<br />
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
                Stop hopping mentors.<br />
                <span className="text-[#f6c90e]">Take a structured flight.</span>
              </h2>
              <p className="text-lg text-purple-100 max-w-xl mb-10 leading-relaxed">
                Real progress comes from a clear plan, an AI that challenges you to think,
                a mentor who validates you're ready, and a community that keeps you moving.
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
              <p className="text-sm text-gray-400">Built for completion, not consumption.</p>
            </div>
          </div>
        </footer>
      </main>)}
    </>
  );
}
