import { describe, it, expect } from 'vitest';
import { getRankInfo } from './rankSystem';

describe('Rank System', () => {
  describe('getRankInfo', () => {
    describe('level calculations', () => {
      it('should calculate level 1 for 0 XP', () => {
        const result = getRankInfo(0);
        expect(result.level).toBe(1);
      });

      it('should calculate level 1 for 49 XP (max for level 1)', () => {
        const result = getRankInfo(49);
        expect(result.level).toBe(1);
      });

      it('should calculate level 2 for 50 XP (min for level 2)', () => {
        const result = getRankInfo(50);
        expect(result.level).toBe(2);
      });

      it('should calculate level 2 for 199 XP', () => {
        const result = getRankInfo(199);
        expect(result.level).toBe(2);
      });

      it('should calculate level 3 for 200 XP', () => {
        const result = getRankInfo(200);
        expect(result.level).toBe(3);
      });

      it('should calculate level 10 for 4050 XP', () => {
        const result = getRankInfo(4050);
        expect(result.level).toBe(10);
      });

      it('should calculate level 40 for 76050 XP', () => {
        const result = getRankInfo(76050);
        expect(result.level).toBe(40);
      });
    });

    describe('XP progress tracking', () => {
      it('should calculate correct progress percentage at level start', () => {
        const result = getRankInfo(0);
        expect(result.progress).toBe(0);
        expect(result.currentXP).toBe(0);
        expect(result.totalXP).toBe(0);
      });

      it('should calculate correct progress percentage mid-level', () => {
        const result = getRankInfo(25);
        expect(result.progress).toBe(50); // 25/50 = 50%
        expect(result.currentXP).toBe(25);
      });

      it('should calculate progress correctly near level end', () => {
        const result = getRankInfo(49);
        expect(result.progress).toBe(98); // 49/50 = 98%
      });
    });

    describe('rank naming across progression', () => {
      it('should assign Đồng rank at level 1', () => {
        const result = getRankInfo(10);
        expect(result.rankName).toBe('Đồng');
        expect(result.rankColor).toContain('amber');
      });

      it('should assign Bạc rank at level 5', () => {
        const result = getRankInfo(Math.pow(4, 2) * 50); // 800 XP = level 5
        expect(result.rankName).toBe('Bạc');
      });

      it('should assign Vàng rank at level 10', () => {
        const result = getRankInfo(Math.pow(9, 2) * 50); // 4050 XP = level 10
        expect(result.rankName).toBe('Vàng');
        expect(result.rankColor).toContain('yellow');
      });

      it('should assign Kim Cương rank at level 20', () => {
        const result = getRankInfo(Math.pow(19, 2) * 50);
        expect(result.rankName).toBe('Kim Cương');
        expect(result.rankColor).toContain('cyan');
      });

      it('should assign Huyền Thoại rank at level 40', () => {
        const result = getRankInfo(Math.pow(39, 2) * 50);
        expect(result.rankName).toBe('Huyền Thoại');
        expect(result.rankColor).toContain('fuchsia');
      });
    });

    describe('XP requirements for level progression', () => {
      it('should return remaining XP needed to reach next level at level 1', () => {
        const result = getRankInfo(0);
        expect(result.nextLevelXP).toBe(50); // 50 XP to reach level 2
      });

      it('should return remaining XP needed to reach next level at level 2', () => {
        const result = getRankInfo(50);
        expect(result.nextLevelXP).toBe(150); // 150 more XP to reach level 3 (total 200)
      });

      it('should return correct XP thresholds for various levels', () => {
        expect(getRankInfo(0).nextLevelXP).toBe(50); // Level 1: need 50 for level 2
        expect(getRankInfo(25).nextLevelXP).toBe(50); // Mid level 1: need 50 for level 2
        expect(getRankInfo(50).nextLevelXP).toBe(150); // Level 2 start: need 150 for level 3
        expect(getRankInfo(150).nextLevelXP).toBe(50); // Mid level 2: need 50 for level 3
        expect(getRankInfo(200).nextLevelXP).toBe(250); // Level 3 start: need 250 for level 4
        expect(getRankInfo(350).nextLevelXP).toBe(100); // Mid level 3: need 100 for level 4
      });
    });

    describe('CSS class properties', () => {
      it('should return all required CSS class properties', () => {
        const result = getRankInfo(100);
        
        expect(result.rankColor).toBeDefined();
        expect(result.rankBg).toBeDefined();
        expect(result.rankSolid).toBeDefined();
        expect(result.rankBorder).toBeDefined();
        expect(result.icon).toBeDefined();
      });

      it('should have consistent icon names for ranks', () => {
        expect(getRankInfo(10).icon).toBe('Shield'); // Đồng
        expect(getRankInfo(Math.pow(4, 2) * 50).icon).toBe('Award'); // Bạc (level 5+)
        expect(getRankInfo(Math.pow(9, 2) * 50).icon).toBe('Trophy'); // Vàng (level 10+)
        expect(getRankInfo(Math.pow(19, 2) * 50).icon).toBe('Diamond'); // Kim Cương (level 20+)
        expect(getRankInfo(Math.pow(39, 2) * 50).icon).toBe('Crown'); // Huyền Thoại (level 40+)
      });
    });
  });
});
