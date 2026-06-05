import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../lib/supabase.js";
import { getEmbedding } from "./rag/embeddingService.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const RECORDINGS_BUCKET = "session_recordings";

function normalizeAudioMimeType(file) {
  if (!file) return "audio/mp4";

  if (file.mimetype && file.mimetype !== "application/octet-stream") {
    return file.mimetype;
  }

  const ext = path.extname(file.originalname || "").toLowerCase();
  if (ext === ".m4a" || ext === ".mp4") return "audio/mp4";
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".wav") return "audio/wav";
  return "audio/mp4";
}

function stripMarkdownFences(text) {
  return String(text || "").replace(/```json|```/g, "").trim();
}

function safeFileName(fileName) {
  return String(fileName || "recording")
    .replace(/[\\/]+/g, "_")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function parseGeminiJson(rawText) {
  const cleaned = stripMarkdownFences(rawText);
  return JSON.parse(cleaned);
}

async function downloadRecordingBuffer(storagePath) {
  const { data, error } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .download(storagePath);

  if (error) {
    throw new Error(`Failed to download recording: ${error.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function getSessionContext(sessionId) {
  const { data, error } = await supabase
    .from("session")
    .select(`
      session_id,
      booking_id,
      t_id,
      zoom_meeting_id,
      start_time,
      end_time,
      status,
      attended,
      marked_by_teacher,
      title,
      booking:booking_id (
        booking_id,
        s_id
      )
    `)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch session: ${error.message}`);
  if (!data) throw new Error("Session not found");

  return {
    ...data,
    s_id: data.booking?.s_id || null,
  };
}

async function ensurePendingProcessingJobFromSessionContext(session) {
  if (!session?.session_id) {
    throw new Error("Session context is required to create a processing job");
  }

  return upsertProcessingJob({
    session,
    recordingMeta: null,
    status: "AWAITING_UPLOAD",
  });
}

async function upsertProcessingJob({ session, recordingMeta, status = "AWAITING_UPLOAD" }) {
  const payload = {
    session_id: session.session_id,
    booking_id: session.booking_id || null,
    t_id: session.t_id,
    s_id: session.s_id || null,
    zoom_meeting_id: session.zoom_meeting_id || null,
    status,
    upload_status: recordingMeta?.recording_url ? "UPLOADED" : "NOT_UPLOADED",
    processing_status: recordingMeta?.recording_url ? "QUEUED" : "PENDING",
    recording_bucket: RECORDINGS_BUCKET,
    recording_path: recordingMeta?.recording_path || null,
    recording_url: recordingMeta?.recording_url || null,
    recording_file_name: recordingMeta?.recording_file_name || null,
    recording_mime_type: recordingMeta?.recording_mime_type || null,
    uploaded_at: recordingMeta?.recording_url ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("session_processing_jobs")
    .upsert(payload, { onConflict: "session_id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to upsert processing job: ${error.message}`);
  }

  return data;
}

async function updateSessionStatus(sessionId, jobStatus, extraFields = {}) {
  const { error } = await supabase
    .from("session")
    .update({
      status: jobStatus,
      ...extraFields,
    })
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`Failed to update session status: ${error.message}`);
  }
}

function buildProcessingPrompt() {
  return `
You are AlgoNest's post-session analyst.

Analyze the mentor-student session audio and return ONLY valid JSON. Do not add markdown fences or extra text.

Return this exact shape:
{
  "transcript": [
    { "speaker": "mentor|student", "text": "" }
  ],
  "summary": "",
  "strengths": ["short bullet points about what went well"],
  "weaknesses": ["short bullet points about confusion, mistakes, or gaps"],
  "action_items": ["short next-step bullets"],
  "session_result": "excellent|average|needs_improvement"
}

Keep the summary concise but useful for future AI companion context.
`;
}

async function analyzeSessionRecording(audioBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const audioBase64 = audioBuffer.toString("base64");

  const result = await model.generateContent([
    buildProcessingPrompt(),
    {
      inlineData: {
        data: audioBase64,
        mimeType,
      },
    },
  ]);

  return result.response.text();
}

async function upsertMentorFeedbackEmbedding({
  session,
  parsed,
  summaryEmbedding,
}) {
  const feedbackText = [
    parsed.summary || "",
    parsed.strengths?.length ? `Strengths: ${parsed.strengths.join("; ")}` : "",
    parsed.weaknesses?.length ? `Weaknesses: ${parsed.weaknesses.join("; ")}` : "",
    parsed.action_items?.length ? `Action items: ${parsed.action_items.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();

  const payload = {
    s_id: session.s_id,
    t_id: session.t_id,
    session_id: session.session_id,
    support_id: null,
    feedback_text: feedbackText || parsed.summary || null,
    summary: parsed.summary || null,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.join(" | ") : null,
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.join(" | ") : null,
    status: parsed.session_result || "processed",
    embedding: summaryEmbedding,
  };

  const { data: existing, error: lookupError } = await supabase
    .from("mentor_feedback_embeddings")
    .select("feedback_embed_id")
    .eq("session_id", session.session_id)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Failed to look up feedback embedding: ${lookupError.message}`);
  }

  if (existing?.feedback_embed_id) {
    const { error: updateError } = await supabase
      .from("mentor_feedback_embeddings")
      .update(payload)
      .eq("feedback_embed_id", existing.feedback_embed_id);

    if (updateError) {
      throw new Error(`Failed to update feedback embedding: ${updateError.message}`);
    }
    return existing.feedback_embed_id;
  }

  const { data, error } = await supabase
    .from("mentor_feedback_embeddings")
    .insert([payload])
    .select("feedback_embed_id")
    .single();

  if (error) {
    throw new Error(`Failed to insert feedback embedding: ${error.message}`);
  }

  return data.feedback_embed_id;
}

async function finalizeProcessingJob({ jobId, parsed, summaryEmbedding }) {
  const { error } = await supabase
    .from("session_processing_jobs")
    .update({
      transcript_json: parsed.transcript || null,
      summary_json: parsed,
      session_summary: parsed.summary || null,
      mentor_feedback_text: [
        parsed.strengths?.length ? `Strengths: ${parsed.strengths.join("; ")}` : "",
        parsed.weaknesses?.length ? `Weaknesses: ${parsed.weaknesses.join("; ")}` : "",
        parsed.action_items?.length ? `Action items: ${parsed.action_items.join("; ")}` : "",
      ]
        .filter(Boolean)
        .join("\n\n") || null,
      summary_embedding: summaryEmbedding,
      status: "PROCESSED",
      upload_status: "UPLOADED",
      processing_status: "COMPLETED",
      processed_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("job_id", jobId);

  if (error) {
    throw new Error(`Failed to finalize processing job: ${error.message}`);
  }
}

async function markSessionCompleted(session) {
  const { error } = await supabase
    .from("session")
    .update({
      feedback: session.feedback || null,
      attended: true,
      marked_by_teacher: true,
    })
    .eq("session_id", session.session_id);

  if (error) {
    throw new Error(`Failed to update session completion state: ${error.message}`);
  }
}

export async function ensurePendingProcessingJobFromZoomEvent(payload) {
  const zoomMeetingId =
    payload?.object?.id ??
    payload?.payload?.object?.id ??
    payload?.object?.meeting_id ??
    payload?.payload?.object?.meeting_id ??
    null;

  if (!zoomMeetingId) return null;

  const { data: session, error } = await supabase
    .from("session")
    .select("session_id, booking_id, t_id, zoom_meeting_id, feedback")
    .eq("zoom_meeting_id", String(zoomMeetingId))
    .maybeSingle();

  if (error || !session) return null;

  const { data: booking } = await supabase
    .from("booking")
    .select("s_id")
    .eq("booking_id", session.booking_id)
    .maybeSingle();

  const job = await upsertProcessingJob({
    session: {
      ...session,
      s_id: booking?.s_id || null,
    },
    recordingMeta: null,
    status: "AWAITING_UPLOAD",
  });

  await updateSessionStatus(session.session_id, "ENDED_PENDING_UPLOAD");

  return job;
}

export async function ensurePendingProcessingJobFromSessionId(sessionId) {
  const session = await getSessionContext(sessionId);
  return ensurePendingProcessingJobFromSessionContext(session);
}

export async function markSessionCompleteAndQueueProcessing({ sessionId, feedback = null }) {
  const session = await getSessionContext(sessionId);

  const { error: updateError } = await supabase
    .from("session")
    .update({
      feedback: feedback ?? session.feedback ?? null,
      status: "ENDED_PENDING_UPLOAD",
    })
    .eq("session_id", sessionId);

  if (updateError) {
    throw new Error(`Failed to prepare session for processing: ${updateError.message}`);
  }

  const refreshedSession = {
    ...session,
    feedback: feedback ?? session.feedback ?? null,
    status: "ENDED_PENDING_UPLOAD",
  };

  const job = await ensurePendingProcessingJobFromSessionContext(refreshedSession);

  return {
    session: refreshedSession,
    job,
  };
}

export async function getPendingProcessingJobsByTeacherId(tId) {
  const { data, error } = await supabase
    .from("session_processing_jobs")
    .select(`
      job_id,
      session_id,
      booking_id,
      t_id,
      s_id,
      zoom_meeting_id,
      status,
      upload_status,
      processing_status,
      recording_url,
      recording_path,
      recording_file_name,
      recording_mime_type,
      uploaded_at,
      processing_started_at,
      processed_at,
      error_message,
      created_at,
      updated_at,
      session:session_id (
        session_id,
        title,
        start_time,
        end_time,
        attended,
        marked_by_teacher,
        feedback
      )
    `)
    .eq("t_id", tId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch processing jobs: ${error.message}`);
  }

  return (data || []).filter((job) => job.processing_status !== "COMPLETED");
}

export async function uploadAndProcessSessionRecording({ sessionId, file }) {
  const session = await getSessionContext(sessionId);
  if (!file) throw new Error("Audio file required");

  const mimeType = normalizeAudioMimeType(file);
  const storagePath = `session_recordings/session-${sessionId}/${Date.now()}-${safeFileName(file.originalname)}`;

  const { error: uploadError } = await supabase.storage
    .from(RECORDINGS_BUCKET)
    .upload(storagePath, file.buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload recording: ${uploadError.message}`);
  }

  const recordingUrl = supabase.storage
    .from(RECORDINGS_BUCKET)
    .getPublicUrl(storagePath)
    .data.publicUrl;

  const job = await upsertProcessingJob({
    session,
    recordingMeta: {
      recording_path: storagePath,
      recording_url: recordingUrl,
      recording_file_name: file.originalname || null,
      recording_mime_type: mimeType,
    },
    status: "UPLOADED",
  });

  await updateSessionStatus(session.session_id, "UPLOAD_RECEIVED");

  queueMicrotask(() => {
    processSessionRecordingJob(job.job_id).catch((error) => {
      console.error("[session-processing] async job failed:", error?.message || error);
    });
  });

  return {
    job,
    recordingUrl,
  };
}

export async function processSessionRecordingJob(jobId) {
  const { data: job, error } = await supabase
    .from("session_processing_jobs")
    .select("*")
    .eq("job_id", jobId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load processing job: ${error.message}`);
  }
  if (!job) {
    throw new Error("Processing job not found");
  }
  if (!job.recording_path) {
    throw new Error("Recording path missing");
  }

  await supabase
    .from("session_processing_jobs")
    .update({
      status: "PROCESSING",
      processing_status: "PROCESSING",
      processing_started_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("job_id", jobId);

  await updateSessionStatus(job.session_id, "PROCESSING");

  try {
    const recordingBuffer = await downloadRecordingBuffer(job.recording_path);
    const raw = await analyzeSessionRecording(recordingBuffer, job.recording_mime_type || "audio/mp4");
    const parsed = await parseGeminiJson(raw);
    const summaryEmbedding = await getEmbedding(parsed.summary || raw);

    const { data: session, error: sessionError } = await supabase
      .from("session")
      .select("session_id, booking_id, t_id, feedback")
      .eq("session_id", job.session_id)
      .maybeSingle();

    if (sessionError || !session) {
      throw new Error("Session not found while finalizing recording job");
    }

    const { data: bookingRow, error: bookingError } = await supabase
      .from("booking")
      .select("s_id")
      .eq("booking_id", session.booking_id)
      .maybeSingle();

    if (bookingError) {
      throw new Error(`Failed to resolve student for session: ${bookingError.message}`);
    }

    const resolvedStudentId = bookingRow?.s_id || job.s_id || null;
    if (!resolvedStudentId) {
      throw new Error("Student ID not found for this session");
    }

    await upsertMentorFeedbackEmbedding({
      session: {
        ...session,
        s_id: resolvedStudentId,
      },
      parsed,
      summaryEmbedding,
    });

    await supabase
      .from("session")
      .update({
        feedback: parsed.summary || session.feedback || null,
        attended: true,
        marked_by_teacher: true,
        status: "COMPLETED",
      })
      .eq("session_id", job.session_id);

    await finalizeProcessingJob({
      jobId,
      parsed,
      summaryEmbedding,
    });

    return {
      job_id: jobId,
      status: "PROCESSED",
      parsed,
    };
  } catch (processingError) {
    await supabase
      .from("session_processing_jobs")
      .update({
        status: "FAILED",
        processing_status: "FAILED",
        failed_at: new Date().toISOString(),
        error_message: processingError.message,
      })
      .eq("job_id", jobId);

    await supabase
      .from("session")
      .update({
        status: "FAILED",
      })
      .eq("session_id", job.session_id);

    throw processingError;
  }
}
