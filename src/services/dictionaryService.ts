import { Word } from '../types';

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: {
    text?: string;
    audio?: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example?: string;
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
}

// Default timeout for API requests (10 seconds)
const DEFAULT_TIMEOUT_MS = 10000;

export const fetchDictionaryData = async (
  word: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Partial<Word> | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) return null;
    
    const data: DictionaryEntry[] = await response.json();
    if (!data || data.length === 0) return null;
    
    const entry = data[0];
    
    // Extract phonetics
    const phonetics = entry.phonetics
      .filter(p => p.text || p.audio)
      .map(p => ({
        text: p.text || '',
        audio: p.audio || undefined
      }));
      
    // Extract synonyms and antonyms from all meanings
    const synonyms = Array.from(new Set(entry.meanings.flatMap(m => m.synonyms)));
    const antonyms = Array.from(new Set(entry.meanings.flatMap(m => m.antonyms)));

    return {
      ipa: entry.phonetic || (phonetics.length > 0 ? phonetics[0].text : undefined),
      synonyms: synonyms.length > 0 ? synonyms : undefined,
      antonyms: antonyms.length > 0 ? antonyms : undefined,
      phonetics: phonetics.length > 0 ? phonetics : undefined,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Check if it was aborted due to timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Dictionary API timeout for word: ${word}`);
    } else {
      console.error(`Error fetching dictionary data for ${word}:`, error);
    }
    
    return null;
  }
};
