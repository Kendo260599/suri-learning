import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useShare, formatShareText } from './useShare';

describe('useShare Hook', () => {
  describe('isSupported', () => {
    it('should return false when navigator.share is not available', () => {
      // Mock navigator without share
      const mockNavigator = { 
        share: undefined,
        clipboard: { writeText: vi.fn() }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      expect(result.current.isSupported).toBe(false);
    });

    it('should return true when navigator.share is available', () => {
      // Mock navigator with share
      const mockNavigator = { 
        share: vi.fn().mockResolvedValue(undefined),
        clipboard: { writeText: vi.fn() }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      expect(result.current.isSupported).toBe(true);
    });
  });

  describe('share function', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should return false when share is not supported', async () => {
      const mockNavigator = { 
        share: undefined,
        clipboard: { writeText: vi.fn() }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      const shareResult = await result.current.share({ title: 'Test', text: 'Test text' });
      expect(shareResult).toBe(false);
    });

    it('should return true when share succeeds', async () => {
      const mockNavigator = { 
        share: vi.fn().mockResolvedValue(undefined),
        clipboard: { writeText: vi.fn() }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      const shareResult = await result.current.share({ title: 'Test', text: 'Test text' });
      expect(shareResult).toBe(true);
    });

    it('should return false when share throws an error', async () => {
      const mockNavigator = { 
        share: vi.fn().mockRejectedValue(new Error('Share failed')),
        clipboard: { writeText: vi.fn() }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      const shareResult = await result.current.share({ title: 'Test', text: 'Test text' });
      expect(shareResult).toBe(false);
    });
  });

  describe('shareText function', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should use navigator.share when supported', async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);
      const mockNavigator = { 
        share: mockShare,
        clipboard: { writeText: vi.fn() }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      const shareResult = await result.current.shareText('Title', 'Text');
      expect(shareResult).toBe(true);
      expect(mockShare).toHaveBeenCalledWith({ title: 'Title', text: 'Text', url: undefined });
    });

    it('should fallback to clipboard when share is not supported', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      const mockNavigator = { 
        share: undefined,
        clipboard: { writeText: mockWriteText }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      const shareResult = await result.current.shareText('Title', 'Text');
      expect(shareResult).toBe(true);
      expect(mockWriteText).toHaveBeenCalled();
    });

    it('should include URL in clipboard fallback when provided', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      const mockNavigator = { 
        share: undefined,
        clipboard: { writeText: mockWriteText }
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      await result.current.shareText('Title', 'Text', 'https://example.com');
      expect(mockWriteText).toHaveBeenCalledWith('https://example.com');
    });

    it('should return false when clipboard is not available', async () => {
      const mockNavigator = { 
        share: undefined,
        clipboard: undefined
      };
      Object.defineProperty(window, 'navigator', {
        value: mockNavigator,
        writable: true,
        configurable: true
      });
      
      const { result } = renderHook(() => useShare());
      const shareResult = await result.current.shareText('Title', 'Text');
      expect(shareResult).toBe(false);
    });
  });
});

describe('formatShareText', () => {
  it('should format share text with XP and rank', () => {
    const result = formatShareText(100, 5, 'Vàng');
    expect(result.title).toBe('Suri Learning - Học IELTS Thông Minh');
    expect(result.text).toContain('100 XP');
    expect(result.text).toContain('5 ngày');
    expect(result.text).toContain('Vàng');
  });

  it('should format share text with different values', () => {
    const result = formatShareText(500, 30, 'Kim Cương');
    expect(result.title).toBe('Suri Learning - Học IELTS Thông Minh');
    expect(result.text).toContain('500 XP');
    expect(result.text).toContain('30 ngày');
    expect(result.text).toContain('Kim Cương');
  });

  it('should include app download link', () => {
    const result = formatShareText(100, 5, 'Vàng');
    expect(result.text).toContain('https://suri-learning.vercel.app');
  });
});
