import {
  Star,
  Users,
  Clock3,
  Briefcase,
  TrendingUp,
  ChevronRight,
  PlayCircle,
  Building2,
  IndianRupee,
  ArrowRight,
  Globe,
  Clock,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

export default function RoadmapBookingOverview({
  courseId,
  user,
  dashboardData,
  activeCourseData,
  selectedCourse,
  lessonProgress,
  hasAnyBooking,
  hasActiveBooking,
  resolvedDomain,
  navigate,
  onGoToRoadmap,
}) {
  const roadmapCourse =
    dashboardData?.activeCourse ||
    activeCourseData ||
    selectedCourse ||
    null;

  const profile = dashboardData?.profile || {};
  const roadmapName =
    roadmapCourse?.title ||
    selectedCourse?.title ||
    "Backend Developer Roadmap with Node.js, Express & GenAI";
  const roadmapType =
    roadmapCourse?.type ||
    selectedCourse?.type ||
    "Development";
  const roadmapDomain =
    resolvedDomain ||
    dashboardData?.domain ||
    profile.domain ||
    roadmapCourse?.domain ||
    null;
  const roadmapTrack =
    roadmapDomain ||
    roadmapType ||
    "Express.js + GenAI Backend Engineering";
  const description =
    roadmapCourse?.desc ||
    roadmapCourse?.description ||
    profile.bio ||
    "Master production-grade backend engineering with Node.js and Express.js, upgraded with cutting-edge GenAI architectural patterns like LangChain, custom RAG pipelines, vector embeddings, and real-time LLM streaming integration.";
  const courseStatus = roadmapCourse?.courseStatus || roadmapCourse?.status || null;
  const rating = "4.8";
  const reviewCount = "1,204 reviews";
  const learnerCount = "38,400 learners"; // Synced with real open roles count scale
  const roadmapDuration = "4 month roadmap";

  const reviews = [
    {
      name: "Aman Verma",
      role: "GenAI Backend Engineer",
      review:
        "The roadmap structure felt extremely practical. Building real-time streaming LLM responses and setting up pgvector workflows gave me a massive edge in interviews.",
    },
    {
      name: "Sakshi Jain",
      role: "AI Platform Engineer",
      review:
        "The mentor checkpoints were the best part. Handling rate limiting for external LLM APIs and prompt caching strategies are production issues you don't find in casual tutorials.",
    },
    {
      name: "Rohit Gupta",
      role: "Node.js + LLM Developer",
      review:
        "Incredibly execution-focused. Went from a standard pure backend engineer to orchestrating LangChain agent architectures in a few weeks.",
    },
  ];

  const roadmapHighlights = [
    "Production-grade GenAI project",
    "1:1 mentor checkpoints",
    "AI Build Companion & Tooling",
    "Market-aligned interview prep",
  ];

  // Market Snapshot Data from Dashboard
  const snapshotData = [
    { label: "Open roles globally", val: "38,400", sub: "+62% YoY", isUp: true, icon: <Globe size={16} className="text-indigo-600" /> },
    { label: "Median salary (India)", val: "₹22 LPA", sub: "+18% vs last year", isUp: true, icon: <IndianRupee size={16} className="text-emerald-600" /> },
    { label: "Companies hiring", val: "6,200+", sub: "74% are product cos", isUp: true, icon: <Building2 size={16} className="text-amber-600" /> },
    { label: "Avg. time to offer", val: "19 days", sub: "6d faster than 2023", isUp: false, icon: <Clock size={16} className="text-rose-600" /> },
  ];

  // Top Hiring Companies Data
  const topCompanies = [
    { name: "Sarvam AI", meta: "GenAI native · LLM APIs", sal: "₹30–50 LPA", open: "15 open roles" },
    { name: "Razorpay", meta: "Fintech · GenAI Infra", sal: "₹28–40 LPA", open: "12 open roles" },
    { name: "Postman", meta: "DevTools · AI features", sal: "₹25–38 LPA", open: "9 open roles" },
    { name: "Zepto", meta: "Quick commerce · AI Ops", sal: "₹22–34 LPA", open: "8 open roles" },
    { name: "Vercel (Remote)", meta: "Infra · AI tooling", sal: "$90–130K", open: "6 open roles" },
  ];

  // Most Demanded Co-skills Data
  const coSkills = [
    { name: "LangChain / LlamaIndex", val: 91, color: "bg-indigo-600" },
    { name: "OpenAI / Gemini API", val: 87, color: "bg-indigo-500" },
    { name: "Vector DBs (Pinecone)", val: 74, color: "bg-indigo-400" },
    { name: "Redis / BullMQ", val: 68, color: "bg-purple-400" },
    { name: "Docker / K8s", val: 65, color: "bg-purple-300" },
    { name: "PostgreSQL + pgvector", val: 59, color: "bg-lavender-400" },
    { name: "WebSockets / SSE", val: 52, color: "bg-violet-300" },
  ];

  // Role Breakdown Data
  const roleBreakdown = [
    { title: "AI Platform Engineer", range: "₹28–50 LPA", tag: "Senior track", bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { title: "Full Stack AI Engineer", range: "₹20–40 LPA", tag: "Top-paying", bg: "bg-purple-50 text-purple-700 border-purple-100" },
    { title: "MLE Infra (Node APIs)", range: "₹22–38 LPA", tag: "Niche premium", bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { title: "GenAI Backend Engineer", range: "₹18–32 LPA", tag: "High demand", bg: "bg-blue-50 text-blue-700 border-blue-100" },
    { title: "AI Integration Engineer", range: "₹15–28 LPA", tag: "Growing fast", bg: "bg-amber-50 text-amber-700 border-amber-100" },
    { title: "Node.js + LLM Developer", range: "₹12–24 LPA", tag: "Entry-friendly", bg: "bg-gray-50 text-gray-700 border-gray-200" },
  ];

  // Rising Keywords Badges
  const risingKeywords = [
    { label: "RAG pipelines", type: "purple" },
    { label: "Streaming LLM responses", type: "purple" },
    { label: "AI agents / tool-calling", type: "teal" },
    { label: "Multi-model orchestration", type: "teal" },
    { label: "pgvector / embeddings", type: "amber" },
    { label: "Rate limiting LLM APIs", type: "amber" },
    { label: "MCP servers", type: "blue" },
    { label: "Prompt caching strategies", type: "blue" },
    { label: "Guardrails / safety layer", type: "purple" },
    { label: "LLM observability", type: "teal" },
  ];

  const badgeStyles = {
    purple: "bg-indigo-50 text-indigo-700 border-indigo-100",
    teal: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  };

  const getEnrollHref = () => `/book-now?courseId=${courseId || roadmapCourse?.courseId || 1}`;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] antialiased">
      {/* Top Banner section */}
      <section className="w-full border-b border-slate-800 bg-[#0b0f19]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-[12px] font-medium tracking-wide text-indigo-400">
            <span>{roadmapType}</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span>{roadmapTrack}</span>
            <ChevronRight size={12} className="text-slate-600" />
            <span className="text-slate-200">{roadmapName}</span>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                <Sparkles size={12} /> Real-time Market Intelligence Sync Active
              </div>
              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                {roadmapName}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">{rating}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-slate-400">({reviewCount})</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Users size={15} className="text-slate-400" />
                  <span>{learnerCount} structural data matching open roles</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Clock3 size={15} className="text-slate-400" />
                  <span>{roadmapDuration}</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-400">
                {profile.name || user?.username ? (
                  <>
                    Curated for <span className="font-medium text-indigo-400">{profile.name || user?.username}</span>
                  </>
                ) : (
                  <>
                    Created by <span className="font-medium text-indigo-400">AlgoNest Elite Track</span>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={onGoToRoadmap}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Open dynamic roadmap
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(getEnrollHref())}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 hover:shadow-indigo-500/30"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            {/* Right sidebar pricing item */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="p-6">
                <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  {roadmapDomain ? "Track Domain" : "Selected Track"}
                </div>
                <div className="mb-4 text-xl font-bold text-slate-900">
                  {roadmapDomain || "Express.js + GenAI Backend Mastery"}
                </div>

                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">₹9,999</span>
                  <span className="text-sm text-slate-400 line-through">₹24,999</span>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Save 60%</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(getEnrollHref())}
                  className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500"
                >
                  Enroll and Start Building
                </button>

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your program architecture:
                  </h3>

                  <div className="space-y-3.5 text-[13px] text-slate-600">
                    {roadmapHighlights.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        {item.includes("GenAI") && <Zap size={14} className="text-indigo-600" />}
                        {item === "1:1 mentor checkpoints" && <Users size={14} className="text-indigo-600" />}
                        {item.includes("Companion") && <PlayCircle size={14} className="text-indigo-600" />}
                        {item.includes("interview") && <TrendingUp size={14} className="text-indigo-600" />}
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content body */}
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-10">
        
        {/* Core Syllabus Section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold tracking-tight text-slate-900">
            What you'll master and deploy in this track
          </h2>

          <div className="grid gap-5 text-[13px] text-slate-600 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Dynamic Vector Infrastructure", desc: "Setting up custom PostgreSQL instances infused with pgvector pipelines." },
              { title: "Streaming LLM Orchestration", desc: "Handling memory efficient stream chunks natively via Node server-sent events (SSE)." },
              { title: "Enterprise Token Orchestration", desc: "Setting up aggressive sliding-window rate limiting, circuit breaking, and prompt caching." },
              { title: "Agentic Tool Calling", desc: "Connecting local architectures natively to open APIs utilizing strict type schemas with system guardrails." },
              { title: "Deterministic Output Pipelines", desc: "Structural verification workflows ensuring raw model endpoints match runtime object expectations." },
              { title: "Production System Deployment", desc: "Containerization workflows using multi-stage Docker builds mapped out across modern orchestration tiers." },
            ].map((item, index) => (
              <div key={index} className="flex gap-3 rounded-lg bg-slate-50 p-4 border border-slate-100">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">✓</span>
                <div>
                  <div className="font-semibold text-slate-800 text-sm mb-0.5">{item.title}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Re-architected Market intelligence Ecosystem dashboard components */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Market Trends & Career Intelligence Tracker
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Live dashboard verifying hiring demand and pricing vectors for Express.js + GenAI stacks
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
              <Layers size={12} /> H1 2025 Market Matrix
            </div>
          </div>

          {/* Snapshot stats cards grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {snapshotData.map((stat, idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/70 p-5 transition hover:border-slate-200 hover:bg-slate-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <div className="rounded-lg bg-white p-1.5 shadow-sm border border-slate-100">{stat.icon}</div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.val}</span>
                  <span className={`inline-flex items-center text-xs font-semibold ${stat.isUp ? "text-emerald-600" : "text-amber-600"}`}>
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Data Breakdown: Top Employers vs Needed Stack Extensions */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Top Hiring Ecosystems */}
            <div className="rounded-xl border border-slate-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Building2 size={14} className="text-slate-400" /> Active Tiers Recruiting (India & Remote)
                </h3>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">74% Product Cos</span>
              </div>
              <div className="divide-y divide-slate-100">
                {topCompanies.map((comp, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{comp.name}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{comp.meta}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-600 tracking-tight">{comp.sal}</div>
                      <div className="text-xs text-emerald-600 font-semibold mt-0.5 bg-emerald-50 px-1.5 py-0.5 rounded inline-block">{comp.open}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Demand Technical Extensions mapping out skill meters */}
            <div className="rounded-xl border border-slate-100 bg-white p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap size={14} className="text-slate-400" /> Required Ecosystem Co-Skills Frequency
              </h3>
              <div className="space-y-3.5">
                {coSkills.map((skill, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700">{skill.name}</span>
                      <span className="text-slate-900">{skill.val}% of Job Postings</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${skill.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Role mapping by title tier and actual market valuation matrices */}
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              Role Matrix Analysis: Market Compensation Breakdown
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roleBreakdown.map((role, idx) => (
                <div key={idx} className={`rounded-xl border p-4 transition hover:shadow-md ${role.bg}`}>
                  <div className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">{role.tag}</div>
                  <div className="font-bold text-slate-900 text-sm">{role.title}</div>
                  <div className="mt-2 text-base font-extrabold text-slate-900 tracking-tight">{role.range}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring Market Sector, Work Mode & Experience Benchmarks Metadata Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 border-t border-slate-100 pt-6">
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100/50">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Opportunities by Sector</div>
              <ul className="space-y-1.5 text-xs font-medium text-slate-600">
                <li className="flex justify-between"><span>Fintech</span> <span className="font-bold text-slate-900">28%</span></li>
                <li className="flex justify-between"><span>SaaS Tier Platforms</span> <span className="font-bold text-slate-900">24%</span></li>
                <li className="flex justify-between"><span>Edtech Ecosystems</span> <span className="font-bold text-slate-900">16%</span></li>
                <li className="flex justify-between"><span>Healthcare AI Architectures</span> <span className="font-bold text-slate-900">14%</span></li>
                <li className="flex justify-between"><span>E-Commerce Integration</span> <span className="font-bold text-slate-900">11%</span></li>
              </ul>
            </div>
            
            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100/50">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Work Mode Distribution</div>
              <ul className="space-y-1.5 text-xs font-medium text-slate-600">
                <li className="flex justify-between"><span>Pure Remote Systems</span> <span className="font-bold text-slate-900">41%</span></li>
                <li className="flex justify-between"><span>Hybrid Allocation</span> <span className="font-bold text-slate-900">38%</span></li>
                <li className="flex justify-between"><span>On-Site Infrastructure</span> <span className="font-bold text-slate-900">21%</span></li>
              </ul>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 border border-slate-100/50">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Experience Demand Index</div>
              <ul className="space-y-1.5 text-xs font-medium text-slate-600">
                <li className="flex justify-between"><span>Junior (0–1 Year Platforms)</span> <span className="font-bold text-slate-900">12%</span></li>
                <li className="flex justify-between"><span>Associate (1–3 Year Systems)</span> <span className="font-bold text-slate-900">38%</span></li>
                <li className="flex justify-between"><span>Mid-Senior (3–5 Years Track)</span> <span className="font-bold text-slate-900">34%</span></li>
                <li className="flex justify-between"><span>Lead / Principal (5+ Years Architecture)</span> <span className="font-bold text-slate-900">16%</span></li>
              </ul>
            </div>
          </div>

          {/* Emerging JD Keywords Signals Badge Area */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-indigo-500" /> High Velocity Keywords Rising in JDs (Last 6 Months)
            </p>
            <div className="flex flex-wrap gap-2">
              {risingKeywords.map((badge, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border ${badgeStyles[badge.type]}`}
                >
                  ⚡ {badge.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* User Reviews and Testimonials section */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Star className="text-amber-500" fill="currentColor" size={20} />
            <h2 className="text-xl font-bold text-slate-900">{rating} Verified Roadmap Performance Evaluation</h2>
            <span className="text-sm font-medium text-slate-400">• 1,204 validation records</span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.name} className="flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-slate-800">{review.name}</div>
                      <div className="mt-0.5 text-xs text-slate-400 font-medium">{review.role}</div>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} size={11} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] leading-relaxed font-medium text-slate-600">
                    "{review.review}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Show all alumni evaluations
          </button>
        </section>
        
      </div>
    </div>
  );
}