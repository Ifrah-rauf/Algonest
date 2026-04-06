import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";

const VALID_ROLES = new Set(["STUDENT", "TEACHER"]);

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


export { signup, login, firebaseLogin, saveUser, getUser };
