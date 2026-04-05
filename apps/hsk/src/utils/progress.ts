export const getProgress = () => {
  try {
    const progress = localStorage.getItem('hsk_progress');
    if (progress) {
      const parsed = JSON.parse(progress);
      // Validate structure
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastActive: typeof parsed.lastActive === 'string' ? parsed.lastActive : null,
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          masteredWords: Array.isArray(parsed.masteredWords) ? parsed.masteredWords : [],
          srsData: (typeof parsed.srsData === 'object' && parsed.srsData !== null) ? parsed.srsData : {},
        };
      }
    }
  } catch {
    // Corrupted localStorage — reset
  }
  return {
    xp: 0,
    streak: 0,
    lastActive: null,
    completedLessons: [],
    masteredWords: [],
    srsData: {} as Record<string, {
      interval: number;
      repetition: number;
      efactor: number;
      nextReview: string;
    }>
  };
};

export const addXP = (amount: number) => {
  const progress = getProgress();
  progress.xp += amount;
  
  // Check streak
  const today = new Date().toDateString();
  if (progress.lastActive !== today) {
    const lastDate = progress.lastActive ? new Date(progress.lastActive) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastDate && lastDate.toDateString() === yesterday.toDateString()) {
      progress.streak += 1;
    } else if (!lastDate || lastDate.toDateString() !== today) {
      progress.streak = 1;
    }
    progress.lastActive = today;
  }
  
  localStorage.setItem('hsk_progress', JSON.stringify(progress));
  return progress;
};

export const completeLesson = (lessonId: number) => {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.xp += 50; // Bonus for completing lesson
    localStorage.setItem('hsk_progress', JSON.stringify(progress));
  }
  return progress;
};

export const masterWord = (wordId: string) => {
  const progress = getProgress();
  if (!progress.masteredWords) progress.masteredWords = [];
  if (!progress.masteredWords.includes(wordId)) {
    progress.masteredWords.push(wordId);
    progress.xp += 20; // Bonus for mastering a word
    localStorage.setItem('hsk_progress', JSON.stringify(progress));
  }
  return progress;
};

/**
 * SM-2 Spaced Repetition Algorithm
 * q: quality of response (0-5)
 * 5: perfect response
 * 4: correct response after a hesitation
 * 3: correct response recalled with serious difficulty
 * 2: incorrect response; where the correct one seemed easy to recall
 * 1: incorrect response; the correct one remembered
 * 0: complete blackout.
 */
export const updateSRS = (wordId: string, q: number) => {
  const progress = getProgress();
  if (!progress.srsData) progress.srsData = {};
  
  const wordData = progress.srsData[wordId] || {
    interval: 0,
    repetition: 0,
    efactor: 2.5,
    nextReview: new Date().toISOString()
  };

  if (q >= 3) {
    if (wordData.repetition === 0) {
      wordData.interval = 1;
    } else if (wordData.repetition === 1) {
      wordData.interval = 6;
    } else {
      wordData.interval = Math.round(wordData.interval * wordData.efactor);
    }
    wordData.repetition += 1;
  } else {
    wordData.repetition = 0;
    wordData.interval = 1;
  }

  wordData.efactor = Math.max(1.3, Math.min(2.5, wordData.efactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + wordData.interval);
  wordData.nextReview = nextDate.toISOString();

  progress.srsData[wordId] = wordData;
  
  // Also add to mastered words if q is high
  if (q >= 4 && !progress.masteredWords.includes(wordId)) {
    progress.masteredWords.push(wordId);
  }

  localStorage.setItem('hsk_progress', JSON.stringify(progress));
  return progress;
};

export const getDueWordsCount = () => {
  const progress = getProgress();
  if (!progress.srsData) return 0;
  
  const now = new Date();
  return Object.values(progress.srsData).filter((data) => {
    return new Date((data as { nextReview: string }).nextReview) <= now;
  }).length;
};
