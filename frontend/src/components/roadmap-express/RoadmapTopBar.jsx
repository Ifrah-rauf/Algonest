import Navbar from "../navbar";

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 shrink-0 px-3 py-2 text-xs font-extrabold transition ${
        active
          ? "bg-[var(--road-purple-soft)] text-violet-800"
          : "text-[var(--road-subtle)] hover:bg-white hover:text-[var(--road-purple)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function RoadmapTopBar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  completedCount,
  totalLessons,
}) {
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
      />

      <header className="road-topbar z-40 flex min-h-[58px] shrink-0 flex-col gap-3 px-3 py-3 sm:px-5 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] text-[var(--road-subtle)]">
            <span className="shrink-0 text-slate-700">Backend Dev</span>
            <span className="text-[#d0c8f0]">/</span>
            <span className="truncate font-semibold text-[var(--road-purple)]">
              Node.js + Express
            </span>
          </div>

          <div className="flex max-w-full gap-1 overflow-x-auto">
            <TabButton active={activeTab === "roadmap"} onClick={() => setActiveTab("roadmap")}>
              Tab 1 - Roadmap
            </TabButton>
            <TabButton active={activeTab === "booking"} onClick={() => setActiveTab("booking")}>
              Tab 2 - Booking & Overview
            </TabButton>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <div className="flex items-center gap-2 rounded-xl bg-[var(--road-purple-soft)] px-3 py-1.5 font-mono text-[11px]">
            <progress
              className="h-1.5 w-16 overflow-hidden rounded-full"
              value={progress}
              max="100"
              aria-label="Roadmap completion"
            />
            <span className="font-bold text-[var(--road-purple)]">
              {completedCount}/{totalLessons} lessons
            </span>
          </div>

          <div className="rounded-xl border border-[var(--road-yellow)] bg-amber-50 px-3 py-1.5 font-mono text-[11px] font-semibold text-[var(--road-amber)]">
            12-day streak
          </div>
        </div>
      </header>
    </>
  );
}
