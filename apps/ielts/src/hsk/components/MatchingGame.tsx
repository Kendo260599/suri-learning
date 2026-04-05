"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hsk1Words, Word } from '@/hsk/data/hsk1';
import { addXP } from '@/hsk/utils/progress';
import { Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchItem {
  id: string;
  text: string;
  wordId: string;
  type: 'hanzi' | 'meaning';
}

export default function MatchingGame({ selectedLesson, setActiveTab }: { selectedLesson: number | null, setActiveTab: (tab: string) => void }) {
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateGame = () => {
    const pool = selectedLesson 
      ? hsk1Words.filter(w => w.lesson === selectedLesson)
      : hsk1Words;
      
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const selectedWords = shuffledPool.slice(0, 5); // 5 pairs
    
    const hanziItems: MatchItem[] = selectedWords.map(w => ({
      id: `hanzi-${w.id}`,
      text: w.hanzi,
      wordId: w.id,
      type: 'hanzi'
    }));
    
    const meaningItems: MatchItem[] = selectedWords.map(w => ({
      id: `meaning-${w.id}`,
      text: w.vietnamese,
      wordId: w.id,
      type: 'meaning'
    }));
    
    const allItems = [...hanziItems, ...meaningItems].sort(() => 0.5 - Math.random());
    setItems(allItems);
    setMatchedIds([]);
    setSelectedId(null);
    setIsGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    generateGame();
  }, [selectedLesson]);

  const handleItemClick = (item: MatchItem) => {
    if (matchedIds.includes(item.id)) return;
    
    if (!selectedId) {
      setSelectedId(item.id);
      return;
    }
    
    if (selectedId === item.id) {
      setSelectedId(null);
      return;
    }
    
    const selectedItem = items.find(i => i.id === selectedId)!;
    
    if (selectedItem.wordId === item.wordId && selectedItem.type !== item.type) {
      // Match!
      const newMatched = [...matchedIds, selectedId, item.id];
      setMatchedIds(newMatched);
      setSelectedId(null);
      setScore(prev => prev + 1);
      addXP(5);
      
      if (newMatched.length === items.length) {
        setTimeout(() => {
          setIsGameOver(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 500);
      }
    } else {
      // No match
      setSelectedId(item.id);
    }
  };

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-xl text-center max-w-md w-full border border-surface-container-highest"
        >
          <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
          <h2 className="text-3xl font-headline font-extrabold mb-2">Tuyệt vời!</h2>
          <p className="text-on-surface-variant mb-8">Bạn đã ghép đúng tất cả các cặp từ.</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={generateGame}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Chơi lại
            </button>
            <button 
              onClick={() => setActiveTab('home')}
              className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold text-lg"
            >
              Quay về trang chủ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-4 flex flex-col items-center">
      <div className="w-full max-w-lg mb-8 text-center">
        <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Ghép cặp từ vựng</h2>
        <p className="text-on-surface-variant font-medium">Ghép Hán tự với nghĩa tiếng Việt tương ứng</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          const isMatched = matchedIds.includes(item.id);
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleItemClick(item)}
              disabled={isMatched}
              className={`
                h-24 p-4 rounded-2xl border-2 font-bold transition-all flex items-center justify-center text-center
                ${isMatched ? 'bg-green-100 border-green-500 text-green-700 opacity-50' : 
                  isSelected ? 'bg-primary/10 border-primary text-primary shadow-md' : 
                  'bg-surface-container-lowest border-surface-container-highest text-on-surface hover:border-primary/40'}
              `}
            >
              <span className={item.type === 'hanzi' ? 'text-3xl hanzi-display' : 'text-base'}>
                {item.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-12 text-on-surface-variant font-bold">
        Tiến độ: {matchedIds.length / 2} / {items.length / 2} cặp
      </div>
    </div>
  );
}
