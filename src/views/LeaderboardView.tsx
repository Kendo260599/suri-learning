import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Diamond, User as UserIcon } from 'lucide-react';
import type { User } from 'firebase/auth';
import { getRankInfo } from '../utils/rankSystem';

export interface LeaderboardEntry {
  uid: string;
  displayName?: string;
  photoURL?: string;
  xp?: number;
}

export interface LeaderboardViewProps {
  leaderboardData: LeaderboardEntry[];
  currentUser: User | null;
}

const RankIcon = ({ icon, className, size }: { icon: string; className?: string; size?: number }) => {
  const iconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
    Crown: require('lucide-react').Crown,
    Swords: require('lucide-react').Swords,
    Star: require('lucide-react').Star,
    Diamond: require('lucide-react').Diamond,
    Medal: require('lucide-react').Medal,
    Trophy: require('lucide-react').Trophy,
    Award: require('lucide-react').Award,
    Shield: require('lucide-react').Shield,
  };
  const IconComponent = iconMap[icon] || iconMap['Shield'];
  return <IconComponent className={className} size={size} />;
};

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ leaderboardData, currentUser }) => {
  return (
    <div className="min-h-screen bg-bg pb-32">
      <div className="sticky top-0 z-50 w-full bg-white border-b border-ink/5 px-6 py-6 flex justify-between items-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-ink font-display tracking-tight uppercase">Leaderboard</h1>
        <div className="w-10 h-10 bg-brand-purple/10 text-brand-purple rounded-xl flex items-center justify-center">
          <Trophy size={24} />
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto p-6 flex flex-col gap-4">
        {leaderboardData.map((entry, index) => {
          const rankInfo = getRankInfo(entry.xp || 0);
          return (
            <motion.div
              key={entry.uid}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border-2 rounded-3xl p-4 flex items-center gap-4 shadow-sm ${
                entry.uid === currentUser?.uid ? 'border-brand-blue bg-brand-blue/5' : 'border-ink/5'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                index === 0 ? 'bg-brand-orange text-white' : 
                index === 1 ? 'bg-slate-300 text-ink' :
                index === 2 ? 'bg-orange-300 text-ink' : 'text-ink-muted'
              }`}>
                {index + 1}
              </div>
              
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md relative">
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
                  {entry.uid === currentUser?.uid && <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/10 px-2 py-0.5 rounded-full">You</span>}
                </h3>
                <div className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${rankInfo.rankColor}`}>
                  <RankIcon icon={rankInfo.icon} size={12} />
                  {rankInfo.rankName} {rankInfo.level}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-brand-blue/10 px-4 py-2 rounded-2xl text-brand-blue">
                <Diamond fill="currentColor" size={16} />
                <span className="font-black">{entry.xp || 0}</span>
              </div>
            </motion.div>
          );
        })}

        {leaderboardData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-ink-muted font-bold">Chưa có dữ liệu xếp hạng.</p>
          </div>
        )}
      </div>
    </div>
  );
};
