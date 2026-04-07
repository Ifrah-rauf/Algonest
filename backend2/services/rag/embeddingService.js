

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.CLAUDE_API_KEY });

export async function getEmbedding(text) {
  const cleaned = text.replace(/\n/g, ' ').trim().slice(0, 8000);

  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: cleaned,
  });

  return res.data[0].embedding;
}