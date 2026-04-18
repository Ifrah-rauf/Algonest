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

  // 2. Find the latest booking for this student and get its course domain
  const { data: booking, error: bookingError } = await supabase
    .from("booking")
    .select("courses(domain)")
    .eq("s_id", s_id)
    .order("booking_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bookingError) throw new Error(bookingError.message);

  const domain = booking?.courses?.domain;
  if (!domain) return [];

  // 3. Fetch projects matching that domain
  const { data: projects, error: projectError } = await supabase
    .from("project")
    .select("project_id, project_title, last_progress, domain")
    .eq("domain", domain)
    .limit(5);

  if (projectError) throw new Error(projectError.message);

  return projects || [];
}
