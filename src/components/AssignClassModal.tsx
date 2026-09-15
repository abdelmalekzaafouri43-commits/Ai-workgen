import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Worksheet } from '../types';
import { X, Check, Copy, Users, Calendar, Sparkles, Send } from 'lucide-react';

interface AssignClassModalProps {
  worksheet: Worksheet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAssign: (className: string, dueDate: string) => void;
}

export const AssignClassModal: React.FC<AssignClassModalProps> = ({
  worksheet,
  isOpen,
  onClose,
  onConfirmAssign,
}) => {
  const { theme } = useTheme();
  const [selectedClass, setSelectedClass] = useState('AP English Language - Period 3');
  const [dueDate, setDueDate] = useState('2026-09-22');
  const [instructions, setInstructions] = useState(
    'Complete the contextual vocabulary questions and submit your analytical response before midnight.'
  );
  const [copied, setCopied] = useState(false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  if (!isOpen || !worksheet) return null;

  const mockClasses = [
    { id: 'c1', name: 'AP English Language - Period 3', count: 28 },
    { id: 'c2', name: 'Business English for Executives (Advanced C1)', count: 14 },
    { id: 'c3', name: 'IELTS Intensive Academic Prep', count: 22 },
    { id: 'c4', name: 'Conversational Fluency Lab (B2)', count: 19 },
  ];

  const shareLink = `https://lexilens.edu/assignment/${worksheet.id}?class=${encodeURIComponent(selectedClass)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleAssign = () => {
    setAssignedSuccess(true);
    onConfirmAssign(selectedClass, dueDate);
    setTimeout(() => {
      setAssignedSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl border p-6 shadow-2xl transition-all"
        style={{
          backgroundColor: theme.bgCard,
          borderColor: theme.borderFocus,
          boxShadow: theme.accentGlow,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
            style={{ backgroundColor: theme.accentPrimary }}
          >
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Assign Worksheet to Classroom</h3>
              <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PRO TOOL
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-md">
              {worksheet.title} ({worksheet.cefrLevel} Level)
            </p>
          </div>
        </div>

        {assignedSuccess ? (
          <div className="py-12 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-white">Assignment Dispatched!</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Worksheet synchronized with Google Classroom and LMS portal for <strong>{selectedClass}</strong>. Due by {dueDate}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Target Cohort Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Select Target Class Cohort
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-xl border px-3.5 py-2.5 text-xs text-slate-100 bg-black/40 focus:outline-none transition-colors"
                style={{ borderColor: theme.borderSubtle }}
              >
                {mockClasses.map((c) => (
                  <option key={c.id} value={c.name} className="bg-slate-900 text-white">
                    {c.name} ({c.count} students enrolled)
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date & Submission Window */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Submission Deadline
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border px-3.5 py-2 text-xs text-slate-100 bg-black/40 focus:outline-none"
                  style={{ borderColor: theme.borderSubtle }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Grading Mode
                </label>
                <div
                  className="rounded-xl border px-3.5 py-2 text-xs text-slate-300 bg-black/40 flex items-center justify-between"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <span>AI Auto-Grading & Feedback</span>
                  <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Custom Educator Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instructions for Students (Optional)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={2}
                className="w-full rounded-xl border px-3.5 py-2 text-xs text-slate-100 bg-black/40 focus:outline-none resize-none"
                style={{ borderColor: theme.borderSubtle }}
              />
            </div>

            {/* Shareable Student Direct Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Direct Student Access Link
              </label>
              <div
                className="flex items-center gap-2 rounded-xl border p-1.5 pl-3 bg-black/50"
                style={{ borderColor: theme.borderSubtle }}
              >
                <span className="flex-1 text-[11px] font-mono text-slate-400 truncate">
                  {shareLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all"
                  style={{ backgroundColor: copied ? '#059669' : theme.accentPrimary }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: theme.borderSubtle }}>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssign}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background: theme.accentGradient,
                  boxShadow: theme.accentGlow,
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Confirm & Dispatch to Roster
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
