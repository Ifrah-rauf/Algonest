import { useEffect, useState } from "react";
import Navbar from "../components/navbar.js";
import { useNavigate } from "react-router-dom";
const P = "#534AB7";
const Y = "#f6c90e";
const LP = "#f0effc";

const pillars = [
  {  title: "Project Recording", sub: "You build. We capture. Employers see you work, not a resume." },
  {  title: "12 Online Assessments", sub: "Milestone-based. You don't move forward until you understand." },
  { title: "4 Face-to-Face Reviews", sub: "Real mentor. Real conversation. Real sign-off on your work." },
  {  title: "2 Mock Interviews", sub: "Coached under pressure before you ever sit in a real room." },
  {  title: "Free AI Companion", sub: "Always on. Never writes code for you. Finds your gaps and explains them." },
  { title: "Proof of Completion", sub: "Not a certificate — a verified portfolio with checkpoint history." },
];
const categories = [
  {
    id: "simple",
    icon: "🚀",
    name: "Simple Stack",
    tagline: "Your first dev role. Fastest structured path.",
    for: "Final year students, freshers, self-learners who need their first job in tech.",
    points: [
      "MERN, Spring Boot, Django, React, Node.js",
      "Free preview available — no card needed",
      "3–4 months, ₹9,999 all-in",
      "12 live mentor checkpoint sessions",
    ],
    projects: ["Job Tracker", "E-Commerce App", "Chat App", "CMS Dashboard", "Auth System"],
  },
  {
    id: "advanced",
    icon: "⚡",
    name: "Advanced Stack",
    tagline: "High-demand skills. 2x the salary ceiling.",
    for: "Devs with one foundation stack, career switchers into GenAI, ML, or Cloud.",
    points: [
      "GenAI, ML Engineering, Cloud/DevOps",
      "LLM APIs + RAG + Vector DBs",
      "4–5 months intensive path",
      "14 live mentor checkpoints",
    ],
    projects: ["RAG Chatbot", "ML SaaS API", "CI/CD Pipeline", "AI-Powered Tool", "K8s Cluster"],
  },
  {
    id: "fang",
    icon: "🎯",
    name: "FAANG Stack",
    tagline: "Product companies. Top 1% engineering roles.",
    for: "Developers targeting Flipkart, Amazon, Google, Swiggy-level engineering teams.",
    points: [
      "Systems Engineering, DSA, System Design",
      "SDE-2+ mentor network with FAANG referrals",
      "Mock interviews + real introductions",
      "C++ / Low-level + Full Stack combo paths",
    ],
    projects: ["Distributed Cache", "Memory Allocator", "Collab Editor at Scale", "Search Engine"],
  },
];

const STACK_TEMPLATES = [
  {
    id: 1, type: "simple",
    name: "MERN Full Stack", badge: "Most Popular", badgeBg: P,
    role: "Full Stack Developer",
    salary: "₹4–9 LPA", duration: "3–4 mo", sessions: 12,
    difficulty: "Beginner", diffN: 1, preview: true,
    skills: ["MongoDB", "Express.js", "React", "Node.js", "JWT Auth", "REST APIs"],
    projects: ["Job Board Platform", "E-Commerce Store", "Real-time Chat App"],
    companies: ["Zoho", "Freshworks", "Startups"],
    desc: "The most-hired stack in India. Build real apps, get mentor-verified, walk into interviews with proof — not a certificate.",
  },
  {
    id: 2, type: "simple",
    name: "Spring Boot + React", badge: "High Demand", badgeBg: "#059669",
    role: "Java Full Stack Developer",
    salary: "₹5–12 LPA", duration: "4–5 mo", sessions: 12,
    difficulty: "Intermediate", diffN: 2, preview: true,
    skills: ["Java", "Spring Boot", "React", "JPA/Hibernate", "MySQL", "REST"],
    projects: ["Banking Dashboard", "HR Management System", "Inventory Tracker"],
    companies: ["Wipro", "Infosys", "Capgemini", "Banks"],
    desc: "Enterprise India's backbone. Spring Boot + React is the exact stack MNCs and banks are always hiring for.",
  },
  {
    id: 3, type: "simple",
    name: "React Frontend", badge: "Fast Entry", badgeBg: "#0891b2",
    role: "Frontend Developer",
    salary: "₹3–7 LPA", duration: "3 mo", sessions: 8,
    difficulty: "Beginner", diffN: 1, preview: false,
    skills: ["React", "TypeScript", "Tailwind CSS", "Redux", "REST APIs", "Testing"],
    projects: ["Portfolio Dashboard", "Netflix Clone", "Productivity App"],
    companies: ["Agencies", "Startups", "Remote"],
    desc: "Frontend is the fastest path to your first dev job. React + TypeScript is what every product startup is interviewing for.",
  },
  {
    id: 4, type: "simple",
    name: "Node.js Backend", badge: "API Specialist", badgeBg: "#7c3aed",
    role: "Backend Developer",
    salary: "₹4–10 LPA", duration: "3–4 mo", sessions: 10,
    difficulty: "Intermediate", diffN: 2, preview: false,
    skills: ["Node.js", "Express", "PostgreSQL", "Redis", "REST/GraphQL", "Docker"],
    projects: ["Auth Microservice", "Payment API", "Notification System"],
    companies: ["Fintech", "SaaS Platforms", "Product Cos"],
    desc: "Build APIs that survive production traffic and systems that scale. Backend is where real engineering happens.",
  },
  {
    id: 5, type: "advanced",
    name: "GenAI Engineering", badge: "🔥 Trending", badgeBg: "#dc2626",
    role: "AI Engineer / GenAI Developer",
    salary: "₹8–20 LPA", duration: "4–5 mo", sessions: 14,
    difficulty: "Intermediate", diffN: 2, preview: true,
    skills: ["Python", "LLM APIs", "LangChain", "RAG", "Vector DBs", "FastAPI"],
    projects: ["RAG Chatbot on Custom Docs", "AI-Powered SaaS Tool", "LLM Fine-tuning Pipeline"],
    companies: ["AI Startups", "Product Companies", "Global Remote"],
    desc: "GenAI engineers are what 2025's most-funded startups are desperately hiring for. Learn to build, not just prompt.",
  },
  {
    id: 6, type: "advanced",
    name: "ML/AI Engineering", badge: "Research-Grade", badgeBg: "#7c3aed",
    role: "ML Engineer",
    salary: "₹8–18 LPA", duration: "4–5 mo", sessions: 14,
    difficulty: "Advanced", diffN: 3, preview: false,
    skills: ["Python", "PyTorch", "scikit-learn", "MLflow", "FastAPI", "Model Deployment"],
    projects: ["Custom ML Model + API", "Recommendation System", "Image Classification SaaS"],
    companies: ["Analytics Firms", "AI Cos", "Research Labs"],
    desc: "ML isn't magic — it's math + code + data. Build models from scratch, deploy them, and explain every decision under pressure.",
  },
  {
    id: 7, type: "advanced",
    name: "Cloud + DevOps", badge: "Infrastructure", badgeBg: "#0891b2",
    role: "DevOps / Cloud Engineer",
    salary: "₹6–15 LPA", duration: "4 mo", sessions: 12,
    difficulty: "Intermediate", diffN: 2, preview: false,
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Monitoring"],
    projects: ["Full CI/CD Pipeline", "Kubernetes Deployment", "Cloud Cost Dashboard"],
    companies: ["Cloud Startups", "Enterprises", "AWS Partners"],
    desc: "Every app needs infrastructure. Cloud engineers are the invisible force keeping products alive at scale.",
  },
  {
    id: 8, type: "fang",
    name: "Systems Engineering", badge: "Low-Level Expert", badgeBg: "#1f2937",
    role: "Systems / SDE-2 Engineer",
    salary: "₹12–30 LPA", duration: "5–6 mo", sessions: 16,
    difficulty: "Expert", diffN: 4, preview: false,
    skills: ["C++", "OS Internals", "Memory Mgmt", "Multithreading", "Network Programming"],
    projects: ["Custom Memory Allocator", "Thread Pool Library", "TCP Chat Server"],
    companies: ["Google", "Amazon", "Flipkart", "Games Industry"],
    desc: "Most developers never go this deep. Those who do command the highest salaries. This is the path to $100k+ engineering.",
  },
  {
    id: 9, type: "fang",
    name: "MERN + GenAI Combo", badge: "Combination Path", badgeBg: "#b45309",
    role: "AI-Integrated Full Stack Dev",
    salary: "₹10–22 LPA", duration: "5–6 mo", sessions: 16,
    difficulty: "Advanced", diffN: 3, preview: false,
    skills: ["MERN Stack", "LLM APIs", "RAG", "Vector Search", "Agent Flows", "Deployment"],
    projects: ["AI-Powered Job Platform", "Smart CRM with AI Insights", "Document Q&A SaaS"],
    companies: ["AI-first Startups", "Product Companies", "Global"],
    desc: "Full Stack + AI. The exact combination every funded startup is desperate to hire for right now. You build the product AND its intelligence.",
  },
];

function normalizeStackType(type) {
  const raw = String(type || "").trim().toLowerCase();
  if (!raw) return null;
  if (raw === "simple") return "simple";
  if (raw === "advanced") return "advanced";
  if (raw === "fang") return "fang";
  return null;
}

function buildStackList(courses = []) {
  if (!courses.length) return STACK_TEMPLATES;

  return courses
    .map((course) => {
      const type = normalizeStackType(course.type);
      if (!type) return null;
      const fallback = STACK_TEMPLATES.find((item) => item.type === type);
      if (!fallback) return null;

      return {
        ...fallback,
        ...course,
        id: course.course_id ?? course.id ?? fallback.id,  // add this line explicitly
        type,
        name: course.title || fallback.name,
        desc: course.description || fallback.desc,
        role: course.domain
            ? `${course.domain}${String(course.domain).toLowerCase().includes("developer") ? "" : " Developer"}`
            : fallback.role,
        };
    })
    .filter(Boolean);
}

function Badge({ children, bg }) {
  return (
    <span style={{ background: bg, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function DiffDots({ n, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i <= n ? P : "#e5e7eb", flexShrink: 0 }} />
      ))}
      <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>{label}</span>
    </div>
  );
}

function StackCard({ stack }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? P : "#e5e7eb"}`,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 20px 50px rgba(83,74,183,0.13)` : "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${P}, ${Y})` }} />
      <div style={{ padding: 26, flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
          <Badge bg={stack.badgeBg}>{stack.badge}</Badge>
          {stack.preview && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 10px", borderRadius: 20 }}>
              Free Preview
            </span>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.6, marginBottom: 4, lineHeight: 1.1 }}>{stack.name}</h3>
          <p style={{ fontSize: 14, color: P, fontWeight: 700, marginBottom: 8 }}>→ {stack.role}</p>
          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{stack.desc}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", background: "#f9fafb", borderRadius: 12, padding: "14px 16px", gap: 0 }}>
          {[
            { val: stack.salary, label: "Avg Salary", color: "#059669" },
            { val: stack.duration, label: "Duration", color: "#0a0a0a" },
            { val: stack.sessions, label: "Sessions", color: P },
          ].map((s, i) => (
            <div key={i} style={{ paddingLeft: i > 0 ? 12 : 0, borderLeft: i > 0 ? "1px solid #e5e7eb" : "none" }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: s.color, letterSpacing: -0.4 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Skills you'll master</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {stack.skills.map((sk, i) => (
              <span key={i} style={{ fontSize: 12, background: LP, color: P, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>{sk}</span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Projects you'll build</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {stack.projects.map((pr, i) => (
              <div key={i} style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: Y, fontSize: 14, fontWeight: 800 }}>▸</span> {pr}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Companies hiring this</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {stack.companies.map((co, i) => (
              <span key={i} style={{ fontSize: 12, color: "#4b5563", background: "#f3f4f6", padding: "3px 10px", borderRadius: 20 }}>{co}</span>
            ))}
          </div>
        </div>

        <DiffDots n={stack.diffN} label={stack.difficulty} />

        <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate(`/roadmap_express?courseId=${stack.course_id || 1}`)}
            style={{ flex: 1, background: P, color: "#fff", border: "none", padding: "13px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            Start This Path →
          </button>
          <button
            onClick={() => navigate(`/book-now?courseId=${stack.course_id || 1}&stack=${stack.type}&stackName=${encodeURIComponent(stack.name)}`)}
            style={{ background: "#fff", color: P, border: `1.5px solid ${P}`, padding: "13px 16px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AlgoNestPage() {
  const [activeCat, setActiveCat] = useState("simple");
  const [allStacks, setAllStacks] = useState(() => STACK_TEMPLATES);
  const [decided, setDecided] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCourseStacks() {
      try {
        const res = await fetch("http://localhost:5000/api/plans/getCourse");
        const data = await res.json();
        if (!cancelled && data?.courses) {
          setAllStacks(buildStackList(data.courses));
        }
      } catch (err) {
        console.error("Failed to load course stacks:", err);
      }
    }

    loadCourseStacks();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = allStacks.filter((stack) => stack.type === activeCat);
  return (
    <div style={{ fontFamily: "'Syne', 'DM Sans', sans-serif", background: "#fff", color: "#0a0a0a", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        .nav-link:hover { color: #534AB7 !important; }
        .quiz-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .quiz-btn { transition: all 0.18s; }
        .cat-card { cursor: pointer; transition: border-color 0.18s, box-shadow 0.18s; }
        .cat-card:hover { border-color: #534AB7 !important; }
        .tab-btn:hover { background: #e5e7eb; color: #111827; }
        .tab-btn { transition: all 0.15s; }
        .browse-btn:hover { border-color: #534AB7 !important; color: #534AB7 !important; }
      `}</style>

        <Navbar/>

      {/* HERO */}
      <section style={{ fontFamily: "'Syne', 'DM Sans', sans-serif", background: "#fff", borderBottom: "1px solid #ececec" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pill-card { transition: border-color 0.18s, box-shadow 0.18s; }
        .pill-card:hover { border-color: #534AB7 !important; box-shadow: 0 4px 20px rgba(83,74,183,0.10) !important; }
        .cta-yes:hover { opacity: 0.88; }
        .cta-no:hover { background: #f0effc !important; }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "56px 48px 52px" }}>

        {/* TOP BADGE */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: LP, border: `1px solid #ddd8f8`, borderRadius: 100, padding: "5px 14px", marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: P, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: P, fontFamily: "'DM Sans'", letterSpacing: 0.3 }}>
            India's execution-first platform for engineering students
          </span>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

          {/* LEFT — headline + why + CTA */}
          <div>
            <h1 style={{ fontSize: "clamp(36px,4.5vw,58px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.06, marginBottom: 20 }}>
              Skills prove you.<br />
              <span style={{ position: "relative", display: "inline-block" }}>
                Degrees don't.
                <span style={{ position: "absolute", bottom: 4, left: 0, right: 0, height: 10, background: Y, zIndex: -1, borderRadius: 2, opacity: 0.8 }} />
              </span>
            </h1>

            {/* WHY BLOCK */}
            <div style={{ background: "#fafafa", border: "1px solid #f0effc", borderLeft: `3px solid ${P}`, borderRadius: "0 10px 10px 0", padding: "16px 18px", marginBottom: 28 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: P, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Sans'" }}>Why skills-based learning?</p>
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, fontFamily: "'DM Sans'" }}>
                {/* 80% of India's engineering graduates are unemployable — not because they lack intelligence, but because nobody ever watched them build something real under pressure. Companies don't hire CVs anymore. They hire proof.
                <span style={{ fontWeight: 700, color: "#0a0a0a" }}> AlgoNest makes that proof visible, verified, and vouched for by a human mentor.</span> */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  [ "• Choose a role target — not a subject. Build toward a job."],
                  ["• Work on your own real project, guided by a structured roadmap."],
                  ["• AI companion tracks your gaps in real time — never writes code for you."],
                  ["• 12 assessments + 4 mentor reviews + 2 mock interviews before you're done."],
                  ["• Your project is recorded. Your thinking is documented. Your mentor vouches."],
                ].map(([ic, tx], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{ic}</span>
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, fontFamily: "'DM Sans'" }}>{tx}</span>
                  </div>
                ))}
              </div>
              
              </p>
            </div>

            {/* HOW WE DO IT — compact list */}
            {/* <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14, fontFamily: "'DM Sans'" }}>How AlgoNest works</p>
              
            </div> */}

          </div>

          {/* RIGHT — 6 pillars grid */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16, fontFamily: "'DM Sans'" }}>
              What you get with every paid path
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="pill-card"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #ececec",
                    borderRadius: 14,
                    padding: "18px 16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{p.icon}</div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 5, lineHeight: 1.25 }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, fontFamily: "'DM Sans'" }}>{p.sub}</p>
                </div>
              ))}
            </div>

            {/* PRICING NUDGE */}
            <div style={{ marginTop: 14, background: "#0a0a0a", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans'", marginBottom: 4 }}>
                  All of the above, all-in
                </p>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: -0.8 }}>
                  ₹9,999
                  <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginLeft: 8, letterSpacing: 0 }}>
                    vs ₹50,000–₹85,000 elsewhere
                  </span>
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: Y, color: "#0a0a0a", fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 100, whiteSpace: "nowrap" }}>
                  3–5 months · Mentor-verified
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: Y, border: Y, borderRadius: 14, padding: "20px 22px", marginTop:"20px"}}>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0a0a0a", marginBottom: 5, fontFamily: "'Syne'" }}>Have you decided your path?</p>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 18, fontFamily: "'DM Sans'" }}>
                Pick what fits — we'll take you straight to the right stack.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="cta-yes"
                  onClick={() => setDecided("yes")}
                  style={{
                    flex: 1, background: decided === "yes" ? P : "#fff",
                    color: decided === "yes" ? "#fff" : P,
                    border: `2px solid ${P}`,
                    padding: "11px 0", borderRadius: 9,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'DM Sans'", transition: "all 0.15s"
                  }}>
                  Yes, show me paths →
                </button>
                <button
                  className="cta-no"
                  onClick={() => setDecided("no")}
                  style={{
                    flex: 1, background: decided === "no" ? "#f0effc" : "#fff",
                    color: "#374151",
                    border: "2px solid #e5e7eb",
                    padding: "11px 0", borderRadius: 9,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    fontFamily: "'DM Sans'", transition: "all 0.15s"
                  }}>
                  Not sure — take quiz ✦
                </button>
              </div>

              {decided === "yes" && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: "#fff", borderRadius: 9, border: "1px solid #ddd8f8", fontSize: 13, color: P, fontWeight: 600, fontFamily: "'DM Sans'" }}>
      ↓ Scroll to pick your stack below — Simple, Advanced, or FAANG.
                </div>
              )}
              {decided === "no" && (
                <div style={{ marginTop: 14, padding: "12px 14px", background: "#fff", borderRadius: 9, border: "1px solid #ddd8f8" }}>
                  <p style={{ fontSize: 13, color: "#374151", fontFamily: "'DM Sans'", marginBottom: 10, lineHeight: 1.5 }}>
                    Answer 5 quick questions. We'll tell you the exact path, the right mentor tier, and what salary you're targeting.
                  </p>
                  <button style={{ width: "100%", background: Y, color: "#0a0a0a", border: "none", padding: "11px 0", borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                    Start Career Quiz →
                  </button>
                </div>
              )}
            </div>
      </div>
    </section>

      {/* CATEGORY SECTION */}
      <section style={{ background: "linear-gradient(180deg, #1a0533 0%, #120326 100%)", padding: "88px 48px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at top left, rgba(246,201,14,0.14), transparent 32%), radial-gradient(circle at top right, rgba(107,70,193,0.34), transparent 28%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(246,201,14,0.1)", border: "1px solid rgba(246,201,14,0.18)", borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: Y, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fef3c7", letterSpacing: 0.3, fontFamily: "'DM Sans'" }}>
                Step 1 — Choose your track
              </span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, marginBottom: 10, color: "#fff", lineHeight: 1.05 }}>
              What are you building this time?
            </h2>
            <p style={{ fontSize: 20, color: "rgba(255, 255, 255, 0.89)", fontFamily: "'DM Sans'", maxWidth: 1200 }}>
              Learn by building not by watching or AI-copying. Each track has a different mentor depth, session count, and salary ceiling. Pick the one that matches your goal.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {categories.map((cat) => {
              const active = activeCat === cat.id;
              return (
                <div
                  key={cat.id}
                  className="cat-card"
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    background: active ? "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))" : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${active ? "rgba(246,201,14,0.55)" : "rgba(255,255,255,0.10)"}`,
                    borderRadius: 18,
                    padding: 28,
                    boxShadow: active ? `0 0 0 4px rgba(246,201,14,0.12), 0 20px 40px rgba(0,0,0,0.24)` : "0 8px 24px rgba(0,0,0,0.16)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <span style={{ fontSize: 30 }}>{cat.icon}</span>
                    {active && (
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: Y, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 0 4px rgba(246,201,14,0.14)" }}>
                        <span style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 800 }}>✓</span>
                      </div>
                    )}
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6, color: "#fff" }}>{cat.name}</h3>
                  <p style={{ fontSize: 13, color: "#f6c90e", fontWeight: 700, marginBottom: 10, fontFamily: "'DM Sans'", fontStyle: "italic" }}>{cat.tagline}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 18, fontFamily: "'DM Sans'", lineHeight: 1.5 }}>
                    <span style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>For:</span> {cat.for}
                  </p>

                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginBottom: 22 }}>
                    {cat.points.map((pt, i) => (
                      <li key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.84)", display: "flex", alignItems: "flex-start", gap: 8, fontFamily: "'DM Sans'", lineHeight: 1.5 }}>
                        <span style={{ color: Y, marginTop: 1, flexShrink: 0, fontWeight: 800 }}>→</span>
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.48)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Sample projects</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {cat.projects.map((pr, i) => (
                        <span key={i} style={{ fontSize: 11, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "3px 10px", color: "rgba(255,255,255,0.78)", fontFamily: "'DM Sans'" }}>{pr}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STACK CARDS */}
      <section style={{ padding: "80px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: P, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 14, fontFamily: "'DM Sans'" }}>Step 2 — Pick your stack</p>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1.2, marginBottom: 10 }}>
              {categories.find((c) => c.id === activeCat)?.name} Paths
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", fontFamily: "'DM Sans'", marginBottom: 22 }}>
              {filtered.length} paths · click any to see full roadmap & enroll
            </p>

            <div style={{ display: "inline-flex", background: "#f3f4f6", borderRadius: 999, padding: 5, gap: 6, boxShadow: "inset 0 0 0 1px #e5e7eb" }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="tab-btn"
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    background: activeCat === cat.id ? "#111827" : "transparent",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    color: activeCat === cat.id ? "#fff" : "#6b7280",
                    boxShadow: activeCat === cat.id ? "0 8px 18px rgba(17,24,39,0.18)" : "none",
                    fontFamily: "'DM Sans'",
                    minWidth: 120,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {filtered.map((stack, i) => (
  <StackCard key={`${stack.type}-${stack.course_id || stack.id || i}`} stack={stack} />
))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "#fafafa", borderTop: "1px solid #f0effc", borderBottom: "1px solid #f0effc", padding: "40px 48px" }}>
        <div style={{ margin: "0 auto" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1.5, fontFamily: "'DM Sans'" }}>Why students choose AlgoNest</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            {[
              "No classroom needed",
              "AI companion + real mentor",
              "Your own project, not a template",
              "Mentor vouches for you by name",
              "₹9,999 — not ₹85,000",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: Y, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "#0a0a0a" }}>✓</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: "'DM Sans'" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background: P, padding: "80px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 20, fontFamily: "'DM Sans'" }}>Not sure where to start?</p>
        <h2 style={{ color: "#fff", fontSize: 48, fontWeight: 800, letterSpacing: -2, marginBottom: 16, lineHeight: 1.05 }}>
          Take the quiz.<br />
          <span style={{ color: Y }}>We'll tell you exactly where to go.</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, marginBottom: 40, fontFamily: "'DM Sans'", maxWidth: 480, margin: "0 auto 40px" }}>
          2 minutes. Tell us your background and goal. We'll show you the path, the projects, and the mentor that fits.
        </p>
        <button className="quiz-btn" style={{ background: Y, color: "#0a0a0a", border: "none", padding: "17px 40px", borderRadius: 12, fontSize: 18, fontWeight: 800, cursor: "pointer" }}>
          Take Career Quiz →
        </button>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 20, fontFamily: "'DM Sans'" }}>
          Free · No sign-up required · Takes 2 minutes
        </p>
      </section>
    </div>
  );
}
