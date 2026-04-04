/**
 * AI Service for Next.js - Client Side
 * Uses Next.js API routes instead of calling Gemini directly
 * This keeps API keys secure on the server
 */

export interface ParaphrasePair {
  original: string;
  paraphrased: string;
  originalSentence?: string;
  paraphrasedSentence?: string;
  explanation?: string;
  method: 'synonym' | 'word_form' | 'structure' | 'mixed';
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
  backoffMultiplier: 2,
};

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(
  fn: () => Promise<T>,
  operationName: string,
  customMaxRetries?: number
): Promise<T> {
  const maxRetries = customMaxRetries ?? RETRY_CONFIG.maxRetries;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        console.error(`${operationName} failed after ${maxRetries + 1} attempts:`, lastError);
        throw lastError;
      }

      const backoffDelay = Math.min(
        RETRY_CONFIG.baseDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
        RETRY_CONFIG.maxDelayMs
      );
      const jitter = Math.random() * 500;
      const totalDelay = backoffDelay + jitter;

      console.warn(
        `${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${Math.round(totalDelay)}ms...`,
        lastError.message
      );

      await delay(totalDelay);
    }
  }

  throw lastError;
}

export const getAIExplanation = async (word: string): Promise<string> => {
  return withRetry(
    async () => {
      const response = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get explanation');
      }

      const data = await response.json();
      return data.explanation || "Could not generate explanation.";
    },
    `getAIExplanation(${word})`
  );
};

export const getWritingFeedback = async (text: string, recentWords: string[]): Promise<string> => {
  return withRetry(
    async () => {
      const response = await fetch('/api/gemini/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, recentWords }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get feedback');
      }

      const data = await response.json();
      return data.feedback || "Could not generate feedback.";
    },
    'getWritingFeedback'
  );
};

export const generateAIChatResponse = async (
  messages: { role: 'user' | 'model', parts: { text: string }[] }[],
  topic: string
): Promise<string> => {
  return withRetry(
    async () => {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, topic }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get chat response');
      }

      const data = await response.json();
      return data.response || "I'm not sure what to say.";
    },
    'generateAIChatResponse'
  );
};

export const generateParaphrasesForWord = async (word: string, meaning: string): Promise<ParaphrasePair[]> => {
  return withRetry(
    async () => {
      const response = await fetch('/api/gemini/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, meaning }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate paraphrases');
      }

      const data = await response.json();
      return data.paraphrases || [];
    },
    `generateParaphrasesForWord(${word})`
  );
};
