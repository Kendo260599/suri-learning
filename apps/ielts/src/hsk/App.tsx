"use client";

import React, { useState } from 'react';
import HSKLayout from './components/HSKLayout';
import Home from './components/Home';
import Learn from './components/Learn';
import Practice from './components/Practice';
import Write from './components/Write';
import Quiz from './components/Quiz';
import MatchingGame from './components/MatchingGame';
import SentenceScramble from './components/SentenceScramble';
import Profile from './components/Profile';
import LiveTutor from './components/LiveTutor';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const handleSetTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') setSelectedLesson(null);
  };

  return (
    <HSKLayout activeTab={activeTab} setActiveTab={handleSetTab}>
      {activeTab === 'home' && (
        <Home
          setActiveTab={handleSetTab}
          setSelectedLesson={setSelectedLesson}
        />
      )}
      {activeTab === 'learn' && (
        <Learn
          selectedLesson={selectedLesson}
          setActiveTab={handleSetTab}
        />
      )}
      {activeTab === 'practice' && <Practice selectedLesson={selectedLesson} />}
      {activeTab === 'write' && <Write selectedLesson={selectedLesson} />}
      {activeTab === 'quiz' && (
        <Quiz
          selectedLesson={selectedLesson}
          setActiveTab={handleSetTab}
        />
      )}
      {activeTab === 'game' && (
        <MatchingGame
          selectedLesson={selectedLesson}
          setActiveTab={handleSetTab}
        />
      )}
      {activeTab === 'sentence' && (
        <SentenceScramble
          selectedLesson={selectedLesson}
          setActiveTab={handleSetTab}
        />
      )}
      {activeTab === 'live' && <LiveTutor />}
      {activeTab === 'profile' && <Profile />}
    </HSKLayout>
  );
}
