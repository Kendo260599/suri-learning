import React from 'react';
import { motion } from 'motion/react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';

export interface FlashcardData {
  id: string;
  word: string;
  ipa?: string;
  definition: string;
  vietnameseDefinition: string;
  example: string;
  vietnameseExample: string;
  phonetics?: { text: string; audio?: string }[];
  synonyms?: string[];
  antonyms?: string[];
  paraphrasePairs?: Array<{
    original: string;
    paraphrased: string;
    explanation?: string;
  }>;
}

export interface FlashcardProps {
  word: FlashcardData;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio: boolean;
  isGeneratingParaphrases?: boolean;
  onGenerateParaphrase?: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  isFlipped,
  onFlip,
  onPlayAudio,
  isPlayingAudio,
  isGeneratingParaphrases,
  onGenerateParaphrase,
}) => {
  return (
    <motion.div 
      key={`${word.id}-${isFlipped}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white border-2 border-line rounded-[2.5rem] p-10 shadow-[0_12px_0_0_#e5e5e5] flex flex-col items-center text-center cursor-pointer hover:shadow-[0_16px_0_0_#e5e5e5] transition-all relative min-h-[400px]"
      onClick={() => !isFlipped && onFlip()}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onPlayAudio(word.word); }}
        className={`w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all mb-8 ${
          isPlayingAudio 
            ? 'bg-brand-blue text-white shadow-[0_4px_0_0_#1899d6] translate-y-1 animate-pulse' 
            : 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue shadow-[0_8px_0_0_#1cb0f6] hover:bg-brand-blue/20 active:shadow-[0_4px_0_0_#1cb0f6] active:translate-y-1'
        }`}
      >
        <Volume2 size={44} strokeWidth={2.5} />
      </motion.button>
      
      <h2 className="text-5xl font-black text-ink mb-3 font-display tracking-tight">{word.word}</h2>
      {word.ipa && (
        <p className="text-2xl text-ink-muted font-mono mb-4 opacity-60 tracking-wider">{word.ipa}</p>
      )}

      {word.phonetics && word.phonetics.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {word.phonetics.map((p, i) => (
            <button 
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                if (p.audio) {
                  const audio = new Audio(p.audio);
                  audio.play();
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-line rounded-xl text-xs font-bold text-ink-muted hover:text-brand-blue hover:border-brand-blue transition-all"
            >
              <Volume2 size={14} /> {p.text}
            </button>
          ))}
        </div>
      )}

      {!isFlipped ? (
        <div className="mt-10 text-ink-muted font-bold animate-bounce">
          Tap to flip
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full flex flex-col items-center"
        >
          <div className="w-full h-px bg-line my-6"></div>
          <p className="text-3xl font-black text-brand-blue mb-6 font-display">{word.vietnameseDefinition}</p>
          
          <div className="bg-surface rounded-[1.5rem] p-6 w-full text-left mt-4 border border-line/50">
            <p className="text-ink font-bold mb-3 text-xl leading-relaxed">"{word.example}"</p>
            <p className="text-ink-muted font-medium italic">{word.vietnameseExample}</p>
          </div>

          {/* Synonyms & Antonyms */}
          {(word.synonyms?.length || 0) > 0 || (word.antonyms?.length || 0) > 0 ? (
            <div className="w-full mt-8 grid grid-cols-2 gap-4 text-left">
              {word.synonyms && word.synonyms.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-ink-muted mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-blue" /> Synonyms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-blue/5 text-brand-blue rounded-lg text-xs font-bold border border-brand-blue/10">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {word.antonyms && word.antonyms.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black text-ink-muted mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                    <XCircle size={14} className="text-brand-red" /> Antonyms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {word.antonyms.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-brand-red/5 text-brand-red rounded-lg text-xs font-bold border border-brand-red/10">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      )}
    </motion.div>
  );
};
