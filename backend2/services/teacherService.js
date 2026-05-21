import { supabase } from "../lib/supabase.js";

/* ============================================================
   Fetch all teachers with optional filters
============================================================ */
export async function fetchAllTeachers(filters) {
  const { plan, domain, lang, availability, search } = filters;

  // Plan groups mapping
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
    if (teacherIdsFromPlan.length === 0) return [];
  }

  // Base query
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

  // Domain filter
  if (domain) {
    const { data: specs, error } = await supabase
      .from("specialisation")
      .select("sp_id")
      .or(`sp1.eq.${domain},sp2.eq.${domain},sp3.eq.${domain},sp4.eq.${domain}`);

    if (error) throw error;
    if (!specs?.length) return [];

    const specIds = specs.map(s => s.sp_id);
    query = query.in("specialisation_id", specIds);
  }

  // Language filter
  if (lang) {
    const langs = lang.split(",");
    const orClause = langs.map(l => `l1.eq.${l},l2.eq.${l},l3.eq.${l},l4.eq.${l}`).join(",");

    const { data: langRows, error } = await supabase
      .from("languages")
      .select("id")
      .or(orClause);

    if (error) throw error;
    if (!langRows?.length) return [];

    const langIds = langRows.map(l => l.id);
    query = query.in("language_id", langIds);
  }

  // Availability filter
  if (availability) {
    const ranges = {
      morning: [6, 11],
      afternoon: [12, 16],
      evening: [17, 22],
    };
    const range = ranges[availability];

    if (range) {
      const [start, end] = range;
      const { data: slots, error } = await supabase.rpc("get_teachers_by_availability", {
        start_hour: start,
        end_hour: end,
      });

      if (error) throw error;
      if (!slots?.length) return [];

      const ids = slots.map(s => s.t_id);
      query = query.in("t_id", ids);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/* ============================================================
   Fetch filter metadata (domains + languages)
============================================================ */
export async function fetchFilterMeta() {
  const { data: specs, error: specErr } = await supabase
    .from("specialisation")
    .select("sp1, sp2, sp3, sp4");
  if (specErr) throw specErr;

  const domainSet = new Set();
  specs.forEach(row => [row.sp1, row.sp2, row.sp3, row.sp4].forEach(v => v && domainSet.add(v)));

  const { data: langs, error: langErr } = await supabase
    .from("languages")
    .select("l1, l2, l3, l4");
  if (langErr) throw langErr;

  const langSet = new Set();
  langs.forEach(row => [row.l1, row.l2, row.l3, row.l4].forEach(v => v && langSet.add(v)));

  return {
    domains: [...domainSet],
    languages: [...langSet],
  };
}

/* ============================================================
   Fetch teacher by ID (with availability + timeslots)
============================================================ */
export async function fetchTeacherById(id) {
  const { data: teacherData, error: error1 } = await supabase
    .from("teacher")
    .select(`
    *,
    specialisation ( sp1, sp2, sp3, sp4 ),
    languages ( l1, l2, l3, l4 ),
    frameworks ( f1, f2, f3 )
  `)
    .eq("t_id", id)
    .single();

  const { data: availabilityData, error: error2 } = await supabase
    .from("availability")
    .select("*")
    .eq("teacherid", id)
    .order("dayofweek", { ascending: true });

  const { data: timeSlotsData, error: error3 } = await supabase
    .from("timeslot")
    .select(`*, availability:availabilityid ( type, desc, isfree, active )`)
    .eq("teacherid", id)
    .order("startat", { ascending: true });

  if (error1 || error2 || error3) throw (error1 || error2 || error3);
  console.log("teacher video: "+teacherData.video_url);
  return {
    teacher: teacherData,
    avail: availabilityData,
    timeSlots: timeSlotsData,
  };
}

/* ============================================================
   Fetch mentors by plan IDs
============================================================ */

export async function getMentorsByDomain(domain) {
  if (!domain) return { mentors: [] };

  // 1. Get all courses for this domain
  const { data: courses, error: courseError } = await supabase
    .from("courses")
    .select("course_id")
    .eq("domain", domain);

  if (courseError) throw new Error(courseError.message);
  if (!courses?.length) return { mentors: [] };

  const courseIds = courses.map(c => c.course_id);

  // 2. Get all teacher mappings for those courses
  const { data: mappings, error: teacherError } = await supabase
    .from("course_teacher_mapping")
    .select("t_id")
    .in("course_id", courseIds);

  if (teacherError) throw new Error(teacherError.message);
  if (!mappings?.length) return { mentors: [] };

  const ids = mappings.map(m => m.t_id);

  // 3. Fetch teacher details
  const { data: teacherDetails, error: detailError } = await supabase
    .from("teacher")
    .select("t_id, name, bio, pfp, verified, specialisation_id, experience")
    .in("t_id", ids);

  if (detailError) throw new Error(detailError.message);

  return { mentors: teacherDetails || [] };
}


export async function fetchMentors(planIds) {
  const { data: mapping, error: mapErr } = await supabase
    .from("teacher_plan")
    .select("t_id")
    .in("plan_id", planIds);
  if (mapErr) throw mapErr;

  const teacherIds = mapping.map(m => m.t_id);
  if (!teacherIds.length) return [];

  const { data: mentors, error: mentorErr } = await supabase
    .from("teacher")
    .select("*")
    .in("t_id", teacherIds);
  if (mentorErr) throw mentorErr;

  return mentors;
}

/* ============================================================
   Check if a user is the owner of a teacher profile
============================================================ */
export async function checkIsOwner(uid, teacherId) {
  const { data, error } = await supabase
    .from("teacher")
    .select("t_id")
    .eq("uid", uid)
    .single();

  if (error || !data) return { success: true, isOwner: false };
  const isOwner = data.t_id === Number(teacherId);
  return { success: true, isOwner };
}

/* ============================================================
   Save teacher availability (upsert slots)
============================================================ */
export async function saveTeacherAvailability(teacherid, slots) {
  const { data: existing, error: fetchError } = await supabase
    .from("availability")
    .select("a_id")
    .eq("teacherid", teacherid);
  if (fetchError) throw fetchError;

  const existingIds = existing.map(s => s.a_id);
  const incomingIds = slots.filter(s => Number.isInteger(s.a_id)).map(s => s.a_id);
const toDelete = existingIds.filter(id => !incomingIds.includes(id));
if (toDelete.length > 0) {
  // Step 1: Find all timeslots linked to these availability rows
  const { data: timeslots, error: tsFetchError } = await supabase
    .from("timeslot")
    .select("slot_id")
    .in("availabilityid", toDelete);

  if (tsFetchError) throw tsFetchError;

  const slotIds = timeslots.map(ts => ts.slot_id);

  // Step 2: Delete bookings tied to those timeslots
  if (slotIds.length > 0) {
    const { error: bookingDeleteError } = await supabase
      .from("slotbooking")
      .delete()
      .in("slotid", slotIds);

    if (bookingDeleteError) throw bookingDeleteError;
  }

  // Step 3: Delete timeslots tied to those availability rows
  const { error: tsDeleteError } = await supabase
    .from("timeslot")
    .delete()
    .in("availabilityid", toDelete);

  if (tsDeleteError) throw tsDeleteError;

  // Step 4: Finally delete the availability rows
  const { error: deleteError } = await supabase
    .from("availability")
    .delete()
    .in("a_id", toDelete)
    .eq("teacherid", teacherid);

  if (deleteError) throw deleteError;
}


  // Upsert slots
 const upsertPayload = slots.map(s => ({
  a_id: Number.isInteger(s.a_id) ? s.a_id : undefined,
  teacherid: teacherid,             // matches DB
  kind: s.kind,
  dayofweek: s.kind === "WEEKLY" ? s.dayofweek : null,
  date: s.kind === "DATE" ? s.date : null,
  startmin: s.startmin,
  endmin: s.endmin,
  slotgranularity: s.slotgranularity,
  isfree: s.isfree,
  active: s.active,
  type: s.type,
  desc: s.desc,
  price: s.price,
}));
console.log("Upsert payload:", upsertPayload);


  const { error: upsertError } = await supabase
    .from("availability")
    .upsert(upsertPayload, { onConflict: "a_id" });
  if (upsertError) throw upsertError;

  return { success: true, message: "Availability saved successfully" };
}
