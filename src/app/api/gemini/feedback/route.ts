import { GoogleGenAI } from '@google/genai';

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

export async function POST(request: Request) {
  try {
    const { text, recentWords } = await request.json();

    if (!text) {
      return Response.json(
        { error: 'Text is required' },
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

    const recentWordsList = recentWords?.length > 0 ? recentWords.join(', ') : 'N/A';
    const prompt = `You are an expert IELTS writing examiner. Please review the following text:
  
"${text}"

Provide detailed feedback in Vietnamese, focusing on:
1. Task Achievement & Coherence
2. Lexical Resource (Vocabulary) - Did they use any advanced words? Did they use any of these recent words: ${recentWordsList}?
3. Grammatical Range and Accuracy
4. Suggested improvements and an estimated IELTS band score for this short text.

Format the response in Markdown.`;

    const response = await withRetry(
      async () => {
        return ai!.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
      },
      'getWritingFeedback'
    );

    return Response.json({
      feedback: response.text || 'Could not generate feedback.',
    });
  } catch (error) {
    console.error('Error in /api/gemini/feedback:', error);
    return Response.json(
      { error: 'An error occurred while generating feedback.' },
      { status: 500 }
    );
  }
}
