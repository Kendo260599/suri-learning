import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Flame, Diamond, BookOpen, ChevronRight, Share2, Star, ArrowRight } from 'lucide-react';
import type { UserStats } from '../types';
import { getRankInfo } from '../utils/rankSystem';
import { useShare, formatShareText } from '../hooks/useShare';

export interface LessonCompleteViewProps {
  stats: UserStats;
  xpGained: number;
  wordsLearned: number;
  accuracy: number;
  onContinue: () => void;
  onGoHome: () => void;
}

interface Achievement {
  emoji: string;
  title: string;
  sub: string;
  unlocked: boolean;
}

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { emoji: '🔥', title: '7-Day Streak', sub: '1 tuần liên tiếp', unlocked: true },
  { emoji: '📚', title: '100 Words', sub: 'Học 100 từ mới', unlocked: true },
  { emoji: '🏆', title: 'Quiz Master', sub: '100% trong quiz', unlocked: true },
  { emoji: '🔥', title: '30-Day Streak', sub: 'Cần 16 ngày nữa', unlocked: false },
  { emoji: '🎯', title: 'IELTS 7.0', sub: 'Hoàn thành mock test', unlocked: false },
];

export const LessonCompleteView: React.FC<LessonCompleteViewProps> = ({
  stats,
  xpGained,
  wordsLearned,
  accuracy,
  onContinue,
  onGoHome,
}) => {
  const confettiRef = useRef<HTMLDivElement>(null);
  const rankInfo = getRankInfo(stats.xp);
  const { shareText, isSupported } = useShare();

  const handleShare = async () => {
    const { title, text } = formatShareText(xpGained, stats.streak, rankInfo.rankName);
    const success = await shareText(title, text);
    if (!success && isSupported) {
      // Clipboard fallback handled in hook
    }
  };

  const handleTwitterShare = () => {
    const { title, text } = formatShareText(xpGained, stats.streak, rankInfo.rankName);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Confetti effect
  useEffect(() => {
    const container = confettiRef.current;
    if (!container) return;
    const colors = ['#ff9600', '#58cc02', '#ffc800', '#a560f2', '#ff4b4b', '#1cb0f6'];
    for (let i = 0; i < 60; i++) {
      const conf = document.createElement('div');
      const size = Math.random() * 8 + 4;
      conf.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${Math.random() * 100}%;
        top: -20px;
        opacity: ${Math.random() * 0.7 + 0.3};
        animation: confettiFall ${2 + Math.random() * 2}s ease-in ${Math.random() * 2}s forwards;
        pointer-events: none;
      `;
      container.appendChild(conf);
    }
    return () => { container.innerHTML = ''; };
  }, []);

  return (
    <div className="min-h-screen bg-surface overflow-hidden relative">
      {/* Confetti container */}
      <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* Confetti keyframes injected via style tag */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 px-4 pt-6 pb-8 flex flex-col items-center">

        {/* Checkmark Hero */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.1 }}
          className="mb-6"
        >
          <div className="w-32 h-32 bg-brand-green rounded-[3rem] flex items-center justify-center shadow-[0_8px_0_0_#46a302]">
            <CheckCircle2 size={72} className="text-white" fill="white" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black text-ink font-display tracking-tight mb-1">
            Xuất sắc!
          </h1>
          <p className="text-ink-muted font-medium">
            Bạn đã hoàn thành bài học hôm nay
          </p>
        </motion.div>

        {/* XP Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-brand-green/10 border-2 border-brand-green text-brand-green font-black text-3xl px-8 py-3 rounded-[2rem] shadow-sm">
            +{xpGained} XP ✨
          </div>
        </motion.div>

        {/* Stats Bento */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-sm mb-6"
        >
          <div className="bg-white border-2 border-ink/5 rounded-[2.5rem] p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-2xl">
                  📚
                </div>
                <div className="text-2xl font-black text-ink font-display">{wordsLearned}</div>
                <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Từ mới</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center text-2xl"
                >
                  🔥
                </motion.div>
                <div className="text-2xl font-black text-ink font-display">+1</div>
                <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Streak</div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="text-2xl font-black text-ink font-display">{accuracy}%</div>
                <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Chính xác</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm mb-6"
        >
          <div className="bg-white border-2 border-ink/5 rounded-[2rem] p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-black text-ink">Tiến độ lên Level {rankInfo.level + 1}</p>
                <p className="text-xs text-ink-muted">{stats.xp - xpGained} → {stats.xp} XP</p>
              </div>
              <div className="flex items-center gap-1">
                <Diamond size={14} className="text-brand-blue" fill="currentColor" />
                <span className="text-xs font-black text-brand-blue">{rankInfo.progress}%</span>
              </div>
            </div>
            <div className="h-3 bg-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rankInfo.progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                className="h-full bg-brand-green rounded-full"
              />
            </div>
            <p className="text-xs text-ink-muted mt-1.5">
              Còn {rankInfo.nextLevelXP - rankInfo.currentXP} XP để lên Level {rankInfo.level + 1}
            </p>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm mb-8"
        >
          <h3 className="text-lg font-black text-ink font-display uppercase tracking-tight mb-4 flex items-center gap-2">
            Bài tiếp theo
          </h3>
          <div className="flex flex-col gap-3">

            {/* Recommended Quiz */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinue}
              className="bg-white border-2 border-brand-orange rounded-[2rem] p-4 flex items-center gap-3 shadow-sm text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0 relative">
                <span className="text-2xl">📝</span>
                <div className="absolute -top-1.5 -right-1.5 bg-brand-orange text-white text-[9px] font-black px-2 py-0.5 rounded-full whitespace-nowrap">
                  Đề xuất
                </div>
              </div>
              <div className="flex-1">
                <p className="font-black text-ink text-sm">Vocabulary Quiz</p>
                <p className="text-xs text-ink-muted mt-0.5">5 câu hỏi · 3 từ để ôn tập</p>
              </div>
              <div className="flex items-center gap-1 bg-brand-green/10 px-2.5 py-1 rounded-xl">
                <Diamond size={12} className="text-brand-green" fill="currentColor" />
                <span className="text-xs font-black text-brand-green">+15</span>
              </div>
            </motion.button>

            {/* Review Words */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoHome}
              className="bg-white border-2 border-ink/5 rounded-[2rem] p-4 flex items-center gap-3 shadow-sm text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-ink text-sm">Ôn tập từ đã học</p>
                <p className="text-xs text-ink-muted mt-0.5">12 từ chờ ôn tập</p>
              </div>
              <ChevronRight size={18} className="text-ink-muted" />
            </motion.button>

            {/* AI Conversation */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGoHome}
              className="bg-white border-2 border-ink/5 rounded-[2rem] p-4 flex items-center gap-3 shadow-sm text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="flex-1">
                <p className="font-black text-ink text-sm">AI Speaking Practice</p>
                <p className="text-xs text-ink-muted mt-0.5">Luyện nói với AI về chủ đề học</p>
              </div>
              <ChevronRight size={18} className="text-ink-muted" />
            </motion.button>

          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-sm space-y-3"
        >
          <button
            onClick={onContinue}
            className="w-full btn-3d btn-3d-green py-4 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-center gap-2"
          >
            <BookOpen size={22} />
            Tiếp tục Quiz
            <ArrowRight size={20} />
          </button>

          <button
            onClick={onGoHome}
            className="w-full py-4 bg-white border-2 border-ink/5 text-ink rounded-2xl font-black uppercase tracking-widest shadow-sm active:translate-y-1 transition-all"
          >
            Về trang chủ
          </button>

          {/* Share buttons */}
          <div className="flex justify-center gap-3 pt-1">
            <button
              onClick={handleTwitterShare}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-500 text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
            >
              <Share2 size={14} />
              Tweet
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
            >
              <Share2 size={14} />
              Chia sẻ
            </button>
            <button className="flex items-center gap-1.5 bg-red-50 text-red-500 text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform">
              <Share2 size={14} />
              Google+
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
