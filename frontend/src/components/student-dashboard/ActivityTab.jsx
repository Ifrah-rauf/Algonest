import { Calendar, Star } from "lucide-react";
import { C } from "./constants";
import { capitalizeWords, formatDateTimeLabel } from "./formatters";
import { EmptyPanel, SectionCard } from "./ui";

function SessionCard({ sessionInfo, navigate }) {
  const hasSession = sessionInfo?.status === "ACTIVE" || sessionInfo?.status === "UPCOMING";

  return (
    <SectionCard className="p-0">
      <div className="flex flex-wrap gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <button type="button" className="rounded-full border border-[var(--dash-purple)]/40 bg-[rgba(107,70,193,0.18)] px-4 py-2 text-sm font-medium text-[var(--dash-purple)]">
          Full Time Mentorship
        </button>
      </div>

      {hasSession ? (
        <div className="px-4 pb-4 pt-6 sm:px-5 sm:pb-5 sm:pt-8">
          <div className="rounded-2xl border p-4 sm:p-6" style={{ borderColor: C.border, background: C.bg }}>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="text-lg font-bold sm:text-xl" style={{ color: C.ink }}>
                  {sessionInfo.session?.title || "Mentorship session"}
                </div>
                <div className="mt-2 text-sm" style={{ color: C.muted }}>
                  {formatDateTimeLabel(sessionInfo.session?.start_time, "Schedule will appear once confirmed")}
                </div>
                <div className="mt-4 inline-flex rounded-full border border-[var(--dash-purple)]/40 bg-[rgba(107,70,193,0.12)] px-3 py-1 text-xs font-semibold text-[var(--dash-purple)]">
                  {capitalizeWords(sessionInfo.status)}
                </div>
              </div>
              <button type="button" onClick={() => navigate("/teachers")} className="w-full rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto" style={{ backgroundColor: C.purple }}>
                Schedule a Session
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <EmptyPanel
            icon={Calendar}
            title="No Mentorships Found"
            body="We couldn't find any mentorship sessions yet. Once a session is booked, it will appear here."
            action={
              <button type="button" onClick={() => navigate("/teachers")} className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 sm:w-auto" style={{ backgroundColor: C.purple }}>
                Schedule a Session
              </button>
            }
          />
        </div>
      )}
    </SectionCard>
  );
}

function RoadmapList({ roadmaps }) {
  return (
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
              <div className="rounded-t-2xl px-4 py-4 sm:px-5" style={{ background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})` }}>
                <div className="text-base font-semibold text-white sm:text-lg">{roadmap.title}</div>
              </div>
              <div className="space-y-4 p-4 sm:p-5">
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
                <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-5" style={{ color: C.muted }}>
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
  );
}

function ProgressFeed({ lessonProgress, activeCourse, activityItems }) {
  return (
    <SectionCard title="Continue learning!">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          ["Completed lessons", lessonProgress.completedLessons || 0],
          ["Progress", `${lessonProgress.progressPct || 0}%`],
          ["Remaining sessions", activeCourse.remainingSessions ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border p-4" style={{ borderColor: C.border, background: C.bg }}>
            <div className="text-sm" style={{ color: C.muted }}>
              {label}
            </div>
            <div className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: C.ink }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {activityItems.length ? (
        <div className="mt-5 space-y-3">
          {activityItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-start" style={{ borderColor: C.border, background: C.bg }}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(107,70,193,0.16)] text-[var(--dash-purple)]">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold" style={{ color: C.ink }}>
                    {item.title}
                  </div>
                  <div className="mt-1 text-xs text-[var(--dash-purple)]">{item.subtitle}</div>
                  <div className="mt-2 text-sm" style={{ color: C.muted }}>
                    {item.body}
                  </div>
                </div>
                <div className="shrink-0 text-xs" style={{ color: C.muted }}>
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </SectionCard>
  );
}

export default function ActivityTab({ data, sessionInfo, roadmaps, activityItems, navigate }) {
  const lessonProgress = data?.lessonProgress || {};
  const activeCourse = data?.activeCourse || {};

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 text-lg font-semibold" style={{ color: C.ink }}>
          Your ongoing sessions!
        </div>
        <SessionCard sessionInfo={sessionInfo} navigate={navigate} />
      </div>
      <RoadmapList roadmaps={roadmaps} />
      <ProgressFeed lessonProgress={lessonProgress} activeCourse={activeCourse} activityItems={activityItems} />
    </div>
  );
}
