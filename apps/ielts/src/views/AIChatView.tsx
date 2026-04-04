import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Mic, MicOff, X, Sparkles, Paperclip } from 'lucide-react';

export interface AIChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AIChatViewProps {
  messages: AIChatMessage[];
  input: string;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
  topic: string;
  isLoading: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  onTopicChange: (t: string) => void;
}

const TOPICS = ['Daily Life', 'Work & Career', 'Travel', 'Education', 'Technology', 'Environment', 'Health', 'Culture'];

export const AIChatView: React.FC<AIChatViewProps> = ({
  messages,
  input,
  onInputChange,
  onSend,
  onBack,
  topic,
  isLoading,
  isListening,
  onToggleListening,
  onTopicChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Extract vocabulary hints from AI message
  const extractVocabHints = (text: string): string[] => {
    const words = text.match(/\b[A-Z][a-z]{4,}\b/g) || [];
    return [...new Set(words)].slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 bg-white border-b border-line flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-ink/5 transition-colors"
        >
          <X size={24} />
        </button>

        {/* AI Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-sm">
          <Sparkles size={20} className="text-white" />
        </div>

        <div className="flex-1">
          <h1 className="text-lg font-black text-ink font-display tracking-tight">AI Speaking</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
            <p className="text-[10px] font-bold text-brand-green uppercase tracking-widest">Online</p>
          </div>
        </div>

        {/* Gems indicator */}
        <div className="flex items-center gap-1 bg-brand-yellow/10 px-3 py-1.5 rounded-xl">
          <Sparkles size={14} className="text-brand-yellow" />
          <span className="text-xs font-black text-brand-yellow">156</span>
        </div>
      </div>

      {/* Topic pills */}
      <div className="px-4 py-3 bg-white border-b border-line flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => onTopicChange(t)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              t === topic
                ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                : 'bg-surface text-ink-muted border-ink/10 hover:border-brand-purple/30'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-6 pb-4 flex flex-col gap-4">

        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-blue rounded-[2rem] flex items-center justify-center mb-6 shadow-lg"
            >
              <Sparkles size={40} className="text-white" />
            </motion.div>
            <h2 className="text-xl font-black text-ink font-display mb-2">IELTS Speaking Practice</h2>
            <p className="text-ink-muted font-medium text-sm mb-4 max-w-xs">
              Chat với AI để luyện tập nói và viết. Tôi sẽ sửa lỗi ngữ pháp và gợi ý từ vựng.
            </p>
            <div className="bg-brand-purple/5 border border-brand-purple/20 rounded-2xl p-4 text-left w-full">
              <p className="text-xs font-black text-brand-purple uppercase tracking-widest mb-2">🎤 Part 1</p>
              <p className="text-sm font-semibold text-ink italic">
                "Do you enjoy learning new languages? Why or why not?"
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const vocabHints = !isUser ? extractVocabHints(msg.parts[0].text) : [];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles size={16} className="text-white" />
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>

                {/* Message bubble */}
                <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                  isUser
                    ? 'bg-brand-green text-white rounded-tr-sm'
                    : 'bg-white border-2 border-ink/5 text-ink rounded-tl-sm shadow-sm'
                }`}>
                  <p>{msg.parts[0].text}</p>
                </div>

                {/* Vocabulary hints (AI only) */}
                {!isUser && vocabHints.length > 0 && idx === messages.length - 1 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {vocabHints.map((word, wi) => (
                      <span
                        key={wi}
                        className="px-2.5 py-1 bg-brand-purple/10 text-brand-purple text-xs font-semibold rounded-full border border-brand-purple/20"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}

                {/* Feedback label (last AI message) */}
                {!isUser && idx === (() => {
                  for (let i = messages.length - 1; i >= 0; i--) {
                    if (messages[i].role === 'model') return i;
                  }
                  return -1;
                })() && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
                    <span className="text-[10px] font-bold text-brand-green">Grammar: 9/10</span>
                  </div>
                )}
              </div>

              {/* User avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0 text-white font-black text-xs shadow-sm">
                  U
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="bg-white border-2 border-ink/5 rounded-[1.5rem] rounded-tl-sm p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-brand-purple rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.15 }}
                  className="w-2 h-2 bg-brand-purple rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  className="w-2 h-2 bg-brand-purple rounded-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="px-4 py-4 bg-white border-t border-line">
        <div className="flex items-end gap-3">
          {/* Attachment */}
          <button className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-ink-muted hover:bg-ink/5 transition-colors flex-shrink-0">
            <Paperclip size={20} />
          </button>

          {/* Mic button */}
          <button
            onClick={onToggleListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
              isListening
                ? 'bg-brand-red text-white shadow-brand-red/30'
                : 'bg-brand-red/10 text-brand-red hover:bg-brand-red/20'
            }`}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
              placeholder="Nhập tin nhắn bằng tiếng Anh..."
              disabled={isLoading}
              className="w-full bg-surface border-2 border-ink/5 rounded-2xl py-3.5 px-5 pr-14 font-medium text-ink text-sm outline-none focus:border-brand-purple focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              onClick={onSend}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'bg-ink/5 text-ink-muted'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
