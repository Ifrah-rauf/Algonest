import { supabase } from "../lib/supabase.js";

export async function getCourses() {
  const { data, error } = await supabase.from("courses").select("*");
  if (error) throw error;
  return data;
}

export async function createCourse(courseData) {
  const { data, error } = await supabase.from("courses").insert(courseData).select().single();
  if (error) throw error;
  return data;
}

export async function getCourseLessons(courseId) {
  const { data, error } = await supabase.from("lessons").select("*").eq("course_id", courseId);
  if (error) throw error;
  return data;
}
