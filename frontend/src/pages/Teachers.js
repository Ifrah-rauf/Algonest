import { apiUrl } from "../config/api.js";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherCard from "../components/TeacherCard";
import Navbar from "../components/navbar";
import FadeInSection from "../components/FadeInSection";
import bg7 from "../static/bg7.png";

const PLAN_FILTERS = [
  { label: "Project Roadmap Mentorship", value: "project" },
  { label: "DSA/CS tracking & Mentorship", value: "dsa" },
  { label: "Interview Prep & Grilling", value: "interview" },
];

const AVAILABILITY = [
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
];

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [languages, setLanguages] = useState([]);
  const[search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const gateFlow = location.state?.gateFlow || location.state?.checkpointFlow || location.state?.interviewFlow || null;

  /* ---------------- FETCH TEACHERS ---------------- */
  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await fetch(
          apiUrl(`/api/teachers/getAllTeachers${location.search}`)
        );
        const data = await res.json();
        setTeachers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setTeachers([]);
      }
    }
    loadTeachers();
  }, [location.search]);

  /* ---------------- FETCH LANGUAGE AND DOMAIN ---------------- */
  useEffect(() => {
    async function loadFilterMeta() {
      try {
        const res = await fetch(
          apiUrl("/api/teachers/getFilterMeta")
        );
        const data = await res.json();

        setDomains(data.domains || []);
        setLanguages(data.languages || []);
      } catch (err) {
        console.error("Filter meta load failed:", err);
      }
    }

    loadFilterMeta();
  }, []);



  /* ---------------- URL HELPERS ---------------- */
  function updateQuery(key, value) {
    const params = new URLSearchParams(location.search);

    if (params.get(key) === value) {
      params.delete(key); // toggle off
    } else {
      params.set(key, value);
    }

    navigate({ search: params.toString() }, { state: location.state });
  }

  function toggleMulti(key, value) {
    const params = new URLSearchParams(location.search);
    const current = params.get(key)?.split(",") || [];

    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    updated.length
      ? params.set(key, updated.join(","))
      : params.delete(key);

    navigate({ search: params.toString() }, { state: location.state });
  }


  useEffect(() => {
  const params = new URLSearchParams(location.search);

  if (search.trim()) {
    params.set("search", search.trim());
  } else {
    params.delete("search");
  }

  const url = apiUrl(`/api/teachers/getAllTeachers?${params.toString()}`);

  fetch(url)
    .then(res => res.json())
    .then(setTeachers)
    .catch(console.error);

}, [location.search, search]);

  const params = new URLSearchParams(location.search);

  return (
    <div className="min-h-screen ">
      <Navbar />

      {/* HERO SECTION */}
<FadeInSection>
  <section className="relative overflow-hidden py-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${bg7})` }}>
    {/* Doodles */}
    <div className="absolute left-10 top-10 opacity-25">
      <div className="grid grid-cols-5 gap-1.5">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="h-1 w-1 rounded-full bg-purple-300" />
        ))}
      </div>
    </div>

    <svg className="absolute right-16 top-6 opacity-30" width="50" height="65" viewBox="0 0 70 90">
      <path
        d="M18 8 C55 5 58 45 30 55 C18 60 18 72 26 82"
        stroke="#B197FC"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="26" cy="87" r="3.5" fill="#B197FC" />
    </svg>

    <svg className="absolute left-20 bottom-6 opacity-40" width="50" height="30" viewBox="0 0 70 40">
      <path
        d="M5 8 C25 2 50 12 58 30"
        stroke="#8B5CF6"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="5 5"
      />
      <path d="M53 24 L58 30 L49 30" stroke="#8B5CF6" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>

    <div className="mx-auto max-w-4xl px-4">
      {/* Badge */}
      <div className="flex justify-center">
        <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[13px] font-bold tracking-wide text-purple-600">
          Built with cool mentors
        </span>
      </div>

      {/* Heading */}
      <div className="mt-4 text-center">
        <h2 className="mx-auto max-w-2xl text-2xl font-black tracking-tight text-[#1E2235] md:text-4xl">
          Meet the
          <span className="relative mx-1.5 text-[#6B46F2]">
            mentors
            <svg className="absolute -bottom-1 left-0" width="100%" height="6">
              <path d="M2 4 Q 35 0 75 4" stroke="#FACC15" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          behind every roadmap.
        </h2>

        <p className="mx-auto mt-2.5 max-w-xl text-xm leading-relaxed text-slate-500">
          Every roadmap is designed, maintained and continuously improved by experienced engineers so you're always learning what actually matters.
        </p>
      </div>

      {/* Horizontally Rectangular & Responsive Feature Cards */}
      <div className="mt-8 grid grid-cols-1 gap-3">
        {/* Card 1 */}
        <div className="flex flex-col gap-4 rounded-xl border border-purple-100 bg-white p-4 transition hover:-translate-y-0.5 md:flex-row md:items-center shadow-lg">
          <div className="grid gap-1 md:grid-cols-3 md:items-center md:gap-4 w-full">
            <h3 className="text-sm font-bold text-[#1E2235] md:col-span-1 items-center justify-center rounded-xl bg-purple-100 text-base p-2">
              Mentor-designed Roadmaps
            </h3>
            <p className="text-sm text-slate-500 md:col-span-2">
              Every roadmap is created and maintained by mentors responsible for keeping the learning path practical and industry aligned.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col gap-4 rounded-xl border border-purple-100 bg-white p-4 transition hover:-translate-y-0.5 md:flex-row md:items-center shadow-lg">
          <div className="grid gap-1 md:grid-cols-3 md:items-center md:gap-4 w-full ">
            <h3 className="text-sm font-bold text-[#1E2235] md:col-span-1 items-center justify-center rounded-xl bg-yellow-100 text-base p-2">
              Real Industry Guidance
            </h3>
            <p className="text-sm text-slate-500 md:col-span-2">
              Learn directly from engineers who've built production systems, cleared interviews and worked in top tech companies.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col gap-4 rounded-xl border border-purple-100 bg-white p-4 transition hover:-translate-y-0.5 md:flex-row md:items-center shadow-lg">
          <div className="grid gap-1 md:grid-cols-3 md:items-center md:gap-4 w-full">
            <h3 className="text-sm font-bold text-[#1E2235] md:col-span-1 items-center justify-center rounded-xl bg-green-100 text-base p-2">
              Continuously Updated
            </h3>
            <p className="text-sm text-slate-500 md:col-span-2">
              As technologies and hiring trends evolve, mentors continuously refine the roadmaps so your preparation stays relevant.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</FadeInSection>

      {/* MAIN PAGE LAYOUT — SAME STRUCTURE AS PROPEERS STYLE */}
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 md:px-12 md:py-10 lg:flex-row">

        {/* LEFT SECTION (Mentor listing — 2/3 width) */}
        <div className="w-full space-y-4 md:space-y-6 lg:w-2/3">

          {/* Optional Search + Filters */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 md:flex-row">
            <input
              id="teacher-search"
              name="teacherSearch"
              type="text"
              placeholder="Search mentor by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full shadow-sm text-sm
                        focus:outline-none focus:ring-2 focus:ring-[var(--algo-purple)]"
            />

            <button className="rounded-lg bg-[var(--nest-yellow)] px-6 py-2 font-semibold text-gray-900 transition hover:bg-yellow-400 md:w-auto">
              Search
            </button>
          </div>

          {/* Mentor Card List */}
          <div className="space-y-5">
            {Array.isArray(teachers) &&
              teachers.map((t) => (
                <TeacherCard key={t.t_id} teacher={t} />
              ))}
          </div>
        </div>

        {/* RIGHT SECTION (Filters — 1/3 width) */}
        <div className="order-first h-[min-content] w-full rounded-xl border bg-white p-4 shadow-sm sm:p-5 lg:order-none lg:w-1/3">
          <h3 className="text-lg font-semibold mb-4">Filter by</h3>

          {/* Mentorship Type */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Mentorship Type</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {PLAN_FILTERS.map(p => (
              <label key={p.value} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <input
                  id={`teacher-plan-${p.value}`}
                  name="teacherPlan"
                  type="checkbox"
                  checked={params.get("plan") === p.value}
                  onChange={() => updateQuery("plan", p.value)}
                />
                {p.label}
              </label>
            ))}
            </div>
          </div>

          {/* Domain */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Domain</p>
            <div className="flex flex-wrap gap-2">
              {domains.map((d, i) => (
                <span
                  key={i}
                  onClick={() => updateQuery("domain", d)}
                  className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                    params.get("domain") === d
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {languages.map(l => {
                const selectedLangs = params.get("lang")?.split(",") || [];

                return (
                  <label
                    key={l}
                    className="mb-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm"
                  >
                    <input
                      id={`teacher-language-${l}`}
                      name="teacherLanguage"
                      type="checkbox"
                      checked={selectedLangs.includes(l)}
                      onChange={() => toggleMulti("lang", l)}
                    />
                    {l.toUpperCase()}
                  </label>
                );
              })}
            </div>
          </div>


          {/* Availability */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Availability</p>
            <div className="flex flex-wrap gap-2">
            {AVAILABILITY.map(a => (
              <label key={a.value} className="mb-1 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <input
                  id={`teacher-availability-${a.value}`}
                  name="teacherAvailability"
                  type="radio"
                  checked={params.get("availability") === a.value}
                  onChange={() => updateQuery("availability", a.value)}
                />
                {a.label}
              </label>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
