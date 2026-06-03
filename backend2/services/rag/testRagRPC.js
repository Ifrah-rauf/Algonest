// testRagRPCs.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log("URL:", process.env.SUPABASE_URL);
console.log("Key:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,10) + "...");

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use service role for testing
);

async function testRAG() {
  const sId = 2; // replace with a valid student id
  const queryEmbedding = Array(384).fill(0.1); // dummy embedding of correct dimension

  // Test student messages RPC
  const { data: studentMatches, error: studentErr } =
    await supabase.rpc("match_student_messages", {
      student_id: sId,
      query_embedding: queryEmbedding,
      match_count: 5,
    });

  console.log("Student matches:", studentMatches);
  if (studentErr) console.error("Student RPC error:", studentErr);

  // Test mentor feedback RPC
  const { data: feedbackMatches, error: feedbackErr } =
    await supabase.rpc("match_mentor_feedback", {
      student_id: sId,
      query_embedding: queryEmbedding,
      match_count: 3,
    });

  console.log("Feedback matches:", feedbackMatches);
  if (feedbackErr) console.error("Feedback RPC error:", feedbackErr);
}

testRAG();
