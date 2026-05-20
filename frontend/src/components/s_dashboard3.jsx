import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CircleEllipsis,
  GraduationCap,
  Sparkles,
  SquarePen,
  Star,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000";

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
const font = "'Trebuchet MS', 'Trebuchet', sans-serif";

/* ─── helpers ─────────────────────────────────────────────────────── */

function getInitials(name = "Student") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() || "")
      .join("") || "ST"
  );
}

function formatDateLabel(value, fallback = "Not scheduled yet") {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(value, fallback = "Recently") {
  if (!value) return fallback;
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return fallback;
  const diffH = Math.floor((Date.now() - ts) / 3_600_000);
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}d ago`;
  return formatDateLabel(value, fallback);
}

function formatDateTimeLabel(value, fallback = "Not scheduled yet") {
  if (!value) return fallback;
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function capitalizeWords(value = "") {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function getMentorTags(mentor) {
  const spec = mentor?.specialisation;
  const tags = [];

  if (spec && typeof spec === "object") {
    tags.push(...[spec.sp1, spec.sp2, spec.sp3, spec.sp4].filter(Boolean));
  }

  if (mentor?.teaching_style) tags.push(mentor.teaching_style);
  if (mentor?.education) tags.push(mentor.education);

  return [...new Set(tags)].slice(0, 4);
}

/* ─── data builders ────────────────────────────────────────────────── */

function buildStudentProfile(data, user) {
  const profile = data?.profile || {};
  const activeCourse = data?.activeCourse || {};
  const name = profile.name || user?.username || "Student";
  return {
    name,
    handle: `@${(user?.username || profile.username || name).replace(/\s+/g, "").toLowerCase()}`,
    avatar: getInitials(name),
    pfp: profile.pfp || "",
    bio: profile.bio || "Add a short bio so mentors and peers can understand your focus.",
    education: profile.education || "AlgoNest candidate",
    totalBookings: profile.total_bookings || 0,
    activeBookingId: profile.active_booking_id || null,
    headline:
      activeCourse.desc ||
      profile.bio ||
      "Building interview proof one meaningful checkpoint at a time.",
    currentTrack: activeCourse.title || "Interview prep preview",
    packageStart: formatDateLabel(activeCourse.booking_date, "After your first booking"),
    packageEnd: formatDateLabel(activeCourse.expiry_date, "Will appear after booking"),
  };
}

function buildRoadmaps(data) {
  const activeCourse = data?.activeCourse;
  const lp = data?.lessonProgress || {};
  if (!activeCourse) return [];
  return [
    {
      id: activeCourse.courseId || activeCourse.plan_id || activeCourse.title,
      title: activeCourse.title || "Current prep route",
      description:
        activeCourse.desc ||
        "Your current route details will appear here when the assessment system is active.",
      level:
        lp.progressPct >= 70
          ? "Advanced"
          : lp.progressPct >= 30
          ? "Intermediate"
          : "Beginner",
      rating: lp.totalLessons
        ? (4 + lp.progressPct / 100).toFixed(1)
        : "4.0",
      enrolled: `${lp.totalLessons || 0} checkpoints`,
    },
  ];
}

function buildActivityItems(data, sessionInfo) {
  const activeCourse = data?.activeCourse || {};
  const lp = data?.lessonProgress || {};
  const interviews = Array.isArray(data?.interviews) ? data.interviews : [];
  const items = [];

  if (activeCourse.title) {
    items.push({
      id: "roadmap-live",
      title: `${activeCourse.title} is live`,
      subtitle: activeCourse.planTitle || "Current route",
      body: activeCourse.desc || "Your route is ready to be defended.",
      time: formatRelativeTime(activeCourse.booking_date, "Current"),
      icon: Sparkles,
    });
  }

  if (lp.nextLessonTitle) {
    items.push({
      id: "next-lesson",
      title: "Next checkpoint unlocked",
      subtitle: lp.nextLessonTitle,
      body: `${lp.completedLessons || 0}/${lp.totalLessons || 0} checkpoints completed so far.`,
      time: `${lp.progressPct || 0}% through`,
      icon: BookOpen,
    });
  }

  if (
    sessionInfo?.session?.title ||
    sessionInfo?.status === "UPCOMING" ||
    sessionInfo?.status === "ACTIVE"
  ) {
    items.push({
      id: "session",
      title:
        sessionInfo.status === "ACTIVE"
          ? "Your assessment session is live"
          : "Session update",
      subtitle: sessionInfo.session?.title || "Session timeline",
      body: sessionInfo.session?.start_time
        ? `Scheduled for ${formatDateTimeLabel(sessionInfo.session.start_time)}.`
        : "Your next session will appear here once a mentor schedules it.",
      time: capitalizeWords(sessionInfo.status || "pending"),
      icon: Calendar,
    });
  }

  interviews.forEach((interview, index) => {
    items.push({
      id: interview.session_id || `interview-${index}`,
      title: interview.title || "Interview checkpoint",
      subtitle: interview.mentorName || "Mentor to be assigned",
      body: interview.notes || "Interview details will appear here once confirmed.",
      time: formatDateTimeLabel(interview.start_time, interview.status || "Pending"),
      icon: Trophy,
    });
  });

  return items;
}

/* ─── shared UI primitives ─────────────────────────────────────────── */

function AppShell({ children }) {
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.ink, fontFamily: font }}>
      {children}
    </div>
  );
}

function PrepModulesBand() {
  const modules = [
    {
      title: "Project Roadmaps",
      body:
        "Build toward Full Stack, GenAI, ML, or DevOps with a roadmap that tells you what to prove in order. Mentors validate milestones and the AI companion tracks gaps.",
      accent: "#0ea5e9",
      dot: "#38bdf8",
    },
    {
      title: "CS Fundamentals",
      body:
        "Structured preparation across DSA, OOP, DBMS, OS, and DCCN so you can explain and defend concepts under pressure, not recite definitions.",
      accent: "#7c3aed",
      dot: "#a78bfa",
    },
    {
      title: "Grill Sessions",
      body:
        "45 minutes with a placed professional who reviews your resume, project choices, and technical depth exactly like an interviewer would. Every session ends with a written scorecard.",
      accent: "#f59e0b",
      dot: "#fbbf24",
    },
  ];

  return (
    <section
      className="overflow-hidden rounded-3xl border"
      style={{
        borderColor: C.border,
        background: C.white,
        boxShadow: "0 16px 40px rgba(33,21,63,0.08)",
      }}
    >
      <div className="border-b px-5 py-5" style={{ borderColor: C.border }}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: C.purple }}>
              The assessment system
            </div>
            <div className="mt-1 text-xl font-bold md:text-2xl" style={{ color: C.ink }}>
              Stop preparing. Start proving.
            </div>
          </div>
          <div className="text-sm" style={{ color: C.muted }}>
            Project first. CS second. Grill last.
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {modules.map((module, index) => (
            <div
              key={module.title}
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{
                borderColor: `${module.accent}30`,
                background: `${module.accent}0F`,
                animation: "anPulse 3s ease-in-out infinite",
                animationDelay: `${index * 180}ms`,
              }}
            >
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{
                  background: module.accent,
                  boxShadow: `0 0 0 6px ${module.dot}22`,
                  animation: "anGlow 2.2s ease-in-out infinite",
                }}
              />
              <div>
                <div className="text-sm font-bold" style={{ color: C.ink }}>
                  {module.title}
                </div>
                <div className="text-xs" style={{ color: C.muted }}>
                  {index === 0 ? "1" : index === 1 ? "2" : "3"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="relative">
          <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#7c3aed] to-[#f59e0b] opacity-20" />

          <div className="relative grid gap-6 md:grid-cols-3">
            {modules.map((module, index) => (
              <div key={module.title} className="relative">
                <div className="flex items-center gap-4 md:flex-col md:items-start">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white shadow-sm"
                    style={{ borderColor: module.accent }}>
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{
                        background: module.accent,
                        animation: "anGlow 1.8s ease-in-out infinite",
                        animationDelay: `${index * 220}ms`,
                      }}
                    />
                  </div>

                  <div className="flex-1 md:pt-2">
                    <div
                      className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{ background: `${module.accent}18`, color: module.accent }}
                    >
                      {index + 1}
                    </div>
                    <h4 className="mt-3 text-xl font-bold" style={{ color: C.ink }}>
                      {module.title}
                    </h4>
                    <p className="mt-2 text-sm leading-7" style={{ color: C.muted }}>
                      {module.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes anGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,0,0,0); }
          50% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(0,0,0,0.03); }
        }
        @keyframes anPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </section>
  );
}

function SectionCard({ title, action, children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border ${className}`}
      style={{
        borderColor: C.border,
        background: C.white,
        boxShadow: "0 16px 40px rgba(33,21,63,0.08)",
      }}
    >
      {(title || action) && (
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-4"
          style={{ borderColor: C.border }}
        >
          <h3 className="text-base font-semibold" style={{ color: C.ink }}>
            {title}
          </h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-4 py-3 text-sm transition ${
        active
          ? "border-[var(--dash-purple)] text-[var(--dash-purple)]"
          : "border-transparent hover:text-[var(--dash-ink)]"
      }`}
      style={{ color: active ? undefined : C.muted }}
    >
      {children}
    </button>
  );
}

function EmptyPanel({ icon: Icon, title, body, action }) {
  return (
    <div
      className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center"
      style={{ borderColor: C.border, background: C.bg }}
    >
      <div
        className="grid h-16 w-16 place-items-center rounded-full text-[var(--dash-purple)]"
        style={{ background: C.purpleLight }}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="mt-6 text-3xl font-bold tracking-tight" style={{ color: C.ink }}>
        {title}
      </h4>
      <p className="mt-3 max-w-xl text-sm leading-7" style={{ color: C.muted }}>
        {body}
      </p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

function EditProfileModal({ open, form, saving, onClose, onChange, onSave }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      style={{ background: "rgba(33,21,63,0.45)" }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-2xl"
        style={{ borderColor: C.border }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b px-5 py-4"
          style={{ borderColor: C.border, background: C.bg }}
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: C.purple }}>
              Edit Profile
            </div>
            <div className="mt-1 text-lg font-bold" style={{ color: C.ink }}>
              Update your student profile
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-3 py-1.5 text-sm font-semibold transition hover:bg-black/5"
            style={{ borderColor: C.border, color: C.muted }}
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
              Full Name
            </span>
            <input
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--dash-purple)]"
              style={{ borderColor: C.border, background: C.white }}
              placeholder="Your name"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
              Education
            </span>
            <input
              value={form.education}
              onChange={(e) => onChange("education", e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--dash-purple)]"
              style={{ borderColor: C.border, background: C.white }}
              placeholder="Current degree or institute"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
              Bio
            </span>
            <textarea
              value={form.bio}
              onChange={(e) => onChange("bio", e.target.value)}
              rows={4}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--dash-purple)]"
              style={{ borderColor: C.border, background: C.white, resize: "vertical" }}
              placeholder="Write a short summary of your preparation goals"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: C.muted }}>
              Profile Picture URL
            </span>
            <input
              value={form.pfp}
              onChange={(e) => onChange("pfp", e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--dash-purple)]"
              style={{ borderColor: C.border, background: C.white }}
              placeholder="https://..."
            />
          </label>

          <div
            className="rounded-xl border px-4 py-3 text-sm md:col-span-2"
            style={{ borderColor: "#fde68a", background: C.yellowLight, color: C.ink }}
          >
            Profile picture saves into the `student.pfp` column and updates the avatar in your dashboard.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-5 py-4" style={{ borderColor: C.border }}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-black/5"
            style={{ borderColor: C.border, color: C.muted }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            style={{ background: C.purple }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── profile header ────────────────────────────────────────────────── */

function ProfileHeader({ student, activeCourse, onMentorClick, onProfileClick }) {
  return (
    <SectionCard className="overflow-hidden">
      <div
        className="flex flex-col justify-end gap-4 px-5 pb-5 pt-6 md:flex-row md:items-end md:justify-between"
        style={{
          background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})`,
        }}
      >
        <div className="flex items-end gap-4 ">
          <div
            className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 text-3xl font-bold text-white"
            style={{ borderColor: C.white, backgroundColor: C.purple }}
          >
            {student.pfp ? (
              <img
                src={student.pfp}
                alt={student.name}
                className="h-full w-full object-cover"
              />
            ) : (
              student.avatar
            )}
          </div>
          <div className="pb-3">
            <div className="text-lg font-bold md:text-xl" style={{ color: C.white }}>
              {student.name}
            </div>
            <div className="mt-1 text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.82)" }}>
              {student.handle}
            </div>
            <div className="mt-2 text-xs md:text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>
              {student.currentTrack}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onMentorClick}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-black transition hover:brightness-105 md:text-sm"
            style={{ backgroundColor: C.yellow }}
          >
            <Sparkles className="h-4 w-4" />
            Keep Learning
          </button>
          <button
            type="button"
            onClick={onProfileClick}
            className="inline-flex items-center gap-2 rounded-full border bg-transparent px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10 md:text-sm"
            style={{ borderColor: "rgba(255,255,255,0.35)" }}
          >
            <SquarePen className="h-4 w-4" />
            Edit Profile
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            <CircleEllipsis className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid gap-3 px-5 pb-5 md:grid-cols-3 pt-3">
        {[
          { label: "Total bookings", value: student.totalBookings ?? 0 },
          { label: "Active booking", value: student.activeBookingId ? `#${student.activeBookingId}` : "None" },
          { label: "Education", value: student.education || "Not shared" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border px-4 py-3"
            style={{ borderColor: C.border, background: C.bg }}
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
              {item.label}
            </div>
            <div className="mt-2 text-xs font-semibold md:text-sm" style={{ color: C.ink }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      {activeCourse?.planTitle ? (
        <div className="px-5 pb-5">
          <div
            className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium"
            style={{
              color: C.purple,
              borderColor: "rgba(107,70,193,0.25)",
              background: C.purpleLight,
            }}
          >
            {activeCourse.planTitle} • Ends{" "}
            {formatDateLabel(activeCourse.expiry_date, "TBD")}
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}

/* ─── activity tab ──────────────────────────────────────────────────── */

function ActivityTab({ data, sessionInfo, roadmaps, activityItems, navigate }) {
  const lp = data?.lessonProgress || {};
  const activeCourse = data?.activeCourse || {};

  return (
      <div className="space-y-6">
        {/* Sessions */}
        <div>
        <div className="mb-3 text-sm font-semibold md:text-base" style={{ color: C.ink }}>
          Your ongoing sessions!
        </div>
        <SectionCard className="p-0">
          <div className="flex flex-wrap gap-3 px-5 pt-5">
            <button
              type="button"
              className="rounded-full border border-[var(--dash-purple)]/40 bg-[rgba(107,70,193,0.18)] px-3 py-1.5 text-xs font-medium text-[var(--dash-purple)] md:text-sm"
            >
              Full Time Mentorship
            </button>
            
          </div>

          {sessionInfo?.status === "ACTIVE" || sessionInfo?.status === "UPCOMING" ? (
            <div className="px-5 pb-5 pt-8">
              <div
                className="rounded-2xl border p-6"
                style={{ borderColor: C.border, background: C.bg }}
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-bold md:text-xl" style={{ color: C.ink }}>
                      {sessionInfo.session?.title || "Mentorship session"}
                    </div>
                    <div className="mt-2 text-xs md:text-sm" style={{ color: C.muted }}>
                      {formatDateTimeLabel(
                        sessionInfo.session?.start_time,
                        "Schedule will appear once confirmed"
                      )}
                    </div>
                    <div className="mt-4 inline-flex rounded-full border border-[var(--dash-purple)]/40 bg-[rgba(107,70,193,0.12)] px-3 py-1 text-xs font-semibold text-[var(--dash-purple)]">
                      {capitalizeWords(sessionInfo.status)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/teachers")}
                    className="rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 md:text-sm"
                    style={{ backgroundColor: C.purple }}
                  >
                    Schedule a Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <EmptyPanel
                icon={Calendar}
                title="No Mentorships Found"
                body="We couldn't find any mentorship sessions yet. Once a session is booked, it will appear here."
                action={
                  <button
                    type="button"
                    onClick={() => navigate("/teachers")}
                    className="rounded-full px-5 py-2.5 text-xs font-semibold text-white transition hover:brightness-110 md:text-sm"
                    style={{ backgroundColor: C.purple }}
                  >
                    Schedule a Session
                  </button>
                }
              />
            </div>
          )}
        </SectionCard>
      </div>

      {/* Roadmaps */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold md:text-base" style={{ color: C.ink }}>
            Roadmaps ({roadmaps.length})
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {roadmaps.length ? (
            roadmaps.map((roadmap) => (
              <SectionCard key={roadmap.id} className="p-0">
                <div
                  className="rounded-t-2xl px-5 py-4"
                  style={{
                    background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})`,
                  }}
                >
                  <div className="text-sm font-semibold text-white md:text-base">{roadmap.title}</div>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-xs leading-6 md:text-sm" style={{ color: C.muted }}>
                    {roadmap.description}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#8f4b0e] bg-[#2e2214] px-3 py-1 text-[11px] font-semibold text-[#ffb54a]">
                    <div className="flex gap-1">
                      <span className="block h-3 w-3 rounded-sm bg-[#ff9d34]" />
                      <span className="block h-3 w-3 rounded-sm bg-[#ffd166]" />
                      <span className="block h-3 w-3 rounded-sm bg-white/80" />
                    </div>
                    {roadmap.level}
                  </div>
                  <div className="flex items-center gap-4 text-xs md:text-sm" style={{ color: C.muted }}>
                    <div className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-[var(--dash-yellow)] text-[var(--dash-yellow)]" />
                      {roadmap.rating}
                    </div>
                    <div>{roadmap.enrolled}</div>
                  </div>
                </div>
              </SectionCard>
            ))
          ) : (
            <SectionCard className="xl:col-span-2">
              <div className="text-sm" style={{ color: C.muted }}>
                Your active route will show up here once an activeCourse is returned.
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      <PrepModulesBand />

      <SectionCard title="Recent assessment signals">
        {activityItems.length ? (
          <div className="space-y-3">
            {activityItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{ borderColor: C.border, background: C.bg }}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[rgba(107,70,193,0.16)] text-[var(--dash-purple)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold" style={{ color: C.ink }}>
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs text-[var(--dash-purple)]">
                      {item.subtitle}
                    </div>
                    <div className="mt-2 text-sm" style={{ color: C.muted }}>
                      {item.body}
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: C.muted }}>
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm" style={{ color: C.muted }}>
            Your assessment signals will appear once your route becomes active.
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ─── profile tab ───────────────────────────────────────────────────── */

function ProfileTab({ student, data, onEditProfile }) {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Profile Summary"
        action={
          <button
            type="button"
            onClick={onEditProfile}
            className="rounded-full border px-4 py-1.5 text-xs font-semibold text-[var(--dash-purple)] transition hover:bg-black/5 md:text-sm"
            style={{ borderColor: C.border }}
          >
            Edit Profile
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border p-4" style={{ borderColor: C.border, background: C.bg }}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
              About you
            </div>
            <div className="mt-3 text-lg font-bold md:text-xl" style={{ color: C.ink }}>
              {student.name}
            </div>
            <div className="mt-2 text-xs leading-6 md:text-sm md:leading-7" style={{ color: C.muted }}>
              {student.bio}
            </div>
          </div>
          <div className="rounded-2xl border p-4" style={{ borderColor: C.border, background: C.bg }}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
              Journey
            </div>
            <div className="mt-3 space-y-2 text-xs md:text-sm" style={{ color: C.ink }}>
              <div><span className="font-semibold">Track:</span> {student.currentTrack}</div>
              <div><span className="font-semibold">Education:</span> {student.education}</div>
              <div><span className="font-semibold">Bookings:</span> {student.totalBookings}</div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Skill and domain matrix">
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm font-semibold" style={{ color: C.ink }}>
              Core Domains:
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "rgba(107,70,193,0.22)",
                  background: C.purpleLight,
                  color: C.purpleDark,
                }}
              >
                {data?.activeCourse?.domain || "Databases"}
              </span>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold" style={{ color: C.ink }}>
              Current focus:
            </div>
            <div
              className="rounded-2xl border p-4 text-sm leading-7"
              style={{ borderColor: C.border, background: C.bg, color: C.muted }}
            >
              {student.headline}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Education"
      >
        <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
          <GraduationCap className="h-16 w-16 text-[var(--dash-purple)]" />
          <div className="mt-5 text-sm font-semibold md:text-base" style={{ color: C.ink }}>
            {student.education}
          </div>
          <div className="mt-2 text-xs md:text-sm" style={{ color: C.muted }}>
            Package window: {student.packageStart} to {student.packageEnd}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── explore projects tab ──────────────────────────────────────────── */

function ExploreProjectsTab({ projects, navigate, loading }) {
  return (
    <div className="space-y-5">
      <SectionCard title="Recommended project routes for you 🚀">
        {loading ? (
          <div className="text-sm" style={{ color: C.muted }}>
            Loading route recommendations...
          </div>
        ) : !projects.length ? (
          <div className="text-sm" style={{ color: C.muted }}>
            No route recommendations yet. Complete your profile or career quiz.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="cursor-pointer rounded-2xl border p-4 transition-shadow hover:shadow-md"
                style={{ borderColor: C.border, background: C.bg }}
                onClick={() => project.id ? navigate(`/projects/${project.id}`) : null}
              >
                <div className="text-lg font-semibold" style={{ color: C.ink }}>
                  {project.project_title}
                </div>
                <div className="mt-2 text-sm" style={{ color: C.muted }}>
                  {project.last_progress}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs" style={{ color: C.purple }}>
                  <span className="rounded-full border px-2.5 py-1" style={{ borderColor: C.border, background: C.white }}>
                    Route #{project.course_id ?? "—"}
                  </span>
                  {project.course_title ? (
                    <span className="rounded-full border px-2.5 py-1" style={{ borderColor: C.border, background: C.white }}>
                      {project.course_title}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ─── right sidebar ─────────────────────────────────────────────────── */

function RightSidebar({ spotlightItem, mentors }) {
  return (
    <div className="space-y-5 self-start">
      <SectionCard title="Announcements">
        {spotlightItem ? (
          <div className="space-y-4">
            <div
              className="flex items-start justify-between gap-3 border-b pb-3"
              style={{ borderColor: C.border }}
            >
              <div>
                <div className="text-sm font-semibold leading-5" style={{ color: C.ink }}>
                  {spotlightItem.title}
                </div>
                <div className="mt-1 text-[11px] leading-4" style={{ color: C.muted }}>
                  {spotlightItem.time}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#5c6b73] text-lg font-medium text-white">
                {spotlightItem.subtitle?.charAt(0) || "P"}
              </div>
              <div>
                <div className="text-sm font-semibold leading-5" style={{ color: C.ink }}>
                  {spotlightItem.subtitle || "ProPeers"}
                </div>
                <div className="text-[11px] leading-4 line-clamp-2" style={{ color: C.muted }}>
                  {spotlightItem.body}
                </div>
              </div>
            </div>
            <p className="text-[11px] leading-5" style={{ color: C.ink }}>
              {spotlightItem.body}
            </p>
          </div>
        ) : (
          <div className="text-xs" style={{ color: C.muted }}>
            No spotlight item yet.
          </div>
        )}
      </SectionCard>

      <div>
        <div
          className="mb-3 text-sm font-bold tracking-tight md:text-lg"
          style={{ color: C.ink }}
        >
          Suggested Mentors
        </div>
        <div className="space-y-4">
          {mentors.length ? (
            mentors.slice(0, 2).map((mentor) => (
              <SectionCard key={mentor.t_id || mentor.name}>
                <div className="flex items-start gap-4">
                  <img
                    src={
                      mentor.pfp ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        mentor.name || "Mentor"
                      )}&background=6b46c1&color=fff`
                    }
                    alt={mentor.name || "Mentor"}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="truncate text-sm font-bold tracking-tight"
                        style={{ color: C.ink }}
                      >
                        {mentor.name}
                      </div>
                      {mentor.verified ? (
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: C.purple }}
                        />
                      ) : null}
                    </div>
                    <div className="text-[11px]" style={{ color: C.muted }}>
                      @{(mentor.name || "mentor").replace(/\s+/g, "").toLowerCase()}
                    </div>
                    <div className="mt-1 text-[11px]" style={{ color: C.purple }}>
                      {mentor.experience ? `SDE ${mentor.experience}` : "Mentor"}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] leading-5" style={{ color: C.muted }}>
                  {mentor.bio ||
                    "Experienced mentor available for route support, accountability, and checkpoint guidance."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(getMentorTags(mentor).length ? getMentorTags(mentor) : ["Mentor", "Roadmap", "Guidance"])
                    .slice(0, 4)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
                        style={{ borderColor: C.border, color: C.ink, background: C.bg }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </SectionCard>
            ))
          ) : (
            <SectionCard>
              <div className="text-sm" style={{ color: C.muted }}>
                No mentors were returned for the active route yet.
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── loading skeleton ──────────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="px-3 py-4 md:px-4">
        <div className="mx-auto max-w-[1600px] space-y-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl"
              style={{ background: C.purpleTint }}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

/* ─── error banner ──────────────────────────────────────────────────── */

function ErrorBanner({ message, onRetry }) {
  return (
    <div
      className="mx-5 mt-4 flex items-center justify-between rounded-xl border px-5 py-4"
      style={{ borderColor: "#fca5a5", background: C.redLight }}
    >
      <span className="text-sm" style={{ color: C.red }}>
        {message}
      </span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-4 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
          style={{ background: C.red }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/* ─── main dashboard component ──────────────────────────────────────── */

export default function StudentDashboard({ data: propData }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("activity");
  const [dashboardData, setDashboardData] = useState(propData || null);
  const [sessionInfo, setSessionInfo] = useState({ status: "NONE", session: null });
  const [mentorSuggestions, setMentorSuggestions] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    education: "",
    pfp: "",
  });

  // loading / error per-fetch
  const [dashboardLoading, setDashboardLoading] = useState(!propData);
  const [dashboardError, setDashboardError] = useState(null);

  /* ── 1. Dashboard data ── */
  const loadDashboard = async () => {
    if (!user?.uid) return;
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/getDashboard/${user.uid}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      if (payload?.success) {
        setDashboardData(payload.data || null);
      } else {
        throw new Error(payload?.message || "Dashboard load failed");
      }
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setDashboardError(err.message || "Could not load dashboard. Please retry.");
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (propData) {
      setDashboardData(propData);
      setDashboardLoading(false);
      return;
    }
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propData, user?.uid]);

  /* ── 2. Session info ── */
  useEffect(() => {
    async function loadSession() {
      if (!user?.uid) return;
      try {
        const res = await fetch(`${API_BASE}/api/session/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        setSessionInfo({
          status: payload?.data?.state || "NONE",
          session: payload?.data?.session || null,
        });
      } catch (err) {
        console.error("Session info load failed:", err);
        setSessionInfo({ status: "NONE", session: null });
      }
    }
    loadSession();
  }, [user?.uid]);

  /* ── 3. Project recommendations ── */
  useEffect(() => {
    async function loadProjects() {
      if (!user?.uid) return;
      setProjectsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/projects/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload = await res.json();
        setProjectSuggestions(payload.success ? payload.projects || [] : []);
      } catch (err) {
        console.error("Project recommendation failed:", err);
        setProjectSuggestions([]);
      } finally {
        setProjectsLoading(false);
      }
    }
    loadProjects();
  }, [user?.uid]);

  /* ── 4. Mentor suggestions (depends on plan_id from dashboard) ── */
  useEffect(() => {
  async function loadMentors() {
    const courseId = dashboardData?.activeCourse?.courseId;

    if (!courseId) {
      setMentorSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/teachers/getMentors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: [courseId] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();

      if (Array.isArray(payload)) {
        setMentorSuggestions(payload);
      } else {
        setMentorSuggestions(Array.isArray(payload?.mentors) ? payload.mentors : []);
      }
    } catch (err) {
      console.error("Mentor suggestion load failed:", err);
      setMentorSuggestions([]);
    }
  }
  loadMentors();
}, [dashboardData?.activeCourse?.courseId]);


  /* ── derived data ── */
  const student = useMemo(
    () => buildStudentProfile(dashboardData, user),
    [dashboardData, user]
  );
  const roadmaps = useMemo(() => buildRoadmaps(dashboardData), [dashboardData]);
  const activityItems = useMemo(
    () => buildActivityItems(dashboardData, sessionInfo),
    [dashboardData, sessionInfo]
  );
  const spotlightItem = activityItems[0] || null;

  useEffect(() => {
    const profile = dashboardData?.profile || {};
    setProfileForm({
      name: profile.name || user?.username || "",
      bio: profile.bio || "",
      education: profile.education || "",
      pfp: profile.pfp || "",
    });
  }, [dashboardData, user?.username]);

  async function saveProfile() {
    if (!user?.uid) return;
    setProfileSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/update-student-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          ...profileForm,
        }),
      });
      const payload = await res.json();
      if (!res.ok || payload?.status === "error") {
        throw new Error(payload?.message || "Failed to update profile");
      }

      setDashboardData((prev) => ({
        ...(prev || {}),
        profile: {
          ...(prev?.profile || {}),
          ...(payload.data?.student || {}),
        },
      }));
      setProfileEditorOpen(false);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setProfileSaving(false);
    }
  }

  /* ── render states ── */
  if (dashboardLoading) return <LoadingSkeleton />;

  return (
    <AppShell>
      {dashboardError && (
        <ErrorBanner message={dashboardError} onRetry={loadDashboard} />
      )}

      <div
        style={{
          "--dash-purple": C.purple,
          "--dash-yellow": C.yellow,
          "--dash-ink": C.ink,
          "--dash-muted": C.muted,
          "--dash-white": C.white,
        }}
      >
        <div className="px-2 py-3 md:px-3 md:py-4 pb-3">
          <div className="mx-auto grid max-w-[1700px] gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* ── top strip removed to keep the dashboard clean and aligned ── */}
            {/* ── left column ── */}
            <div className="min-w-0 space-y-5">
              <ProfileHeader
                student={student}
                activeCourse={dashboardData?.activeCourse}
                onMentorClick={() => navigate("/teachers")}
                onProfileClick={() => setProfileEditorOpen(true)}
              />

              {/* Tabs */}
              <div className="border-b" style={{ borderColor: C.border }}>
                <div className="flex flex-wrap gap-1">
                  <TabButton
                    active={activeTab === "activity"}
                    onClick={() => setActiveTab("activity")}
                  >
                    Activity
                  </TabButton>
                  <TabButton
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                  >
                    Profile
                  </TabButton>
                  <TabButton
                    active={activeTab === "explore"}
                    onClick={() => setActiveTab("explore")}
                  >
                    Explore Projects
                  </TabButton>
                </div>
              </div>

              {/* Tab content */}
              {activeTab === "activity" && (
                <ActivityTab
                  data={dashboardData}
                  sessionInfo={sessionInfo}
                  roadmaps={roadmaps}
                  activityItems={activityItems}
                  navigate={navigate}
                />
              )}
              {activeTab === "profile" && (
                <ProfileTab
                  student={student}
                  data={dashboardData}
                  onEditProfile={() => setProfileEditorOpen(true)}
                />
              )}
              {activeTab === "explore" && (
                <ExploreProjectsTab
                  projects={projectSuggestions}
                  navigate={navigate}
                  loading={projectsLoading}
                />
              )}
            </div>

            {/* ── right sidebar ── */}
            <RightSidebar
              spotlightItem={spotlightItem}
              mentors={mentorSuggestions}
            />
          </div>
        </div>
      </div>
      <EditProfileModal
        open={profileEditorOpen}
        form={profileForm}
        saving={profileSaving}
        onClose={() => setProfileEditorOpen(false)}
        onChange={(field, value) => setProfileForm((prev) => ({ ...prev, [field]: value }))}
        onSave={saveProfile}
      />
    </AppShell>
  );
}
