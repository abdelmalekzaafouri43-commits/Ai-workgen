import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Worksheet, UserStats, ScannedStyleDna, CefrLevel } from '../types';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Users,
  BookOpen,
  ScanEye,
  Eye,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Printer,
  FileCheck,
  FileText,
  Play,
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { LightDarkModeToggle } from './LightDarkModeToggle';

interface DashboardHomeProps {
  userStats: UserStats;
  worksheets: Worksheet[];
  currentWorksheet?: Worksheet;
  onSelectWorksheet: (ws: Worksheet) => void;
  onNavigateTab: (tab: NavTab) => void;
  activeDna?: ScannedStyleDna | null;
  onQuickGenerateAndOpen?: (topic: string, level: CefrLevel) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  userStats,
  worksheets,
  currentWorksheet,
  onSelectWorksheet,
  onNavigateTab,
  activeDna,
  onQuickGenerateAndOpen,
}) => {
  const { theme, isDark } = useTheme();
  const [quickTopic, setQuickTopic] = useState('');
  const [quickLevel, setQuickLevel] = useState<CefrLevel>('B2');
  const [showWorksheetPreview, setShowWorksheetPreview] = useState(true);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickGenerateAndOpen) {
      onQuickGenerateAndOpen(quickTopic || 'Food, Recipes & Healthy Eating', quickLevel);
    } else {
      onNavigateTab('tutor-lens');
    }
  };

  return (
    <div id="dashboard-home-view" className="flex flex-col h-full space-y-6">
      {/* Box 1 Above AI Generator: Header Banner */}
      <div
        id="dashboard-header-banner"
        className={`rounded-2xl border p-5 shadow-lg relative overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-cyan-950/40 border-cyan-500/30'
            : 'bg-white border-slate-300 shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full animate-pulse ${isDark ? 'bg-cyan-400' : 'bg-sky-600'}`} />
              <h1 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                English Worksheet Studio
              </h1>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Generate CEFR-calibrated worksheets, clone paper layouts, and view customized English content.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="dash-quick-generate-btn"
              type="button"
              onClick={() => onNavigateTab('tutor-lens')}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              style={{
                background: theme.accentGradient,
              }}
            >
              <Eye className="w-4 h-4 text-white" />
              <span>Open Studio</span>
            </button>

            <button
              id="dash-quick-scan-btn"
              type="button"
              onClick={() => onNavigateTab('scanner')}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'border-cyan-400/30 bg-white/10 text-slate-100 hover:bg-white/15'
                  : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <ScanEye className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <span>Layout Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Box 2 Above AI Generator: Active Generated Worksheet Spotlight Card */}
      {currentWorksheet && (
        <div
          id="dashboard-active-worksheet-spotlight"
          className={`rounded-2xl border p-5 shadow-xl transition-all relative overflow-hidden ${
            isDark
              ? 'bg-slate-900/80 border-cyan-500/30'
              : 'bg-white border-slate-300 shadow-md'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md mt-0.5"
                style={{ background: theme.accentGradient }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-950' : 'text-white'
                    }`}
                    style={{ backgroundColor: theme.highlightMint }}
                  >
                    Current Active Worksheet
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    isDark
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/40'
                      : 'bg-sky-100 text-sky-800 border-sky-300'
                  }`}>
                    {currentWorksheet.cefrLevel} Level
                  </span>
                  <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    ~{currentWorksheet.estimatedMinutes} mins
                  </span>
                </div>
                <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentWorksheet.title}
                </h3>
                <p className={`text-xs line-clamp-1 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {currentWorksheet.subtitle}
                </p>
                {currentWorksheet.content.readingPassage && (
                  <p className={`text-xs italic line-clamp-2 mt-2 p-2.5 rounded-xl border ${
                    isDark
                      ? 'bg-black/40 text-slate-300 border-white/10'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    "{currentWorksheet.content.readingPassage.slice(0, 180)}..."
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowWorksheetPreview(!showWorksheetPreview)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10'
                    : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <span>{showWorksheetPreview ? 'Hide Full Sheet' : 'Show Full Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectWorksheet(currentWorksheet);
                  onNavigateTab('tutor-lens');
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-lg hover:scale-105 transition-all cursor-pointer ${
                  isDark ? 'text-slate-950' : 'text-white'
                }`}
                style={{
                  backgroundColor: theme.highlightMint,
                }}
              >
                <Eye className={`w-4 h-4 ${isDark ? 'text-slate-950' : 'text-white'}`} />
                <span>Open in AI Studio</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-slate-950' : 'text-white'}`} />
              </button>
            </div>
          </div>

          {/* Direct Display of Generated Worksheet on Dashboard */}
          {showWorksheetPreview && (
            <div className={`mt-5 pt-5 border-t space-y-4 animate-in fade-in duration-300 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {/* Contextual Reading */}
              <div className={`p-4 rounded-xl border space-y-2 ${isDark ? 'bg-black/30 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-cyan-400' : 'text-sky-700'}`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    Reading Passage: {currentWorksheet.content.readingTitle}
                  </span>
                  <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    CEFR {currentWorksheet.cefrLevel} Calibrated
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {currentWorksheet.content.readingPassage}
                </p>
              </div>

              {/* Key Vocab & Practice Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Vocab highlights */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Vocabulary
                  </span>
                  <div className="space-y-1.5">
                    {currentWorksheet.content.vocabNotes.slice(0, 3).map((v, idx) => (
                      <div key={idx} className="text-xs">
                        <strong className={isDark ? 'text-white' : 'text-slate-900'}>{v.word}</strong>: <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{v.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exercises preview */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${isDark ? 'bg-black/20 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    <FileCheck className="w-3.5 h-3.5" />
                    Interactive Exercises Preview
                  </span>
                  <div className="space-y-1.5">
                    {currentWorksheet.content.vocabExercises.items.slice(0, 2).map((item, idx) => (
                      <div key={item.id} className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="font-bold text-slate-400 mr-1">{idx + 1}.</span>
                        {item.sentence} <span className={`font-mono text-[11px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>({item.blankWord})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Quick AI Generator Bar on Dashboard with High-Visibility Animated Border */}
      <div
        id="dashboard-instant-ai-generator"
        className={`relative rounded-2xl border p-4 ai-generator-animated-card shadow-xl ${
          isDark ? 'bg-black/40' : 'bg-white border-slate-300'
        }`}
        style={{ borderColor: isDark ? 'transparent' : '#cbd5e1' }}
      >
        {/* Animated Reticle Corners */}
        <div className="reticle-corner-tl animate-reticle-pulse" />
        <div className="reticle-corner-tr animate-reticle-pulse" />
        <div className="reticle-corner-bl animate-reticle-pulse" />
        <div className="reticle-corner-br animate-reticle-pulse" />

        <form onSubmit={handleQuickSubmit} className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shadow border ${
              isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40' : 'bg-sky-100 text-sky-700 border-sky-300'
            }`}>
              <Sparkles className={`w-4 h-4 animate-pulse ${isDark ? 'text-cyan-300' : 'text-sky-700'}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Instant AI Generator
                </h4>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
              </div>
              <p className={`text-[10px] ${isDark ? 'text-cyan-300/80' : 'text-slate-600'}`}>
                Type any topic or theme to generate and open immediately
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={quickTopic}
              onChange={(e) => setQuickTopic(e.target.value)}
              placeholder="e.g. Daily Routines, Animals & Nature, Food & Cooking..."
              className={`flex-1 rounded-xl border px-3.5 py-2 text-xs focus:outline-none ${
                isDark
                  ? 'border-white/15 bg-black/60 text-white placeholder:text-slate-500 focus:border-cyan-400'
                  : 'border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-sky-600'
              }`}
            />
            <select
              value={quickLevel}
              onChange={(e) => setQuickLevel(e.target.value as CefrLevel)}
              className={`rounded-xl border px-2.5 py-2 text-xs focus:outline-none ${
                isDark
                  ? 'border-white/15 bg-black/60 text-white focus:border-cyan-400'
                  : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-sky-600'
              }`}
            >
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CefrLevel[]).map((lvl) => (
                <option key={lvl} value={lvl} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  {lvl} Level
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer shadow-md shrink-0 hover:brightness-105"
              style={{ background: theme.accentGradient, boxShadow: theme.accentGlow }}
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Generate & View</span>
            </button>
          </div>
        </form>
      </div>

      {/* Metric Cards (Stat Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Worksheets Generated */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            isDark ? '' : 'bg-white border-slate-300 shadow-sm'
          }`}
          style={{
            backgroundColor: isDark ? theme.bgCard : '#ffffff',
            borderColor: isDark ? theme.borderSubtle : '#cbd5e1',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Worksheets Created
            </span>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: `${theme.accentPrimary}33` }}
            >
              <BookOpen className="w-4 h-4" style={{ color: theme.highlightMint }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {userStats.worksheetsGenerated}
            </span>
            <span className={`text-[11px] font-semibold flex items-center ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% this mo
            </span>
          </div>
          <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Across A1-C2 CEFR spectrum</p>
        </div>

        {/* Stat 2: Hours Saved */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            isDark ? '' : 'bg-white border-slate-300 shadow-sm'
          }`}
          style={{
            backgroundColor: isDark ? theme.bgCard : '#ffffff',
            borderColor: isDark ? theme.borderSubtle : '#cbd5e1',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Lesson Prep Saved
            </span>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: `${theme.accentPrimary}33` }}
            >
              <Clock className="w-4 h-4" style={{ color: theme.highlightMint }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {userStats.hoursSaved} hrs
            </span>
            <span className={`text-[11px] font-semibold ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>~4.5 hrs/wk</span>
          </div>
          <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Automated exercise authoring</p>
        </div>

        {/* Stat 3: Active Students Assigned */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            isDark ? '' : 'bg-white border-slate-300 shadow-sm'
          }`}
          style={{
            backgroundColor: isDark ? theme.bgCard : '#ffffff',
            borderColor: isDark ? theme.borderSubtle : '#cbd5e1',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Students Enrolled
            </span>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: `${theme.accentPrimary}33` }}
            >
              <Users className="w-4 h-4" style={{ color: theme.highlightMint }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {userStats.studentsActive}
            </span>
            <span className={`text-[11px] font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>4 Active Cohorts</span>
          </div>
          <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Real-time LMS submission tracking</p>
        </div>

        {/* Stat 4: Average Mastery Score */}
        <div
          className={`rounded-2xl border p-4 transition-all ${
            isDark ? '' : 'bg-white border-slate-300 shadow-sm'
          }`}
          style={{
            backgroundColor: isDark ? theme.bgCard : '#ffffff',
            borderColor: isDark ? theme.borderSubtle : '#cbd5e1',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Mean Mastery Score
            </span>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: `${theme.accentPrimary}33` }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: theme.highlightMint }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {userStats.averageMasteryRate}%
            </span>
            <span className={`text-[11px] font-semibold font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Tier A+</span>
          </div>
          <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Based on answer-key submissions</p>
        </div>
      </div>

      {/* Progress & Weekly Activity Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Engagement Bar Chart - 8 cols */}
        <div
          className={`lg:col-span-8 rounded-2xl border p-5 flex flex-col justify-between ${
            isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Weekly Worksheet Activity & Customization Output
                </h3>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Number of custom modules generated and evaluated per weekday
              </p>
            </div>
            <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total: 55 Sheets / 18.5 hrs
            </span>
          </div>

          {/* SVG Progress Graph */}
          <div className={`h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            {userStats.weeklyActivity.map((d, idx) => {
              const heightPercent = Math.min(100, (d.count / 14) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-cyan-300' : 'text-sky-700'}`}>
                    {d.count}
                  </div>
                  <div className={`w-full max-w-[36px] rounded-t-lg relative overflow-hidden h-full flex items-end ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      style={{
                        height: `${heightPercent}%`,
                        background: theme.accentGradient,
                        boxShadow: theme.accentGlow,
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={`flex items-center justify-between pt-3 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.highlightMint }} />
              Active Generation Velocity
            </span>
            <span>Peak Day: Wednesday (12 Sheets)</span>
          </div>
        </div>

        {/* Quick Cloned DNA Status & Fast Actions - 4 cols */}
        <div
          className={`lg:col-span-4 rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
            isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-300 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Optical DNA Engine Status
              </h3>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {activeDna
                ? `Currently applied to AI Tutor Generator: ${activeDna.layoutStyle}`
                : 'No external layout locked. Default clean modern curriculum layout active.'}
            </p>
          </div>

          {activeDna ? (
            <div className={`rounded-xl border p-3.5 space-y-2 ${isDark ? 'bg-white/5 border-cyan-500/30' : 'bg-slate-50 border-slate-300'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeDna.layoutStyle}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 font-bold">
                  {activeDna.confidence}% MATCH
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Source: {activeDna.sourceName}
              </p>
              <div className="flex items-center gap-1 pt-1">
                {Object.values(activeDna.colorPalette).map((c, i) => (
                  <div
                    key={i}
                    className="h-3 w-6 rounded-sm border border-slate-300"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border border-dashed p-4 text-center space-y-1 ${isDark ? 'border-white/15 text-slate-400' : 'border-slate-300 text-slate-600'}`}>
              <ScanEye className={`w-6 h-6 mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Clone Any Worksheet Vibe</p>
              <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Upload paper tests to duplicate their geometry.</p>
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onNavigateTab('scanner')}
              className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <ScanEye className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                Open Structure Scanner
              </span>
              <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('library')}
              className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-sky-600'}`} />
                View Library ({worksheets.length} Saved)
              </span>
              <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Worksheets Table/List */}
      <div
        className={`rounded-2xl border p-5 space-y-4 ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-300 shadow-sm'
        }`}
      >
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Recent Curriculum Worksheets
            </h3>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Interactive worksheets ready for direct instruction, printing, or LMS dispatch
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('library')}
            className={`text-xs font-semibold flex items-center gap-1 cursor-pointer ${
              isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-sky-600 hover:text-sky-700'
            }`}
          >
            <span>View All in Library</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {worksheets.slice(0, 3).map((ws) => (
            <div
              key={ws.id}
              className={`rounded-xl border p-4 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:border-cyan-400/50'
                  : 'bg-slate-50 border-slate-300 hover:border-sky-500 hover:bg-slate-100/80 shadow-xs'
              }`}
              onClick={() => {
                onSelectWorksheet(ws);
                onNavigateTab('tutor-lens');
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase"
                    style={{
                      backgroundColor: isDark ? `${theme.accentPrimary}33` : '#e0f2fe',
                      color: isDark ? theme.highlightMint : '#0369a1',
                    }}
                  >
                    {ws.cefrLevel} LEVEL
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                      ws.status === 'Premium'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        : ws.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : isDark
                        ? 'bg-white/10 text-slate-300 border-white/10'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {ws.status}
                  </span>
                </div>

                <h4 className={`text-xs font-bold transition-colors line-clamp-2 ${
                  isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-sky-700'
                }`}>
                  {ws.title}
                </h4>
                <p className={`text-[11px] line-clamp-2 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {ws.subtitle}
                </p>
              </div>

              <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${
                isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ws.estimatedMinutes}m
                </span>
                <span className={`font-semibold group-hover:underline flex items-center gap-1 ${
                  isDark ? 'text-cyan-400' : 'text-sky-600'
                }`}>
                  Open in Lens <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
