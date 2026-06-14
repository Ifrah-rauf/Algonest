import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {redirect,useNavigate} from "react-router-dom";
const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.25,
    },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};
const QUESTIONS = [
  {
    id: 1,
    tag: "Who are you?",
    question: "Where are you right now?",
    subtitle: "This helps us understand your starting point.",
    type: "single",
    icon: "🧭",
    options: [
      { value: "student", label: "Engineering / CS Student", desc: "Currently in college, preparing for placements", emoji: "🎓" },
      { value: "switcher", label: "Career Switcher", desc: "Coming from a non-tech background", emoji: "🔄" },
      { value: "grad", label: "Recent Graduate", desc: "Graduated, struggling to land my first role", emoji: "📄" },
      { value: "working", label: "Working Professional", desc: "Already in tech, want to level up", emoji: "💼" },
    ],
  },
  {
    id: 2,
    tag: "Your Background",
    question: "What's your academic or professional background?",
    subtitle: "Be honest — there's no wrong answer here.",
    type: "single",
    icon: "📚",
    options: [
      { value: "cs", label: "Computer Science / IT", desc: "Studied CS, MCA, BCA, or IT-related fields", emoji: "💻" },
      { value: "noncs_stem", label: "Non-CS STEM", desc: "Engineering (ECE, Mech, Civil) or Sciences", emoji: "⚙️" },
      { value: "nontech", label: "Non-Technical", desc: "Commerce, Arts, Management, or any other field", emoji: "🎯" },
    ],
  },
  {
    id: 3,
    tag: "Your Vision",
    question: "Where do you see yourself in the next 1–2 years?",
    subtitle: "Pick all that resonate. Your goals shape your roadmap.",
    type: "multi",
    icon: "🚀",
    options: [
      { value: "sde", label: "SDE at a product company", desc: "FAANG, unicorns, or well-funded startups", emoji: "🏢" },
      { value: "highpay", label: "High-paying complex role", desc: "ML/AI, distributed systems, architecture", emoji: "💰" },
      { value: "freelance", label: "Freelance / Build my own", desc: "Independent projects or launching a product", emoji: "🛠️" },
      { value: "nondev", label: "Non-development tech role", desc: "DevOps, Cloud, Security, Data Analyst", emoji: "☁️" },
    ],
  },
  {
    id: 4,
    tag: "Your Interests",
    question: "What genuinely excites you?",
    subtitle: "Pick everything that sparks curiosity.",
    type: "multi",
    icon: "⚡",
    options: [
      { value: "data", label: "Data & Analytics", desc: "Making sense of numbers and patterns", emoji: "📊" },
      { value: "cloud", label: "Cloud & Infrastructure", desc: "AWS, GCP, Kubernetes, scaling systems", emoji: "☁️" },
      { value: "aiml", label: "AI / ML", desc: "Models, automation, intelligent systems", emoji: "🤖" },
      { value: "webdev", label: "Web / App Development", desc: "Building products users actually touch", emoji: "🌐" },
      { value: "security", label: "Security & Ethical Hacking", desc: "Protecting systems, finding vulnerabilities", emoji: "🔐" },
      { value: "design", label: "Product & Design thinking", desc: "UX, systems design, product decisions", emoji: "🎨" },
    ],
  },
  {
    id: 5,
    tag: "Commitment",
    question: "How many hours can you realistically commit per week?",
    subtitle: "We'll calibrate your roadmap timeline accordingly.",
    type: "single",
    icon: "⏱️",
    options: [
      { value: "low", label: "Less than 5 hrs / week", desc: "Busy with college or job — slow and steady", emoji: "🐢" },
      { value: "mid", label: "5–10 hrs / week", desc: "Dedicated part-time learner", emoji: "🚶" },
      { value: "high", label: "10–20 hrs / week", desc: "Serious about this — ready to push", emoji: "🏃" },
      { value: "full", label: "20+ hrs / week", desc: "All in. This is my main focus right now", emoji: "🔥" },
    ],
  },
  {
    id: 6,
    tag: "Biggest Blocker",
    question: "What's held you back so far?",
    subtitle: "AlgoNest is designed to break exactly this.",
    type: "single",
    icon: "🧱",
    options: [
      { value: "direction", label: "No clear direction", desc: "Don't know what to learn or where to start", emoji: "🗺️" },
      { value: "accountability", label: "No accountability", desc: "Start strong, fall off without someone watching", emoji: "👁️" },
      { value: "projects", label: "Can't finish projects", desc: "Learned theory, never built anything real", emoji: "🏗️" },
      { value: "interviews", label: "Failing interviews", desc: "Know the concepts but can't explain under pressure", emoji: "😰" },
    ],
  },
];
function getRoadmapResult(answers) {
  const { q3 = [], q4 = [] } = answers;
  const hasInterest = (v) => q4.includes(v);
  const hasGoal = (v) => q3.includes(v);

  const roles = [];
  const skills = [];
  const roadmaps = [];

  if (hasInterest("aiml") || hasGoal("highpay")) {
    roles.push({ title: "ML / AI Engineer", demand: "🔥 Explosive", salary: "₹12–40 LPA", color: "#7C3AED" });
    skills.push("Python", "PyTorch / TensorFlow", "MLOps", "Statistics", "LLM APIs");
    roadmaps.push({ name: "ML Engineering Path", duration: "4–5 months", tag: "Most Demanded" });
  }
  if (hasInterest("webdev") || hasGoal("sde") || hasGoal("freelance")) {
    roles.push({ title: "Full Stack Developer", demand: "⚡ Very High", salary: "₹8–25 LPA", color: "#D97706" });
    skills.push("React", "Node.js / Express", "PostgreSQL", "REST APIs", "Git");
    roadmaps.push({ name: "Full Stack (MERN) Path", duration: "4–5 months", tag: "Most Popular" });
  }
  if (hasInterest("cloud") || hasGoal("nondev")) {
    roles.push({ title: "DevOps / Cloud Engineer", demand: "📈 High & Growing", salary: "₹10–30 LPA", color: "#0369A1" });
    skills.push("AWS / GCP", "Docker", "Kubernetes", "CI/CD", "Linux");
    roadmaps.push({ name: "Cloud & DevOps Path", duration: "4 months", tag: "High Salary" });
  }
  if (hasInterest("data")) {
    roles.push({ title: "Data Scientist", demand: "📊 Steady High", salary: "₹8–22 LPA", color: "#059669" });
    skills.push("Python", "Pandas", "SQL", "Tableau", "Statistics");
    roadmaps.push({ name: "Data Science Path", duration: "3–4 months", tag: "Entry Friendly" });
  }
  if (hasInterest("security")) {
    roles.push({ title: "Cybersecurity Engineer", demand: "🔐 Niche & Lucrative", salary: "₹10–35 LPA", color: "#DC2626" });
    skills.push("Ethical Hacking", "Network Security", "OWASP", "Penetration Testing", "Linux");
    roadmaps.push({ name: "Cybersecurity Path", duration: "4–5 months", tag: "High Ceiling" });
  }
  if (roles.length === 0) {
    roles.push({ title: "Software Dev Engineer", demand: "⚡ Very High", salary: "₹6–20 LPA", color: "#7C3AED" });
    skills.push("DSA", "System Design", "Backend Basics", "Git", "Problem Solving");
    roadmaps.push({ name: "Backend (Node.js) Path", duration: "3–4 months", tag: "Best Start" });
  }

  return { roles: roles.slice(0, 3), skills: [...new Set(skills)].slice(0, 8), roadmaps: roadmaps.slice(0, 3) };
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function RocketSVG() {
  return (
    <svg viewBox="0 0 120 120" className="w-[80%] h-[80%] m-auto" fill="none">
      <ellipse cx="60" cy="60" rx="52" ry="52" fill="#F3EEFF" />
      <ellipse cx="60" cy="60" rx="38" ry="38" fill="#EDE9FE" />
      <path d="M60 22 C60 22 76 38 76 62 L60 78 L44 62 C44 38 60 22 60 22Z" fill="#7C3AED" />
      <path d="M60 22 C60 22 76 38 76 62 L60 78 L60 22Z" fill="#6D28D9" />
      <ellipse cx="60" cy="60" rx="8" ry="8" fill="#FCD34D" />
      <ellipse cx="60" cy="60" rx="5" ry="5" fill="#F59E0B" />
      <path d="M44 62 L32 78 L48 70Z" fill="#EF4444" opacity="0.85" />
      <path d="M76 62 L88 78 L72 70Z" fill="#EF4444" opacity="0.85" />
      <path d="M53 75 L50 94 L60 84 L70 94 L67 75Z" fill="#F59E0B" />
      <circle cx="38" cy="32" r="3" fill="#FCD34D" opacity="0.7" />
      <circle cx="82" cy="44" r="2" fill="#FCD34D" opacity="0.5" />
      <circle cx="88" cy="28" r="4" fill="#A78BFA" opacity="0.5" />
      <circle cx="30" cy="55" r="2" fill="#A78BFA" opacity="0.4" />
    </svg>
  );
}

function DecoGrid() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-30" fill="none">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={c * 40 + 4} y={r * 40 + 4} width="32" height="32"
            rx="8" stroke="#7C3AED" strokeWidth="1" fill="none" opacity={0.3 + (r + c) * 0.05} />
        ))
      )}
    </svg>
  );
}

export default function CareerQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { user } = useAuth();

  const totalQ = QUESTIONS.length;
  const qIndex = step - 1;
  const question = QUESTIONS[qIndex];

  function selectOption(qId, value, type) {
    if (type === "single") {
      setCurrent(value);
    } else {
      const prev = Array.isArray(current) ? current : (answers[`q${qId}`] || []);
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
      setCurrent(next);
    }
  }

  function isSelected(value) {
    if (!question) return false;
    if (question.type === "single") return current === value;
    return Array.isArray(current) && current.includes(value);
  }

  function canProceed() {
    if (!question) return true;
    if (question.type === "single") return current !== null && current !== undefined;
    return Array.isArray(current) && current.length > 0;
  }

  function nextStep() {
    if (animating) return;
    if (step > 0 && step <= totalQ) {
      setAnswers((prev) => ({ ...prev, [`q${step}`]: current }));
    }
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setCurrent(null);
      setAnimating(false);
    }, 250);
  }

  function prevStep() {
    if (animating || step <= 1) return;
    setAnimating(true);
    setTimeout(() => {
      const prevKey = `q${step - 1}`;
      const prevQ = QUESTIONS[step - 2];
      setCurrent(answers[prevKey] ?? (prevQ?.type === "multi" ? [] : null));
      setStep((s) => s - 1);
      setAnimating(false);
    }, 250);
  }

  const result = step > totalQ ? getRoadmapResult(answers) : null;
  const font = { fontFamily: "'Trebuchet MS', 'Lucida Grande', sans-serif" };

  // ── Landing ──────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={{ ...font, background: "#ffffff", height: "98%" }}
        className="relative overflow-hidden">

        {/* Top purple accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1"
          style={{ background: "linear-gradient(90deg, #7C3AED, #FCD34D)" }} />

        {/* Background deco */}
        <div className="absolute top-0 right-0 w-72 h-72 opacity-40 pointer-events-none">
          <DecoGrid />
        </div>
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-50 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)", transform: "translate(-30%, 30%)" }} />
        <div className="absolute top-1/2 right-8 w-40 h-40 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #FCD34D, transparent)" }} />

        <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10"
          >
          {/* Nav */}
          <div className="absolute top-6 left-8 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}>
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">AlgoNest</span>
          </div>

          {/* Rocket */}
          <motion.div variants={fadeUp}>
            <RocketSVG />
          </motion.div>


          {/* Pill */}
          <div className="flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border"
            style={{ background: "#F3EEFF", borderColor: "#DDD6FE" }}>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse inline-block" />
            <span className="text-purple-700 text-xs font-semibold tracking-wide">FREE CAREER ASSESSMENT</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-center text-gray-900 mb-4 leading-tight max-w-2xl">
            Find Your 
            <span style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> Flight Path
            </span>
          </h1>

          <p className="text-center text-gray-500 text-lg max-w-md mb-2">
            6 questions. 2 minutes. A personalized tech career roadmap built just for you.
          </p>
          <p className="text-center text-gray-400 text-sm max-w-sm mb-10">
            No fluff. No generic advice. Just the exact path from where you are to where you want to be.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-10">
            {[["6", "Questions"], ["~2 min", "To complete"], ["Free", "Always"]].map(([val, lab]) => (
              <div key={lab} className="text-center">
                <div className="font-bold text-2xl text-gray-900">{val}</div>
                <div className="text-gray-400 text-xs mt-0.5">{lab}</div>
              </div>
            ))}
          </div>

          <button onClick={nextStep}
            className="px-10 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)", boxShadow: "0 8px 32px rgba(124,58,237,0.35)" }}>
            Start My Assessment →
          </button>

          <p className="text-gray-400 text-xs mt-5">No account needed to start</p>

          {/* Feature strip */}
          {/* <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8 flex-wrap px-4">
            {["✅ Project-first learning", "✅ Live mentor checkpoints", "✅ Verified portfolio"].map((f) => (
              <span key={f} className="text-gray-400 text-xs">{f}</span>
            ))}
          </div> */}
      </motion.div>
      </div>
    );
  }
  // ── Result ───────────────────────────────────────────────
if (step > totalQ) {
  return (
    <div
      style={{
        ...font,
        background: "#ffffff",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
      }}
      className="relative flex flex-col"
    >
      {/* ── Top accent bar ── */}
      <div
        className="absolute top-0 left-0 right-0 h-1 z-20"
        style={{ background: "linear-gradient(90deg, #7C3AED, #FCD34D)" }}
      />

      {/* ── Dot grid (top right) ── */}
      <div className="absolute top-0 right-0 w-72 h-72 opacity-70 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
          {Array.from({ length: 8 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={c * 26 + 10}
                cy={r * 26 + 10}
                r="1.5"
                fill="#7C3AED"
                opacity={0.12 + ((r + c) % 3) * 0.1}
              />
            ))
          )}
        </svg>
      </div>

      {/* ── Bottom-left circle orb ── */}
      <div
        className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          transform: "translate(-35%, 35%)",
        }}
      />

      {/* ── Top-right warm orb ── */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(252,211,77,0.12) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      {/* ── Floating dots ── */}
      {[
        [8, 18], [18, 65], [92, 12], [85, 72], [50, 8],
        [70, 90], [30, 85], [95, 45], [12, 45],
      ].map(([x, y], i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full pointer-events-none z-0"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            background: "#FCD34D",
            opacity: 0.45 + (i % 3) * 0.2,
          }}
        />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col h-full px-8 py-5 max-w-6xl mx-auto w-full">

        {/* Nav */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}
            >
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-gray-900 font-bold text-sm">AlgoNest</span>
          </div>
          <button
            onClick={() => { setStep(0); setAnswers({}); setCurrent(null); }}
            className="text-gray-400 text-xs hover:text-gray-600 transition-colors underline"
          >
            Start over
          </button>
        </div>

        {/* Pill */}
        <div className="flex items-center gap-3 mb-4 flex-shrink-0">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border"
            style={{ background: "#F3EEFF", borderColor: "#DDD6FE" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse inline-block" />
            <span className="text-purple-700 text-xs font-bold tracking-widest uppercase">
              Your Personalized Roadmap
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-gray-900 mb-1 flex-shrink-0 leading-tight">
          Here's your
          <span
            style={{
              background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          > flight path
          </span>
        </h2>
        <p className="text-gray-400 text-sm mb-5 flex-shrink-0">
          Based on your 6 answers — built specifically for you.
        </p>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">

          {/* Col 1 — Roles */}
          <div className="flex flex-col gap-3 min-h-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex-shrink-0">
              Suggested Roles
            </h3>
            <div className="flex flex-col gap-2 flex-1">
              {result.roles.map((role, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border flex-1 relative overflow-hidden shadow-sm"
                  style={{
                    background: i === 0 ? "#F3EEFF" : "#FAFAFA",
                    borderColor: i === 0 ? "#DDD6FE" : "#E5E7EB",
                  }}
                >
                  {i === 0 && (
                    <div
                      className="absolute top-0 right-0 w-16 h-16 rounded-full pointer-events-none"
                      style={{
                        background: "radial-gradient(circle, rgba(124,58,237,0.15), transparent)",
                        transform: "translate(30%, -30%)",
                      }}
                    />
                  )}
                  <div className="text-xs text-gray-400 mb-1">{role.demand}</div>
                  <div className="text-gray-900 font-bold text-sm leading-tight mb-1.5">{role.title}</div>
                  <div
                    className="text-xs font-bold px-2 py-0.5 rounded-full inline-block"
                    style={{ background: "#FEF9C3", color: "#92400E", border: "1px solid #FDE68A" }}
                  >
                    {role.salary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2 — Skills + Roadmaps */}
          <div className="flex flex-col gap-3 min-h-0">

            {/* Skills */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Skills You'll Build
              </h3>
              <div
                className="rounded-2xl p-4 border shadow-sm"
                style={{ background: "#FAFAFA", borderColor: "#E5E7EB" }}
              >
                <div className="flex flex-wrap gap-1.5">
                  {result.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        background: "#F3EEFF",
                        borderColor: "#DDD6FE",
                        color: "#6D28D9",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Roadmaps */}
            <div className="flex-1 min-h-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Recommended Roadmaps
              </h3>
              <div className="flex flex-col gap-2">
                {result.roadmaps.map((rm, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl px-4 py-3 border shadow-sm"
                    style={{
                      background: i === 0 ? "#F3EEFF" : "#FAFAFA",
                      borderColor: i === 0 ? "#DDD6FE" : "#E5E7EB",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{
                          background: i === 0 ? "#7C3AED" : "#E5E7EB",
                          color: i === 0 ? "#fff" : "#374151",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-gray-900 text-xs font-semibold leading-tight">{rm.name}</div>
                        <div className="text-gray-400 text-xs">{rm.duration}</div>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2"
                      style={{ background: "#FEF9C3", color: "#92400E", border: "1px solid #FDE68A" }}
                    >
                      {rm.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 3 — CTA */}
          <div className="flex flex-col min-h-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Next Step
            </h3>
            <div
              className="rounded-2xl p-5 border flex flex-col flex-1 relative overflow-hidden shadow-sm"
              style={{
                background: "linear-gradient(145deg, #F3EEFF 0%, #EDE9FE 100%)",
                borderColor: "#DDD6FE",
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute bottom-0 right-0 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(252,211,77,0.2), transparent)",
                  transform: "translate(20%, 20%)",
                }}
              />

              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-gray-900 font-bold text-lg leading-tight mb-2">
                Ready to take flight?
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                Create your free profile, upload your resume, and get matched with a mentor who'll take you from here to hired.
              </p>

              {/* Feature list */}
              <div className="space-y-2 mb-5 flex-1">
                {[
                  "✅ Project-first learning roadmap",
                  "✅ Live mentor checkpoints",
                  "✅ Verified portfolio on completion",
                  "✅ Mentor referral to their network",
                ].map((f) => (
                  <div key={f} className="text-gray-500 text-xs">{f}</div>
                ))}
              </div>

              <div className="space-y-2 flex-shrink-0">
                <button
                  // onClick={() => setShowSignup(true)}
                  onClick={() => navigate("/signup")}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #4C1D95)",
                    boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                  }}
                >
                  Create Profile
                </button>
                {/* <button
                  onClick={() => setShowSignup(true)}
                  className="w-full py-2.5 rounded-xl font-semibold text-purple-700 text-sm border transition-all hover:bg-white"
                  style={{ background: "rgba(124,58,237,0.08)", borderColor: "#DDD6FE" }}
                >
                  Explore Free Roadmaps →
                </button> */}
                {/* <button
                    onClick={() => {
                        if (user) {
                        window.location.href = "/dashboard";
                        } else {
                        setShowSignup(true);
                        }
                    }}
                    className="w-full py-2.5 rounded-xl font-semibold text-purple-700 text-sm border transition-all hover:bg-white"
                    style={{ background: "rgba(124,58,237,0.08)", borderColor: "#DDD6FE" }}
                    >
                    {user ? "Go to My Dashboard →" : "Explore Free Roadmaps →"}
                    </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex justify-center gap-8 mt-4 flex-shrink-0">
          {["✅ Free forever tier", "✅ No credit card needed", "✅ Start in minutes"].map((f) => (
            <span key={f} className="text-gray-400 text-xs">{f}</span>
          ))}
        </div>
      </div>

      {/* ── Signup modal ── */}
      {showSignup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)" }}
        >
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative border border-gray-100 shadow-2xl">
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-light transition-colors"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="text-gray-900 font-bold text-xl">Join AlgoNest</h3>
              <p className="text-gray-400 text-sm mt-1">Start your flight to success</p>
            </div>
            <div className="space-y-3">
              <input
                id="career-quiz-signup-name"
                name="name"
                placeholder="Full name"
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-800 border border-gray-200 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
              />
              <input
                id="career-quiz-signup-email"
                name="email"
                placeholder="Email address"
                type="email"
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-800 border border-gray-200 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
              />
              <input
                id="career-quiz-signup-password"
                name="password"
                placeholder="Password"
                type="password"
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-800 border border-gray-200 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
              />
              {/* <div className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                <div className="text-2xl mb-1">📎</div>
                <div className="text-gray-600 text-sm font-medium">Upload your resume</div>
                <div className="text-gray-400 text-xs mt-1">PDF, DOC up to 5MB</div>
              </div> */}
              <button
                className="w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-md"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}
              >
                Create Free Account
              </button>
              <p className="text-center text-gray-400 text-xs">
                Already have an account?{" "}
                <span className="text-purple-600 cursor-pointer hover:underline">Sign in</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  // ── Question ─────────────────────────────────────────────
  return (
    <div style={{ ...font, background: "#ffffff", minHeight: "100vh" }}
      className="flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, #7C3AED, #FCD34D)" }} />

      {/* Subtle bg deco */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none">
        <DecoGrid />
      </div>
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)", transform: "translate(-30%, 30%)" }} />

      <div className="w-full max-w-4xl relative z-10">

        {/* Nav row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED, #4C1D95)" }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-800 text-sm">AlgoNest</span>
          </div>
          <span className="text-gray-400 text-sm font-medium">{step} / {totalQ}</span>
        </div>

        {/* Progress timeline */}
        <div className="mb-8">
          <div className="flex gap-1.5 mb-2">
            {QUESTIONS.map((_, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-500"
                style={{
                  background: i < step
                    ? "linear-gradient(90deg, #7C3AED, #A78BFA)"
                    : i === step - 1
                    ? "#DDD6FE"
                    : "#F3F4F6"
                }} />
            ))}
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400 font-medium">{question?.tag}</span>
            <span className="text-xs text-gray-400">{totalQ - step} remaining</span>
          </div>
        </div>

        {/* Question card */}
        <div className={`bg-white rounded-3xl p-4 border border-gray-100 shadow-sm transition-all duration-250 ${animating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>

          {/* Tag row */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{question?.icon}</span>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: "#F3EEFF", color: "#7C3AED", border: "1px solid #DDD6FE" }}>
              {question?.tag}
            </span>
            {question?.type === "multi" && (
              <span className="text-xs text-gray-400 font-medium">Select all that apply</span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1.5">{question?.question}</h2>
          <p className="text-gray-400 text-sm mb-6">{question?.subtitle}</p>

          {/* Options */}
          <div className={`grid gap-3 ${question?.options.length > 3 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
            {question?.options.map((opt) => {
              const selected = isSelected(opt.value);
              return (
                <button key={opt.value}
                  onClick={() => selectOption(question.id, opt.value, question.type)}
                  className="text-left rounded-2xl px-4 py-4 border transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
                  style={{
                    background: selected ? "#F3EEFF" : "#FAFAFA",
                    borderColor: selected ? "#7C3AED" : "#E5E7EB",
                    boxShadow: selected ? "0 0 0 2px rgba(124,58,237,0.15)" : "none"
                  }}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{opt.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm" style={{ color: selected ? "#6D28D9" : "#111827" }}>
                        {opt.label}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">{opt.desc}</div>
                    </div>
                    <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all ${selected ? "text-white" : "border-gray-300"}`}
                      style={{
                        background: selected ? "#7C3AED" : "transparent",
                        borderColor: selected ? "#7C3AED" : "#D1D5DB"
                      }}>
                      {selected && <CheckIcon />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={prevStep} disabled={step <= 1}
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all disabled:opacity-30 bg-white">
            ← Back
          </button>

          <button onClick={nextStep} disabled={!canProceed()}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
            style={{
              background: canProceed() ? "linear-gradient(135deg, #7C3AED, #4C1D95)" : "#E5E7EB",
              color: canProceed() ? "#ffffff" : "#9CA3AF",
              boxShadow: canProceed() ? "0 4px 20px rgba(124,58,237,0.35)" : "none"
            }}>
            {step === totalQ ? "See My Roadmap 🚀" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
