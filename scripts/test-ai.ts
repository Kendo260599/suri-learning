import { GoogleGenAI } from "@google/genai";

console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);
console.log("API_KEY present:", !!process.env.API_KEY);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hello",
    });
    console.log("Response:", response.text);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
