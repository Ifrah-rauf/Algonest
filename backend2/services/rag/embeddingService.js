import { pipeline } from '@xenova/transformers';

let embedder = null;

export async function getEmbedding(text) {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  const cleaned = text.replace(/\n/g, ' ').trim();
  const output = await embedder(cleaned, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}