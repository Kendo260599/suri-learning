/**
 * Band-based vocabulary loader for code-splitting.
 * Vocabulary data is split by band level (0-7) to reduce initial bundle size.
 * Users only load vocabulary for bands they're actively studying.
 */

import { Word } from '../types';

// Cache for loaded band data
export const bandCache: Record<number, Word[]> = {};
export let fullVocabCache: Word[] | null = null;

/**
 * Get words by band level with dynamic import.
 * Caches results to avoid repeated imports.
 */
export async function getWordsByBand(band: number): Promise<Word[]> {
  if (bandCache[band]) {
    return bandCache[band];
  }

  // Dynamically import based on band
  // Each band file contains ~200-500 words
  switch (band) {
    case 0: {
      const mod = await import('./bands/band0');
      bandCache[band] = mod.BAND_0_WORDS;
      break;
    }
    case 1: {
      const mod = await import('./bands/band1');
      bandCache[band] = mod.BAND_1_WORDS;
      break;
    }
    case 2: {
      const mod = await import('./bands/band2');
      bandCache[band] = mod.BAND_2_WORDS;
      break;
    }
    case 3: {
      const mod = await import('./bands/band3');
      bandCache[band] = mod.BAND_3_WORDS;
      break;
    }
    case 4: {
      const mod = await import('./bands/band4');
      bandCache[band] = mod.BAND_4_WORDS;
      break;
    }
    case 5: {
      const mod = await import('./bands/band5');
      bandCache[band] = mod.BAND_5_WORDS;
      break;
    }
    case 6: {
      const mod = await import('./bands/band6');
      bandCache[band] = mod.BAND_6_WORDS;
      break;
    }
    case 7: {
      const mod = await import('./bands/band7');
      bandCache[band] = mod.BAND_7_WORDS;
      break;
    }
    default:
      bandCache[band] = [];
  }

  return bandCache[band];
}

/**
 * Get all vocabulary (use sparingly - this loads the entire ~1.7MB dataset).
 * Prefer getWordsByBand() for production use.
 */
export async function getAllVocabulary(): Promise<Word[]> {
  if (fullVocabCache) {
    return fullVocabCache;
  }

  const allWords: Word[] = [];
  for (let band = 0; band <= 7; band++) {
    const bandWords = await getWordsByBand(band);
    allWords.push(...bandWords);
  }

  fullVocabCache = allWords;
  return allWords;
}

/**
 * Get words for multiple bands at once.
 */
export async function getWordsForBands(bands: number[]): Promise<Word[]> {
  const results = await Promise.all(bands.map(band => getWordsByBand(band)));
  return results.flat();
}

/**
 * Preload vocabulary for a band (for background loading).
 */
export function preloadBand(band: number): void {
  getWordsByBand(band).catch(console.error);
}

/**
 * Preload all bands (for users who want full offline support).
 */
export function preloadAllBands(): void {
  for (let band = 0; band <= 7; band++) {
    preloadBand(band);
  }
}
