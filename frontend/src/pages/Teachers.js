import { apiUrl } from "../config/api.js";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherCard from "../components/TeacherCard";
import Navbar from "../components/navbar";
import FadeInSection from "../components/FadeInSection";

const PLAN_FILTERS = [
  { label: "School / College Help", value: "syllabus" },
  { label: "Project Mentorship", value: "project" },
  { label: "DSA Mentorship", value: "dsa" },
  { label: "Interview Prep", value: "interview" },
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO SECTION */}
      <FadeInSection>
        <section className="text-center py-12 px-4 bg-white shadow-sm">
          {gateFlow && (
            <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-left shadow-sm">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-700">
                {gateFlow.kind === "interview" ? "Interview Mentor Selection" : "Checkpoint Mentor Selection"}
              </div>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                Pick a teacher for {gateFlow.title}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Once you book a mentor session, we&apos;ll link that session directly to this roadmap gate and take you back to your roadmap.
              </p>
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
            Meet Our Mentors
          </h1>
          <p className="mt-2 text-base text-gray-600 sm:text-lg">
            From pressure test to placement-ready 🚀
          </p>
          <p className="max-w-2xl mx-auto mt-4 text-gray-500">
            At <strong>Algonest</strong>, our mentors are engineers, creators,
            and innovators who help you prepare for interviews, build defensible projects,
            and bridge your proof to real-world success.
          </p>
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
