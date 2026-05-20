import { supabase } from "../lib/supabase.js";

async function getLessonIdsByCourseId(courseId) {
  if (!courseId) return [];

  const { data, error } = await supabase
    .from("lessons")
    .select("lesson_id")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return (data || []).map((lesson) => lesson.lesson_id).filter(Boolean);
}

// LESSONS
export async function fetchLessons(courseId = null) {
  let query = supabase
    .from("lessons")
    .select("*")
    .order("order_index", { ascending: true });

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// LESSON TOPICS
export async function fetchLessonTopics(courseId = null) {
  let query = supabase
    .from("lesson_topics")
    .select("*");

  if (courseId) {
    const lessonIds = await getLessonIdsByCourseId(courseId);
    if (!lessonIds.length) return [];
    query = query.in("lesson_id", lessonIds);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function fetchLessonTopicMaterials(courseId = null) {
  let query = supabase
    .from("lesson_topic_materials")
    .select("*")
    .order("order_index", { ascending: true });

  if (courseId) {
    const lessonIds = await getLessonIdsByCourseId(courseId);
    if (!lessonIds.length) return [];

    const { data: topics, error: topicsError } = await supabase
      .from("lesson_topics")
      .select("topic_id, lesson_id")
      .in("lesson_id", lessonIds);

    if (topicsError) throw topicsError;
    const topicIds = (topics || []).map((topic) => topic.topic_id).filter(Boolean);
    if (!topicIds.length) return [];
    query = query.in("topic_id", topicIds);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// CHECKPOINTS
export async function fetchCheckpoints(courseId = null) {
  let query = supabase
    .from("checkpoints")
    .select("*");

  if (courseId) {
    query = query.eq("course_id", courseId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

async function getStudentIdByUid(uid) {
  if (!uid) return null;

  const { data, error } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (error) throw error;
  return data?.s_id || null;
}

async function getBookingIdsByStudentId(studentId) {
  if (!studentId) return [];

  const { data, error } = await supabase
    .from("booking")
    .select("booking_id")
    .eq("s_id", studentId);

  if (error) throw error;
  return (data || []).map((booking) => booking.booking_id).filter(Boolean);
}

async function fetchCheckpointProgressRowsByStudentId(studentId, courseId = null) {
  if (!studentId) return [];

  let query = supabase
    .from("checkpoints_progress")
    .select(`
      id,
      checkpoint_id,
      s_id,
      status,
      completed,
      completed_at,
      session_id,
      created_at,
      session:session_id (
        session_id,
        start_time,
        end_time,
        marked_by_teacher
      )
    `)
    .eq("s_id", studentId)
    .order("created_at", { ascending: false });

  if (courseId) {
    const checkpointIds = await getCheckpointIdsByCourseId(courseId);
    if (!checkpointIds.length) return [];
    query = query.in("checkpoint_id", checkpointIds);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

async function getCheckpointIdsByCourseId(courseId) {
  if (!courseId) return [];

  const { data, error } = await supabase
    .from("checkpoints")
    .select("checkpoint_id")
    .eq("course_id", courseId)
    .order("checkpoint_id", { ascending: true });

  if (error) throw error;
  return (data || []).map((checkpoint) => checkpoint.checkpoint_id).filter(Boolean);
}

export async function fetchCheckpointProgressByUid(uid, courseId = null) {
  const studentId = await getStudentIdByUid(uid);
  if (!studentId) return [];

  return fetchCheckpointProgressRowsByStudentId(studentId, courseId);
}

export async function fetchCheckpointProgressByStudentId(studentId, courseId = null) {
  return fetchCheckpointProgressRowsByStudentId(studentId, courseId);
}

export async function fetchInterviews(courseId = null) {
  let query = supabase
    .from("interviews")
    .select("interview_id, created_at, title, desc")
    .order("interview_id", { ascending: true });

  // interviews are global for now, but courseId is accepted for a consistent API
  if (courseId) {
    query = query;
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchInterviewProgressByUid(uid, courseId = null) {
  const studentId = await getStudentIdByUid(uid);
  if (!studentId) return [];

  const bookingIds = await getBookingIdsByStudentId(studentId);
  if (!bookingIds.length) return [];

  const [{ data: sessions, error: sessionsError }, { data: interviewMeta, error: metaError }] =
    await Promise.all([
      supabase
        .from("session")
        .select("session_id, booking_id, title, start_time, end_time, status, t_id, marked_by_teacher, session_type")
        .in("booking_id", bookingIds)
        .eq("session_type", "interview")
        .order("created_at", { ascending: false }),
      supabase
        .from("interview_sessions")
        .select(`
          interview_sessions_id,
          created_at,
          session_id,
          notes,
          interview_id,
          session:session_id (
            session_id,
            start_time,
            end_time,
            status,
            marked_by_teacher,
            booking_id
          )
        `)
        .order("created_at", { ascending: false }),
    ]);

  if (sessionsError) throw sessionsError;
  if (metaError) throw metaError;

  const sessionsById = Object.fromEntries((sessions || []).map((row) => [row.session_id, row]));
  const rows = (interviewMeta || [])
    .filter((row) => row.session && bookingIds.includes(row.session.booking_id))
    .map((row) => {
      const session = row.session || null;
      const combined = sessionsById[row.session_id] || session || null;
      return {
        interview_sessions_id: row.interview_sessions_id,
        interview_id: row.interview_id,
        session_id: row.session_id,
        notes: row.notes,
        completed: combined?.marked_by_teacher === true || (combined?.end_time ? new Date(combined.end_time) <= new Date() : false),
        completed_at: combined?.end_time || null,
        status: combined?.marked_by_teacher === true
          ? "COMPLETED"
          : combined?.end_time && new Date(combined.end_time) > new Date()
          ? "AWAITING_COMPLETION"
          : "BOOKED",
        session: combined,
      };
    });

  if (courseId) {
    // accepted for consistency; interview roadmap currently global
    return rows;
  }

  return rows;
}

export async function getCheckpointBookingStatus(checkpointId, uid = null, courseId = null) {
  if (!checkpointId) {
    throw new Error("checkpointId is required");
  }

  const { data, error } = await supabase
    .from("checkpoints")
    .select(`
      checkpoint_id,
      title,
      description,
      requires_teacher,
      order_index,
      course_id
    `)
    .eq("checkpoint_id", checkpointId)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error("Checkpoint not found");
  }

  if (courseId && Number(data.course_id) !== Number(courseId)) {
    throw new Error("Checkpoint does not belong to the requested course");
  }

  if (!uid) {
    return {
      checkpointId: data.checkpoint_id,
      title: data.title,
      status: "AVAILABLE",
      canBook: true,
      disableReason: null,
      cooldownEndsAt: null,
      checkpoint: data,
      progress: null,
    };
  }

  const studentId = await getStudentIdByUid(uid);
  if (!studentId) {
    return {
      checkpointId: data.checkpoint_id,
      title: data.title,
      status: "AVAILABLE",
      canBook: true,
      disableReason: null,
      cooldownEndsAt: null,
      checkpoint: data,
      progress: null,
    };
  }

  const progressRows = await fetchCheckpointProgressRowsByStudentId(studentId, courseId);
  const latestProgress = progressRows.find(
    (row) => Number(row.checkpoint_id) === Number(checkpointId)
  ) || null;
  const session = latestProgress?.session || null;
  const now = new Date();
  const endTime = session?.end_time ? new Date(session.end_time) : null;
  const markedByTeacher = session?.marked_by_teacher === true;
  const cooldownEndsAt = endTime
    ? new Date(endTime.getTime() + 24 * 60 * 60 * 1000)
    : null;

  if (!latestProgress) {
    return {
      checkpointId: data.checkpoint_id,
      title: data.title,
      sessionId: null,
      status: "AVAILABLE",
      canBook: true,
      disableReason: null,
      cooldownEndsAt: null,
      checkpoint: data,
      progress: null,
    };
  }

  if (latestProgress.completed === true || markedByTeacher) {
    return {
      checkpointId: data.checkpoint_id,
      title: data.title,
      sessionId: session?.session_id || latestProgress.session_id || null,
      status: "COMPLETED",
      canBook: false,
      disableReason: "Checkpoint already completed.",
      cooldownEndsAt: null,
      checkpoint: data,
      progress: latestProgress,
    };
  }

  if (!endTime || endTime > now) {
    return {
      checkpointId: data.checkpoint_id,
      title: data.title,
      sessionId: session?.session_id || latestProgress.session_id || null,
      status: "AWAITING_COMPLETION",
      canBook: false,
      disableReason: "You already have a checkpoint session pending completion.",
      cooldownEndsAt: endTime ? endTime.toISOString() : null,
      checkpoint: data,
      progress: latestProgress,
    };
  }

  if (cooldownEndsAt && now < cooldownEndsAt) {
    return {
      checkpointId: data.checkpoint_id,
      title: data.title,
      sessionId: session?.session_id || latestProgress.session_id || null,
      status: "COOLDOWN",
      canBook: false,
      disableReason: "You can book another class for this checkpoint one day after the previous session expires.",
      cooldownEndsAt: cooldownEndsAt.toISOString(),
      checkpoint: data,
      progress: latestProgress,
    };
  }

  return {
    checkpointId: data.checkpoint_id,
    title: data.title,
    sessionId: session?.session_id || latestProgress.session_id || null,
    status: "REBOOK_ALLOWED",
    canBook: true,
    disableReason: null,
    cooldownEndsAt: cooldownEndsAt ? cooldownEndsAt.toISOString() : null,
    checkpoint: data,
    progress: latestProgress,
  };
}

export async function getLessonById(lessonId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("lesson_id, title, order_index, status")
    .eq("lesson_id", lessonId)
    .single();

  if (error) {
    console.error("getLessonById error:", error.message);
    return null;
  }

  return data;
}

export async function fetchLessonProgressByUid(uid) {
  if (!uid) return [];

  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!studentRow?.s_id) return [];

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("s_id", studentRow.s_id);

  if (error) throw error;
  return data || [];
}

export async function attachSessionToCheckpoint({ checkpointId, studentId, sessionId }) {
  if (!checkpointId || !studentId || !sessionId) {
    throw new Error("checkpointId, studentId and sessionId are required");
  }

  const { data: existing, error: existingError } = await supabase
    .from("checkpoints_progress")
    .select("id")
    .eq("checkpoint_id", checkpointId)
    .eq("s_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const payload = {
    checkpoint_id: checkpointId,
    s_id: studentId,
    session_id: sessionId,
    status: "BOOKED",
    completed: false,
    completed_at: null,
  };

  if (existing?.id) {
    const { data, error } = await supabase
      .from("checkpoints_progress")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("checkpoints_progress")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function attachSessionToInterview({ interviewId, studentId, sessionId, notes = null }) {
  if (!interviewId || !studentId || !sessionId) {
    throw new Error("interviewId, studentId and sessionId are required");
  }

  const { data: existing, error: existingError } = await supabase
    .from("interview_sessions")
    .select("interview_sessions_id, session_id, interview_id, session:session_id ( booking_id )")
    .eq("interview_id", interviewId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const payload = {
    interview_id: interviewId,
    session_id: sessionId,
    notes,
  };

  if (existing?.interview_sessions_id) {
    const { data, error } = await supabase
      .from("interview_sessions")
      .update(payload)
      .eq("interview_sessions_id", existing.interview_sessions_id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("interview_sessions")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
