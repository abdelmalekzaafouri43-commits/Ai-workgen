import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeId } from '../types';
import { Palette, Check, ChevronDown, Sun, Moon } from 'lucide-react';

interface ThemeSelectorProps {
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
  const { themeId, setTheme, availableThemes, theme, isDark, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeThemeObj = availableThemes.find((t) => t.id === themeId) || availableThemes[0];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} id="theme-selector-container" className="relative w-full">
      {/* Single Compact Theme Button */}
      <button
        id="single-theme-palette-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select Theme Palette"
        title={`Theme Palette: ${activeThemeObj.name}`}
        className={`group flex w-full items-center justify-between rounded-xl border p-2 text-left transition-all duration-200 cursor-pointer hover:bg-white/10 ${
          isOpen ? 'border-cyan-400 bg-white/10' : 'border-white/10 bg-white/5'
        }`}
        style={{
          borderColor: isOpen ? theme.borderFocus : theme.borderSubtle,
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/20 shadow-sm"
            style={{ backgroundColor: activeThemeObj.swatchBg }}
          >
            <div
              className="h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: activeThemeObj.swatchDot }}
            />
          </div>

          {!compact && (
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-white truncate">
                {activeThemeObj.name}
              </span>
              <span className="block text-[10px] text-slate-400 truncate">
                Theme Palette
              </span>
            </div>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-cyan-400' : 'group-hover:text-white'
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: theme.borderFocus,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-white/10 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              Theme Palettes
            </span>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/10 text-cyan-300 hover:bg-white/10 cursor-pointer"
            >
              {isDark ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-cyan-400" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <div className="space-y-1">
            {availableThemes.map((item) => {
              const isActive = themeId === item.id;
              return (
                <button
                  key={item.id}
                  id={`popover-theme-btn-${item.id}`}
                  type="button"
                  onClick={() => {
                    setTheme(item.id as ThemeId);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 rounded-xl p-2 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-white border border-cyan-400/50 font-bold'
                      : 'hover:bg-white/10 text-slate-300 border border-transparent'
                  }`}
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/20"
                    style={{ backgroundColor: item.swatchBg }}
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.swatchDot }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs truncate">{item.name}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                    </div>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {item.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
