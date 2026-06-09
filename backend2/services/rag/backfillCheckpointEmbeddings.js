import { supabase } from '../../lib/supabase.js';
import { saveCheckpointEmbedding } from './saveFeedback.js';

async function run() {
  const { data: checkpoints, error } = await supabase
    .from('checkpoints_progress')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch checkpoints_progress: ${error.message}`);
  }

  let processed = 0;
  for (const checkpoint of checkpoints || []) {
    await saveCheckpointEmbedding(checkpoint);
    processed += 1;
  }

  console.log(`[RAG] Backfilled checkpoint embeddings: ${processed}`);
}

run().catch((err) => {
  console.error('[RAG] checkpoint backfill failed:', err?.message || err);
  process.exitCode = 1;
});
