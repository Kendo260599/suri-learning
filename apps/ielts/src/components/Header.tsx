import React from 'react';
import {
  Flame,
  Diamond,
  Crown,
  Swords,
  Star,
  Medal,
  Trophy,
  Award,
  Shield,
} from 'lucide-react';

export interface HeaderStats {
  xp: number;
  streak: number;
}

export interface HeaderRankInfo {
  rankName: string;
  level: number;
  icon: string;
  rankBg: string;
  rankBorder: string;
  rankColor: string;
}

export interface HeaderProps {
  stats: HeaderStats;
  rankInfo: HeaderRankInfo;
}

export const Header: React.FC<HeaderProps> = ({ stats, rankInfo }) => {
  const iconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
    Crown, Swords, Star, Diamond, Medal, Trophy, Award, Shield,
  };
  const RankIcon = ({ icon, className, size }: { icon: string; className?: string; size?: number }) => {
    const IconComponent = iconMap[icon] || Shield;
    return <IconComponent className={className} size={size} />;
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b-2 border-line px-6 py-4 flex justify-between items-center max-w-2xl mx-auto shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-brand-orange font-black text-lg">
          <Flame fill="currentColor" size={22} className="drop-shadow-sm" /> 
          <span className="font-display tracking-tight">{stats.streak}</span>
        </div>
        <div className="flex items-center gap-2 text-brand-blue font-black text-lg">
          <Diamond fill="currentColor" size={22} className="drop-shadow-sm" /> 
          <span className="font-display tracking-tight">{stats.xp}</span>
        </div>
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${rankInfo.rankBg} ${rankInfo.rankBorder} ${rankInfo.rankColor}`}>
          <RankIcon icon={rankInfo.icon} size={18} />
          <span className="font-black text-sm uppercase tracking-wider">{rankInfo.rankName} {rankInfo.level}</span>
        </div>
      </div>
    </div>
  );
};
