/**
 * claudeProvider.js
 * PURPOSE:
 * Talks to Claude API
 * Accepts structured { systemPrompt, history, message }
 * matching what the controller and orchestrator pass in
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

/**
 * @param {Object} params
 * @param {string} params.systemPrompt  - roadmap context + behavior rules
 * @param {Array}  params.history       - [{ role: "user"|"assistant", content: string }]
 * @param {string} params.message       - latest student message
 */
export async function callClaude({ systemPrompt, history = [], message }) {
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",  // fast + cheap for companion use
    max_tokens: 1024,                     // 300 was too low — cuts responses mid-sentence
    system: systemPrompt,                 // Claude handles system separately, cleaner than stitching
    messages: [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ],
  });

  return response.content[0].text;
}