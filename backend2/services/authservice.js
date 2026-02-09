import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase.js";

async function signup({ username, password, mail }) {
  const email = mail;

  const { data: existing } = await supabase
    .from("auth")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);
  const uid = uuidv4();

  const { data, error } = await supabase
    .from("auth")
    .insert([{ uid, name: username, password: hashed, email, role: "STUDENT" }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("student").insert([{ uid, name: username }]);

  return { uid, username, email };
}

async function login({ mail, password }) {
  const email = mail;

  const { data: user } = await supabase
    .from("auth")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("Firebase login required");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Wrong password");
  




  return { uid: user.uid, username: user.name, email: user.email };
}

async function firebaseLogin({ mail, uidFromFirebase }) {
  const email = mail;

  let { data: user } = await supabase
    .from("auth")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    const { data } = await supabase
      .from("auth")
      .insert([
        {
          uid: uidFromFirebase || uuidv4(),
          name: email.split("@")[0],
          email,
          role: "STUDENT",
          password: null
        }
      ])
      .select()
      .single();

    user = data;
  }



  return { uid: user.uid, username: user.name, email: user.email };
}

async function saveUser({ uid, mail, username }) {
  const email = mail;

  const { data: existing } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("auth")
    .insert([{ uid, email, name: username, role: "STUDENT" }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("student").insert([{ uid, name: username }]);

  return data;
}

async function getUser(uid) {
  const { data, error } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (error) throw new Error(error.message);
  return data;
}


export { signup, login, firebaseLogin, saveUser, getUser };