import { WordProgress } from '../types';

/**
 * SuperMemo-2 Algorithm implementation
 * @param quality 0-5 (0: total blackout, 5: perfect response)
 * @param currentProgress current word progress
 * @returns updated word progress
 */
export function updateSRS(quality: number, currentProgress?: WordProgress): WordProgress {
  let { interval, repetition, efactor } = currentProgress || {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
  };

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition++;
  } else {
    repetition = 0;
    interval = 1;
  }

  efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (efactor < 1.3) efactor = 1.3;

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    srsLevel: repetition,
    nextReview: nextReview.toISOString(),
    interval,
    repetition,
    efactor,
  };
}

export function isDue(nextReview: string): boolean {
  return new Date(nextReview) <= new Date();
}
