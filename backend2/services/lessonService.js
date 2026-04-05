import { supabase } from "../lib/supabase.js";

// Mark a topic complete for a student
export async function markTopicComplete(studentId, topicId) {
  // 1️⃣ Update topic progress
  const { data, error } = await supabase
    .from("lesson_topics_progress")
    .upsert({
      s_id: studentId,
      topic_id: topicId,
      completed: true,
      completed_at: new Date().toISOString()
    })
    .select();
  if (error) throw error;

  // 2️⃣ Check if parent lesson is now fully complete
  await checkLessonCompletion(studentId, topicId);

  return data[0];
}

async function checkLessonCompletion(studentId, topicId) {
  // Find parent lesson of this topic
  const { data: topic } = await supabase
    .from("lesson_topics")
    .select("lesson_id")
    .eq("topic_id", topicId)
    .single();

  if (!topic) return;
  const lessonId = topic.lesson_id;

  // Get all topics for this lesson
  const { data: allTopics } = await supabase
    .from("lesson_topics")
    .select("topic_id")
    .eq("lesson_id", lessonId);

  const topicIds = allTopics.map(t => t.topic_id);

  // Get student’s progress for these topics
  const { data: progress } = await supabase
    .from("lesson_topics_progress")
    .select("topic_id, completed")
    .eq("s_id", studentId)
    .in("topic_id", topicIds);

  const completedIds = progress.filter(p => p.completed).map(p => p.topic_id);
  const allDone = topicIds.every(id => completedIds.includes(id));

  // If all topics are done → mark lesson complete
  if (allDone) {
    await supabase
      .from("lesson_progress")
      .upsert({
        s_id: studentId,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      });

    // Unlock next lesson (unless this is the last one)
    await unlockNextLesson(studentId, lessonId);

    // If all lessons are complete → unlock final checkpoint
    await checkAllLessonsDone(studentId);
  }
}

async function unlockNextLesson(studentId, lessonId) {
  const { data: currentLesson } = await supabase
    .from("lessons")
    .select("order_index")
    .eq("lesson_id", lessonId)
    .single();

  if (!currentLesson) return;
  const nextOrder = currentLesson.order_index + 1;

  const { data: nextLesson } = await supabase
    .from("lessons")
    .select("lesson_id")
    .eq("order_index", nextOrder)
    .maybeSingle();

  if (nextLesson) {
    await supabase
      .from("checkpoints")
      .update({ status: "active" }) // use 'active' instead of 'unlocked'
      .eq("lesson_id", nextLesson.lesson_id)
      .eq("s_id", studentId);
  }
}

async function checkAllLessonsDone(studentId) {
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("lesson_id, order_index");

  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("s_id", studentId);

  const completedIds = progress.filter(p => p.completed).map(p => p.lesson_id);
  const allDone = allLessons.every(l => completedIds.includes(l.lesson_id));

  if (allDone) {
    // Find the last lesson by order_index
    const lastLesson = allLessons.reduce((max, l) =>
      l.order_index > max.order_index ? l : max
    );

    // Unlock final checkpoint tied to last lesson
    await supabase
      .from("checkpoints")
      .update({ status: "active" })
      .eq("s_id", studentId)
      .eq("lesson_id", lastLesson.lesson_id);
  }
}
