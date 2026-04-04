import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateGrammarExplanation = async (lessonId: number, lessonTitle: string, words: any[]) => {
  const wordsList = words.map(w => `${w.hanzi} (${w.pinyin}): ${w.vietnamese}`).join(', ');
  const prompt = `Bạn là một giáo viên tiếng Trung chuyên nghiệp. Hãy giải thích ngắn gọn các điểm ngữ pháp quan trọng cho Bài ${lessonId}: "${lessonTitle}". 
  Các từ vựng trong bài này bao gồm: ${wordsList}.
  Hãy cung cấp 3 ví dụ thực tế sử dụng các từ vựng này. Trình bày bằng tiếng Việt, định dạng Markdown rõ ràng.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating grammar explanation:", error);
    return "Không thể tải giải thích ngữ pháp lúc này. Vui lòng thử lại sau.";
  }
};

export const generatePracticeSentence = async (words: any[]) => {
  const wordsList = words.map(w => w.hanzi).join(', ');
  const prompt = `Dựa trên các từ vựng sau: ${wordsList}, hãy tạo ra 1 câu tiếng Trung HSK1 tự nhiên. 
  Trả về kết quả dưới dạng JSON: { "hanzi": "...", "pinyin": "...", "vietnamese": "...", "english": "..." }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating practice sentence:", error);
    return null;
  }
};

export const generateAIAudio = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly in Chinese: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is a good female voice for Chinese
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating AI audio:", error);
    return null;
  }
};
