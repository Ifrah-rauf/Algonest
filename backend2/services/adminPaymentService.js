import { supabase } from "../lib/supabase.js";

async function dbFetch({ query, label }) {
  const { data, error } = await query;
  if (error) throw new Error(`[${label}] ${error.message}`);
  return data;
}

function uniq(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined))];
}

function dedupeBookingsByStudentRoadmap(bookings) {
  const seen = new Set();
  const rows = [];

  for (const booking of bookings || []) {
    const key = `${booking.s_id || "student"}:${booking.course_id || "course"}:${booking.payment_status || "status"}`;
    if (seen.has(key)) continue;

    seen.add(key);
    rows.push(booking);
  }

  return rows;
}

async function hydrateBookingRows(bookings) {
  const rows = bookings || [];
  if (!rows.length) return [];

  const studentIds = uniq(rows.map((booking) => booking.s_id));
  const courseIds = uniq(rows.map((booking) => booking.course_id));

  const students = studentIds.length
    ? await dbFetch({
        query: supabase
          .from("student")
          .select("s_id, uid, name")
          .in("s_id", studentIds),
        label: "adminPayments/students",
      })
    : [];

  const authRows = students.length
    ? await dbFetch({
        query: supabase
          .from("auth")
          .select("uid, email, name")
          .in("uid", students.map((student) => student.uid).filter(Boolean)),
        label: "adminPayments/auth",
      })
    : [];

  const courses = courseIds.length
    ? await dbFetch({
        query: supabase
          .from("courses")
          .select("course_id, title, domain")
          .in("course_id", courseIds),
        label: "adminPayments/courses",
      })
    : [];

  const studentById = Object.fromEntries(students.map((student) => [student.s_id, student]));
  const authByUid = Object.fromEntries(authRows.map((auth) => [auth.uid, auth]));
  const courseById = Object.fromEntries(courses.map((course) => [course.course_id, course]));

  return rows.map((booking) => {
    const student = studentById[booking.s_id] || null;
    return {
      ...booking,
      student,
      auth: student?.uid ? authByUid[student.uid] || null : null,
      course: booking.course_id ? courseById[booking.course_id] || null : null,
    };
  });
}

export async function listPaymentBookings(status = "pending") {
  const allowedStatuses = new Set(["pending", "approved", "rejected"]);
  const paymentStatus = allowedStatuses.has(status) ? status : "pending";

  const bookings = await dbFetch({
    query: supabase
      .from("booking")
      .select(`
        booking_id,
        s_id,
        plan_id,
        payment_id,
        booking_date,
        expiry_date,
        remainingsessions,
        course_id,
        project_id,
        payment_status,
        payment_approved_at,
        payment_approved_by,
        booking_status
      `)
      .eq("payment_status", paymentStatus)
      .order("booking_date", { ascending: false }),
    label: "adminPayments/bookings",
  });

  return hydrateBookingRows(dedupeBookingsByStudentRoadmap(bookings));
}

function getPlanDurationDays(booking) {
  const bookingTime = booking?.booking_date ? new Date(booking.booking_date).getTime() : NaN;
  const expiryTime = booking?.expiry_date ? new Date(booking.expiry_date).getTime() : NaN;

  if (Number.isFinite(bookingTime) && Number.isFinite(expiryTime) && expiryTime > bookingTime) {
    return Math.max(1, Math.round((expiryTime - bookingTime) / (24 * 60 * 60 * 1000)));
  }

  const courseDurations = { 1: 120, 2: 150, 3: 180 };
  return courseDurations[Number(booking?.course_id)] || 120;
}

export async function updateBookingPaymentStatus({ bookingId, status, approvedBy = null }) {
  const parsedBookingId = Number(bookingId);
  if (!Number.isFinite(parsedBookingId) || parsedBookingId <= 0) {
    throw new Error("booking_id is required");
  }

  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid payment status");
  }

  const currentBooking = await dbFetch({
    query: supabase
      .from("booking")
      .select("booking_id, s_id, course_id, booking_date, expiry_date, payment_status, booking_status")
      .eq("booking_id", parsedBookingId)
      .single(),
    label: "adminPayments/currentBooking",
  });

  if (currentBooking.payment_status !== "pending" || currentBooking.booking_status !== "pending") {
    throw new Error("Only pending bookings can be approved or rejected");
  }

  const now = new Date();
  const durationDays = getPlanDurationDays(currentBooking);

  const updatePayload = {
    payment_status: status,
    booking_status: status === "approved" ? "active" : "cancelled",
    payment_approved_at: status === "approved" ? now.toISOString() : null,
    payment_approved_by: status === "approved" ? approvedBy : null,
    expiry_date:
      status === "approved"
        ? new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString()
        : null,
  };

  const booking = await dbFetch({
    query: supabase
      .from("booking")
      .update(updatePayload)
      .eq("booking_id", parsedBookingId)
      .select(`
        booking_id,
        s_id,
        plan_id,
        payment_id,
        booking_date,
        expiry_date,
        remainingsessions,
        course_id,
        project_id,
        payment_status,
        payment_approved_at,
        payment_approved_by,
        booking_status
      `)
      .single(),
    label: "adminPayments/updateBooking",
  });

  if (status === "approved") {
    const student = await dbFetch({
      query: supabase
        .from("student")
        .select("s_id, total_bookings")
        .eq("s_id", booking.s_id)
        .single(),
      label: "adminPayments/student",
    });

    const { error: studentError } = await supabase
      .from("student")
      .update({
        active_booking_id: booking.booking_id,
        course_id: booking.course_id,
        total_bookings: Number(student.total_bookings || 0) + 1,
      })
      .eq("s_id", booking.s_id);

    if (studentError) {
      await supabase
        .from("booking")
        .update({
          payment_status: "pending",
          booking_status: "pending",
          payment_approved_at: null,
          payment_approved_by: null,
          expiry_date: currentBooking.expiry_date,
        })
        .eq("booking_id", booking.booking_id);

      throw new Error(`Failed to activate student booking: ${studentError.message}`);
    }
  } else {
    const { error: studentError } = await supabase
      .from("student")
      .update({ active_booking_id: null })
      .eq("active_booking_id", booking.booking_id);

    if (studentError) {
      throw new Error(`Booking rejected but failed to clear active booking: ${studentError.message}`);
    }
  }

  const [hydrated] = await hydrateBookingRows([booking]);
  return hydrated || booking;
}
