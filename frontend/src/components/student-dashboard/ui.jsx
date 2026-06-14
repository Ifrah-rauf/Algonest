export function AppShell({ children }) {
  return <div className="student-dashboard">{children}</div>;
}

export function SectionCard({ title, action, children, className = "" }) {
  return (
    <section
      className={`dash-card min-w-0 rounded-2xl border ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-col gap-3 border-b border-[var(--dash-border)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <h3 className="min-w-0 text-base font-semibold text-[var(--dash-ink)]">
            {title}
          </h3>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className="min-w-0 p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 shrink-0 border-b-2 px-3 py-3 text-sm transition sm:px-4 ${
        active
          ? "border-[var(--dash-purple)] text-[var(--dash-purple)]"
          : "border-transparent text-[var(--dash-muted)] hover:text-[var(--dash-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

export function EmptyPanel({ icon: Icon, title, body, action }) {
  return (
    <div
      className="dash-card-soft flex min-h-[220px] flex-col items-center justify-center rounded-2xl border px-4 py-8 text-center sm:min-h-[260px] sm:px-6 sm:py-10"
    >
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--dash-purple-light)] text-[var(--dash-purple)]">
        <Icon className="h-7 w-7" />
      </div>
      <h4 className="mt-6 text-2xl font-bold tracking-tight text-[var(--dash-ink)] sm:text-3xl">
        {title}
      </h4>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--dash-muted)]">
        {body}
      </p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <AppShell>
      <div className="px-3 py-4 sm:px-5 sm:py-6 md:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl bg-[var(--dash-purple-tint)]" />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mx-3 mt-4 flex flex-col gap-3 rounded-xl border border-red-300 bg-[var(--dash-red-light)] px-4 py-4 sm:mx-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <span className="text-sm text-[var(--dash-red)]">
        {message}
      </span>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="self-start rounded-full bg-[var(--dash-red)] px-4 py-1.5 text-xs font-semibold text-white sm:self-auto"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
