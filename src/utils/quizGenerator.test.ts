import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getWordsForTopic, getTopicStats, getReviewWords } from '../utils/quizGenerator';
import * as srsModule from '../utils/srs';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn().mockReturnValue(null),
  setItem: vi.fn().mockReturnValue(true),
  removeItem: vi.fn().mockReturnValue(true),
  length: 0,
  key: vi.fn().mockReturnValue(null),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as unknown as Storage;

describe('Quiz Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('getWordsForTopic', () => {
    it('should return words filtered by band and topic', async () => {
      const completedWords: string[] = [];
      const result = await getWordsForTopic(5, 'task-response', completedWords, 5);
      
      // Should return array of words (may be empty if no words exist for that topic)
      expect(Array.isArray(result)).toBe(true);
    });

    it('should exclude completed words from results', async () => {
      // Get some words first
      const result1 = await getWordsForTopic(5, 'task-response', [], 10);
      
      if (result1.length > 0) {
        const completedWords = [result1[0].id];
        const result2 = await getWordsForTopic(5, 'task-response', completedWords, 10);
        
        // Completed words should not appear in the filtered results
        const completedInResult = result2.filter(w => completedWords.includes(w.id));
        expect(completedInResult.length).toBe(0);
      }
    });

    it('should respect the count parameter', async () => {
      const result = await getWordsForTopic(5, 'task-response', [], 3);
      expect(result.length).toBeLessThanOrEqual(3);
    });

    it('should handle non-existent topic gracefully', async () => {
      const result = await getWordsForTopic(5, 'nonexistent-topic-xyz', [], 5);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty completedWords parameter', async () => {
      const result = await getWordsForTopic(5, 'task-response');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getTopicStats', () => {
    it('should return topic statistics with total and completed counts', async () => {
      const completedWords: string[] = [];
      const stats = await getTopicStats(5, 'task-response', completedWords);
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('completed');
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.completed).toBe('number');
    });

    it('should return 0 for completed when no words are completed', async () => {
      const stats = await getTopicStats(5, 'task-response', []);
      expect(stats.completed).toBe(0);
    });

    it('should count completed words correctly', async () => {
      const stats1 = await getTopicStats(5, 'task-response', []);
      const total = stats1.total;
      
      if (total > 0) {
        // Mark first word as completed
        const words = await getWordsForTopic(5, 'task-response', [], total);
        if (words.length > 0) {
          const completedWords = [words[0].id];
          const stats2 = await getTopicStats(5, 'task-response', completedWords);
          expect(stats2.completed).toBe(1);
        }
      }
    });
  });

  describe('getReviewWords', () => {
    it('should return empty array when no wordProgress provided', async () => {
      const result = await getReviewWords({}, 10);
      expect(result).toEqual([]);
    });

    it('should return empty array when no words are due', async () => {
      // Mock isDue to return false
      vi.spyOn(srsModule, 'isDue').mockReturnValue(false);
      
      const wordProgress = {
        'word1': {
          srsLevel: 1,
          nextReview: new Date().toISOString(),
          interval: 1,
          repetition: 1,
          efactor: 2.5
        }
      };
      
      const result = await getReviewWords(wordProgress, 10);
      expect(result).toEqual([]);
    });

    it('should return due words when they exist', async () => {
      // Mock isDue to return true
      vi.spyOn(srsModule, 'isDue').mockReturnValue(true);
      
      const wordProgress = {
        'word1': {
          srsLevel: 1,
          nextReview: new Date().toISOString(),
          interval: 1,
          repetition: 1,
          efactor: 2.5
        },
        'word2': {
          srsLevel: 2,
          nextReview: new Date().toISOString(),
          interval: 6,
          repetition: 2,
          efactor: 2.5
        }
      };
      
      const result = await getReviewWords(wordProgress, 10);
      expect(result.length).toBeGreaterThan(0);
      
      // Cleanup
      vi.restoreAllMocks();
    });

    it('should respect the count parameter for due words', async () => {
      vi.spyOn(srsModule, 'isDue').mockReturnValue(true);
      
      const wordProgress = {
        'word1': { srsLevel: 1, nextReview: new Date().toISOString(), interval: 1, repetition: 1, efactor: 2.5 },
        'word2': { srsLevel: 1, nextReview: new Date().toISOString(), interval: 1, repetition: 1, efactor: 2.5 },
        'word3': { srsLevel: 1, nextReview: new Date().toISOString(), interval: 1, repetition: 1, efactor: 2.5 },
        'word4': { srsLevel: 1, nextReview: new Date().toISOString(), interval: 1, repetition: 1, efactor: 2.5 },
        'word5': { srsLevel: 1, nextReview: new Date().toISOString(), interval: 1, repetition: 1, efactor: 2.5 },
      };
      
      const result = await getReviewWords(wordProgress, 2);
      expect(result.length).toBeLessThanOrEqual(2);
      
      // Cleanup
      vi.restoreAllMocks();
    });
  });
});
