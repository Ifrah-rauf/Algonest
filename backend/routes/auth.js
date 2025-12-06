import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const router = express.Router();

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { supabase } from "../lib/supabase.js"; 

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WABA_ID = process.env.WABA_ID;

router.post("/save-user", async (req, res) => {
  const { uid, mail, username } = req.body;
  const email = mail;
  const name = username;

  // Check if user already exists
  const { data: existing } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (existing) {
    return res.json({
      status: "existing",
      user: existing
    });
  }

  // Create new user WITH ROLE
  const { data: newUser, error } = await supabase
    .from("auth")
    .insert([
      {
        uid,
        email,
        name,
        role: "STUDENT"   // ⭐ FIXED: Role added
      }
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Also insert into student table
  await supabase.from("student").insert([{ uid, name }]);
console.log("SAVE-USER returning:", existing || newUser);

  return res.json({
    status: "created",
    user: newUser
  });
});

router.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;

  const { data, error } = await supabase
    .from("auth")
    .select("*")
    .eq("uid", uid)
    .single();

  if (error) return res.status(404).json({ error });

  res.json(data);
});


router.post("/signup", async (req, res) => {
  const { username, password, mail } = req.body;
  const email = mail;
  const name = username;

  const { data: existing } = await supabase
    .from("auth")
    .select("*")
    .eq("email", email)
    .single();

  if (existing) return res.json({ status: "mail already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const uid = uuidv4();

  // Insert new auth record
  const { data: newUser, error } = await supabase
    .from("auth")
    .insert([{ uid, name, password: hashed, email, role: "STUDENT" }])
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  // Insert matching student row
  await supabase.from("student").insert([{ uid, name }]);

  // session login
  req.session.user = {
    uid,
    name,
    email,
    // role: "STUDENT",
  };

  return res.json({
    status: "success",
    user: req.session.user
  });
});


router.post("/login", async (req, res) => {
  const { mail, password } = req.body;
  const email = mail;

  const { data: user, error } = await supabase
    .from("auth")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) return res.json({ status: "error", message: "User not found" });

  if (!user.password) return res.json({ status: "firebase_login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ status: "error", message: "Wrong password" });

  // Ensure correct keys here
  const authUser = {
    uid: user.uid,
    username: user.name,         // not username
    email: user.email,
  };

  req.session.user = authUser;

  return res.json({
    status: "success",
    user: authUser
  });
});



router.post("/firebase-login", async (req, res) => {
  const { mail, uidFromFirebase } = req.body;
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
          password: ""
        }
      ])
      .select()
      .single();

    user = data;
  }

  req.session.user = {
    uid: user.uid,
    username: user.name,
    email: user.email,
  };

  res.json({ status: "success", user: req.session.user });
});


router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ status: "signed_out" });
  });
});

// Send WhatsApp message
router.post("/send-whatsapp", async (req, res) => {
  console.log("Token and phone ID:", WHATSAPP_TOKEN?.slice(0, 10) + "...", PHONE_NUMBER_ID);

  const { phone, name, slot } = req.body;

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: `Hi ${name}, ✅ your Algonest demo class is confirmed for ${slot}.`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        }
      }
    );

    res.json({
      success: true,
      message: "WhatsApp message sent",
      response: response.data
    });

  } catch (error) {
    // Standardised full error trace
    console.error("❌ WhatsApp API Error");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("❌ No response received", error.request);
    } else {
      console.error("❌ Error:", error.message);
    }

    res.status(500).json({
      success: false,
      error: "Failed to send WhatsApp",
      details: error.response?.data || error.message
    });
  }
});






export default router;
