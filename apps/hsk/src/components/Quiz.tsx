import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hsk1Words, Word } from '../data/hsk1';
import { playAudio } from '../utils/audio';
import { addXP, completeLesson } from '../utils/progress';

type QuestionType = 
  | 'hanzi-to-vietnamese' 
  | 'vietnamese-to-hanzi' 
  | 'audio-to-hanzi' 
  | 'pinyin-to-hanzi' 
  | 'hanzi-to-pinyin' 
  | 'vietnamese-to-pinyin';

interface Question {
  type: QuestionType;
  word: Word;
  options: Word[];
}

export default function Quiz({ selectedLesson, setActiveTab }: { selectedLesson: number | null, setActiveTab: (tab: string) => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Word | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Generate 15 random questions
  const generateQuestions = () => {
    const pool = selectedLesson 
      ? hsk1Words.filter(w => w.lesson === selectedLesson)
      : hsk1Words;
      
    // If lesson has few words, repeat some to reach 15 questions
    let selectedWords: Word[] = [];
    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    
    if (shuffledPool.length >= 15) {
      selectedWords = shuffledPool.slice(0, 15);
    } else {
      // Repeat words if pool is small
      while (selectedWords.length < 15) {
        selectedWords.push(...shuffledPool);
      }
      selectedWords = selectedWords.slice(0, 15).sort(() => 0.5 - Math.random());
    }
    
    const newQuestions: Question[] = selectedWords.map(word => {
      // Get 3 random wrong options from the same lesson if possible, or from all words
      const wrongOptionsPool = pool.length > 4 ? pool : hsk1Words;
      const wrongOptions = wrongOptionsPool
        .filter(w => w.id !== word.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [...wrongOptions, word].sort(() => 0.5 - Math.random());
      
      const types: QuestionType[] = [
        'hanzi-to-vietnamese', 
        'vietnamese-to-hanzi', 
        'audio-to-hanzi',
        'pinyin-to-hanzi',
        'hanzi-to-pinyin',
        'vietnamese-to-pinyin'
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      return { type, word, options };
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
  };

  useEffect(() => {
    generateQuestions();
  }, [selectedLesson]);

  const handleOptionClick = (option: Word) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const currentQuestion = questions[currentIndex];
    const isCorrect = option.id === currentQuestion.word.id;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXP(10);
      playAudio(currentQuestion.word.hanzi);
    } else {
      // Vibrate if supported
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      
      // Auto-play audio for audio questions
      if (questions[currentIndex + 1].type === 'audio-to-hanzi') {
        setTimeout(() => playAudio(questions[currentIndex + 1].word.hanzi), 300);
      }
    } else {
      setIsGameOver(true);
      
      // Completion logic
      if (score >= 8) {
        if (selectedLesson) {
          completeLesson(selectedLesson);
        }
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#006C4A', '#4ade80', '#fbbf24']
        });
      }
    }
  };

  if (questions.length === 0) return null;

  if (isGameOver) {
    const isPassed = score >= 12; // 80% of 15
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6"
      >
        <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] shadow-xl border border-surface-container-highest text-center max-w-md w-full">
          <Trophy className={`w-24 h-24 mx-auto mb-6 ${isPassed ? 'text-yellow-500' : 'text-outline'}`} />
          <h2 className="text-3xl font-headline font-extrabold mb-2">
            {isPassed ? 'Chúc mừng!' : 'Cố gắng lên!'}
          </h2>
          <p className="text-on-surface-variant mb-4">Bạn đã trả lời đúng {score}/{questions.length} câu hỏi.</p>
          
          {selectedLesson && (
            <div className={`mb-8 p-4 rounded-2xl font-bold text-sm ${isPassed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {isPassed 
                ? `Bạn đã vượt qua bài kiểm tra và mở khóa bài tiếp theo!` 
                : `Bạn cần đúng ít nhất 12 câu để hoàn thành bài học này.`}
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={generateQuestions}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              {isPassed ? 'Luyện tập lại' : 'Thử lại ngay'}
            </button>
            
            <button 
              onClick={() => setActiveTab('home')}
              className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold text-lg hover:bg-surface-container-highest transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const renderQuestionHeader = () => {
    switch (currentQuestion.type) {
      case 'hanzi-to-vietnamese':
        return (
          <>
            <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-4 block">Từ này có nghĩa là gì?</span>
            <div className="text-7xl font-headline font-medium text-on-surface hanzi-display mb-4">
              {currentQuestion.word.hanzi}
            </div>
            <button 
              onClick={() => playAudio(currentQuestion.word.hanzi)}
              className="mx-auto w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </>
        );
      case 'vietnamese-to-hanzi':
        return (
          <>
            <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-4 block">Chọn Hán tự cho:</span>
            <div className="text-4xl font-headline font-extrabold text-primary mb-2">
              {currentQuestion.word.vietnamese}
            </div>
            <div className="text-lg text-on-surface-variant font-medium">
              ({currentQuestion.word.pinyin})
            </div>
          </>
        );
      case 'audio-to-hanzi':
        return (
          <>
            <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-6 block">Nghe và chọn từ đúng</span>
            <button 
              onClick={() => playAudio(currentQuestion.word.hanzi)}
              className="mx-auto w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl active:scale-95 mb-4"
            >
              <Volume2 className="w-12 h-12" />
            </button>
            <p className="text-on-surface-variant text-sm font-medium">Nhấn để nghe lại</p>
          </>
        );
      case 'pinyin-to-hanzi':
        return (
          <>
            <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-4 block">Chọn Hán tự cho phiên âm:</span>
            <div className="text-5xl font-headline font-black text-secondary mb-4">
              {currentQuestion.word.pinyin}
            </div>
          </>
        );
      case 'hanzi-to-pinyin':
        return (
          <>
            <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-4 block">Phiên âm của từ này là gì?</span>
            <div className="text-7xl font-headline font-medium text-on-surface hanzi-display mb-4">
              {currentQuestion.word.hanzi}
            </div>
          </>
        );
      case 'vietnamese-to-pinyin':
        return (
          <>
            <span className="text-sm font-bold text-outline-variant uppercase tracking-widest mb-4 block">Phiên âm của "{currentQuestion.word.vietnamese}" là:</span>
            <div className="text-4xl font-headline font-extrabold text-primary mb-4">
              {currentQuestion.word.vietnamese}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderOptionText = (option: Word) => {
    switch (currentQuestion.type) {
      case 'hanzi-to-vietnamese':
        return option.vietnamese;
      case 'vietnamese-to-hanzi':
      case 'audio-to-hanzi':
      case 'pinyin-to-hanzi':
        return option.hanzi;
      case 'hanzi-to-pinyin':
      case 'vietnamese-to-pinyin':
        return option.pinyin;
      default:
        return option.hanzi;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 pt-4 md:pt-0 flex flex-col items-center min-h-[calc(100vh-120px)]"
    >
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between items-end mb-3">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Câu hỏi {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm font-bold text-primary">
            Điểm: {score}
          </span>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-fixed-dim rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-lg border border-surface-container-highest mb-6">
        <div className="text-center mb-8">
          {renderQuestionHeader()}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = option.id === currentQuestion.word.id;
            const isSelected = selectedOption?.id === option.id;
            
            let btnClass = "p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-center ";
            
            if (!isAnswered) {
              btnClass += "border-surface-container-highest hover:border-primary hover:bg-primary/5 bg-surface";
            } else {
              if (isCorrect) {
                btnClass += "border-green-500 bg-green-50 text-green-700";
              } else if (isSelected && !isCorrect) {
                btnClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                btnClass += "border-surface-container-highest opacity-50 bg-surface";
              }
            }

            const isHanziOption = ['vietnamese-to-hanzi', 'audio-to-hanzi', 'pinyin-to-hanzi'].includes(currentQuestion.type);

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className={`font-medium ${isHanziOption ? 'text-2xl hanzi-display' : 'text-lg'}`}>
                  {renderOptionText(option)}
                </span>
                
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-lg"
          >
            <button
              onClick={handleNext}
              className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              {currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
