import express from "express";
import {supabase} from "../lib/supabase.js";
const router = express.Router();

router.get("/active-course/:uid", async (req, res) => {
  try {
    console.log("reached active-course");

    const { uid } = req.params;

    // 1️⃣ Find student
    const { data: students } = await supabase
      .from("student")
      .select("s_id")
      .eq("uid", uid)
      .limit(1);

    if (!students?.length) {
      return res.json({ success: true, course: null });
    }
    console.log("found student: "+students+"s_id: "+students[0].s_id);

    const s_id = students[0].s_id;

    // 2️⃣ Active booking (not expired)
    const { data: bookings } = await supabase
      .from("booking")
      .select("*")
      .eq("s_id", s_id)
      .gt("expiry_date", new Date().toISOString())
      .order("booking_date", { ascending: false })
      .limit(1);

    console.log("active plans: "+bookings.length);
    if (!bookings?.length) {
      return res.json({ success: true, course: null });
    }

    const booking = bookings[0];

    // 3️⃣ Plan details
    const { data: plans } = await supabase
      .from("plan")
      .select("plan_name, sessions")
      .eq("plan_id", booking.plan_id)
      .limit(1);

    const plan = plans?.[0];
    console.log("returning the plan data: "+plan);
    console.log("total sessions in a plan: "+plan.sessions);

    // const { data: teacher } = await supabase
    //   .from("session")
    //   .select("*")
    //   .eq("outline_id", booking.outline_id,)

    return res.json({
      success: true,
      course: {
        desc:plan.description,
        outline_id: booking.outline_id,
        title: plan.plan_name,
        totalSessions: plan.sessions,
        remainingSessions: booking.remainingsessions,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


router.get("/sessions/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // 1️⃣ Student
    const { data: students } = await supabase
      .from("student")
      .select("s_id")
      .eq("uid", uid)
      .limit(1);

    if (!students?.length) {
      return res.json({ success: true, sessions: [] });
    }

    const s_id = students[0].s_id;

    // 2️⃣ All sessions of student
    const { data: sessions } = await supabase
      .from("session")
      .select("title, status, session_link, start_time")
      .eq("s_id", s_id)
      .order("start_time", { ascending: false });

    return res.json({
      success: true,
      sessions: sessions || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;