import { supabase } from '../../lib/supabase.js';
import { getEmbedding } from './embeddingService.js';

async function checkTable(tableName) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error(`[RAG diagnostics] ${tableName} table check failed:`, error.message || error);
    return false;
  }

  console.log(`[RAG diagnostics] ${tableName} table reachable, rows=${count ?? 0}`);
  return true;
}

async function checkRpc(name, params) {
  const { data, error } = await supabase.rpc(name, params);

  if (error) {
    console.error(`[RAG diagnostics] ${name} RPC failed:`, error.message || error);
    return false;
  }

  console.log(`[RAG diagnostics] ${name} RPC reachable, returned=${(data || []).length}`);
  return true;
}

async function run() {
  const embedding = await getEmbedding('RAG diagnostics vector dimension check');
  console.log(`[RAG diagnostics] embedding dimension=${embedding.length}`);

  if (embedding.length !== 384) {
    console.error('[RAG diagnostics] Expected embedding dimension 384.');
  }

  await checkTable('chat_messages');
  await checkTable('mentor_feedback_embeddings');

  await checkRpc('match_student_messages', {
    query_embedding: embedding,
    student_id: 0,
    match_count: 1,
  });

  await checkRpc('match_mentor_feedback', {
    query_embedding: embedding,
    student_id: 0,
    match_count: 1,
  });
}

run().catch((err) => {
  console.error('[RAG diagnostics] fatal error:', err?.message || err);
  process.exitCode = 1;
});