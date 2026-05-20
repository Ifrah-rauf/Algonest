import { supabase } from "../lib/supabase.js";
import { sendDueSessionReminders } from "./sessionReminderService.js";

let reminderTimer = null;
let isRunning = false;
let reminderSchemaChecked = false;
let reminderSchemaReady = false;

async function hasReminderColumns() {
  const { data, error } = await supabase
    .from("session")
    .select(`
      session_id,
      reminder_teacher_30m_sent,
      reminder_teacher_30m_sent_at,
      reminder_student_30m_sent,
      reminder_student_30m_sent_at
    `)
    .limit(1);

  if (error) {
    console.error("[session-reminders] schema check failed:", error.message || error);
    return false;
  }
  return true;
}

export function runSessionReminderJob() {
  if (reminderSchemaChecked && !reminderSchemaReady) return;
  if (isRunning) return;

  isRunning = true;
  sendDueSessionReminders()
    .then((results) => {
      if (results?.length) {
        console.log(`[session-reminders] processed ${results.length} session(s)`);
      }
    })
    .catch((error) => {
      console.error("[session-reminders] job failed:", error?.message || error);
    })
    .finally(() => {
      isRunning = false;
    });
}

export function startSessionReminderScheduler() {
  if (reminderTimer) return reminderTimer;

  if (!reminderSchemaChecked) {
    reminderSchemaChecked = true;
  }

  hasReminderColumns()
    .then((ready) => {
      reminderSchemaReady = ready;
      if (!ready) {
        console.warn(
          "[session-reminders] reminder columns are missing. Apply backend2/sql/session_reminders.sql to enable session reminders."
        );
        return;
      }

      runSessionReminderJob();
      reminderTimer = setInterval(() => {
        runSessionReminderJob();
      }, 5 * 60 * 1000);
    })
    .catch((error) => {
      console.error("[session-reminders] initialization failed:", error?.message || error);
    });

  return reminderTimer;
}

export function stopSessionReminderScheduler() {
  if (!reminderTimer) return;
  clearInterval(reminderTimer);
  reminderTimer = null;
  isRunning = false;
}
