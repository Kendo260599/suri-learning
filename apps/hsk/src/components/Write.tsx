"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, CheckCircle2, ChevronRight, ChevronLeft, Volume2, Edit3, PlayCircle, HelpCircle } from 'lucide-react';
import HanziWriter from 'hanzi-writer';
import { hsk1Words } from '../data/hsk1';
import { playAudio } from '../utils/audio';
import { addXP } from '../utils/progress';

export default function Write({ selectedLesson }: { selectedLesson: number | null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const writerContainerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const words = selectedLesson
    ? hsk1Words.filter(w => w.lesson === selectedLesson)
    : hsk1Words;

  if (words.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-6 flex flex-col items-center justify-center min-h-[60vh]"
      >
        <p className="text-on-surface-variant font-medium">Không có từ nào trong bài học này.</p>
      </motion.div>
    );
  }

  const currentWord = words[currentIndex];
  const chars = currentWord.hanzi.split('');

  const [activeCharIndex, setActiveCharIndex] = useState(0);

  // Initialize HanziWriter for the instructional display
  useEffect(() => {
    if (!writerContainerRef.current) return;

    // Clear previous writer
    writerContainerRef.current.innerHTML = '';

    writerRef.current = HanziWriter.create(writerContainerRef.current, chars[activeCharIndex], {
      width: 200,
      height: 200,
      padding: 10,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 200,
      strokeColor: '#006c4a',
      radicalColor: '#005237',
      showOutline: true,
      outlineColor: '#e2e8f0',
    });

  }, [currentWord, activeCharIndex]);

  const animateCharacter = () => {
    if (writerRef.current) {
      writerRef.current.animateCharacter();
    }
  };

  const startQuiz = () => {
    if (writerRef.current) {
      writerRef.current.quiz();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match its display size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#006c4a'; // primary color
        ctx.lineWidth = 12;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [currentIndex]);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    canvas.setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const nextWord = () => {
    clearCanvas();
    addXP(10);
    setActiveCharIndex(0);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const prevWord = () => {
    clearCanvas();
    setActiveCharIndex(0);
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-6 md:pt-0 pb-12 flex flex-col gap-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline font-extrabold text-2xl text-on-surface">Luyện viết Hán tự</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Bài {currentWord.lesson} • {currentWord.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevWord} className="p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high text-primary transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm text-on-surface-variant w-12 text-center">
            {currentIndex + 1} / {words.length}
          </span>
          <button onClick={nextWord} className="p-2 rounded-full bg-surface-container-low hover:bg-surface-container-high text-primary transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Instructional Character Display */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0px_20px_40px_rgba(0,108,74,0.06)] relative overflow-hidden border border-surface-container-highest">
            <div className="absolute top-4 right-4">
              <div className="bg-secondary-container/10 text-secondary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                HSK 1
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl font-headline font-extrabold text-on-surface">{currentWord.vietnamese}</h2>
                <button 
                  onClick={() => playAudio(currentWord.hanzi)}
                  className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all duration-300"
                  aria-label="Play audio"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-secondary text-base font-semibold mb-8">{currentWord.pinyin}</div>
              
              {/* Character Tabs for multi-char words */}
              {chars.length > 1 && (
                <div className="flex gap-2 mb-2">
                  {chars.map((char, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCharIndex(idx)}
                      className={`w-12 h-12 rounded-xl text-xl font-bold transition-all ${
                        idx === activeCharIndex
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              )}

              {/* Large Character Display with HanziWriter */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 bg-surface-container-highest rounded-2xl flex items-center justify-center overflow-hidden mb-4">
                {/* Background Grid */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
                  <div className="border-r border-b border-outline-variant/20 border-dashed"></div>
                  <div className="border-b border-outline-variant/20 border-dashed"></div>
                  <div className="border-r border-outline-variant/20 border-dashed"></div>
                  <div></div>
                </div>
                
                {/* HanziWriter Container */}
                <div ref={writerContainerRef} className="relative z-10 cursor-pointer" onClick={animateCharacter}></div>
              </div>

              {/* HanziWriter Controls */}
              <div className="flex gap-3 mb-4">
                <button 
                  onClick={animateCharacter}
                  className="px-4 py-2 bg-surface-container-low text-primary rounded-xl font-bold text-sm hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  Xem nét viết
                </button>
                <button 
                  onClick={startQuiz}
                  className="px-4 py-2 bg-primary-container text-on-primary-container rounded-xl font-bold text-sm hover:bg-primary/20 transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Kiểm tra nét
                </button>
              </div>
              
              <div className="mt-4 flex flex-col gap-3 w-full">
                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl text-left border border-surface-container-highest">
                  <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
                  <div>
                    <p className="text-xs font-bold uppercase text-on-surface-variant tracking-wider">Nghĩa tiếng Anh</p>
                    <p className="text-sm text-on-surface font-medium">{currentWord.english || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Writing Canvas */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="flex flex-col h-full bg-surface-container-highest rounded-[2.5rem] border-4 border-surface-container-lowest overflow-hidden shadow-inner min-h-[400px] md:min-h-[500px] relative">
            
            {/* Writing Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-outline-variant/20 border-dashed"></div>
              <div className="border-b border-outline-variant/20 border-dashed"></div>
              <div className="border-r border-outline-variant/20 border-dashed"></div>
              <div></div>
            </div>

            {/* Faint Character Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
              <span className="hanzi-display text-[15rem] md:text-[20rem] text-on-surface leading-none select-none">
                {chars[activeCharIndex]}
              </span>
            </div>

            {/* Canvas */}
            <div className="relative z-10 flex-1 w-full h-full cursor-crosshair touch-none">
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerOut={stopDrawing}
                className="w-full h-full block"
              />
            </div>

            {/* Subtle instructional text */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <div className="flex items-center gap-2 text-on-surface-variant/60">
                <Edit3 className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">Viết theo nét mờ</span>
              </div>
            </div>

            {/* Canvas Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
              <button 
                onClick={clearCanvas}
                className="px-6 py-3 md:px-8 md:py-4 bg-surface-container-lowest text-on-surface-variant rounded-full font-bold shadow-lg hover:bg-error-container hover:text-error transition-all duration-300 flex items-center gap-2 active:scale-95"
              >
                <Trash2 className="w-5 h-5" />
                Xóa
              </button>
              <button 
                onClick={nextWord}
                className="px-8 py-3 md:px-10 md:py-4 bg-primary text-on-primary rounded-full font-bold shadow-xl shadow-primary/20 hover:bg-primary-container transition-all duration-300 flex items-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <CheckCircle2 className="w-5 h-5" />
                Hoàn thành
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
