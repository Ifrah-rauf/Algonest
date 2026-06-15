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

export async function saveSelectedRoadmap(studentId, courseId) {
  const numericCourseId = Number(courseId);

  if (!studentId) {
    throw new Error("Student ID is required.");
  }

  if (!Number.isFinite(numericCourseId) || numericCourseId <= 0) {
    throw new Error("A valid roadmap is required.");
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("course_id")
    .eq("course_id", numericCourseId)
    .maybeSingle();

  if (courseError) throw courseError;
  if (!course) {
    throw new Error("Selected roadmap was not found.");
  }

  const { error } = await supabase
    .from("student")
    .update({ course_id: numericCourseId })
    .eq("s_id", studentId);

  if (error) throw error;
  return { success: true, message: "Roadmap saved successfully", courseId: numericCourseId };
}

export async function saveProjectDetails(studentId, projectTitle, projectId = null) {
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

  let selectedProject = null;
  const numericProjectId = Number(projectId);

  if (Number.isFinite(numericProjectId) && numericProjectId > 0) {
    const { data: project, error: projectError } = await supabase
      .from("project")
      .select("project_id, project_title, course_id")
      .eq("project_id", numericProjectId)
      .eq("course_id", student.course_id)
      .maybeSingle();

    if (projectError) throw projectError;
    if (!project) {
      throw new Error("Selected project does not belong to the selected roadmap.");
    }

    selectedProject = project;
  }

  const savedProjectTitle = selectedProject?.project_title || projectTitle;
  const savedProjectId = selectedProject?.project_id || null;

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
      .update({ custom_title: savedProjectTitle, project_id: savedProjectId })
      .eq("id", existing.id);
  } else {
    // Insert new entry
    result = await supabase
      .from("student_project")
      .insert({ 
        student_id: studentId,
        course_id: student.course_id,
        project_id: savedProjectId,
        custom_title: savedProjectTitle
      });
  }

  if (result.error) {
    console.error("student_project save error:", result.error);
    throw result.error;
  }
  return { success: true, message: "Project title saved successfully" };
}
