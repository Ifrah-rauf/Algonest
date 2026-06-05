import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";

function normalizeEmail(mail) {
  return String(mail || "").trim().toLowerCase();
}

function cleanOptional(value) {
  const trimmed = String(value || "").trim();
  return trimmed || null;
}

function toSafeTempPassword(rawPassword) {
  if (rawPassword && String(rawPassword).trim()) {
    return null;
  }

  return `Temp@${Math.random().toString(36).slice(2, 10)}${Date.now().toString().slice(-4)}`;
}

async function findTeacherById(tId) {
  const { data, error } = await supabase
    .from("teacher")
    .select("*")
    .eq("t_id", tId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function createTeacher(payload) {
  const email = normalizeEmail(payload.email);
  const name = cleanOptional(payload.name);
  if (!email) throw new Error("email is required");
  if (!name) throw new Error("name is required");

  const { data: existingAuth, error: authLookupError } = await supabase
    .from("auth")
    .select("uid, email, role")
    .eq("email", email)
    .maybeSingle();

  if (authLookupError) throw authLookupError;
  if (existingAuth) {
    throw new Error("A user already exists with this email");
  }

  const uid = uuidv4();
  const tempPassword = toSafeTempPassword(payload.password);
  const rawPassword = String(payload.password || tempPassword || "").trim();
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const { error: authInsertError } = await supabase.from("auth").insert([
    {
      uid,
      name,
      email,
      password: hashedPassword,
      role: "TEACHER",
    },
  ]);

  if (authInsertError) throw authInsertError;

  const teacherRow = {
    uid,
    name,
    bio: cleanOptional(payload.bio),
    education: cleanOptional(payload.education),
    teaching_style: cleanOptional(payload.teaching_style),
    rating: Number.isFinite(Number(payload.rating)) ? Number(payload.rating) : null,
    video_url: cleanOptional(payload.video_url),
    pfp: cleanOptional(payload.pfp),
    timezone: cleanOptional(payload.timezone),
    verified: typeof payload.verified === "boolean" ? payload.verified : false,
    experience: cleanOptional(payload.experience),
    meeting_link: cleanOptional(payload.meeting_link),
  };

  const { data: teacherInsert, error: teacherInsertError } = await supabase
    .from("teacher")
    .insert([teacherRow])
    .select("*")
    .single();

  if (teacherInsertError) throw teacherInsertError;

  return {
    teacher: teacherInsert,
    auth: {
      uid,
      name,
      email,
      role: "TEACHER",
    },
    tempPassword,
  };
}

async function listTeachers() {
  const { data: teachers, error } = await supabase
    .from("teacher")
    .order("t_id", { ascending: false });

  if (error) throw error;
  const uids = (teachers || []).map((teacher) => teacher.uid).filter(Boolean);

  const { data: authRows, error: authError } = uids.length
    ? await supabase
        .from("auth")
        .select("uid, email, role")
        .in("uid", uids)
    : { data: [], error: null };

  if (authError) throw authError;

  const authByUid = Object.fromEntries((authRows || []).map((row) => [row.uid, row]));
  return (teachers || []).map((teacher) => ({
    ...teacher,
    auth: authByUid[teacher.uid] || null,
  }));
}

async function getTeacher(tId) {
  const { data: teacher, error } = await supabase
    .from("teacher")
    .eq("t_id", tId)
    .maybeSingle();

  if (error) throw error;
  if (!teacher) return null;

  const { data: authRow, error: authError } = await supabase
    .from("auth")
    .select("uid, email, role")
    .eq("uid", teacher.uid)
    .maybeSingle();

  if (authError) throw authError;

  return {
    ...teacher,
    auth: authRow || null,
  };
}

async function updateTeacher(tId, payload) {
  const teacher = await findTeacherById(tId);
  if (!teacher) throw new Error("Teacher not found");

  const teacherUpdates = {
    name: cleanOptional(payload.name) || teacher.name,
    bio: payload.bio !== undefined ? cleanOptional(payload.bio) : teacher.bio,
    education: payload.education !== undefined ? cleanOptional(payload.education) : teacher.education,
    teaching_style: payload.teaching_style !== undefined ? cleanOptional(payload.teaching_style) : teacher.teaching_style,
    rating: payload.rating !== undefined && payload.rating !== "" ? Number(payload.rating) : teacher.rating,
    video_url: payload.video_url !== undefined ? cleanOptional(payload.video_url) : teacher.video_url,
    pfp: payload.pfp !== undefined ? cleanOptional(payload.pfp) : teacher.pfp,
    timezone: payload.timezone !== undefined ? cleanOptional(payload.timezone) : teacher.timezone,
    verified: typeof payload.verified === "boolean" ? payload.verified : teacher.verified,
    experience: payload.experience !== undefined ? cleanOptional(payload.experience) : teacher.experience,
    meeting_link: payload.meeting_link !== undefined ? cleanOptional(payload.meeting_link) : teacher.meeting_link,
  };

  const { data: updatedTeacher, error: updateError } = await supabase
    .from("teacher")
    .update(teacherUpdates)
    .eq("t_id", tId)
    .select("*")
    .single();

  if (updateError) throw updateError;

  if (payload.password && String(payload.password).trim()) {
    const hashedPassword = await bcrypt.hash(String(payload.password).trim(), 10);
    const { error: authUpdateError } = await supabase
      .from("auth")
      .update({
        name: teacherUpdates.name,
        password: hashedPassword,
        ...(payload.email ? { email: normalizeEmail(payload.email) } : {}),
      })
      .eq("uid", teacher.uid);

    if (authUpdateError) throw authUpdateError;
  } else if (payload.name || payload.email) {
    const authUpdates = {};
    if (payload.name) authUpdates.name = teacherUpdates.name;
    if (payload.email) authUpdates.email = normalizeEmail(payload.email);

    if (Object.keys(authUpdates).length) {
      const { error: authUpdateError } = await supabase
        .from("auth")
        .update(authUpdates)
        .eq("uid", teacher.uid);

      if (authUpdateError) throw authUpdateError;
    }
  }

  return updatedTeacher;
}

async function deleteTeacher(tId) {
  const teacher = await findTeacherById(tId);
  if (!teacher) throw new Error("Teacher not found");

  const { error } = await supabase
    .from("teacher")
    .delete()
    .eq("t_id", tId);

  if (error) throw error;

  return { deleted: true, uid: teacher.uid, t_id: tId };
}

export {
  createTeacher,
  listTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};
