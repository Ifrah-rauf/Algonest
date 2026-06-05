import { supabase } from "../lib/supabase.js";

const SESSION_VALUE = 4000;

function parseImageDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const base64 = match[2];
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(mimeType)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed");
  }

  return {
    mimeType,
    buffer: Buffer.from(base64, "base64"),
    extension: mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg",
  };
}

async function uploadTeacherProfilePicture({ uid, pfp, username }) {
  const cleanPfp = String(pfp || "").trim();
  if (!cleanPfp) return null;

  if (/^https?:\/\//i.test(cleanPfp)) {
    return cleanPfp;
  }

  const parsed = parseImageDataUrl(cleanPfp);
  if (!parsed) {
    throw new Error("Profile picture must be a valid image URL or data URL");
  }

  const storagePath = `teacher_profile_pics/${uid}/${Date.now()}-${String(username || "teacher")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)}.${parsed.extension}`;

  const { error: uploadError } = await supabase.storage
    .from("teacher_profile_pics")
    .upload(storagePath, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return supabase.storage.from("teacher_profile_pics").getPublicUrl(storagePath).data.publicUrl;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfNextMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function startOfPreviousMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function endOfPreviousMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

async function getTeacherByUid(uid) {
  const { data, error } = await supabase
    .from("teacher")
    .select(`
      t_id,
      uid,
      name,
      bio,
      education,
      teaching_style,
      rating,
      video_url,
      pfp,
      timezone,
      verified,
      specialisation_id,
      experience,
      meeting_link,
      language_id,
      frameworks_id,
      teacher_certificates,
      specialisation:specialisation ( sp1, sp2, sp3, sp4 ),
      languages:languages ( l1, l2, l3, l4 ),
      frameworks:frameworks ( f1, f2, f3 )
    `)
    .eq("uid", uid)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Teacher not found");
  return data;
}

async function getTeacherCertificateRow(certificateId) {
  if (!certificateId) return null;

  const { data, error } = await supabase
    .from("teacher_certificates")
    .select("id, created_at, certificate_name, approved, storage_path")
    .eq("id", certificateId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const publicUrl = data.storage_path
    ? supabase.storage.from("teacher_certificates").getPublicUrl(data.storage_path).data.publicUrl
    : null;

  return {
    ...data,
    file_url: publicUrl,
  };
}

async function getTeacherSessions(t_id) {
  const { data, error } = await supabase
    .from("session")
    .select("session_id, booking_id, start_time, end_time, status, marked_by_teacher")
    .eq("t_id", t_id)
    .order("start_time", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getBookingsByIds(bookingIds) {
  if (!bookingIds.length) return [];

  const { data, error } = await supabase
    .from("booking")
    .select("booking_id, s_id, plan_id, booking_date, expiry_date, remainingsessions, course_id")
    .in("booking_id", bookingIds);

  if (error) throw error;
  return data || [];
}

async function getStudentsByIds(studentIds) {
  if (!studentIds.length) return [];

  const { data, error } = await supabase
    .from("student")
    .select("s_id, uid, name")
    .in("s_id", studentIds);

  if (error) throw error;
  return data || [];
}

async function getCoursesByIds(courseIds) {
  if (!courseIds.length) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("course_id, title, description, domain, status")
    .in("course_id", courseIds);

  if (error) throw error;
  return data || [];
}

async function getTeacherCourseMapping(t_id) {
  if (!t_id) return [];

  const { data, error } = await supabase
    .from("course_teacher_mapping")
    .select("id, created_at, t_id, course_id")
    .eq("t_id", t_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getRoadmapProgressByCourseIds(courseIds) {
  if (!courseIds.length) return { active: [], completed: [], all: [] };

  const [{ data: lessons, error: lessonsError }, { data: bookings, error: bookingsError }] =
    await Promise.all([
      supabase
        .from("lessons")
        .select("lesson_id, course_id, title, order_index")
        .in("course_id", courseIds)
        .order("order_index", { ascending: true }),
      supabase
        .from("booking")
        .select("booking_id, s_id, course_id, booking_date, expiry_date, remainingsessions")
        .in("course_id", courseIds),
    ]);

  if (lessonsError) throw lessonsError;
  if (bookingsError) throw bookingsError;

  const lessonList = lessons || [];
  const bookingList = bookings || [];
  const studentIds = [...new Set(bookingList.map((booking) => booking.s_id).filter(Boolean))];
  const lessonIds = [...new Set(lessonList.map((lesson) => lesson.lesson_id).filter(Boolean))];

  const [{ data: students, error: studentError }, { data: progressRows, error: progressError }] =
    await Promise.all([
      studentIds.length
        ? supabase
            .from("student")
            .select("s_id, uid, name")
            .in("s_id", studentIds)
        : Promise.resolve({ data: [] }),
      studentIds.length && lessonIds.length
        ? supabase
            .from("lesson_progress")
            .select("s_id, lesson_id, completed")
            .in("s_id", studentIds)
            .in("lesson_id", lessonIds)
        : Promise.resolve({ data: [] }),
    ]);

  if (studentError) throw studentError;
  if (progressError) throw progressError;

  const studentById = Object.fromEntries((students || []).map((student) => [student.s_id, student]));
  const lessonsByCourseId = lessonList.reduce((acc, lesson) => {
    if (!acc[lesson.course_id]) acc[lesson.course_id] = [];
    acc[lesson.course_id].push(lesson);
    return acc;
  }, {});
  const progressByStudent = (progressRows || []).reduce((acc, row) => {
    if (!acc[row.s_id]) acc[row.s_id] = {};
    acc[row.s_id][row.lesson_id] = row;
    return acc;
  }, {});

  const courseStats = courseIds.map((courseId) => {
    const lessonsForCourse = lessonsByCourseId[courseId] || [];
    const courseBookings = bookingList.filter((booking) => booking.course_id === courseId);

    const studentProgress = courseBookings.map((booking) => {
      const student = studentById[booking.s_id] || {};
      const completedLessons = lessonsForCourse.filter(
        (lesson) => progressByStudent[booking.s_id]?.[lesson.lesson_id]?.completed
      ).length;
      const totalLessons = lessonsForCourse.length;
      const progressPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
      const status = totalLessons && progressPct >= 100 ? "completed" : "active";

      return {
        booking_id: booking.booking_id,
        s_id: booking.s_id,
        studentName: student.name || "Student",
        completedLessons,
        totalLessons,
        progressPct,
        status,
        booking_date: booking.booking_date,
        expiry_date: booking.expiry_date,
        remainingsessions: booking.remainingsessions,
      };
    });

    const activeStudents = studentProgress.filter((item) => item.status === "active");
    const completedStudents = studentProgress.filter((item) => item.status === "completed");
    const averageProgress = studentProgress.length
      ? Math.round(studentProgress.reduce((sum, item) => sum + item.progressPct, 0) / studentProgress.length)
      : 0;

    return {
      courseId,
      totalStudents: studentProgress.length,
      activeStudents: activeStudents.length,
      completedStudents: completedStudents.length,
      averageProgress,
      students: studentProgress.sort((a, b) => a.progressPct - b.progressPct),
    };
  });

  return {
    all: courseStats,
    active: courseStats
      .filter((course) => course.activeStudents > 0)
      .sort((a, b) => b.activeStudents - a.activeStudents || b.averageProgress - a.averageProgress),
    completed: courseStats
      .filter((course) => course.activeStudents === 0 && course.completedStudents > 0)
      .sort((a, b) => b.completedStudents - a.completedStudents || b.averageProgress - a.averageProgress),
  };
}

function toISODate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthLabel(date) {
  return date.toLocaleDateString("en-IN", { month: "short" });
}

export async function getTeacherOverviewByUid(uid) {
  const teacher = await getTeacherByUid(uid);
  const sessions = await getTeacherSessions(teacher.t_id);
  const bookingIds = [...new Set(sessions.map((session) => session.booking_id).filter(Boolean))];
  const bookings = await getBookingsByIds(bookingIds);
  const studentIds = [...new Set(bookings.map((booking) => booking.s_id).filter(Boolean))];
  const students = await getStudentsByIds(studentIds);
  const courseMappings = await getTeacherCourseMapping(teacher.t_id);
  // Merge course IDs from both bookings and courseMappings
  const allCourseIds = [
    ...new Set([
      ...bookings.map((booking) => booking.course_id).filter(Boolean),
      ...courseMappings.map((mapping) => mapping.course_id).filter(Boolean),
    ]),
  ];
  const courses = await getCoursesByIds(allCourseIds);
  const courseById = Object.fromEntries(courses.map((course) => [course.course_id, course]));
  const roadmapProgress = await getRoadmapProgressByCourseIds(courseMappings.map((mapping) => mapping.course_id).filter(Boolean));

  const now = new Date();
  const monthStart = startOfMonth(now);
  const nextMonthStart = startOfNextMonth(now);
  const prevMonthStart = startOfPreviousMonth(now);
  const prevMonthEnd = endOfPreviousMonth(now);

  const currentMonthBookings = bookings.filter((booking) => {
    const bookingDate = toISODate(booking.booking_date);
    return bookingDate && bookingDate >= monthStart && bookingDate < nextMonthStart;
  });

  const previousMonthBookings = bookings.filter((booking) => {
    const bookingDate = toISODate(booking.booking_date);
    return bookingDate && bookingDate >= prevMonthStart && bookingDate < prevMonthEnd;
  });

  const activeBookings = bookings.filter((booking) => {
    const expiry = toISODate(booking.expiry_date);
    return expiry && expiry >= now && Number(booking.remainingsessions || 0) > 0;
  });

  const completedSessions = sessions.filter((session) => {
    const end = toISODate(session.end_time);
    return session.marked_by_teacher === true && end && end <= now;
  }).length;

  const completionRate = sessions.length
    ? Math.round((completedSessions / sessions.length) * 100)
    : 0;

  const monthlyEarnings = currentMonthBookings.length * SESSION_VALUE;
  const previousMonthEarnings = previousMonthBookings.length * SESSION_VALUE;
  const totalEarnings = bookings.length * SESSION_VALUE;
  const activeRoadmaps = roadmapProgress.active.length;
  const latestStudentNames = students.slice(0, 5).map((student) => student.name).filter(Boolean);
  const planNames = [...new Set(
    courses
      .map((course) => course.title)
      .filter(Boolean)
  )].slice(0, 4);

  return {
    teacher: {
      t_id: teacher.t_id,
      uid: teacher.uid,
      name: teacher.name,
    },
    metrics: {
      totalStudents: students.length,
      activeRoadmaps,
      monthlyEarnings,
      previousMonthEarnings,
      totalEarnings,
      completionRate,
      currentMonthBookings: currentMonthBookings.length,
      activeBookings: activeBookings.length,
      completedSessions,
    },
    highlights: {
      monthLabel: monthLabel(now),
      topStudents: latestStudentNames,
      planNames,
      courses: courseMappings.map((mapping) => ({
        id: mapping.id,
        course_id: mapping.course_id,
        title: courseById[mapping.course_id]?.title || "Untitled course",
        description: courseById[mapping.course_id]?.description || "",
        domain: courseById[mapping.course_id]?.domain || "",
        status: courseById[mapping.course_id]?.status || "active",
        created_at: mapping.created_at,
      })),
    },
    roadmapProgress,
  };
}

export async function getTeacherProfileByUid(uid) {
  const teacher = await getTeacherByUid(uid);
  const certificate = await getTeacherCertificateRow(teacher.teacher_certificates);

  return {
    teacher,
    certificate,
  };
}

export async function updateTeacherProfileByUid(uid, updates) {
  const allowedFields = [
    "name",
    "bio",
    "education",
    "teaching_style",
    "video_url",
    "pfp",
    "timezone",
    "experience",
    "meeting_link",
    "specialisation_id",
    "language_id",
    "frameworks_id",
  ];

  const payload = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      payload[field] = updates[field];
    }
  });

  if (!Object.keys(payload).length) {
    throw new Error("No valid profile fields provided");
  }

  // Handle profile picture upload if provided
  if (payload.pfp) {
    const uploadedPfp = await uploadTeacherProfilePicture({
      uid,
      pfp: payload.pfp,
      username: payload.name || updates.name || "teacher",
    });
    payload.pfp = uploadedPfp || payload.pfp;
  }

  const { data, error } = await supabase
    .from("teacher")
    .update(payload)
    .eq("uid", uid)
    .select(`
      t_id,
      uid,
      name,
      bio,
      education,
      teaching_style,
      rating,
      video_url,
      pfp,
      timezone,
      verified,
      specialisation_id,
      experience,
      meeting_link,
      language_id,
      frameworks_id,
      teacher_certificates
    `)
    .single();

  if (error) throw error;
  return data;
}

function parseCertificateDataUrl(dataUrl) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
    throw new Error("certificateFile must be a data URL");
  }

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid certificate file format");
  }

  const mimeType = match[1];
  const base64 = match[2];

  if (!["image/jpeg", "image/png"].includes(mimeType)) {
    throw new Error("Only JPG and PNG certificate files are allowed");
  }

  return {
    mimeType,
    buffer: Buffer.from(base64, "base64"),
    extension: mimeType === "image/png" ? "png" : "jpg",
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "certificate";
}

export async function createTeacherCertificateByUid(uid, certificateName, certificateFile, certificateFileName = null) {
  const teacher = await getTeacherByUid(uid);
  if (!certificateFile) {
    throw new Error("certificateFile is required");
  }

  const resolvedName = certificateName?.trim() || certificateFileName || "Certificate";
  const parsedFile = parseCertificateDataUrl(certificateFile);
  const storagePath = `teacher_certificates/${teacher.uid}/${Date.now()}-${slugify(resolvedName)}.${parsedFile.extension}`;

  const { error: uploadError } = await supabase.storage
    .from("teacher_certificates")
    .upload(storagePath, parsedFile.buffer, {
      contentType: parsedFile.mimeType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const certPayload = {
    certificate_name: resolvedName,
    storage_path: storagePath,
    approved: false,
  };

  const { data: cert, error: certError } = await supabase
    .from("teacher_certificates")
    .insert([certPayload])
    .select("id, created_at, certificate_name, storage_path, approved")
    .single();

  if (certError) throw certError;

  const { error: updateError } = await supabase
    .from("teacher")
    .update({ teacher_certificates: cert.id })
    .eq("t_id", teacher.t_id);

  if (updateError) throw updateError;
  const publicUrl = cert.storage_path
    ? supabase.storage.from("teacher_certificates").getPublicUrl(cert.storage_path).data.publicUrl
    : null;
  return {
    ...cert,
    file_url: publicUrl,
  };
}

export async function approveTeacherCertificateByUid(uid, certificateId) {
  if (!certificateId) throw new Error("certificateId is required");

  const teacher = await getTeacherByUid(uid);
  if (teacher.teacher_certificates !== Number(certificateId)) {
    throw new Error("This certificate does not belong to the teacher");
  }

  const { data, error } = await supabase
    .from("teacher_certificates")
    .update({ approved: true })
    .eq("id", certificateId)
    .select("id, created_at, certificate_name, storage_path, approved")
    .single();

  if (error) throw error;
  const publicUrl = data.storage_path
    ? supabase.storage.from("teacher_certificates").getPublicUrl(data.storage_path).data.publicUrl
    : null;
  return {
    ...data,
    file_url: publicUrl,
  };
}

export async function getTeacherEarningsByUid(uid) {
  const teacher = await getTeacherByUid(uid);
  const sessions = await getTeacherSessions(teacher.t_id);
  const bookingIds = [...new Set(sessions.map((session) => session.booking_id).filter(Boolean))];
  const bookings = await getBookingsByIds(bookingIds);
  const studentIds = [...new Set(bookings.map((booking) => booking.s_id).filter(Boolean))];
  const students = await getStudentsByIds(studentIds);
  const courses = await getCoursesByIds([...new Set(bookings.map((booking) => booking.course_id).filter(Boolean))]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => {
    const monthStart = new Date(currentYear, index, 1);
    const monthEnd = new Date(currentYear, index + 1, 1);
    const count = bookings.filter((booking) => {
      const bookingDate = toISODate(booking.booking_date);
      return bookingDate && bookingDate >= monthStart && bookingDate < monthEnd;
    }).length;

    return {
      month: monthLabel(monthStart),
      earnings: count * SESSION_VALUE,
      bookings: count,
    };
  });

  const currentMonthIndex = now.getMonth();
  const previousMonthIndex = (currentMonthIndex + 11) % 12;
  const currentMonth = months[currentMonthIndex];
  const previousMonth = months[previousMonthIndex];

  const currentMonthBookings = bookings
    .filter((booking) => {
      const bookingDate = toISODate(booking.booking_date);
      return bookingDate && bookingDate >= startOfMonth(now) && bookingDate < startOfNextMonth(now);
    })
    .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

  const recentTransactions = currentMonthBookings.map((booking) => {
    const student = students.find((item) => item.s_id === booking.s_id);
    const course = courses.find((item) => item.course_id === booking.course_id);

    return {
      id: booking.booking_id,
      roadmap: course?.title || "Mentor Session",
      student: student?.name || "Student",
      date: booking.booking_date,
      amount: SESSION_VALUE,
    };
  });

  const yearlyTotal = months.reduce((sum, row) => sum + row.earnings, 0);

  return {
    teacher: {
      t_id: teacher.t_id,
      name: teacher.name,
    },
    currentMonth: {
      label: monthLabel(now),
      earnings: currentMonth.earnings,
      bookings: currentMonth.bookings,
      change: previousMonth.earnings
        ? Math.round(((currentMonth.earnings - previousMonth.earnings) / previousMonth.earnings) * 100)
        : null,
    },
    yearlyTotal,
    monthlyData: months,
    recentTransactions,
    sessionValue: SESSION_VALUE,
  };
}

export async function getTeacherCoursesByUid(uid) {
  const teacher = await getTeacherByUid(uid);
  const courseMappings = await getTeacherCourseMapping(teacher.t_id);
  const courses = await getCoursesByIds([...new Set(courseMappings.map((mapping) => mapping.course_id).filter(Boolean))]);
  const courseById = Object.fromEntries(courses.map((course) => [course.course_id, course]));

  return courseMappings.map((mapping) => {
    const course = courseById[mapping.course_id] || {};
    return {
      mapping_id: mapping.id,
      t_id: mapping.t_id,
      course_id: mapping.course_id,
      title: course.title || "Untitled course",
      description: course.description || "",
      domain: course.domain || "",
      status: course.status || "active",
      created_at: mapping.created_at,
    };
  });
}
