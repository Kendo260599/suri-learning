import React from 'react';
import { motion } from 'motion/react';
import {
  User as UserIcon,
  Calendar,
  Settings,
  LogOut,
  CheckCircle2,
  Flame,
  Diamond,
  Trophy,
  BookOpen,
  Crown,
  Swords,
  Star,
  Medal,
  Award,
  Shield,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { UserStats } from '../types';
import { getRankInfo } from '../utils/rankSystem';
import { useShare, formatShareText } from '../hooks/useShare';

export interface ProfileViewProps {
  user: User | null;
  stats: UserStats;
  onLogout: () => void;
  onOpenSettings?: () => void;
}

const iconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
  Crown, Swords, Star, Diamond, Medal, Trophy, Award, Shield,
};

const RankIcon = ({ icon, className, size }: { icon: string; className?: string; size?: number }) => {
  const IconComponent = iconMap[icon] || Shield;
  return <IconComponent className={className} size={size} />;
};

export const ProfileView: React.FC<ProfileViewProps> = ({ user, stats, onLogout, onOpenSettings }) => {
  const rankInfo = getRankInfo(stats.xp);
  const { shareText, isSupported } = useShare();

  const handleInvite = async () => {
    const { title, text } = formatShareText(0, stats.streak, rankInfo.rankName);
    const success = await shareText(title, text);
    if (!success && !isSupported && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${title}\n\n${text}`);
      } catch { /* ignore */ }
    }
  };

  const handleTwitterInvite = () => {
    const text = `📚 Tôi đang học IELTS với Suri Learning! 🔥 Streak: ${stats.streak} ngày | Rank: ${rankInfo.rankName}\n\nHọc IELTS thông minh với AI, gamification và SRS.\nhttps://suri-learning.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const joinedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
    : 'Tháng này';

  return (
    <div className="min-h-screen bg-surface pb-32 flex flex-col items-center">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-ink/5 px-6 py-6 flex justify-between items-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-ink font-display tracking-tight uppercase">Profile</h1>
        <button onClick={onOpenSettings} className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-ink/5 transition-colors">
          <Settings size={24} />
        </button>
      </div>
      
      <div className="w-full max-w-2xl mx-auto p-6 flex flex-col gap-8 mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-ink/5 rounded-[2.5rem] p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left"
        >
          <div className="relative">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-28 h-28 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue border-4 border-white shadow-xl">
                <UserIcon size={56} />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-brand-green rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-ink font-display leading-none mb-2">{user?.displayName || 'IELTS Learner'}</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-ink-muted font-bold text-sm uppercase tracking-widest mb-4">
              <Calendar size={14} />
              Tham gia {joinedDate}
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${rankInfo.rankBg} ${rankInfo.rankBorder} ${rankInfo.rankColor}`}>
              <RankIcon icon={rankInfo.icon} size={20} />
              <span className="font-black text-sm uppercase tracking-wider">{rankInfo.rankName} {rankInfo.level}</span>
            </div>
          </div>
        </motion.div>

        <div>
          <h3 className="text-xl font-black text-ink font-display uppercase tracking-tight mb-6 flex items-center gap-3">
            <div className={`w-2 h-6 ${rankInfo.rankSolid} rounded-full`} />
            Rank Progress
          </h3>
          <div className="bg-white border-2 border-ink/5 rounded-[2rem] p-6 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${rankInfo.rankBg} ${rankInfo.rankColor}`}>
                  <RankIcon icon={rankInfo.icon} size={28} />
                </div>
                <div className="text-left">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${rankInfo.rankColor}`}>{rankInfo.rankName}</p>
                  <p className="text-xl font-black text-ink font-display">Level {rankInfo.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-brand-blue font-black text-xl font-display">{stats.xp} XP</p>
              </div>
            </div>
            <div className="h-4 bg-surface rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rankInfo.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${rankInfo.rankSolid}`}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-bold text-ink-muted">{rankInfo.currentXP} / {rankInfo.nextLevelXP} XP to next level</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black text-ink font-display uppercase tracking-tight mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-brand-orange rounded-full" />
            Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -4 }} className="bg-white border-2 border-ink/5 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
                <Flame fill="currentColor" size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-ink font-display leading-none mb-1">{stats.streak}</div>
                <div className="text-xs font-black text-ink-muted uppercase tracking-widest">Day Streak</div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border-2 border-ink/5 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                <Diamond fill="currentColor" size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-ink font-display leading-none mb-1">{stats.xp}</div>
                <div className="text-xs font-black text-ink-muted uppercase tracking-widest">Total XP</div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border-2 border-ink/5 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple">
                <Trophy fill="currentColor" size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-ink font-display leading-none mb-1">{stats.completedTopics?.length || 0}</div>
                <div className="text-xs font-black text-ink-muted uppercase tracking-widest">Topics</div>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-white border-2 border-ink/5 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm">
              <div className="w-12 h-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                <BookOpen fill="currentColor" size={28} />
              </div>
              <div>
                <div className="text-3xl font-black text-ink font-display leading-none mb-1">{stats.completedWords.length}</div>
                <div className="text-xs font-black text-ink-muted uppercase tracking-widest">Words</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Achievements - Horizontal Scroll */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-ink font-display uppercase tracking-tight flex items-center gap-3">
              <div className="w-2 h-6 bg-brand-purple rounded-full" />
              Thành tựu
            </h3>
            <button className="text-brand-blue text-xs font-bold uppercase tracking-widest">
              Xem tất cả →
            </button>
          </div>

          {/* Unlocked achievements */}
          <div className="flex gap-3 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
            {[
              { emoji: '🔥', label: '7-Day Streak', sub: '1 tuần liên tiếp', bg: 'from-orange-400 to-orange-500', unlocked: stats.streak >= 7 },
              { emoji: '📚', label: '100 Words', sub: 'Học 100 từ mới', bg: 'from-brand-green to-green-400', unlocked: stats.completedWords.length >= 100 },
              { emoji: '🏆', label: 'Quiz Master', sub: '100% trong quiz', bg: 'from-brand-purple to-purple-400', unlocked: false },
              { emoji: '🌟', label: 'First Word', sub: 'Học từ đầu tiên', bg: 'from-brand-blue to-blue-400', unlocked: stats.completedWords.length >= 1 },
            ].map((badge, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-28 text-center ${!badge.unlocked ? 'opacity-40 grayscale' : ''}`}
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${badge.bg} flex items-center justify-center text-2xl shadow-md mb-2 ${badge.unlocked ? 'shadow-brand-orange/20' : ''}`}>
                  {badge.emoji}
                </div>
                <p className="text-xs font-black text-ink leading-tight">{badge.label}</p>
                <p className="text-[10px] text-ink-muted leading-tight">{badge.sub}</p>
              </div>
            ))}

            {/* Locked badges */}
            {[
              { emoji: '🔒', label: '30-Day Streak', sub: 'Cần 16 ngày nữa', bg: 'bg-gray-200' },
              { emoji: '🔒', label: 'IELTS 7.0', sub: 'Hoàn thành mock test', bg: 'bg-gray-200' },
            ].map((badge, i) => (
              <div key={`locked-${i}`} className="flex-shrink-0 w-28 text-center opacity-40 grayscale">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${badge.bg} flex items-center justify-center text-2xl mb-2`}>
                  {badge.emoji}
                </div>
                <p className="text-xs font-medium text-ink leading-tight">{badge.label}</p>
                <p className="text-[10px] text-ink-muted leading-tight">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Invite Friends */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-r from-brand-orange/10 to-brand-orange/5 border-2 border-brand-orange/20 rounded-[2rem] p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👥</span>
            </div>
            <div className="flex-1">
              <h4 className="font-black text-ink text-sm">Mời bạn bè</h4>
              <p className="text-xs text-ink-muted mt-0.5">Nhận 50 kim cương cho mỗi người</p>
            </div>
            <button
              onClick={handleInvite}
              className="bg-brand-orange text-white font-black text-xs px-4 py-2 rounded-xl active:translate-y-0.5 transition-transform shadow-sm"
            >
              Mời
            </button>
          </div>
        </motion.div>

        <button
          onClick={onLogout}
          className="w-full py-4 bg-white border-2 border-brand-red/20 text-brand-red rounded-2xl font-black uppercase tracking-widest shadow-sm active:translate-y-1 transition-all flex items-center justify-center gap-3 mt-4"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};
