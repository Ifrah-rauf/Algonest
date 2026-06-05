import { supabase } from "../../lib/supabase.js";
import { getEmbedding } from "./embeddingService.js";

async function seedFeedback(sId, supportId, tId, sessionId, text) {
  const embedding = await getEmbedding(text);
  const { error } = await supabase
    .from("mentor_feedback_embeddings")
    .insert({
      s_id: sId,
      support_id: supportId,
      t_id: tId,
      session_id: sessionId,
      feedback_text: text,
      embedding,
      status: "completed"
    });
  if (error) console.error("Insert error:", error.message);
  else console.log("Inserted feedback:", text);
}

async function run() {
  await seedFeedback(2, 1, 1, 10, "Focus on recursion basics before advanced topics");
  await seedFeedback(2, 1, 1, 11, "Practice binary search problems daily");
}

run();
