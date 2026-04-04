import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getProgress } from '../utils/progress';
import { Award, Flame, Star, BookOpen, CheckCircle2, TrendingUp, Calendar, Zap } from 'lucide-react';
import { hsk1Words } from '../data/hsk1';

export default function Profile() {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const totalWords = hsk1Words.length;
  const masteredCount = progress.masteredWords?.length || 0;
  const completedLessonsCount = progress.completedLessons.length;
  const totalLessons = 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-6 pb-20 space-y-8 max-w-4xl mx-auto"
    >
      {/* Profile Header */}
      <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-lg border border-surface-container-highest flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container bg-surface-container-high shadow-xl">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=eef6ee" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-full shadow-lg border-4 border-surface-container-lowest">
            <Award className="w-6 h-6" />
          </div>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-headline font-black text-on-surface mb-2">Học viên HSK</h2>
          <p className="text-on-surface-variant font-medium mb-4">Bắt đầu học từ: {progress.lastActive || 'Hôm nay'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl border border-surface-container-high">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-bold text-on-surface">{progress.streak} ngày liên tiếp</span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-2xl border border-surface-container-high">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-on-surface">{progress.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<BookOpen className="text-blue-500" />} 
          label="Bài học hoàn thành" 
          value={`${completedLessonsCount} / ${totalLessons}`}
          progress={(completedLessonsCount / totalLessons) * 100}
          color="bg-blue-500"
        />
        <StatCard 
          icon={<CheckCircle2 className="text-green-500" />} 
          label="Từ vựng đã thuộc" 
          value={`${masteredCount} / ${totalWords}`}
          progress={(masteredCount / totalWords) * 100}
          color="bg-green-500"
        />
        <StatCard 
          icon={<TrendingUp className="text-purple-500" />} 
          label="Cấp độ hiện tại" 
          value={`Cấp ${Math.floor(progress.xp / 1000) + 1}`}
          progress={(progress.xp % 1000) / 10}
          color="bg-purple-500"
        />
      </div>

      {/* Achievements Section */}
      <section>
        <h3 className="text-xl font-headline font-extrabold text-on-surface mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Thành tựu
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AchievementBadge 
            unlocked={progress.streak >= 1} 
            icon={<Flame />} 
            label="Người mới" 
            desc="Chuỗi 1 ngày" 
          />
          <AchievementBadge 
            unlocked={progress.streak >= 7} 
            icon={<Calendar />} 
            label="Chăm chỉ" 
            desc="Chuỗi 7 ngày" 
          />
          <AchievementBadge 
            unlocked={masteredCount >= 50} 
            icon={<Zap />} 
            label="Thông thái" 
            desc="Thuộc 50 từ" 
          />
          <AchievementBadge 
            unlocked={completedLessonsCount >= 5} 
            icon={<Star />} 
            label="Kiên trì" 
            desc="Xong 5 bài" 
          />
        </div>
      </section>
    </motion.div>
  );
}

function StatCard({ icon, label, value, progress, color }: { icon: React.ReactNode, label: string, value: string, progress: number, color: string }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container-highest shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-surface-container-low rounded-xl">
          {icon}
        </div>
        <span className="font-bold text-on-surface-variant text-sm">{label}</span>
      </div>
      <div className="text-2xl font-headline font-black text-on-surface mb-4">{value}</div>
      <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function AchievementBadge({ unlocked, icon, label, desc }: { unlocked: boolean, icon: React.ReactNode, label: string, desc: string }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${
      unlocked ? 'bg-surface-container-lowest border-primary/20 shadow-md' : 'bg-surface-container-low border-transparent opacity-40 grayscale'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        unlocked ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
      }`}>
        {icon}
      </div>
      <span className="font-bold text-sm text-on-surface text-center mb-1">{label}</span>
      <span className="text-[10px] text-on-surface-variant text-center font-medium">{desc}</span>
    </div>
  );
}
