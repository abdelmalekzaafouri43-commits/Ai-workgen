import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Worksheet, CefrLevel } from '../types';
import { exportElementToPdf, triggerPrintWindow } from '../utils/pdfExporter';
import {
  BookOpen,
  Search,
  Filter,
  Clock,
  Printer,
  Users,
  Eye,
  Trash2,
  Copy,
  Layers,
  Sparkles,
  Tag,
  ArrowRight,
  Download,
} from 'lucide-react';
import { AssignClassModal } from './AssignClassModal';

interface WorksheetLibraryProps {
  worksheets: Worksheet[];
  onSelectWorksheet: (ws: Worksheet) => void;
  onDeleteWorksheet: (id: string) => void;
  onDuplicateWorksheet: (ws: Worksheet) => void;
  onOpenLens: () => void;
}

export const WorksheetLibrary: React.FC<WorksheetLibraryProps> = ({
  worksheets,
  onSelectWorksheet,
  onDeleteWorksheet,
  onDuplicateWorksheet,
  onOpenLens,
}) => {
  const { theme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [assigningWorksheet, setAssigningWorksheet] = useState<Worksheet | null>(null);

  const filteredWorksheets = worksheets.filter((ws) => {
    const matchesSearch =
      ws.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ws.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = selectedLevelFilter === 'ALL' || ws.cefrLevel === selectedLevelFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || ws.status === selectedStatusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const levels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const statuses = ['ALL', 'Premium', 'Draft', 'Completed'];

  return (
    <div id="worksheet-library-view" className="flex flex-col h-full space-y-6">
      {/* Top Banner */}
      <div
        className="rounded-2xl border p-5 shadow-xl transition-all"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.borderFocus,
          boxShadow: theme.accentGlow,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ background: theme.accentGradient }}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Curriculum & Custom Worksheet Library
                </h2>
                <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
                  {worksheets.length} ITEMS SAVED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore, assign, and print your customized English worksheets and cloned exam sheets.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenLens}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
            style={{
              background: theme.accentGradient,
              boxShadow: theme.accentGlow,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Worksheet</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 pt-4 border-t flex flex-col md:flex-row items-center gap-3" style={{ borderColor: theme.borderSubtle }}>
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search worksheets by title, grammar topic, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border pl-10 pr-4 py-2 text-xs text-white bg-black/40 focus:outline-none"
              style={{ borderColor: theme.borderSubtle }}
            />
          </div>

          {/* CEFR Level Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              Level:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedLevelFilter === lvl
                    ? 'text-white border'
                    : 'text-slate-400 hover:text-white border border-transparent'
                }`}
                style={{
                  backgroundColor: selectedLevelFilter === lvl ? theme.accentPrimary : 'transparent',
                  borderColor: selectedLevelFilter === lvl ? theme.borderFocus : 'transparent',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              Status:
            </span>
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedStatusFilter === st
                    ? 'text-cyan-300 border border-cyan-500/50 bg-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Worksheets Grid */}
      {filteredWorksheets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorksheets.map((ws) => (
            <div
              key={ws.id}
              className="rounded-2xl border p-5 bg-black/40 hover:border-cyan-400/60 transition-all duration-200 flex flex-col justify-between space-y-4 group shadow-lg"
              style={{ borderColor: theme.borderSubtle }}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase"
                      style={{
                        backgroundColor: `${theme.accentPrimary}33`,
                        color: theme.highlightMint,
                      }}
                    >
                      {ws.cefrLevel} CEFR
                    </span>
                    {ws.appliedDna && (
                      <span className="rounded px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Cloned DNA
                      </span>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${
                      ws.status === 'Premium'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : ws.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    {ws.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {ws.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {ws.subtitle}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {ws.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t space-y-2.5" style={{ borderColor: theme.borderSubtle }}>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> ~{ws.estimatedMinutes} mins
                  </span>
                  <span>{new Date(ws.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectWorksheet(ws);
                      onOpenLens();
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-1.5 text-xs font-semibold text-white hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectWorksheet(ws);
                      onOpenLens();
                      setTimeout(() => {
                        const btn = document.getElementById('export-pdf-action-btn');
                        if (btn) btn.click();
                      }, 400);
                    }}
                    className="flex items-center justify-center gap-1 rounded-xl border border-cyan-500/40 bg-cyan-950/40 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-900/60 transition-colors cursor-pointer"
                    title="Export PDF Document"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssigningWorksheet(ws)}
                    className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                    title="Assign to Classroom"
                  >
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Assign</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 p-16 text-center text-slate-400 space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <h4 className="text-sm font-bold text-white">No matching worksheets found</h4>
          <p className="text-xs text-slate-500">
            Adjust your search terms or generate a fresh worksheet via the AI Tutor Lens.
          </p>
        </div>
      )}

      {/* Assign Modal */}
      <AssignClassModal
        worksheet={assigningWorksheet}
        isOpen={!!assigningWorksheet}
        onClose={() => setAssigningWorksheet(null)}
        onConfirmAssign={(className, dueDate) => {
          console.log(`Assigned worksheet ${assigningWorksheet?.id} to ${className}`);
        }}
      />
    </div>
  );
};
