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

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function POST(request: Request) {
  try {
    const { messages, topic } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
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

    const systemInstruction = `You are a friendly, encouraging English conversation partner. The user is practicing their English on the topic of "${topic || 'general conversation'}". 
Keep your responses relatively short (1-3 sentences). Ask follow-up questions to keep the conversation going. Correct any major grammatical errors gently.`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      }
    });

    // Send history (all except the last message)
    for (let i = 0; i < messages.length - 1; i++) {
      await chat.sendMessage({ message: messages[i].parts[0].text });
    }

    // Send latest message and get response
    const lastMessage = messages[messages.length - 1];
    const response = await withRetry(
      async () => {
        return await chat.sendMessage({ message: lastMessage.parts[0].text });
      },
      'generateAIChatResponse'
    );

    return Response.json({
      response: response.text || "I'm not sure what to say.",
    });
  } catch (error) {
    console.error('Error in /api/gemini/chat:', error);
    return Response.json(
      { error: "Sorry, I'm having trouble connecting right now. Please try again." },
      { status: 500 }
    );
  }
}
