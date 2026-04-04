import { GoogleGenAI } from "@google/genai";

async function test() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  console.log(`GEMINI_API_KEY exists: ${!!process.env.GEMINI_API_KEY}`);
  console.log(`API_KEY exists: ${!!process.env.API_KEY}`);
  if (!apiKey) return;

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Say hello",
    });
    console.log(`Response: ${response.text}`);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

test();
