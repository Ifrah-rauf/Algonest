import { supabase } from "../lib/supabase.js";

async function getStudentIdByUid(uid) {
  const { data: studentRow, error } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (error) throw error;
  return studentRow?.s_id || null;
}

async function getHasAnyBooking(uid) {
  const studentId = await getStudentIdByUid(uid);
  if (!studentId) return false;

  const { data: booking, error } = await supabase
    .from("booking")
    .select("booking_id")
    .eq("s_id", studentId)
    .order("booking_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return Boolean(booking?.booking_id);
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
  const { data: students } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .limit(1);

  if (!students?.length) return null;
  const s_id = students[0].s_id;

  const { data: bookings } = await supabase
    .from("booking")
    .select("*")
    .eq("s_id", s_id)
    .gt("expiry_date", new Date().toISOString())
    .order("booking_date", { ascending: false })
    .limit(1);

  if (!bookings?.length) return null;
  const booking = bookings[0];
  let course = null;

  if (booking.course_id) {
    const { data: courseData } = await supabase
      .from("courses")
      .select("course_id, title, description, domain, status")
      .eq("course_id", booking.course_id)
      .maybeSingle();

    course = courseData || null;
  }

  const { data: plans } = await supabase
    .from("plan")
    .select("plan_name, sessions, description")
    .eq("plan_id", booking.plan_id)
    .limit(1);

  const plan = plans?.[0];
  if (!plan) return null;

  return {
    courseId: booking.course_id || course?.course_id || null,
    desc: course?.description || plan.description,
    title: course?.title || plan.plan_name,
    domain: course?.domain || null,
    courseStatus: course?.status || null,
    plan_id: booking.plan_id,
    planTitle: plan.plan_name,
    totalSessions: plan.sessions,
    remainingSessions: booking.remainingsessions,
    booking_date: booking.booking_date,
    expiry_date: booking.expiry_date,
  };
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
    .eq("session_type", "interview")
    .order("start_time", { ascending: true });

  if (sessionError || !studentSessions?.length) return [];

  const sessionIds = studentSessions.map((session) => session.session_id);
  const teacherIds = [
    ...new Set(studentSessions.map((session) => session.t_id).filter(Boolean)),
  ];

  const [{ data: interviewRows }, { data: teacherRows }] = await Promise.all([
    supabase
      .from("interview_sessions")
      .select("interview_id, session_id, notes, created_at")
      .in("session_id", sessionIds),
    teacherIds.length
      ? supabase
          .from("teacher")
          .select("t_id, name")
          .in("t_id", teacherIds)
      : Promise.resolve({ data: [] }),
  ]);

  const interviewMetaBySession = Object.fromEntries(
    (interviewRows || []).map((row) => [row.session_id, row])
  );
  const teacherNameById = Object.fromEntries(
    (teacherRows || []).map((teacher) => [teacher.t_id, teacher.name])
  );

  return studentSessions.slice(0, 2).map((session, index) => {
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
        .select("lesson_id, completed")
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

  return {
    totalLessons,
    completedLessons,
    remainingLessons,
    progressPct: totalLessons
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0,
    nextLessonTitle: nextLesson?.title || null,
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

  if (user.role === "TEACHER") {
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
  } else {
    const { data: student, error } = await supabase
      .from("student")
      .select("*")
      .eq("uid", uid)
      .single();

    if (error) throw error;

    const activeCourse = await getActiveCourse(uid);
    const [interviews, lessonProgress, hasAnyBooking] = await Promise.all([
      getInterviewSessions(uid),
      getLessonProgressSummary(uid, activeCourse?.courseId),
      getHasAnyBooking(uid),
    ]);

    return {
      role: "STUDENT",
      data: {
        profile: student,
        activeCourse,
        interviews,
        lessonProgress,
        hasAnyBooking,
      },
    };
  }
}
