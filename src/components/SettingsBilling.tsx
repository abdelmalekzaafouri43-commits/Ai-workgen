import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Settings,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  School,
  Download,
  Key,
  Database,
  Users,
  Layers,
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { LightDarkModeToggle } from './LightDarkModeToggle';
import { AccentColorPicker } from './AccentColorPicker';

export const SettingsBilling: React.FC = () => {
  const { theme } = useTheme();

  const [institutionName, setInstitutionName] = useState("St. John's International Language Academy");
  const [educatorSignature, setEducatorSignature] = useState('Dr. Sarah Jenkins, M.Ed - Lead ESL Specialist');
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [gradingStandard, setGradingStandard] = useState('Cambridge Assessment English (CEFR A1-C2)');
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePreferences = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2400);
  };

  return (
    <div id="settings-billing-view" className="flex flex-col h-full space-y-6">
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
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Settings & Subscription Portal
                </h2>
                <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PREMIUM TIER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage your enterprise educator license, institutional branding, and AI generation quotas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subscription & Usage - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Plan Card */}
          <div
            className="rounded-2xl border p-6 bg-black/40 shadow-lg space-y-5"
            style={{ borderColor: theme.borderSubtle }}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Current Billing Tier
                </span>
                <h3 className="text-xl font-black text-white">
                  Institutional Educator Unlimited Pro
                </h3>
                <p className="text-xs text-slate-400">
                  Full access to AI Tutor Lens, 4K OCR Structure Cloning, and LMS dispatch
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">$49.00</span>
                <span className="text-xs text-slate-400"> / month</span>
                <span className="block text-[10px] text-emerald-400 font-medium">Institutional Grant Funded</span>
              </div>
            </div>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t" style={{ borderColor: theme.borderSubtle }}>
              {[
                'Unlimited AI Worksheet Syntheses',
                'Optical Structure DNA Cloning (PDF/JPG)',
                'Cambridge & Oxford CEFR Calibration',
                'One-Click Export to PDF & Google Docs',
                'Interactive Student Practice Mode',
                '250 Student Classroom Roster Seats',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Payment Method Details */}
            <div className="p-3.5 rounded-xl border bg-white/5 flex items-center justify-between" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 rounded bg-slate-800 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
                  VISA
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Visa ending in •••• 4242</p>
                  <p className="text-[10px] text-slate-400">Renews automatically on October 14, 2026</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-cyan-400">Active</span>
            </div>
          </div>

          {/* Real-time Usage Gauges */}
          <div
            className="rounded-2xl border p-5 bg-black/40 shadow-lg space-y-4"
            style={{ borderColor: theme.borderSubtle }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Monthly Quotas & Compute Velocity
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">AI Worksheet Generations</span>
                  <span className="font-mono text-cyan-300">48 / Unlimited</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400 w-1/4" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">4K Document Layout Scans</span>
                  <span className="font-mono text-cyan-300">34 / Unlimited</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400 w-1/5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">Active Students Roster</span>
                  <span className="font-mono text-cyan-300">142 / 250 Enrolled</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400 w-[57%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Institutional Customization - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="rounded-2xl border p-5 bg-black/40 shadow-lg space-y-4"
            style={{ borderColor: theme.borderSubtle }}
          >
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Institutional Worksheet Customization
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  School or Academy Name (Header Banner)
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full rounded-xl border px-3.5 py-2 text-xs text-white bg-black/40 focus:outline-none"
                  style={{ borderColor: theme.borderSubtle }}
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Instructor Signature / Title
                </label>
                <input
                  type="text"
                  value={educatorSignature}
                  onChange={(e) => setEducatorSignature(e.target.value)}
                  className="w-full rounded-xl border px-3.5 py-2 text-xs text-white bg-black/40 focus:outline-none"
                  style={{ borderColor: theme.borderSubtle }}
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">
                  Curriculum Assessment Standard
                </label>
                <select
                  value={gradingStandard}
                  onChange={(e) => setGradingStandard(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-xs text-white bg-black/40 focus:outline-none"
                  style={{ borderColor: theme.borderSubtle }}
                >
                  <option value="Cambridge Assessment English (CEFR A1-C2)" className="bg-slate-900">
                    Cambridge Assessment English (CEFR A1-C2)
                  </option>
                  <option value="Oxford International English Standard" className="bg-slate-900">
                    Oxford International English Standard
                  </option>
                  <option value="TOEFL iBT Academic Scale" className="bg-slate-900">
                    TOEFL iBT Academic Scale
                  </option>
                  <option value="IELTS Academic Band Rubric" className="bg-slate-900">
                    IELTS Academic Band Rubric
                  </option>
                </select>
              </div>

              {/* Watermark Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border bg-white/5" style={{ borderColor: theme.borderSubtle }}>
                <div>
                  <p className="font-semibold text-white">CEFR Level Watermark</p>
                  <p className="text-[10px] text-slate-400">Display subtle background watermark on sheets</p>
                </div>
                <input
                  type="checkbox"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                  className="h-4 w-4 rounded accent-cyan-400 cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.02] cursor-pointer"
                style={{
                  background: theme.accentGradient,
                  boxShadow: theme.accentGlow,
                }}
              >
                <span>{saveToast ? 'Preferences Saved!' : 'Save Institutional Preferences'}</span>
              </button>
            </div>
          </div>

          {/* Theme Palette Quick Configuration & Custom Accent Color Picker */}
          <AccentColorPicker />

          <div
            className="rounded-2xl border p-5 bg-black/40 shadow-lg space-y-4"
            style={{ borderColor: theme.borderSubtle }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Appearance & Contrast Mode
              </h4>
            </div>
            <LightDarkModeToggle id="settings-light-dark-toggle" className="w-full" />
            <div className="pt-2 border-t border-white/10">
              <ThemeSelector compact={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
