import express from "express";
import {supabase} from "../lib/supabase.js";

const router = express.Router();

// GET all teachers
router.get("/getAllTeachers", async (req, res) => {
  const { data, error } = await supabase
    .from("teacher")
    .select("*")
    .order("t_id", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    return res.status(500).json({ error: "Failed to fetch teachers" });
  }

  res.json(data);
});

router.get("/getTeacher/:id", async (req, res) => {
  const { id } = req.params;

  // GET teacher
  const { data: teacherData, error: error1 } = await supabase
    .from("teacher")
    .select("*")
    .eq("t_id", id)
    .single();

  const { data: availabilityData, error: error2 } = await supabase
    .from("availability")
    .select("*")
    .eq("teacherid", id)
    .order("dayofweek", { ascending: true });

  const { data: timeSlotsData, error: error3 } = await supabase
    .from("timeslot")
    .select(`
        *,
        availability:availabilityid ( type, desc, isfree, active)
      `)
    .eq("teacherid", id)
    .order("startat", { ascending: true });

  if (error1 || error2) {
    console.error("Supabase error:", error1 || error2);
    return res.status(500).json({ error: "Failed to fetch teacher" });
  }
  console.log("timeSlotsData: "+timeSlotsData);
  res.json({
    teacher: teacherData,
    avail: availabilityData,
    timeSlots:timeSlotsData
  });
});

router.post("/getMentors", async (req, res) => {
  try {
    const { planIds } = req.body;

    if (!planIds || !Array.isArray(planIds) || planIds.length === 0) {
      return res.json({ success: false, message: "Invalid plan list." });
    }

    // 1️⃣ Get all teacher_ids who teach these plans
    const { data: mapping, error: mapErr } = await supabase
      .from("teacher_plan")
      .select("t_id")
      .in("plan_id", planIds);

    if (mapErr) throw mapErr;

    const teacherIds = mapping.map((m) => m.t_id);
    if (teacherIds.length === 0) {
      return res.json({ success: true, mentors: [] });
    }

    // 2️⃣ Fetch teacher details
    const { data: mentors, error: mentorErr } = await supabase
      .from("teacher")
      .select("*")
      .in("t_id", teacherIds);

    if (mentorErr) throw mentorErr;

    return res.json({ success: true, mentors });

  } catch (err) {
    console.error("Mentor Fetch Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

export default router;
