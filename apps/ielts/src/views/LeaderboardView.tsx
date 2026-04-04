import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  Diamond,
  User as UserIcon,
  Crown,
  Swords,
  Star,
  Medal,
  Award,
  Shield,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { getRankInfo } from '../utils/rankSystem';

export interface LeaderboardEntry {
  uid: string;
  displayName?: string;
  photoURL?: string;
  xp?: number;
  /** XP theo tuần (khi chưa có, client fallback về xp) */
  xpWeek?: number;
  /** XP theo tháng */
  xpMonth?: number;
}

export interface LeaderboardViewProps {
  leaderboardData: LeaderboardEntry[];
  currentUser: User | null;
}

const RankIcon = ({ icon, className, size }: { icon: string; className?: string; size?: number }) => {
  const iconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
    Crown,
    Swords,
    Star,
    Diamond,
    Medal,
    Trophy,
    Award,
    Shield,
  };
  const IconComponent = iconMap[icon] || Trophy;
  return <IconComponent className={className} size={size} />;
};

function xpForFilter(entry: LeaderboardEntry, filter: 'week' | 'month' | 'all'): number {
  if (filter === 'week') return entry.xpWeek ?? entry.xp ?? 0;
  if (filter === 'month') return entry.xpMonth ?? entry.xp ?? 0;
  return entry.xp ?? 0;
}

type PodiumSlot = {
  entry: LeaderboardEntry;
  rankNum: 1 | 2 | 3;
  height: string;
  bg: string;
};

/** Bục: với 1–2 người vẫn map đúng hạng (tránh top3[1] undefined → màn hình trắng). */
function buildPodiumSlots(top3: LeaderboardEntry[]): PodiumSlot[] {
  if (top3.length === 0) return [];
  const second = { rankNum: 2 as const, height: 'h-24', bg: 'bg-gradient-to-b from-slate-300 to-slate-400' };
  const first = { rankNum: 1 as const, height: 'h-32', bg: 'bg-gradient-to-b from-amber-400 to-amber-500' };
  const third = { rankNum: 3 as const, height: 'h-20', bg: 'bg-gradient-to-b from-orange-300 to-orange-400' };
  if (top3.length === 1) {
    return [{ entry: top3[0], ...first }];
  }
  if (top3.length === 2) {
    return [
      { entry: top3[1], ...second },
      { entry: top3[0], ...first },
    ];
  }
  return [
    { entry: top3[1], ...second },
    { entry: top3[0], ...first },
    { entry: top3[2], ...third },
  ];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboardData, currentUser }) => {
  const [filter, setFilter] = useState<'week' | 'month' | 'all'>('all');

  const sortedData = useMemo(() => {
    return [...leaderboardData].sort(
      (a, b) => xpForFilter(b, filter) - xpForFilter(a, filter),
    );
  }, [leaderboardData, filter]);

  const top3 = sortedData.slice(0, 3);
  const rest = sortedData.slice(3);
  const podiumSlots = buildPodiumSlots(top3);

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-line px-6 py-5 flex justify-between items-center max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-black text-ink font-display tracking-tight uppercase">Xếp hạng</h1>
          <p className="text-xs text-ink-muted font-medium mt-0.5">Cập nhật hàng tuần</p>
        </div>
        <div className="w-10 h-10 bg-brand-purple/10 text-brand-purple rounded-xl flex items-center justify-center">
          <Trophy size={22} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-3">
        <div className="bg-white border-2 border-ink/5 rounded-2xl p-1 flex">
          {([
            { key: 'week', label: 'Tuần' },
            { key: 'month', label: 'Tháng' },
            { key: 'all', label: 'Mọi lúc' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                filter === tab.key
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-muted font-medium px-1 mt-2 text-center max-w-2xl mx-auto">
          {filter === 'all'
            ? 'Xếp theo XP tích lũy.'
            : `XP đã đạt được trong ${filter === 'week' ? 'tuần này' : 'tháng này'}. Được reset vào đầu kỳ mới.`}
        </p>
      </div>

      <div className="w-full max-w-2xl mx-auto px-6 flex flex-col gap-4">

        {/* Podium Top 3 */}
        {podiumSlots.length >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end justify-center gap-2 mb-2 ${podiumSlots.length === 1 ? 'max-w-[200px] mx-auto' : ''}`}
          >
            {podiumSlots.map((slot, ci) => {
              const entry = slot.entry;
              const displayXp = xpForFilter(entry, filter);
              const isCurrentUser = entry.uid === currentUser?.uid;
              return (
                <motion.div
                  key={`${entry.uid}-${slot.rankNum}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: ci * 0.1, type: 'spring', damping: 12 }}
                  className="flex flex-col items-center flex-1 min-w-0"
                >
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full overflow-hidden border-4 ${isCurrentUser ? 'border-brand-purple' : 'border-white'} shadow-lg mb-2 relative`}>
                    {entry.photoURL ? (
                      <img src={entry.photoURL} alt={entry.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <UserIcon size={28} />
                      </div>
                    )}
                    {slot.rankNum === 1 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-xs font-black text-ink mb-0.5 truncate max-w-full px-1">
                    {isCurrentUser ? 'Bạn' : (entry.displayName || 'User').split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-ink-muted font-bold mb-2">{displayXp} XP</p>

                  {/* Podium Block */}
                  <div className={`w-full ${slot.height} ${slot.bg} rounded-t-2xl flex flex-col items-center justify-center shadow-md border-t-2 border-white/20`}>
                    <span className="font-black text-white text-lg">{slot.rankNum}</span>
                    <Trophy size={14} className="text-white/70" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Ranked List */}
        {rest.map((entry, index) => {
          const displayXp = xpForFilter(entry, filter);
          const rankInfo = getRankInfo(displayXp);
          const isCurrentUser = entry.uid === currentUser?.uid;
          return (
            <motion.div
              key={entry.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 3) * 0.05 }}
              className={`bg-white border-2 rounded-3xl p-4 flex items-center gap-4 shadow-sm ${
                isCurrentUser ? 'border-brand-purple bg-brand-purple/5' : 'border-ink/5'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-ink-muted">
                {index + 4}
              </div>

              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                {entry.photoURL ? (
                  <img src={entry.photoURL} alt={entry.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <UserIcon size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-black text-ink leading-none mb-1 flex items-center gap-2">
                  {entry.displayName}
                  {isCurrentUser && (
                    <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest bg-brand-purple/10 px-2 py-0.5 rounded-full">
                      Bạn
                    </span>
                  )}
                </h3>
                <div className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${rankInfo.rankColor}`}>
                  <RankIcon icon={rankInfo.icon} size={12} />
                  {rankInfo.rankName} {rankInfo.level}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-brand-blue/10 px-4 py-2 rounded-2xl text-brand-blue">
                <Diamond fill="currentColor" size={16} />
                <span className="font-black">{displayXp}</span>
              </div>
            </motion.div>
          );
        })}

        {sortedData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-ink-muted font-bold">Chưa có dữ liệu xếp hạng.</p>
          </div>
        )}
      </div>
    </div>
  );
};
