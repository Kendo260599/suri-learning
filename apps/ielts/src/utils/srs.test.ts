import { describe, it, expect } from 'vitest';
import { updateSRS, isDue } from './srs';

describe('SuperMemo-2 Algorithm (SRS)', () => {
  describe('updateSRS', () => {
    it('should initialize with default values when no currentProgress provided', () => {
      const result = updateSRS(4);
      
      expect(result.interval).toBe(1);
      expect(result.repetition).toBe(1);
      expect(result.efactor).toBe(2.5);
      expect(result.srsLevel).toBe(1);
      expect(result.nextReview).toBeDefined();
    });

    it('should set interval to 1 day for first successful review (quality >= 3)', () => {
      const result = updateSRS(3);
      
      expect(result.interval).toBe(1);
      expect(result.repetition).toBe(1);
    });

    it('should set interval to 6 days for second successful review', () => {
      const currentProgress = {
        interval: 1,
        repetition: 1,
        efactor: 2.5,
        srsLevel: 1,
        nextReview: new Date().toISOString()
      };
      
      const result = updateSRS(4, currentProgress);
      
      expect(result.interval).toBe(6);
      expect(result.repetition).toBe(2);
    });

    it('should calculate interval using efactor for subsequent reviews', () => {
      const currentProgress = {
        interval: 6,
        repetition: 2,
        efactor: 2.5,
        srsLevel: 2,
        nextReview: new Date().toISOString()
      };
      
      const result = updateSRS(4, currentProgress);
      
      expect(result.interval).toBe(15); // 6 * 2.5 = 15
      expect(result.repetition).toBe(3);
    });

    it('should reset repetition and interval when quality < 3 (failed review)', () => {
      const currentProgress = {
        interval: 15,
        repetition: 5,
        efactor: 2.5,
        srsLevel: 5,
        nextReview: new Date().toISOString()
      };
      
      const result = updateSRS(2, currentProgress);
      
      expect(result.interval).toBe(1);
      expect(result.repetition).toBe(0);
    });

    it('should increase efactor for good quality response (quality 4-5)', () => {
      const currentProgress = {
        interval: 1,
        repetition: 1,
        efactor: 2.5,
        srsLevel: 1,
        nextReview: new Date().toISOString()
      };
      
      const result = updateSRS(5, currentProgress);
      
      // Formula: efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
      // 2.5 + (0.1 - 0 * (0.08 + 0 * 0.02)) = 2.5 + 0.1 = 2.6
      expect(result.efactor).toBe(2.6);
    });

    it('should decrease efactor for poor quality response (quality 0-2)', () => {
      const currentProgress = {
        interval: 6,
        repetition: 2,
        efactor: 2.5,
        srsLevel: 2,
        nextReview: new Date().toISOString()
      };
      
      const result = updateSRS(1, currentProgress);
      
      // Formula: 2.5 + (0.1 - 4 * (0.08 + 4 * 0.02)) = 2.5 + (0.1 - 0.4) = 2.2
      expect(result.efactor).toBe(2.1);
    });

    it('should not let efactor drop below 1.3', () => {
      const currentProgress = {
        interval: 15,
        repetition: 3,
        efactor: 1.3,
        srsLevel: 3,
        nextReview: new Date().toISOString()
      };
      
      // Multiple failures should keep efactor at minimum 1.3
      const result1 = updateSRS(0, currentProgress);
      expect(result1.efactor).toBeGreaterThanOrEqual(1.3);
    });

    it('should handle quality exactly at 3 (pass threshold)', () => {
      const result = updateSRS(3);
      
      expect(result.repetition).toBeGreaterThan(0);
      expect(result.interval).toBe(1);
    });

    it('should set nextReview date correctly based on interval', () => {
      const now = new Date();
      const result = updateSRS(4);
      
      const nextReviewDate = new Date(result.nextReview);
      const expectedDate = new Date(now);
      expectedDate.setDate(expectedDate.getDate() + result.interval);
      
      // Allow for slight time difference in test execution
      expect(Math.abs(nextReviewDate.getTime() - expectedDate.getTime())).toBeLessThan(60000);
    });
  });

  describe('isDue', () => {
    it('should return true when nextReview is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      expect(isDue(pastDate.toISOString())).toBe(true);
    });

    it('should return true when nextReview is now', () => {
      const now = new Date();
      
      expect(isDue(now.toISOString())).toBe(true);
    });

    it('should return false when nextReview is in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      expect(isDue(futureDate.toISOString())).toBe(false);
    });

    it('should handle edge case of exactly 1 second in the future', () => {
      const future = new Date(Date.now() + 1000);
      
      expect(isDue(future.toISOString())).toBe(false);
    });
  });
});
