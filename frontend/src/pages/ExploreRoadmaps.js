import { useEffect, useState } from "react";
import Navbar from "../components/navbar.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../components/student-dashboard/constants";
import { isGithubUrl, normalizeGithubUrl } from "../components/student-dashboard/github";
import "../styles/explore-roadmaps.css";

const P = "#534AB7";
const Y = "#f6c90e";
const LP = "#f0effc";
const DARK = "#0a0a0a";

const pillars = [
  { icon: "", title: "Project Recording", sub: "You build. We capture." },
  { icon: "", title: "12 Online Assessments", sub: "Milestone-based sign-off." },
  { icon: "", title: "4 Face-to-Face Reviews", sub: "Real mentor. Real verdict." },
  { icon: "", title: "2 Mock Interviews", sub: "Coached before the real room." },
  { icon: "", title: "Free AI Companion", sub: "Scaffolds — never writes for you." },
  { icon: "", title: "Proof of Completion", sub: "Verified portfolio, not a cert." },
];

const categories = [
  {
    id: "trending",
    icon: "",
    name: "Trending Stack",
    tagline: "High-demand skills. 2× salary ceiling.",
    for: "Devs pivoting into GenAI, ML, or Cloud.",
    projects: ["RAG Chatbot", "ML SaaS API", "CI/CD Pipeline", "AI-Powered Tool"],
  },
  {
    id: "fang",
    icon: "",
    name: "FAANG Stack",
    tagline: "Product companies. Top 1% roles.",
    for: "Targeting Flipkart, Amazon, Google-level teams.",
    projects: ["Distributed Cache", "Memory Allocator", "Search Engine"],
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
    id: 5, type: "trending",
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
    id: 6, type: "trending",
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
    id: 7, type: "trending",
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
    desc: "Most developers never go this deep. Those who do command the highest salaries.",
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
    desc: "Full Stack + AI. The exact combination every funded startup is desperate to hire for right now.",
  },
];

function normalizeStackType(type) {
  const raw = String(type || "").trim().toLowerCase();
  if (raw === "trending") return "trending";
  if (raw === "fang") return "fang";
  return null;
}

function normalizeCourseStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function isCourseAvailable(course) {
  return normalizeCourseStatus(course?.status) !== "upcoming";
}

function buildStackList(courses = []) {
  if (!courses.length) return [];
  return courses
    .filter(isCourseAvailable)
    .map((course) => {
      const type = normalizeStackType(course.type);
      if (!type) return null;
      const fallback = STACK_TEMPLATES.find((item) => item.type === type);
      if (!fallback) return null;
      return {
        ...fallback,
        ...course,
        id: course.course_id ?? course.id ?? fallback.id,
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

function DiffDots({ n, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= n ? P : "#e5e7eb", flexShrink: 0 }} />
      ))}
      <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 3 }}>{label}</span>
    </div>
  );
}

function Badge({ children, bg }) {
  return (
    <span style={{ background: bg, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: 0.3, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

/* Horizontal card — used when only 1 card is available in a category */
function StackCardHorizontal({ stack, onStart, onBook }) {
  const [hovered, setHovered] = useState(false);
  const locked = normalizeCourseStatus(stack?.status) === "upcoming";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered && !locked ? P : "#e5e7eb"}`,
        borderRadius: 20,
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hovered && !locked ? `0 12px 40px rgba(83,74,183,0.12)` : "0 2px 12px rgba(0,0,0,0.04)",
        opacity: locked ? 0.75 : 1,
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${P}, ${Y})` }} />
      <div className="roadmaps-horizontal-grid">
        {/* Col 1: identity */}
        <div className="roadmaps-horizontal-col-1">
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
            <Badge bg={stack.badgeBg}>{stack.badge}</Badge>
            {stack.preview && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 20 }}>Free Preview</span>
            )}
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4, lineHeight: 1.1 }}>{stack.name}</h3>
          <p style={{ fontSize: 13, color: P, fontWeight: 700, marginBottom: 10 }}>→ {stack.role}</p>
          <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.6 }}>{stack.desc}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            {[
              { val: stack.salary, label: "Salary", color: "#059669" },
              { val: stack.duration, label: "Duration", color: DARK },
              { val: `${stack.sessions} sessions`, label: "Mentor", color: P },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: skills + projects */}
        <div className="roadmaps-horizontal-col-2">
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
            {stack.skills.map((sk, i) => (
              <span key={i} style={{ fontSize: 11, background: LP, color: P, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>{sk}</span>
            ))}
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Projects you'll build</p>
          {stack.projects.map((pr, i) => (
            <div key={i} style={{ fontSize: 12.5, color: "#374151", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ color: Y, fontWeight: 800 }}>▸</span> {pr}
            </div>
          ))}
        </div>

        {/* Col 3: companies + difficulty + CTA */}
        <div className="roadmaps-horizontal-col-3">
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Companies hiring this</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {stack.companies.map((co, i) => (
                <span key={i} style={{ fontSize: 11, color: "#4b5563", background: "#f3f4f6", padding: "3px 9px", borderRadius: 20 }}>{co}</span>
              ))}
            </div>
          </div>
          <DiffDots n={stack.diffN} label={stack.difficulty} />
          <div className="roadmaps-actions" style={{ display: "flex", gap: 8, marginTop: "auto" }}>
            <button
              disabled={locked}
              onClick={() => !locked && onStart(stack)}
              style={{ flex: 1, background: locked ? "#d1d5db" : P, color: locked ? "#6b7280" : "#fff", border: "none", padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: locked ? "not-allowed" : "pointer" }}
            >
              {locked ? "Locked" : "Start Path →"}
            </button>
            <button
              disabled={locked}
              onClick={() => !locked && onBook(stack)}
              style={{ background: "#fff", color: locked ? "#9ca3af" : P, border: `1.5px solid ${locked ? "#d1d5db" : P}`, padding: "11px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: locked ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
            >
              {locked ? "N/A" : "Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Vertical card — used in multi-card grid */
function StackCardVertical({ stack, onStart, onBook }) {
  const [hovered, setHovered] = useState(false);
  const locked = normalizeCourseStatus(stack?.status) === "upcoming";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered && !locked ? P : "#e5e7eb"}`,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hovered && !locked ? "translateY(-3px)" : "none",
        boxShadow: hovered && !locked ? `0 16px 44px rgba(83,74,183,0.12)` : "0 2px 12px rgba(0,0,0,0.04)",
        opacity: locked ? 0.8 : 1,
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${P}, ${Y})` }} />
      <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
          <Badge bg={stack.badgeBg}>{stack.badge}</Badge>
          {stack.preview && (
            <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 20 }}>Free Preview</span>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4, marginBottom: 3, lineHeight: 1.1 }}>{stack.name}</h3>
          <p style={{ fontSize: 13, color: P, fontWeight: 700, marginBottom: 7 }}>→ {stack.role}</p>
          <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.6 }}>{stack.desc}</p>
        </div>

        <div className="roadmaps-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "#f9fafb", borderRadius: 10, padding: "12px 14px" }}>
          {[
            { val: stack.salary, label: "Salary", color: "#059669" },
            { val: stack.duration, label: "Duration", color: DARK },
            { val: stack.sessions, label: "Sessions", color: P },
          ].map((s, i) => (
            <div className="roadmaps-stat" key={i} style={{ paddingLeft: i > 0 ? 10 : 0, borderLeft: i > 0 ? "1px solid #e5e7eb" : "none" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Skills</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {stack.skills.map((sk, i) => (
              <span key={i} style={{ fontSize: 11, background: LP, color: P, fontWeight: 600, padding: "3px 8px", borderRadius: 5 }}>{sk}</span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Projects</p>
          {stack.projects.map((pr, i) => (
            <div key={i} style={{ fontSize: 12, color: "#374151", display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{ color: Y, fontWeight: 800 }}>▸</span> {pr}
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Hiring at</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {stack.companies.map((co, i) => (
              <span key={i} style={{ fontSize: 11, color: "#4b5563", background: "#f3f4f6", padding: "2px 8px", borderRadius: 20 }}>{co}</span>
            ))}
          </div>
        </div>

        <DiffDots n={stack.diffN} label={stack.difficulty} />

        <div className="roadmaps-actions" style={{ marginTop: "auto", display: "flex", gap: 8 }}>
          <button
            disabled={locked}
            onClick={() => !locked && onStart(stack)}
            style={{ flex: 1, background: locked ? "#d1d5db" : P, color: locked ? "#6b7280" : "#fff", border: "none", padding: "11px 0", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: locked ? "not-allowed" : "pointer" }}
          >
            {locked ? "Locked" : "Start Path →"}
          </button>
          <button
            disabled={locked}
            onClick={() => !locked && onBook(stack)}
            style={{ background: "#fff", color: locked ? "#9ca3af" : P, border: `1.5px solid ${locked ? "#d1d5db" : P}`, padding: "11px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: locked ? "not-allowed" : "pointer" }}
          >
            {locked ? "N/A" : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LockedCard({ category }) {
  return (
    <div style={{ background: "#fafafa", border: "1.5px dashed #d1d5db", borderRadius: 20, padding: 28, textAlign: "center", opacity: 0.7 }}>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>🔒 No live courses in</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: "#374151" }}>{category?.name || "this category"}</p>
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>Check back soon</p>
    </div>
  );
}

export default function AlgoNestPage() {
  const [activeCat, setActiveCat] = useState("trending");
  const [allStacks, setAllStacks] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    async function loadCourseStacks() {
      try {
        const res = await fetch(`${API_BASE}/api/plans/getCourse`);
        const data = await res.json();
        if (!cancelled && data?.courses) setAllStacks(buildStackList(data.courses));
      } catch (err) {
        console.error("Failed to load course stacks:", err);
      }
    }
    loadCourseStacks();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setDashboardData(null);
    setGithubLink("");
    setReviewStatus(null);
    if (!user?.uid) return;
    let cancelled = false;
    async function loadDashboard() {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/getDashboard/${user.uid}`);
        const payload = await res.json();
        if (!res.ok || !payload?.success) throw new Error(payload?.error || "Failed to load profile");
        if (!cancelled) setDashboardData(payload.data || null);
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
      }
    }
    loadDashboard();
    return () => { cancelled = true; };
  }, [user?.uid]);

  useEffect(() => {
    const profileGithub = dashboardData?.profile?.github_url || dashboardData?.profile?.githubUrl || dashboardData?.profile?.github || "";
    if (profileGithub && !githubLink) setGithubLink(profileGithub);
  }, [dashboardData, githubLink]);

  async function handleSubmitForReview() {
    if (!user?.uid) { navigate("/login"); return; }
    const cleanedGithubLink = normalizeGithubUrl(githubLink);
    if (!cleanedGithubLink || !isGithubUrl(cleanedGithubLink)) {
      setReviewStatus({ type: "error", message: "Enter a valid GitHub repository or profile link." });
      return;
    }
    setReviewSubmitting(true);
    setReviewStatus(null);
    try {
      const res = await fetch(`${API_BASE}/api/support/github-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, githubUrl: cleanedGithubLink }),
      });
      const result = await res.json();
      if (!res.ok || !result?.success) throw new Error(result?.error || "Failed to submit");
      setReviewStatus({ type: "success", message: "Submitted! A mentor will reach out soon." });
    } catch (err) {
      setReviewStatus({ type: "error", message: err.message || "Failed to submit review request." });
    } finally {
      setReviewSubmitting(false);
    }
  }

  function handleStart(stack) {
    navigate(`/roadmap_express?courseId=${stack.course_id || 1}`);
  }
  function handleBook(stack) {
    navigate(`/book-now?courseId=${stack.course_id || 1}&stack=${stack.type}&stackName=${encodeURIComponent(stack.name)}`);
  }

  const filtered = allStacks.filter((s) => s.type === activeCat);

  return (
    <div className="roadmaps-page" style={{ fontFamily: "'Syne', 'DM Sans', sans-serif", background: "#fff", color: DARK, minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />

      {/* ─── HERO: compressed, punchy ─── */}
      <section className="roadmaps-hero" style={{ background: P, position: "relative", overflow: "hidden", padding: "40px 48px 36px" }}>
        {/* Decorative translucent circles */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, left: 180, width: 160, height: 160, borderRadius: "50%", background: "rgba(246,201,14,0.10)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: "38%", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -40, right: 60, width: 220, height: 220, borderRadius: "50%", background: "rgba(246,201,14,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", right: 280, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
 
        <div className="roadmaps-hero-inner">
          {/* Left: headline + price */}
          <div className="roadmaps-hero-copy" style={{ flex: "0 0 auto", maxWidth: 520 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "4px 12px", marginBottom: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: Y }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: 1.2, textTransform: "uppercase" }}>Execution-first mentorship</span>
            </div>
            <h1 style={{ fontSize: "clamp(34px, 3.5vw, 54px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.04, marginBottom: 14, color: "#fff" }}>
              Skills prove you.<br />
              <span style={{ position: "relative", display: "inline-block", color: Y }}>
                Degrees don't.
              </span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.70)", lineHeight: 1.6, marginBottom: 24, fontFamily: "'DM Sans'" }}>
              Work on your own real project, guided by a structured roadmap and vouched for by a real mentor.
            </p>
            <div className="roadmaps-price-pill" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.30)", color: "#fff", borderRadius: 999, padding: "11px 18px", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", fontFamily: "'DM Sans'" }}>Everything below —</span>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>₹9,999</span>
              <span style={{ fontSize: 10, fontWeight: 700, background: Y, color: DARK, borderRadius: 100, padding: "4px 10px", whiteSpace: "nowrap" }}>3–5 months · Mentor-verified</span>
            </div>
          </div>
 
          {/* Right: pillars as compact grid */}
          <div className="roadmaps-pillars">
            {pillars.map((p, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "14px 14px", backdropFilter: "blur(4px)" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{p.icon}</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3, lineHeight: 1.2 }}>{p.title}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.60)", lineHeight: 1.4, fontFamily: "'DM Sans'" }}>{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY TABS + STACK CARDS ─── */}
      <section className="roadmaps-section">
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontFamily: "'DM Sans'" }}>Choose your path</p>
              <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1.05 }}>What are you building?</h2>
            </div>
            {/* Tab pills */}
            <div className="roadmaps-tabs" style={{ display: "inline-flex", background: "#f3f4f6", borderRadius: 999, padding: 4, gap: 4 }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="tab-pill"
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    background: activeCat === cat.id ? DARK : "transparent",
                    color: activeCat === cat.id ? "#fff" : "#6b7280",
                    border: "none",
                    padding: "9px 18px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'DM Sans'",
                    boxShadow: activeCat === cat.id ? "0 4px 14px rgba(10,10,10,0.2)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active category description */}
          {activeCat && (
            <div className="roadmaps-category-note" style={{ background: LP, border: `1px solid ${P}22`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: P }}>
                  {categories.find((c) => c.id === activeCat)?.tagline}
                </span>
                <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 12, fontFamily: "'DM Sans'" }}>
                  {categories.find((c) => c.id === activeCat)?.for}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "'DM Sans'" }}>{filtered.length} path{filtered.length !== 1 ? "s" : ""} available</span>
            </div>
          )}

          {/* Cards: horizontal if 1, 2-col grid if multiple */}
          {!activeCat ? (
            <LockedCard category={{ name: "any category" }} />
          ) : filtered.length === 0 ? (
            <LockedCard category={categories.find((c) => c.id === activeCat)} />
          ) : filtered.length === 1 ? (
            <StackCardHorizontal stack={filtered[0]} onStart={handleStart} onBook={handleBook} />
          ) : (
            <div className="roadmaps-card-grid">
              {filtered.map((stack, i) => (
                <StackCardVertical key={`${stack.type}-${stack.course_id || stack.id || i}`} stack={stack} onStart={handleStart} onBook={handleBook} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── REVIEW SECTION ─── */}
      <hr/>
      <section className="roadmaps-review-section" style={{ background: "#1e1e1e"}}>
        <h1 className={"mb-4 text-2xl font-bold color-gray-100 sm:text-4xl"} style={{ color: "#fff" }}>#Generate your project's own Outline</h1>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{background: "#fdf8ed", border: "2px solid rgba(10,10,30,0.12)", borderRadius: 18, padding: "24px 28px", display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{  marginTop:"5%",display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #ececec", borderRadius: 999, padding: "4px 10px", marginBottom: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: Y }} />
                <span style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" }}>Existing Project Review</span>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Already building something?</h3>
              <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.55, fontFamily: "'DM Sans'" }}>
                Submit your GitHub project. Our mentors review architecture, code quality, and roadmap potential — manually.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="roadmaps-review-input">
                <input
                  id="github-review-link"
                  name="githubReviewLink"
                  type="text"
                  placeholder="Paste GitHub repo or profile link"
                  value={githubLink}
                  onChange={(e) => { setGithubLink(e.target.value); if (reviewStatus) setReviewStatus(null); }}
                  style={{ flex: 1, minWidth: 0, background: "#fff", border: "1px solid #dbe2ee", borderRadius: 10, padding: "11px 14px", color: DARK, fontSize: 12, outline: "none", fontFamily: "'DM Sans'" }}
                />
                <button
                  type="button"
                  disabled={reviewSubmitting}
                  onClick={handleSubmitForReview}
                  style={{ background: P, color: "#fff", border: "none", borderRadius: 10, padding: "11px 16px", fontSize: 12, fontWeight: 700, cursor: reviewSubmitting ? "not-allowed" : "pointer", opacity: reviewSubmitting ? 0.8 : 1, fontFamily: "'DM Sans'" }}
                >
                  {reviewSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
              {reviewStatus && (
                <div style={{ borderRadius: 8, padding: "9px 12px", fontSize: 11, fontFamily: "'DM Sans'", background: reviewStatus.type === "success" ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)", border: `1px solid ${reviewStatus.type === "success" ? "rgba(34,197,94,0.24)" : "rgba(239,68,68,0.24)"}`, color: reviewStatus.type === "success" ? "#166534" : "#b91c1c" }}>
                  {reviewStatus.message}
                </div>
              )}
              <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 8, fontFamily: "'DM Sans'" }}>Low-effort clones may not receive a mentor call.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="roadmaps-trust" style={{ background: "#fafafa", borderTop: "1px solid #ececec", borderBottom: "1px solid #ececec", padding: "22px 48px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          {[
            "No classroom needed",
            "AI companion + real mentor",
            "Your own project, not a template",
            "Mentor vouches for you by name",
            "₹9,999 — not ₹85,000",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: Y, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: DARK }}>✓</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", fontFamily: "'DM Sans'" }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="roadmaps-bottom-cta" style={{ background: P, padding: "64px 48px", textAlign: "center" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16, fontFamily: "'DM Sans'" }}>Not sure where to start?</p>
        <h2 style={{ color: "#fff", fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, letterSpacing: -1.8, marginBottom: 12, lineHeight: 1.05 }}>
          Take the quiz.<br />
          <span style={{ color: Y }}>We'll tell you exactly where to go.</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 32, fontFamily: "'DM Sans'", maxWidth: 420, margin: "0 auto 32px" }}>
          2 minutes. Tell us your background and goal. We'll show you the path, the projects, and the mentor that fits.
        </p>
        <button
          type="button"
          className="quiz-cta"
          onClick={() => navigate("/careerQuiz")}
          style={{ background: Y, color: DARK, border: "none", padding: "15px 36px", borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: "pointer" }}
        >
          Take Career Quiz →
        </button>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 16, fontFamily: "'DM Sans'" }}>Free · No sign-up · 2 minutes</p>
      </section>
    </div>
  );
}
