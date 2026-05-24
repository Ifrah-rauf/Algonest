import {
  Star,
  Users,
  Clock3,
  Briefcase,
  TrendingUp,
  ChevronRight,
  PlayCircle,
  Building2,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

export default function RoadmapBookingOverview({
  courseId,
  user,
  dashboardData,
  activeCourseData,
  selectedCourse,
  lessonProgress,
  hasAnyBooking,
  hasActiveBooking,
  resolvedDomain,
  navigate,
  onGoToRoadmap,
}) {
  const roadmapCourse =
    dashboardData?.activeCourse ||
    activeCourseData ||
    selectedCourse ||
    null;

  const profile = dashboardData?.profile || {};
  const roadmapName =
    roadmapCourse?.title ||
    selectedCourse?.title ||
    "Backend Developer Roadmap with Node.js, Express & Supabase";
  const roadmapType =
    roadmapCourse?.type ||
    selectedCourse?.type ||
    "Development";
  const roadmapDomain =
    resolvedDomain ||
    dashboardData?.domain ||
    profile.domain ||
    roadmapCourse?.domain ||
    null;
  const roadmapTrack =
    roadmapDomain ||
    roadmapType ||
    "Backend Development";
  const description =
    roadmapCourse?.desc ||
    roadmapCourse?.description ||
    profile.bio ||
    "Learn backend engineering through guided execution, mentor checkpoints, AI-assisted debugging and a deployable production-grade project.";
  const courseStatus = roadmapCourse?.courseStatus || roadmapCourse?.status || null;
  const rating = "4.8";
  const reviewCount = "1,204 reviews";
  const learnerCount = "18,400 learners";
  const roadmapDuration = "4 month roadmap";

  const reviews = [
    {
      name: "Aman Verma",
      role: "Backend Developer",
      review:
        "The roadmap structure felt extremely practical. I always knew what to build next.",
    },
    {
      name: "Sakshi Jain",
      role: "ML Engineer",
      review:
        "The mentor checkpoints were the best part. It forced me to actually understand my project.",
    },
    {
      name: "Rohit Gupta",
      role: "SDE Intern",
      review:
        "Very execution-focused. Doesn't feel like another tutorial playlist.",
    },
  ];

  const roadmapHighlights = [
    "Production-grade project",
    "1:1 mentor checkpoints",
    "AI Build Companion",
    "Interview preparation",
  ];

  const getEnrollHref = () => `/book-now?courseId=${courseId || roadmapCourse?.courseId || 1}`;

  return (
    <div className="min-h-screen w-full bg-[#f6f7fb] text-[#1a1a1a]">
      <section className="w-full border-b border-white/10 bg-[#0f1117]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-5 flex items-center gap-2 text-[11px] text-purple-300">
            <span>{roadmapType}</span>
            <ChevronRight size={12} />
            <span>{roadmapTrack}</span>
            <ChevronRight size={12} />
            <span className="text-white">{roadmapName}</span>
          </div>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white">
                {roadmapName}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-300">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-yellow-400">{rating}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-gray-300">({reviewCount})</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Users size={14} />
                  <span>{learnerCount}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <Clock3 size={14} />
                  <span>{roadmapDuration}</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                {profile.name || user?.username ? (
                  <>
                    Curated for <span className="text-purple-300">{profile.name || user?.username}</span>
                  </>
                ) : (
                  <>
                    Created by <span className="text-purple-300">AlgoNest</span>
                  </>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onGoToRoadmap}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Open roadmap
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(getEnrollHref())}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#6d28d9] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                >
                  Enroll Now
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5">
                <div className="mb-2 text-xs uppercase tracking-[0.14em] text-gray-500">
                  {roadmapDomain ? "Domain" : "Selected roadmap"}
                </div>
                <div className="mb-4 text-lg font-semibold text-[#1a1a1a]">
                  {roadmapDomain || roadmapName}
                </div>

                <div className="mb-4 text-3xl font-bold">
                  ₹9,999
                </div>

                <button
                  type="button"
                  onClick={() => navigate(getEnrollHref())}
                  className="w-full rounded-lg bg-[#6d28d9] py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
                >
                  Enroll Now
                </button>

                <div className="mt-6">
                  <h3 className="mb-4 text-sm font-semibold">
                    {roadmapName} includes:
                  </h3>

                  <div className="space-y-3 text-[13px] text-gray-600">
                    {roadmapHighlights.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        {item === "Production-grade project" && <Briefcase size={14} />}
                        {item === "1:1 mentor checkpoints" && <Users size={14} />}
                        {item === "AI Build Companion" && <PlayCircle size={14} />}
                        {item === "Interview preparation" && <TrendingUp size={14} />}
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 text-xl font-semibold">
            What you'll build in {roadmapName}
          </h2>

          <div className="grid gap-5 text-[13px] text-gray-700 md:grid-cols-2">
            {[
              "Authentication system using JWT",
              "Production-ready REST APIs",
              "Database schema design with Supabase",
              "Role-based access control",
              "Deployment workflows and backend architecture",
              "Real-world project debugging and mentor reviews",
            ].map((item, index) => (
              <div key={index} className="flex gap-3">
                <span className="mt-[1px] text-green-600">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                Market Trends & Career Intelligence for {roadmapName}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                AI-generated insights for {roadmapTrack}
              </p>
            </div>

            <div className="rounded-full bg-purple-100 px-3 py-1 text-[11px] font-medium text-purple-700">
              ML Powered
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-dashed border-gray-300 bg-[#fafafa] p-4">
              <TrendingUp className="mb-3 text-gray-500" size={18} />
              <div className="text-sm font-semibold">Job Market Growth</div>
              <div className="mt-2 text-xs text-gray-500">
                Placeholder for trend analysis engine
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-[#fafafa] p-4">
              <IndianRupee className="mb-3 text-gray-500" size={18} />
              <div className="text-sm font-semibold">Salary Intelligence</div>
              <div className="mt-2 text-xs text-gray-500">
                Placeholder for compensation prediction
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-[#fafafa] p-4">
              <Briefcase className="mb-3 text-gray-500" size={18} />
              <div className="text-sm font-semibold">Real Job Descriptions</div>
              <div className="mt-2 text-xs text-gray-500">
                Placeholder for JD clustering engine
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-[#fafafa] p-4">
              <Building2 className="mb-3 text-gray-500" size={18} />
              <div className="text-sm font-semibold">Hiring Companies</div>
              <div className="mt-2 text-xs text-gray-500">
                Placeholder for recruiter/company trends
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <Star className="text-yellow-500" fill="currentColor" size={20} />
            <h2 className="text-xl font-semibold">{rating} {roadmapName} rating</h2>
            <span className="text-sm text-gray-500">• 1,204 reviews</span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((review) => (
              <div key={review.name} className="rounded-lg border border-gray-200 bg-[#fcfcfd] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">{review.name}</div>
                    <div className="mt-1 text-xs text-gray-500">{review.role}</div>
                  </div>

                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <Star key={index} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-[13px] leading-6 text-gray-700">
                  {review.review}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 rounded-lg border border-purple-300 px-5 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
          >
            Show all reviews
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Booking summary</h2>
              <p className="mt-1 text-xs text-gray-500">
                This section reflects the current {roadmapName} booking state.
              </p>
            </div>
            <div className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600">
              {hasActiveBooking ? "Active booking" : hasAnyBooking ? "Different roadmap booked" : "No active booking"}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-[#fdfdfd] p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-gray-500">Domain</div>
              <div className="mt-2 text-sm font-semibold text-[#1a1a1a]">
                {roadmapDomain || "No domain selected"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fdfdfd] p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-gray-500">AI access</div>
              <div className="mt-2 text-sm font-semibold text-[#1a1a1a]">
                {roadmapDomain ? (hasActiveBooking ? "Unlocked" : "Preview / roadmap-limited") : "Locked"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fdfdfd] p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-gray-500">Progress</div>
              <div className="mt-2 text-sm font-semibold text-[#1a1a1a]">
                {lessonProgress?.progressPct != null
                  ? `${lessonProgress.progressPct}%`
                  : "Not available"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fdfdfd] p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-gray-500">Current user</div>
              <div className="mt-2 text-sm font-semibold text-[#1a1a1a]">
                {profile.name || user?.username || "Student"}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-[#fdfdfd] p-4">
              <div className="text-xs uppercase tracking-[0.14em] text-gray-500">Course status</div>
              <div className="mt-2 text-sm font-semibold text-[#1a1a1a]">
                {courseStatus || "Not available"}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onGoToRoadmap}
              className="rounded-lg border border-purple-300 px-5 py-2 text-sm font-medium text-purple-700 transition hover:bg-purple-50"
            >
              Back to roadmap
            </button>
            <button
              type="button"
              onClick={() => navigate(getEnrollHref())}
              className="rounded-lg bg-[#6d28d9] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
            >
              Enroll Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
