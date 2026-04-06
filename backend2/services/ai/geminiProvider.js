/**
 * PURPOSE:
 * Talks to Gemini API
 * Only handles API call (no logic)
 */
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log("key: ",genAI);
export async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // fast + free
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("in geminiProvider, result and response are: ",result,response);
    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}