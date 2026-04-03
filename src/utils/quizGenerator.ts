import { Word, QuizQuestion, WordProgress } from '../types';
import { CAMBRIDGE_ROADMAP } from '../data/roadmap_vocab';
import { BAND_TOPICS } from '../data/topics';
import { isDue } from './srs';

// LocalStorage utility with graceful error handling
const storage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`localStorage.getItem failed for key "${key}":`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      // Handle QuotaExceededError or other storage errors
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Clearing old cache entries...');
        // Clear oldest paraphrase entries to make room
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('paraphrases_')) {
            keysToRemove.push(key);
          }
        }
        // Remove half of the paraphrase cache
        keysToRemove.slice(0, Math.floor(keysToRemove.length / 2)).forEach(k => {
          try {
            localStorage.removeItem(k);
          } catch {
            // Ignore errors during cleanup
          }
        });
        // Retry once
        try {
          localStorage.setItem(key, value);
          return true;
        } catch {
          console.error('Failed to save to localStorage after cleanup');
          return false;
        }
      }
      console.warn(`localStorage.setItem failed for key "${key}":`, error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`localStorage.removeItem failed for key "${key}":`, error);
      return false;
    }
  }
};

export const getWordsForTopic = (band: number, topicId: string, completedWords: string[] = [], count: number = 5): Word[] => {
  // Try to filter words by band and topicId first
  let topicWords = CAMBRIDGE_ROADMAP.filter(w => w.band === band && w.topicId === topicId);
  
  // If no words found for this specific topicId, fallback to the slicing logic
  if (topicWords.length === 0) {
    const bandWords = CAMBRIDGE_ROADMAP.filter(w => w.band === band);
    const topicsForBand = BAND_TOPICS[band] || [];
    const topicIndex = topicsForBand.findIndex(t => t.id === topicId);
    
    if (topicIndex !== -1 && topicsForBand.length > 0) {
      const wordsPerTopic = Math.ceil(bandWords.length / topicsForBand.length);
      const startIndex = topicIndex * wordsPerTopic;
      const endIndex = startIndex + wordsPerTopic;
      topicWords = bandWords.slice(startIndex, endIndex);
    } else {
      topicWords = bandWords;
    }
  }

  // If still no words (e.g., empty band), return empty
  if (topicWords.length === 0) return [];

  // Filter out words already completed by the user
  const unlearnedWords = topicWords.filter(w => !completedWords.includes(w.id));
  
  // If all words in this topic are learned, we can either:
  // 1. Return a random set for review
  // 2. Return an empty array (to show topic as fully completed)
  // Let's return a random set for review if all are learned
  if (unlearnedWords.length === 0) {
    return [...topicWords].sort(() => 0.5 - Math.random()).slice(0, count);
  }

  // Take the next batch of unlearned words
  // We don't shuffle here to keep it systematic, or we can shuffle unlearned words
  const shuffledUnlearned = [...unlearnedWords].sort(() => 0.5 - Math.random());
  const selectedWords = shuffledUnlearned.slice(0, count);

  // If not enough unlearned words, fill with already learned words from the same topic for review
  if (selectedWords.length < count) {
    const learnedWords = topicWords.filter(w => completedWords.includes(w.id));
    const shuffledLearned = [...learnedWords].sort(() => 0.5 - Math.random());
    selectedWords.push(...shuffledLearned.slice(0, count - selectedWords.length));
  }

  return selectedWords;
};

export const getTopicStats = (band: number, topicId: string, completedWords: string[]) => {
  let topicWords = CAMBRIDGE_ROADMAP.filter(w => w.band === band && w.topicId === topicId);
  
  if (topicWords.length === 0) {
    const bandWords = CAMBRIDGE_ROADMAP.filter(w => w.band === band);
    const topicsForBand = BAND_TOPICS[band] || [];
    const topicIndex = topicsForBand.findIndex(t => t.id === topicId);
    
    if (topicIndex !== -1 && topicsForBand.length > 0) {
      const wordsPerTopic = Math.ceil(bandWords.length / topicsForBand.length);
      const startIndex = topicIndex * wordsPerTopic;
      const endIndex = startIndex + wordsPerTopic;
      topicWords = bandWords.slice(startIndex, endIndex);
    } else {
      topicWords = bandWords;
    }
  }

  const total = topicWords.length;
  const completed = topicWords.filter(w => completedWords.includes(w.id)).length;
  
  return { total, completed };
};

export const getReviewWords = (wordProgress: Record<string, WordProgress>, count: number = 10): Word[] => {
  const reviewIds = Object.entries(wordProgress)
    .filter(([_, progress]) => isDue(progress.nextReview))
    .map(([wordId]) => wordId);

  if (reviewIds.length === 0) return [];

  const selectedIds = reviewIds.sort(() => 0.5 - Math.random()).slice(0, count);
  return CAMBRIDGE_ROADMAP.filter(w => selectedIds.includes(w.id));
};

import { generateParaphrasesForWord, ParaphrasePair } from '../services/geminiService';

export const generateQuizForWords = async (selectedWords: Word[]): Promise<QuizQuestion[]> => {
  // First, ensure all selected words have paraphrasePairs if possible
  // Parallelize the generation to avoid sequential bottlenecks
  await Promise.all(selectedWords.map(async (word) => {
    if (!word.paraphrasePairs || word.paraphrasePairs.length === 0) {
      // Check local storage cache first
      const cacheKey = `paraphrases_${word.id}`;
      const cached = storage.getItem(cacheKey);
      if (cached) {
        try {
          word.paraphrasePairs = JSON.parse(cached);
        } catch (e) {
          console.error('Error parsing cached paraphrases', e);
          storage.removeItem(cacheKey);
        }
      } else {
        // Generate on the fly
        console.log(`Generating paraphrases for ${word.word}...`);
        try {
          const generated = await generateParaphrasesForWord(word.word, word.vietnameseDefinition);
          if (generated && generated.length > 0) {
            word.paraphrasePairs = generated;
            storage.setItem(cacheKey, JSON.stringify(generated));
          }
        } catch (e) {
          console.error(`Failed to generate paraphrases for ${word.word}:`, e);
          // Continue without paraphrases - not critical
        }
      }
    }
  }));

  return selectedWords.map((word) => {
    const typeRand = Math.random();
    let type: QuizQuestion['type'] = 'definition';
    let question = '';
    let correctAnswer = '';
    let options: string[] = [];
    let explanation = '';
    let pairs: { en: string; vi: string }[] | undefined;
    let scrambledWords: string[] | undefined;
    let keyword: string | undefined;
    let originalSentence: string | undefined;
    let xpReward: number = 10;

    if (typeRand < 0.25 && word.paraphrasePairs && word.paraphrasePairs.length > 0 && word.band >= 3) {
      const hasSentences = word.paraphrasePairs.some(p => p.originalSentence && p.paraphrasedSentence);
      if (hasSentences && Math.random() < 0.5) {
        type = 'keyword_transformation';
        xpReward = 50;
      } else {
        type = 'paraphrase';
        xpReward = 15;
      }
    } else if (typeRand < 0.35) {
      type = 'definition';
    } else if (typeRand < 0.45) {
      type = 'collocation';
    } else if (typeRand < 0.55) {
      type = 'example';
    } else if (typeRand < 0.65) {
      type = 'fill_in_blank';
    } else if (typeRand < 0.75) {
      type = 'audio';
    } else if (typeRand < 0.85) {
      type = 'matching';
    } else if (typeRand < 0.95) {
      type = 'typing';
    } else if (typeRand < 0.98) {
      type = 'sentence_building';
      xpReward = 20;
    } else if (word.antonyms && word.antonyms.length > 0 && Math.random() < 0.5) {
      type = 'antonym';
    } else if (word.wordFamily && Object.values(word.wordFamily).some(arr => arr && arr.length > 0) && Math.random() < 0.5) {
      type = 'word_form';
    } else {
      type = 'speaking';
      xpReward = 30;
    }

    if (type === 'definition') {
      question = `Nghĩa của từ "${word.word}" là gì?`;
      correctAnswer = word.vietnameseDefinition;
      explanation = `"${word.word}" có nghĩa là: ${word.vietnameseDefinition} (${word.definition})`;
      
      const otherDefs: string[] = [];
      const usedDefs = new Set([correctAnswer]);
      
      const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
      
      for (const w of availableWords) {
        if (w.id !== word.id && w.vietnameseDefinition && !usedDefs.has(w.vietnameseDefinition)) {
          otherDefs.push(w.vietnameseDefinition);
          usedDefs.add(w.vietnameseDefinition);
          if (otherDefs.length === 3) break;
        }
      }
      
      options = [correctAnswer, ...otherDefs].sort(() => 0.5 - Math.random());
    } else if (type === 'collocation') {
      const collocation = word.collocations[Math.floor(Math.random() * word.collocations.length)];
      const parts = collocation.split(' ');
      
      // Try to blank out a word that is NOT the main vocabulary word to test collocation knowledge
      const mainWordLower = word.word.toLowerCase();
      let targetIndex = parts.findIndex(p => p.toLowerCase() !== mainWordLower && p.length > 2);
      
      if (targetIndex === -1) {
        targetIndex = Math.floor(Math.random() * parts.length);
      }
      
      const targetWord = parts[targetIndex];
      const blankedCollocation = parts.map((p, i) => i === targetIndex ? '_______' : p).join(' ');
      
      // Check if example contains the collocation
      const collocationRegex = new RegExp(`\\b${collocation}\\b`, 'i');
      
      if (collocationRegex.test(word.example)) {
         const blankedSentence = word.example.replace(collocationRegex, blankedCollocation);
         question = `Điền từ thích hợp để tạo thành cụm từ đúng:\n"${blankedSentence}"`;
      } else {
         question = `Điền từ thích hợp để hoàn thành cụm từ (collocation) sau:\n"${blankedCollocation}"`;
      }
      
      correctAnswer = targetWord;
      explanation = `Cụm từ đúng là "${collocation}".`;
      
      const otherWords: string[] = [];
      const usedWords = new Set([correctAnswer.toLowerCase()]);
      
      const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
      
      for (const w of availableWords) {
        const wLower = w.word.toLowerCase();
        if (w.id !== word.id && !usedWords.has(wLower)) {
          otherWords.push(w.word.toLowerCase());
          usedWords.add(wLower);
          if (otherWords.length === 3) break;
        }
      }
      
      options = [correctAnswer, ...otherWords].sort(() => 0.5 - Math.random());
    } else if (type === 'example') {
      let sentence = word.example;
      let viSentence = word.vietnameseExample;

      question = `Hoàn thành câu: "${sentence.replace(new RegExp(`\\b${word.word}\\b`, 'gi'), '_______')}"\n(${viSentence})`;
      correctAnswer = word.word;
      explanation = `Từ đúng là "${word.word}". Ví dụ: ${sentence}`;
      
      const otherWords: string[] = [];
      const usedWords = new Set([correctAnswer.toLowerCase()]);
      
      const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
      
      for (const w of availableWords) {
        const wLower = w.word.toLowerCase();
        if (w.id !== word.id && !usedWords.has(wLower)) {
          otherWords.push(w.word);
          usedWords.add(wLower);
          if (otherWords.length === 3) break;
        }
      }
      
      options = [correctAnswer, ...otherWords].sort(() => 0.5 - Math.random());
    } else if (type === 'fill_in_blank') {
      let sentence = word.example;

      question = `Điền từ thích hợp vào chỗ trống:\n"${sentence.replace(new RegExp(`\\b${word.word}\\b`, 'gi'), '_______')}"`;
      correctAnswer = word.word;
      explanation = `Từ cần điền là "${word.word}". Nghĩa: ${word.vietnameseDefinition}`;
      
      const otherWords: string[] = [];
      const usedWords = new Set([correctAnswer.toLowerCase()]);
      
      const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
      
      for (const w of availableWords) {
        const wLower = w.word.toLowerCase();
        if (w.id !== word.id && !usedWords.has(wLower)) {
          otherWords.push(w.word);
          usedWords.add(wLower);
          if (otherWords.length === 3) break;
        }
      }
      
      options = [correctAnswer, ...otherWords].sort(() => 0.5 - Math.random());
    } else if (type === 'audio') {
      question = `Nghe và chọn từ đúng:`;
      correctAnswer = word.word;
      explanation = `Từ bạn vừa nghe là "${word.word}" (${word.vietnameseDefinition}).`;
      
      const otherWords: string[] = [];
      const usedWords = new Set([correctAnswer.toLowerCase()]);
      
      const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
      
      for (const w of availableWords) {
        const wLower = w.word.toLowerCase();
        if (w.id !== word.id && !usedWords.has(wLower)) {
          otherWords.push(w.word);
          usedWords.add(wLower);
          if (otherWords.length === 3) break;
        }
      }
      
      options = [correctAnswer, ...otherWords].sort(() => 0.5 - Math.random());
    } else if (type === 'matching') {
      const matchTypeRand = Math.random();
      if (matchTypeRand < 0.4) {
        question = "Ghép các từ tiếng Anh với nghĩa tiếng Việt tương ứng:";
        const otherWords = CAMBRIDGE_ROADMAP
          .filter(w => w.id !== word.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        const allWords = [word, ...otherWords];
        pairs = allWords.map(w => ({ en: w.word, vi: w.vietnameseDefinition }));
      } else if (matchTypeRand < 0.7) {
        question = "Ghép các từ tiếng Anh với định nghĩa tiếng Anh tương ứng:";
        const otherWords = CAMBRIDGE_ROADMAP
          .filter(w => w.id !== word.id && w.definition)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);
        const allWords = [word, ...otherWords];
        pairs = allWords.map(w => ({ en: w.word, vi: w.definition }));
      } else {
        // Synonym matching if available, otherwise fallback to definition
        const wordsWithSynonyms = CAMBRIDGE_ROADMAP.filter(w => w.synonyms && w.synonyms.length > 0);
        if (wordsWithSynonyms.length >= 3) {
          question = "Ghép các từ tiếng Anh với từ đồng nghĩa tương ứng:";
          const selected = [...wordsWithSynonyms].sort(() => 0.5 - Math.random()).slice(0, 3);
          pairs = selected.map(w => ({ en: w.word, vi: w.synonyms![0] }));
        } else {
          // Fallback to definition matching
          question = "Ghép các từ tiếng Anh với định nghĩa tiếng Anh tương ứng:";
          const otherWords = CAMBRIDGE_ROADMAP
            .filter(w => w.id !== word.id && w.definition)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
          const allWords = [word, ...otherWords];
          pairs = allWords.map(w => ({ en: w.word, vi: w.definition }));
        }
      }
      correctAnswer = "matched_all";
      explanation = `Tuyệt vời! Bạn đã hoàn thành bài tập ghép từ.`;
    } else if (type === 'typing') {
      question = `Gõ từ tiếng Anh có nghĩa là:\n"${word.vietnameseDefinition}"`;
      correctAnswer = word.word;
      explanation = `Từ đúng là "${word.word}".`;
    } else if (type === 'sentence_building') {
      question = `Sắp xếp các từ sau thành câu hoàn chỉnh:\n(${word.vietnameseExample})`;
      const cleanSentence = word.example.replace(/[.,?!]/g, '');
      const words = cleanSentence.split(' ').filter(w => w.trim().length > 0);
      let scrambled = [...words].sort(() => 0.5 - Math.random());
      while (scrambled.join(' ') === words.join(' ') && words.length > 1) {
        scrambled = [...words].sort(() => 0.5 - Math.random());
      }
      scrambledWords = scrambled;
      correctAnswer = words.join(' ');
      explanation = `Câu hoàn chỉnh là: "${word.example}"`;
    } else if (type === 'speaking') {
      question = `Phát âm từ sau:`;
      correctAnswer = word.word;
      explanation = `Từ đúng là "${word.word}" (${word.vietnameseDefinition}).`;
    } else if (type === 'antonym') {
      const antonym = word.antonyms![Math.floor(Math.random() * word.antonyms!.length)];
      question = `Từ nào trái nghĩa với "${word.word}"?`;
      correctAnswer = antonym;
      explanation = `"${word.word}" có nghĩa là ${word.vietnameseDefinition}. Từ trái nghĩa là "${antonym}".`;
      
      const otherWords: string[] = [];
      const usedWords = new Set([correctAnswer.toLowerCase(), word.word.toLowerCase()]);
      
      const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
      for (const w of availableWords) {
        if (!usedWords.has(w.word.toLowerCase())) {
          otherWords.push(w.word);
          usedWords.add(w.word.toLowerCase());
          if (otherWords.length === 3) break;
        }
      }
      options = [correctAnswer, ...otherWords].sort(() => 0.5 - Math.random());
    } else if (type === 'word_form') {
      // Find all available forms
      const forms: {text: string, type: string}[] = [];
      if (word.wordFamily?.noun) word.wordFamily.noun.forEach(f => forms.push({text: f, type: 'noun'}));
      if (word.wordFamily?.verb) word.wordFamily.verb.forEach(f => forms.push({text: f, type: 'verb'}));
      if (word.wordFamily?.adj) word.wordFamily.adj.forEach(f => forms.push({text: f, type: 'adj'}));
      if (word.wordFamily?.adv) word.wordFamily.adv.forEach(f => forms.push({text: f, type: 'adv'}));
      
      const targetForm = forms[Math.floor(Math.random() * forms.length)];
      question = `Chọn dạng từ đúng của "${word.word}" (${targetForm.type.toUpperCase()}):`;
      correctAnswer = targetForm.text;
      explanation = `Dạng ${targetForm.type} của "${word.word}" là "${targetForm.text}".`;
      
      const otherForms: string[] = [];
      const usedForms = new Set([correctAnswer.toLowerCase()]);
      
      // Try to get other forms from the same word family as distractors
      forms.forEach(f => {
        if (!usedForms.has(f.text.toLowerCase())) {
          otherForms.push(f.text);
          usedForms.add(f.text.toLowerCase());
        }
      });
      
      // If not enough distractors, get from other words
      if (otherForms.length < 3) {
        const availableWords = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random());
        for (const w of availableWords) {
          if (w.id !== word.id) {
            otherForms.push(w.word);
            if (otherForms.length === 3) break;
          }
        }
      }
      
      options = [correctAnswer, ...otherForms.slice(0, 3)].sort(() => 0.5 - Math.random());
    } else if (type === 'paraphrase') {
      const pair = word.paraphrasePairs![Math.floor(Math.random() * word.paraphrasePairs!.length)];
      const useSentence = !!pair.originalSentence && !!pair.paraphrasedSentence;
      
      const promptText = useSentence ? pair.originalSentence : pair.original;
      const correctText = useSentence ? pair.paraphrasedSentence : pair.paraphrased;
      
      question = `Chọn cách viết lại học thuật nhất cho câu/cụm từ sau:\n"${promptText}"`;
      correctAnswer = correctText!;
      explanation = pair.explanation || `Cách viết lại này sử dụng từ "${word.word}" một cách chính xác theo phong cách học thuật. (Phương pháp: ${pair.method})`;
      
      const otherParaphrases: string[] = [];
      // Get paraphrases from other words as distractors
      const availableWords = [...CAMBRIDGE_ROADMAP].filter(w => w.paraphrasePairs && w.paraphrasePairs.length > 0 && w.id !== word.id).sort(() => 0.5 - Math.random());
      for (const w of availableWords) {
        const distractorPair = w.paraphrasePairs![0];
        const distractorText = useSentence && distractorPair.paraphrasedSentence 
          ? distractorPair.paraphrasedSentence 
          : distractorPair.paraphrased;
        otherParaphrases.push(distractorText!);
        if (otherParaphrases.length === 3) break;
      }
      
      // If not enough, use examples
      if (otherParaphrases.length < 3) {
        const distractors = [...CAMBRIDGE_ROADMAP].sort(() => 0.5 - Math.random()).slice(0, 3 - otherParaphrases.length);
        distractors.forEach(d => otherParaphrases.push(d.example));
      }
      
      options = [correctAnswer, ...otherParaphrases].sort(() => 0.5 - Math.random());
    } else if (type === 'keyword_transformation') {
      const validPairs = word.paraphrasePairs!.filter(p => p.originalSentence && p.paraphrasedSentence);
      const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
      
      question = `Viết lại câu sau sao cho nghĩa không đổi, sử dụng từ khóa được cho:`;
      correctAnswer = pair.paraphrasedSentence!;
      originalSentence = pair.originalSentence!;
      keyword = word.word;
      explanation = pair.explanation || `Câu viết lại sử dụng từ khóa "${word.word}". (Phương pháp: ${pair.method})`;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question,
      options,
      correctAnswer,
      explanation,
      wordId: word.id,
      pairs,
      scrambledWords,
      keyword,
      originalSentence,
      xpReward
    };
  });
};
