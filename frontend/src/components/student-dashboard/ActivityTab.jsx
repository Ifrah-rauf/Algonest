import { Calendar, FileText, Star, Video } from "lucide-react";
import { capitalizeWords, formatDateTimeLabel } from "./formatters";
import { EmptyPanel, SectionCard } from "./ui";

function MissingRoadmapAlert({ onChooseRoadmap }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="text-sm font-semibold text-[var(--dash-ink)]">
        No roadmap selected yet
      </div>
      <button
        type="button"
        onClick={onChooseRoadmap}
        className="dash-button-primary px-4 py-2 text-xs"
      >
        Choose a roadmap
      </button>
    </div>
  );
}

function PrepModulesBand() {
  return (
    <div className="rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-purple-tint)] p-5">
      <div className="text-sm font-semibold text-[var(--dash-ink)]">
        Prep modules are coming soon
      </div>
      <div className="mt-2 text-xs leading-5 text-[var(--dash-muted)]">
        We're preparing interactive prep modules for DSA, system design, and behavioral prep. Stay tuned!
      </div>
    </div>
  );
}

function getSessionSummaryText(session) {
  return session?.session_summary || session?.summary_json?.summary || null;
}

function getMentorFeedbackText(session) {
  return session?.mentor_feedback_text || session?.feedback || null;
}

function getSessionJoinLink(session) {
  return session?.join_url || session?.session_link || null;
}

export default function ActivityTab({
  data,
  sessionInfo,
  sessionHistory = [],
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
        <div className="mb-3 text-sm font-semibold text-[var(--dash-ink)] md:text-base">
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
              <div className="dash-card-soft rounded-2xl border p-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-bold text-[var(--dash-ink)] md:text-xl">
                      {sessionInfo.session?.title || "Mentorship session"}
                    </div>
                    <div className="mt-2 text-xs text-[var(--dash-muted)] md:text-sm">
                      {formatDateTimeLabel(
                        sessionInfo.session?.start_time,
                        "Schedule will appear once confirmed"
                      )}
                    </div>
                    <div className="mt-4 inline-flex rounded-full border border-[var(--dash-purple)]/40 bg-[rgba(107,70,193,0.12)] px-3 py-1 text-xs font-semibold text-[var(--dash-purple)]">
                      {capitalizeWords(sessionInfo.status)}
                    </div>
                  </div>
                  {sessionInfo.status === "ACTIVE" ? (
                    <button
                      type="button"
                      onClick={() => {
                        const joinLink = getSessionJoinLink(sessionInfo.session);
                        if (joinLink) window.location.href = joinLink;
                      }}
                      disabled={!getSessionJoinLink(sessionInfo.session)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition md:text-sm ${
                        getSessionJoinLink(sessionInfo.session)
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "cursor-not-allowed bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Video className="h-4 w-4" />
                      Join Session
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/teachers")}
                      className="dash-button-primary px-4 py-2 text-xs md:text-sm"
                    >
                      Schedule a Session
                    </button>
                  )}
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
                    className="dash-button-primary px-5 py-2.5 text-xs md:text-sm"
                  >
                    Schedule a Session
                  </button>
                }
              />
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Session summaries">
        {sessionHistory.length ? (
          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-2">
            {sessionHistory.slice(0, 5).map((session) => {
              const summary = getSessionSummaryText(session);
              const feedback = getMentorFeedbackText(session);

              return (
                <div
                  key={session.session_id}
                  className="dash-card-soft rounded-xl border p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--dash-ink)]">
                        <FileText className="h-4 w-4 text-[var(--dash-purple)]" />
                        <span className="truncate">
                          {session.title || `Session #${session.session_id}`}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-[var(--dash-muted)]">
                        {formatDateTimeLabel(session.start_time, "No schedule available")}
                      </div>
                    </div>
                    <span className="w-fit rounded-full border border-[var(--dash-purple)]/30 bg-[rgba(107,70,193,0.10)] px-3 py-1 text-xs font-semibold text-[var(--dash-purple)]">
                      {capitalizeWords(session.status || session.processing_status || "session")}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-[var(--dash-border)] bg-white/70 p-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--dash-purple)]">
                        Summary
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--dash-muted)]">
                        {summary || "No session summary available yet."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[var(--dash-border)] bg-white/70 p-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--dash-purple)]">
                        Mentor feedback
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--dash-muted)]">
                        {feedback || "No mentor feedback added yet."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyPanel
            icon={FileText}
            title="No session summaries yet"
            body="Completed session summaries and mentor feedback will appear here after processing."
          />
        )}
      </SectionCard>

      {/* Roadmaps */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-[var(--dash-ink)] md:text-base">
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
                  className="dash-gradient rounded-t-2xl px-5 py-4"
                >
                  <div className="text-sm font-semibold text-white md:text-base">{roadmap.title}</div>
                </div>
                <div className="space-y-4 p-5">
                  <p className="text-xs leading-6 text-[var(--dash-muted)] md:text-sm">
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
                  <div className="flex items-center gap-4 text-xs text-[var(--dash-muted)] md:text-sm">
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
                      className="dash-button-primary px-4 py-2 text-xs md:text-sm"
                    >
                      Open Roadmap
                    </button>
                  </div>
                </div>
              </SectionCard>
            ))
          ) : (
            <SectionCard className="xl:col-span-2">
              <div className="text-sm text-[var(--dash-muted)]">
                Your active route will show up here once a roadmap is available.
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* CS Core and Grill Bookings */}
      

      <PrepModulesBand />

      <SectionCard title="Recent assessment signals">
        {activityItems.length ? (
          <div className="space-y-3">
            {activityItems.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="dash-card-soft flex items-start gap-3 rounded-xl border p-4"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[rgba(107,70,193,0.16)] text-[var(--dash-purple)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[var(--dash-ink)]">
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs text-[var(--dash-purple)]">
                      {item.subtitle}
                    </div>
                    <div className="mt-2 text-sm text-[var(--dash-muted)]">
                      {item.body}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--dash-muted)]">
                    {item.time}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-[var(--dash-muted)]">
            Your assessment signals will appear once your route becomes active.
          </div>
        )}
      </SectionCard>
    </div>
  );
}
