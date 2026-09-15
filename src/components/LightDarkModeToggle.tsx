import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface LightDarkModeToggleProps {
  compact?: boolean;
  showLabel?: boolean;
  className?: string;
  id?: string;
}

export const LightDarkModeToggle: React.FC<LightDarkModeToggleProps> = ({
  compact = false,
  showLabel = true,
  className = '',
  id = 'light-dark-mode-toggle',
}) => {
  const { isDark, toggleDarkMode, theme } = useTheme();

  return (
    <button
      id={id}
      type="button"
      onClick={toggleDarkMode}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`group relative flex items-center justify-between rounded-xl border p-1.5 transition-all duration-200 cursor-pointer ${
        isDark
          ? 'border-white/15 bg-white/5 hover:border-white/25 hover:bg-white/10 text-slate-200'
          : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50 text-slate-800 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {/* Animated Icon Pill */}
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${
            isDark
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'bg-amber-500/20 text-amber-600'
          }`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
          ) : (
            <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
          )}
        </div>

        {showLabel && !compact && (
          <div className="text-left pr-2">
            <span className="block text-xs font-bold leading-tight">
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span
              className="block text-[10px] leading-tight"
              style={{ color: theme.textMuted }}
            >
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </span>
          </div>
        )}
      </div>

      {/* Switch indicator badge */}
      {!compact && (
        <div
          className={`h-5 w-9 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
            isDark ? 'bg-cyan-600 justify-end' : 'bg-slate-300 justify-start'
          }`}
        >
          <div className="h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200" />
        </div>
      )}
    </button>
  );
};
