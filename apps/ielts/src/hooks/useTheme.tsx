import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme, persist?: boolean) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'ielts-app-theme';

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children, userId }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-bg', '#0f172a');
      root.style.setProperty('--color-surface', '#1e293b');
      root.style.setProperty('--color-ink', '#f8fafc');
      root.style.setProperty('--color-ink-muted', '#94a3b8');
      root.style.setProperty('--color-line', '#334155');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-bg', '#f8fafc');
      root.style.setProperty('--color-surface', '#f1f5f9');
      root.style.setProperty('--color-ink', '#0f172a');
      root.style.setProperty('--color-ink-muted', '#64748b');
      root.style.setProperty('--color-line', '#e2e8f0');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!userId || typeof window === 'undefined') return;
    import('../lib/firebase-client').then(({ db }) => {
      import('firebase/firestore').then(({ doc, getDoc }) => {
        getDoc(doc(db, 'users', userId)).then((snap) => {
          if (snap.exists() && snap.data().theme) {
            const saved = snap.data().theme as Theme;
            if (saved === 'dark' || saved === 'light') {
              setThemeState(saved);
              localStorage.setItem(STORAGE_KEY, saved);
            }
          }
        }).catch(() => {});
      });
    });
  }, [userId]);

  const syncToFirebase = useCallback((newTheme: Theme) => {
    if (!userId || typeof window === 'undefined') return;
    import('../lib/firebase-client').then(({ db }) => {
      import('firebase/firestore').then(({ doc, setDoc }) => {
        setDoc(doc(db, 'users', userId), { theme: newTheme }, { merge: true }).catch(() => {});
      });
    });
  }, [userId]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      syncToFirebase(next);
      return next;
    });
  }, [syncToFirebase]);

  const setTheme = useCallback((newTheme: Theme, persist = true) => {
    setThemeState(newTheme);
    if (persist) syncToFirebase(newTheme);
  }, [syncToFirebase]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
