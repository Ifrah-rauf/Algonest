import React from "react";
import { Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function TagRow({ label, tags, tagClass }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[62px] shrink-0 text-[9.5px] font-bold uppercase tracking-widest text-purple-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-md border px-2.5 py-0.5 text-[11.5px] font-medium ${tagClass}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TeacherCard({ teacher }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!teacher) return null;
  const openProfile = () => {
    navigate(`/TeachersProfile/${teacher.t_id}`, {
      state: {
        teacher,
        gateFlow: location.state?.gateFlow || location.state?.checkpointFlow || location.state?.interviewFlow || null,
      },
    });
  };

  const domainTags = teacher.specialisation
    ? Object.values(teacher.specialisation).filter(
        (val) => typeof val === "string" && val.trim() !== ""
      )
    : [];

  const languageTags = teacher.languages
    ? Object.values(teacher.languages).filter(
        (val) => typeof val === "string" && val.trim() !== ""
      )
    : [];

  const frameworkTags = teacher.frameworks
    ? Object.values(teacher.frameworks).filter(
        (val) => typeof val === "string" && val.trim() !== ""
      )
    : [];

  const ActionChip = ({ children }) => (
    <button className="w-full rounded-lg border border-violet-100 bg-violet-50/70 px-2.5 py-1.5 text-[11px] font-medium leading-tight text-violet-800 transition hover:bg-violet-100">
      {children}
    </button>
  );

  return (
    <div
      key={teacher.t_id}
      className="w-full overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm"
    >
      <div className="flex flex-col md:flex-row">
        {/* Visual strip */}
        <div className="relative flex w-full shrink-0 items-center justify-between gap-3 overflow-hidden bg-gradient-to-b from-[#4B0082] to-[#6b21a8] px-4 py-4 md:w-[108px] md:flex-col md:justify-center md:px-3 md:py-6">
          <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/8" />
          <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-white/8" />

          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-xl border-[3px] border-white/80 bg-white/15 shadow-sm">
              {teacher.pfp ? (
                <img
                  src={teacher.pfp}
                  alt={teacher.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                  {(teacher.name || "M")
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
            </div>

            <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">
              <span className="text-amber-300">★</span>
              {teacher.rating ?? "4.8"}
            </div>
          </div>

          <p className="hidden text-center text-[11px] text-white/75 md:block">
            {teacher.experience ? `${teacher.experience}+ Yrs Exp` : "Mentor"}
          </p>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 px-4 py-4 md:px-5 md:py-5">
          <div className="mb-0.5 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[19px] font-bold leading-snug text-[#1a1028]">
                {teacher.name}
              </h3>
              <p className="truncate text-[12px] font-medium text-purple-700">
                {teacher.teaching_style}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[11.5px] font-medium text-purple-800">
              <Users size={14} />
              {teacher.sessions ? `${teacher.sessions}+ Sessions` : "Multiple Sessions"}
            </div>
          </div>

          <p className="mb-4 text-[12px] font-medium italic text-purple-600/90">
            "{teacher.bio || "Hands-on mentorship for project execution and interview readiness"}"
          </p>

          <div className="flex flex-col gap-2.5">
            <TagRow
              label="Domains"
              tags={domainTags.length ? domainTags : ["Computer Architecture", "Networking"]}
              tagClass="bg-purple-50 text-purple-800 border-purple-200"
            />
            <TagRow
              label="Languages"
              tags={languageTags.length ? languageTags : ["Python", "JavaScript"]}
              tagClass="bg-[#f3e8ff] text-purple-800 border-purple-200"
            />
            <TagRow
              label="Frameworks"
              tags={frameworkTags.length ? frameworkTags : ["React", "Express"]}
              tagClass="bg-[#faf5ff] text-purple-800 border-purple-200"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-purple-50 pt-3">
            <button
              className="rounded-lg bg-[var(--algo-purple)] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-purple-800"
              onClick={openProfile}
            >
              View Profile
            </button>
          </div>
        </div>

        {/* Slim action rail */}
        <div className="border-t border-purple-50 px-4 py-4 md:w-[180px] md:border-l md:border-t-0 md:px-3 md:py-5">
          <div className="flex h-full flex-col gap-2">
            <ActionChip>GitHub + Resume Review</ActionChip>
            <ActionChip>Interview Prep</ActionChip>
            <ActionChip>Project Mentorship</ActionChip>
          </div>
        </div>
      </div>
    </div>
  );
}
