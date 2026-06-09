import { supabase } from "../lib/supabase.js";

export async function saveGithubLink(studentId, githubUrl) {
  const { error } = await supabase
    .from("student")
    .update({ github_url: githubUrl })
    .eq("s_id", studentId);

  if (error) throw error;
  return { success: true, message: "GitHub link saved successfully" };
}

export async function saveResumeLink(studentId, resumeUrl) {
  const { error } = await supabase
    .from("student")
    .update({ resume_url: resumeUrl })
    .eq("s_id", studentId);

  if (error) throw error;
  return { success: true, message: "Resume saved successfully" };
}

export async function saveProjectDetails(studentId, projectTitle) {
  // Use maybeSingle() instead of single() to avoid "no rows returned" error
  const { data: student, error: studentError } = await supabase
    .from("student")
    .select("course_id")
    .eq("s_id", studentId)
    .maybeSingle();

  if (studentError) throw studentError;
  if (!student) {
    throw new Error("Student profile not found.");
  }

  if (!student.course_id) {
    throw new Error("Student must have a selected roadmap (course_id) to save project details.");
  }

  // Use limit(1) instead of maybeSingle() to handle potential duplicates gracefully
  const { data: existingRows, error: findError } = await supabase
    .from("student_project")
    .select("id")
    .eq("student_id", studentId)
    .eq("course_id", student.course_id)
    .limit(1);

  if (findError) throw findError;

  const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

  let result;
  if (existing) {
    // Update existing entry
    result = await supabase
      .from("student_project")
      .update({ custom_title: projectTitle })
      .eq("id", existing.id);
  } else {
    // Insert new entry
    result = await supabase
      .from("student_project")
      .insert({ 
        student_id: studentId,
        course_id: student.course_id,
        custom_title: projectTitle
      });
  }

  if (result.error) {
    console.error("student_project save error:", result.error);
    throw result.error;
  }
  return { success: true, message: "Project title saved successfully" };
}