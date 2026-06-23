import { supabase } from "../lib/supabase.js";

function normalizeCourse(courseRow) {
  if (!courseRow) return null;

  return {
    courseId: courseRow.course_id,
    title: courseRow.title || "Untitled roadmap",
    desc: courseRow.description || "",
    description: courseRow.description || "",
    domain: courseRow.domain || null,
    type: courseRow.type || null,
    courseStatus: courseRow.status || null,
  };
}

async function getStudentRow({ uid = null, sId = null } = {}) {
  let query = supabase
    .from("student")
    .select(`
      s_id, uid, name, bio, education, pfp, total_bookings, active_booking_id, course_id,
      student_project (
        course_id,
        project_id,
        custom_title
      )
    `);

  if (uid) {
    query = query.eq("uid", uid).maybeSingle();
  } else if (sId) {
    query = query.eq("s_id", sId).maybeSingle();
  } else {
    return null;
  }

  const { data, error } = await query;
  if (error) throw error;
  
  return data || null;
}

function attachProjectForCourse(student, courseId) {
  if (!student) return student;

  const projects = Array.isArray(student.student_project) ? student.student_project : [];
  const matchingProject = projects.find(
    (project) => Number(project.course_id) === Number(courseId)
  );
  const fallbackProject = courseId ? {} : projects[0] || {};

  return {
    ...student,
    project_title: matchingProject?.custom_title || fallbackProject.custom_title || null,
    project_details: null,
  };
}

async function getBookingById(bookingId) {
  if (!bookingId) return null;

  const { data, error } = await supabase
    .from("booking")
    .select("booking_id, s_id, course_id, booking_date, expiry_date, remainingsessions, payment_status, payment_approved_at, booking_status")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function getCourseById(courseId) {
  if (!courseId) return null;

  const { data, error } = await supabase
    .from("courses")
    .select("course_id, title, description, domain, type, status")
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function resolveStudentRoadmapContext({ uid = null, sId = null } = {}) {
  const student = await getStudentRow({ uid, sId });
  if (!student) {
    return {
      student: null,
      source: "none",
      activeBooking: null,
      roadmap: null,
      selectedCourse: null,
      activeCourse: null,
      roadmapCourseId: null,
      domain: null,
      domainSource: null,
      hasRoadmap: false,
    };
  }

  const activeBookingId = student.active_booking_id || null;

  if (activeBookingId) {
    const booking = await getBookingById(activeBookingId);
    const bookingCourseId = booking?.course_id || null;
    const bookingCourse = await getCourseById(bookingCourseId);

    if (booking && bookingCourse) {
      const roadmap = normalizeCourse(bookingCourse);
      const domain = roadmap?.domain || null;
      const studentWithDomain = {
        ...attachProjectForCourse(student, roadmap.courseId),
        domain,
        domainSource: "booking",
      };

      return {
        student: studentWithDomain,
        source: "booking",
        activeBooking: booking,
        roadmap,
        selectedCourse: roadmap,
        activeCourse: {
          ...roadmap,
          booking_id: booking.booking_id,
          booking_date: booking.booking_date,
          expiry_date: booking.expiry_date,
          totalSessions: booking.remainingsessions,
          remainingSessions: booking.remainingsessions,
        },
        roadmapCourseId: roadmap.courseId,
        domain,
        domainSource: "booking",
        hasRoadmap: true,
      };
    }

    return {
      student: {
        ...student,
        domain: null,
        domainSource: "booking",
      },
      source: "booking",
      activeBooking: booking || null,
      roadmap: null,
      selectedCourse: null,
      activeCourse: null,
      roadmapCourseId: null,
      domain: null,
      domainSource: "booking",
      hasRoadmap: Boolean(booking),
    };
  }

  if (student.course_id) {
    const course = await getCourseById(student.course_id);
    if (course) {
      const roadmap = normalizeCourse(course);
      const domain = roadmap?.domain || null;
      const studentWithDomain = {
        ...attachProjectForCourse(student, roadmap.courseId),
        domain,
        domainSource: "course",
      };

      return {
        student: studentWithDomain,
        source: "profile",
        activeBooking: null,
        roadmap,
        selectedCourse: roadmap,
        activeCourse: null,
        roadmapCourseId: roadmap.courseId,
        domain,
        domainSource: "course",
        hasRoadmap: true,
      };
    }
  }

  const studentWithDomain = {
    ...attachProjectForCourse(student, null),
    domain: null,
    domainSource: null,
  };

  return {
    student: studentWithDomain,
    source: "none",
    activeBooking: null,
    roadmap: null,
    selectedCourse: null,
    activeCourse: null,
    roadmapCourseId: null,
    domain: null,
    domainSource: null,
    hasRoadmap: false,
  };
}
