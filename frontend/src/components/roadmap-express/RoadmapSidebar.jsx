const sidebarStats = [
  { key: "lessons", label: "Lessons", colorClass: "text-violet-300" },
  { key: "checkpoints", label: "Checkpoints", colorClass: "text-[var(--road-yellow)]" },
];

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return parts[0]?.slice(0, 2).toUpperCase() || "ST";
}

function getCourseId(course) {
  return course?.courseId || course?.course_id || course?.id || null;
}

export default function RoadmapSidebar({
  activeCourseData,
  sidebarOpen,
  setSidebarOpen,
  user,
  courseId,
  dashboardData,
  hasActiveBooking = false,
  hasAnyBooking = false,
  checkpoints = [],
  checkpointProgressMap = {},
  completedCount,
  totalLessons,
}) {
  const studentName = dashboardData?.profile?.name || user?.username || "Student";
  const roadmapCourse =
    dashboardData?.activeCourse ||
    activeCourseData ||
    dashboardData?.selectedCourse ||
    null;
  const roadmapTitle =
    roadmapCourse?.title ||
    roadmapCourse?.name ||
    dashboardData?.domain ||
    `Course #${courseId}`;
  const activeCourseId = getCourseId(roadmapCourse);
  const isCurrentActiveCourse = Boolean(
    hasActiveBooking ||
    (activeCourseId && Number(activeCourseId) === Number(courseId))
  );
  const roadmapStatus = isCurrentActiveCourse
    ? "Active"
    : hasAnyBooking
    ? "Other roadmap active"
    : "Preview";
  const completedCheckpoints = checkpoints.filter((checkpoint) => {
    const progress = checkpointProgressMap[checkpoint.checkpoint_id];
    return progress?.completed === true || progress?.session?.marked_by_teacher === true;
  }).length;

  const values = {
    lessons: `${completedCount}/${totalLessons}`,
    checkpoints: `${completedCheckpoints}/${checkpoints.length}`,
  };

  return (
    <>
      <aside
        className={`road-sidebar road-scrollbar absolute bottom-0 left-0 top-0 z-[90] flex w-[280px] flex-col overflow-y-auto text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-4 pb-4 pt-5">
          <div className="mb-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8b7bb8]">
            Your Dashboard
          </div>

          <div className="mb-4 flex min-w-0 items-center gap-2.5">
            <div className="road-gradient grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-bold text-white">
              {getInitials(studentName)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white">
                {studentName}
              </div>
              <div className="truncate font-mono text-[10px] text-[#8b7bb8]">
                {roadmapTitle} - {roadmapStatus}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {sidebarStats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5"
              >
                <div className={`text-xl font-extrabold leading-none ${stat.colorClass}`}>
                  {values[stat.key]}
                </div>
                <div className="mt-1 font-mono text-[10px] text-[#8b7bb8]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          type="button"
          className="absolute inset-0 z-[80] bg-black/20"
          aria-label="Close roadmap sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
    </>
  );
}
