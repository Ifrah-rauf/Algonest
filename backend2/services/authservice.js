import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";

const VALID_ROLES = new Set(["STUDENT", "TEACHER", "ADMIN"]);

function normalizeEmail(mail) {
  return String(mail || "").trim().toLowerCase();
}

function normalizeRole(role) {
  const upperRole = String(role || "STUDENT").trim().toUpperCase();
  return VALID_ROLES.has(upperRole) ? upperRole : "STUDENT";
}

function toPublicUser(userRow) {
  if (!userRow) return null;

  return {
    uid: userRow.uid,
    username: userRow.name,
    email: userRow.email,
    role: userRow.role,
  };
}

function parseImageDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const base64 = match[2];
  const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(mimeType)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed");
  }

  return {
    mimeType,
    buffer: Buffer.from(base64, "base64"),
    extension: mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg",
  };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "avatar";
}

async function uploadStudentProfilePicture({ uid, pfp, username }) {
  const cleanPfp = String(pfp || "").trim();
  if (!cleanPfp) return null;

  if (/^https?:\/\//i.test(cleanPfp)) {
    return cleanPfp;
  }

  const parsed = parseImageDataUrl(cleanPfp);
  if (!parsed) {
    throw new Error("Profile picture must be a valid image URL or data URL");
  }

  const storagePath = `student_profile_pics/${uid}/${Date.now()}-${slugify(username)}.${parsed.extension}`;

  const { error: uploadError } = await supabase.storage
    .from("student_profile_pics")
    .upload(storagePath, parsed.buffer, {
      contentType: parsed.mimeType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return supabase.storage.from("student_profile_pics").getPublicUrl(storagePath).data.publicUrl;
}

async function findAuthByUidOrEmail(uid, email) {
  if (uid) {
    const { data, error } = await supabase
      .from("auth")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) return data;
  }

  if (email) {
    const { data, error } = await supabase
      .from("auth")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data || null;
  }

  return null;
}

async function ensureProfileForRole({ uid, username, role }) {
  const profileName = username || "AlgoNest User";

  if (role === "TEACHER") {
    const { data: teacherProfile, error } = await supabase
      .from("teacher")
      .select("t_id")
      .eq("uid", uid)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!teacherProfile) {
      const { error: insertError } = await supabase
        .from("teacher")
        .insert([{ uid, name: profileName }]);

      if (insertError) throw new Error(insertError.message);
    }
    return;
  }

  if (role === "ADMIN") {
    return;
  }

  const { data: studentProfile, error } = await supabase
    .from("student")
    .select("s_id")
    .eq("uid", uid)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!studentProfile) {
    const { error: insertError } = await supabase
      .from("student")
      .insert([{ uid, name: profileName }]);

    if (insertError) throw new Error(insertError.message);
  }
}

async function signup({ username, password, mail, role = "STUDENT" }) {
  const email = normalizeEmail(mail);
  const userRole = normalizeRole(role);
  const cleanUsername = String(username || "").trim();

  const existing = await findAuthByUidOrEmail(null, email);

  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const uid = uuidv4();

  const { data, error } = await supabase
    .from("auth")
    .insert([{ uid, name: cleanUsername, password: hashed, email, role: userRole }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  await ensureProfileForRole({
    uid: data.uid,
    username: data.name,
    role: data.role,
  });

  return toPublicUser(data);
}

async function login({ mail, password }) {
  const email = normalizeEmail(mail);

  const user = await findAuthByUidOrEmail(null, email);

  if (!user) throw new Error("User not found");
  if (!user.password) {
    throw new Error("This account uses Google/GitHub login. Please continue with that provider.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Wrong password");

  await ensureProfileForRole({
    uid: user.uid,
    username: user.name,
    role: user.role,
  });

  return toPublicUser(user);
}

async function firebaseLogin({ mail, uidFromFirebase, username, role = "STUDENT" }) {
  return saveUser({
    uid: uidFromFirebase,
    mail,
    username,
    role,
  });
}

async function saveUser({ uid, mail, username, role = "STUDENT" }) {
  const email = normalizeEmail(mail);
  const userRole = normalizeRole(role);
  const cleanUsername = String(username || email.split("@")[0] || "AlgoNest User").trim();

  const existing = await findAuthByUidOrEmail(uid, email);

  if (existing) {
    await ensureProfileForRole({
      uid: existing.uid,
      username: existing.name,
      role: existing.role,
    });
    return toPublicUser(existing);
  }

  const { data, error } = await supabase
      .from("auth")
      .insert([
        {
          uid: uid || uuidv4(),
          name: cleanUsername,
          email,
          role: userRole,
          password: null,
        },
      ])
      .select()
      .single();

  if (error) throw new Error(error.message);

  await ensureProfileForRole({
    uid: data.uid,
    username: data.name,
    role: data.role,
  });

  return toPublicUser(data);
}

async function getUser(uid) {
  const { data, error } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (error) throw new Error(error.message);
  return toPublicUser(data);
}

async function updateStudentProfile({ uid, name, bio, education, pfp }) {
  const cleanUid = String(uid || "").trim();
  if (!cleanUid) throw new Error("uid is required");

  const cleanName = String(name || "").trim();
  const cleanBio = String(bio || "").trim();
  const cleanEducation = String(education || "").trim();
  const cleanPfp = String(pfp || "").trim();

  const { data: authRow, error: authError } = await supabase
    .from("auth")
    .select("uid, name, email, role")
    .eq("uid", cleanUid)
    .maybeSingle();

  if (authError) throw new Error(authError.message);
  if (!authRow) throw new Error("User not found");

  const uploadedPfp = await uploadStudentProfilePicture({
    uid: cleanUid,
    pfp,
    username: cleanName || authRow.name,
  });

  if (cleanName) {
    const { error: authUpdateError } = await supabase
      .from("auth")
      .update({ name: cleanName })
      .eq("uid", cleanUid);

    if (authUpdateError) throw new Error(authUpdateError.message);
  }

  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id, uid, name, bio, education")
    .eq("uid", cleanUid)
    .maybeSingle();

  if (studentError) throw new Error(studentError.message);
  if (!studentRow) throw new Error("Student profile not found");

  const studentUpdate = {
    name: cleanName || studentRow.name,
    bio: cleanBio,
    education: cleanEducation,
    pfp: uploadedPfp || cleanPfp || null,
  };

  const { data: updatedStudent, error: updateError } = await supabase
    .from("student")
    .update(studentUpdate)
    .eq("uid", cleanUid)
    .select("s_id, uid, name, bio, education, pfp, total_bookings, active_booking_id")
    .single();

  if (updateError) throw new Error(updateError.message);

  return {
    auth: toPublicUser({
      ...authRow,
      name: studentUpdate.name,
    }),
    student: updatedStudent,
  };
}

async function updateStudentCourse({ uid, courseId }) {
  const cleanUid = String(uid || "").trim();
  const parsedCourseId = Number(courseId);

  if (!cleanUid) throw new Error("uid is required");
  if (!Number.isFinite(parsedCourseId) || parsedCourseId <= 0) {
    throw new Error("courseId is required");
  }

  const { data: authRow, error: authError } = await supabase
    .from("auth")
    .select("uid, name, email, role")
    .eq("uid", cleanUid)
    .maybeSingle();

  if (authError) throw new Error(authError.message);
  if (!authRow) throw new Error("User not found");

  const { data: courseRow, error: courseError } = await supabase
    .from("courses")
    .select("course_id, title, description, domain, type, status")
    .eq("course_id", parsedCourseId)
    .maybeSingle();

  if (courseError) throw new Error(courseError.message);
  if (!courseRow) throw new Error("Course not found");

  const { data: studentRow, error: studentError } = await supabase
    .from("student")
    .select("s_id, uid, name, course_id")
    .eq("uid", cleanUid)
    .maybeSingle();

  if (studentError) throw new Error(studentError.message);
  if (!studentRow) throw new Error("Student profile not found");

  const { data: updatedStudent, error: updateError } = await supabase
    .from("student")
    .update({ course_id: courseRow.course_id })
    .eq("uid", cleanUid)
    .select("s_id, uid, name, bio, education, pfp, total_bookings, active_booking_id, course_id")
    .single();

  if (updateError) throw new Error(updateError.message);

  return {
    auth: toPublicUser(authRow),
    student: updatedStudent,
    course: courseRow,
  };
}


export { signup, login, firebaseLogin, saveUser, getUser, updateStudentProfile, updateStudentCourse };
