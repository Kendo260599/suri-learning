import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Check, Volume2, Mic, MicOff } from 'lucide-react';
import type { QuizQuestion, QuizState, Word } from '../types';

export interface QuizViewProps {
  quizState: QuizState;
  learnWords: Word[];
  setQuizState: React.Dispatch<React.SetStateAction<QuizState | null>>;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  onExit: () => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio: boolean;
  onStartListening: (targetWord: string) => void;
  isListening: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizState,
  learnWords,
  setQuizState,
  setStats,
  onExit,
  onPlayAudio,
  isPlayingAudio,
  onStartListening,
  isListening,
  showToast,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [typingInput, setTypingInput] = useState('');
  const [sentenceBlocks, setSentenceBlocks] = useState<string[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<string[]>([]);
  const [matchingSelected, setMatchingSelected] = useState<{ text: string; lang: 'en' | 'vi' } | null>(null);
  const [matchedItems, setMatchedItems] = useState<string[]>([]);
  const [matchingErrors, setMatchingErrors] = useState<string[]>([]);
  const [matchingOptions, setMatchingOptions] = useState<{ text: string; lang: 'en' | 'vi' }[]>([]);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechScore, setSpeechScore] = useState<number | null>(null);

  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progress = (quizState.currentQuestionIndex / quizState.questions.length) * 100;

  useEffect(() => {
    if (currentQuestion?.type === 'sentence_building' && currentQuestion.scrambledWords) {
      setAvailableBlocks([...currentQuestion.scrambledWords].sort(() => Math.random() - 0.5));
      setSentenceBlocks([]);
    }
    if (currentQuestion?.type === 'matching' && currentQuestion.pairs) {
      const opts: { text: string; lang: 'en' | 'vi' }[] = [];
      currentQuestion.pairs.forEach((p) => {
        opts.push({ text: p.en, lang: 'en' });
        opts.push({ text: p.vi, lang: 'vi' });
      });
      setMatchingOptions(opts.sort(() => 0.5 - Math.random()));
      setMatchedItems([]);
      setMatchingSelected(null);
      setMatchingErrors([]);
    }
    if (currentQuestion?.type === 'speaking') {
      setSpeechTranscript('');
      setSpeechScore(null);
    }
  }, [currentQuestion?.type, currentQuestion?.scrambledWords, currentQuestion?.pairs]);

  const handleMatchingClick = (item: { text: string; lang: 'en' | 'vi' }) => {
    if (matchedItems.includes(item.text)) return;
    if (!matchingSelected) {
      setMatchingSelected(item);
    } else {
      if (matchingSelected.lang === item.lang) {
        setMatchingSelected(item);
      } else {
        const isMatch = currentQuestion.pairs?.some(
          (p) =>
            (p.en === matchingSelected.text && p.vi === item.text) ||
            (p.vi === matchingSelected.text && p.en === item.text)
        );
        if (isMatch) {
          setMatchedItems((prev) => [...prev, matchingSelected.text, item.text]);
          setMatchingSelected(null);
        } else {
          setMatchingErrors([matchingSelected.text, item.text]);
          setTimeout(() => setMatchingErrors([]), 800);
          setMatchingSelected(null);
        }
      }
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const normalize = (str: string) =>
    str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, ' ').trim().toLowerCase();

  const handleNext = () => {
    let hasAnswer = false;
    let correctAnswer = false;

    if (currentQuestion.type === 'typing' || currentQuestion.type === 'keyword_transformation') {
      hasAnswer = typingInput.trim().length > 0;
      correctAnswer = normalize(typingInput) === normalize(currentQuestion.correctAnswer);
    } else if (currentQuestion.type === 'sentence_building') {
      hasAnswer = sentenceBlocks.length > 0;
      correctAnswer = sentenceBlocks.join(' ').toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    } else if (currentQuestion.type === 'matching') {
      hasAnswer = matchedItems.length === (currentQuestion.pairs?.length || 0) * 2;
      correctAnswer = hasAnswer;
    } else if (currentQuestion.type === 'speaking') {
      hasAnswer = speechScore !== null;
      correctAnswer = speechScore === 100;
    } else {
      hasAnswer = selectedOption !== null;
      correctAnswer = selectedOption === currentQuestion.correctAnswer;
    }

    if (!hasAnswer) return;

    if (!showFeedback) {
      setIsCorrect(correctAnswer);
      setShowFeedback(true);
      const reward = currentQuestion.xpReward || 10;
      setQuizState((prev) =>
        prev
          ? {
              ...prev,
              score: correctAnswer ? prev.score + 1 : prev.score,
              sessionXpGained: (prev.sessionXpGained || 0) + (correctAnswer ? reward : 0),
            }
          : null
      );
      if (currentQuestion.wordId) {
        setStats((prev: any) => {
          const newWordProgress = { ...(prev.wordProgress || {}) };
          const completedWords = [...(prev.completedWords || [])];
          const efactor = 2.5;
          const interval = correctAnswer ? (prev.wordProgress?.[currentQuestion.wordId]?.repetition === 0 ? 1 : prev.wordProgress?.[currentQuestion.wordId]?.repetition === 1 ? 6 : Math.round((prev.wordProgress?.[currentQuestion.wordId]?.interval || 1) * efactor)) : 1;
          newWordProgress[currentQuestion.wordId] = {
            srsLevel: correctAnswer ? (prev.wordProgress?.[currentQuestion.wordId]?.srsLevel || 0) + 1 : 0,
            nextReview: new Date(Date.now() + interval * 86400000).toISOString(),
            interval,
            repetition: correctAnswer ? (prev.wordProgress?.[currentQuestion.wordId]?.repetition || 0) + 1 : 0,
            efactor,
          };
          if (correctAnswer && !completedWords.includes(currentQuestion.wordId)) {
            completedWords.push(currentQuestion.wordId);
          }
          return { ...prev, wordProgress: newWordProgress, completedWords };
        });
      }
      return;
    }

    const nextIndex = quizState.currentQuestionIndex + 1;
    const isFinished = nextIndex >= quizState.questions.length;

    if (isFinished) {
      const finalScore = quizState.score;
      const xpGained = quizState.sessionXpGained || 0;
      const totalQuestions = quizState.questions.length;
      const isPassed = totalQuestions > 0 && finalScore / totalQuestions >= 0.6;

      setStats((prev: any) => {
        const newXp = prev.xp + xpGained;
        const newCompletedWords = [...(prev.completedWords || [])];
        if (isPassed) {
          learnWords.forEach((w) => {
            if (!newCompletedWords.includes(w.id)) newCompletedWords.push(w.id);
          });
        }
        return { ...prev, xp: newXp, completedWords: newCompletedWords, lastActive: new Date().toISOString() };
      });

      setQuizState({ ...quizState, currentQuestionIndex: nextIndex, score: finalScore, userAnswers: [...quizState.userAnswers, selectedOption || ''], isFinished: true });
      onExit();
    } else {
      setQuizState({ ...quizState, currentQuestionIndex: nextIndex, userAnswers: [...quizState.userAnswers, selectedOption || ''], isFinished: false });
      setSelectedOption(null);
      setShowFeedback(false);
      setTypingInput('');
      setSentenceBlocks([]);
      setMatchedItems([]);
      setMatchingSelected(null);
      setMatchingErrors([]);
      setSpeechTranscript('');
      setSpeechScore(null);
      setIsCorrect(false);

      if (quizState.questions[nextIndex].type === 'sentence_building') {
        setAvailableBlocks([...(quizState.questions[nextIndex].scrambledWords || [])].sort(() => Math.random() - 0.5));
      }
      if (quizState.questions[nextIndex].type === 'audio') {
        setTimeout(() => onPlayAudio(quizState.questions[nextIndex].correctAnswer), 500);
      }
    }
  };

  const isDisabled =
    !showFeedback &&
    ((currentQuestion.type === 'typing' || currentQuestion.type === 'keyword_transformation') && typingInput.trim().length === 0) ||
    (currentQuestion.type === 'sentence_building' && sentenceBlocks.length === 0) ||
    (currentQuestion.type === 'matching' && matchedItems.length < (currentQuestion.pairs?.length || 0) * 2) ||
    (currentQuestion.type === 'speaking' && speechScore === null) ||
    (currentQuestion.type !== 'typing' &&
      currentQuestion.type !== 'keyword_transformation' &&
      currentQuestion.type !== 'sentence_building' &&
      currentQuestion.type !== 'matching' &&
      currentQuestion.type !== 'speaking' &&
      selectedOption === null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-50 w-full bg-white px-6 py-4 flex items-center gap-6 max-w-2xl mx-auto border-b border-line">
        <button onClick={onExit} className="text-ink-muted hover:text-ink transition-colors">
          <X size={28} strokeWidth={2.5} />
        </button>
        <div className="flex-1 h-3 bg-surface rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-brand-green" />
        </div>
      </div>

      <div className="flex-1 px-6 max-w-2xl mx-auto w-full flex flex-col py-8 overflow-y-auto">
        <h2 className="text-2xl font-black text-ink mb-10 leading-tight font-display whitespace-pre-wrap">{currentQuestion.question}</h2>

        {currentQuestion.type === 'audio' && (
          <div className="flex justify-center mb-10">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onPlayAudio(currentQuestion.correctAnswer)} className={`w-28 h-28 rounded-[2rem] flex items-center justify-center transition-all ${isPlayingAudio ? 'bg-brand-blue text-white shadow-[0_4px_0_0_#1899d6] translate-y-1 animate-pulse' : 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue shadow-[0_8px_0_0_#1cb0f6]'}`}>
              <Volume2 size={48} strokeWidth={2.5} />
            </motion.button>
          </div>
        )}

        {currentQuestion.type === 'keyword_transformation' && (
          <div className="w-full mb-8">
            <div className="bg-surface p-6 rounded-2xl border-2 border-line mb-6">
              <p className="text-xl font-bold text-ink mb-2">Câu gốc:</p>
              <p className="text-2xl font-black text-ink font-display">{currentQuestion.originalSentence}</p>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-lg font-bold text-ink-muted">Từ khóa:</span>
              <span className="px-4 py-2 bg-brand-blue/10 text-brand-blue border-2 border-brand-blue rounded-xl font-black text-xl uppercase tracking-widest">{currentQuestion.keyword}</span>
            </div>
            <input type="text" value={typingInput} onChange={(e) => setTypingInput(e.target.value)} disabled={showFeedback} placeholder="Viết câu trả lời..." className={`w-full p-6 rounded-[1.5rem] border-2 text-2xl font-black transition-all outline-none font-display ${showFeedback ? (isCorrect ? 'bg-brand-green/10 border-brand-green text-brand-green' : 'bg-brand-red/10 border-brand-red text-brand-red') : 'bg-surface border-line text-ink focus:border-brand-blue focus:bg-white'}`} autoFocus />
          </div>
        )}

        {currentQuestion.type === 'typing' && <input type="text" value={typingInput} onChange={(e) => setTypingInput(e.target.value)} disabled={showFeedback} placeholder="Type your answer..." className={`w-full p-6 rounded-[1.5rem] border-2 text-2xl font-black transition-all outline-none font-display ${showFeedback ? (isCorrect ? 'bg-brand-green/10 border-brand-green text-brand-green' : 'bg-brand-red/10 border-brand-red text-brand-red') : 'bg-surface border-line text-ink focus:border-brand-blue'}`} autoFocus />}

        {currentQuestion.type === 'sentence_building' && (
          <div className="w-full flex flex-col gap-10">
            <div className="min-h-[100px] w-full border-b-2 border-line pb-6 flex flex-wrap gap-3 items-start">
              {sentenceBlocks.map((block, i) => (
                <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={`sb-${i}`} onClick={() => { if (!showFeedback) { setSentenceBlocks((prev) => prev.filter((_, index) => index !== i)); setAvailableBlocks((prev) => [...prev, block]); } }} className="px-5 py-3.5 bg-white border-2 border-line rounded-2xl font-black text-ink shadow-[0_3px_0_0_#e5e5e5] active:translate-y-[2px] active:shadow-none font-display">
                  {block}
                </motion.button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableBlocks.map((block, i) => (
                <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={`ab-${i}`} onClick={() => { if (!showFeedback) { setAvailableBlocks((prev) => prev.filter((_, index) => index !== i)); setSentenceBlocks((prev) => [...prev, block]); } }} className="px-5 py-3.5 bg-white border-2 border-line rounded-2xl font-black text-ink shadow-[0_3px_0_0_#e5e5e5] active:translate-y-[2px] active:shadow-none font-display">
                  {block}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {currentQuestion.type === 'matching' && (
          <div className="grid grid-cols-2 gap-5 w-full">
            {matchingOptions.map((opt, i) => {
              const isMatched = matchedItems.includes(opt.text);
              const isSelected = matchingSelected?.text === opt.text;
              const isError = matchingErrors.includes(opt.text);
              let btnClass = `p-5 rounded-[1.5rem] border-2 font-black text-xl transition-all text-center min-h-[90px] flex items-center justify-center font-display `;
              if (isMatched) btnClass += 'bg-line border-line text-transparent shadow-none pointer-events-none';
              else if (isError) btnClass += 'bg-brand-red/10 border-brand-red text-brand-red';
              else if (isSelected) btnClass += 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_4px_0_0_#1cb0f6]';
              else btnClass += 'bg-white border-line text-ink shadow-[0_4px_0_0_#e5e5e5] hover:bg-surface';
              return <button key={`match-${i}`} onClick={() => handleMatchingClick(opt)} disabled={showFeedback || isMatched} className={btnClass}>{opt.text}</button>;
            })}
          </div>
        )}

        {currentQuestion.type === 'speaking' && (
          <div className="flex flex-col items-center gap-10 my-10 w-full">
            <div className="text-5xl font-black text-ink text-center font-display tracking-tight">{currentQuestion.correctAnswer}</div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => !isListening && onStartListening(currentQuestion.correctAnswer)} disabled={showFeedback} className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-brand-red text-white animate-pulse shadow-[0_0_30px_rgba(255,75,75,0.4)]' : showFeedback ? 'bg-line text-ink-muted' : 'bg-brand-blue text-white shadow-[0_8px_0_0_#1899d6] active:translate-y-2 active:shadow-none'}`}>
              {isListening ? <MicOff size={44} strokeWidth={2.5} /> : <Mic size={44} strokeWidth={2.5} />}
            </motion.button>
            {speechTranscript && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mt-6 p-6 rounded-[2rem] border-2 border-line bg-surface w-full max-w-sm shadow-sm">
                <p className="text-ink-muted font-black mb-2 uppercase tracking-widest text-xs">You said:</p>
                <p className={`text-3xl font-black font-display ${speechScore === 100 ? 'text-brand-green' : 'text-brand-red'}`}>"{speechTranscript}"</p>
              </motion.div>
            )}
          </div>
        )}

        {currentQuestion.type !== 'typing' && currentQuestion.type !== 'keyword_transformation' && currentQuestion.type !== 'sentence_building' && currentQuestion.type !== 'matching' && currentQuestion.type !== 'speaking' && (
          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              let btnClass = `p-5 rounded-[1.5rem] border-2 text-left font-black transition-all font-display ${option.length > 50 ? 'text-lg leading-snug' : 'text-xl'} `;
              if (showFeedback) {
                if (option === currentQuestion.correctAnswer) btnClass += 'bg-brand-green/10 border-brand-green text-brand-green';
                else if (isSelected) btnClass += 'bg-brand-red/10 border-brand-red text-brand-red';
                else btnClass += 'border-line text-ink-muted';
              } else {
                if (isSelected) btnClass += 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_4px_0_0_#1cb0f6]';
                else btnClass += 'bg-white border-line text-ink shadow-[0_4px_0_0_#e5e5e5] hover:bg-surface';
              }
              return <button key={option} onClick={() => handleOptionSelect(option)} disabled={showFeedback} className={btnClass}>{option}</button>;
            })}
          </div>
        )}
      </div>

      <div className={`mt-auto border-t-2 p-6 sm:p-10 transition-all duration-500 ${showFeedback ? (isCorrect ? 'bg-brand-green/10 border-brand-green/20' : 'bg-brand-red/10 border-brand-red/20') : 'bg-white border-line'}`}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between">
          {showFeedback && (
            <div className="flex items-center gap-6 w-full sm:w-auto mb-6 sm:mb-0">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isCorrect ? 'bg-brand-green text-white' : 'bg-brand-red text-white'}`}>
                {isCorrect ? <Check size={40} strokeWidth={4} /> : <X size={40} strokeWidth={4} />}
              </div>
              <div className="flex-1">
                <h3 className={`text-3xl font-black font-display uppercase tracking-tight ${isCorrect ? 'text-brand-green' : 'text-brand-red'}`}>{isCorrect ? 'Excellent!' : 'Not quite'}</h3>
                <p className={`font-bold mt-1 text-lg ${isCorrect ? 'text-brand-green/80' : 'text-brand-red/80'}`}>{currentQuestion.explanation}</p>
              </div>
            </div>
          )}
          <button onClick={handleNext} disabled={isDisabled} className={`w-full sm:w-64 py-5 rounded-[1.5rem] font-black text-2xl uppercase tracking-widest transition-all font-display ${isDisabled ? 'bg-line text-ink-muted cursor-not-allowed' : showFeedback ? (isCorrect ? 'bg-brand-green text-white shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-none' : 'bg-brand-red text-white shadow-[0_6px_0_0_#d33131] active:translate-y-1 active:shadow-none') : 'bg-brand-green text-white shadow-[0_6px_0_0_#46a302] active:translate-y-1 active:shadow-none'}`}>
            {showFeedback ? 'Continue' : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
};
