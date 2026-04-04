"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, BookOpen, PenTool, Award, Gamepad2, CheckCircle2, Lock, Star, ArrowRight, Layers, Puzzle, MessageSquare, Edit3 } from 'lucide-react';
import { hsk1Words } from '../data/hsk1';
import { getProgress, getDueWordsCount } from '../utils/progress';

export default function Home({ setActiveTab, setSelectedLesson }: { setActiveTab: (tab: string) => void, setSelectedLesson: (lesson: number | null) => void }) {
  const [progress, setProgress] = useState(getProgress());
  const [dueCount, setDueCount] = useState(getDueWordsCount());

  useEffect(() => {
    // Refresh progress when home is shown
    setProgress(getProgress());
    setDueCount(getDueWordsCount());
  }, []);

  // Group words by lesson
  const lessons = Array.from(new Set(hsk1Words.map(w => w.lesson))).sort((a, b) => a - b);

  const lessonTitles: Record<number, string> = {
    1: "Số đếm cơ bản",
    2: "Chào hỏi & Quốc gia",
    3: "Gia đình & Đại từ",
    4: "Thời gian & Lịch",
    5: "Đồ ăn & Thức uống",
    6: "Địa điểm & Trường học",
    7: "Mua sắm & Giá cả",
    8: "Sở thích & Giải trí",
    9: "Giao thông & Thành phố",
    10: "Mô tả & Tính cách"
  };

  const handleAction = (lessonId: number, tab: string) => {
    setSelectedLesson(lessonId);
    setActiveTab(tab);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-6 md:pt-0 space-y-10 pb-20"
    >
      {/* HSK Level Selector */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-extrabold text-2xl text-on-surface">Lộ trình của bạn</h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
               <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
               {progress.masteredWords?.length || 0} Từ thuộc
             </div>
             <div className="flex items-center gap-1.5 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
               <Star className="w-3.5 h-3.5 fill-yellow-500" />
               {progress.xp} XP
             </div>
             <button className="text-primary font-bold text-sm hover:underline">Đổi cấp độ</button>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex-none bg-surface-container-lowest border-2 border-primary-container px-6 py-4 rounded-2xl flex flex-col items-center min-w-[110px] shadow-sm">
            <span className="text-[10px] uppercase tracking-widest font-black text-primary-container mb-1">Hiện tại</span>
            <span className="font-headline font-black text-2xl text-primary">HSK 1</span>
            <span className="text-xs font-medium text-on-surface-variant mt-1">Msutong</span>
          </div>
          
          <div className="flex-none bg-surface-container-highest px-6 py-4 rounded-2xl flex flex-col items-center min-w-[110px] opacity-60">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Khóa</span>
            <span className="font-headline font-black text-2xl text-on-surface-variant">HSK 2</span>
          </div>
          
          <div className="flex-none bg-surface-container-highest px-6 py-4 rounded-2xl flex flex-col items-center min-w-[110px] opacity-40">
            <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Khóa</span>
            <span className="font-headline font-black text-2xl text-on-surface-variant">HSK 3</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Progress Ring */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0px_20px_40px_rgba(0,108,74,0.04)] flex flex-col items-center justify-center relative overflow-hidden border border-surface-container-high">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-container"></div>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                className="text-surface-container-highest" 
                strokeWidth="10" 
                stroke="currentColor" 
                fill="transparent" 
                r="70" 
                cx="80" 
                cy="80" 
              />
              <circle 
                className="text-primary rounded-full transition-all duration-1000 ease-out" 
                strokeWidth="10" 
                strokeDasharray="439.8" 
                strokeDashoffset={439.8 - (439.8 * Math.min(progress.xp / 1000, 1))}
                strokeLinecap="round"
                stroke="currentColor" 
                fill="transparent" 
                r="70" 
                cx="80" 
                cy="80" 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-headline font-black text-3xl text-on-surface">{Math.round((progress.xp / 1000) * 100)}%</span>
              <span className="font-label text-[10px] uppercase tracking-tighter text-on-surface-variant font-bold mt-1">Cấp độ 1</span>
            </div>
          </div>
          <p className="mt-4 font-label text-sm text-center text-on-surface-variant font-medium">
            {progress.xp < 1000 ? `Còn ${1000 - progress.xp} XP nữa để lên cấp!` : 'Bạn đã đạt cấp độ tối đa!'}
          </p>
        </div>

        {/* Quick Action Card */}
        <div className="lg:col-span-7 bg-primary rounded-[2rem] p-8 md:p-10 flex flex-col justify-between text-on-primary relative overflow-hidden group shadow-lg shadow-primary/20">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-on-primary/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Học nhanh</span>
            </div>
            <h3 className="font-headline font-black text-3xl md:text-4xl mb-4 leading-tight">
              {dueCount > 0 ? `Bạn có ${dueCount} từ cần ôn tập!` : 'Luyện tập tổng hợp'}
            </h3>
            <p className="text-on-primary/90 max-w-md font-medium mb-8 text-sm md:text-base">
              {dueCount > 0 
                ? 'Hệ thống SRS đã chọn ra những từ bạn sắp quên. Hãy ôn tập ngay để ghi nhớ lâu hơn!'
                : 'Ôn tập ngẫu nhiên các từ vựng đã học để củng cố trí nhớ dài hạn.'}
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap items-center gap-4">
            <button 
              onClick={() => {
                setSelectedLesson(null);
                setActiveTab('practice');
              }}
              className="bg-surface-container-lowest text-primary px-8 py-4 rounded-full font-headline font-extrabold flex items-center gap-2 hover:shadow-xl transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-primary" />
              {dueCount > 0 ? 'Ôn tập ngay' : 'Luyện tập'}
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-headline font-extrabold flex items-center gap-2 hover:shadow-xl transition-all active:scale-95"
            >
              <Gamepad2 className="w-5 h-5" />
              Trắc nghiệm
            </button>
          </div>
        </div>
      </div>

      {/* Learning Path - Lesson List */}
      <section>
        <h2 className="font-headline font-extrabold text-2xl text-on-surface mb-8">Lộ trình bài học</h2>
        <div className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-8 bottom-8 w-1 bg-surface-container-highest rounded-full"></div>
          
          {lessons.map((lessonId, index) => {
            const isCompleted = progress.completedLessons.includes(lessonId);
            const isLocked = index > 0 && !progress.completedLessons.includes(lessons[index - 1]);
            const wordsCount = hsk1Words.filter(w => w.lesson === lessonId).length;

            return (
              <motion.div 
                key={lessonId}
                className={`relative flex items-start gap-8 ${isLocked ? 'opacity-50' : ''}`}
              >
                {/* Lesson Node */}
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-all ${
                  isCompleted ? 'bg-green-500 text-white' : 
                  isLocked ? 'bg-surface-container-highest text-on-surface-variant' : 
                  'bg-primary text-on-primary'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : 
                   isLocked ? <Lock className="w-6 h-6" /> : 
                   <span className="font-headline font-black text-2xl">{lessonId}</span>}
                </div>

                {/* Lesson Card */}
                <div 
                  className={`flex-1 bg-surface-container-lowest p-6 rounded-3xl border-2 transition-all ${
                    isLocked ? 'border-transparent' : 
                    isCompleted ? 'border-green-100 hover:border-green-300' : 
                    'border-primary-container/20 hover:border-primary shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline font-extrabold text-xl text-on-surface">
                      Bài {lessonId}: {lessonTitles[lessonId] || 'Chủ đề mới'}
                    </h4>
                    <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-lg">
                      {wordsCount} từ
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium mb-6">
                    {isCompleted ? 'Bạn đã hoàn thành bài học này!' : 
                     isLocked ? 'Hoàn thành bài trước để mở khóa.' : 
                     'Học từ vựng và luyện tập các bài tập bên dưới.'}
                  </p>
                  
                  {!isLocked && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <ActionButton 
                        icon={<BookOpen className="w-4 h-4" />} 
                        label="Học từ" 
                        onClick={() => handleAction(lessonId, 'learn')} 
                        variant="primary"
                      />
                      <ActionButton 
                        icon={<Layers className="w-4 h-4" />} 
                        label="Thẻ từ" 
                        onClick={() => handleAction(lessonId, 'practice')} 
                        variant="secondary"
                      />
                      <ActionButton 
                        icon={<Gamepad2 className="w-4 h-4" />} 
                        label="Kiểm tra" 
                        onClick={() => handleAction(lessonId, 'quiz')} 
                        variant="accent"
                      />
                      <ActionButton 
                        icon={<Puzzle className="w-4 h-4" />} 
                        label="Ghép cặp" 
                        onClick={() => handleAction(lessonId, 'game')} 
                        variant="outline"
                      />
                      <ActionButton 
                        icon={<MessageSquare className="w-4 h-4" />} 
                        label="Sắp xếp" 
                        onClick={() => handleAction(lessonId, 'sentence')} 
                        variant="outline"
                      />
                      <ActionButton 
                        icon={<Edit3 className="w-4 h-4" />} 
                        label="Viết chữ" 
                        onClick={() => handleAction(lessonId, 'write')} 
                        variant="outline"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

function ActionButton({ icon, label, onClick, variant }: { icon: React.ReactNode, label: string, onClick: () => void, variant: 'primary' | 'secondary' | 'accent' | 'outline' }) {
  const variants = {
    primary: 'bg-primary text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container',
    accent: 'bg-tertiary-container text-on-tertiary-container',
    outline: 'bg-surface-container-low text-on-surface-variant border border-surface-container-highest hover:bg-surface-container-high'
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${variants[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}
