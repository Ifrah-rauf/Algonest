import { supabase } from "../lib/supabase.js";
import { checkUnlock } from "./lessonService.js";

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

async function activateNextLesson(currentLesson) {
  if (!currentLesson?.course_id || currentLesson?.order_index == null) {
    return null;
  }

  const { data: nextLesson, error: nextFetchError } = await supabase
    .from("lessons")
    .select("lesson_id, order_index, course_id")
    .eq("course_id", currentLesson.course_id)
    .eq("order_index", currentLesson.order_index + 1)
    .maybeSingle();

  if (nextFetchError) throw nextFetchError;
  if (!nextLesson) return null;

  // Previously this code checked and updated `lessons.status` to "active".
  // That decision and the status column are removed — simply return the next lesson if present.
  return nextLesson;
}

async function upsertLessonProgress(studentId, lessonId, score, passed) {
  if (!studentId || !lessonId) return null;

  const progressPayload = {
    quiz_marks: score,
    quiz_passed: passed ? 1 : 0,
    quiz_attempt: true,
    completed: passed,
    completed_at: passed ? new Date().toISOString() : null,
  };

  const { data: existingProgress, error: fetchProgressError } = await supabase
    .from("lesson_progress")
    .select("progress_id")
    .eq("s_id", studentId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (fetchProgressError) throw fetchProgressError;

  if (existingProgress?.progress_id) {
    const { data: updatedProgress, error: updateProgressError } = await supabase
      .from("lesson_progress")
      .update(progressPayload)
      .eq("progress_id", existingProgress.progress_id)
      .select("*")
      .single();

    if (updateProgressError) throw updateProgressError;
    return updatedProgress;
  }

  const { data: insertedProgress, error: insertProgressError } = await supabase
    .from("lesson_progress")
    .insert([
      {
        s_id: studentId,
        lesson_id: lessonId,
        ...progressPayload,
      },
    ])
    .select("*")
    .single();

  if (insertProgressError) throw insertProgressError;
  return insertedProgress;
}

export async function saveLessonQuizResult({
  uid,
  lessonId,
  score,
  totalQuestions,
  attempts,
  passed,
}) {
  const numericLessonId = Number(lessonId);
  const numericScore = Number(score);
  const numericTotalQuestions = Number(totalQuestions);
  const quizPassed = Boolean(passed);

  if (!numericLessonId || Number.isNaN(numericLessonId)) {
    throw new Error("Valid lessonId is required.");
  }

  if (Number.isNaN(numericScore) || Number.isNaN(numericTotalQuestions)) {
    throw new Error("score and totalQuestions must be valid numbers.");
  }

  const { data: currentLesson, error: lessonError } = await supabase
    .from("lessons")
    .select("lesson_id, order_index, course_id")
    .eq("lesson_id", numericLessonId)
    .single();

  if (lessonError) throw lessonError;

  const studentId = await getStudentIdByUid(uid);
  const progress = await upsertLessonProgress(
    studentId,
    numericLessonId,
    numericScore,
    quizPassed
  );
  const unlock = studentId
    ? await checkUnlock(studentId, numericLessonId)
    : null;

  const nextLesson = quizPassed ? await activateNextLesson(currentLesson) : null;

  return {
    lesson: currentLesson,
    nextLesson,
    studentId,
    progress,
    unlock,
    quizResult: {
      score: numericScore,
      totalQuestions: numericTotalQuestions,
      attempts,
      passed: quizPassed,
    },
  };
}
