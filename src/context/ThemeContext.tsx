import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, ThemeId } from '../types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'dark-blue': {
    id: 'dark-blue',
    name: 'Dark Blue',
    tagline: 'Pitch Black & Neon Blue',
    badge: 'Default Core',
    isDark: true,
    bgBase: '#000000',
    bgSidebar: '#030712',
    bgCard: '#080d1a',
    bgCardHover: '#0f172a',
    borderSubtle: 'rgba(56, 189, 248, 0.15)',
    borderFocus: 'rgba(56, 189, 248, 0.6)',
    accentPrimary: '#0284c7',
    accentHover: '#38bdf8',
    accentGlow: '0 0 25px rgba(56, 189, 248, 0.35)',
    accentGradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
    highlightMint: '#38bdf8',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
    textAccent: '#38bdf8',
    swatchBg: '#000000',
    swatchDot: '#38bdf8',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Sapphire',
    tagline: 'Midnight Blue & Glowing Cyan',
    badge: 'Deep Ocean',
    isDark: true,
    bgBase: '#060b19',
    bgSidebar: '#09132b',
    bgCard: '#0d1b3e',
    bgCardHover: '#132657',
    borderSubtle: 'rgba(37, 99, 235, 0.25)',
    borderFocus: 'rgba(6, 182, 212, 0.7)',
    accentPrimary: '#2563eb',
    accentHover: '#3b82f6',
    accentGlow: '0 0 25px rgba(6, 182, 212, 0.4)',
    accentGradient: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
    highlightMint: '#22d3ee',
    textPrimary: '#f0f9ff',
    textMuted: '#93c5fd',
    textAccent: '#22d3ee',
    swatchBg: '#060b19',
    swatchDot: '#2563eb',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    tagline: 'Forest Obsidian & Mint Glow',
    badge: 'Lush Botanical',
    isDark: true,
    bgBase: '#030e09',
    bgSidebar: '#061911',
    bgCard: '#0a261a',
    bgCardHover: '#0f3827',
    borderSubtle: 'rgba(16, 185, 129, 0.25)',
    borderFocus: 'rgba(52, 211, 153, 0.7)',
    accentPrimary: '#059669',
    accentHover: '#10b981',
    accentGlow: '0 0 25px rgba(52, 211, 153, 0.4)',
    accentGradient: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
    highlightMint: '#6ee7b7',
    textPrimary: '#ecfdf5',
    textMuted: '#a7f3d0',
    textAccent: '#34d399',
    swatchBg: '#030e09',
    swatchDot: '#10b981',
  },
  violet: {
    id: 'violet',
    name: 'Violet',
    tagline: 'Amethyst Plum & Electric Lavender',
    badge: 'Cosmic Luxe',
    isDark: true,
    bgBase: '#0d0618',
    bgSidebar: '#170b2b',
    bgCard: '#231140',
    bgCardHover: '#32185c',
    borderSubtle: 'rgba(168, 85, 247, 0.25)',
    borderFocus: 'rgba(232, 121, 249, 0.7)',
    accentPrimary: '#9333ea',
    accentHover: '#a855f7',
    accentGlow: '0 0 25px rgba(192, 132, 252, 0.4)',
    accentGradient: 'linear-gradient(135deg, #9333ea 0%, #e879f9 100%)',
    highlightMint: '#f472b6',
    textPrimary: '#faf5ff',
    textMuted: '#d8b4fe',
    textAccent: '#c084fc',
    swatchBg: '#0d0618',
    swatchDot: '#a855f7',
  },
  'light-blue': {
    id: 'light-blue',
    name: 'Light Azure',
    tagline: 'Crisp White & Ocean Blue',
    badge: 'Clean Light',
    isDark: false,
    bgBase: '#f8fafc',
    bgSidebar: '#ffffff',
    bgCard: '#ffffff',
    bgCardHover: '#f1f5f9',
    borderSubtle: '#cbd5e1',
    borderFocus: '#0284c7',
    accentPrimary: '#0284c7',
    accentHover: '#0369a1',
    accentGlow: '0 4px 20px rgba(2, 132, 199, 0.2)',
    accentGradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
    highlightMint: '#0284c7',
    textPrimary: '#0f172a',
    textMuted: '#475569',
    textAccent: '#0284c7',
    swatchBg: '#f8fafc',
    swatchDot: '#0284c7',
  },
  'light-emerald': {
    id: 'light-emerald',
    name: 'Light Mint',
    tagline: 'Fresh White & Forest Mint',
    badge: 'Botanical Light',
    isDark: false,
    bgBase: '#f0fdf4',
    bgSidebar: '#ffffff',
    bgCard: '#ffffff',
    bgCardHover: '#f0fdf4',
    borderSubtle: '#bbf7d0',
    borderFocus: '#059669',
    accentPrimary: '#059669',
    accentHover: '#047857',
    accentGlow: '0 4px 20px rgba(5, 150, 105, 0.2)',
    accentGradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    highlightMint: '#059669',
    textPrimary: '#064e3b',
    textMuted: '#047857',
    textAccent: '#059669',
    swatchBg: '#f0fdf4',
    swatchDot: '#059669',
  },
  'light-warm': {
    id: 'light-warm',
    name: 'Academic Paper',
    tagline: 'Warm Parchment & Rich Ink',
    badge: 'Editorial Light',
    isDark: false,
    bgBase: '#fcfaf7',
    bgSidebar: '#ffffff',
    bgCard: '#ffffff',
    bgCardHover: '#f7f4ed',
    borderSubtle: '#d6cebe',
    borderFocus: '#b45309',
    accentPrimary: '#b45309',
    accentHover: '#92400e',
    accentGlow: '0 4px 20px rgba(180, 83, 9, 0.2)',
    accentGradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    highlightMint: '#b45309',
    textPrimary: '#1c1917',
    textMuted: '#57534e',
    textAccent: '#b45309',
    swatchBg: '#fcfaf7',
    swatchDot: '#b45309',
  },
};

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeConfig;
  isDark: boolean;
  mode: 'dark' | 'light';
  setTheme: (id: ThemeId) => void;
  toggleDarkMode: () => void;
  setMode: (mode: 'dark' | 'light') => void;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = 'lexilens_active_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      if (saved && THEMES[saved]) return saved;
    }
    return 'dark-blue';
  });

  const theme = THEMES[themeId] || THEMES['dark-blue'];
  const isDark = theme.isDark ?? true;
  const mode = isDark ? 'dark' : 'light';

  const toggleDarkMode = () => {
    if (isDark) {
      // Switch to Light mode
      if (themeId === 'emerald') setThemeId('light-emerald');
      else setThemeId('light-blue');
    } else {
      // Switch to Dark mode
      if (themeId === 'light-emerald') setThemeId('emerald');
      else setThemeId('dark-blue');
    }
  };

  const setMode = (targetMode: 'dark' | 'light') => {
    if (targetMode === 'light' && isDark) {
      toggleDarkMode();
    } else if (targetMode === 'dark' && !isDark) {
      toggleDarkMode();
    }
  };

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);

    const root = document.documentElement;
    root.style.setProperty('--bg-base', theme.bgBase);
    root.style.setProperty('--bg-sidebar', theme.bgSidebar);
    root.style.setProperty('--bg-card', theme.bgCard);
    root.style.setProperty('--bg-card-hover', theme.bgCardHover);
    root.style.setProperty('--border-subtle', theme.borderSubtle);
    root.style.setProperty('--border-focus', theme.borderFocus);
    root.style.setProperty('--accent-primary', theme.accentPrimary);
    root.style.setProperty('--accent-hover', theme.accentHover);
    root.style.setProperty('--accent-glow', theme.accentGlow);
    root.style.setProperty('--highlight-mint', theme.highlightMint);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--text-accent', theme.textAccent);

    // Apply classes for light/dark CSS overrides
    if (theme.isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }

    document.body.style.backgroundColor = theme.bgBase;
    document.body.style.color = theme.textPrimary;
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme,
        isDark,
        mode,
        setTheme: setThemeId,
        toggleDarkMode,
        setMode,
        availableThemes: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
