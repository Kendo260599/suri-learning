import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'ielts-app-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      // Check system preference
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      // Dark mode CSS variables
      root.style.setProperty('--color-bg', '#0f172a'); // slate-900
      root.style.setProperty('--color-surface', '#1e293b'); // slate-800
      root.style.setProperty('--color-ink', '#f8fafc'); // slate-50
      root.style.setProperty('--color-ink-muted', '#94a3b8'); // slate-400
      root.style.setProperty('--color-line', '#334155'); // slate-700
    } else {
      root.classList.remove('dark');
      // Light mode CSS variables (default)
      root.style.setProperty('--color-bg', '#f8fafc');
      root.style.setProperty('--color-surface', '#f1f5f9');
      root.style.setProperty('--color-ink', '#0f172a');
      root.style.setProperty('--color-ink-muted', '#64748b');
      root.style.setProperty('--color-line', '#e2e8f0');
    }
    
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get theme without requiring provider
export const useThemeSafe = (): ThemeContextType | null => {
  return useContext(ThemeContext) ?? null;
};
