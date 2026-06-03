import { C } from "./constants";
import { SectionCard } from "./ui";
import { Link } from "react-router-dom";

function getMentorTags(mentor) {
  const specialisation = mentor.specialisation || {};
  const expertise = Array.isArray(mentor.expertise)
    ? mentor.expertise
    : typeof mentor.expertise === "string"
    ? mentor.expertise.split(",")
    : [];

  return [
    specialisation.sp1,
    specialisation.sp2,
    specialisation.sp3,
    specialisation.sp4,
    ...expertise,
    mentor.specialisation_id,
  ]
    .map((tag) => (typeof tag === "string" ? tag.trim() : tag))
    .filter(Boolean)
    .slice(0, 4);
}

function CourseAds({ courses, activeCourse, navigate }) {
  const activeCourseId = activeCourse?.courseId || activeCourse?.course_id;
  const activeTitle = activeCourse?.title?.toLowerCase();
  const otherCourses = (courses || [])
    .filter((course) => {
      const courseId = course.course_id || course.id;
      const title = course.title?.toLowerCase();
      return courseId !== activeCourseId && title !== activeTitle;
    })
    .slice(0, 3);

  return (
    <SectionCard title="What's New @Algonest?">
      {otherCourses.length ? (
        <div className="space-y-3">
          {otherCourses.map((course) => (
            <button
              key={course.course_id || course.title}
              type="button"
              onClick={() => navigate("/roadmaps")}
              className="w-full rounded-3xl border p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
              style={{ borderColor: C.border, background: C.white }}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[rgba(107,70,193,0.14)] text-sm font-bold text-[var(--dash-purple)]">
                  {(course.domain || course.title || "A").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-semibold" style={{ color: C.ink }}>
                    {course.title || "New course"}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[var(--dash-purple)]">
                    {course.domain || "AlgoNest course"}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5" style={{ color: C.muted }}>
                    {course.description || "Explore a new guided roadmap with mentor support and project checkpoints."}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-sm" style={{ color: C.muted }}>
          New course recommendations will appear here soon.
        </div>
      )}
    </SectionCard>
  );
}

function ProjectPicks({ projectSuggestions, navigate }) {
  return (
    <SectionCard title="Top project picks">
      {projectSuggestions?.length ? (
        <div className="space-y-3">
          {projectSuggestions.slice(0, 2).map((project) => {
            const projectId = project.project_id || project.id;
            return (
              <button
                key={projectId || project.project_title}
                type="button"
                onClick={() => navigate(`/projects/${projectId}`)}
                className="min-w-0 w-full rounded-3xl border border-transparent bg-[var(--dash-white)] p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                style={{ borderColor: C.border }}
              >
                <div className="line-clamp-2 text-sm font-semibold" style={{ color: C.ink }}>
                  {project.project_title}
                </div>
                <div className="mt-2 text-xs" style={{ color: C.muted }}>
                  {project.domain || "Project"} - {project.level || "Intermediate"}
                </div>
              </button>
            );
          })}
          <div className="text-xs text-[var(--dash-purple)]">See more projects in the Explore tab.</div>
        </div>
      ) : (
        <div className="text-sm" style={{ color: C.muted }}>
          Project recommendations will appear here once your active track is loaded.
        </div>
      )}
    </SectionCard>
  );
}

function MentorList({ mentors }) {
  return (
    <div>
      <div className="mb-3 text-2xl font-bold tracking-tight sm:text-[28px]" style={{ color: C.ink }}>
        Suggested Mentors
      </div>
      <div className="space-y-4">
        {mentors.length ? (
          mentors.slice(0, 2).map((mentor) => {
            const tags = getMentorTags(mentor);

            return (
              <Link key={mentor.t_id || mentor.name} to={`/teachersProfile/${mentor.t_id}`}>
                <SectionCard>
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <img
                      src={
                        mentor.pfp ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          mentor.name || "Mentor"
                        )}&background=6b46c1&color=fff`
                      }
                      alt={mentor.name || "Mentor"}
                      className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-xl font-bold tracking-tight sm:text-2xl" style={{ color: C.ink }}>
                          {mentor.name}
                        </div>
                        {mentor.verified ? <div className="h-2.5 w-2.5 rounded-full" style={{ background: C.purple }} /> : null}
                      </div>
                      <div className="text-sm" style={{ color: C.muted }}>
                        @{(mentor.name || "mentor").replace(/\s+/g, "").toLowerCase()}
                      </div>
                      <div className="mt-1 text-sm" style={{ color: C.purple }}>
                        {mentor.experience ? `SDE ${mentor.experience}` : "Mentor"}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7" style={{ color: C.muted }}>
                    {mentor.bio ||
                      "Experienced mentor available for roadmap support, accountability, and checkpoint guidance."}
                  </p>
                  {tags.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: C.border, color: C.ink, background: C.bg }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </SectionCard>
              </Link>
            );
          })
        ) : (
          <SectionCard>
            <div className="text-sm" style={{ color: C.muted }}>
              No mentors were returned for the active plan yet.
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

export default function RightSidebar({ activeCourse, courses, mentors, projectSuggestions, navigate }) {
  return (
    <div className="space-y-5">
      <CourseAds courses={courses} activeCourse={activeCourse} navigate={navigate} />
      <MentorList mentors={mentors} />
      <ProjectPicks projectSuggestions={projectSuggestions} navigate={navigate} />
      
    </div>
  );
}
