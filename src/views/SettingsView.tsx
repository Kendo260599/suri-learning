import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User, ChevronRight, Bell, Moon, Volume2, Globe, Shield, HelpCircle,
  Star, ExternalLink, LogOut, ChevronLeft, LucideIcon
} from 'lucide-react';

export interface SettingsViewProps {
  onBack: () => void;
  onLogout: () => void;
  dailyGoal: number;
  onDailyGoalChange: (n: number) => void;
}

interface SettingItem {
  icon: LucideIcon;
  label: string;
  sub?: string;
  onClick: () => void;
  color: string;
  bg: string;
  badge?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (v: boolean) => void;
  value?: number;
  onValueChange?: (v: number) => void;
  valueOptions?: number[];
}

interface SettingsSection {
  title: string;
  items: SettingItem[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onBack,
  onLogout,
  dailyGoal,
  onDailyGoalChange,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminderTime] = useState('19:00');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const sections: SettingsSection[] = [
    {
      title: 'Tài khoản',
      items: [
        { icon: User, label: 'Tài khoản', sub: 'Google · suri@email.com', onClick: () => {}, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
        { icon: Star, label: 'Nâng cấp Premium', sub: '1 tháng miễn phí', onClick: () => {}, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', badge: '🎁' },
      ],
    },
    {
      title: 'Học tập',
      items: [
        { icon: Globe, label: 'Mục tiêu hàng ngày', sub: `${dailyGoal} từ / ngày`, onClick: () => {}, color: 'text-brand-red', bg: 'bg-brand-red/10', value: dailyGoal, onValueChange: onDailyGoalChange, valueOptions: [3, 5, 10, 15, 20] },
        { icon: Bell, label: 'Nhắc nhở học tập', sub: reminderTime, onClick: () => {}, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
        { icon: Globe, label: 'Ngôn ngữ mục tiêu', sub: 'English (IELTS)', onClick: () => {}, color: 'text-brand-green', bg: 'bg-brand-green/10' },
      ],
    },
    {
      title: 'Ứng dụng',
      items: [
        { icon: Volume2, label: 'Âm thanh', sub: 'Nhạc nền & hiệu ứng', onClick: () => {}, color: 'text-ink', bg: 'bg-ink/5', toggle: true, toggleValue: soundEnabled, onToggleChange: setSoundEnabled },
        { icon: Moon, label: 'Chế độ tối', sub: 'Tiết kiệm pin & giảm mỏi mắt', onClick: () => {}, color: 'text-ink', bg: 'bg-ink/5', toggle: true, toggleValue: darkMode, onToggleChange: setDarkMode },
        { icon: Bell, label: 'Thông báo', sub: 'Tin nhắn & lời mời', onClick: () => {}, color: 'text-ink', bg: 'bg-ink/5', toggle: true, toggleValue: notifications, onToggleChange: setNotifications },
      ],
    },
    {
      title: 'Hỗ trợ',
      items: [
        { icon: HelpCircle, label: 'Trợ giúp & FAQ', onClick: () => {}, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
        { icon: Star, label: 'Đánh giá ứng dụng', onClick: () => {}, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10' },
        { icon: Shield, label: 'Chính sách bảo mật', onClick: () => {}, color: 'text-ink-muted', bg: 'bg-ink/5' },
        { icon: Shield, label: 'Điều khoản dịch vụ', onClick: () => {}, color: 'text-ink-muted', bg: 'bg-ink/5' },
        { icon: ExternalLink, label: 'Liên hệ hỗ trợ', onClick: () => {}, color: 'text-brand-green', bg: 'bg-brand-green/10' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-line px-4 py-4 flex items-center gap-4 max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-muted hover:bg-ink/5 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black text-ink font-display tracking-tight">Cài đặt</h1>
      </div>

      <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-4">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="bg-white border-2 border-ink/5 rounded-[2rem] overflow-hidden shadow-sm"
          >
            <div className="px-5 py-3 border-b border-line">
              <p className="text-[10px] font-black text-ink-muted uppercase tracking-widest">
                {section.title}
              </p>
            </div>

            {section.items.map((item, ii) => {
              const Icon = item.icon;
              return (
                <div key={ii}>
                  {ii > 0 && <div className="h-px bg-surface mx-5" />}
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-ink/[0.02] active:bg-ink/[0.04] transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={item.color} size={20} />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs">{item.badge}</span>
                        )}
                      </div>
                      {item.sub && (
                        <p className="text-xs text-ink-muted mt-0.5">{item.sub}</p>
                      )}
                    </div>

                    {item.toggle && (
                      <div
                        className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${
                          item.toggleValue ? 'bg-brand-green' : 'bg-ink/10'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onToggleChange?.(!item.toggleValue);
                        }}
                      >
                        <motion.div
                          animate={{ x: item.toggleValue ? 20 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow"
                        />
                      </div>
                    )}

                    {item.valueOptions && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {item.valueOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={(e) => {
                              e.stopPropagation();
                              item.onValueChange?.(opt);
                            }}
                            className={`w-8 h-8 rounded-lg text-xs font-black transition-colors ${
                              item.value === opt
                                ? 'bg-brand-orange text-white'
                                : 'bg-surface text-ink-muted hover:bg-ink/10'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {!item.toggle && !item.valueOptions && (
                      <ChevronRight className="text-ink-muted flex-shrink-0" size={18} />
                    )}
                  </button>
                </div>
              );
            })}
          </motion.div>
        ))}

        {/* Version */}
        <p className="text-center text-xs text-ink-muted mt-2">
          Phiên bản 1.0.0 · Suri Learning
        </p>

        {/* Sign out */}
        {!showLogoutConfirm ? (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-4 bg-white border-2 border-brand-red/20 text-brand-red rounded-2xl font-black uppercase tracking-widest shadow-sm active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-brand-red/20 rounded-[2rem] p-6 shadow-sm"
          >
            <p className="text-ink font-black text-center mb-4">
              Bạn có chắc muốn đăng xuất?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-surface text-ink font-black rounded-2xl border-2 border-line uppercase tracking-widest active:translate-y-1 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                className="flex-1 py-3 bg-brand-red text-white font-black rounded-2xl uppercase tracking-widest active:translate-y-1 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
