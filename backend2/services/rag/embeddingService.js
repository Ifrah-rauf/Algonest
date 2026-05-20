// backend2/services/rag/embeddingService.js
import { pipeline } from '@xenova/transformers';

let embedder = null;

export async function getEmbedding(text) {
  if (!embedder) {
    console.log('[RAG] Loading embedding model...');
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('[RAG] Embedding model ready');
  }
  const cleaned = text.replace(/\n/g, ' ').trim().slice(0, 8000);
  const output = await embedder(cleaned, { pooling: 'mean', normalize: true });
  return Array.from(output.data); // 384 dims, free, no API key
}