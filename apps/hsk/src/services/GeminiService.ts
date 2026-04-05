const API_BASE = "/api/gemini";

const callGemini = async (action: string, data: unknown) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error ?? `API error: ${response.status}`);
  }

  return response.json();
};

export const generateGrammarExplanation = async (
  lessonId: number,
  lessonTitle: string,
  words: Array<{hanzi: string; pinyin: string; vietnamese: string}>
) => {
  const result = await callGemini("grammar", { lessonId, lessonTitle, words });
  return result.text as string;
};

export const generatePracticeSentence = async (
  words: Array<{hanzi: string}>
) => {
  const result = await callGemini("sentence", { words });
  return result as {hanzi: string; pinyin: string; vietnamese: string; english: string};
};

export const generateAIAudio = async (text: string): Promise<string | null> => {
  try {
    const result = await callGemini("audio", { text });
    return result.audioUrl as string | null;
  } catch {
    return null;
  }
};
