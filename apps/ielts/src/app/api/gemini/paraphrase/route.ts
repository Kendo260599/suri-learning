import { GoogleGenAI, Type } from '@google/genai';

const getAiInstance = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. AI features may not work.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

async function withRetry<T>(
  fn: () => Promise<T>,
  operationName: string
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === MAX_RETRIES) {
        console.error(`${operationName} failed after ${MAX_RETRIES + 1} attempts:`, lastError);
        throw lastError;
      }

      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500;
      console.warn(
        `${operationName} failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}). Retrying in ${Math.round(delay)}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

interface ParaphrasePair {
  original: string;
  paraphrased: string;
  originalSentence?: string;
  paraphrasedSentence?: string;
  explanation?: string;
  method: 'synonym' | 'word_form' | 'structure' | 'mixed';
}

export async function POST(request: Request) {
  try {
    const { word, meaning } = await request.json();

    if (!word) {
      return Response.json(
        { error: 'Word is required' },
        { status: 400 }
      );
    }

    const ai = getAiInstance();
    if (!ai) {
      return Response.json(
        { error: 'AI service is not available. Please check API key configuration.' },
        { status: 503 }
      );
    }

    const prompt = `
Generate 2 high-quality paraphrase pairs for the English word "${word}" (meaning: ${meaning || 'N/A'}).
Each pair must include:
1. original: A short phrase using the word.
2. paraphrased: A paraphrased version of the phrase.
3. originalSentence: A full sentence using the word.
4. paraphrasedSentence: A full sentence paraphrasing the original sentence.
5. method: The method used ('synonym', 'word_form', 'structure', or 'mixed').
6. explanation: A short explanation in Vietnamese of how the paraphrase was done.

Return ONLY a JSON array of these 2 objects.
`;

    const response = await withRetry(
      async () => {
        return ai!.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  paraphrased: { type: Type.STRING },
                  originalSentence: { type: Type.STRING },
                  paraphrasedSentence: { type: Type.STRING },
                  method: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['original', 'paraphrased', 'originalSentence', 'paraphrasedSentence', 'method', 'explanation'],
              },
            },
          },
        });
      },
      `generateParaphrasesForWord(${word})`
    );

    const text = response.text;
    if (text) {
      return Response.json({
        paraphrases: JSON.parse(text) as ParaphrasePair[],
      });
    }

    return Response.json({
      paraphrases: [],
    });
  } catch (error) {
    console.error('Error in /api/gemini/paraphrase:', error);
    return Response.json(
      { error: 'An error occurred while generating paraphrases.' },
      { status: 500 }
    );
  }
}
