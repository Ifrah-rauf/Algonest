import { supabase } from '../../lib/supabase.js';
import { getEmbedding } from './embeddingService.js';

// ─────────────────────────────────────────────────────────────
// Save mentor feedback from session_processing_jobs
// ─────────────────────────────────────────────────────────────
export async function saveFeedbackFromSessionJob(jobId) {
  try {
    const { data: job, error } = await supabase
      .from('session_processing_jobs')
      .select(`
        job_id, session_id, s_id, t_id,
        mentor_feedback_text, session_summary, status
      `)
      .eq('job_id', jobId)
      .single();

    if (error || !job) {
      console.error('Failed to fetch session job:', error?.message);
      return;
    }

    const text = `
      Mentor Feedback: ${job.mentor_feedback_text || ""}
      Session Summary: ${job.session_summary || ""}
      Status: ${job.status || ""}
    `;
    const feedbackText = [
      job.session_summary || "",
      job.mentor_feedback_text || "",
    ].filter(Boolean).join("\n\n") || null;

    const embedding = await getEmbedding(text);

    const payload = {
      session_id: job.session_id,
      s_id: job.s_id,
      t_id: job.t_id,
      feedback_text: feedbackText,
      summary: job.session_summary,
      status: job.status,
      embedding,
      source: 'session_job',
    };

    const { data: existing, error: lookupError } = await supabase
      .from('mentor_feedback_embeddings')
      .select('feedback_embed_id')
      .eq('session_id', job.session_id)
      .eq('s_id', job.s_id)
      .eq('source', 'session_job')
      .maybeSingle();

    if (lookupError) {
      console.error('Error looking up feedback embedding:', lookupError.message);
      return;
    }

    const query = existing?.feedback_embed_id
      ? supabase
          .from('mentor_feedback_embeddings')
          .update(payload)
          .eq('feedback_embed_id', existing.feedback_embed_id)
      : supabase
          .from('mentor_feedback_embeddings')
          .insert(payload);

    const { error: insertError } = await query;

    if (insertError) {
      console.error('Error inserting feedback embedding:', insertError.message);
    } else {
      console.log(`Inserted feedback embedding for job ${jobId}`);
    }
  } catch (err) {
    console.error('Error saving session job feedback embedding:', err?.message || err);
  }
}

// ─────────────────────────────────────────────────────────────
// Save checkpoint progress into embeddings
// ─────────────────────────────────────────────────────────────
export async function saveCheckpointEmbedding(checkpointRow) {
  if (!checkpointRow?.s_id) return;

  try {
    const text = `
      Checkpoint ${checkpointRow.checkpoint_id} for Student ${checkpointRow.s_id}
      Status: ${checkpointRow.status}
      Completed: ${checkpointRow.completed ? "true" : "false"}
      Completed At: ${checkpointRow.completed_at || ""}
      Session: ${checkpointRow.session_id}
    `;

    const embedding = await getEmbedding(text);

    const payload = {
      session_id: checkpointRow.session_id,
      s_id: checkpointRow.s_id,
      feedback_text: text,
      summary: `Checkpoint ${checkpointRow.checkpoint_id} is ${checkpointRow.status || 'unknown'}`,
      status: checkpointRow.status,
      embedding,
      source: 'checkpoint',
    };

    let existing = null;
    if (checkpointRow.session_id) {
      const { data, error: lookupError } = await supabase
        .from('mentor_feedback_embeddings')
        .select('feedback_embed_id')
        .eq('session_id', checkpointRow.session_id)
        .eq('s_id', checkpointRow.s_id)
        .eq('source', 'checkpoint')
        .maybeSingle();

      if (lookupError) {
        console.error('Error looking up checkpoint embedding:', lookupError.message);
        return;
      }
      existing = data;
    }

    const query = existing?.feedback_embed_id
      ? supabase
          .from('mentor_feedback_embeddings')
          .update(payload)
          .eq('feedback_embed_id', existing.feedback_embed_id)
      : supabase
          .from('mentor_feedback_embeddings')
          .insert(payload);

    const { error } = await query;

    if (error) {
      console.error("Error inserting checkpoint embedding:", error.message);
    } else {
      console.log("Inserted checkpoint embedding successfully");
    }
  } catch (err) {
    console.error("Error saving checkpoint embedding:", err?.message || err);
  }
}
