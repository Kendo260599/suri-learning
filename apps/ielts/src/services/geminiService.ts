import { GoogleGenAI, Type } from '@google/genai';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 8000,
  backoffMultiplier: 2,
};

// Exponential backoff delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper with exponential backoff
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

      // Don't retry on final attempt
      if (attempt === maxRetries) {
        console.error(`${operationName} failed after ${maxRetries + 1} attempts:`, lastError);
        throw lastError;
      }

      // Calculate delay with exponential backoff + jitter
      const backoffDelay = Math.min(
        RETRY_CONFIG.baseDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt),
        RETRY_CONFIG.maxDelayMs
      );
      const jitter = Math.random() * 500; // Add jitter to prevent thundering herd
      const totalDelay = backoffDelay + jitter;

      console.warn(
        `${operationName} failed (attempt ${attempt + 1}/${maxRetries + 1}). ` +
        `Retrying in ${Math.round(totalDelay)}ms...`,
        lastError.message
      );

      await delay(totalDelay);
    }
  }

  throw lastError;
}

// Initialize the Gemini API client
// Note: In Vite, environment variables are accessed via import.meta.env
// However, in AI Studio, the GEMINI_API_KEY is often injected into process.env or window
const getApiKey = () => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    // @ts-ignore
    return process.env.GEMINI_API_KEY;
  }
  // @ts-ignore
  if (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_GEMINI_API_KEY;
  }
  return '';
};

let aiInstance: GoogleGenAI | null = null;

const getAiInstance = () => {
  if (!aiInstance) {
    const apiKey = getApiKey();
    if (apiKey) {
      aiInstance = new GoogleGenAI({ apiKey });
    } else {
      console.warn('Gemini API key not found. AI features may not work.');
    }
  }
  return aiInstance;
};

export interface ParaphrasePair {
  original: string;
  paraphrased: string;
  originalSentence?: string;
  paraphrasedSentence?: string;
  explanation?: string;
  method: 'synonym' | 'word_form' | 'structure' | 'mixed';
}

export const getAIExplanation = async (word: string): Promise<string> => {
  const ai = getAiInstance();
  if (!ai) return "AI service is not available.";
  
  const prompt = `Provide a deep, engaging explanation for the English word "${word}". Include its etymology, common collocations, nuances in meaning, and 2-3 advanced example sentences. Format the response in Markdown, using Vietnamese for the explanation but keeping examples in English.`;
  
  try {
    const response = await withRetry(
      async () => {
        return ai!.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
      },
      `getAIExplanation(${word})`
    );
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Error generating AI explanation:", error);
    return "An error occurred while generating the explanation. Please try again.";
  }
};

export const getWritingFeedback = async (text: string, recentWords: string[]): Promise<string> => {
  const ai = getAiInstance();
  if (!ai) return "AI service is not available.";
  
  const prompt = `You are an expert IELTS writing examiner. Please review the following text:
  
"${text}"

Provide detailed feedback in Vietnamese, focusing on:
1. Task Achievement & Coherence
2. Lexical Resource (Vocabulary) - Did they use any advanced words? Did they use any of these recent words: ${recentWords.join(', ')}?
3. Grammatical Range and Accuracy
4. Suggested improvements and an estimated IELTS band score for this short text.

Format the response in Markdown.`;

  try {
    const response = await withRetry(
      async () => {
        return ai!.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });
      },
      'getWritingFeedback'
    );
    return response.text || "Could not generate feedback.";
  } catch (error) {
    console.error("Error generating writing feedback:", error);
    return "An error occurred while generating feedback. Please try again.";
  }
};

export const generateAIChatResponse = async (messages: {role: 'user' | 'model', parts: {text: string}[]}[], topic: string): Promise<string> => {
  const ai = getAiInstance();
  if (!ai) return "AI service is not available.";
  
  const systemInstruction = `You are a friendly, encouraging English conversation partner. The user is practicing their English on the topic of "${topic}". 
Keep your responses relatively short (1-3 sentences). Ask follow-up questions to keep the conversation going. Correct any major grammatical errors gently.`;

  try {
    const response = await withRetry(
      async () => {
        const chat = ai!.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction,
          }
        });
        
        // Send history
        for (let i = 0; i < messages.length - 1; i++) {
          await chat.sendMessage({ message: messages[i].parts[0].text });
        }
        
        // Send latest message
        const lastMessage = messages[messages.length - 1];
        return await chat.sendMessage({ message: lastMessage.parts[0].text });
      },
      'generateAIChatResponse'
    );
    
    return response.text || "I'm not sure what to say.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again.";
  }
};
export const generateParaphrasesForWord = async (word: string, meaning: string): Promise<ParaphrasePair[]> => {
  const ai = getAiInstance();
  if (!ai) {
    console.error('Cannot generate paraphrases: AI instance not initialized.');
    return [];
  }

  const prompt = `
Generate 2 high-quality paraphrase pairs for the English word "${word}" (meaning: ${meaning}).
Each pair must include:
1. original: A short phrase using the word.
2. paraphrased: A paraphrased version of the phrase.
3. originalSentence: A full sentence using the word.
4. paraphrasedSentence: A full sentence paraphrasing the original sentence.
5. method: The method used ('synonym', 'word_form', 'structure', or 'mixed').
6. explanation: A short explanation in Vietnamese of how the paraphrase was done.

Return ONLY a JSON array of these 2 objects.
`;

  try {
    const response = await withRetry(
      async () => {
        return ai!.models.generateContent({
          model: 'gemini-3-flash-preview',
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
      return JSON.parse(text) as ParaphrasePair[];
    }
  } catch (error) {
    console.error(`Error generating paraphrases for ${word}:`, error);
  }
  return [];
};
