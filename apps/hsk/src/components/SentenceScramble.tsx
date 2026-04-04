"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { hsk1Sentences, Sentence } from '../data/sentences';
import { addXP } from '../utils/progress';
import { Trophy, RotateCcw, ArrowRight, Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { playAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function SentenceScramble({ selectedLesson, setActiveTab }: { selectedLesson: number | null, setActiveTab: (tab: string) => void }) {
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lessonSentences, setLessonSentences] = useState<Sentence[]>([]);

  const generateGame = () => {
    const pool = selectedLesson 
      ? hsk1Sentences.filter(s => s.lesson === selectedLesson)
      : hsk1Sentences;
      
    if (pool.length === 0) {
      // Fallback if no sentences for this lesson
      setLessonSentences(hsk1Sentences.slice(0, 3));
    } else {
      setLessonSentences(pool);
    }
    
    setCurrentIndex(0);
    setIsGameOver(false);
    setupSentence(pool[0] || hsk1Sentences[0]);
  };

  const setupSentence = (sentence: Sentence) => {
    setCurrentSentence(sentence);
    // Simple split by character for HSK1, or better would be word segmentation but let's keep it simple
    // For HSK1, most "words" are 1-2 characters. Let's split by common words or just characters for now.
    // A better way is to have the words pre-split in the data, but let's try a simple heuristic.
    const words = sentence.hanzi.replace(/[。？！，]/g, '').split('');
    setShuffledWords([...words].sort(() => 0.5 - Math.random()));
    setSelectedWords([]);
    setIsCorrect(null);
  };

  useEffect(() => {
    generateGame();
  }, [selectedLesson]);

  const handleWordClick = (word: string, index: number) => {
    if (isCorrect !== null) return;
    setSelectedWords([...selectedWords, word]);
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (isCorrect !== null) return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setShuffledWords([...shuffledWords, word].sort(() => 0.5 - Math.random()));
  };

  const checkAnswer = () => {
    if (!currentSentence) return;
    const answer = selectedWords.join('');
    const target = currentSentence.hanzi.replace(/[。？！，]/g, '');
    
    if (answer === target) {
      setIsCorrect(true);
      addXP(15);
      playAudio(currentSentence.hanzi);
      if (currentIndex === lessonSentences.length - 1) {
        setTimeout(() => {
          setIsGameOver(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, 1000);
      }
    } else {
      setIsCorrect(false);
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const handleNext = () => {
    if (currentIndex < lessonSentences.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupSentence(lessonSentences[nextIdx]);
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
          <h2 className="text-3xl font-headline font-extrabold mb-2">Hoàn thành!</h2>
          <p className="text-on-surface-variant mb-8">Bạn đã luyện tập xong các câu của bài học này.</p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={generateGame}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Luyện tập lại
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

  if (!currentSentence) return null;

  return (
    <div className="px-6 pt-4 flex flex-col items-center">
      <div className="w-full max-w-lg mb-8 text-center">
        <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Sắp xếp câu</h2>
        <p className="text-on-surface-variant font-medium">Sắp xếp các từ để tạo thành câu đúng</p>
      </div>

      <div className="w-full max-w-lg bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-lg border border-surface-container-highest mb-8">
        <div className="text-center mb-10">
          <p className="text-2xl font-headline font-extrabold text-primary mb-2">
            {currentSentence.vietnamese}
          </p>
          <p className="text-on-surface-variant font-medium italic">
            ({currentSentence.english})
          </p>
        </div>

        {/* Selected Words Area */}
        <div className="min-h-[80px] w-full border-b-2 border-surface-container-highest flex flex-wrap gap-2 justify-center items-center pb-4 mb-8">
          {selectedWords.map((word, idx) => (
            <motion.button
              key={`selected-${idx}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => handleRemoveWord(word, idx)}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-xl hanzi-display"
            >
              {word}
            </motion.button>
          ))}
        </div>

        {/* Shuffled Words Area */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {shuffledWords.map((word, idx) => (
            <motion.button
              key={`shuffled-${idx}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleWordClick(word, idx)}
              className="px-5 py-3 bg-surface-container-low text-on-surface border border-surface-container-highest rounded-2xl font-bold text-2xl shadow-sm hover:bg-surface-container-high transition-colors hanzi-display"
            >
              {word}
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {isCorrect !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-center gap-2 mb-6 p-4 rounded-2xl font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Chính xác!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  <span>Chưa đúng, hãy thử lại!</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="flex gap-3">
          {isCorrect === null ? (
            <button
              onClick={checkAnswer}
              disabled={selectedWords.length === 0}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg disabled:opacity-50"
            >
              Kiểm tra
            </button>
          ) : isCorrect ? (
            <button
              onClick={handleNext}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              {currentIndex < lessonSentences.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                setShuffledWords([...shuffledWords, ...selectedWords].sort(() => 0.5 - Math.random()));
                setSelectedWords([]);
                setIsCorrect(null);
              }}
              className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold text-lg"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>

      <div className="text-on-surface-variant font-bold">
        Câu {currentIndex + 1} / {lessonSentences.length}
      </div>
    </div>
  );
}
