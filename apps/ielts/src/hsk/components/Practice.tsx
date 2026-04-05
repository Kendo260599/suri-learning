"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronsLeft, Check, Zap, RotateCcw, Volume2 } from 'lucide-react';
import { hsk1Words } from '@/hsk/data/hsk1';
import { playAudio } from '@/hsk/utils/audio';
import { addXP, masterWord, updateSRS, getProgress } from '@/hsk/utils/progress';

export default function Practice({ selectedLesson }: { selectedLesson: number | null }) {
  const [progress, setProgress] = useState(getProgress());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const words = useMemo(() => {
    let filtered = selectedLesson 
      ? hsk1Words.filter(w => w.lesson === selectedLesson)
      : hsk1Words;

    // If no lesson selected, prioritize words due for review
    if (!selectedLesson) {
      const now = new Date();
      return [...filtered].sort((a, b) => {
        const srsA = progress.srsData?.[a.id];
        const srsB = progress.srsData?.[b.id];
        
        const dateA = srsA ? new Date(srsA.nextReview) : new Date(0);
        const dateB = srsB ? new Date(srsB.nextReview) : new Date(0);
        
        // Words due for review (or never reviewed) come first
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    return filtered;
  }, [selectedLesson, progress.srsData]);
    
  const currentWord = words[currentIndex];

  const nextCard = (q: number) => {
    setIsFlipped(false);
    const newProgress = updateSRS(currentWord.id, q);
    setProgress(newProgress);
    addXP(5);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 pt-4 md:pt-0 flex flex-col items-center min-h-[calc(100vh-120px)]"
    >
      {/* Header Info */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Tiến độ ôn tập
          </span>
          <span className="text-sm font-bold text-primary">
            {currentIndex + 1} / {words.length} <span className="text-on-surface-variant font-medium">Từ</span>
          </span>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-fixed-dim rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="relative w-full max-w-md aspect-[3/4] perspective-1000 cursor-pointer mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-flipped' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {!isFlipped ? (
              // Front of card (Hanzi)
              <div className="w-full h-full rounded-[2.5rem] bg-surface-container-lowest shadow-[0px_20px_40px_rgba(0,108,74,0.06)] flex flex-col items-center justify-center p-8 border border-surface-container-high hover:border-primary-container/30 transition-colors relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-secondary-container/10 text-secondary-container px-3 py-1.5 rounded-lg font-bold text-xs tracking-widest uppercase">
                  Bài {currentWord.lesson}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentWord.hanzi);
                  }}
                  className="absolute top-6 left-6 w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors active:scale-90 z-10"
                  aria-label="Play audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                
                <span className="text-[7rem] md:text-[9rem] font-medium text-on-surface hanzi-display leading-none mb-8">
                  {currentWord.hanzi}
                </span>
                
                <div className="flex flex-col items-center gap-2 text-on-surface-variant/60">
                  <RotateCcw className="w-6 h-6" />
                  <span className="text-xs font-bold tracking-widest uppercase">Chạm để lật</span>
                </div>
                
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                    <div className="border-r border-b border-on-surface"></div>
                    <div className="border-b border-on-surface"></div>
                    <div className="border-r border-on-surface"></div>
                    <div></div>
                  </div>
                </div>
              </div>
            ) : (
              // Back of card (Pinyin & Meaning)
              <div className="w-full h-full rounded-[2.5rem] bg-surface-container-lowest shadow-[0px_20px_40px_rgba(0,108,74,0.06)] flex flex-col items-center justify-center p-8 border border-primary-container/30 relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentWord.hanzi);
                  }}
                  className="absolute top-6 left-6 w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors active:scale-90 z-10"
                  aria-label="Play audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center text-center space-y-6 w-full">
                  <div>
                    <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-2 block">Pinyin</span>
                    <span className="text-4xl font-headline font-bold text-secondary">
                      {currentWord.pinyin}
                    </span>
                  </div>
                  
                  <div className="w-16 h-1 bg-surface-container-highest rounded-full my-2"></div>
                  
                  <div>
                    <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-2 block">Tiếng Việt</span>
                    <span className="text-3xl font-headline font-extrabold text-on-surface">
                      {currentWord.vietnamese}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-1 block">English</span>
                    <span className="text-lg font-medium text-on-surface-variant">
                      {currentWord.english}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons (Only visible when flipped) */}
      <div className={`w-full max-w-md transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="flex justify-center gap-4 md:gap-6">
          <button 
            onClick={(e) => { e.stopPropagation(); nextCard(0); }}
            className="group flex flex-col items-center gap-3 p-4 flex-1 rounded-[1.5rem] bg-surface-container-lowest border border-surface-container-high hover:bg-error-container/10 hover:border-error-container/30 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-error-container flex items-center justify-center text-error group-active:scale-90 transition-transform">
              <ChevronsLeft className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-sm text-on-surface">Chưa thuộc</span>
              <span className="text-[10px] text-error font-bold uppercase tracking-widest mt-1">&lt; 1 phút</span>
            </div>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); nextCard(3); }}
            className="group flex flex-col items-center gap-3 p-4 flex-1 rounded-[1.5rem] bg-surface-container-lowest border border-surface-container-high hover:bg-primary-container/10 hover:border-primary-container/30 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-white group-active:scale-90 transition-transform shadow-md shadow-primary-container/20">
              <Check className="w-7 h-7" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-sm text-on-surface">Đã nhớ</span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">1 ngày</span>
            </div>
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); nextCard(5); }}
            className="group flex flex-col items-center gap-3 p-4 flex-1 rounded-[1.5rem] bg-surface-container-lowest border border-surface-container-high hover:bg-secondary-container/10 hover:border-secondary-container/30 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-white group-active:scale-90 transition-transform shadow-md shadow-secondary-container/20">
              <Zap className="w-7 h-7 fill-white" />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-sm text-on-surface">Quá dễ</span>
              <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1">4 ngày</span>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
