import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Crown, Zap, Star, Diamond, BookOpen } from 'lucide-react';

export interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  isLoading?: boolean;
}

const PREMIUM_BENEFITS = [
  { icon: Zap, label: 'Không giới hạn AI Chat', desc: 'Trò chuyện không giới hạn với AI' },
  { icon: BookOpen, label: 'Khóa học độc quyền', desc: '300+ bài học premium IELTS' },
  { icon: Star, label: 'Không có quảng cáo', desc: 'Trải nghiệm học tập không gián đoạn' },
  { icon: Diamond, label: 'Streak Protection', desc: 'Bảo vệ streak khi quên học' },
];

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl pointer-events-auto overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-brand-yellow via-amber-400 to-orange-400 p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent)]" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="text-5xl mb-3 relative z-10">👑</div>
                <h2 className="text-2xl font-black text-white font-display tracking-tight relative z-10">
                  Nâng cấp Premium
                </h2>
                <p className="text-white/80 text-sm font-medium mt-1 relative z-10">
                  Mở khóa toàn bộ tiềm năng của bạn
                </p>
              </div>

              {/* Benefits */}
              <div className="p-6">
                <div className="flex flex-col gap-3 mb-6">
                  {PREMIUM_BENEFITS.map((benefit, i) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={benefit.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="text-brand-yellow" size={20} />
                        </div>
                        <div>
                          <p className="font-black text-ink text-sm">{benefit.label}</p>
                          <p className="text-xs text-ink-muted">{benefit.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pricing */}
                <div className="bg-surface rounded-2xl p-4 mb-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-3xl font-black text-ink font-display">49.000đ</span>
                    <span className="text-ink-muted text-sm font-medium">/tháng</span>
                  </div>
                  <p className="text-xs text-ink-muted">
                    Hoặc <span className="font-black text-ink">390.000đ</span> / năm (tiết kiệm 34%)
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={onUpgrade}
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-brand-yellow to-orange-400 text-white font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-orange-400/30 active:translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Crown size={18} />
                      Nâng cấp ngay
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-ink-muted mt-3">
                  Miễn phí 7 ngày dùng thử · Hủy bất kỳ lúc nào
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
