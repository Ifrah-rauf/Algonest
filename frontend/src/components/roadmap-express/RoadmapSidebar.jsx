export default function RoadmapSidebar({
  sidebarOpen,
  setSidebarOpen,
  user,
  completedCount,
  totalLessons,
}) {
  return (
    <>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 280,
        background: "#1e1145", color: "#fff",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 90, overflowY: "auto", display: "flex", flexDirection: "column",
        boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.18)" : "none",
      }}>
        <div style={{ padding: "20px 18px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#8b7bb8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
            Your Dashboard
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #6b46c1, #f6c90e)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff",
            }}>
              {user?.username?.slice(0, 2).toUpperCase() || "IR"}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user?.username || "Student"}</div>
              <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace" }}>Backend Dev Path · Active</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { val: `${completedCount}/${totalLessons}`, label: "Lessons",     color: "#a78bfa" },
              { val: "0/2",                               label: "Checkpoints", color: "#f6c90e" },
              { val: "#7",                                label: "Leaderboard", color: "#a78bfa" },
              { val: "79",                                label: "Avg. Score",  color: "#34d399" },
            ].map(({ val, label, color }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.06)", borderRadius: 10,
                padding: "10px 12px", border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 10, color: "#8b7bb8", fontFamily: "monospace", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 80 }}
        />
      )}
    </>
  );
}
