import { transporter } from "../utils/mailer.js";
import { supabase } from "../lib/supabase.js";
import dotenv from "dotenv";
dotenv.config();

/* ============================================================
   RESPONSE CODES — must match CODE constants in Availability.jsx
============================================================ */
export const CODE = {
  PLAN_EXPIRED:     "PLAN_EXPIRED",
  WRONG_PLAN:       "WRONG_PLAN",
  NO_SESSIONS:      "NO_SESSIONS",
  NOT_UNIQUE:       "NOT_UNIQUE",
  SESSION_BOOKED:   "SESSION_BOOKED",
  PAYMENT_REQUIRED: "PAYMENT_REQUIRED",
  SESSION_OPEN:     "SESSION_OPEN",
  PLAN_MATCH:       "PLAN_MATCH",
  CHECKPOINT_BLOCKED:"CHECKPOINT_BLOCKED",
  INTERVIEW_BLOCKED: "INTERVIEW_BLOCKED",
};

/* ============================================================
   HELPER — safe Supabase fetch with error throw
   Throws if Supabase returns an error, returns data otherwise.
============================================================ */
async function dbFetch({ query, label }) {
  const { data, error } = await query;
  if (error) throw new Error(`[${label}] ${error.message}`);
  return data;
}

async function getStudentIdByUid(userId) {
  if (!userId) return null;

  const student = await dbFetch({
    query: supabase.from("student").select("s_id").eq("uid", userId).maybeSingle(),
    label: "getStudentIdByUid/student",
  });

  return student?.s_id || null;
}

async function getBookingIdsByStudentId(studentId) {
  if (!studentId) return [];

  const bookings = await dbFetch({
    query: supabase.from("booking").select("booking_id").eq("s_id", studentId),
    label: "getBookingIdsByStudentId/bookings",
  });

  return (bookings || []).map((booking) => booking.booking_id).filter(Boolean);
}

export async function getStudentCheckpointBookingGuard({ userId = null, studentId = null, checkpointId = null }) {
  let resolvedStudentId = studentId;

  if (!resolvedStudentId && userId) {
    resolvedStudentId = await getStudentIdByUid(userId);
  }

  if (!resolvedStudentId) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      checkpointId: checkpointId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const progressRows = await dbFetch({
    query: supabase
      .from("checkpoints_progress")
      .select(`
        id,
        checkpoint_id,
        s_id,
        status,
        completed,
        completed_at,
        session_id,
        created_at,
        session:session_id (
          session_id,
          start_time,
          end_time,
          marked_by_teacher
        )
      `)
      .eq("s_id", resolvedStudentId)
      .order("created_at", { ascending: false }),
    label: "checkpointGuard/progress",
  });

  if (!progressRows?.length) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      checkpointId: checkpointId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const now = new Date();
  const latestAny = progressRows[0] || null;
  const activePending = progressRows.find((row) => {
    const session = row.session || null;
    const endTime = session?.end_time ? new Date(session.end_time) : null;
    return session && row.completed !== true && session.marked_by_teacher !== true && endTime && endTime > now;
  }) || null;

  if (!latestAny) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      checkpointId: checkpointId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  if (activePending) {
    const session = activePending.session || null;
    return {
      canBook: false,
      status: "AWAITING_COMPLETION",
      message: "You already have a checkpoint session pending completion.",
      checkpointId: activePending.checkpoint_id,
      sessionId: session?.session_id || activePending.session_id || null,
      cooldownEndsAt: session?.end_time ? new Date(session.end_time).toISOString() : null,
    };
  }

  const relevantRows = checkpointId
    ? progressRows.filter((row) => Number(row.checkpoint_id) === Number(checkpointId))
    : progressRows;

  if (!relevantRows?.length) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      checkpointId: checkpointId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const latestRelevant = relevantRows[0] || null;
  const session = latestRelevant?.session || null;
  const endTime = session?.end_time ? new Date(session.end_time) : null;
  const markedByTeacher = session?.marked_by_teacher === true;
  const cooldownEndsAt = endTime
    ? new Date(endTime.getTime() + 24 * 60 * 60 * 1000)
    : null;

  if (markedByTeacher) {
    if (!checkpointId) {
      return {
        canBook: true,
        status: "AVAILABLE",
        message: null,
        checkpointId: latestRelevant.checkpoint_id,
        sessionId: session?.session_id || latestRelevant.session_id || null,
        cooldownEndsAt: null,
      };
    }

    return {
      canBook: false,
      status: "COMPLETED",
      message: "This checkpoint is already completed.",
      checkpointId: latestRelevant.checkpoint_id,
      sessionId: session?.session_id || latestRelevant.session_id || null,
      cooldownEndsAt: null,
    };
  }

  if (!endTime || endTime > now) {
    return {
      canBook: false,
      status: "AWAITING_COMPLETION",
      message: "You already have a checkpoint session pending completion.",
      checkpointId: latestRelevant.checkpoint_id,
      sessionId: session?.session_id || latestRelevant.session_id || null,
      cooldownEndsAt: endTime ? endTime.toISOString() : null,
    };
  }

  if (checkpointId && Number(latestRelevant.checkpoint_id) === Number(checkpointId) && cooldownEndsAt && now < cooldownEndsAt) {
    return {
      canBook: false,
      status: "COOLDOWN",
      message: "You can rebook this checkpoint one day after the previous session expires.",
      checkpointId: latestRelevant.checkpoint_id,
      sessionId: session?.session_id || latestRelevant.session_id || null,
      cooldownEndsAt: cooldownEndsAt.toISOString(),
    };
  }

  return {
    canBook: true,
    status: "AVAILABLE",
    message: null,
    checkpointId: latestRelevant.checkpoint_id,
    sessionId: session?.session_id || latestRelevant.session_id || null,
    cooldownEndsAt: cooldownEndsAt ? cooldownEndsAt.toISOString() : null,
  };
}

export async function getStudentInterviewBookingGuard({ userId = null, studentId = null, interviewId = null }) {
  let resolvedStudentId = studentId;

  if (!resolvedStudentId && userId) {
    resolvedStudentId = await getStudentIdByUid(userId);
  }

  if (!resolvedStudentId) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      interviewId: interviewId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const bookingIds = await getBookingIdsByStudentId(resolvedStudentId);
  if (!bookingIds.length) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      interviewId: interviewId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const rows = await dbFetch({
    query: supabase
      .from("session")
      .select(`
        session_id,
        booking_id,
        start_time,
        end_time,
        marked_by_teacher,
        session_type,
        interview_sessions:interview_sessions (
          interview_sessions_id,
          interview_id,
          notes
        )
      `)
      .in("booking_id", bookingIds)
      .eq("session_type", "interview")
      .order("created_at", { ascending: false }),
    label: "interviewGuard/sessions",
  });

  if (!rows?.length) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      interviewId: interviewId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const now = new Date();
  const latestAny = rows[0];
  const activePending = rows.find((row) => {
    const endTime = row.end_time ? new Date(row.end_time) : null;
    return row.marked_by_teacher !== true && endTime && endTime > now;
  });

  if (activePending) {
    return {
      canBook: false,
      status: "AWAITING_COMPLETION",
      message: "You already have an interview session pending completion.",
      interviewId: interviewId || null,
      sessionId: activePending.session_id,
      cooldownEndsAt: activePending.end_time || null,
    };
  }

  const interviewRows = await dbFetch({
    query: supabase
      .from("interview_sessions")
      .select(`
        interview_sessions_id,
        interview_id,
        session_id,
        notes,
        session:session_id (
          session_id,
          start_time,
          end_time,
          marked_by_teacher
        )
      `)
      .in("session_id", rows.map((row) => row.session_id)),
    label: "interviewGuard/interviewSessions",
  });

  const latestRelevant = interviewId
    ? interviewRows.find((row) => Number(row.interview_id) === Number(interviewId)) || null
    : interviewRows[0] || null;

  if (!latestRelevant) {
    return {
      canBook: true,
      status: "AVAILABLE",
      message: null,
      interviewId: interviewId || null,
      sessionId: null,
      cooldownEndsAt: null,
    };
  }

  const session = latestRelevant.session || null;
  const endTime = session?.end_time ? new Date(session.end_time) : null;
  const markedByTeacher = session?.marked_by_teacher === true;
  const cooldownEndsAt = endTime ? new Date(endTime.getTime() + 24 * 60 * 60 * 1000) : null;

  if (markedByTeacher) {
    return {
      canBook: false,
      status: "COMPLETED",
      message: "This interview is already completed.",
      interviewId: latestRelevant.interview_id,
      sessionId: session?.session_id || latestRelevant.session_id || null,
      cooldownEndsAt: null,
    };
  }

  if (!endTime || endTime > now) {
    return {
      canBook: false,
      status: "AWAITING_COMPLETION",
      message: "You already have an interview session pending completion.",
      interviewId: latestRelevant.interview_id,
      sessionId: session?.session_id || latestRelevant.session_id || null,
      cooldownEndsAt: endTime ? endTime.toISOString() : null,
    };
  }

  return {
    canBook: true,
    status: "AVAILABLE",
    message: null,
    interviewId: latestRelevant.interview_id,
    sessionId: session?.session_id || latestRelevant.session_id || null,
    cooldownEndsAt: cooldownEndsAt ? cooldownEndsAt.toISOString() : null,
  };
}

/* ============================================================
   1) CREATE BOOKING
   - Sends a confirmation email when a new booking/plan is created
============================================================ */
export async function createBookingService(booking) {
  const senderMail = process.env.SENDER_MAIL;
  if (!senderMail) throw new Error("SENDER_MAIL env variable is not set");

  await transporter.sendMail({
    from: `"AlgoNest" <${senderMail}>`,
    to: booking.email,
    subject: "Your AlgoNest Booking is Confirmed 🎉",
    html: `
      <h2 style="color:#6b46c1">Booking Confirmed for ${booking.plan}</h2>
      <p>Hi ${booking.username}, thanks for booking with <strong>AlgoNest</strong>.</p>
      <p><strong>Name:</strong> ${booking.username} ${booking.lastname}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Contact:</strong> ${booking.contact}</p>
      <p><strong>Requirement:</strong> ${booking.req}</p>
      <p><strong>Role:</strong> ${booking.role}</p>
      <p>Our team will reach out soon!</p>
    `,
  });

  return booking;
}

/* ============================================================
   2) BOOKING MAIL
   - Fetches student, teacher, slot info and sends session email
   - Called after successful session booking
============================================================ */
export async function bookingMailService({ studentId, slot }) {
  const senderMail = process.env.SENDER_MAIL;
  if (!senderMail) throw new Error("SENDER_MAIL env variable is not set");

  // Fetch student
  const student = await dbFetch({
    query: supabase.from("student").select("*").eq("s_id", studentId).maybeSingle(),
    label: "bookingMailService/student",
  });
  if (!student) throw new Error("Student not found");

  // Fetch auth record for email address
  const auth = await dbFetch({
    query: supabase.from("auth").select("*").eq("uid", student.uid).maybeSingle(),
    label: "bookingMailService/auth",
  });
  if (!auth) throw new Error("Auth record not found");

  // Fetch slot with nested availability in one query
  const slotData = await dbFetch({
    query: supabase
      .from("timeslot")
      .select("*, availability:availabilityid(*)")
      .eq("slot_id", slot.slot_id)
      .maybeSingle(),
    label: "bookingMailService/slotData",
  });
  if (!slotData) throw new Error("TimeSlot not found");

  // Fetch teacher via availability's teacherid
  const teacher = await dbFetch({
    query: supabase
      .from("teacher")
      .select("*")
      .eq("t_id", slotData.availability.teacherid)
      .maybeSingle(),
    label: "bookingMailService/teacher",
  });
  if (!teacher) throw new Error("Teacher not found");

  const booking = await dbFetch({
    query: supabase
      .from("booking")
      .select("booking_id")
      .eq("s_id", studentId)
      .order("booking_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    label: "bookingMailService/booking",
  });

  // Fetch the session record to get the Zoom join_url
  const session = booking?.booking_id
    ? await dbFetch({
        query: supabase
          .from("session")
          .select("join_url")
          .eq("booking_id", booking.booking_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        label: "bookingMailService/session",
      })
    : null;

  // Format date/time
  const date = new Date(slotData.startat).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const startTime = new Date(slotData.startat).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(slotData.endat).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  await transporter.sendMail({
    from: `"AlgoNest" <${senderMail}>`,
    to: auth.email,
    subject: "Your AlgoNest Session is Booked! 🎉",
    html: `
      <h2 style="color:#6b46c1">Session Confirmed 🎉</h2>
      <p>Hi ${student.name}, your mentorship session has been booked.</p>
      <p><strong>Mentor:</strong> ${teacher.name}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${startTime} – ${endTime}</p>
      <p><strong>Duration:</strong> ${slotData.durationmin} mins</p>
      ${
        slotData.availability.isfree
          ? "<p>✓ Free Session</p>"
          : `<p>Payment: ₹${slotData.availability.price}</p>`
      }
      ${
        session?.join_url
          ? `<p><a href="${session.join_url}" style="color:#6b46c1;font-weight:bold;">Join Meeting</a></p>`
          : ""
      }
      <p style="color:gray;font-size:12px;">If you have any questions, contact us at support@algonest.in</p>
    `,
  });

  return { student, teacher, slotData };
}

/* ============================================================
   3) GET PLAN
   - Verifies the student's role and active plan
   - Checks if teacher offers the student's subscribed plan
   - Returns code + studentId + planData for the frontend to use
============================================================ */
export async function getPlanService({ userId, teacherId, slot }) {
  // Verify role
  const roleData = await dbFetch({
    query: supabase.from("auth").select("role").eq("uid", userId).maybeSingle(),
    label: "getPlanService/auth",
  });
  if (!roleData || roleData.role !== "STUDENT") {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "You need a student account to book sessions.",
    };
  }

  // Fetch student
  const student = await dbFetch({
    query: supabase.from("student").select("s_id").eq("uid", userId).maybeSingle(),
    label: "getPlanService/student",
  });
  if (!student) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "Student record not found.",
    };
  }
  const studentId = student.s_id;

  const checkpointGuard = await getStudentCheckpointBookingGuard({ userId, studentId });
  if (!checkpointGuard.canBook) {
    return {
      success: false,
      code: CODE.CHECKPOINT_BLOCKED,
      message: checkpointGuard.message || "You already have a checkpoint session pending completion.",
      checkpointStatus: checkpointGuard,
    };
  }

  // Fetch the LATEST booking only
  const booking = await dbFetch({
    query: supabase
      .from("booking")
      .select("*")
      .eq("s_id", studentId)
      .order("booking_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    label: "getPlanService/booking",
  });

  if (!booking) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "No active plan found. Please subscribe to continue.",
    };
  }

  // Check expiry
  if (new Date(booking.expiry_date) < new Date()) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "Your plan has expired. Please renew to continue.",
    };
  }

  // Check remaining sessions
  if (booking.remainingsessions <= 0) {
    return {
      success: false,
      code: CODE.NO_SESSIONS,
      message: "You have no remaining sessions. Please renew your plan.",
    };
  }

  const slotType = slot?.availability?.type;

  // Open session — available to anyone with a valid plan
  if (slotType === "session") {
    return {
      success: true,
      code: CODE.SESSION_OPEN,
      message: "This session is available for anyone with an active plan.",
      studentId,
      planData: null,
    };
  }

  // Course-matched slot — check teacher offers the student's mapped course
  if (slotType === "plan") {
    const teacherCourse = await dbFetch({
      query: supabase
        .from("course_teacher_mapping")
        .select("id, created_at, t_id, course_id")
        .eq("t_id", teacherId)
        .eq("course_id", booking.course_id),
      label: "getPlanService/courseTeacherMapping",
    });

    if (!teacherCourse || teacherCourse.length === 0) {
      return {
        success: false,
        code: CODE.WRONG_PLAN,
        message: "This teacher does not offer your subscribed course.",
      };
    }

    return {
      success: true,
      code: CODE.PLAN_MATCH,
      message: "Your course matches. Ready to book!",
      studentId,
      planData: teacherCourse,
    };
  }

  // Unknown slot type — fail safely
  return {
    success: false,
    code: CODE.WRONG_PLAN,
    message: `Unrecognised slot type: "${slotType}". Please contact support.`,
  };
}

/* ============================================================
   4) GET TIME SLOTS
   - Fetches available (unbooked) slots for a teacher
   - Uses correct column name: teacherid (not t_id)
============================================================ */
export async function getTimeSlotsService({ teachers_id }) {
  const availSlots = await dbFetch({
    query: supabase
      .from("timeslot")
      .select(
        "slot_id, teacherid, startat, endat, durationmin, isbooked, availability:availabilityid(*)"
      )
      .eq("teacherid", teachers_id)
      .eq("isbooked", false)
      .order("startat", { ascending: true }),
    label: "getTimeSlotsService",
  });

  return { success: true, message: "Slots fetched", availSlots };
}

/* ============================================================
   5) BOOK PLAN CORE
   - Order of operations (safe):
     1. Validate booking exists, not expired, has sessions
     2. Check payment requirement BEFORE touching any data
     3. Mark slot as booked
     4. Deduct session
     5. Create slotbooking record
     6. Fetch outline
   - Returns codes the frontend can act on
============================================================ */
export async function bookPlanCore({ studentId, slot, checkpointId = null, interviewId = null }) {
  // Verify student exists and has STUDENT role in auth table
  if (!studentId) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "Student id not provided.",
    };
  }

  const studentRecord = await dbFetch({
    query: supabase.from("student").select("s_id, uid").eq("s_id", studentId).maybeSingle(),
    label: "bookPlanCore/student",
  });

  if (!studentRecord) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "Student record not found.",
    };
  }

  const authRecord = await dbFetch({
    query: supabase.from("auth").select("role").eq("uid", studentRecord.uid).maybeSingle(),
    label: "bookPlanCore/auth",
  });

  if (!authRecord || authRecord.role !== "STUDENT") {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "You need a student account to book sessions.",
    };
  }

  const checkpointStatus = await getStudentCheckpointBookingGuard({ studentId, checkpointId });
  if (!checkpointStatus.canBook) {
    return {
      success: false,
      code: CODE.CHECKPOINT_BLOCKED,
      message: checkpointStatus.message || "Checkpoint booking is currently blocked.",
      checkpointStatus,
    };
  }

  if (interviewId) {
    const interviewStatus = await getStudentInterviewBookingGuard({ studentId, interviewId });
    if (!interviewStatus.canBook) {
      return {
        success: false,
        code: CODE.INTERVIEW_BLOCKED,
        message: interviewStatus.message || "Interview booking is currently blocked.",
        interviewStatus,
      };
    }
  }

  // Fetch the LATEST active booking
  const bookingData = await dbFetch({
    query: supabase
      .from("booking")
      .select("*")
      .eq("s_id", studentId)
      .order("booking_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    label: "bookPlanCore/booking",
  });

  if (!bookingData) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "No active plan found.",
    };
  }

  if (new Date(bookingData.expiry_date) < new Date()) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "Your plan has expired.",
    };
  }

  if (bookingData.remainingsessions <= 0) {
    return {
      success: false,
      code: CODE.NO_SESSIONS,
      message: "No remaining sessions.",
    };
  }

  // Fetch availability FIRST — check payment before touching any data
  const availability = await dbFetch({
    query: supabase
      .from("availability")
      .select("*")
      .eq("a_id", slot.availabilityid)
      .maybeSingle(),
    label: "bookPlanCore/availability",
  });

  if (!availability) {
    return {
      success: false,
      code: CODE.PLAN_EXPIRED,
      message: "Availability record not found for this slot.",
    };
  }

  // Payment check BEFORE any writes
  if (!availability.isfree && availability.type === "session") {
    return {
      success: false,
      code: CODE.PAYMENT_REQUIRED,
      paymentRequired: true,
      amount: availability.price || 0,
      message: "Payment required for this session.",
    };
  }

  // ── all validations passed — now write ──────────────────

  // 1. Mark slot as booked
  const { error: slotError } = await supabase
    .from("timeslot")
    .update({ isbooked: true })
    .eq("slot_id", slot.slot_id);

  if (slotError) throw new Error(`[bookPlanCore/markSlot] ${slotError.message}`);

  // 2. Deduct one session from the booking
  const { error: deductError } = await supabase
    .from("booking")
    .update({ remainingsessions: bookingData.remainingsessions - 1 })
    .eq("booking_id", bookingData.booking_id);

  if (deductError) {
    // Compensate — unmark the slot so it's not permanently blocked
    await supabase
      .from("timeslot")
      .update({ isbooked: false })
      .eq("slot_id", slot.slot_id);
    throw new Error(`[bookPlanCore/deductSession] ${deductError.message}`);
  }

  // 3. Create slotbooking record
  const slotBookingData = await dbFetch({
    query: supabase
      .from("slotbooking")
      .insert([{
        slotid: slot.slot_id,
        studentid: studentId,
        bookingid: bookingData.booking_id,
        requirespayment: !availability.isfree,
        createdat: new Date().toISOString(),
      }])
      .select()
      .single(),
    label: "bookPlanCore/slotbooking",
  });

  // 4. Fetch latest plan outline for this student
  // plan_outline is deprecated — do not require an outline to complete booking.
  // Return booking identifiers; frontend should use booking.plan_id from booking record if needed.
  console.debug("bookPlanCore: skipping plan_outline lookup (deprecated)");

  return {
    success: true,
    booking_id: bookingData.booking_id,
    sb_id: slotBookingData.sb_id,
  };
}

/* ============================================================
   6) CREATE SESSION RECORD
   - Inserts the session row after Zoom meeting is created
   - Called by the controller after bookPlanCore succeeds
============================================================ */
export async function createSessionRecord({ bookingId, slot, meeting, sb_id, sessionType = "session" }) {
  const { data, error } = await supabase
    .from("session")
    .insert([{
      booking_id: bookingId,
      t_id: slot.teacherid,
      zoom_meeting_id: meeting.id,
      start_time: slot.startat,
      end_time: slot.endat,
      duration: slot.durationmin,
      feedback: null,
      status: "VALID",
      title: sessionType === "interview"
        ? "AlgoNest Interview"
        : sessionType === "checkpoint"
        ? "AlgoNest Checkpoint"
        : "AlgoNest Session",
      join_url: meeting.join_url,
      start_url: meeting.start_url,
      session_link: meeting.join_url,
      session_type: sessionType,
      sb_id,
    }])
    .select()
    .single();

  if (error) {
    console.error("[createSessionRecord] Insert error:", error);
    throw new Error(`Session insert failed: ${error.message}`);
  }

  return {
    success: true,
    code: CODE.SESSION_BOOKED,
    message: "Session Booked Successfully",
    time: slot.startat,
    session: data,
  };
}
