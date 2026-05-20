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

  // 2. Find the latest booking for this student and get its course/course meta
  const { data: booking, error: bookingError } = await supabase
    .from("booking")
    .select("booking_id, course_id, booking_date, courses:course_id ( course_id, title, description, domain )")
    .eq("s_id", s_id)
    .order("booking_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bookingError) throw new Error(bookingError.message);

  const courseId = booking?.course_id || booking?.courses?.course_id || null;
  if (!courseId) return [];

  const [{ data: projects, error: projectError }, { data: courseRow, error: courseError }] = await Promise.all([
    supabase
    .from("project")
    .select("project_id, project_title, last_progress, booking_id, course_id")
    .eq("course_id", courseId)
    .order("project_id", { ascending: false })
    .limit(6),
    supabase
      .from("courses")
      .select("course_id, title, description, domain")
      .eq("course_id", courseId)
      .maybeSingle(),
  ]);

  if (projectError) throw new Error(projectError.message);
  if (courseError) throw new Error(courseError.message);

  const mappedProjects = (projects || []).map((project) => ({
    ...project,
    id: project.project_id,
    title: project.project_title || courseRow?.title || "Project roadmap",
    project_title: project.project_title || courseRow?.title || "Project roadmap",
    last_progress: project.last_progress || courseRow?.description || "Recommended from your current course.",
    course_title: courseRow?.title || "Current course",
    domain: courseRow?.domain || null,
  }));

  if (mappedProjects.length) return mappedProjects;

  return [
    {
      id: `course-${courseId}`,
      project_id: null,
      project_title: courseRow?.title || "Project roadmap",
      last_progress: courseRow?.description || "Start with a project aligned to your active course.",
      booking_id: booking.booking_id || null,
      course_id: courseId,
      course_title: courseRow?.title || "Current course",
      domain: courseRow?.domain || null,
    },
  ];
}
