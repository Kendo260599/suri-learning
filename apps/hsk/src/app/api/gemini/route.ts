import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    let body: { action?: string; data?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { action, data } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json({ error: "Missing or invalid action" }, { status: 400 });
    }

    switch (action) {
      case "grammar": {
        if (!data || typeof data !== "object") {
          return NextResponse.json({ error: "Missing data for grammar action" }, { status: 400 });
        }
        const { lessonId, lessonTitle, words } = data as { lessonId?: number; lessonTitle?: string; words?: Array<{hanzi: string; pinyin: string; vietnamese: string}> };
        if (!words || !Array.isArray(words)) {
          return NextResponse.json({ error: "Invalid words data" }, { status: 400 });
        }
        const wordsList = words
          .map(w => `${w.hanzi} (${w.pinyin}): ${w.vietnamese}`)
          .join(", ");
        const prompt = `Bạn là một giáo viên tiếng Trung chuyên nghiệp. Hãy giải thích ngắn gọn các điểm ngữ pháp quan trọng cho Bài ${lessonId}: "${lessonTitle}".
Các từ vựng trong bài này bao gồm: ${wordsList}.
Hãy cung cấp 3 ví dụ thực tế sử dụng các từ vựng này. Trình bày bằng tiếng Việt, định dạng Markdown rõ ràng. Chỉ trả lời bằng tiếng Việt.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        return NextResponse.json({ text: response.text });
      }

      case "sentence": {
        if (!data || typeof data !== "object") {
          return NextResponse.json({ error: "Missing data for sentence action" }, { status: 400 });
        }
        const { words } = data as { words?: Array<{hanzi: string}> };
        if (!words || !Array.isArray(words)) {
          return NextResponse.json({ error: "Invalid words data" }, { status: 400 });
        }
        const wordsList = words.map(w => w.hanzi).join(", ");
        const prompt = `Dựa trên các từ vựng sau: ${wordsList}, hãy tạo ra 1 câu tiếng Trung HSK1 tự nhiên.
Trả về kết quả dưới dạng JSON: { "hanzi": "...", "pinyin": "...", "vietnamese": "...", "english": "..." }`;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(response.text ?? "{}");
        } catch {
          return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
        }
        return NextResponse.json(parsed);
      }

      case "audio": {
        if (!data || typeof data !== "object") {
          return NextResponse.json({ error: "Missing data for audio action" }, { status: 400 });
        }
        const { text } = data as { text?: string };
        if (!text || typeof text !== "string") {
          return NextResponse.json({ error: "Invalid text for audio" }, { status: 400 });
        }
        if (text.length > 500) {
          return NextResponse.json({ error: "Text too long for audio generation" }, { status: 400 });
        }
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [{ parts: [{ text: `Say clearly in Chinese: ${text}` }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
          return NextResponse.json({ error: "No audio generated" }, { status: 502 });
        }
        const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
        if (base64Audio.length > MAX_AUDIO_SIZE) {
          return NextResponse.json({ error: "Audio too large" }, { status: 502 });
        }
        return NextResponse.json({ audioUrl: `data:audio/wav;base64,${base64Audio}` });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
