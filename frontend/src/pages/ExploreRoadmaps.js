import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const C = {
  purple: "#6b46c1", purpleLight: "#ede9fa", purpleMid: "#9f7aea", purpleDark: "#4c2e8a",
  yellow: "#f6c90e", yellowLight: "#fef9d7",
  ink: "#1a1025", inkMid: "#333333", muted: "#7a7a8c",
  border: "#e5e0f5", bg: "#fafaf8", white: "#ffffff",
  green: "#16a34a", greenLight: "#dcfce7",
};
const font = { fontFamily: "'Trebuchet MS', Trebuchet, sans-serif" };

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

const JOB_SECTIONS = [
  {
    id: "fullstack", icon: "🧱", title: "Full Stack Developer",
    sub: "Build end-to-end — frontend, backend, database, deployment",
    count: "5 roadmaps · 4–5 months", badge: "live", sidebarCount: "5 roadmaps",
    cards: [
      { icon: "⚡", status: "free", pathLabel: "Full Stack", name: "MERN Stack", featured: true,
        desc: "MongoDB · Express · React · Node.js — the most in-demand full stack combo for Indian product companies.",
        tags: [{ label: "Most Popular", type: "purple" }, { label: "High Placement", type: "green" }], duration: "4–5 months", route: "/roadmap_express" },
      { icon: "☕", status: "paid", pathLabel: "Full Stack", name: "Spring Boot + React",
        desc: "Java backend with Spring Boot + React frontend. Target: enterprise and fintech roles.",
        tags: [{ label: "Enterprise", type: "purple" }, { label: "Fintech Ready", type: "yellow" }], duration: "4–5 months" },
      { icon: "🐍", status: "paid", pathLabel: "Full Stack", name: "Django + React",
        desc: "Python backend with Django REST + React. Great for data-adjacent full stack roles.",
        tags: [{ label: "Python", type: "purple" }, { label: "Data Adjacent", type: "purple" }], duration: "4 months" },
      { icon: "🟩", status: "paid", pathLabel: "Full Stack", name: "Next.js Full Stack",
        desc: "React + Next.js with SSR, API routes and edge functions. Modern SaaS stack.",
        tags: [{ label: "Modern SaaS", type: "purple" }, { label: "Trending", type: "green" }], duration: "4 months" },
      { icon: "🦾", status: "paid", pathLabel: "Full Stack", name: "Express + Vue.js",
        desc: "Node + Express backend with Vue.js frontend. Lightweight, popular in startups.",
        tags: [{ label: "Startup Ready", type: "purple" }], duration: "3–4 months" },
    ],
  },
  {
    id: "frontend", icon: "🎨", title: "Frontend Developer",
    sub: "UI, UX, interactivity — what users see and touch",
    count: "4 roadmaps · 3–4 months", badge: "live", sidebarCount: "4 roadmaps",
    cards: [
      { icon: "⚛️", status: "free", pathLabel: "Frontend", name: "React + TypeScript", featured: true,
        desc: "The industry standard frontend stack. React with TypeScript, hooks, state management and testing.",
        tags: [{ label: "Most Popular", type: "purple" }, { label: "High Demand", type: "green" }], duration: "3–4 months" },
      { icon: "📱", status: "paid", pathLabel: "Frontend · Mobile", name: "React Native",
        desc: "Cross-platform mobile apps for iOS and Android. Build once, ship everywhere.",
        tags: [{ label: "Mobile", type: "purple" }, { label: "iOS + Android", type: "yellow" }], duration: "3–4 months" },
      { icon: "💚", status: "paid", pathLabel: "Frontend", name: "Vue.js + Nuxt",
        desc: "Progressive framework with Nuxt for SSR. Popular in startups and European companies.",
        tags: [{ label: "Progressive", type: "purple" }], duration: "3 months" },
      { icon: "🔷", status: "paid", pathLabel: "Frontend", name: "Angular + RxJS",
        desc: "Enterprise-grade frontend with Angular. Heavy in banking, insurance and government tech.",
        tags: [{ label: "Enterprise", type: "yellow" }], duration: "3–4 months" },
    ],
  },
  {
    id: "backend", icon: "⚙️", title: "Backend Developer",
    sub: "APIs, servers, databases, performance — the engine under the hood",
    count: "4 roadmaps · 3–4 months", badge: "live", sidebarCount: "4 roadmaps",
    cards: [
      { icon: "🟢", status: "free", pathLabel: "Backend", name: "Node.js + Express", featured: true,
        desc: "Build REST APIs, authentication systems and microservices with Node and Express.",
        tags: [{ label: "Beginner Friendly", type: "purple" }, { label: "High Demand", type: "green" }], duration: "3–4 months" },
      { icon: "🐹", status: "paid", pathLabel: "Backend", name: "Go (Golang)",
        desc: "High performance backend with Go. Preferred at fintech, infra and high-scale companies.",
        tags: [{ label: "High Performance", type: "purple" }, { label: "Fintech", type: "yellow" }], duration: "3–4 months" },
      { icon: "☕", status: "paid", pathLabel: "Backend", name: "Java + Spring Boot",
        desc: "Enterprise Java backend. Build robust REST APIs with Spring Boot, JPA, and security.",
        tags: [{ label: "Enterprise", type: "yellow" }], duration: "4 months" },
      { icon: "🐍", status: "paid", pathLabel: "Backend", name: "Python + FastAPI",
        desc: "Modern async Python backend with FastAPI. Fastest growing stack for AI-adjacent products.",
        tags: [{ label: "Trending", type: "green" }, { label: "AI Adjacent", type: "purple" }], duration: "3 months" },
    ],
  },
  {
    id: "database", icon: "🗄️", title: "Database Engineering",
    sub: "Schema design, query optimisation, ORMs and data modelling",
    count: "4 roadmaps · 2–3 months", badge: "live", sidebarCount: "4 roadmaps",
    cards: [
      { icon: "🍃", status: "paid", pathLabel: "Database · NoSQL", name: "MongoDB",
        desc: "Document-based NoSQL. Schema design, aggregation pipelines, indexing and Atlas deployment.",
        tags: [{ label: "NoSQL", type: "purple" }, { label: "MERN Essential", type: "purple" }], duration: "2–3 months" },
      { icon: "⚡", status: "paid", pathLabel: "Database · BaaS", name: "Supabase + PostgreSQL",
        desc: "Open source Firebase alternative. Postgres under the hood with realtime subscriptions.",
        tags: [{ label: "Modern", type: "green" }, { label: "Open Source", type: "purple" }], duration: "2 months" },
      { icon: "🔺", status: "paid", pathLabel: "Database · ORM", name: "Prisma ORM",
        desc: "Type-safe database access with Prisma. Works with PostgreSQL, MySQL and SQLite.",
        tags: [{ label: "Type-Safe", type: "purple" }, { label: "ORM", type: "yellow" }], duration: "2 months" },
      { icon: "🐘", status: "paid", pathLabel: "Database · SQL", name: "PostgreSQL",
        desc: "Advanced relational database. Complex queries, indexing strategies and performance tuning.",
        tags: [{ label: "SQL", type: "purple" }, { label: "Industry Standard", type: "green" }], duration: "2–3 months" },
    ],
  },
  {
    id: "ml", icon: "🤖", title: "ML / AI Engineer",
    sub: "Models, pipelines, training and deployment — build AI that ships",
    count: "3 roadmaps · 4–5 months", badge: "live", sidebarCount: "3 roadmaps",
    cards: [
      { icon: "🔥", status: "free", pathLabel: "ML / AI", name: "ML Engineering (PyTorch)", featured: true,
        desc: "End-to-end ML with Python + PyTorch. Model training, evaluation, feature engineering and deployment.",
        tags: [{ label: "Most Popular", type: "purple" }, { label: "High Demand", type: "green" }], duration: "4–5 months" },
      { icon: "🧠", status: "paid", pathLabel: "ML / AI", name: "LLM Engineering",
        desc: "Build with LLMs — RAG pipelines, fine-tuning, prompt engineering, LangChain and agents.",
        tags: [{ label: "Trending Fast", type: "green" }, { label: "LangChain", type: "purple" }], duration: "3–4 months" },
      { icon: "📊", status: "paid", pathLabel: "Data Science", name: "Python + Pandas + SQL",
        desc: "Data analysis, statistical modelling, visualisation and BI with Python and SQL.",
        tags: [{ label: "Analytics", type: "purple" }, { label: "BI Ready", type: "yellow" }], duration: "3–4 months" },
    ],
  },
  {
    id: "cloud", icon: "☁️", title: "Cloud / DevOps Engineer",
    sub: "Infrastructure, CI/CD, containers and cloud platforms",
    count: "3 roadmaps · 4 months · Opening Soon", badge: "soon", sidebarCount: "3 roadmaps",
    cards: [
      { icon: "🔶", status: "soon", locked: true, pathLabel: "Cloud", name: "AWS + Docker + K8s",
        desc: "EC2, S3, Lambda, ECS, Docker containers and Kubernetes orchestration.",
        tags: [{ label: "AWS", type: "purple" }, { label: "Kubernetes", type: "purple" }], duration: "4 months" },
      { icon: "🔵", status: "soon", locked: true, pathLabel: "Cloud", name: "GCP + Terraform",
        desc: "Google Cloud Platform with Terraform for infrastructure as code.",
        tags: [{ label: "GCP", type: "purple" }, { label: "IaC", type: "purple" }], duration: "4 months" },
      { icon: "🔁", status: "soon", locked: true, pathLabel: "DevOps", name: "CI/CD + GitHub Actions",
        desc: "Automated pipelines, testing, deployment and monitoring.",
        tags: [{ label: "CI/CD", type: "purple" }, { label: "Monitoring", type: "purple" }], duration: "3 months" },
    ],
  },
];

const SIDEBAR_EXTRAS = [
  { id: null, icon: "🔧", name: "Systems / Low-Level", sidebarCount: "Dev Tools, OS, Networking", badge: "soon" },
  { id: null, icon: "🔒", name: "FAANG Vault", sidebarCount: "Top performers only", badge: "locked" },
];

const FILTERS = ["All", "Free Tier", "3–4 Months", "4–5 Months", "Beginner Friendly", "High Placement"];

// ─── Badge ────────────────────────────────────────────────────────────────
function Badge({ type }) {
  const m = {
    live:   { bg: C.greenLight,  fg: C.green,    text: "Live" },
    soon:   { bg: C.yellowLight, fg: "#92400e",   text: "Soon" },
    locked: { bg: "#fee2e2",     fg: "#dc2626",   text: "Locked" },
    free:   { bg: C.greenLight,  fg: C.green,     text: "Free Start" },
    paid:   { bg: C.purpleLight, fg: C.purple,    text: "Paid" },
  };
  const s = m[type] || m.paid;
  return (
    <span style={{ background: s.bg, color: s.fg, ...font, fontSize: 9,
      fontWeight: 700, padding: "2px 7px", letterSpacing: "0.07em",
      textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {s.text}
    </span>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────
function Tag({ label, type }) {
  const m = {
    purple: { background: C.purpleLight, color: C.purple },
    green:  { background: C.greenLight,  color: C.green },
    yellow: { background: C.yellowLight, color: "#92400e" },
  };
  return (
    <span style={{ ...(m[type] || m.purple), ...font, fontSize: 9.5, fontWeight: 600, padding: "2px 7px" }}>
      {label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────
function RoadmapCard({ card }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);
  const on = hov && !card.locked;

  function handleCardClick() {
    if (card.locked) return;
    if (card.route) {
      navigate(card.route);
    }
  }

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={handleCardClick}
      style={{
        background: C.white, padding: 16, position: "relative", overflow: "hidden",
        opacity: card.locked ? 0.6 : 1, cursor: card.locked ? "default" : "pointer",
        border: `1px solid ${on ? C.purpleMid : card.featured ? C.purple : C.border}`,
        borderTop: card.featured ? `3px solid ${C.purple}` : `1px solid ${on ? C.purpleMid : C.border}`,
        transform: on ? "translateY(-2px)" : "none",
        boxShadow: on ? "0 6px 20px rgba(107,70,193,0.1)" : "none",
        transition: "all 0.18s", ...font,
      }}>
      {!card.featured && !card.locked && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: C.purple, transformOrigin: "left",
          transform: on ? "scaleX(1)" : "scaleX(0)", transition: "transform 0.2s" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 20 }}>{card.icon}</span>
        <Badge type={card.status} />
      </div>
      <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
        color: C.purpleMid, marginBottom: 3, fontWeight: 600 }}>{card.pathLabel}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.inkMid, marginBottom: 5, lineHeight: 1.2 }}>
        {card.name}
      </div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.55, marginBottom: 10 }}>{card.desc}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {card.tags.map((t, i) => <Tag key={i} {...t} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 10, color: C.muted }}>🕐 {card.duration}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.purple,
          letterSpacing: "0.05em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 3 }}>
          {card.locked ? "Notify Me" : "Start"}
          <span style={{ transition: "transform 0.15s", transform: on ? "translateX(3px)" : "none" }}>→</span>
        </span>
      </div>
    </div>
  );
}

// ─── Job Section ──────────────────────────────────────────────────────────
function JobSection({ section, isMobile }) {
  return (
    <div style={{ marginBottom: 32 }} id={section.id}>
      <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center",
        flexDirection: isMobile ? "column" : "row", gap: isMobile ? 6 : 12,
        marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          {/* <span style={{ fontSize: 18 }}>{section.icon}</span> */}
          <div style={{ flex: 1 }}>
            <div style={{ marginTop:"2%",fontSize: isMobile ? 12 : 18, fontWeight: 700, color: C.inkMid,
              textTransform: "uppercase" }}>{section.title}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{section.sub}</div>
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, background: C.purpleLight,
            color: C.purple, padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0 }}>
            {isMobile ? `${section.cards.length} paths` : section.count}
          </div>
        </div>
      </div>
      <div style={{ display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {section.cards.map((card, i) => <RoadmapCard key={i} card={card} />)}
      </div>
    </div>
  );
}

// ─── Desktop Sidebar Item ─────────────────────────────────────────────────
function SidebarItem({ item, active, onClick }) {
  const [hov, setHov] = useState(false);
  const on = active || hov;
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px",
        cursor: item.id === null ? "default" : "pointer",
        background: on && item.id !== null ? C.purpleLight : "transparent",
        borderLeft: `3px solid ${on && item.id !== null ? C.purple : "transparent"}`,
        transition: "background 0.15s", ...font }}>
      {/* <span style={{ fontSize: 15 }}>{item.icon}</span> */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700,
          color: on && item.id !== null ? C.purple : C.inkMid }}>{item.name}</div>
        <div style={{ fontSize: 10, color: C.muted }}>{item.sidebarCount}</div>
      </div>
      {item.badge && (
        <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px",
          letterSpacing: "0.06em", textTransform: "uppercase", ...font,
          background: item.badge === "live" ? C.greenLight : item.badge === "soon" ? C.yellowLight : "#fee2e2",
          color: item.badge === "live" ? C.green : item.badge === "soon" ? "#92400e" : "#dc2626" }}>
          {item.badge === "live" ? "Live" : item.badge === "soon" ? "Soon" : "Locked"}
        </span>
      )}
    </div>
  );
}

// ─── Mobile Scroll Tab Bar ────────────────────────────────────────────────
function MobileTabBar({ active, onSelect }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current?.querySelector(`[data-id="${active}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  return (
    <div ref={ref} style={{ display: "flex", overflowX: "auto", background: C.white,
      borderBottom: `1px solid ${C.border}`, position: "sticky", top: 52, zIndex: 90,
      scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
      {JOB_SECTIONS.map(s => {
        const isActive = active === s.id;
        return (
          <button key={s.id} data-id={s.id} onClick={() => onSelect(s.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: "9px 13px", border: "none", cursor: "pointer", background: "transparent",
              borderBottom: `2px solid ${isActive ? C.purple : "transparent"}`,
              flexShrink: 0, transition: "border-color 0.15s", ...font }}>
            <span style={{ fontSize: 17 }}>{s.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 700, whiteSpace: "nowrap",
              color: isActive ? C.purple : C.muted,
              letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {s.title.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Tablet Drawer ────────────────────────────────────────────────────────
function Drawer({ open, onClose, active, onSelect }) {
  return (
    <>
      {open && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0,
          background: "rgba(26,16,37,0.4)", zIndex: 200, backdropFilter: "blur(2px)" }} />
      )}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260,
        background: C.white, zIndex: 201, overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: open ? "4px 0 24px rgba(107,70,193,0.15)" : "none",
        padding: "16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 18px 16px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: C.purple,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                <path d="M11 2L20 6.5V15.5L11 20L2 15.5V6.5L11 2Z" stroke="#f6c90e" strokeWidth="1.5" fill="none"/>
                <circle cx="11" cy="11" r="2.5" fill="#f6c90e"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.purple, ...font }}>AlgoNest</span>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none",
            cursor: "pointer", fontSize: 22, color: C.muted, lineHeight: 1, padding: "0 4px" }}>×</button>
        </div>
        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          color: C.muted, padding: "0 18px", marginBottom: 8 }}>Job Targets</div>
        {JOB_SECTIONS.map(s => (
          <SidebarItem key={s.id}
            item={{ ...s, id: s.id }}
            active={active === s.id}
            onClick={() => { onSelect(s.id); onClose(); }} />
        ))}
        <div style={{ height: 1, background: C.border, margin: "12px 18px" }} />
        <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          color: C.muted, padding: "0 18px", marginBottom: 8 }}>Coming Later</div>
        {SIDEBAR_EXTRAS.map((item, i) => (
          <SidebarItem key={i} item={item} active={false} onClick={() => {}} />
        ))}
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────
export default function AlgoNestRoadmapExplorer() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [activeSection, setActiveSection] = useState("fullstack");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = isMobile ? 112 : isTablet ? 60 : 60;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  };

  useEffect(() => {
    const fn = () => {
      const offset = isMobile ? 130 : 90;
      for (const s of [...JOB_SECTIONS].reverse()) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= offset) { setActiveSection(s.id); return; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [isMobile]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, ...font, color: C.inkMid }}>
        <Navbar/>
      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${C.border}}
        button{font-family:'Trebuchet MS',sans-serif}
        input::placeholder{color:${C.muted}}
      `}</style>

      {/* MOBILE TABS */}
      {isMobile && <MobileTabBar active={activeSection} onSelect={scrollToSection} />}

      {/* TABLET DRAWER */}
      {isTablet && (
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
          active={activeSection} onSelect={scrollToSection} />
      )}

      {/* HERO */}
      <div style={{ background: C.purple,
        padding: isMobile ? "18px 16px" : isTablet ? "24px 32px" : "28px 40px",
        position: "relative", overflow: "hidden", textAlign:"center" }}>
        <div style={{ position: "absolute", right: -60, top: -60, width: 350, height: 280,
          borderRadius: "50%", background: "rgba(246,201,14,0.08)", pointerEvents: "none" }} />
        <div style={{ fontSize: 9.5, letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>AlgoNest · Paths & Roadmaps</div>
        <div style={{ fontSize: isMobile ? 18 : 30, fontWeight: 700, color: C.white,
          marginBottom: 6, lineHeight: 1.2}}>
          Pick your job target.{" "}
          <span style={{ color: C.yellow }}>Pick your stack.</span>
          {!isMobile && <> We handle the rest.</>}
          {isMobile && " We handle the rest."}
        </div>
        {/* <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", maxWidth: 480, lineHeight: 1.6 }}>
          Every roadmap is built backwards from real job descriptions — not textbooks.
        </div> */}
        <div style={{ display: "flex", gap: isMobile ? 14 : 28, marginTop: 16, flexWrap: "wrap",  justifyContent:"center" }}>
          {[["24+","Stack Roadmaps"],["7","Job Targets"],["100+","JDs Analysed"],["Free","To Start"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 900, color: C.yellow,  textAlign:"center"}}>{n}</div>
              <div style={{ fontSize: 15, color: "rgba(255, 255, 255, 0.75)", marginTop: 1,  textAlign:"center" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LAYOUT */}
      <div style={{ display: isDesktop ? "grid" : "block",
        gridTemplateColumns: isDesktop ? "220px 1fr" : undefined }}>

        {/* DESKTOP SIDEBAR */}
        {isDesktop && (
          <aside style={{ background: C.white, borderRight: `1px solid ${C.border}`,
            padding: "20px 0", position: "sticky", top: 52,
            height: "calc(100vh - 52px)", overflowY: "auto" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
              color: C.muted, padding: "0 18px", marginBottom: 8 }}>Job Targets</div>
            {JOB_SECTIONS.map(s => (
              <SidebarItem key={s.id}
                item={{ icon: s.icon, name: s.title, sidebarCount: s.sidebarCount, badge: s.badge, id: s.id }}
                active={activeSection === s.id}
                onClick={() => scrollToSection(s.id)} />
            ))}
            <div style={{ height: 1, background: C.border, margin: "12px 18px" }} />
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
              color: C.muted, padding: "0 18px", marginBottom: 8 }}>Coming Later</div>
            {SIDEBAR_EXTRAS.map((item, i) => (
              <SidebarItem key={i} item={item} active={false} onClick={() => {}} />
            ))}
          </aside>
        )}

        {/* MAIN */}
        <main style={{ padding: isMobile ? "16px" : isTablet ? "20px 24px" : "24px 32px",
          background: C.bg }}>

          {/* Mobile search */}
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.white,
              border: `1px solid ${C.border}`, padding: "8px 12px", marginBottom: 14 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={C.purpleMid} strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search roadmaps, stacks..."
                style={{ border: "none", background: "transparent", outline: "none",
                  fontFamily: "'Trebuchet MS',sans-serif", fontSize: 13, color: C.inkMid, width: "100%" }} />
            </div>
          )}

          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 6,
            marginBottom: 18, flexWrap: "wrap"}}>
            <span style={{ fontSize: 10, color: C.muted, letterSpacing: "0.1em",
              textTransform: "uppercase", marginRight: 2 }}>Filter:</span>
            {FILTERS.map(f => {
              const on = activeFilter === f;
              return (
                <div key={f} onClick={() => setActiveFilter(f)} style={{
                  fontSize: isMobile ? 10 : 10.5, padding: isMobile ? "4px 9px" : "5px 12px",
                  border: `1px solid ${on ? C.purple : C.border}`,
                  background: on ? C.purple : C.white, color: on ? C.white : C.inkMid,
                  cursor: "pointer", fontWeight: 600, transition: "all 0.15s", ...font }}>
                  {f}
                </div>
              );
            })}
            {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              background: C.bg, border: `1px solid ${C.border}`,
              padding: "6px 12px", width: isTablet ? 180 : 220 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={C.purpleMid} strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search roadmaps..."
                style={{ border: "none", background: "transparent", outline: "none",
                  fontFamily: "'Trebuchet MS',sans-serif", fontSize: 12,
                  color: C.inkMid, width: "100%" }} />
            </div>
          )}
          </div>

          {/* Featured Banner */}
          <div style={{
            background: `linear-gradient(135deg, ${C.purple} 0%, ${C.purpleDark} 100%)`,
            padding: isMobile ? "14px 16px" : "18px 22px",
            display: "flex", flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between", gap: isMobile ? 12 : 0,
            marginBottom: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: 80, top: -10,
              fontSize: 80, color: "rgba(246,201,14,0.06)", pointerEvents: "none" }}>★</div>
            <div>
              <div style={{ fontSize: isMobile ? 13 : 20, fontWeight: 700, color: C.white, padding:5 }}>
                Not sure where to start?{" "}
                <span style={{ color: C.yellow }}>Take the 2-min path quiz.</span>
              </div>
              {!isMobile && (
                <div style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>
                  We'll recommend the right job target and stack based on your background.
                </div>
              )}
            </div>
            <div style={{ background: C.yellow, color: C.ink, fontSize: 11, fontWeight: 700,
              padding: "9px 18px", letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", ...font,
              alignSelf: isMobile ? "stretch" : "auto", textAlign: "center" }}>
              Find My Path →
            </div>
          </div>

          {/* Sections */}
          {JOB_SECTIONS.map(section => (
            <JobSection key={section.id} section={section} isMobile={isMobile} />
          ))}

          <div style={{ textAlign: "center", padding: "24px 0 8px",
            fontSize: 11, color: C.muted, fontStyle: "italic" }}>
            More tracks coming — Systems, Embedded, FAANG Vault ·{" "}
            <strong style={{ color: C.inkMid }}>Unlock by completing any paid track</strong>
          </div>
        </main>
      </div>
    </div>
  );
}
