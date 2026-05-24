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