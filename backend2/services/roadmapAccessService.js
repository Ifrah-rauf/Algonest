import { supabase } from "../lib/supabase.js";
import { resolveStudentRoadmapContext } from "./roadmapContext.js";

export const FREE_AI_PROMPT_LIMIT = 10;

async function getCourseIdForLesson(lessonId) {
  const numericLessonId = Number(lessonId);
  if (!Number.isFinite(numericLessonId) || numericLessonId <= 0) return null;

  const { data, error } = await supabase
    .from("lessons")
    .select("course_id")
    .eq("lesson_id", numericLessonId)
    .maybeSingle();

  if (error) throw error;
  return data?.course_id || null;
}

async function countFreePrompts(studentId) {
  if (!studentId) return 0;

  const { count, error } = await supabase
    .from("conv_history")
    .select("*", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("role", "user");

  if (error) throw error;
  return count || 0;
}

async function getLatestCourseBooking(studentId, courseId) {
  if (!studentId || !courseId) return null;

  const { data, error } = await supabase
    .from("booking")
    .select("booking_id, s_id, course_id, booking_date, expiry_date, payment_status, payment_approved_at, booking_status")
    .eq("s_id", studentId)
    .eq("course_id", courseId)
    .in("payment_status", ["pending", "approved", "rejected"])
    .order("booking_date", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] || null;
}

function isExpiredBooking(booking) {
  if (!booking) return false;
  if (booking.booking_status === "expired") return true;
  if (!booking.expiry_date) return true;

  const expiryTime = new Date(booking.expiry_date).getTime();
  return !Number.isFinite(expiryTime) || expiryTime <= Date.now();
}

function getPaymentBlockedAccess({ status, roadmapContext, promptCount = 0 }) {
  const isRejected = status === "rejected";

  return {
    allowed: false,
    status: 403,
    reason: isRejected ? "payment_rejected" : "payment_pending",
    message: isRejected
      ? "Your payment was not approved. Please contact admin or submit a new booking request."
      : "Your booking is waiting for payment approval. AI access will unlock after admin approval.",
    roadmapContext,
    hasActiveBooking: false,
    promptCount,
    promptLimit: FREE_AI_PROMPT_LIMIT,
  };
}

export async function getRoadmapAccess({ uid, courseId = null, lessonId = null } = {}) {
  if (!uid) {
    return {
      allowed: false,
      status: 401,
      reason: "auth_required",
      message: "Login is required.",
    };
  }

  const roadmapContext = await resolveStudentRoadmapContext({ uid });
  const student = roadmapContext?.student || null;
  const selectedCourseId = roadmapContext?.roadmapCourseId || null;
  const requestedCourseId = courseId || await getCourseIdForLesson(lessonId);

  if (!student?.s_id) {
    return {
      allowed: false,
      status: 404,
      reason: "student_not_found",
      message: "Student account not found.",
      roadmapContext,
    };
  }

  if (!selectedCourseId) {
    return {
      allowed: false,
      status: 403,
      reason: "no_roadmap",
      message: "Select a roadmap before continuing.",
      roadmapContext,
    };
  }

  if (requestedCourseId && Number(selectedCourseId) !== Number(requestedCourseId)) {
    return {
      allowed: false,
      status: 403,
      reason: "other_roadmap",
      message: "This action is only enabled for your selected roadmap.",
      roadmapContext,
    };
  }

  const courseForPaymentCheck = requestedCourseId || selectedCourseId;
  const activeBookingForCourse =
    roadmapContext.activeBooking &&
    Number(roadmapContext.activeBooking.course_id) === Number(courseForPaymentCheck)
      ? roadmapContext.activeBooking
      : null;
  const latestCourseBooking =
    activeBookingForCourse || await getLatestCourseBooking(student.s_id, courseForPaymentCheck);

  if (latestCourseBooking && latestCourseBooking.payment_status !== "approved") {
    return getPaymentBlockedAccess({
      status: latestCourseBooking.payment_status,
      roadmapContext: {
        ...roadmapContext,
        activeBooking: latestCourseBooking,
      },
    });
  }

  if (latestCourseBooking?.payment_status === "approved" && isExpiredBooking(latestCourseBooking)) {
    return {
      allowed: false,
      status: 403,
      reason: "booking_expired",
      message: "Your plan has expired. Renew it to restore AI and paid roadmap access.",
      roadmapContext: {
        ...roadmapContext,
        activeBooking: latestCourseBooking,
      },
      hasActiveBooking: false,
      promptCount: await countFreePrompts(student.s_id),
      promptLimit: FREE_AI_PROMPT_LIMIT,
    };
  }

  if (!student.project_title) {
    return {
      allowed: false,
      status: 403,
      reason: "no_project",
      message: "Please feed your project title in your profile before continuing.",
      roadmapContext,
    };
  }

  const hasActiveBooking =
    (
      latestCourseBooking?.payment_status === "approved" &&
      !isExpiredBooking(latestCourseBooking)
    ) ||
    (
      roadmapContext.source === "booking" &&
      roadmapContext.activeBooking?.payment_status === "approved" &&
      !isExpiredBooking(roadmapContext.activeBooking)
    );
  const promptCount = hasActiveBooking ? 0 : await countFreePrompts(student.s_id);
  const freePromptLimitReached = !hasActiveBooking && promptCount >= FREE_AI_PROMPT_LIMIT;

  if (freePromptLimitReached) {
    return {
      allowed: false,
      status: 403,
      reason: "free_prompt_limit",
      message: "You have reached the 10-prompt limit for free users. Please book a plan to continue.",
      roadmapContext,
      hasActiveBooking,
      promptCount,
      promptLimit: FREE_AI_PROMPT_LIMIT,
    };
  }

  return {
    allowed: true,
    status: 200,
    reason: "allowed",
    message: "Allowed.",
    roadmapContext,
    hasActiveBooking,
    promptCount,
    promptLimit: FREE_AI_PROMPT_LIMIT,
  };
}

export function sendRoadmapAccessDenied(res, access) {
  return res.status(access.status || 403).json({
    success: false,
    error: access.message,
    message: access.message,
    reason: access.reason,
    promptCount: access.promptCount,
    promptLimit: access.promptLimit,
  });
}
