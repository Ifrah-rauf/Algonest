function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTime(value) {
  if (!value) return "soon";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildSessionReminderEmail({
  recipientLabel,
  teacherName,
  studentName,
  sessionTitle,
  startTime,
  endTime,
  joinUrl,
}) {
  const safeRecipientLabel = escapeHtml(recipientLabel);
  const safeTeacherName = escapeHtml(teacherName);
  const safeStudentName = escapeHtml(studentName);
  const safeSessionTitle = escapeHtml(sessionTitle || "Upcoming session");
  const safeJoinUrl = escapeHtml(joinUrl || "");
  const safeStartTime = escapeHtml(formatTime(startTime));
  const safeEndTime = escapeHtml(formatTime(endTime));

  return {
    subject: `AlgoNest reminder: ${sessionTitle || "session"} starts in 30 minutes`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#faf5ff;padding:24px;border-radius:18px">
        <h2 style="margin:0 0 12px;color:#6b46c1">Session Reminder</h2>
        <p style="margin:0 0 12px">Hi ${safeRecipientLabel}, your session is starting soon.</p>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:16px;margin:16px 0">
          <p style="margin:0 0 8px"><strong>Session:</strong> ${safeSessionTitle}</p>
          <p style="margin:0 0 8px"><strong>Teacher:</strong> ${safeTeacherName}</p>
          <p style="margin:0 0 8px"><strong>Student:</strong> ${safeStudentName}</p>
          <p style="margin:0 0 8px"><strong>Start:</strong> ${safeStartTime}</p>
          <p style="margin:0"><strong>End:</strong> ${safeEndTime}</p>
        </div>
        ${
          joinUrl
            ? `<p style="margin:16px 0 0"><a href="${safeJoinUrl}" style="display:inline-block;background:#6b46c1;color:#fff;text-decoration:none;padding:10px 16px;border-radius:10px;font-weight:700">Join Session</a></p>`
            : ""
        }
        <p style="margin:18px 0 0;color:#6b7280;font-size:12px">This is an automatic reminder from AlgoNest.</p>
      </div>
    `,
    text: [
      `Hi ${recipientLabel}, your session is starting soon.`,
      `Session: ${sessionTitle || "Upcoming session"}`,
      `Teacher: ${teacherName}`,
      `Student: ${studentName}`,
      `Start: ${formatTime(startTime)}`,
      `End: ${formatTime(endTime)}`,
      joinUrl ? `Join: ${joinUrl}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
