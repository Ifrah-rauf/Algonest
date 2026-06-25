import { Link } from "react-router-dom";
import AlgoPlane from "../static/AlgoPlane.png";
import AlgoNest2 from "../static/AlgoNest2.PNG";
import bg7 from "../static/bg7.png";
import m1 from "../static/m1.png";
import m2 from "../static/m2.png";
import m3 from "../static/m3.png";
import c1 from "../static/c1.png";
import c2 from "../static/c2.png";
import c3 from "../static/c3.png";
import  "../index.css";
import { motion, useScroll, useTransform } from "framer-motion";
import { API_BASE } from "../components/student-dashboard/constants";
import { useAuth } from "../context/AuthContext.jsx";
import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import ExecutionTimeline from "../components/Executiontimeline.jsx"
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
      link: "/roadmaps"
    },
    {
      step: "02",
      title: "CS Fundamentals",
      tone: "#7c3aed",
      glow: "rgba(124,58,237,0.16)",
      text: "Lock down DSA, OOP, DBMS, OS, and DCCN so the interview room cannot shake the foundation.",
      link: "/cscore"

    },
    {
      step: "03",
      title: "Grill Sessions",
      tone: "#f59e0b",
      glow: "rgba(245,158,11,0.16)",
      text: "Pressure-test the story with a placed professional who reviews your resume, choices, and depth like an interviewer.",
      link: "/grill"

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
                      <Link className="ml-2 text-blue-500 hover:text-blue-700"
                      to={step.link}>
                        {step.title}
                      </Link>
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
              Think like an engineer. Observe a unique real-world problem <br/>
              Build it structurally under personal mentor
            </h2>
            <p className="text-white text-lg leading-8 max-w-2xl">
             Choose a roadmap, feed your project - now your AI helper and your mentor are ready to build with you!
             Receive verdict, proof of work and certification
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Roadmap + built in AI",
                "1:1 Live Mentor sessions",
                "Interview preparedness",
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

const comparisons = [
  {
    feature: "Learning Style",
    algonest: "🚀 Dynamic Ecosystem",
    others: "📚 Static Course",
    highlight: true,
  },

  {
    feature: "Roadmaps",
    algonest: "Adaptive & Personalized",
    others: "Fixed Curriculum",
  },

  {
    feature: "Industry Trends",
    algonest: "Updated Frequently",
    others: "Rarely Updated",
  },

  {
    feature: "Mentors",
    algonest: "Fresh Hires + Experts",
    others: "Mostly Instructors",
  },

  {
    feature: "AI Companion",
    algonest: "Integrated Daily",
    others: "Limited / Absent",
  },

  {
    feature: "Projects",
    algonest: "Personalized",
    others: "Same for Everyone",
  },

  {
    feature: "Affordability",
    algonest: "Student Friendly",
    others: "Expensive",
  },
];

const packages = [
  {
    title: "Weekly LeetCode challenge (basic)",
    companies: "Consistency • Solve • Grow",
    tech: ["Arrays", "Strings", "Sliding Window", "Binary Search"],
    rotate: "rotate-2",
    link:"",
  },

  {
    title: "Weekly LeetCode challenge (advanced)",
    companies: "Consistency • Solve • Grow",
    tech: ["Trees", "Heaps", "Graphs"],
    rotate: "-rotate-1",
    link:"",
  },

  {
    title: "Solving Speed Test",
    companies: "1:1 • 4-5 questions • 1 hour",
    tech: ["DSA", "Basic+advanced"],
    rotate: "rotate-2",
    link:"",
  },

  {
    title: "Solve aloud",
    companies: "1:1 • Explain approach • Strategy to approach",
    tech: ["1-2 DSA", "Basic/advanced"],
    rotate: "-rotate-1",
    link:"",
  },

//   {
//     title: "Placement Accelerator",
//     companies: "Intern + FTE",
//     tech: ["DSA", "Projects", "CS", "Mocks"],
//     rotate: "-rotate-2",
//   },
]; 

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
  const [roadmaps, setRoadmaps] = useState([]);
  const sliderRef = useRef(null);

  //roadmaps fetching
  useEffect(() => {
      const fetchRoadmaps = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/plans/getCourse`);
          const data = await res.json();

          setRoadmaps(data.courses || []);
        } catch (err) {
          console.log(err);
        }
      };

      fetchRoadmaps();
    }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };
  const displayedRoadmaps = roadmaps.length > 0 ? [...roadmaps, ...roadmaps]: [];
//roadmap fetching ended


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

        {/* HERO */}
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
            <motion.h2
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[40px] md:text-[50px] font-bold leading-none">

              Learn like a<span className="text-[#f6c90e]"> premium engineer</span> with
              <br />
              <span className="text-[#6b46c1]">
                Roadmaps and personal mentorship</span><br />
            </motion.h2>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 text-lg text-gray-800 max-w-2xl mx-auto leading-relaxed"
            >
              <br />We are all over with bootcamps and recordings, Let's build something real, of your own in this era of 
              Shallow learning
              <span className="text-[#6b46c1] font-semibold"><br/>Ditch the hype, build real skills.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="mt-8 flex flex-wrap justify-center gap-4 items-center mb-24 "
            >
              <Link to="https://www.linkedin.com/company/algonest-edtech"
                className="bg-[#6b46c1] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300">
                Learn more about AlgoNest→
              </Link>
              <Link to="/roadmaps"
                className="text-[#6b46c1] font-semibold hover:underline underline-offset-4 flex items-center gap-1.5">
                See roadmaps
              </Link>
            </motion.div>
          </div>
           <div className="relative mx-auto w-full max-w-4xl">

      {/* Purple Glow */}

      <div
        className="
        absolute
        inset-0
        -z-10
        rounded-[34px]
        blur-3xl
        opacity-40
        bg-gradient-to-r
        from-purple-700/30
        via-violet-700/20
        to-fuchsia-700/20
        "
      />



      {/* Window */}

      <div
        className="
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-gradient-to-br
        from-[#191919]
        via-[#222126]
        to-[#2b203f]
        shadow-[0_25px_80px_rgba(80,40,150,0.25)]
        "
      >

        {/* Thin top bar */}

        <div
          className="
          flex
          items-center
          justify-between
          border-b
          border-white/5
          px-5
          h-9
          bg-black/10
          backdrop-blur-sm
          "
        >

          {/* Traffic lights */}

          <div className="flex items-center gap-2">

            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />

            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />

            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />

          </div>



          {/* Center title */}

          <div
            className="
            text-[11px]
            font-semibold
            tracking-wide
            text-gray-400
            "
          >
            algonest-demo.mp4
          </div>



          {/* Right placeholder */}

          <div className="w-12" />

        </div>



        {/* Video Placeholder */}

        <div
          className="
          relative
          aspect-video
          w-full
          overflow-hidden
          "
        >

          {/* Purple radial */}

          <div
            className="
            absolute
            left-1/2
            top-1/2
            h-[320px]
            w-[320px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-purple-700/20
            blur-3xl
            "
          />



          {/* Dot grid */}

          <div className="absolute left-10 top-10 opacity-20">

            <div className="grid grid-cols-5 gap-3">

              {[...Array(25)].map((_, i) => (

                <div
                  key={i}
                  className="h-1 w-1 rounded-full bg-purple-300"
                />

              ))}

            </div>

          </div>



          {/* Doodle Curve */}

          <svg
            className="absolute right-12 top-12 opacity-20"
            width="90"
            height="50"
          >

            <path
              d="M5 35 C 30 5, 60 5, 85 25"
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="5 7"
            />

            <path
              d="M75 18 L85 25 L70 28"
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

          </svg>



          {/* Play Button */}

          <div
            className="
            absolute
            left-1/2
            top-1/2
            flex
            h-20
            w-20
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-white/5
            backdrop-blur-md
            shadow-lg
            "
          >

            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="h-8 w-8 opacity-90 ml-1"
            >

              <path d="M8 5v14l11-7z" />

            </svg>

          </div>



          {/* Bottom Text */}

          <div
            className="
            absolute
            bottom-8
            left-1/2
            -translate-x-1/2
            text-center
            "
          >

            <p className="text-lg font-bold text-white">
              Learn with AI + Mentors
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Watch how AlgoNest works
            </p>

          </div>

        </div>

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
                { v: "₹𝟫̶,̶𝟫̶𝟫̶𝟫̶  ₹2500", l: "AI+Mentor Collaborative Roadmap" },
                { v: "₹𝟣̶,̶𝟫̶𝟫̶𝟫̶  ₹499",l: "1:1 One time mentor sessions" },
              ].map((s, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <div className="text-3xl font-extrabold text-[#f6c90e] mb-2">{s.v}</div>
                  <div className="text-white text-lg leading-relaxed">{s.l}</div>
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
        <section className="w-full bg-white py-16 md:py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative flex flex-col items-center text-center">

            {/* Decorative Doodles */}

            <svg
            className="absolute right-4 top-0 w-28 h-28 opacity-70 hidden sm:block"
            viewBox="0 0 100 100"
            fill="none"
            >
            <path
                d="M40 15
                C70 10 90 35 72 55
                C62 68 48 66 48 80"
                stroke="#C4B5FD"
                strokeWidth="6"
                strokeLinecap="round"
            />

            <circle
                cx="48"
                cy="90"
                r="5"
                fill="#A78BFA"
            />

            {/* <path
                d="M55 42
                q10 -10 18 0
                q-8 10 -18 0"
                stroke="#FACC15"
                strokeWidth="4"
                strokeLinecap="round"
            /> */}
            </svg>

            {/* Dot grid */}

            <div className="absolute left-4 top-10 grid grid-cols-5 gap-2 opacity-30">
            {[...Array(25)].map((_, i) => (
                <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-300"
                />
            ))}
            </div>

            {/* tiny doodle arrow */}

            <svg
            className="absolute left-12 bottom-16 hidden md:block"
            width="90"
            height="45"
            fill="none"
            >
            <path
                d="M5 35
                C25 5 60 5 80 25"
                stroke="#A78BFA"
                strokeWidth="3"
                strokeDasharray="5 5"
                strokeLinecap="round"
            />

            <path
                d="M80 18 L82 25 L75 30"
                stroke="#A78BFA"
                strokeWidth="3"
                strokeLinecap="round"
            />
            </svg>

            {/* Heading */}

            <div className="relative max-w-3xl mb-8">

            <div className="inline-flex mb-5 px-4 py-2 rounded-full bg-violet-50 border border-violet-100">
                <span className="text-violet-600 text-sm font-semibold">
                Built to eliminate tutorial chaos
                </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">

                Struggling to find a

                <span className="relative mx-2 text-violet-600">
                blueprint

                <svg
                    className="absolute -bottom-2 left-0"
                    width="100%"
                    height="14"
                    viewBox="0 0 140 14"
                    fill="none"
                >
                    <path
                    d="M4 9C40 2 90 2 136 9"
                    stroke="#FACC15"
                    strokeWidth="6"
                    strokeLinecap="round"
                    />
                </svg>

                </span>

                that actually gets you to your goals?

            </h2>

            </div>


            {/* Content */}

            <div className="max-w-3xl space-y-5 text-slate-600 text-[15px] sm:text-base leading-8">

            <p className="text-slate-800 font-medium">
                That's exactly why we built

                <span className="text-violet-600 font-bold">
                {" "}Algonest.
                </span>
            </p>

            <p>
                We were tired of generic tutorials and endless playlists.
                So we designed a platform that transforms
                <span className="font-semibold text-slate-800">
                {" "}tech stacks, CS fundamentals and interview preparation
                </span>
                {" "}into structured, predictable roadmaps.
            </p>

            <p>
                No fluff. Just focused learning paths,
                production-grade projects,
                and rigorous technical mentoring designed to help you become
                a competitive engineer.
            </p>

            </div>


            {/* CTA */}

            <div className="mt-10">

            <button className="group px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all">

                <span className="flex items-center gap-2">

                Find more about Algonest

                <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                    />
                </svg>

                </span>

            </button>

            </div>

        </div>
        </section>

        <section className="w-full bg-white py-12 md:py-16 overflow-hidden">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">

    {/* Decorative dots */}
    <div className="absolute left-0 top-2 grid grid-cols-5 gap-1.5 opacity-30 hidden sm:grid">
      {[...Array(25)].map((_, i) => (
        <div key={i} className="w-1 h-1 rounded-full bg-violet-400" />
      ))}
    </div>

    <div className="absolute right-0 top-10 opacity-30 hidden sm:block">
      <svg width="80" height="40">
        <path
          d="M0 20 Q20 0 40 20 T80 20"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      </svg>
    </div>

    {/* Heading */}
            
    <div className="text-center mb-14">
        <h2 className="text-5xl font-extrabold tracking-tight text-slate-900"> Dynamic{" "}
            <span className="text-violet-600 relative"> roadmaps.
            <svg
                className="absolute -bottom-2 left-0"
                width="170"
                height="18"
                viewBox="0 0 170 18"
            >
            <path
                d="M4 12C45 5 100 5 166 12"
                fill="none"
                stroke="#FACC15"
                strokeWidth="6"
                strokeLinecap="round" />
            </svg>
            </span>
        </h2>
        <p className="mt-5 text-slate-500 text-lg">
        Personalized paths, with AI+ human mentor collaboration that adapt to your goals, skills & progress and tracks you down.
        </p>
    </div>

    {/* Cards */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

      {/* CARD 1 */}
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col bg-white">
        <div className="h-44 sm:h-48 bg-[#F4F0FF] relative flex-shrink-0">
          <img 
            src={c1}
            alt="Tech Stack Illustration" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white mb-3.5 flex-shrink-0">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 3L4 7.5L12 12L20 7.5L12 3Z"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M4 12L12 16.5L20 12"
                stroke="white"
                strokeWidth="2"
              />
              <path
                d="M4 16L12 20.5L20 16"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Tech Stack
          </h3>

          <p className="text-slate-500 mt-2 text-xs sm:text-sm leading-relaxed flex-grow">
            Master production-ready development with GenAI integration and the MERN stack. Learn deployment, state management, and modern architectural patterns demanded by top-tier tech companies.
          </p>

          <div className="flex gap-2 flex-wrap mt-4 pt-1">
            {["GenAI", "MERN", "Next.js", "AWS", "+ more"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="mx-auto mt-5 px-5 py-2 w-full sm:w-auto text-xs font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group">
            Explore Tech Roadmaps
            <svg 
                className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
        </div>
      </div>

      {/* CARD 2 */}
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col bg-white">
        <div className="h-44 sm:h-48 bg-[#F7FAFF] relative flex-shrink-0">
          <img 
            src={c2}
            alt="CS Fundamentals Illustration" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg mb-3.5 flex-shrink-0">
            💻
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            CS Fundamentals
          </h3>

          <p className="text-slate-500 mt-2 text-xs sm:text-sm leading-relaxed flex-grow">
            Build a bulletproof technical foundation. Dive deep into high and low-level system design, object-oriented programming, database management systems, SQL optimization, and computer networks.
          </p>

          <div className="flex gap-2 flex-wrap mt-4 pt-1">
            {["System Design", "OOP", "DBMS/SQL", "CN"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="mx-auto mt-5 px-5 py-2 w-full sm:w-auto text-xs font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group">
            Explore CS fundamental roadmaps
            <svg 
                className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
        </div>
      </div>

      {/* CARD 3 */}
      <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col bg-white sm:col-span-2 lg:col-span-1">
        <div className="h-44 sm:h-48 bg-[#FFF9EA] relative flex-shrink-0">
          <img 
            src={c3}
            alt="Grill Sessions Illustration" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white text-base mb-3.5 flex-shrink-0">
            👥
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Grill Sessions
          </h3>

          <p className="text-slate-500 mt-2 text-xs sm:text-sm leading-relaxed flex-grow">
            Simulate real pressure with intensive, multi-domain mock interviews. Cover complex project walkthroughs, advanced Data Structures & Algorithms, core CS subjects, and analytical puzzles in a single session.
          </p>

          <div className="flex gap-2 flex-wrap mt-4 pt-1">
            {["Project", "DSA", "CS", "Puzzles", "+ more"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <button className="mx-auto mt-5 px-5 py-2 w-full sm:w-auto text-xs font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group">
            Explore Grill sessions
            <svg 
                className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2.5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
        </div>
      </div>

    </div>
  </div>


  <section className="relative overflow-hidden bg-white py-28 mt-14 px-6">

      {/* Doodles */}

      <div className="absolute top-16 left-16 h-16 w-16 opacity-20">
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-purple-500"
            />
          ))}
        </div>
      </div>

      <svg
        className="absolute right-10 top-24 opacity-30"
        width="100"
        height="60"
      >
        <path
          d="M5 40 C 35 5, 70 5, 90 35"
          stroke="#7C3AED"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 8"
        />

        <path
          d="M82 24 L90 35 L75 34"
          stroke="#7C3AED"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <div className="max-w-7xl mx-auto relative">

        {/* Heading */}

        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700 shadow-sm mb-6">
            🔥 Trending Paths
          </div>

          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
            Explore our
            <span className="relative mx-2 text-purple-600">

              HOT

              <svg
                className="absolute -bottom-3 left-0"
                width="100%"
                height="12"
              >
                <path
                  d="M2 8 Q 30 1 65 8 Q 90 12 110 5"
                  stroke="#FACC15"
                  strokeWidth="7"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            Roadmaps
          </h2>

          <p className="text-gray-500 mt-5 max-w-xl mx-auto font-medium">
            Dynamic paths where you are mentored collaboratively from both AI and a mentor.
            12 lessons, 4 checkpoints, your workflow demo, Github enhanced and interview prep - All in one.
          </p>

        </div>

        {/* Arrows */}

        <button
          onClick={scrollLeft}
          className="absolute left-0 top-[65%] -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-gray-100 bg-white shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <ChevronLeft className="h-5 w-5 text-purple-600" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-[65%] -translate-y-1/2 z-20 h-12 w-12 rounded-full border border-gray-100 bg-white shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <ChevronRight className="h-5 w-5 text-purple-600" />
        </button>

        {/* Slider */}

        <div
          ref={sliderRef}
          className="overflow-x-scroll no-scrollbar"
        >

          <div className="flex gap-5 animate-roadmap-scroll w-max py-6">

            {displayedRoadmaps.map((roadmap, index) => (

              <button
                key={index}
                className="
                shrink-0
                px-7
                py-4
                rounded-full
                bg-white
                border
                border-purple-100
                shadow-[0_8px_25px_rgba(124,58,237,0.08)]
                hover:shadow-[0_10px_35px_rgba(124,58,237,0.15)]
                hover:-translate-y-1
                transition-all
                duration-300
                group
                "
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                    h-3
                    w-3
                    rounded-full
                    bg-yellow-400
                    group-hover:scale-125
                    transition
                    "
                  />

                  <span className="font-bold text-gray-800 whitespace-nowrap">
                    {roadmap?.title}
                  </span>

                </div>

              </button>

            ))}

          </div>

        </div>

      </div>

    </section>
        </section>
        
      {/* Human + AI Collaboration */}
        {/* <section className="w-full bg-white py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

            <div className="grid lg:grid-cols-[0.95fr_1.25fr] gap-14 lg:gap-20 items-center">


            <div className="relative text-center lg:text-left">


                <div className="absolute -top-10 -left-2 grid grid-cols-5 gap-2 opacity-30 hidden md:grid">
                {[...Array(25)].map((_, i) => (
                    <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-300"
                    />
                ))}
                </div>


                <svg
                className="absolute -right-3 top-6 hidden lg:block"
                width="80"
                height="50"
                fill="none"
                >
                <path
                d="M25 30 C35 10 55 10 65 28"
                stroke="#A78BFA"
                strokeWidth="3"
                strokeDasharray="5 5"
                strokeLinecap="round"
                />

                <path
                d="M55 27 L65 28 L62 18"
                stroke="#A78BFA"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
                </svg>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-100 bg-violet-50 mb-7">

                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />

                <span className="text-sm font-semibold text-violet-600">
                    Human + AI Collaboration
                </span>

                </div>


                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">

                Learn with

                <br />

                <span className="relative text-violet-600">

                    AI.

                    <svg
                    className="absolute -bottom-2 left-0"
                    width="70"
                    height="12"
                    fill="none"
                    >
                    <path
                        d="M3 8 C25 2 45 2 67 8"
                        stroke="#FACC15"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    </svg>

                </span>

                {" "}Grow with

                <br />

                Human Mentors.

                </h2>


                <p className="mt-8 text-slate-600 text-[16px] sm:text-lg leading-8 max-w-xl mx-auto lg:mx-0">

                Start with dynamic roadmaps tailored to your goals.

                Learn concepts with an AI companion,

                build projects with continuous feedback,

                and join live mentor sessions whenever you need guidance.

                </p>

                <p className="mt-5 text-slate-600 text-[16px] sm:text-lg leading-8 max-w-xl mx-auto lg:mx-0">

                No scattered resources.

                Just a

                <span className="font-semibold text-slate-900">
                    {" "}structured system{" "}
                </span>

                that takes you from learning

                to projects

                to placements.

                </p>



                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10">

                {[
                    "Choose Roadmap",
                    "AI Guides",
                    "Mentor Sessions",
                    "Get Placed",
                ].map((item, i) => (
                    <div
                    key={item}
                    className="flex items-center gap-4"
                    >

                    <div className="px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700">
                        {item}
                    </div>

                    {i !== 3 && (

                        <svg
                        width="25"
                        height="10"
                        fill="none"
                        className="hidden sm:block"
                        >
                        <path
                            d="M2 5H22"
                            stroke="#A78BFA"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />

                        <path
                            d="M18 1L22 5L18 9"
                            stroke="#A78BFA"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        </svg>

                    )}

                    </div>
                ))}

                </div>

            </div>



            <div className="relative w-full">


                <div className="absolute -top-10 -right-10 w-48 h-48 bg-violet-100 rounded-full blur-3xl opacity-70" />

                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-60" />




                <div className="relative rounded-[32px] overflow-hidden border border-slate-100 bg-white shadow-[0_25px_80px_rgba(124,58,237,0.10)]">


                <div className="h-14 border-b border-slate-100 bg-slate-50 flex items-center px-6 gap-3">

                    <div className="w-3 h-3 rounded-full bg-red-300" />

                    <div className="w-3 h-3 rounded-full bg-yellow-300" />

                    <div className="w-3 h-3 rounded-full bg-green-300" />

                    <div className="ml-4 px-4 py-1 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold">

                    Demo

                    </div>

                </div>



                <div className="aspect-video bg-gradient-to-br from-[#faf7ff] via-white to-[#f6f2ff] flex items-center justify-center relative">

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">

                    <h4 className="text-xl font-bold text-slate-900">

                        Product Walkthrough

                    </h4>

                    <p className="text-slate-500 mt-2">

                        See how AI and mentors collaborate with you.

                    </p>

                    </div>

                </div>

                </div>



                <svg
                className="absolute -right-4 top-1/2 hidden lg:block"
                width="70"
                height="70"
                fill="none"
                >
                <path
                    d="M15 50
                    C20 20 50 20 55 40
                    C58 55 42 58 38 48"
                    stroke="#C4B5FD"
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <circle
                    cx="38"
                    cy="48"
                    r="4"
                    fill="#FACC15"
                />

                </svg>

            </div>

            </div>

        </div>
        </section> */}
        
        <section className=" relative bg-[#6B46C1] overflow-hidden isolate ">


            {/* TOP WAVE */}
            <svg
            className="absolute top-[-2px] left-0 w-full rotate-180"
            preserveAspectRatio="none"
            viewBox="0 0 1440 40"
            >
                <path
                fill="#ffffff"
                d="M0,20 C24,36 72,36 96,20 C120,4 168,4 192,20 C216,36 264,36 288,20 C312,4 360,4 384,20 C408,36 456,36 480,20 C504,4 552,4 576,20 C600,36 648,36 672,20 C696,4 744,4 768,20 C792,36 840,36 864,20 C888,4 936,4 960,20 C984,36 1032,36 1056,20 C1080,4 1128,4 1152,20 C1176,36 1224,36 1248,20 C1272,4 1320,4 1344,20 C1368,36 1416,36 1440,20 L1440,40 L0,40 Z"
                />
            </svg>

            {/* BOTTOM WAVE */}
            <svg
            className="absolute bottom-[-2px] left-0 w-full"
            preserveAspectRatio="none"
            viewBox="0 0 1440 40"
            >
                <path
                fill="#ffffff"
                d="M0,20 C24,36 72,36 96,20 C120,4 168,4 192,20 C216,36 264,36 288,20 C312,4 360,4 384,20 C408,36 456,36 480,20 C504,4 552,4 576,20 C600,36 648,36 672,20 C696,4 744,4 768,20 C792,36 840,36 864,20 C888,4 936,4 960,20 C984,36 1032,36 1056,20 C1080,4 1128,4 1152,20 C1176,36 1224,36 1248,20 C1272,4 1320,4 1344,20 C1368,36 1416,36 1440,20 L1440,40 L0,40 Z"
                />
            </svg>

            {/* Background blobs */}
            <div className="absolute right-0 top-10 opacity-10">
                <svg width="450" height="250">
                <circle
                    cx="350"
                    cy="50"
                    r="120"
                    fill="white"
                />
                <circle
                    cx="190"
                    cy="180"
                    r="90"
                    fill="white"
                />
                </svg>
            </div>

            {/* Dot Grid */}
            <div className="absolute left-12 top-28 hidden md:grid grid-cols-5 gap-2 opacity-20">
                {[...Array(25)].map((_, i) => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white"
                />
                ))}
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Heading */}

                <div className="text-center max-w-3xl mx-auto mt-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur mb-6">
                    <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse" />
                    <span className="text-sm font-semibold text-white">
                    Updated with hiring trends
                    </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold leading-[1.1] text-white">
                    Learn what
                    <span className="relative mx-3 text-yellow-300">
                    actually matters.

                    <svg
                        className="absolute -bottom-3 left-0"
                        width="100%"
                        height="15"
                    >
                        <path
                        d="M4 10C45 2 95 2 145 10"
                        stroke="#FACC15"
                        strokeWidth="6"
                        strokeLinecap="round"
                        fill="none"
                        />
                    </svg>
                    </span>
                </h2>

                <p className="mt-8 text-violet-100 text-lg leading-8">
                    Hot packages curated from hiring trends,
                    AI disruption and top engineering roadmaps. Select any to explore and book. Enquire from consult.
                </p>
                {/* doodle */}
                <svg
                    className="mx-auto mt-5"
                    width="100"
                    height="35"
                    fill="none"
                >
                    <path
                    d="M10 15 C25 5 55 5 85 18"
                    stroke="#FACC15"
                    strokeWidth="3"
                    strokeDasharray="5 5"
                    strokeLinecap="round"
                    />

                    <path
                    d="M77 10L88 18L75 22"
                    stroke="#FACC15"
                    strokeWidth="3"
                    strokeLinecap="round"
                    />
                </svg>
                </div>

                {/* CARDS */}
                <div className="mt-4 overflow-x-auto no-scrollbar">

                <div className="flex gap-8 w-max px-4 py-5">
                    {packages.map((item, index) => (

                    <div
                        key={index}
                        className={`
                        ${item.rotate}
                        relative
                        w-[290px]
                        bg-white
                        rounded-[16px]
                        pl-4 pr-4
                        p-2
                        border border-white/50
                        transition-all
                        duration-300
                        hover:rotate-0
                        hover:-translate-y-2
                        hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)]
                        mb-10
 
                        `}
                    >
                        {/* HOT */}
                        <div className="absolute -top-4 left-6">
                        <div className="bg-yellow-300 text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                            🔥 HOT
                        </div>
                        </div>

                            <h3 className="mt-6 text-xl font-bold text-slate-900">
                            {item.title}
                            </h3>
                            <p className="mt-2 text-slate-500 text-[12px]">
                            {item.companies}
                            </p>
                        <div className="flex flex-wrap gap-3 mt-8">
                            {item.tech.map((tech) => (
                                <div
                                key={tech}
                                className="px-2 py-2 rounded-full bg-violet-50 text-violet-700 text-[11px] font-medium">
                                {tech}
                                </div>
                            ))}
                        </div>
                        <button className="mx-auto mt-5 px-5 py-2 w-full sm:w-auto text-xs font-semibold tracking-wide text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.98] rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5 group">
                            Explore this opportunity
                            <svg 
                                className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor" 
                                strokeWidth="2.5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            </button>
                        {/* bottom trend */}
                        {/* <div className="mt-10 flex items-end gap-2">
                        <div className="w-3 h-6 rounded-full bg-violet-200" />
                        <div className="w-3 h-10 rounded-full bg-violet-300" />
                        <div className="w-3 h-8 rounded-full bg-violet-200" />
                        <div className="w-3 h-14 rounded-full bg-violet-500" />
                        </div> */}
                    </div>
                    ))}
                </div>
                </div>
            </div>

        </section>
        
        {/* ══════════════════════════════════════════
            COMPARISON
        ══════════════════════════════════════════ */}
<section className="relative py-16 md:py-20 overflow-hidden bg-white">

  {/* Background Blob */}
  <div className="absolute left-[-120px] top-24 w-[350px] h-[350px] rounded-full bg-violet-100 blur-3xl opacity-40" />
  <div className="absolute right-[-100px] bottom-10 w-[280px] h-[280px] rounded-full bg-yellow-100 blur-3xl opacity-40" />
  
  {/* Dot grid */}
  <div className="absolute right-14 top-20 hidden md:grid grid-cols-5 gap-2 opacity-30">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-violet-300"
      />
    ))}
  </div>

  <div className="max-w-5xl mx-auto px-6 relative">
    {/* HEADING */}
    <div className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 mb-5">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
        <span className="text-violet-600 text-xs font-semibold">Built differently</span>
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
        Why settle for a course <br /> when you can join an <span className="relative text-violet-600 ml-1.5"> ecosystem?
          <svg
            className="absolute -bottom-2 left-0"
            width="100%"
            height="12"
            fill="none"
          >
            <path
              d="M4 10 C40 2 100 2 165 10"
              stroke="#FACC15"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h2>
      <p className="text-slate-600 mt-5 text-sm sm:text-base leading-relaxed">
        Not another static playlist. A living roadmap that evolves with you, the market and your ambitions.
      </p>
    </div>
    
<div className="hidden md:block mt-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr] items-center bg-slate-50/50">
          <div className="px-4 py-3" />
          <div className="px-4 py-3 bg-violet-50/60 border-l border-r border-violet-100 flex justify-center">
            <div className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold shadow-sm">
              Algonest ✨
            </div>
          </div>
          <div className="px-4 py-3 flex justify-center">
            <div className="px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-bold">
              Courses / Bootcamps
            </div>
          </div>
        </div>
        
        {/* Rows */}
        {comparisons.map((row, index) => (
          <div
            key={index}
            className={`
              grid grid-cols-[1.4fr_1fr_1fr] items-center text-xs
              ${index !== comparisons.length - 1 && "border-b border-slate-100"}
              ${row.highlight && "bg-violet-50/20"}
            `}
          >
            {/* feature */}
            <div className="px-5 py-2.5">
              <div className="font-semibold text-slate-700">
                {row.feature}
              </div>
            </div>
            {/* Algonest */}
            <div className="px-4 py-2 border-l border-r border-violet-100 flex justify-center">
              <div
                className={`
                  px-3 py-1 rounded-full
                  font-semibold text-center min-w-[130px] max-w-full truncate
                  ${row.highlight
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-violet-100 text-violet-700"}
                `}
                title={row.algonest}
              >
                {row.algonest}
              </div>
            </div>
            {/* others */}
            <div className="px-4 py-2 flex justify-center">
              <div 
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-center min-w-[130px] max-w-full truncate"
                title={row.others}
              >
                {row.others}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

{/* MOBILE TABLE (Two-column layout matching desktop style) */}
<div className="md:hidden mt-10 max-w-md mx-auto">
  <div className="bg-white rounded-xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-2 items-center bg-slate-50/50 text-center">
      <div className="px-3 py-2 bg-violet-50/60 border-r border-violet-100">
        <div className="px-2 py-0.5 inline-block rounded-full bg-violet-600 text-white text-[10px] font-bold shadow-sm">
          Algonest ✨
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="px-2 py-0.5 inline-block rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-bold">
          Bootcamps
        </div>
      </div>
    </div>
    
    {/* Rows */}
    {comparisons.map((row, index) => (
      <div
        key={index}
        className={`
          grid grid-cols-2 items-center text-[11px]
          ${index !== comparisons.length - 1 && "border-b border-slate-100"}
          ${row.highlight && "bg-violet-50/20"}
        `}
      >
        {/* Algonest column */}
        <div className="px-3 py-2 border-r border-violet-100 flex justify-center">
          <div
            className={`
              px-2 py-0.5 rounded-full font-semibold text-center w-full truncate
              ${row.highlight
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-violet-100 text-violet-700"}
            `}
            title={row.algonest}
          >
            {row.algonest}
          </div>
        </div>
        
        {/* Others column */}
        <div className="px-3 py-2 flex justify-center">
          <div 
            className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium text-center w-full truncate"
            title={row.others}
          >
            {row.others}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


    {/* bottom note */}
    <div className="text-center mt-10">
      <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-100">
        <div className="text-lg font-bold text-yellow-600">₹</div>
        <p className="text-slate-700 text-xs sm:text-sm font-medium">
          Student-friendly pricing. Premium mentorship without premium cost.
        </p>
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
        // <section className="max-w-6xl mx-auto px-6 py-24">
        //   <div className="text-center mb-16">
        //     <h2 className="text-4xl font-semibold mb-4 text-[#1a0533]">
        //       Your mentor isn't a teacher.<br />
        //       <span className="text-[#6b46c1]">They're your advocate.</span>
        //     </h2>
        //     <p className="text-gray-500 max-w-xl mx-auto">
        //       AlgoNest mentors are recent placements (1–3 years in) who remember your exact
        //       struggle — and have network access you don't yet have.
        //     </p>
        //   </div>

        //   <motion.div
        //     className="grid md:grid-cols-3 gap-8 justify-items-center"
        //     variants={containerVariants} initial="hidden"
        //     whileInView="show" viewport={{ once: true, amount: 0.3 }}
        //   >
        //     {[
        //       { img: m1, title: "Student Mentors",  sub: "Strong fundamentals & execution",  role: "Checkpoint assessment + progress tracking" },
        //       { img: m2, title: "Corporate Mentors", sub: "Real-world project exposure",      role: "Coaching on professional communication" },
        //       { img: m3, title: "Industry Experts",  sub: "Advanced guidance & mastery",      role: "Referrals + network introductions" },
        //     ].map((m, i) => (
        //       <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center">
        //         <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-[#f6c90e] mb-5 shadow-xl shadow-purple-100">
        //           <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
        //         </div>
        //         <p className="font-bold text-xl text-[#1a0533] mb-1">{m.title}</p>
        //         <p className="text-sm text-gray-500 mb-3">{m.sub}</p>
        //         <span className="text-xs bg-[#6b46c1]/10 text-[#6b46c1] px-3 py-1.5 rounded-full font-semibold">{m.role}</span>
        //       </motion.div>
        //     ))}
        //   </motion.div>

        // </section>
      </main>)}
    </>
  );
}
