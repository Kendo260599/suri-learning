import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 503 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Say clearly in Chinese: ${text}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return Response.json({ audioUrl: `data:audio/wav;base64,${base64Audio}` });
    }
    return Response.json({ audioUrl: null });
  } catch (error) {
    console.error('Error generating AI audio:', error);
    return Response.json({ error: 'Failed to generate audio' }, { status: 500 });
  }
}
