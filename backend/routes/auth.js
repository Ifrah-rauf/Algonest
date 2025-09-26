// backend/routes/auth.js
import express from "express";
import pkg from "@prisma/client";      // default import
const { PrismaClient } = pkg;         // destructure named export
import bcrypt from "bcrypt"; // for hashing passwords
import { v4 as uuidv4 } from "uuid";
import e from "express";
import axios from "axios";
const prisma = new PrismaClient();
const router = express.Router();


router.post("/save-user", async (req, res) => {
  console.log("Request body received:", req.body); // <-- log what frontend sends
  const { uid, mail, username } = req.body;

  try {
    let user = await prisma.auth.findUnique({ where: { uid } });
    if (!user) {
      user = await prisma.auth.create({ data: { uid, mail, username, student: {
      create: {
        name:username
      } 
        } 
        },include: { student: true } });
    }
    console.log("User saved:", user);
    res.json(user);
  } catch (err) {
    console.error("Error in /save-user:", err); // <-- log full error
    res.status(500).json({ error: err.message });
  }
});


router.get("/user/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await prisma.auth.findUnique({ where: { uid } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  console.log(">>> /signup route hit!");
  console.log("Request body:", req.body);
  const { username, password, mail } = req.body;
  try {
    const existing = await prisma.auth.findUnique({ where: { mail } });
    if (existing) {
      return res.json({ status: "mail already exists"});
    }

    const hashed = await bcrypt.hash(password, 10);
    const uid = uuidv4();
    const newUser = await prisma.auth.create({
      data: { uid, username, password: hashed, mail,student: {
      create: {
        name:username
      } 
        } 
        },include: { student: true }
    });
    req.session.user = { uid: newUser.uid, username: newUser.username, mail: newUser.mail };
    res.json({ status: "success", uid: newUser.uid, login_uid: newUser.uid});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  console.log(">>> /login route hit!", req.body);
  const { mail, password } = req.body;

  try {
    const user = await prisma.auth.findUnique({ where: { mail } });
    if (!user) {
      return res.json({ status: "error", message: "User not found" });
    }
    if (!user.password) {
      return res.json({ status: "firebase_login" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ status: "error", message: "Wrong password" });
    }

    // Set session
    req.session.user = {
      uid: user.uid,
      username: user.username,
      mail: user.mail,
    };

    res.json({ status: "success", user: req.session.user, login_uid:user.uid});
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});


router.post("/firebase-login", async (req, res) => {
  console.log(">>> /firebase-login route hit!", req.body);
  const { mail, uidFromFirebase } = req.body;

  try {
    let user = await prisma.auth.findUnique({ where: { mail } });

    // If user does not exist, create new one
    if (!user) {
      user = await prisma.auth.create({
        data: {
          uid: uidFromFirebase || uuidv4(),
          username: mail.split("@")[0], // default username
          password: "", // firebase user won't need local password
          mail,
        },
      });
    }

    // Set session
    req.session.user = {
      uid: user.uid,
      username: user.username,
      mail: user.mail,
    };

    res.json({ status: "success", user: req.session.user, login_uid:user.uid})
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.json({ status: "signed_out" });
  });
});


// router.post("/book/:uid", async (req, res) => {
//   const { uid } = req.params;
//   const user = await prisma.auth.findUnique({ where: { uid } });
// });
router.post("/book/:uid", async (req, res) => {
  const { uid } = req.params;  // uid corresponds to s_id in StAccount
  const { plan_id, payCheck = false} = req.body;
  console.log("PLAN_ID AT BACKEND"+plan_id);
  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    // check if student exists
    const student = await prisma.stAccount.findUnique({
      where: { uid: uid },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // check if plan exists
    const plan = await prisma.planDesc.findUnique({
      where: { plan_id: plan_id },
    });
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // create PlanRecord
    const newRecord = await prisma.planRecord.create({
      data: {
        s_id: student.s_id,
        plan_id: plan.plan_id,
        sessionsRem: plan.sessionsIncluded,
        isValid: false, // only valid if payment is done
        payCheck,
      },
    });

    res.status(201).json({
      message: payCheck
        ? "Booking successful"
        : "Booking saved but payment pending",
      planRecord: newRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

import dotenv from "dotenv";
dotenv.config();
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WABA_ID = process.env.WABA_ID;
router.post("/send-whatsapp", async (req, res) => {
console.log("token and id: "+WHATSAPP_TOKEN+" "+PHONE_NUMBER_ID);
  const { phone, name, slot } = req.body;
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/835859506271674/messages`,
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
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      message: "WhatsApp message sent",
      response: response.data
    });
  } catch (error) {
    if (error.response) {
      // Server responded with an error status
      console.error("❌ API Error:");
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // No response received
      console.error("❌ No response received from server.");
      console.error("Request:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("❌ Error setting up request:", error.message);
    }
    res.status(500).json({ success: false, error: "Failed to send WhatsApp" });
  }
});





export default router;
