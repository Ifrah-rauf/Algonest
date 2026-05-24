import { supabase } from "../lib/supabase.js";
import { transporter } from "../utils/mailer.js";

const TEACHER_QUERY_RECIPIENT = "ifrahraufddps@gmail.com";
const ACCOUNT_DELETION_RECIPIENT = "ifrahraufddps@gmail.com";
const GITHUB_REVIEW_RECIPIENT = "ifrahraufddps@gmail.com";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function scheduleSupport(studentId, teacherId, lessonId, time) {
  return await supabase.from("support_stages").insert({
    s_id: studentId,
    lesson_id: lessonId,
    teacher_id: teacherId,
    scheduled_at: time,
    completed: false,
    marked_by_teacher: false
  }).select();
}

export async function listSupportSessions(studentId) {
  return await supabase.from("support_stages").select("*").eq("s_id", studentId);
}

export async function sendTeacherQueryMail({ uid, subject, body }) {
  if (!uid || !subject || !body) {
    throw new Error("uid, subject and body are required");
  }

  const { data: authRow, error: authError } = await supabase
    .from("auth")
    .select("uid, name, email, role")
    .eq("uid", uid)
    .maybeSingle();

  if (authError) throw authError;
  if (!authRow) throw new Error("Teacher account not found");
  if (String(authRow.role || "").toUpperCase() !== "TEACHER") {
    throw new Error("Only teachers can send query emails");
  }
  if (!authRow.email) {
    throw new Error("Teacher email not found");
  }

  const cleanedSubject = String(subject).trim();
  const cleanedBody = String(body).trim();

  await transporter.sendMail({
    from: `"AlgoNest Teacher Query" <ifrahraufddps@gmail.com>`,
    to: TEACHER_QUERY_RECIPIENT,
    replyTo: authRow.email,
    subject: `[Teacher Query] ${cleanedSubject}`,
    text: `Teacher: ${authRow.name}\nTeacher Email: ${authRow.email}\n\n${cleanedBody}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 12px">AlgoNest Teacher Query</h2>
        <p><strong>Teacher:</strong> ${escapeHtml(authRow.name)}</p>
        <p><strong>Teacher Email:</strong> ${escapeHtml(authRow.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(cleanedSubject)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(cleanedBody)}</p>
      </div>
    `,
  });

  return {
    sent: true,
    teacherEmail: authRow.email,
    recipient: TEACHER_QUERY_RECIPIENT,
  };
}

export async function sendGithubReviewMail({ uid, githubUrl }) {
  if (!uid || !githubUrl) {
    throw new Error("uid and githubUrl are required");
  }

  const { data: authRow, error: authError } = await supabase
    .from("auth")
    .select("uid, name, email, role")
    .eq("uid", uid)
    .maybeSingle();

  if (authError) throw authError;
  if (!authRow) throw new Error("Student account not found");
  if (String(authRow.role || "").toUpperCase() !== "STUDENT") {
    throw new Error("Only students can submit repository reviews");
  }
  if (!authRow.email) {
    throw new Error("Student email not found");
  }

  const cleanedGithubUrl = String(githubUrl).trim();
  const cleanedName = escapeHtml(authRow.name || "AlgoNest Student");
  const cleanedEmail = escapeHtml(authRow.email);

  await transporter.sendMail({
    from: `"AlgoNest Project Review" <ifrahraufddps@gmail.com>`,
    to: GITHUB_REVIEW_RECIPIENT,
    replyTo: authRow.email,
    subject: `[GitHub Review Request] ${authRow.name || authRow.email || authRow.uid}`,
    text: `Student: ${authRow.name || "Student"}\nStudent Email: ${authRow.email}\nGitHub URL: ${cleanedGithubUrl}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 12px;color:#534AB7">GitHub Review Request</h2>
        <p><strong>Student:</strong> ${cleanedName}</p>
        <p><strong>Student Email:</strong> ${cleanedEmail}</p>
        <p><strong>GitHub URL:</strong> <a href="${escapeHtml(cleanedGithubUrl)}" target="_blank" rel="noreferrer">${escapeHtml(cleanedGithubUrl)}</a></p>
        <p>The student submitted a repository for review from the AlgoNest roadmap page.</p>
      </div>
    `,
  });

  return {
    sent: true,
    studentEmail: authRow.email,
    recipient: GITHUB_REVIEW_RECIPIENT,
  };
}

export async function sendAccountDeletionRequestMail({ uid }) {
  if (!uid) {
    throw new Error("uid is required");
  }

  const { data: authRow, error: authError } = await supabase
    .from("auth")
    .select("uid, name, email, role")
    .eq("uid", uid)
    .maybeSingle();

  if (authError) throw authError;
  if (!authRow) throw new Error("Account not found");

  const cleanedName = escapeHtml(authRow.name || "AlgoNest User");
  const cleanedEmail = escapeHtml(authRow.email || "");
  const cleanedRole = escapeHtml(authRow.role || "STUDENT");

  await transporter.sendMail({
    from: `"AlgoNest Account Requests" <ifrahraufddps@gmail.com>`,
    to: ACCOUNT_DELETION_RECIPIENT,
    replyTo: authRow.email || undefined,
    subject: `[Account Deletion Request] ${authRow.name || authRow.email || authRow.uid}`,
    text: `Account deletion requested by ${authRow.name || "User"} (${authRow.email || "no email"}) [${authRow.role || "STUDENT"}]. UID: ${authRow.uid}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 12px;color:#dc2626">Account Deletion Request</h2>
        <p><strong>Name:</strong> ${cleanedName}</p>
        <p><strong>Email:</strong> ${cleanedEmail}</p>
        <p><strong>Role:</strong> ${cleanedRole}</p>
        <p><strong>UID:</strong> ${escapeHtml(authRow.uid)}</p>
        <p>This request came from the AlgoNest dashboard and must be approved before deletion.</p>
      </div>
    `,
  });

  return {
    sent: true,
    recipient: ACCOUNT_DELETION_RECIPIENT,
    userEmail: authRow.email || null,
  };
}
