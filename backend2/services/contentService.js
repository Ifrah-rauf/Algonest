import { supabase } from "../lib/supabase.js";

export async function listContentService() {
  const { data, error } = await supabase
    .from("content")
    .select("id, created_at, file, name")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createContentService({ name, file }) {
  if (!name || !file) {
    throw new Error("name and file are required");
  }

  const { data, error } = await supabase
    .from("content")
    .insert([{ name, file }])
    .select("id, created_at, file, name")
    .single();

  if (error) throw error;
  return data;
}
