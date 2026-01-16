import express from "express";
import {supabase} from "../lib/supabase.js";
const router = express.Router();

router.get("/course-outline/:id", async (req, res) => {
  try {
    console.log("ROUTE HIT");

    const planId = Number(req.params.id);
    console.log("planId:", planId);

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan id",
      });
    }

    /* 1️⃣ Latest outline for this plan */
    //getting outline using planId outline param. 
    const { data: outlineArr, error: outlineError } = await supabase
      .from("plan_outline")
      .select("*")
      .eq("outline_id", planId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (outlineError || !outlineArr?.length) {
      return res.json({
        success: true,
        outline: null,
        sessions: [],
        attachments: [],
        totalSessions: 0,
        remSessions: 0,
      });
    }

    const outline = outlineArr[0];
    console.log("outline_id:", outline.outline_id);

    /* 2️⃣ Sessions under this outline */
    const { data: sessions, error: sessionError } = await supabase
      .from("session")
      .select(`
        session_id,
        outline_id,
        start_time,
        end_time,
        duration,
        status,
        title,
        session_link,
        mentor:teacher (
          t_id,
          name,
          pfp,
          experience
        )
      `)
      .eq("outline_id", outline.outline_id)
      .order("start_time", { ascending: true });


    if (sessionError) {
      console.error("session error:", sessionError);
      return res.status(500).json({
        success: false,
        message: "Failed to load sessions",
      });
    }

    console.log("sessions count:", sessions.length);

    /* 3️⃣ Booking (ONE row per outline) */
    const { data: bookingArr, error: bookingError } = await supabase
      .from("booking")
      .select("*")
      .eq("outline_id", outline.outline_id)
      .limit(1);

    if (bookingError || !bookingArr?.length) {
      console.error("booking error:", bookingError);
      return res.status(500).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookingArr[0];
    console.log("booking:", booking.booking_id);

    // teachers
    // const { data: mentors, error: mentorErr } = await supabase
    //   .from("teacher")
    //   .select("*")
    //   .eq("t_id", sessions.t_id)
    // if (mentorErr || !mentorErr?.length) {
    //   console.error("booking error:", bookingError);
    //   return res.status(500).json({
    //     success: false,
    //     message: "Booking not found",
    //   });
    // }

    /* 4️⃣ Plan (ONE row) */
    const { data: planArr, error: planError } = await supabase
      .from("plan")
      .select("*")
      .eq("plan_id", booking.plan_id)
      .limit(1);

    if (planError || !planArr?.length) {
      console.error("plan error:", planError);
      return res.status(500).json({
        success: false,
        message: "Plan not found",
      });
    }

    const plan = planArr[0];
    console.log("plan.session_count:", plan.sessions);

    /* 5️⃣ Attachments (by session_id IN [...]) */
    const sessionIds = sessions.map((s) => s.session_id);
    let attachments = [];

    if (sessionIds.length > 0) {
      const { data: attData, error: attError } = await supabase
        .from("session_attachment")
        .select("*")
        .in("session_id", sessionIds);

      if (!attError && attData) attachments = attData;
    }

    /* 6️⃣ FINAL VALUES */
    const totalSessions = plan.sessions;            // ✅ integer
    const remSessions = booking.remainingsessions;      // ✅ integer

    console.log("FINAL:", { totalSessions, remSessions });
    console.log("sessions:", sessions);

    return res.json({
      success: true,
      outline,
      sessions,
      attachments,
      totalSessions,
      remSessions,
      // mentors,
    });
  } catch (err) {
    console.error("course-outline error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/getOutline/:uid", async (req, res) => {
  try {
    console.log("ROUTE HIT");

    const { uid } = req.params;
    console.log("uid:", uid);

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "uid not provided",
      });
    }

    /* 1️⃣ Get student by uid */
    const { data: students, error: studentError } = await supabase
      .from("student")
      .select("*")
      .eq("uid", uid)
      .limit(1);

    if (studentError || !students?.length) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const student = students[0];
    console.log("student.s_id:", student.s_id);

    /* 2️⃣ Get latest outline for student */
    const { data: outlines, error: outlineError } = await supabase
      .from("plan_outline")
      .select("*")
      .eq("s_id", student.s_id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (outlineError || !outlines?.length) {
      return res.json({
        success: true,
        outline_id: null,
      });
    }

    const outline = outlines[0];

    return res.json({
      success: true,
      outline_id: outline.outline_id,
    });
  } catch (err) {
    console.error("getOutline error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.get("/getPlans", async (req, res) => {
  try {
    const { data: plans, error } = await supabase
      .from("plan")
      .select("plan_id, plan_name, description, durationdays, price, sessions")
      .order("plan_id");

    if (error) throw error;

    return res.json({
      success: true,
      plans,
    });
  } catch (err) {
    console.error("plans fetch error:", err);
    res.status(500).json({ success: false });
  }
});

export default router;