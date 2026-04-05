"use client";

import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Layers, Edit3, User, Flame, Gamepad2, Puzzle, MessageSquare, Sparkles } from 'lucide-react';
import { getProgress } from '@/hsk/utils/progress';

interface HSKLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function HSKLayout({ children, activeTab, setActiveTab }: HSKLayoutProps) {
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(getProgress());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-24 md:pb-0 md:flex-row">
      {/* Top Header (Mobile) */}
      <header className="w-full top-0 sticky z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-highest md:hidden">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-on-primary font-headline font-bold text-lg leading-none">H</span>
            </div>
            <h1 className="font-headline font-extrabold text-xl tracking-tight text-primary">
              HSK Academy
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-full gap-1.5 border border-primary/10">
              <Flame className="w-4 h-4 text-tertiary-container fill-tertiary-container" />
              <span className="font-headline font-bold text-sm text-on-surface-variant">{progress.streak}</span>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-high">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=eef6ee"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-surface-container-lowest border-r border-surface-container-highest p-6 z-40">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-on-primary font-headline font-bold text-2xl leading-none">H</span>
          </div>
          <h1 className="font-headline font-extrabold text-2xl tracking-tight text-primary">
            HSK Academy
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<Home />} label="Home" id="home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<BookOpen />} label="Learn" id="learn" active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} />
          <NavItem icon={<Sparkles />} label="Gia sư AI" id="live" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
          <NavItem icon={<Layers />} label="Flashcard" id="practice" active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} />
          <NavItem icon={<Gamepad2 />} label="Trắc nghiệm" id="quiz" active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
          <NavItem icon={<Puzzle />} label="Ghép cặp" id="game" active={activeTab === 'game'} onClick={() => setActiveTab('game')} />
          <NavItem icon={<MessageSquare />} label="Sắp xếp câu" id="sentence" active={activeTab === 'sentence'} onClick={() => setActiveTab('sentence')} />
          <NavItem icon={<Edit3 />} label="Luyện viết" id="write" active={activeTab === 'write'} onClick={() => setActiveTab('write')} />
          <NavItem icon={<User />} label="Profile" id="profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-surface-container-highest">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-high shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=eef6ee"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-headline font-bold text-sm text-on-surface truncate">Học viên</span>
              <div className="flex items-center gap-1 text-tertiary-container">
                <Flame className="w-3 h-3 fill-tertiary-container" />
                <span className="text-xs font-bold">{progress.streak} Ngày Streak</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto md:p-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pt-3 pb-6 bg-surface-container-lowest/90 backdrop-blur-xl z-50 rounded-t-[2rem] shadow-[0px_-10px_30px_rgba(0,108,74,0.06)] border-t border-outline-variant/20">
        <MobileNavItem icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <MobileNavItem icon={<BookOpen />} label="Learn" active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} />
        <MobileNavItem icon={<Sparkles />} label="AI" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
        <MobileNavItem icon={<Gamepad2 />} label="Quiz" active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
        <MobileNavItem icon={<Puzzle />} label="Ghép" active={activeTab === 'game'} onClick={() => setActiveTab('game')} />
        <MobileNavItem icon={<MessageSquare />} label="Câu" active={activeTab === 'sentence'} onClick={() => setActiveTab('sentence')} />
        <MobileNavItem icon={<Edit3 />} label="Viết" active={activeTab === 'write'} onClick={() => setActiveTab('write')} />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, id: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-headline font-bold ${
        active
          ? 'bg-primary-container/10 text-primary'
          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
      }`}
    >
      <div className={`${active ? 'text-primary' : 'text-outline'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      </div>
      {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 transition-all duration-300 ease-out ${
        active
          ? 'bg-primary-container/15 text-primary rounded-2xl px-4 py-2'
          : 'text-outline hover:text-primary'
      }`}
    >
      <div className="mb-1">
        {React.cloneElement(icon as React.ReactElement<any>, {
          className: 'w-5 h-5',
          strokeWidth: active ? 2.5 : 2
        })}
      </div>
      <span className="font-body text-[9px] font-bold tracking-wide uppercase">
        {label}
      </span>
    </button>
  );
}
