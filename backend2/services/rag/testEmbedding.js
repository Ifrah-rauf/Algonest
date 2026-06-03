import { saveEmbeddingMessage } from  "./index.js";

async function run() {
  const sId = 2; // use a real student_id from your DB
  const lessonId = 1; // optional, can be null
  const message = "Testing embeddings without Claude.";

  try {
    //await saveEmbeddingMessage(sId, "user", message, lessonId);
    await saveEmbeddingMessage(2, "user", "I am learning recursion", 1);
await saveEmbeddingMessage(2, "assistant", "Recursion means a function calling itself", 1);
await saveEmbeddingMessage(2, "user", "Explain binary search", 2);

    console.log("Inserted embedding for test message");
  } catch (err) {
    console.error("Error inserting embedding:", err.message);
  }
}

run();
