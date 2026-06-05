import { supabase } from "../lib/supabase.js";
import { transporter } from "../utils/mailer.js";
import { buildSessionReminderEmail } from "../utils/sessionReminderTemplates.js";

const REMINDER_WINDOW_MINUTES = 30;
const REMINDER_LOOKAHEAD_MINUTES = 5;

function toIso(value) {
  return new Date(value).toISOString();
}

async function getAuthEmailByUid(uid) {
  if (!uid) return null;

  const { data, error } = await supabase
    .from("auth")
    .select("uid, name, email, role")
    .eq("uid", uid)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

async function getSessionRecipients(sessionRow) {
  const [{ data: teacherRow, error: teacherError }, { data: bookingRow, error: bookingError }] =
    await Promise.all([
      sessionRow.t_id
        ? supabase.from("teacher").select("t_id, uid, name").eq("t_id", sessionRow.t_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      sessionRow.booking_id
        ? supabase.from("booking").select("booking_id, s_id").eq("booking_id", sessionRow.booking_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

  if (teacherError) throw teacherError;
  if (bookingError) throw bookingError;

  const teacherAuth = teacherRow?.uid ? await getAuthEmailByUid(teacherRow.uid) : null;
  const studentRow = bookingRow?.s_id
    ? await supabase.from("student").select("s_id, uid, name").eq("s_id", bookingRow.s_id).maybeSingle()
    : { data: null, error: null };
  if (studentRow.error) throw studentRow.error;
  const studentAuth = studentRow.data?.uid ? await getAuthEmailByUid(studentRow.data.uid) : null;

  return {
    teacher: {
      name: teacherRow?.name || "Teacher",
      email: teacherAuth?.email || null,
    },
    student: {
      name: studentRow.data?.name || "Student",
      email: studentAuth?.email || null,
    },
  };
}

async function sendReminderEmail({ recipientEmail, recipientLabel, teacherName, studentName, sessionRow }) {
  if (!recipientEmail) {
    return { sent: false, reason: "missing_email" };
  }

  const email = buildSessionReminderEmail({
    recipientLabel,
    teacherName,
    studentName,
    sessionTitle: sessionRow.title || "AlgoNest session",
    startTime: sessionRow.start_time,
    endTime: sessionRow.end_time,
    joinUrl: sessionRow.join_url || sessionRow.session_link || "",
  });

  await transporter.sendMail({
    from: `"AlgoNest" <${process.env.SENDER_MAIL || "algonest.edtech@gmail.com"}>`,
    to: recipientEmail,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });

  return { sent: true };
}

async function markReminderSent(sessionId, field) {
  const payload =
    field === "teacher"
      ? { reminder_teacher_30m_sent: true, reminder_teacher_30m_sent_at: new Date().toISOString() }
      : { reminder_student_30m_sent: true, reminder_student_30m_sent_at: new Date().toISOString() };

  const { error } = await supabase
    .from("session")
    .update(payload)
    .eq("session_id", sessionId);

  if (error) throw error;
}

export async function sendDueSessionReminders() {
  const now = new Date();
  const windowStart = new Date(now.getTime() + REMINDER_WINDOW_MINUTES * 60 * 1000);
  const windowEnd = new Date(windowStart.getTime() + REMINDER_LOOKAHEAD_MINUTES * 60 * 1000);

  const { data: sessions, error } = await supabase
    .from("session")
    .select(`
      session_id,
      title,
      start_time,
      end_time,
      join_url,
      session_link,
      booking_id,
      t_id,
      status,
      reminder_teacher_30m_sent,
      reminder_student_30m_sent
    `)
    .in("status", ["BOOKED", "LIVE"])
    .gte("start_time", toIso(windowStart))
    .lt("start_time", toIso(windowEnd))
    .or("reminder_teacher_30m_sent.is.false,reminder_student_30m_sent.is.false");

  if (error) throw error;

  const dueSessions = sessions || [];
  const results = [];

  for (const sessionRow of dueSessions) {
    try {
      const recipients = await getSessionRecipients(sessionRow);

      if (!sessionRow.reminder_teacher_30m_sent) {
        const teacherResult = await sendReminderEmail({
          recipientEmail: recipients.teacher.email,
          recipientLabel: recipients.teacher.name,
          teacherName: recipients.teacher.name,
          studentName: recipients.student.name,
          sessionRow,
        });

        if (teacherResult.sent) {
          await markReminderSent(sessionRow.session_id, "teacher");
        }
      }

      if (!sessionRow.reminder_student_30m_sent) {
        const studentResult = await sendReminderEmail({
          recipientEmail: recipients.student.email,
          recipientLabel: recipients.student.name,
          teacherName: recipients.teacher.name,
          studentName: recipients.student.name,
          sessionRow,
        });

        if (studentResult.sent) {
          await markReminderSent(sessionRow.session_id, "student");
        }
      }

      results.push({
        sessionId: sessionRow.session_id,
        sent: true,
      });
    } catch (err) {
      console.error("sendDueSessionReminders error:", err?.message || err);
      results.push({
        sessionId: sessionRow.session_id,
        sent: false,
        error: err?.message || "Failed to send reminder",
      });
    }
  }

  return results;
}
