import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  CircleEllipsis,
  Compass,
  GraduationCap,
  House,
  LayoutGrid,
  MessageCircle,
  Search,
  Sparkles,
  SquarePen,
  Star,
  Trophy,
  Users,
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

const topLinks = ["Mentorship", "Resources", "Success Stories"];

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

/* ─── data builders ────────────────────────────────────────────────── */

function buildStudentProfile(data, user) {
  const profile = data?.profile || {};
  const activeCourse = data?.activeCourse || {};
  const name = profile.name || user?.username || "Student";
  return {
    name,
    handle: `@${(user?.username || profile.username || name).replace(/\s+/g, "").toLowerCase()}`,
    avatar: getInitials(name),
    education: profile.education || "AlgoNest Learner",
    headline:
      activeCourse.desc ||
      profile.bio ||
      "Building project momentum one meaningful checkpoint at a time.",
    currentTrack: activeCourse.title || "Roadmap preview",
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
      title: activeCourse.title || "Current roadmap",
      description:
        activeCourse.desc ||
        "Your current roadmap details will appear here when the course description is available.",
      level:
        lp.progressPct >= 70
          ? "Advanced"
          : lp.progressPct >= 30
          ? "Intermediate"
          : "Beginner",
      rating: lp.totalLessons
        ? (4 + lp.progressPct / 100).toFixed(1)
        : "4.0",
      enrolled: `${lp.totalLessons || 0} lessons`,
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
      title: `${activeCourse.title} is active`,
      subtitle: activeCourse.planTitle || "Current plan",
      body: activeCourse.desc || "Your roadmap is ready to continue.",
      time: formatRelativeTime(activeCourse.booking_date, "Current"),
      icon: Sparkles,
    });
  }

  if (lp.nextLessonTitle) {
    items.push({
      id: "next-lesson",
      title: "Next lesson unlocked",
      subtitle: lp.nextLessonTitle,
      body: `${lp.completedLessons || 0}/${lp.totalLessons || 0} lessons completed so far.`,
      time: `${lp.progressPct || 0}% progress`,
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
          ? "Your mentorship session is live"
          : "Mentorship session update",
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

function TopBar() {
  return (
    <header
      className="border-b px-5 py-4 backdrop-blur md:px-8"
      style={{ borderColor: C.border, background: C.white }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="hidden items-center gap-8 text-sm md:flex" style={{ color: C.muted }}>
          {topLinks.map((link) => (
            <a key={link} href="/" className="transition hover:opacity-80">
              {link}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
            style={{ color: C.muted }}
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
              boxShadow: "0 16px 34px rgba(107,70,193,0.24)",
            }}
          >
            <SquarePen className="h-4 w-4" />
            Create Post
          </button>
        </div>
      </div>
    </header>
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

/* ─── profile header ────────────────────────────────────────────────── */

function ProfileHeader({ student, activeCourse, onMentorClick, onProfileClick }) {
  return (
    <SectionCard className="overflow-hidden p-0">
      <div
        style={{
          height: 80,
          background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})`,
        }}
      />
      <div className="flex flex-col gap-5 px-5 pb-5 pt-0 md:flex-row md:items-end md:justify-between">
        <div className="-mt-10 flex items-end gap-4">
          <div
            className="grid h-20 w-20 place-items-center rounded-full border-4 text-4xl font-bold text-white"
            style={{ borderColor: C.white, backgroundColor: C.purple }}
          >
            {student.avatar.charAt(0).toLowerCase()}
          </div>
          <div className="pb-1">
            <div className="text-2xl font-bold" style={{ color: C.ink }}>
              {student.name.toLowerCase()}
            </div>
            <div className="mt-1 text-sm" style={{ color: C.muted }}>
              {student.handle}
            </div>
            <div className="mt-2 text-sm" style={{ color: C.purple }}>
              {student.currentTrack}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onMentorClick}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-105"
            style={{ backgroundColor: C.yellow }}
          >
            <Sparkles className="h-4 w-4" />
            Keep Learning
          </button>
          <button
            type="button"
            onClick={onProfileClick}
            className="inline-flex items-center gap-2 rounded-full border bg-transparent px-5 py-2.5 text-sm font-semibold transition hover:bg-black/5"
            style={{ borderColor: "rgba(107,70,193,0.55)" }}
          >
            <SquarePen className="h-4 w-4" />
            Edit Profile
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-black/5"
            style={{ color: C.muted }}
          >
            <CircleEllipsis className="h-5 w-5" />
          </button>
        </div>
      </div>
      {activeCourse?.planTitle ? (
        <div className="px-5 pb-5">
          <div
            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
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
        <div className="mb-3 text-lg font-semibold" style={{ color: C.ink }}>
          Your ongoing sessions!
        </div>
        <SectionCard className="p-0">
          <div className="flex flex-wrap gap-3 px-5 pt-5">
            <button
              type="button"
              className="rounded-full border border-[var(--dash-purple)]/40 bg-[rgba(107,70,193,0.18)] px-4 py-2 text-sm font-medium text-[var(--dash-purple)]"
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
                    <div className="text-xl font-bold" style={{ color: C.ink }}>
                      {sessionInfo.session?.title || "Mentorship session"}
                    </div>
                    <div className="mt-2 text-sm" style={{ color: C.muted }}>
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
                    className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
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
                    className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
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
          <div className="text-lg font-semibold" style={{ color: C.ink }}>
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
                  <div className="text-lg font-semibold text-white">{roadmap.title}</div>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-sm leading-7" style={{ color: C.muted }}>
                    {roadmap.description}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#8f4b0e] bg-[#2e2214] px-3 py-1 text-xs font-semibold text-[#ffb54a]">
                    <div className="flex gap-1">
                      <span className="block h-3 w-3 rounded-sm bg-[#ff9d34]" />
                      <span className="block h-3 w-3 rounded-sm bg-[#ffd166]" />
                      <span className="block h-3 w-3 rounded-sm bg-white/80" />
                    </div>
                    {roadmap.level}
                  </div>
                  <div className="flex items-center gap-5 text-sm" style={{ color: C.muted }}>
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
                Your active roadmap will show up here once an activeCourse is returned.
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* Progress stats + activity feed */}
      <SectionCard title="Continue learning!">
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: C.border, background: C.bg }}
          >
            <div className="text-sm" style={{ color: C.muted }}>
              Completed lessons
            </div>
            <div className="mt-2 text-3xl font-bold" style={{ color: C.ink }}>
              {lp.completedLessons || 0}
            </div>
          </div>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: C.border, background: C.bg }}
          >
            <div className="text-sm" style={{ color: C.muted }}>
              Progress
            </div>
            <div className="mt-2 text-3xl font-bold" style={{ color: C.ink }}>
              {lp.progressPct || 0}%
            </div>
          </div>
          <div
            className="rounded-2xl border p-4"
            style={{ borderColor: C.border, background: C.bg }}
          >
            <div className="text-sm" style={{ color: C.muted }}>
              Remaining sessions
            </div>
            <div className="mt-2 text-3xl font-bold" style={{ color: C.ink }}>
              {activeCourse.remainingSessions ?? 0}
            </div>
          </div>
        </div>

        {activityItems.length ? (
          <div className="mt-5 space-y-3">
            {activityItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-2xl border p-4"
                  style={{ borderColor: C.border, background: C.bg }}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(107,70,193,0.16)] text-[var(--dash-purple)]">
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
        ) : null}
      </SectionCard>
    </div>
  );
}

/* ─── profile tab ───────────────────────────────────────────────────── */

function ProfileTab({ student, data }) {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Experiences"
        action={
          <button
            type="button"
            className="rounded-full text-[var(--dash-purple)] transition hover:opacity-80"
          >
            +
          </button>
        }
      >
        <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
          <Briefcase className="h-16 w-16 text-[var(--dash-purple)]" />
          <p className="mt-5 max-w-xl text-sm" style={{ color: C.muted }}>
            Let your experience shine! Fill in your experience to highlight your professional journey.
          </p>
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
        action={
          <button
            type="button"
            className="rounded-full text-[var(--dash-purple)] transition hover:opacity-80"
          >
            +
          </button>
        }
      >
        <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
          <GraduationCap className="h-16 w-16 text-[var(--dash-purple)]" />
          <div className="mt-5 text-base font-semibold" style={{ color: C.ink }}>
            {student.education}
          </div>
          <div className="mt-2 text-sm" style={{ color: C.muted }}>
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
      <SectionCard title="Recommended Projects for You 🚀">
        {loading ? (
          <div className="text-sm" style={{ color: C.muted }}>
            Loading project recommendations...
          </div>
        ) : !projects.length ? (
          <div className="text-sm" style={{ color: C.muted }}>
            No project recommendations yet. Complete your profile or career quiz.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border p-4 cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderColor: C.border, background: C.bg }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="text-lg font-semibold" style={{ color: C.ink }}>
                  {project.project_title}
                </div>
                <div className="mt-2 text-sm" style={{ color: C.muted }}>
                  {project.last_progress}
                </div>
                <div className="mt-3 text-xs" style={{ color: C.purple }}>
                  {project.level} • {project.domain}
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
    <div className="space-y-5">
      <SectionCard title="What's New @Algonest?">
        {spotlightItem ? (
          <div className="space-y-4">
            <div
              className="flex items-start justify-between gap-3 border-b pb-4"
              style={{ borderColor: C.border }}
            >
              <div>
                <div className="text-base font-semibold" style={{ color: C.ink }}>
                  {spotlightItem.title}
                </div>
                <div className="mt-1 text-xs" style={{ color: C.muted }}>
                  {spotlightItem.time}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#5c6b73] text-3xl font-medium text-white">
                {spotlightItem.subtitle?.charAt(0) || "P"}
              </div>
              <div>
                <div className="font-semibold" style={{ color: C.ink }}>
                  {spotlightItem.subtitle || "ProPeers"}
                </div>
                <div className="text-sm line-clamp-1" style={{ color: C.muted }}>
                  {spotlightItem.body}
                </div>
              </div>
            </div>
            <p className="text-sm leading-7" style={{ color: C.ink }}>
              {spotlightItem.body}
            </p>
          </div>
        ) : (
          <div className="text-sm" style={{ color: C.muted }}>
            No spotlight item yet.
          </div>
        )}
      </SectionCard>

      <div>
        <div
          className="mb-3 text-[28px] font-bold tracking-tight"
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
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="truncate text-2xl font-bold tracking-tight"
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
                    <div className="text-sm" style={{ color: C.muted }}>
                      @{(mentor.name || "mentor").replace(/\s+/g, "").toLowerCase()}
                    </div>
                    <div className="mt-1 text-sm" style={{ color: C.purple }}>
                      {mentor.experience ? `SDE ${mentor.experience}` : "Mentor"}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7" style={{ color: C.muted }}>
                  {mentor.bio ||
                    "Experienced mentor available for roadmap support, accountability, and checkpoint guidance."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(mentor.specialisation_id
                    ? [mentor.specialisation_id]
                    : ["Python", "Data Structures", "Algorithms"]
                  )
                    .slice(0, 4)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border px-3 py-1 text-xs font-medium"
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
                No mentors were returned for the active plan yet.
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
      <div className="px-5 py-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
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

  // loading / error per-fetch
  const [dashboardLoading, setDashboardLoading] = useState(!propData);
  const [dashboardError, setDashboardError] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);

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
      setSessionLoading(true);
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
      } finally {
        setSessionLoading(false);
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
    const domain = dashboardData?.activeCourse?.domain; // ✅ define domain here

    if (!domain) {
      setMentorSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/teachers/getMentorsByDomain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }), // now domain is defined
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();

      if (Array.isArray(payload)) {
        setMentorSuggestions(payload);
      } else {
        setMentorSuggestions(
          Array.isArray(payload?.mentors) ? payload.mentors : []
        );
      }
    } catch (err) {
      console.error("Mentor suggestion load failed:", err);
      setMentorSuggestions([]);
    }
  }
  loadMentors();
}, [dashboardData?.activeCourse?.domain]);


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
        <div className="px-5 py-6 md:px-8">
          <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* ── left column ── */}
            <div className="min-w-0 space-y-5">
              <div className="flex items-center gap-3" style={{ color: C.ink }}>
                <button
                  type="button"
                  className="rounded-full p-1 transition hover:bg-black/5"
                  style={{ color: C.muted }}
                  onClick={() => navigate(-1)}
                >
                  <ChevronRight className="h-5 w-5 rotate-180" />
                </button>
                <div className="text-2xl font-bold tracking-tight">
                  {student.name.toLowerCase()}
                </div>
              </div>

              <ProfileHeader
                student={student}
                activeCourse={dashboardData?.activeCourse}
                onMentorClick={() => navigate("/teachers")}
                onProfileClick={() => setActiveTab("profile")}
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
                <ProfileTab student={student} data={dashboardData} />
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
    </AppShell>
  );
}