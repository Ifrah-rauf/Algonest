import { supabase } from "../lib/supabase.js";
import { resolveStudentRoadmapContext } from "./roadmapContext.js";

async function getStudentIdByUid(uid) {
  const { data: studentRow, error } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (error) throw error;
  return studentRow?.s_id || null;
}

async function getBookingIdsByStudentId(studentId) {
  if (!studentId) return [];

  const { data: bookings, error } = await supabase
    .from("booking")
    .select("booking_id")
    .eq("s_id", studentId);

  if (error) throw error;
  return (bookings || []).map((booking) => booking.booking_id).filter(Boolean);
}

export async function getActiveCourse(uid) {
  const context = await resolveStudentRoadmapContext({ uid });
  return context.source === "booking" ? context.activeCourse : null;
}

export async function getInterviewSessions(uid) {
  const studentId = await getStudentIdByUid(uid);
  if (!studentId) return [];
  const bookingIds = await getBookingIdsByStudentId(studentId);
  if (!bookingIds.length) return [];

  const { data: studentSessions, error: sessionError } = await supabase
    .from("session")
    .select("session_id, title, start_time, end_time, status, t_id, booking_id")
    .in("booking_id", bookingIds)
    .order("start_time", { ascending: true });

  if (sessionError || !studentSessions?.length) return [];

  const sessionIds = studentSessions.map((session) => session.session_id);

  const [{ data: interviewRows }, { data: teacherRows }] = await Promise.all([
    supabase
      .from("interview_sessions")
      .select("interview_id, session_id, notes, created_at")
      .in("session_id", sessionIds),
    studentSessions.some((session) => session.t_id)
      ? supabase
          .from("teacher")
          .select("t_id, name")
          .in(
            "t_id",
            [...new Set(studentSessions.map((session) => session.t_id).filter(Boolean))]
          )
      : Promise.resolve({ data: [] }),
  ]);

  const interviewSessionIds = new Set((interviewRows || []).map((row) => row.session_id));
  const interviewSessions = studentSessions.filter((session) => interviewSessionIds.has(session.session_id));
  const interviewMetaBySession = Object.fromEntries(
    (interviewRows || []).map((row) => [row.session_id, row])
  );
  const teacherNameById = Object.fromEntries(
    (teacherRows || []).map((teacher) => [teacher.t_id, teacher.name])
  );

  return interviewSessions.slice(0, 2).map((session, index) => {
    const meta = interviewMetaBySession[session.session_id] || {};

    return {
      interview_id: meta.interview_id || null,
      session_id: session.session_id,
      title: index === 0 ? "Mock Interview" : "Final Mock Interview",
      mentorName: teacherNameById[session.t_id] || "Mentor to be assigned",
      start_time: session.start_time,
      end_time: session.end_time,
      status: session.status,
      notes: meta.notes || "Interview plan will appear here once your mentor schedules it.",
    };
  });
}

export async function getLessonProgressSummary(uid, courseId) {
  if (!courseId) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      remainingLessons: 0,
      progressPct: 0,
      nextLessonTitle: null,
    };
  }

  const studentId = await getStudentIdByUid(uid);
  if (!studentId) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      remainingLessons: 0,
      progressPct: 0,
      nextLessonTitle: null,
    };
  }

  const [{ data: lessons, error: lessonsError }, { data: progressRows, error: progressError }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("lesson_id, title, order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true }),
      supabase
        .from("lesson_progress")
        .select("lesson_id, completed, completed_at, quiz_marks, quiz_passed, quiz_attempt")
        .eq("s_id", studentId),
    ]);

  if (lessonsError) throw lessonsError;
  if (progressError) throw progressError;

  const lessonList = lessons || [];
  const progressByLessonId = Object.fromEntries(
    (progressRows || []).map((row) => [row.lesson_id, row])
  );

  const completedLessons = lessonList.filter(
    (lesson) => progressByLessonId[lesson.lesson_id]?.completed
  ).length;
  const totalLessons = lessonList.length;
  const remainingLessons = Math.max(totalLessons - completedLessons, 0);
  const nextLesson = lessonList.find(
    (lesson) => !progressByLessonId[lesson.lesson_id]?.completed
  );
const lessonById = Object.fromEntries(
    lessonList.map((lesson) => [lesson.lesson_id, lesson])
  );
  const quizRows = (progressRows || []).filter((row) => row.quiz_attempt);
  const quizAttempts = quizRows.length;
  const passedQuizAttempts = quizRows.filter((row) => Boolean(row.quiz_passed)).length;
  const latestQuiz = [...quizRows].sort((a, b) => {
    const aCompletedAt = a.completed_at ? new Date(a.completed_at).getTime() : 0;
    const bCompletedAt = b.completed_at ? new Date(b.completed_at).getTime() : 0;

    if (aCompletedAt !== bCompletedAt) return bCompletedAt - aCompletedAt;

    return (
      (lessonById[b.lesson_id]?.order_index || 0) -
      (lessonById[a.lesson_id]?.order_index || 0)
    );
  })[0];
  return {
    totalLessons,
    completedLessons,
    remainingLessons,
    progressPct: totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0,
    nextLessonTitle: nextLesson?.title || null,
    quiz_attempts: quizAttempts,
    attempted: quizAttempts,
    quiz_marks: latestQuiz?.quiz_marks ?? null,
    latestScore: latestQuiz?.quiz_marks ?? null,
    quiz_passed: latestQuiz?.quiz_passed ?? null,
    latestPassed: latestQuiz?.quiz_passed ?? null,
    latestLessonTitle: latestQuiz ? lessonById[latestQuiz.lesson_id]?.title || null : null,
    passRate: quizAttempts
      ? `${Math.round((passedQuizAttempts / quizAttempts) * 100)}% pass rate`
      : null,
  };
}

export async function getSessions(uid) {
  const { data: students } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .limit(1);

  if (!students?.length) return [];

  const s_id = students[0].s_id;
  const bookingIds = await getBookingIdsByStudentId(s_id);
  if (!bookingIds.length) return [];

  const { data: sessions } = await supabase
    .from("session")
    .select("title, status, session_link, start_time")
    .in("booking_id", bookingIds)
    .order("start_time", { ascending: false });

  return sessions || [];
}

export async function getDashboardfunc(uid) {
  console.log("UID received:", uid);

  const { data: user, error: userErr } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (userErr || !user) {
    throw new Error("User not found");
  }

  const userRole = String(user.role || "STUDENT").trim().toUpperCase();

  if (userRole === "TEACHER") {
    const { data: teacher, error } = await supabase
      .from("teacher")
      .select("*")
      .eq("uid", uid)
      .single();

    if (error) throw error;

    return {
      role: "TEACHER",
      data: teacher,
    };
  } else if (userRole === "ADMIN") {
    return {
      role: "ADMIN",
      data: {
        auth: {
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: userRole,
        },
      },
    };
  } else {
    const roadmapContext = await resolveStudentRoadmapContext({ uid });
    const student = roadmapContext.student;
    const selectedCourse = roadmapContext.selectedCourse;
    const activeCourse = roadmapContext.activeCourse;
    const currentCourseId = roadmapContext.roadmapCourseId;
    const [interviews, lessonProgress] = await Promise.all([
      getInterviewSessions(uid),
      getLessonProgressSummary(uid, currentCourseId),
    ]);

    return {
      role: "STUDENT",
      data: {
        profile: student,
        roadmapContext,
        selectedCourse,
        activeCourse,
        domain: roadmapContext.domain || selectedCourse?.domain || activeCourse?.domain || student?.domain || null,
        interviews,
        lessonProgress,
        hasAnyBooking: roadmapContext.source === "booking",
      },
    };
  }
}
