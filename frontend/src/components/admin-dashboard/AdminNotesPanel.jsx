export default function AdminNotesPanel() {
  return (
    <aside className="rounded-3xl border border-purple-100 bg-purple-50 p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">
        Admin Notes
      </h3>
      <div className="mt-4 space-y-3 text-sm text-purple-900">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold">Current scope</p>
          <p className="mt-1 text-purple-700">Payment approvals and teacher onboarding</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="font-semibold">Payment logs</p>
          <p className="mt-1 text-purple-700">Use the approved and rejected tabs to review decisions.</p>
        </div>
      </div>
    </aside>
  );
}
