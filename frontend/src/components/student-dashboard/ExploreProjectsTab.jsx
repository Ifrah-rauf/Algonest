import { C } from "./constants";
import { SectionCard } from "./ui";

export default function ExploreProjectsTab({ projects, navigate, loading }) {
  return (
    <div className="space-y-5">
      <SectionCard title="Recommended Projects for You">
        <div className="mb-3 text-sm" style={{ color: C.muted }}>
          These projects are selected to help you build something real from your current skill track.
        </div>

        {loading ? (
          <div className="text-sm" style={{ color: C.muted }}>
            Loading project recommendations...
          </div>
        ) : !projects.length ? (
          <div className="text-sm" style={{ color: C.muted }}>
            No project recommendations yet. Complete your profile or career quiz.
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {projects.map((project) => {
              const projectId = project.project_id || project.id;
              return (
                <button
                  type="button"
                  key={projectId || project.project_title}
                  onClick={() => navigate(`/roadmaps`)}
                  className="group min-w-0 w-full rounded-3xl border border-transparent bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg sm:p-5"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                    <span className="max-w-full truncate rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-purple-700 sm:tracking-[0.18em]">
                      {project.domain || "Project"}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-slate-500">
                      {project.level || "Intermediate"}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold sm:text-lg" style={{ color: C.ink }}>
                    {project.project_title}
                  </h3>
                  <p className="mt-3 text-sm leading-6" style={{ color: C.muted }}>
                    {project.last_progress || "A practical project with a clear outcome and build plan."}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[var(--dash-purple)]">
                    <span>Start building</span>
                    <span>-&gt;</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
