import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
const getAiInstance = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. AI features may not work.');
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Retry configuration
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

export async function POST(request: Request) {
  try {
    const { word, context } = await request.json();

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

    const prompt = `Provide a deep, engaging explanation for the English word "${word}". Include its etymology, common collocations, nuances in meaning, and 2-3 advanced example sentences. Format the response in Markdown, using Vietnamese for the explanation but keeping examples in English.`;

    const response = await withRetry(
      async () => {
        return ai!.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
      },
      `getAIExplanation(${word})`
    );

    return Response.json({
      explanation: response.text || 'Could not generate explanation.',
    });
  } catch (error) {
    console.error('Error in /api/gemini/explain:', error);
    return Response.json(
      { error: 'An error occurred while generating the explanation.' },
      { status: 500 }
    );
  }
}
