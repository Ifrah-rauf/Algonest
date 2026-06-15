import { supabase } from "../lib/supabase.js";

/**
 * Get project recommendations for a student based on their bookings.
 * @param {string} uid - The student's auth UID
 * @returns {Promise<Array>} - Recommended projects
 */
export async function getProjectRecommendations(uid, courseId = null) {
  // 1. Resolve student ID from uid
  const { data: student, error: studentError } = await supabase
    .from("student")
    .select("s_id, course_id")
    .eq("uid", uid)
    .maybeSingle();

  if (studentError) throw new Error(studentError.message);
  if (!student) return [];

  const s_id = student.s_id;
  const selectedCourseId = Number(courseId || student.course_id);

  let resolvedCourseId = Number.isFinite(selectedCourseId) && selectedCourseId > 0
    ? selectedCourseId
    : null;

  if (!resolvedCourseId) {
    // Fallback for existing paid students who have not explicitly chosen a dashboard roadmap.
    const { data: booking } = await supabase
      .from("booking")
      .select("course_id")
      .eq("s_id", s_id)
      .order("booking_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    resolvedCourseId = booking?.course_id || null;
  }

if (!resolvedCourseId) return [];

// Step 3: fetch projects by course_id
const { data: projects, error: projectError } = await supabase
  .from("project")
  .select("project_id, project_title, last_progress, course_id")
  .eq("course_id", resolvedCourseId)
  .limit(5);

  if (projectError) throw new Error(projectError.message);

  return projects || [];
}
