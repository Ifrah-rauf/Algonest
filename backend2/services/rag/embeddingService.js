// import { pipeline } from '@xenova/transformers';

// let embedder = null;

// export async function getEmbedding(text) {
//   if (!embedder) {
//     embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//   }
//   const cleaned = text.replace(/\n/g, ' ').trim();
//   const output = await embedder(cleaned, { pooling: 'mean', normalize: true });
//   const arr = Array.from(output.data);
//   const expectedDim = parseInt(process.env.EMBED_DIM || '1536', 10);
//   if (arr.length === expectedDim) return arr;

//   if (arr.length < expectedDim) {
//     // pad with zeros to match DB/vector config
//     const padded = new Array(expectedDim).fill(0);
//     for (let i = 0; i < arr.length; i++) padded[i] = arr[i];
//     console.warn(`[RAG] getEmbedding: embedding length ${arr.length} != expected ${expectedDim}, padded with zeros.`);
//     return padded;
//   }

//   if (arr.length > expectedDim) {
//     // truncate if longer than expected
//     console.warn(`[RAG] getEmbedding: embedding length ${arr.length} > expected ${expectedDim}, truncating.`);
//     return arr.slice(0, expectedDim);
//   }
// }

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