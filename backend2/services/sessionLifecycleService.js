import { supabase } from "../lib/supabase.js";

const FINAL_STATUSES = new Set(["COMPLETED", "FAILED"]);

function normalizeStatus(value) {
  return String(value || "").trim().toUpperCase();
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function deriveSessionStatus(session, job, now = new Date()) {
  if (!session?.session_id) return null;

  const currentStatus = normalizeStatus(session.status) || "BOOKED";
  if (FINAL_STATUSES.has(currentStatus)) return currentStatus;

  const jobStatus = normalizeStatus(job?.processing_status);
  const uploadStatus = normalizeStatus(job?.upload_status);

  if (jobStatus === "FAILED") return "FAILED";
  if (jobStatus === "COMPLETED") return "COMPLETED";
  if (jobStatus === "PROCESSING") return "PROCESSING";
  if (uploadStatus === "UPLOADED") return "UPLOAD_RECEIVED";

  const start = parseDate(session.start_time);
  const end = parseDate(session.end_time);

  if (!start) return currentStatus || "BOOKED";
  if (now < start) return "BOOKED";
  if (!end) return "LIVE";
  if (now <= end) return "LIVE";
  if (now > end) return "ENDED_PENDING_UPLOAD";

  return currentStatus || "BOOKED";
}

export async function syncSessionLifecycleStatuses() {
  const { data: sessions, error } = await supabase
    .from("session")
    .select("session_id, start_time, end_time, status")
    .order("start_time", { ascending: true });

  if (error) {
    throw new Error(`Failed to load sessions: ${error.message}`);
  }

  if (!sessions?.length) {
    return { scanned: 0, updated: 0 };
  }

  const sessionIds = sessions.map((session) => session.session_id).filter(Boolean);
  const { data: jobs, error: jobsError } = await supabase
    .from("session_processing_jobs")
    .select("session_id, processing_status, upload_status")
    .in("session_id", sessionIds);

  if (jobsError) {
    throw new Error(`Failed to load session jobs: ${jobsError.message}`);
  }

  const jobMap = Object.fromEntries((jobs || []).map((job) => [job.session_id, job]));
  const updates = [];
  const now = new Date();

  for (const session of sessions) {
    const nextStatus = deriveSessionStatus(session, jobMap[session.session_id], now);
    if (nextStatus && nextStatus !== normalizeStatus(session.status)) {
      updates.push({
        session_id: session.session_id,
        status: nextStatus,
      });
    }
  }

  if (!updates.length) {
    return { scanned: sessions.length, updated: 0 };
  }

  await Promise.all(
    updates.map((update) =>
      supabase
        .from("session")
        .update({ status: update.status })
        .eq("session_id", update.session_id)
    )
  );

  return {
    scanned: sessions.length,
    updated: updates.length,
  };
}

export function getDerivedSessionLifecycleStatus(session, job, now = new Date()) {
  return deriveSessionStatus(session, job, now);
}
