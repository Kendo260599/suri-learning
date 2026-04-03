import { useCallback, useState } from 'react';

interface UseShareReturn {
  share: (data: ShareData) => Promise<boolean>;
  shareText: (title: string, text: string, url?: string) => Promise<boolean>;
  isSupported: boolean;
}

export const useShare = (): UseShareReturn => {
  const [isSupported] = useState(() =>
    typeof navigator !== 'undefined' && !!navigator.share
  );

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (!isSupported) return false;
    try {
      await navigator.share(data);
      return true;
    } catch {
      return false;
    }
  }, [isSupported]);

  const shareText = useCallback(async (
    title: string,
    text: string,
    url?: string
  ): Promise<boolean> => {
    if (isSupported) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch {
        // fallback to clipboard
      }
    }
    // Fallback: copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url ?? `${title}\n\n${text}`);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, [isSupported]);

  return { share, shareText, isSupported };
};

export const formatShareText = (
  xpGained: number,
  streak: number,
  rankName: string
): { title: string; text: string } => {
  return {
    title: 'Suri Learning - Học IELTS Thông Minh',
    text: `🔥 Tôi vừa học xong bài học IELTS và đạt được ${xpGained} XP!\n\n⭐ Streak: ${streak} ngày | Rank: ${rankName}\n\n📚 Học IELTS thông minh với AI, gamification và SRS.\nTải app: https://suri-learning.vercel.app`,
  };
};
