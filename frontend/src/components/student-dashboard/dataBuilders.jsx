import { BookOpen, Calendar, Sparkles, Trophy } from "lucide-react";
import { formatDateLabel, formatDateTimeLabel, formatRelativeTime, getInitials, capitalizeWords } from "./formatters";

export function buildStudentProfile(data, user) {
  const profile = data?.profile || {};
  const activeCourse = data?.activeCourse || null;
  const selectedCourse = data?.selectedCourse || null;
  const roadmapCourse = activeCourse || selectedCourse || {};
  const resolvedDomain = data?.domain || profile.domain || roadmapCourse.domain || null;
  const name = profile.name || user?.username || "Student";

  return {
    uid: profile.uid,
    s_id: profile.s_id,
    name,
    bio: profile.bio || "",
    pfp: profile.pfp || "",
    handle: `@${(user?.username || profile.username || name).replace(/\s+/g, "").toLowerCase()}`,
    avatar: getInitials(name),
    education: profile.education || "AlgoNest Learner",
    domain: resolvedDomain,
    headline:
      roadmapCourse.desc ||
      profile.bio ||
      "Building project momentum one meaningful checkpoint at a time.",
    currentTrack: roadmapCourse.title || "Roadmap preview",
    packageStart: formatDateLabel(roadmapCourse.booking_date, "After your first booking"),
    packageEnd: formatDateLabel(roadmapCourse.expiry_date, "Will appear after booking"),
  };
}

export function buildRoadmaps(data) {
  const activeCourse = data?.activeCourse || data?.selectedCourse || null;
  const lessonProgress = data?.lessonProgress || {};

  if (!activeCourse) return [];

  return [
    {
      id: activeCourse.courseId || activeCourse.plan_id || activeCourse.title,
      title: activeCourse.title || "Current roadmap",
      description:
        activeCourse.desc ||
        "Your current roadmap details will appear here when the course description is available.",
      level:
        lessonProgress.progressPct >= 70
          ? "Advanced"
          : lessonProgress.progressPct >= 30
          ? "Intermediate"
          : "Beginner",
      rating: lessonProgress.totalLessons ? (4 + lessonProgress.progressPct / 100).toFixed(1) : "4.0",
      enrolled: `${lessonProgress.totalLessons || 0} lessons`,
    },
  ];
}

export function buildRoadmapActivityState(data) {
  const activeCourse = data?.activeCourse || data?.selectedCourse;
  const roadmaps = buildRoadmaps(data);

  if (!activeCourse) {
    return {
      heading: "Your learning path awaits",
      source: "missing",
      roadmaps: [],
    };
  }

  return {
    heading: "Your roadmap",
    source: "active",
    roadmaps,
  };
}

export function buildActivityItems(data, sessionInfo) {
  const activeCourse = data?.activeCourse || data?.selectedCourse || {};
  const lessonProgress = data?.lessonProgress || {};
  const interviews = Array.isArray(data?.interviews) ? data.interviews : [];
  const items = [];

  if (activeCourse.title) {
    items.push({
      id: "roadmap-live",
      title: `${activeCourse.title} is active`,
      subtitle: activeCourse.planTitle || "Current plan",
      body: activeCourse.desc || "Your roadmap is ready to continue.",
      time: formatRelativeTime(activeCourse.booking_date, "Current"),
      icon: Sparkles,
    });
  }

  if (lessonProgress.nextLessonTitle) {
    items.push({
      id: "next-lesson",
      title: "Next lesson unlocked",
      subtitle: lessonProgress.nextLessonTitle,
      body: `${lessonProgress.completedLessons || 0}/${lessonProgress.totalLessons || 0} lessons completed so far.`,
      time: `${lessonProgress.progressPct || 0}% progress`,
      icon: BookOpen,
    });
  }

  if (
    sessionInfo?.session?.title ||
    sessionInfo?.status === "UPCOMING" ||
    sessionInfo?.status === "ACTIVE"
  ) {
    items.push({
      id: "session",
      title:
        sessionInfo.status === "ACTIVE"
          ? "Your mentorship session is live"
          : "Mentorship session update",
      subtitle: sessionInfo.session?.title || "Session timeline",
      body: sessionInfo.session?.start_time
        ? `Scheduled for ${formatDateTimeLabel(sessionInfo.session.start_time)}.`
        : "Your next session will appear here once a mentor schedules it.",
      time: capitalizeWords(sessionInfo.status || "pending"),
      icon: Calendar,
    });
  }

  interviews.forEach((interview, index) => {
    items.push({
      id: interview.session_id || `interview-${index}`,
      title: interview.title || "Interview checkpoint",
      subtitle: interview.mentorName || "Mentor to be assigned",
      body: interview.notes || "Interview details will appear here once confirmed.",
      time: formatDateTimeLabel(interview.start_time, interview.status || "Pending"),
      icon: Trophy,
    });
  });

  return items;
}
