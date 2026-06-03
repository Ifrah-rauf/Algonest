import Navbar from "../navbar";

export default function RoadmapTopBar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  completedCount,
  totalLessons,
}) {
  return (
    <>
      <Navbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(o => !o)}
      />

      <header style={{
        minHeight: 58,
        background: "rgba(255,255,255,0.94)",
        borderBottom: "1px solid #e8e4f0",
        display: "flex",
        alignItems: "center",
        padding: "10px 22px",
        gap: 14,
        flexShrink: 0,
        zIndex: 40,
        boxShadow: "0 1px 14px rgba(107,70,193,0.06)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#9991b8", fontFamily: "monospace" }}>
            <span style={{ color: "#444" }}>Backend Dev</span>
            <span style={{ color: "#d0c8f0" }}>/</span>
            <span style={{ color: "#6b46c1", fontWeight: 600 }}>Node.js + Express</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("roadmap")}
              style={{
                border: "1px solid transparent",
                background: activeTab === "roadmap" ? "#efe7ff" : "transparent",
                color: activeTab === "roadmap" ? "#5b21b6" : "#8b7bb8",
                borderRadius: 0,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "none",
              }}
            >
              Tab 1 · Roadmap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("booking")}
              style={{
                border: "1px solid transparent",
                background: activeTab === "booking" ? "#efe7ff" : "transparent",
                color: activeTab === "booking" ? "#5b21b6" : "#8b7bb8",
                borderRadius: 0,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "none",
              }}
            >
              Tab 2 · Booking & Overview
            </button>
          </div>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#f0ecfc", borderRadius: 12,
            padding: "5px 14px", fontSize: 11, fontFamily: "monospace",
          }}>
            <div style={{ width: 60, height: 4, background: "#e0d8f8", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${totalLessons ? (completedCount / totalLessons) * 100 : 0}%`,
                background: "linear-gradient(90deg, #6b46c1, #f6c90e)",
                borderRadius: 3, transition: "width 0.4s",
              }} />
            </div>
            <span style={{ color: "#6b46c1", fontWeight: 700 }}>{completedCount}/{totalLessons} lessons</span>
          </div>

          <div style={{
            background: "#fff8e1", border: "1px solid #f6c90e",
            borderRadius: 12, padding: "5px 12px",
            fontSize: 11, fontFamily: "monospace", color: "#b45309", fontWeight: 600,
          }}>
            🔥 12-day streak
          </div>
        </div>
      </header>
    </>
  );
}
