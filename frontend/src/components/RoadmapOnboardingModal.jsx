import { useEffect, useMemo, useState } from "react";

const C = {
  purple: "#6b46c1",
  yellow: "#f6c90e",
  blue: "#0ea5e9",
  ink: "#21153f",
  muted: "#766f8e",
  border: "#e8e1f5",
};

function normalizeRoadmapText(value = "") {
  return String(value || "").toLowerCase();
}

function classifyCourse(course) {
  const text = normalizeRoadmapText(
    [course?.title, course?.description, course?.domain, course?.type]
      .filter(Boolean)
      .join(" ")
  );

  if (
    /fundamentals|fundamental|dsa|oop|dbms|os\b|dccn|data structures|computer science/.test(text)
  ) {
    return "fundamentals";
  }

  if (/grill|interview|mock interview|scorecard|aptitude|placement prep/.test(text)) {
    return "grill";
  }

  return "project";
}

function normalizeCourseStatus(course) {
  return normalizeRoadmapText(course?.status || course?.courseStatus || "");
}

function isCourseAvailable(course) {
  return normalizeCourseStatus(course) !== "upcoming";
}

function buildRoadmapCatalog(courses = []) {
  return courses
    .filter(isCourseAvailable)
    .reduce(
      (acc, course) => {
        const bucket = classifyCourse(course);
        acc[bucket].push({
          ...course,
          courseId: course.course_id ?? course.courseId ?? course.id ?? null,
          title: course.title || "Untitled roadmap",
          description: course.description || "",
          domain: course.domain || "",
          status: course.status || "active",
          type: course.type || bucket,
        });
        return acc;
      },
      { project: [], fundamentals: [], grill: [] }
    );
}

export default function RoadmapOnboardingModal({
  open,
  courses,
  loading,
  saving,
  onClose,
  onSkip,
  onSelectCourse,
}) {
  const [stage, setStage] = useState("track");
  const [selectedTrack, setSelectedTrack] = useState(null);
  const catalog = useMemo(() => buildRoadmapCatalog(courses), [courses]);

  useEffect(() => {
    if (!open) return;
    setStage("track");
    setSelectedTrack(null);
  }, [open]);

  if (!open) return null;

  const trackOptions = {
    project: catalog.project,
    fundamentals: catalog.fundamentals,
    grill: catalog.grill,
  };

  const trackMeta = {
    project: {
      title: "Project Dev",
      accent: C.blue,
    },
    fundamentals: {
      title: "CS Fundamentals",
      accent: C.purple,
    },
    grill: {
      title: "Grill Sessions",
      accent: C.yellow,
    },
  };

  const currentItems = selectedTrack ? trackOptions[selectedTrack] || [] : [];
  const currentMeta = selectedTrack ? trackMeta[selectedTrack] : null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: "rgba(17, 8, 31, 0.56)" }}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[28px] border shadow-2xl"
        style={{ borderColor: "rgba(255,255,255,0.12)", background: "#fff" }}
      >
        <div
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ background: "linear-gradient(135deg, #160a2f, #2d1557)" }}
        >
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: "#e9d5ff" }}>
              First login setup
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              Choose your learning path
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border px-3 py-2 text-xs font-semibold text-white"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            Close
          </button>
        </div>

        <div className="max-h-[calc(90vh-118px)] space-y-5 overflow-y-auto px-6 py-6">
          {stage === "track" ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(trackMeta).map(([key, meta]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedTrack(key);
                      setStage("stack");
                    }}
                    className="rounded-2xl border p-3.5 text-left transition hover:-translate-y-0.5"
                    style={{
                      borderColor: `${meta.accent}30`,
                      background: `${meta.accent}0F`,
                    }}
                  >
                    <div className="mt-2 text-base font-bold md:text-lg" style={{ color: C.ink }}>
                      {meta.title}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between" style={{ borderColor: C.border }}>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onSkip}
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{ borderColor: C.border, color: C.muted }}
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
                    Step 2
                  </div>
                  <div className="mt-1 text-xl font-bold" style={{ color: C.ink }}>
                    {currentMeta?.title || "Choose a stack"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStage("track");
                    setSelectedTrack(null);
                  }}
                  className="rounded-full border px-4 py-2 text-sm font-semibold"
                  style={{ borderColor: C.border, color: C.muted }}
                >
                  Back
                </button>
              </div>

              {loading ? (
                <div className="rounded-2xl border p-4 text-sm" style={{ borderColor: C.border, color: C.muted }}>
                  Loading course options...
                </div>
              ) : currentItems.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {currentItems.map((course) => (
                    <button
                      key={course.courseId}
                      type="button"
                      onClick={() => onSelectCourse(course)}
                      disabled={saving}
                      className="rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-70"
                      style={{
                        borderColor: C.border,
                        background: "#fbf9ff",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-base font-bold" style={{ color: C.ink }}>
                            {course.title}
                          </div>
                        </div>
                        <div className="rounded-full border px-2 py-1 text-[10px] font-semibold" style={{ borderColor: C.border, color: C.muted }}>
                          #{course.courseId}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl border p-5"
                  style={{ borderColor: "#d1d5db", background: "#f9fafb" }}
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#6b7280" }}>
                    Locked
                  </div>
                  <div className="mt-2 text-lg font-bold" style={{ color: C.ink }}>
                    No available roadmaps in this category
                  </div>
                  <div className="mt-2 text-sm leading-6" style={{ color: C.muted }}>
                    We are not showing upcoming courses here. Please choose another category or skip for now.
                  </div>
                  <button
                    type="button"
                    disabled
                    className="mt-4 rounded-full px-4 py-2 text-sm font-semibold"
                    style={{ background: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" }}
                  >
                    Locked
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between" style={{ borderColor: C.border }}>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onSkip}
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{ borderColor: C.border, color: C.muted }}
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
