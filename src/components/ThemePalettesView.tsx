import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeId } from '../types';
import { LightDarkModeToggle } from './LightDarkModeToggle';
import { Sparkles, Check, Palette, Eye, Sun, Moon } from 'lucide-react';

export const ThemePalettesView: React.FC = () => {
  const { themeId, setTheme, availableThemes, isDark, toggleDarkMode } = useTheme();
  const [filterMode, setFilterMode] = useState<'all' | 'dark' | 'light'>('all');

  const filteredThemes = availableThemes.filter((item) => {
    if (filterMode === 'dark') return item.isDark;
    if (filterMode === 'light') return !item.isDark;
    return true;
  });

  return (
    <div id="theme-palettes-view" className="flex flex-col h-full space-y-6 pb-12">
      {/* Top Banner with Quick Mode Toggle */}
      <div
        className="rounded-2xl border p-5 shadow-xl transition-all"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-focus)',
          boxShadow: 'var(--accent-glow)',
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ background: 'var(--accent-gradient, linear-gradient(135deg, #0284c7, #06b6d4))' }}
            >
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  Dynamic Luxury & Academic Theme Engine
                </h2>
                <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/10">
                  {availableThemes.length} PALETTES
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Calibrated light and dark environments engineered for prolonged reading, grading, and pedagogical focus.
              </p>
            </div>
          </div>

          {/* Quick Light / Dark Mode Toggle Button */}
          <div className="shrink-0 w-full md:w-auto">
            <LightDarkModeToggle id="theme-palettes-light-dark-toggle" className="w-full md:w-auto" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            All Palettes ({availableThemes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('dark')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'dark'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            Dark Palettes (4)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('light')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterMode === 'light'
                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Light Palettes (3)
          </button>
        </div>
      </div>

      {/* Theme Cards Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredThemes.map((item) => {
          const isActive = themeId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setTheme(item.id as ThemeId)}
              className={`rounded-2xl border p-5 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 shadow-lg interactive-border-card ${
                isActive
                  ? 'border-cyan-400/80 ring-1 ring-cyan-400/30 border-beam-active shadow-xl'
                  : 'border-white/10 hover:border-white/20'
              }`}
              style={{
                backgroundColor: item.bgCard,
              }}
            >
              {/* Active check pill */}
              {isActive && (
                <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-cyan-400 text-black px-2.5 py-0.5 text-[10px] font-bold uppercase shadow">
                  <Check className="w-3 h-3 stroke-[3]" /> Active
                </span>
              )}

              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div
                    className="h-4 w-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.swatchDot }}
                  />
                  <h3 className="text-base font-black truncate">{item.name}</h3>
                  {item.isDark ? (
                    <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      <Moon className="w-2.5 h-2.5" /> Dark
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <Sun className="w-2.5 h-2.5" /> Light
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">{item.tagline}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.badge}</p>
              </div>

              {/* Color Swatch Matrix */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Color Tokens:
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <div className="flex flex-col items-center rounded-lg border border-white/10 p-1.5 text-center bg-black/10">
                    <div
                      className="h-5 w-5 rounded border border-white/20 mb-1"
                      style={{ backgroundColor: item.bgBase }}
                    />
                    <span className="text-[9px] text-slate-400">Base</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border border-white/10 p-1.5 text-center bg-black/10">
                    <div
                      className="h-5 w-5 rounded border border-white/20 mb-1"
                      style={{ backgroundColor: item.accentPrimary }}
                    />
                    <span className="text-[9px] text-slate-400">Primary</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border border-white/10 p-1.5 text-center bg-black/10">
                    <div
                      className="h-5 w-5 rounded border border-white/20 mb-1"
                      style={{ backgroundColor: item.highlightMint }}
                    />
                    <span className="text-[9px] text-slate-400">Accent</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg border border-white/10 p-1.5 text-center bg-black/10">
                    <div
                      className="h-5 w-5 rounded border border-white/20 mb-1"
                      style={{ backgroundColor: item.bgCardHover }}
                    />
                    <span className="text-[9px] text-slate-400">Surface</span>
                  </div>
                </div>
              </div>

              {/* Mini Interactive Preview Element */}
              <div
                className="rounded-xl border p-2.5 text-xs flex items-center justify-between"
                style={{
                  backgroundColor: item.bgBase,
                  borderColor: item.borderSubtle,
                }}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" style={{ color: item.highlightMint }} />
                  <span className="font-semibold text-xs">Preview</span>
                </div>
                <button
                  type="button"
                  className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white shadow"
                  style={{ backgroundColor: item.accentPrimary }}
                >
                  Select
                </button>
              </div>

              {/* Selection Button */}
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-black font-extrabold shadow'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isActive ? 'Active Palette' : `Switch to ${item.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
