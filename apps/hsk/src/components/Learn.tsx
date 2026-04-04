import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Volume2, BookOpen, Gamepad2, Sparkles, Wand2, Play, Loader2, MessageSquare } from 'lucide-react';
import { hsk1Words } from '../data/hsk1';
import { playAudio } from '../utils/audio';
import { addXP, completeLesson } from '../utils/progress';
import { generateGrammarExplanation, generateAIAudio, generatePracticeSentence } from '../services/GeminiService';
import Markdown from 'react-markdown';

export default function Learn({ selectedLesson, setActiveTab }: { selectedLesson: number | null, setActiveTab: (tab: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unlearned, mastered
  const [grammarExplanation, setGrammarExplanation] = useState<string | null>(null);
  const [loadingGrammar, setLoadingGrammar] = useState(false);
  const [aiAudioLoading, setAiAudioLoading] = useState<string | null>(null);
  const [practiceSentence, setPracticeSentence] = useState<any | null>(null);
  const [loadingSentence, setLoadingSentence] = useState(false);

  const filteredWords = hsk1Words.filter(word => {
    const matchesSearch = 
      word.hanzi.includes(searchTerm) || 
      word.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) || 
      word.vietnamese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLesson = selectedLesson ? word.lesson === selectedLesson : true;
    
    return matchesSearch && matchesLesson;
  });

  useEffect(() => {
    if (selectedLesson && !grammarExplanation) {
      loadGrammar();
    }
  }, [selectedLesson]);

  const loadGrammar = async () => {
    if (!selectedLesson) return;
    setLoadingGrammar(true);
    const lessonTitle = `Bài ${selectedLesson}`;
    const explanation = await generateGrammarExplanation(selectedLesson, lessonTitle, filteredWords);
    setGrammarExplanation(explanation);
    setLoadingGrammar(false);
  };

  const handlePlayAIAudio = async (text: string, id: string) => {
    setAiAudioLoading(id);
    const audioUrl = await generateAIAudio(text);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      playAudio(text); // Fallback to browser TTS
    }
    setAiAudioLoading(null);
  };

  const handleGenerateSentence = async () => {
    setLoadingSentence(true);
    const sentence = await generatePracticeSentence(filteredWords.slice(0, 5));
    setPracticeSentence(sentence);
    setLoadingSentence(false);
  };

  const handleStartQuiz = () => {
    if (selectedLesson) {
      setActiveTab('quiz');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pt-6 md:pt-0 pb-12"
    >
      {/* Hero Section */}
      <section className="mb-8 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary shadow-lg shadow-primary/20">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-on-primary/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold font-label uppercase tracking-widest">
              HSK 1 • Msutong
            </span>
            <span className="text-sm font-medium opacity-90">{hsk1Words.length} Từ vựng</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold mb-3">Từ vựng thiết yếu</h2>
          <p className="text-primary-fixed max-w-md text-sm md:text-base leading-relaxed opacity-90 font-medium">
            Khám phá và làm chủ các từ vựng cơ bản nhất trong tiếng Trung theo giáo trình Msutong.
          </p>
        </div>
        <div className="absolute right-[-5%] bottom-[-20%] opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
      </section>

      {/* AI Grammar Section */}
      {selectedLesson && (
        <section className="mb-10 bg-surface-container-lowest rounded-[2rem] p-8 border border-primary-container/20 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-20 h-20 text-primary" />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-headline font-extrabold text-on-surface">Giải thích ngữ pháp AI</h3>
          </div>

          {loadingGrammar ? (
            <div className="flex flex-col items-center py-10 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm font-medium text-on-surface-variant">AI đang phân tích bài học...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none prose-headings:font-headline prose-headings:text-primary prose-p:text-on-surface-variant prose-p:font-medium prose-strong:text-primary">
              <div className="markdown-body">
                <Markdown>{grammarExplanation || "Nhấn để tải giải thích ngữ pháp cho bài học này."}</Markdown>
              </div>
              {!grammarExplanation && (
                <button 
                  onClick={loadGrammar}
                  className="mt-4 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary-container transition-all"
                >
                  Tải giải thích
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* AI Practice Sentence Section */}
      {selectedLesson && (
        <section className="mb-10 bg-secondary-container/5 rounded-[2rem] p-8 border border-secondary-container/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-extrabold text-on-surface">Luyện tập câu với AI</h3>
            </div>
            <button 
              onClick={handleGenerateSentence}
              disabled={loadingSentence}
              className="px-4 py-2 bg-secondary text-on-secondary rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-secondary/90 transition-all disabled:opacity-50"
            >
              {loadingSentence ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Tạo câu mới
            </button>
          </div>

          <AnimatePresence mode="wait">
            {practiceSentence ? (
              <motion.div 
                key={practiceSentence.hanzi}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-secondary-container/10"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">{practiceSentence.pinyin}</p>
                    <h4 className="text-3xl font-headline font-bold text-on-surface hanzi-display">{practiceSentence.hanzi}</h4>
                  </div>
                  <button 
                    onClick={() => handlePlayAIAudio(practiceSentence.hanzi, 'sentence')}
                    className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all"
                  >
                    {aiAudioLoading === 'sentence' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                </div>
                <div className="pt-4 border-t border-surface-container-highest">
                  <p className="text-on-surface font-bold">{practiceSentence.vietnamese}</p>
                  <p className="text-on-surface-variant text-sm italic">{practiceSentence.english}</p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-6 border-2 border-dashed border-surface-container-highest rounded-2xl">
                <p className="text-sm font-medium text-on-surface-variant">Nhấn "Tạo câu mới" để AI giúp bạn đặt câu với từ vựng trong bài.</p>
              </div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Search and Filters */}
      <div className="sticky top-0 md:top-4 z-30 bg-surface/90 backdrop-blur-md py-4 mb-6 -mx-6 px-6 md:mx-0 md:px-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-surface-container-highest rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-container transition-all text-on-surface placeholder:text-outline/60 font-medium shadow-sm"
              placeholder="Tìm kiếm Hán tự, Pinyin hoặc nghĩa..."
            />
          </div>
          
          <div className="flex bg-surface-container-low p-1.5 rounded-2xl w-full md:w-auto border border-surface-container-highest">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter('unlearned')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'unlearned' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              Chưa học
            </button>
            <button 
              onClick={() => setFilter('mastered')}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'mastered' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}
            >
              Đã thuộc
            </button>
          </div>
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredWords.map((word) => (
          <div 
            key={word.id}
            onClick={() => {
              playAudio(word.hanzi);
              addXP(2);
            }}
            className="group relative bg-surface-container-lowest p-6 rounded-[1.5rem] transition-all duration-300 hover:shadow-[0px_15px_30px_rgba(0,108,74,0.08)] flex flex-col justify-between border border-surface-container-highest hover:border-primary-container/40 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-label font-bold text-secondary tracking-wide uppercase mb-2 block">
                  {word.pinyin}
                </span>
                <h3 className="text-4xl font-headline font-bold text-on-surface hanzi-display">
                  {word.hanzi}
                </h3>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(word.hanzi);
                }}
                className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors active:scale-90"
                aria-label="Play audio"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            
            <div>
              <p className="text-on-surface font-bold text-lg mb-1">{word.vietnamese}</p>
              <p className="text-on-surface-variant text-sm font-medium mb-5">{word.english}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-container-highest">
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayAIAudio(word.hanzi, word.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all"
                    title="AI High Quality Voice"
                  >
                    {aiAudioLoading === word.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  </button>
                  <span className="text-[10px] font-bold text-outline-variant uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded-md">
                    {word.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  {/* Mock progress dots */}
                  <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
                  <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
                  <div className="w-2 h-2 rounded-full bg-surface-container-highest"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredWords.length === 0 && (
        <div className="text-center py-20">
          <p className="text-on-surface-variant font-medium">Không tìm thấy từ vựng nào phù hợp.</p>
        </div>
      )}
      {/* Completion Button */}
      {selectedLesson && filteredWords.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleStartQuiz}
            className="bg-primary text-on-primary px-10 py-4 rounded-full font-headline font-extrabold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <Gamepad2 className="w-6 h-6" />
            Làm bài kiểm tra
          </button>
        </div>
      )}
    </motion.div>
  );
}



