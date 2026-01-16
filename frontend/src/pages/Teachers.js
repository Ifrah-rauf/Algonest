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

  /* ---------------- FETCH TEACHERS ---------------- */
  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/teachers/getAllTeachers${location.search}`
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
          "http://localhost:5000/api/teachers/getFilterMeta"
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

    navigate({ search: params.toString() });
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

    navigate({ search: params.toString() });
  }


  useEffect(() => {
  const params = new URLSearchParams(location.search);

  if (search.trim()) {
    params.set("search", search.trim());
  } else {
    params.delete("search");
  }

  const url = `http://localhost:5000/api/teachers/getAllTeachers?${params.toString()}`;

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
          <h1 className="text-4xl font-bold text-gray-800">
            Meet Our Mentors
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Guiding You from Basics to Breakthroughs 🚀
          </p>
          <p className="max-w-2xl mx-auto mt-4 text-gray-500">
            At <strong>Algonest</strong>, our mentors are engineers, creators,
            and innovators who help you master DSA, build impactful projects,
            and bridge your learning to real-world success.
          </p>
        </section>
      </FadeInSection>

      {/* MAIN PAGE LAYOUT — SAME STRUCTURE AS PROPEERS STYLE */}
      <div className="flex gap-6 px-6 md:px-12 py-10">

        {/* LEFT SECTION (Mentor listing — 2/3 width) */}
        <div className="w-full md:w-2/3 space-y-6">

          {/* Optional Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <input
              type="text"
              placeholder="Search mentor by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full shadow-sm text-sm
                        focus:outline-none focus:ring-2 focus:ring-[var(--algo-purple)]"
            />

            <button className="bg-[var(--nest-yellow)] hover:bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-lg transition">
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
        <div className="hidden h-[min-content] md:block w-1/3 bg-white rounded-xl shadow-sm p-5 border">
          <h3 className="text-lg font-semibold mb-4">Filter by</h3>

          {/* Mentorship Type */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Mentorship Type</p>
            {PLAN_FILTERS.map(p => (
              <label key={p.value} className="flex items-center gap-2 text-sm mb-1">
                <input
                  type="checkbox"
                  checked={params.get("plan") === p.value}
                  onChange={() => updateQuery("plan", p.value)}
                />
                {p.label}
              </label>
            ))}
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
                    className="flex items-center gap-2 text-sm mb-1"
                  >
                    <input
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
              <label key={a.value} className="flex items-center gap-2 text-sm mb-1">
                <input
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
