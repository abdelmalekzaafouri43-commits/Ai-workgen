import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { AiTutorLens } from './components/AiTutorLens';
import { VisualStructureScanner } from './components/VisualStructureScanner';
import { WorksheetLibrary } from './components/WorksheetLibrary';
import { LightDarkModeToggle } from './components/LightDarkModeToggle';
import { PWAInstallButton } from './components/PWAInstallButton';
import { INITIAL_WORKSHEETS, INITIAL_USER_STATS, INITIAL_SCANNED_DNA_LIST } from './data/mockData';
import { Worksheet, ScannedStyleDna, UserStats, CefrLevel } from './types';
import { createClientWorksheet } from './utils/worksheetGenerator';
import { Menu, X } from 'lucide-react';

function AppContent() {
  const { theme } = useTheme();

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // App Data State
  const [worksheets, setWorksheets] = useState<Worksheet[]>(INITIAL_WORKSHEETS);
  const [currentWorksheet, setCurrentWorksheet] = useState<Worksheet>(INITIAL_WORKSHEETS[0]);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [activeDna, setActiveDna] = useState<ScannedStyleDna | null>(INITIAL_SCANNED_DNA_LIST[0]);

  // Actions
  const handleQuickGenerateAndOpen = (topic: string, level: CefrLevel) => {
    const newSheet = createClientWorksheet(topic, level, 'Vocabulary & Idioms', activeDna);
    setCurrentWorksheet(newSheet);
    handleSaveToLibrary(newSheet);
    setActiveTab('tutor-lens');
  };

  const handleSaveToLibrary = (ws: Worksheet) => {
    setWorksheets((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === ws.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = ws;
        return next;
      }
      return [ws, ...prev];
    });

    setUserStats((prev) => ({
      ...prev,
      worksheetsGenerated: prev.worksheetsGenerated + 1,
      hoursSaved: +(prev.hoursSaved + 0.5).toFixed(1),
    }));
  };

  const handleApplyDna = (dna: ScannedStyleDna) => {
    setActiveDna(dna);
    // Automatically clone into current worksheet metadata
    setCurrentWorksheet((prev) => ({
      ...prev,
      appliedDna: dna,
      title: `${prev.title.split(':')[0] || 'Custom'}: ${dna.layoutStyle} Edition`,
    }));
    // Navigate straight to AI Tutor Lens as per "Clone & Apply" workflow!
    setActiveTab('tutor-lens');
  };

  const handleDeleteWorksheet = (id: string) => {
    setWorksheets((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDuplicateWorksheet = (ws: Worksheet) => {
    const copy: Worksheet = {
      ...ws,
      id: 'ws-' + Date.now(),
      title: `${ws.title} (Custom Copy)`,
      createdAt: new Date().toISOString(),
      status: 'Draft',
    };
    setWorksheets((prev) => [copy, ...prev]);
  };

  return (
    <div
      id="lexilens-app-root"
      className="flex h-screen w-screen overflow-hidden text-slate-100"
      style={{ backgroundColor: theme.bgBase }}
    >
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar Dashboard ("The dashboard is always on the left of the screen") */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          activeDna={activeDna}
          worksheetsCount={worksheets.length}
        />
      </div>

      {/* Main Content Area (Sits strictly to the right of the Left Sidebar Dashboard) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation & Controls Bar (Desktop & Mobile) */}
        <header
          className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b shrink-0 no-print transition-colors duration-200"
          style={{
            backgroundColor: theme.bgSidebar,
            borderColor: theme.borderSubtle,
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile drawer toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile brand text */}
            <span className="lg:hidden font-extrabold text-sm tracking-tight">
              LEXI<span style={{ color: theme.highlightMint }}>LENS</span>
            </span>

            {/* Desktop Breadcrumb / Active Tab Title */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Workspace /
              </span>
              <span className="text-xs font-bold capitalize text-slate-200">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'tutor-lens' && 'Worksheet Studio'}
                {activeTab === 'scanner' && 'Layout Scanner'}
                {activeTab === 'library' && 'Worksheet Library'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Worksheet indicator chip */}
            {currentWorksheet && (
              <div
                onClick={() => setActiveTab('tutor-lens')}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer hover:border-cyan-400/50"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderColor: theme.borderSubtle,
                }}
                title="Active loaded worksheet in studio"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.highlightMint }}
                />
                <span className="font-mono font-bold text-cyan-400">{currentWorksheet.cefrLevel}</span>
                <span className="text-slate-300 truncate max-w-[140px] md:max-w-[200px]">
                  {currentWorksheet.title}
                </span>
              </div>
            )}

            {/* PWA Phone App Install Button */}
            <PWAInstallButton />

            {/* Light / Dark Mode Toggle Button */}
            <LightDarkModeToggle id="topbar-light-dark-toggle" compact={false} />
          </div>
        </header>

        {/* Scrollable Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && (
              <DashboardHome
                userStats={userStats}
                worksheets={worksheets}
                currentWorksheet={currentWorksheet}
                onSelectWorksheet={(ws) => {
                  setCurrentWorksheet(ws);
                  setActiveTab('tutor-lens');
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
                activeDna={activeDna}
                onQuickGenerateAndOpen={handleQuickGenerateAndOpen}
              />
            )}

            {activeTab === 'tutor-lens' && (
              <AiTutorLens
                currentWorksheet={currentWorksheet}
                onUpdateWorksheet={(ws) => {
                  setCurrentWorksheet(ws);
                  handleSaveToLibrary(ws);
                }}
                onSaveToLibrary={handleSaveToLibrary}
                activeDna={activeDna}
                onClearDna={() => setActiveDna(null)}
                onNavigateToScanner={() => setActiveTab('scanner')}
              />
            )}

            {activeTab === 'scanner' && (
              <VisualStructureScanner
                onApplyDna={handleApplyDna}
                activeDna={activeDna}
              />
            )}

            {activeTab === 'library' && (
              <WorksheetLibrary
                worksheets={worksheets}
                onSelectWorksheet={(ws) => {
                  setCurrentWorksheet(ws);
                  setActiveTab('tutor-lens');
                }}
                onDeleteWorksheet={handleDeleteWorksheet}
                onDuplicateWorksheet={handleDuplicateWorksheet}
                onOpenLens={() => setActiveTab('tutor-lens')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
