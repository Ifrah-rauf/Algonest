const statusMeta = {
  completed: {
    label: "Completed",
    className: "border-white bg-white text-black",
    messageClass: "text-emerald-700",
  },
  pending: {
    label: "Session Pending",
    className: "border-amber-200 bg-amber-50 text-[var(--road-amber)]",
    messageClass: "text-[var(--road-muted)]",
  },
  ready: {
    label: "Ready to book",
    className: "border-[#d8d0f0] bg-[var(--road-purple-soft)] text-[var(--road-purple)]",
    messageClass: "text-[var(--road-muted)]",
  },
  locked: {
    label: "Locked",
    className: "border-slate-200 bg-slate-100 text-slate-500",
    messageClass: "text-[var(--road-muted)]",
  },
};

export default function RoadmapGateCard({
  indexLabel,
  title,
  description,
  status,
  sessionId = null,
  onBook = null,
  bookLabel = "Select Teacher",
  lockedHint = "Locked until you complete the previous step.",
}) {
  const meta = statusMeta[status] || statusMeta.locked;

  return (
    <div
      className={`rounded-xl border-2 border-[#dca2ff] bg-[#f2e5fb] p-4 transition ${
        status === "ready" ? "shadow-[0_10px_28px_rgba(107,70,193,0.08)]" : "shadow-sm"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--road-subtle)]">
            {indexLabel}
          </div>
          <div className="mt-1 text-base font-extrabold text-[var(--road-ink)]">
            {title}
          </div>
          <div className="mt-1.5 text-xs leading-6 text-[#5c5478]">
            {description}
          </div>
        </div>

        <span
          className={`shrink-0 whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[10px] font-bold ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        {sessionId ? (
          <div className="rounded-full border border-[#ece7fb] bg-[var(--road-purple-tint)] px-2.5 py-1.5 font-mono text-[10px] text-[var(--road-muted)]">
            session_id: {sessionId}
          </div>
        ) : null}

        {status === "locked" ? (
          <div className={`text-[11px] ${meta.messageClass}`}>{lockedHint}</div>
        ) : null}

        {status === "pending" ? (
          <div className={`text-[11px] ${meta.messageClass}`}>
            We&apos;ll unlock the next step once this session is completed and marked by the mentor.
          </div>
        ) : null}

        {status === "completed" ? (
          <div className={`text-[11px] ${meta.messageClass}`}>
            Great work. This milestone is complete.
          </div>
        ) : null}

        {status === "ready" && onBook ? (
          <button
            type="button"
            onClick={onBook}
            className="road-gradient ml-auto rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-white"
          >
            {bookLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
