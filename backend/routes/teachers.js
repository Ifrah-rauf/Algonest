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
    const { teacherData, error1 } = await supabase
        .from("teacher")
        .select("*")
        .eq("t_id", id).single();

    const { availabilityData, error2 } = await supabase
        .from("availability")
        .select("*")
        .eq("teacherid", id).single();
  if (error1 || error2 ) {
    console.error("Supabase error:", error1||error2);
    return res.status(500).json({ error: "Failed to fetch teachers" });
  }

  res.json({
  teacher: teacherData,
  avail: availabilityData
});
});
export default router;
