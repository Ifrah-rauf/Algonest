import { Calendar, Star } from "lucide-react";
import { C } from "./constants";
import { capitalizeWords, formatDateTimeLabel } from "./formatters";
import { EmptyPanel, SectionCard } from "./ui";

function MissingRoadmapAlert({ onChooseRoadmap }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="text-sm font-semibold" style={{ color: C.ink }}>
        No roadmap selected yet
      </div>
      <button
        type="button"
        onClick={onChooseRoadmap}
        className="rounded-full px-4 py-2 text-xs font-semibold text-white"
        style={{ backgroundColor: C.purple }}
      >
        Choose a roadmap
      </button>
    </div>
  );
}

function PrepModulesBand() {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: C.border, background: C.purpleTint }}
    >
      <div className="text-sm font-semibold" style={{ color: C.ink }}>
        📚 Prep modules are coming soon
      </div>
      <div className="mt-2 text-xs leading-5" style={{ color: C.muted }}>
        We're preparing interactive prep modules for DSA, system design, and behavioral prep. Stay tuned!
      </div>
    </div>
  );
}

export default function ActivityTab({
  data,
  sessionInfo,
  roadmapState,
  roadmaps,
  activityItems,
  navigate,
  onChooseRoadmap,
}) {
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
            {roadmapState?.heading || "Roadmaps"}
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {roadmapState?.source === "missing" ? (
            <SectionCard className="xl:col-span-2">
              <MissingRoadmapAlert onChooseRoadmap={onChooseRoadmap} />
            </SectionCard>
          ) : roadmaps.length ? (
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
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/roadmap_express?courseId=${roadmap.id}`)}
                      className="rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110 md:text-sm"
                      style={{ backgroundColor: C.purple }}
                    >
                      Open Roadmap
                    </button>
                  </div>
                </div>
              </SectionCard>
            ))
          ) : (
            <SectionCard className="xl:col-span-2">
              <div className="text-sm" style={{ color: C.muted }}>
                Your active route will show up here once a roadmap is available.
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* CS Core and Grill Bookings */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* CS Core Booking */}
        <SectionCard className="p-0">
          <div
            className="rounded-t-2xl px-5 py-4"
            style={{
              background: `linear-gradient(90deg, #7c3aed, #6d28d9)`,
            }}
          >
            <div className="text-sm font-semibold text-white md:text-base">CS Core Fundamentals</div>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-xs leading-6 md:text-sm" style={{ color: C.muted }}>
              Master Data Structures, Algorithms, DBMS, OS, and DCCN
            </p>
            <p className="text-xs leading-6 md:text-sm" style={{ color: "grey" }}>
              No current plan
            </p>
          </div>
        </SectionCard>

        {/* Grill Sessions Booking */}
        <SectionCard className="p-0">
          <div
            className="rounded-t-2xl px-5 py-4"
            style={{
              background: `linear-gradient(90deg, #f59e0b, #d97706)`,
            }}
          >
            <div className="text-sm font-semibold text-white md:text-base">Grill Sessions</div>
          </div>
          <div className="space-y-4 p-5">
            <p className="text-xs leading-6 md:text-sm" style={{ color: C.muted }}>
              Mock interviews with experienced professionals
            </p>
            <p className="text-xs leading-6 md:text-sm" style={{ color: "grey" }}>
              No current plan
            </p>
          </div>
        </SectionCard>
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
