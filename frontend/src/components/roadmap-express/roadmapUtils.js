export function normalizeTopicResources(topic) {
  if (!topic) return [];

  return (Array.isArray(topic.materials) ? topic.materials : [])
    .map((material) => ({
      label: material.title || material.url,
      url: material.url,
      description: material.description || "",
      resourceType: material.resource_type || "",
      materialId: material.material_id,
    }))
    .filter((item) => item.url);
}

export function getLockedNotice(user) {
  return user?.uid
    ? "Locked: to create project, see plans"
    : "Locked: sign up to create project, see plans";
}

export function getLessonUnlockState(
  lesson,
  progressMap,
  checkpointMap,
  checkpointProgressMap,
  hasActiveBooking,
  isAuthenticated
) {
  if (!isAuthenticated) {
    return "unlocked";
  }
  if (Number(lesson.order_index) === 1) return "unlocked";
  if (!lesson.prerequisite_id && !lesson.checkpoint_id) return "locked";

  let prerequisitePassed = !lesson.prerequisite_id;
  if (lesson.prerequisite_id) {
    const prerequisiteProgress = progressMap[lesson.prerequisite_id];
    const quizPassed =
      prerequisiteProgress?.quiz_passed === true ||
      Number(prerequisiteProgress?.quiz_passed) === 1;
    const readyToUnlock =
      prerequisiteProgress?.ready_to_unlock === true ||
      prerequisiteProgress?.ready_to_unlock == null;
    prerequisitePassed =
      prerequisiteProgress?.completed === true &&
      (readyToUnlock || quizPassed);
  }

  let checkpointPassed = !lesson.checkpoint_id;
  if (lesson.checkpoint_id) {
    const checkpoint = checkpointMap[lesson.checkpoint_id];
    const checkpointProgress = checkpointProgressMap[lesson.checkpoint_id];
    const checkpointSession = checkpointProgress?.session;
    const sessionEnded = checkpointSession?.end_time
      ? new Date(checkpointSession.end_time) <= new Date()
      : false;
    const teacherMarked = checkpointSession?.marked_by_teacher === true;
    const checkpointAlreadyPassed = checkpointProgress?.completed === true || teacherMarked;
    const requiresTeacher = checkpoint?.requires_teacher === true;

    if (requiresTeacher) {
      checkpointPassed = Boolean(checkpointProgress?.session_id) && sessionEnded && teacherMarked;
    } else {
      checkpointPassed = checkpointAlreadyPassed;
    }
  }

  return prerequisitePassed && checkpointPassed ? "unlocked" : "locked";
}

export function findReachedCheckpoint(lessons, checkpoints, progressMap, checkpointProgressMap) {
  for (let idx = 0; idx < lessons.length - 1; idx += 1) {
    const lesson = lessons[idx];
    const nextLesson = lessons[idx + 1];
    if (!progressMap[lesson.lesson_id]?.completed || !nextLesson?.checkpoint_id) continue;

    const checkpoint = checkpoints.find(
      (item) => item.checkpoint_id === nextLesson.checkpoint_id
    );
    const checkpointProgress = checkpointProgressMap[nextLesson.checkpoint_id];

    if (checkpoint && !checkpointProgress?.session_id && !checkpointProgress?.completed) {
      return { checkpoint, lesson };
    }
  }

  return null;
}

export function normalizeCheckpointProgress(rows = []) {
  const map = {};

  rows.forEach((row) => {
    if (!row?.checkpoint_id || map[row.checkpoint_id]) return;
    map[row.checkpoint_id] = row;
  });

  return map;
}

export function getCourseIdFromLocation(location) {
  const params = new URLSearchParams(location.search || "");
  const queryCourseId = params.get("courseId");
  const stateCourseId = location.state?.courseId;
  const parsed = Number(queryCourseId || stateCourseId || 1);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function getActiveTabFromLocation(location) {
  const params = new URLSearchParams(location.search || "");
  return params.get("tab") === "booking" ? "booking" : "roadmap";
}

function parseLessonJson(value, fallback) {
  if (!value) return fallback;
  if (Array.isArray(value) || typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

export function getLessonJsonTopicCount(lesson) {
  const structured =
    parseLessonJson(lesson.structured_content, null) ||
    parseLessonJson(lesson.lesson_structure, null) ||
    parseLessonJson(lesson.content_schema, null) ||
    {};
  const topics =
    parseLessonJson(lesson.static_topics, null) ||
    structured.staticTopics ||
    structured.static_topics ||
    structured.topics ||
    [];

  if (Array.isArray(topics)) return topics.length;
  if (topics && typeof topics === "object") return Object.keys(topics).length;
  return typeof topics === "string" && topics.trim() ? 1 : 0;
}
