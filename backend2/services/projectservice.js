import { supabase } from "../lib/supabase.js";

/**
 * Get project recommendations for a student based on their bookings.
 * @param {string} uid - The student's auth UID
 * @returns {Promise<Array>} - Recommended projects
 */
export async function getProjectRecommendations(uid) {
  // 1. Resolve student ID from uid
  const { data: student, error: studentError } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (studentError) throw new Error(studentError.message);
  if (!student) return [];

  const s_id = student.s_id;

  // Step 2: get course_id from the most recent active booking
const { data: booking } = await supabase
  .from("booking")
  .select("course_id, courses(domain)")
  .eq("s_id", s_id)
  .order("booking_date", { ascending: false })
  .limit(1)
  .maybeSingle();

const course_id = booking?.course_id;
if (!course_id) return [];

// Step 3: fetch projects by course_id
const { data: projects, error: projectError } = await supabase
  .from("project")
  .select("project_id, project_title, last_progress, course_id")
  .eq("course_id", course_id)
  .limit(5);


  if (projectError) throw new Error(projectError.message);

  return projects || [];
}
