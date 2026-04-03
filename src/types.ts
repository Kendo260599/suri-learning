export interface Example {
  sentence: string;
  translation: string;
  context: 'academic' | 'general' | 'daily';
}

export interface Word {
  id: string;
  word: string;
  ipa?: string;
  image?: string;
  definition: string;
  vietnameseDefinition: string;
  collocations: string[];
  example: string;
  vietnameseExample: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  band: number; // 0 to 7
  topicId?: string; // Optional topic association
  synonyms?: string[];
  antonyms?: string[];
  wordFamily?: {
    noun?: string[];
    verb?: string[];
    adj?: string[];
    adv?: string[];
    prep?: string[];
    conj?: string[];
  };
  paraphrasePairs?: {
    original: string;
    paraphrased: string;
    originalSentence?: string;
    paraphrasedSentence?: string;
    explanation?: string;
    method: 'synonym' | 'word_form' | 'structure' | 'mixed';
  }[];
  usageNotes?: string;
  register?: 'formal' | 'informal' | 'neutral' | 'academic';
  examples?: Example[];
  phonetics?: {
    text: string;
    audio?: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  type: 'definition' | 'collocation' | 'example' | 'matching' | 'fill_in_blank' | 'audio' | 'typing' | 'sentence_building' | 'speaking' | 'antonym' | 'word_form' | 'paraphrase' | 'keyword_transformation';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  wordId: string;
  // For matching pairs
  pairs?: { en: string; vi: string }[];
  // For sentence building
  scrambledWords?: string[];
  // For keyword transformation
  keyword?: string;
  originalSentence?: string;
  // XP Reward
  xpReward?: number;
}

export interface DailyTask {
  id: string;
  type: 'vocabulary' | 'grammar' | 'review';
  targetId: string;
  isDone: boolean;
  title: string;
  description: string;
}

export interface DailyPlan {
  date: string;
  tasks: DailyTask[];
  isCompleted: boolean;
}

export interface WordProgress {
  srsLevel: number;
  nextReview: string;
  interval: number;
  repetition: number;
  efactor: number;
}

export interface UserStats {
  xp: number;
  streak: number;
  lastActive: string;
  unlockedBands: number[];
  unlockedTopics: string[];
  completedWords: string[];
  completedTopics?: string[];
  completedGrammar?: string[];
  completedMicroSkills?: string[];
  // SRS fields
  wordProgress?: Record<string, WordProgress>;
  wordsToReview?: string[];
  // Daily Plan
  dailyPlan?: DailyPlan;
  displayName?: string | null;
  photoURL?: string | null;
  role?: 'admin' | 'user';
  // Periodic XP for leaderboard
  xpWeek?: number;
  xpMonth?: number;
  lastWeeklyReset?: string; // ISO date
  lastMonthlyReset?: string; // ISO date
}

export interface MicroSkill {
  id: string;
  type: 'reading' | 'listening';
  title: string;
  passage?: string; // For reading
  audioText?: string; // For listening (TTS)
  question: string;
  options?: string[]; // For multiple choice (TFNG)
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  userAnswers: string[];
  isFinished: boolean;
  band: number;
  topicId: string;
  sessionXpGained?: number;
}
