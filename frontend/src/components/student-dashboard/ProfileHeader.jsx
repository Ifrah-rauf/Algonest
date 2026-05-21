import { CircleEllipsis, Sparkles, SquarePen } from "lucide-react";
import { C } from "./constants";
import { formatDateLabel } from "./formatters";
import { SectionCard } from "./ui";

export default function ProfileHeader({ student, activeCourse, onMentorClick, onProfileClick }) {
  return (
    <SectionCard className="overflow-hidden p-0">
      <div style={{ height: 80, background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})` }} />
      <div className="flex flex-col gap-5 px-4 pb-5 pt-0 sm:px-5 md:flex-row md:items-end md:justify-between">
        <div className="-mt-10 flex min-w-0 items-end gap-3 sm:gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 text-3xl font-bold text-white sm:h-20 sm:w-20 sm:text-4xl" style={{ borderColor: C.white, backgroundColor: C.purple }}>
            {student.avatar.charAt(0).toLowerCase()}
          </div>
          <div className="min-w-0 pb-1">
            <div className="truncate text-xl font-bold sm:text-2xl" style={{ color: C.ink }}>
              {student.name.toLowerCase()}
            </div>
            <div className="mt-1 truncate text-sm" style={{ color: C.muted }}>
              {student.handle}
            </div>
            <div className="mt-2 line-clamp-2 text-sm" style={{ color: C.purple }}>
              {student.currentTrack}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button type="button" onClick={onMentorClick} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-105 sm:flex-none sm:px-5" style={{ backgroundColor: C.yellow }}>
            <Sparkles className="h-4 w-4 shrink-0" />
            Keep Learning
          </button>
          <button type="button" onClick={onProfileClick} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border bg-transparent px-4 py-2.5 text-sm font-semibold transition hover:bg-black/5 sm:flex-none sm:px-5" style={{ borderColor: "rgba(107,70,193,0.55)" }}>
            <SquarePen className="h-4 w-4 shrink-0" />
            Edit Profile
          </button>
          <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-black/5" style={{ color: C.muted }}>
            <CircleEllipsis className="h-5 w-5" />
          </button>
        </div>
      </div>

      {activeCourse?.planTitle ? (
        <div className="px-4 pb-5 sm:px-5">
          <div className="inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-medium" style={{ color: C.purple, borderColor: "rgba(107,70,193,0.25)", background: C.purpleLight }}>
            <span className="truncate">
            {activeCourse.planTitle} - Ends {formatDateLabel(activeCourse.expiry_date, "TBD")}
            </span>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
}
