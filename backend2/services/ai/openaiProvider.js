import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callOpenAI({ systemPrompt, history = [], message }) {
  console.log("key: ",client);
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini", // cheap + fast, good for dev
    max_tokens: 1024,
    messages,
  });

  return response.choices[0].message.content;
}