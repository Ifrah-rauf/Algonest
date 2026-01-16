import express from "express";
import {supabase} from "../lib/supabase.js";

const router = express.Router();

// GET all teachers
// router.get("/getAllTeachers", async (req, res) => {
//   try {
//     const { plan } = req.query;
//     let query = supabase
//       .from("teacher")
//       .select(`
//         t_id,
//         name,
//         bio,
//         education,
//         pfp,
//         rating,
//         experience,
//         teaching_style,
//         video_url,
//         verified,
//         meeting_link,
//         languages:languages(
//         id,l1,l2,l3,l4),
//         frameworks:frameworks(
//         id,f1,f2,f3),
//         specialisation: specialisation (
//           sp_id,
//           sp1,
//           sp2,
//           sp3,
//           sp4
//         )
//       `)
//       .order("t_id", { ascending: true });

//     // Optional filter
//     if (plan) {
//       const { data: mappings, error: mapError } = await supabase
//         .from("teacher_plan")
//         .select("t_id")
//         .eq("plan_id", plan);

//       if (mapError) throw mapError;
//       const teacherIds = mappings.map(m => m.t_id);

//       // If no teachers match, return empty list
//       if (teacherIds.length === 0) {
//         return res.json([]);
//       }
//       query = query.in("t_id", teacherIds);
//     }
//     const { data, error } = await query;
//     console.log(data);
//     if (error) throw error;
//     res.json(data);

//   } catch (err) {
//     console.error("Teacher fetch error:", err);
//     res.status(500).json({ error: "Failed to fetch teachers" });
//   }
// });


router.get("/getAllTeachers", async (req, res) => {
  try {
    const { plan, domain, lang, availability, search } = req.query;

    console.log("plan recieved in plan filter:", plan);
    console.log("domain recieved in domain filter:", domain);
    console.log("lang recieved in lang filter:", lang);
    console.log("av recieved in availability filter:", availability);

    /* ================= PLAN GROUP MAP ================= */
    const PLAN_GROUPS = {
      syllabus: [1, 2, 3, 4],
      project: [5, 6],
      dsa: [7, 8, 9],
      interview: [10],
    };

    let teacherIdsFromPlan = null;

    if (plan && PLAN_GROUPS[plan]) {
      const { data: mappings, error } = await supabase
        .from("teacher_plan")
        .select("t_id")
        .in("plan_id", PLAN_GROUPS[plan]);

      if (error) throw error;

      teacherIdsFromPlan = mappings.map(m => m.t_id);
      if (teacherIdsFromPlan.length === 0) return res.json([]);
    }

    /* ================= BASE QUERY ================= */
    let query = supabase
      .from("teacher")
      .select(`
        t_id,
        name,
        bio,
        education,
        pfp,
        rating,
        experience,
        teaching_style,
        video_url,
        verified,
        meeting_link,

        languages:languages (l1, l2, l3, l4),
        frameworks:frameworks (f1, f2, f3),
        specialisation:specialisation (sp1, sp2, sp3, sp4)
      `)
      .order("t_id", { ascending: true });

    if (teacherIdsFromPlan) {
      query = query.in("t_id", teacherIdsFromPlan);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    
    /* ================= DOMAIN FILTER ================= */
      if (domain) {
        const { data: specs, error } = await supabase
          .from("specialisation")
          .select("sp_id")
          .or(`sp1.eq.${domain},sp2.eq.${domain},sp3.eq.${domain},sp4.eq.${domain}`);

        if (error) throw error;

        if (!specs || specs.length === 0) {
          return res.json([]); // no matching domain
        }

        const specIds = specs.map(s => s.sp_id);

        query = query.in("specialisation_id", specIds);
      }


    /* ================= LANGUAGE FILTER ================= */
    if (lang) {
      const langs = lang.split(",");

      const orClause = langs
        .map(
          l =>
            `l1.eq.${l},l2.eq.${l},l3.eq.${l},l4.eq.${l}`
        )
        .join(",");

      const { data: langRows, error } = await supabase
        .from("languages")
        .select("id")
        .or(orClause);

      if (error) throw error;

      if (!langRows || langRows.length === 0) {
        return res.json([]); // no matching language
      }

      const langIds = langRows.map(l => l.id);

      query = query.in("language_id", langIds);
    }


    /* ================= AVAILABILITY FILTER ================= */
if (availability) {
  const ranges = {
    morning: [6, 11],
    afternoon: [12, 16],
    evening: [17, 22],
  };

  const range = ranges[availability];

  if (range) {
    const [start, end] = range;

    const { data: slots, error } = await supabase
      .rpc("get_teachers_by_availability", {
        start_hour: start,
        end_hour: end,
      });

    if (error) throw error;

    if (!slots || slots.length === 0) {
      return res.json([]);
    }

    const ids = slots.map(s => s.t_id);
    query = query.in("t_id", ids);
  }
}


    /* ================= FINAL ================= */
    const { data, error } = await query;
    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("getAllTeachers error:", err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});


router.get("/getFilterMeta", async (req, res) => {
  try {
    /* ---------- DOMAINS ---------- */
    const { data: specs, error: specErr } = await supabase
      .from("specialisation")
      .select("sp1, sp2, sp3, sp4");

    if (specErr) throw specErr;

    const domainSet = new Set();
    specs.forEach(row => {
      [row.sp1, row.sp2, row.sp3, row.sp4].forEach(v => {
        if (v) domainSet.add(v);
      });
    });

    /* ---------- LANGUAGES ---------- */
    const { data: langs, error: langErr } = await supabase
      .from("languages")
      .select("l1, l2, l3, l4");

    if (langErr) throw langErr;

    const langSet = new Set();
    langs.forEach(row => {
      [row.l1, row.l2, row.l3, row.l4].forEach(v => {
        if (v) langSet.add(v);
      });
    });

    /* ---------- RESPONSE ---------- */
    return res.json({
      domains: [...domainSet],
      languages: [...langSet],
    });

  } catch (err) {
    console.error("getFilterMeta error:", err);
    res.status(500).json({ error: "Failed to fetch filter metadata" });
  }
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

// routes/teachers.js

router.post("/isOwner", async (req, res) => {
  try {
    const { uid, teacherId } = req.body;
    if (!uid || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "uid and teacherId are required",
      });
    }
    console.log("TEACHER ID LOGGED IN: ",teacherId);
    const { data, error } = await supabase
      .from("teacher")
      .select("t_id")
      .eq("uid", uid)
      .single();

    if (error || !data) {
      return res.json({
        success: true,
        isOwner: false,
      });
    }

    const isOwner = data.t_id === Number(teacherId);

    return res.json({
      success: true,
      isOwner,
    });
  } catch (err) {
    console.error("isOwner error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { teacherId, slots } = req.body;

    if (!teacherId || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload",
      });
    }

    /* ----------------------------------------
       STEP 1: Fetch existing availability IDs
    ---------------------------------------- */

    const { data: existing, error: fetchError } = await supabase
      .from("availability")
      .select("a_id")
      .eq("teacher_id", teacherId);

    if (fetchError) throw fetchError;

    const existingIds = existing.map((s) => s.a_id);
    const incomingIds = slots
      .filter((s) => Number.isInteger(s.a_id))
      .map((s) => s.a_id);

    /* ----------------------------------------
       STEP 2: DELETE removed slots
       (exist in DB but not in frontend payload)
    ---------------------------------------- */

    const toDelete = existingIds.filter(
      (id) => !incomingIds.includes(id)
    );

    if (toDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("availability")
        .delete()
        .in("a_id", toDelete)
        .eq("teacher_id", teacherId);

      if (deleteError) throw deleteError;
    }

    /* ----------------------------------------
       STEP 3: UPSERT slots (insert + update)
    ---------------------------------------- */

    const upsertPayload = slots.map((s) => ({
      a_id: Number.isInteger(s.a_id) ? s.a_id : undefined, // let DB create new
      teacher_id: teacherId,
      kind: s.kind,
      day_of_week: s.kind === "WEEKLY" ? s.day_of_week : null,
      date: s.kind === "DATE" ? s.date : null,
      start_min: s.start_min,
      end_min: s.end_min,
      slot_granularity: s.slot_granularity,
      is_free: s.is_free,
      active: s.active,
      type: s.type,
      desc: s.desc,
      price: s.price,
    }));

    const { error: upsertError } = await supabase
      .from("availability")
      .upsert(upsertPayload, {
        onConflict: "a_id",
      });

    if (upsertError) throw upsertError;

    return res.json({
      success: true,
      message: "Availability saved successfully",
    });
  } catch (err) {
    console.error("Availability save error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save availability",
    });
  }
});



export default router;
