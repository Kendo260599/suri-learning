import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const VOCAB_FILE = path.join(process.cwd(), "src", "data", "roadmap_vocab.ts");
const TOPICS_FILE = path.join(process.cwd(), "src", "data", "topics.ts");

async function main() {
  console.log("Starting topic re-categorization...");

  // 1. Load Topics
  const topicsContent = fs.readFileSync(TOPICS_FILE, "utf-8");
  const topicsMatch = topicsContent.match(/export const BAND_TOPICS: Record<number, Topic\[]> = (\{[\s\S]*?\});/);
  if (!topicsMatch) {
    console.error("Could not find BAND_TOPICS in topics.ts");
    return;
  }
  const BAND_TOPICS = eval("(" + topicsMatch[1] + ")");

  // 2. Load Vocab
  const vocabContent = fs.readFileSync(VOCAB_FILE, "utf-8");
  const arrayStart = vocabContent.indexOf("[");
  const arrayEnd = vocabContent.lastIndexOf("]");
  const arrayString = vocabContent.substring(arrayStart, arrayEnd + 1);
  const CAMBRIDGE_ROADMAP = eval("(" + arrayString + ")");

  // 3. Process in batches
  const BATCH_SIZE = 50;
  const totalWords = CAMBRIDGE_ROADMAP.length;
  
  for (let i = 0; i < totalWords; i += BATCH_SIZE) {
    const batch = CAMBRIDGE_ROADMAP.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(totalWords / BATCH_SIZE)}...`);

    const prompt = `
You are an English teacher. I have a list of vocabulary words and their current topics.
I want to re-categorize them into more specific topics based on the available topics for each band.

Available Topics by Band:
${JSON.stringify(BAND_TOPICS, null, 2)}

Words to re-categorize (Band ${batch[0].band}):
${batch.map(w => `- "${w.word}" (Current Topic: ${w.topicId}, Meaning: ${w.vietnameseDefinition})`).join("\n")}

For each word, pick the BEST topicId from the available topics for its band. 
If a word doesn't fit any specific topic well, keep it in the general topic (usually the first one, e.g., "1-1", "2-1", etc.).
Do NOT pick grammar topics (those starting with 'g-').

Return ONLY a JSON object where keys are the words and values are the new topicIds.
Example: {"Apple": "1-4", "Hello": "0-1"}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            additionalProperties: { type: Type.STRING }
          }
        }
      });

      const result = JSON.parse(response.text);
      
      // Update the batch in memory
      batch.forEach(wordObj => {
        if (result[wordObj.word]) {
          wordObj.topicId = result[wordObj.word];
        }
      });

      console.log(`Batch ${i / BATCH_SIZE + 1} updated.`);
    } catch (error) {
      console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error);
      // Continue to next batch
    }
  }

  // 4. Save back to file
  console.log("Saving updated vocabulary...");
  let output = `import { Word } from "../types";\n\nexport const CAMBRIDGE_ROADMAP: Word[] = [\n`;
  
  const entries = CAMBRIDGE_ROADMAP.map(item => {
    // We want to preserve all keys, but update topicId
    const { ...rest } = item;
    return `  ${JSON.stringify(rest, null, 2).split('\n').join('\n  ')}`;
  });
  
  output += entries.join(",\n");
  output += `\n];\n`;

  fs.writeFileSync(VOCAB_FILE, output, "utf-8");
  console.log("Topic re-categorization complete!");
}

main().catch(console.error);
