import React from 'react';
import { Home, Calendar, Trophy, Sparkles, Shield, Book, User as UserIcon } from 'lucide-react';

export interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  reviewCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  reviewCount,
}) => {
  const navItems = [
    { view: 'roadmap', icon: Home, label: 'Home' },
    { view: 'daily_plan', icon: Calendar, label: 'Plan' },
    { view: 'leaderboard', icon: Trophy, label: 'Rank' },
    { view: 'ai_lab', icon: Sparkles, label: 'AI Lab' },
    { view: 'review', icon: Shield, label: 'Review' },
    { view: 'notebook', icon: Book, label: 'Book' },
    { view: 'profile', icon: UserIcon, label: 'Profile' },
  ];

  const aiViews = ['ai_lab', 'ai_writing', 'ai_chat'];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2rem] p-2 flex justify-around items-center z-50 shadow-2xl shadow-black/5">
      {navItems.map(({ view, icon: Icon }) => {
        const isActive = view === currentView || 
          (aiViews.includes(view) && aiViews.includes(currentView));
        
        return (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={`relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 -translate-y-1' 
                : 'text-ink-muted hover:bg-ink/5'
            }`}
          >
            <Icon fill={isActive ? "white" : "none"} size={24} />
            {view === 'review' && reviewCount > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-brand-red rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-black px-1 leading-none">
                {reviewCount > 99 ? '99+' : reviewCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
