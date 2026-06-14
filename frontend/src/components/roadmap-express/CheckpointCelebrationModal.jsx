function PartyBurst() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, piece) => (
        <span key={piece} className="road-confetti-piece" />
      ))}
    </div>
  );
}

export default function CheckpointCelebrationModal({ checkpoint, onClose, onSelectTeacher }) {
  if (!checkpoint) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#120b29]/40 p-4 sm:p-6">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-5 shadow-[0_18px_50px_rgba(18,11,41,0.2)] sm:p-7">
        <PartyBurst />

        <div className="relative z-[2] flex flex-col gap-3.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="road-gradient grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl shadow-[0_10px_24px_rgba(107,70,193,0.25)]">
              *
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-800">
                Checkpoint Reached
              </div>
              <h2 className="mt-1 text-2xl font-extrabold text-[var(--road-ink)]">
                Hooray! You unlocked {checkpoint.title}
              </h2>
            </div>
          </div>

          <p className="text-sm leading-7 text-[#5c5478]">
            You made it to a mentor checkpoint. Pick a new teacher for this review, and
            we&apos;ll attach the created session directly to this checkpoint.
          </p>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-amber-800">
              What happens next
            </div>
            <div className="mt-1.5 text-sm leading-6 text-amber-900">
              Choose a teacher, book the checkpoint session, and we&apos;ll send you straight
              back here with the session ID linked to this checkpoint.
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() =>
                onSelectTeacher({
                  kind: "checkpoint",
                  id: checkpoint.checkpoint_id,
                  title: checkpoint.title,
                })
              }
              className="road-gradient rounded-xl px-4 py-3 text-sm font-bold text-white"
            >
              Select New Teacher
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm font-bold text-[var(--road-purple)]"
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
