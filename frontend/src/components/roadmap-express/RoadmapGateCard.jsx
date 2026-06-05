export default function RoadmapGateCard({
  kind,
  indexLabel,
  title,
  description,
  status,
  sessionId = null,
  onBook = null,
  bookLabel = "Select Teacher",
  lockedHint = "Locked until you complete the previous step.",
}) {
  const statusMeta = {
    completed: { label: "Completed", background: "#ffffff", color: "#000000", border: "#ffffff" },
    pending: { label: "Session Pending", background: "#fff8e1", color: "#b45309", border: "#fde68a" },
    ready: { label: "Ready to book", background: "#f0ecfc", color: "#6b46c1", border: "#d8d0f0" },
    locked: { label: "Locked", background: "#f3f4f6", color: "#6b7280", border: "#e5e7eb" },
  };

  const meta = statusMeta[status] || statusMeta.locked;

  return (
    <div style={{
      background: "#f2e5fbff",
      border: "2px solid #dca2ffff",
      borderRadius: 10,
      padding: 18,
      boxShadow: status === "ready" ? "0 10px 28px rgba(107,70,193,0.08)" : "0 1px 6px rgba(0,0,0,0.04)",
      transition: "all 0.22s ease",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "#9991b8", letterSpacing: 2, textTransform: "uppercase" }}>
            {indexLabel}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1035", marginTop: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: "#5c5478", lineHeight: 1.65, marginTop: 6 }}>
            {description}
          </div>
        </div>
        <span style={{
          fontSize: 10,
          fontFamily: "monospace",
          background: meta.background,
          color: meta.color,
          border: `1px solid ${meta.border}`,
          padding: "4px 8px",
          borderRadius: 999,
          whiteSpace: "nowrap",
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {meta.label}
        </span>
      </div>

      <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        {sessionId && (
          <div style={{
            fontSize: 10,
            fontFamily: "monospace",
            color: "#7b70a0",
            background: "#faf9ff",
            border: "1px solid #ece7fb",
            borderRadius: 999,
            padding: "6px 10px",
          }}>
            session_id: {sessionId}
          </div>
        )}
        {status === "locked" && (
          <div style={{ fontSize: 11, color: "#7b70a0" }}>{lockedHint}</div>
        )}
        {status === "pending" && (
          <div style={{ fontSize: 11, color: "#7b70a0" }}>
            We&apos;ll unlock the next step once this session is completed and marked by the mentor.
          </div>
        )}
        {status === "completed" && (
          <div style={{ fontSize: 11, color: "#047857" }}>
            Great work. This milestone is complete.
          </div>
        )}
        {status === "ready" && onBook && (
          <button
            onClick={onBook}
            style={{
              border: "none",
              background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
              color: "#fff",
              borderRadius: 12,
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              marginLeft: "auto",
            }}
          >
            {bookLabel}
          </button>
        )}
      </div>
    </div>
  );
}
