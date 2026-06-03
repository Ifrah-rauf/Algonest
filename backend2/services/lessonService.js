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

async function getLessonInsertContext(lessonId) {
  const numericLessonId = Number(lessonId);
  if (!numericLessonId || Number.isNaN(numericLessonId)) {
    throw new Error("Valid lessonId is required");
  }

  const { data, error } = await supabase
    .from("lessons")
    .select("lesson_id, course_id")
    .eq("lesson_id", numericLessonId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.lesson_id) throw new Error("Lesson not found");

  return {
    lessonId: Number(data.lesson_id),
    courseId: data.course_id == null ? null : Number(data.course_id),
  };
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

  if (error?.code === "42P01") return [];
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

    if (topicsError?.code === "42P01") return [];
    if (topicsError) throw topicsError;
    const topicIds = (topics || []).map((topic) => topic.topic_id).filter(Boolean);
    if (!topicIds.length) return [];
    query = query.in("topic_id", topicIds);
  }

  const { data, error } = await query;

  if (error?.code === "42P01") return [];
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

async function resolveStudentId(userId) {
  if (!userId) return null;

  const numericId = Number(userId);
  if (Number.isInteger(numericId) && numericId > 0) {
    const { data, error } = await supabase
      .from("student")
      .select("s_id")
      .eq("s_id", numericId)
      .maybeSingle();

    if (error) throw error;
    if (data?.s_id) return data.s_id;
  }

  return getStudentIdByUid(userId);
}

function parseMaybeJson(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function normalizeRequirementKeys(value, textField = "question") {
  const parsed = parseMaybeJson(value, []);

  if (Array.isArray(parsed)) {
    return parsed
      .map((item, index) => {
        if (typeof item === "string") return item;
        return item?.[textField] || item?.question || item?.q || item?.prompt || item?.p || item?.asset || item?.task || item?.proof || item?.text || item?.label || item?.key || item?.id || item?.asset_key || item?.question_key || `item_${index + 1}`;
      })
      .filter(Boolean)
      .map(String);
  }

  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed)
      .map(([key, item], index) => {
        if (typeof item === "string") return item || key || `item_${index + 1}`;
        return item?.[textField] || item?.question || item?.q || item?.prompt || item?.p || item?.asset || item?.task || item?.proof || item?.text || item?.label || item?.key || item?.id || item?.asset_key || item?.question_key || key || `item_${index + 1}`;
      })
      .filter(Boolean)
      .map(String);
  }

  return [];
}

function objectOrEmpty(value) {
  const parsed = parseMaybeJson(value, null);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function firstNonEmptyValue(...values) {
  for (const value of values) {
    const parsed = parseMaybeJson(value, value);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) return parsed;
    if (typeof parsed === "string" && parsed.trim()) return parsed;
  }

  return null;
}

function collectNestedValues(root, targetKeys) {
  const parsed = parseMaybeJson(root, root);
  const matches = [];
  const keySet = new Set(targetKeys);

  function visit(value) {
    if (!value || typeof value !== "object") return;

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    Object.entries(value).forEach(([key, child]) => {
      if (keySet.has(key) && child != null) {
        matches.push(child);
      }
      if (child && typeof child === "object") {
        visit(child);
      }
    });
  }

  visit(parsed);
  return matches;
}

function firstNestedNonEmpty(root, keys) {
  return firstNonEmptyValue(...collectNestedValues(root, keys));
}

function hasCommitRequirement(lessonRow, structuredSources) {
  const contentSchema = objectOrEmpty(lessonRow.content_schema);
  const lessonStructure = objectOrEmpty(lessonRow.lesson_structure);
  const structuredContent = objectOrEmpty(lessonRow.structured_content);
  const merged = {
    ...contentSchema,
    ...lessonStructure,
    ...structuredContent,
  };

  const commitValue = firstNonEmptyValue(
    lessonRow.commit_deliverable,
    lessonRow.deliverable,
    lessonRow.micro_proof,
    merged.commitDeliverable,
    merged.commit_deliverable,
    merged.deliverable,
    merged.commit,
    merged.microProof,
    merged.micro_proof,
    merged.proof,
    firstNestedNonEmpty(structuredSources, [
      "commitDeliverable",
      "commit_deliverable",
      "deliverable",
      "microProof",
      "micro_proof",
      "proof"
    ])
  );

  return Boolean(commitValue);
}

async function getLessonRequirementKeys(lessonId) {
  const { data, error } = await supabase
    .from("lessons")
    .select("structured_content, lesson_structure, content_schema, ai_industry_questions, guided_assets, ai_companion_tasks, deliverable, commit_deliverable, micro_proof")
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { aiQuestionKeys: [], assetKeys: [], commitRequired: false };

  const contentSchema = objectOrEmpty(data.content_schema);
  const lessonStructure = objectOrEmpty(data.lesson_structure);
  const structuredContent = objectOrEmpty(data.structured_content);
  const structured = {
    ...contentSchema,
    ...lessonStructure,
    ...structuredContent,
  };
  const structuredSources = [
    data.structured_content,
    data.lesson_structure,
    data.content_schema,
    structured,
  ];

  const aiQuestionKeys = normalizeRequirementKeys(
    firstNonEmptyValue(
      data.ai_industry_questions,
      structured.aiIndustryQuestions,
      structured.ai_industry_questions,
      structured.industryQuestions,
      structured.industry_questions,
      structured.aiQuestions,
      structured.ai_questions,
      structured.questions,
      firstNestedNonEmpty(structuredSources, [
        "aiIndustryQuestions",
        "ai_industry_questions",
        "industryQuestions",
        "industry_questions",
        "aiQuestions",
        "ai_questions",
        "questions",
        "q"
      ])
    ),
    "question"
  );
  const assetKeys = normalizeRequirementKeys(
    firstNonEmptyValue(
      data.guided_assets,
      structured.guidedEvaluations,
      structured.guided_evaluations,
      structured.guidedAssets,
      structured.guided_assets,
      structured.assets,
      structured.evaluations,
      structured.guidedTrack,
      structured.guided_track,
      firstNestedNonEmpty(structuredSources, [
        "guidedEvaluations",
        "guided_evaluations",
        "guidedAssets",
        "guided_assets",
        "guidedTrack",
        "guided_track",
        "assets",
        "evaluations",
        "prompts"
      ])
    ),
    "prompt"
  );
  return {
    aiQuestionKeys,
    assetKeys,
    commitRequired: hasCommitRequirement(data, structuredSources),
  };
}
async function upsertProgressReadyState(studentId, lessonId, readyToUnlock) {
  const { data: existing, error: existingError } = await supabase
    .from("lesson_progress")
    .select("progress_id")
    .eq("s_id", studentId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.progress_id) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .update({ ready_to_unlock: readyToUnlock })
      .eq("progress_id", existing.progress_id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("lesson_progress")
    .insert({
      s_id: studentId,
      lesson_id: lessonId,
      completed: false,
      quiz_attempt: false,
      ready_to_unlock: readyToUnlock,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function checkUnlock(studentId, lessonId) {
  if (!studentId || !lessonId) {
    throw new Error("studentId and lessonId are required");
  }

  const numericLessonId = Number(lessonId);
  const { aiQuestionKeys, assetKeys, commitRequired } = await getLessonRequirementKeys(numericLessonId);

  let aiTotal = aiQuestionKeys.length;
  let aiCompleted = 0;
  let assetTotal = assetKeys.length;
  let assetAnswered = 0;
  const commitTotal = commitRequired ? 1 : 0;
  let commitVerified = 0;

  if (aiTotal > 0) {
    const { data, error } = await supabase
      .from("lesson_ai_questions")
      .select("question_key, completed")
      .eq("user_id", studentId)
      .eq("lesson_id", numericLessonId)
      .in("question_key", aiQuestionKeys);

    if (error) throw error;
    aiCompleted = new Set((data || []).filter((row) => row.completed === true).map((row) => row.question_key)).size;
  } else {
    const { data, error } = await supabase
      .from("lesson_ai_questions")
      .select("question_key, completed")
      .eq("user_id", studentId)
      .eq("lesson_id", numericLessonId);

    if (error) throw error;
    aiTotal = new Set((data || []).map((row) => row.question_key || row.id)).size;
    aiCompleted = new Set((data || []).filter((row) => row.completed === true).map((row) => row.question_key || row.id)).size;
  }

  if (assetTotal > 0) {
    const { data, error } = await supabase
      .from("lesson_asset_progress")
      .select("asset_key, answered")
      .eq("user_id", studentId)
      .eq("lesson_id", numericLessonId)
      .in("asset_key", assetKeys);

    if (error) throw error;
    assetAnswered = new Set((data || []).filter((row) => row.answered === true).map((row) => row.asset_key)).size;
  } else {
    const { data, error } = await supabase
      .from("lesson_asset_progress")
      .select("asset_key, answered")
      .eq("user_id", studentId)
      .eq("lesson_id", numericLessonId);

    if (error) throw error;
    assetTotal = new Set((data || []).map((row) => row.asset_key || row.id)).size;
    assetAnswered = new Set((data || []).filter((row) => row.answered === true).map((row) => row.asset_key || row.id)).size;
  }

  if (commitRequired) {
    const { data, error } = await supabase
      .from("lesson_commit_proofs")
      .select("id")
      .eq("user_id", studentId)
      .eq("lesson_id", numericLessonId)
      .eq("verified", true)
      .limit(1);

    if (error) throw error;
    commitVerified = data?.length ? 1 : 0;
  }

  const hasRequirements = aiTotal + assetTotal + commitTotal > 0;
  const readyToUnlock =
    hasRequirements &&
    (aiTotal === 0 || aiCompleted >= aiTotal) &&
    (assetTotal === 0 || assetAnswered >= assetTotal) &&
    (commitTotal === 0 || commitVerified >= commitTotal);

  const progress = await upsertProgressReadyState(studentId, numericLessonId, readyToUnlock);

  return {
    readyToUnlock,
    aiQuestions: { total: aiTotal, completed: aiCompleted },
    assets: { total: assetTotal, answered: assetAnswered },
    commit: { total: commitTotal, verified: commitVerified },
    progress,
  };
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
    .select(`
      lesson_id,
      title,
      order_index,
      status,
      prerequisite_id,
      checkpoint_id,
      course_id,
      p_type,
      structured_content,
      lesson_structure,
      content_schema,
      static_topics,
      ai_industry_questions,
      guided_assets,
      ai_companion_tasks,
      deliverable,
      commit_deliverable,
      micro_proof
    `)
    .eq("lesson_id", lessonId)
    .single();

  if (error) {
    console.error("getLessonById error:", error.message);
    return null;
  }

  return data;
}

export async function fetchLessonProgressByUid(uid, courseId = null) {
  if (!uid) return [];

  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!studentRow?.s_id) return [];

  let query = supabase
    .from("lesson_progress")
    .select("*")
    .eq("s_id", studentRow.s_id);

  if (courseId) {
    const lessonIds = await getLessonIdsByCourseId(courseId);
    if (!lessonIds.length) return [];
    query = query.in("lesson_id", lessonIds);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function saveLessonAIQuestion({
  userId,
  lessonId,
  questionKey,
  questionText,
  completed = true,
}) {
  const studentId = await resolveStudentId(userId);
  const lessonContext = await getLessonInsertContext(lessonId);
  if (!studentId) throw new Error("Valid student userId is required");
  if (!questionKey?.trim()) throw new Error("questionKey is required");
  if (!questionText?.trim()) throw new Error("questionText is required");

  const payload = {
    user_id: studentId,
    lesson_id: lessonContext.lessonId,
    course_id: lessonContext.courseId,
    question_key: questionKey.trim(),
    question_text: questionText.trim(),
    completed: completed !== false,
  };

  const { data: existing, error: existingError } = await supabase
    .from("lesson_ai_questions")
    .select("id")
    .eq("user_id", studentId)
    .eq("lesson_id", lessonContext.lessonId)
    .eq("question_key", questionKey.trim())
    .order("clicked_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const query = existing?.id
    ? supabase
        .from("lesson_ai_questions")
        .update(payload)
        .eq("id", existing.id)
    : supabase
        .from("lesson_ai_questions")
        .insert(payload);

  const { data, error } = await query
    .select("*")
    .single();

  if (error) throw error;
  const unlock = await checkUnlock(studentId, lessonContext.lessonId);
  return { row: data, unlock };
}

export async function saveLessonAssetProgress({
  userId,
  lessonId,
  assetKey,
  answerText,
  answered = null,
}) {
  const studentId = await resolveStudentId(userId);
  const lessonContext = await getLessonInsertContext(lessonId);
  const cleanedAnswer = String(answerText || "").trim();
  const cleanedAssetKey = String(assetKey || "").trim();

  if (!studentId) throw new Error("Valid student userId is required");
  if (!cleanedAssetKey) throw new Error("assetKey is required");

  const payload = {
    user_id: studentId,
    lesson_id: lessonContext.lessonId,
    course_id: lessonContext.courseId,
    asset_key: cleanedAssetKey,
    answered: answered == null ? Boolean(cleanedAnswer) : answered === true,
    answer_text: cleanedAnswer,
  };

  const { data: existing, error: existingError } = await supabase
    .from("lesson_asset_progress")
    .select("id")
    .eq("user_id", studentId)
    .eq("lesson_id", lessonContext.lessonId)
    .eq("asset_key", cleanedAssetKey)
    .order("answered_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const query = existing?.id
    ? supabase
        .from("lesson_asset_progress")
        .update(payload)
        .eq("id", existing.id)
    : supabase
        .from("lesson_asset_progress")
        .insert(payload);

  const { data, error } = await query
    .select("*")
    .single();

  if (error) throw error;
  const unlock = await checkUnlock(studentId, lessonContext.lessonId);
  return { row: data, unlock };
}

export async function fetchLessonAssetProgressByUid(uid, courseId = null, lessonId = null) {
  const studentId = await resolveStudentId(uid);
  if (!studentId) return [];

  let query = supabase
    .from("lesson_asset_progress")
    .select("*")
    .eq("user_id", studentId)
    .order("answered_at", { ascending: false });

  if (courseId) query = query.eq("course_id", Number(courseId));
  if (lessonId) query = query.eq("lesson_id", Number(lessonId));

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchLessonCommitProofsByUid(uid, courseId = null, lessonId = null) {
  const studentId = await resolveStudentId(uid);
  if (!studentId) return [];

  let query = supabase
    .from("lesson_commit_proofs")
    .select("*")
    .eq("user_id", studentId)
    .order("submitted_at", { ascending: false });

  if (courseId) query = query.eq("course_id", Number(courseId));
  if (lessonId) query = query.eq("lesson_id", Number(lessonId));

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchLessonAIQuestionsByUid(uid, courseId = null, lessonId = null) {
  const studentId = await resolveStudentId(uid);
  if (!studentId) return [];

  let query = supabase
    .from("lesson_ai_questions")
    .select("*")
    .eq("user_id", studentId)
    .order("clicked_at", { ascending: false });

  if (courseId) query = query.eq("course_id", Number(courseId));
  if (lessonId) query = query.eq("lesson_id", Number(lessonId));

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function saveLessonCommitProof({
  userId,
  lessonId,
  repoUrl,
  commitSha,
  deliverable = null,
  microProof = null,
}) {
  const studentId = await resolveStudentId(userId);
  const lessonContext = await getLessonInsertContext(lessonId);
  const cleanedRepoUrl = String(repoUrl || "").trim();
  const cleanedCommitSha = String(commitSha || "").trim();

  if (!studentId) throw new Error("Valid student userId is required");
  if (!cleanedRepoUrl) throw new Error("repoUrl is required");
  if (!cleanedCommitSha) throw new Error("commitSha is required");

  const verified =
    /^https:\/\/github\.com\/[^/\s]+\/[^/\s]+\/?$/.test(cleanedRepoUrl) &&
    /^[a-f0-9]{7,40}$/i.test(cleanedCommitSha);

  const payload = {
    user_id: studentId,
    lesson_id: lessonContext.lessonId,
    course_id: lessonContext.courseId,
    repo_url: cleanedRepoUrl,
    commit_sha: cleanedCommitSha,
    deliverable,
    micro_proof: microProof,
    verified,
  };

  let existingQuery = supabase
    .from("lesson_commit_proofs")
    .select("id")
    .eq("user_id", studentId)
    .eq("lesson_id", lessonContext.lessonId)
    .order("submitted_at", { ascending: false })
    .limit(1);

  existingQuery = lessonContext.courseId
    ? existingQuery.eq("course_id", lessonContext.courseId)
    : existingQuery.is("course_id", null);

  const { data: existing, error: existingError } = await existingQuery.maybeSingle();
  if (existingError) throw existingError;

  const query = existing?.id
    ? supabase
        .from("lesson_commit_proofs")
        .update({
          repo_url: cleanedRepoUrl,
          commit_sha: cleanedCommitSha,
          deliverable,
          micro_proof: microProof,
          verified,
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    : supabase
        .from("lesson_commit_proofs")
        .insert(payload);

  const { data, error } = await query
    .select("*")
    .single();

  if (error) throw error;
  const unlock = await checkUnlock(studentId, lessonContext.lessonId);
  return { row: data, unlock };
}

export async function upsertLessonProgress({
  userId,
  lessonId,
  completed = false,
  completedAt = null,
  quizMarks = null,
  quizPassed = null,
  quizAttempt = false,
  readyToUnlock = null,
}) {
  const studentId = await resolveStudentId(userId);
  if (!studentId) throw new Error("Valid student userId is required");
  if (!lessonId) throw new Error("lessonId is required");

  const numericLessonId = Number(lessonId);
  const payload = {
    completed: completed === true,
    completed_at: completed === true ? completedAt || new Date().toISOString() : completedAt,
    quiz_marks: quizMarks == null ? null : Number(quizMarks),
    quiz_passed: quizPassed == null ? null : Number(quizPassed),
    quiz_attempt: quizAttempt === true,
  };

  if (readyToUnlock != null) {
    payload.ready_to_unlock = readyToUnlock === true;
  }

  const { data: existing, error: existingError } = await supabase
    .from("lesson_progress")
    .select("progress_id")
    .eq("s_id", studentId)
    .eq("lesson_id", numericLessonId)
    .maybeSingle();

  if (existingError) throw existingError;

  const query = existing?.progress_id
    ? supabase
        .from("lesson_progress")
        .update(payload)
        .eq("progress_id", existing.progress_id)
    : supabase
        .from("lesson_progress")
        .insert({
          s_id: studentId,
          lesson_id: numericLessonId,
          ...payload,
          ready_to_unlock: payload.ready_to_unlock ?? false,
        });

  const { data, error } = await query
    .select("*")
    .single();

  if (error) throw error;
  return data;
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

