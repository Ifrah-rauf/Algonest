function PartyBurst() {
  const pieces = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pieces.map((piece) => {
        const left = 8 + (piece % 6) * 15;
        const delay = (piece % 6) * 0.08;
        const hue = ["#6b46c1", "#f6c90e", "#34d399", "#fb7185"][piece % 4];

        return (
          <span
            key={piece}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "56%",
              width: piece % 3 === 0 ? 8 : 12,
              height: 4,
              borderRadius: 999,
              background: hue,
              transform: "rotate(18deg)",
              animation: `checkpoint-confetti 1.2s ease-out ${delay}s infinite`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </div>
  );
}

export default function CheckpointCelebrationModal({ checkpoint, onClose, onSelectTeacher }) {
  if (!checkpoint) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(18, 11, 41, 0.42)",
      zIndex: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        position: "relative",
        width: "min(560px, 100%)",
        background: "linear-gradient(180deg, #fffdf5 0%, #ffffff 100%)",
        borderRadius: 12,
        border: "1px solid #fde68a",
        boxShadow: "0 18px 50px rgba(18, 11, 41, 0.2)",
        padding: "28px 28px 24px",
        overflow: "hidden",
      }}>
        <PartyBurst />
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6b46c1, #f6c90e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              boxShadow: "0 10px 24px rgba(107,70,193,0.25)",
            }}>
              🎉
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#92400e", letterSpacing: 2, textTransform: "uppercase" }}>
                Checkpoint Reached
              </div>
              <h2 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: "#1a1035" }}>
                Hooray! You unlocked {checkpoint.title}
              </h2>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "#5c5478" }}>
            You made it to a mentor checkpoint. Pick a new teacher for this review, and we&apos;ll attach the created session directly to this checkpoint.
          </p>

          <div style={{
            background: "#fff8e1",
            border: "1px solid #fde68a",
            borderRadius: 10,
            padding: "14px 16px",
          }}>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "#92400e", textTransform: "uppercase", letterSpacing: 1.5 }}>
              What happens next
            </div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
              Choose a teacher, book the checkpoint session, and we&apos;ll send you straight back here with the `session_id` linked to this checkpoint.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => onSelectTeacher({
                kind: "checkpoint",
                id: checkpoint.checkpoint_id,
                title: checkpoint.title,
              })}
              style={{
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                background: "linear-gradient(135deg, #6b46c1, #8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Select New Teacher
            </button>
            <button
              onClick={onClose}
              style={{
                border: "1px solid #ddd6fe",
                borderRadius: 12,
                padding: "12px 18px",
                background: "#fff",
                color: "#6b46c1",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
