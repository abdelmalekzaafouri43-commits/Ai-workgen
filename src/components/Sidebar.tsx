import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeSelector } from './ThemeSelector';
import { LightDarkModeToggle } from './LightDarkModeToggle';
import {
  LayoutDashboard,
  Eye,
  ScanEye,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette,
  Sparkles,
  Zap,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { ScannedStyleDna } from '../types';

export type NavTab = 'dashboard' | 'tutor-lens' | 'scanner' | 'library';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeDna?: ScannedStyleDna | null;
  worksheetsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  activeDna,
  worksheetsCount,
}) => {
  const { theme, isDark } = useTheme();

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      subtext: 'Overview & Activity',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tutor-lens' as NavTab,
      label: 'Worksheet Studio',
      subtext: 'AI Generator & View',
      icon: Eye,
      badge: 'AI Core',
    },
    {
      id: 'scanner' as NavTab,
      label: 'Layout Scanner',
      subtext: 'OCR & Layout DNA',
      icon: ScanEye,
      badge: activeDna ? 'DNA Active' : null,
      badgeColor: activeDna
        ? isDark
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
        : undefined,
    },
    {
      id: 'library' as NavTab,
      label: 'My Library',
      subtext: 'Saved Worksheets',
      icon: BookOpen,
      badge: `${worksheetsCount}`,
    },
  ];

  return (
    <aside
      id="left-sidebar-dashboard"
      className={`relative z-40 flex flex-col border-r transition-all duration-300 ease-in-out shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      style={{
        backgroundColor: theme.bgSidebar,
        borderColor: theme.borderSubtle,
      }}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-4 border-b" style={{ borderColor: theme.borderSubtle }}>
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <div
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{
              background: theme.accentGradient,
              boxShadow: theme.accentGlow,
            }}
          >
            <Eye className="w-6 h-6 text-white stroke-[2.5]" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-cyan-300 border border-cyan-400">
              <Zap className="w-2.5 h-2.5 text-cyan-300" />
            </span>
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-extrabold tracking-tight text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  LEXI<span style={{ color: theme.highlightMint }}>LENS</span>
                </span>
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border ${
                  isDark ? 'bg-white/10 text-white/90 border-white/10' : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}>
                  STUDIO
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                AI English Customization
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          id="sidebar-toggle-btn"
          type="button"
          onClick={onToggleCollapse}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
            isDark
              ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Cloned DNA Banner (If Applied) */}
      {!isCollapsed && activeDna && (
        <div
          className="mx-3 mt-3.5 p-2.5 rounded-xl border flex items-center gap-2.5 transition-all border-beam-active shadow-md"
          style={{
            backgroundColor: `${theme.bgCard}`,
            borderColor: theme.borderFocus,
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: theme.accentPrimary }}
          >
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: theme.highlightMint }}>
                Cloned DNA Locked
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-700 font-mono font-bold">
                {activeDna.confidence}%
              </span>
            </div>
            <p className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeDna.layoutStyle}
            </p>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {!isCollapsed && (
          <div className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
            Workspace Hub
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`group relative flex w-full items-center rounded-xl px-3 py-2.5 text-left transition-all duration-250 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'text-white font-semibold border shadow-md border-beam-active'
                    : 'text-slate-900 font-semibold border border-slate-300 shadow-sm'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
              style={{
                backgroundColor: isActive ? theme.bgCard : 'transparent',
                borderColor: isActive ? theme.borderFocus : undefined,
                boxShadow: isActive ? theme.accentGlow : 'none',
              }}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full"
                  style={{ backgroundColor: theme.highlightMint }}
                />
              )}

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
                  isActive
                    ? 'text-white'
                    : isDark
                    ? 'text-slate-400 group-hover:text-white'
                    : 'text-slate-600 group-hover:text-slate-900'
                }`}
                style={{
                  backgroundColor: isActive ? theme.accentPrimary : isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              {!isCollapsed && (
                <div className="ml-3 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-semibold">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
                          item.badgeColor || (isDark ? 'bg-white/10 text-slate-300 border-white/10' : 'bg-slate-200 text-slate-700 border-slate-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`truncate text-[11px] font-normal ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {item.subtext}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Single Button Theme Palette & Light/Dark Mode Footer */}
      <div
        className="p-3 border-t mt-auto space-y-2"
        style={{ borderColor: theme.borderSubtle, backgroundColor: theme.bgBase }}
      >
        <ThemeSelector compact={isCollapsed} />

        <LightDarkModeToggle
          id="sidebar-light-dark-toggle"
          compact={isCollapsed}
          showLabel={!isCollapsed}
          className="w-full"
        />

        <div
          className={`flex items-center gap-3 rounded-xl p-2 transition-colors ${
            isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
          }`}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-white font-bold"
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
              borderColor: 'rgba(255,255,255,0.2)'
            }}
          >
            <GraduationCap className="w-4 h-4 text-white" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className={`truncate text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Educator Studio
              </span>
              <p className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                AI English Customization
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
