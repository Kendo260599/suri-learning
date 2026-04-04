import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const VOCAB_FILE = path.join(process.cwd(), "src", "data", "roadmap_vocab.ts");

async function main() {
  console.log("Bắt đầu quá trình làm giàu dữ liệu toàn diện...");
  
  const content = fs.readFileSync(VOCAB_FILE, "utf-8");
  const start = content.indexOf("[");
  const end = content.lastIndexOf("]");
  const arrayStr = content.substring(start, end + 1);
  
  // Parse mảng từ vựng hiện tại
  const words = eval("(" + arrayStr + ")");
  
  const BATCH_SIZE = 40;
  let updatedCount = 0;

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);
    // Chỉ xử lý những từ chưa có antonyms hoặc usageNotes hoặc register
    const wordsToEnrich = batch.filter(w => !w.antonyms || !w.usageNotes || !w.register);
    
    if (wordsToEnrich.length === 0) {
        console.log(`Batch bắt đầu tại index ${i} đã đầy đủ. Bỏ qua.`);
        continue;
    }

    console.log(`Đang xử lý ${wordsToEnrich.length} từ trong batch tại index ${i}...`);

    const prompt = `
Làm giàu dữ liệu cho các từ vựng tiếng Anh sau đây:
1. antonyms: Danh sách 2-4 từ trái nghĩa.
2. usageNotes: Một ghi chú ngắn (1 câu) về cách dùng, lỗi thường gặp hoặc sắc thái từ.
3. register: Chọn một trong: 'formal', 'informal', 'neutral', 'academic'.

Danh sách từ:
${wordsToEnrich.map(w => `- ${w.word} (Nghĩa: ${w.vietnameseDefinition})`).join("\n")}

Trả về DUY NHẤT một đối tượng JSON với key là "word" và value là đối tượng chứa các trường mới.
Ví dụ: {"Apple": {"antonyms": ["..."], "usageNotes": "...", "register": "neutral"}}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            additionalProperties: {
              type: Type.OBJECT,
              properties: {
                antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                usageNotes: { type: Type.STRING },
                register: { type: Type.STRING, enum: ['formal', 'informal', 'neutral', 'academic'] }
              },
              required: ["antonyms", "usageNotes", "register"]
            }
          }
        }
      });

      const result = JSON.parse(response.text);
      
      for (const wordObj of batch) {
        const enrichment = result[wordObj.word];
        if (enrichment) {
          wordObj.antonyms = enrichment.antonyms;
          wordObj.usageNotes = enrichment.usageNotes;
          wordObj.register = enrichment.register;
          updatedCount++;
        }
      }
      
      console.log(`Đã cập nhật xong batch tại index ${i}.`);
      
      // Lưu tạm thời sau mỗi 5 batch để tránh mất dữ liệu nếu có lỗi
      if (i % (BATCH_SIZE * 5) === 0) {
        save(words);
      }
    } catch (error) {
      console.error(`Lỗi tại index ${i}:`, error);
    }
  }

  save(words);
  console.log(`Hoàn tất! Đã làm giàu dữ liệu cho ${updatedCount} từ.`);
}

function save(words: any[]) {
  const output = `import { Word } from "../types";\n\nexport const CAMBRIDGE_ROADMAP: Word[] = ${JSON.stringify(words, null, 2)};\n`;
  fs.writeFileSync(VOCAB_FILE, output);
}

main().catch(console.error);
