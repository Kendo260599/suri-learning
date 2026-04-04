'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

// Dynamic import to avoid SSR issues with Firebase
const App = dynamic(() => import('@/components/App').then(mod => ({ default: mod.App })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-ink-muted font-medium">Loading...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider userId={user?.uid ?? null}>
      <App />
    </ThemeProvider>
  );
}

