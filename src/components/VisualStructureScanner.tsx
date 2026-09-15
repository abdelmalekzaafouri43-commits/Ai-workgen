import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ScannedStyleDna } from '../types';
import { INITIAL_SCANNED_DNA_LIST } from '../data/mockData';
import {
  ScanEye,
  UploadCloud,
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
  Palette,
  Type,
  Maximize2,
  Copy,
  History,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface VisualStructureScannerProps {
  onApplyDna: (dna: ScannedStyleDna) => void;
  activeDna?: ScannedStyleDna | null;
}

export const VisualStructureScanner: React.FC<VisualStructureScannerProps> = ({
  onApplyDna,
  activeDna,
}) => {
  const { theme } = useTheme();

  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanTelemetry, setScanTelemetry] = useState('');
  const [currentResult, setCurrentResult] = useState<ScannedStyleDna | null>(
    activeDna || INITIAL_SCANNED_DNA_LIST[0]
  );
  const [recentScans, setRecentScans] = useState<ScannedStyleDna[]>(INITIAL_SCANNED_DNA_LIST);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Pre-loaded Sample Documents
  const samplePresets = [
    {
      title: 'Oxford_Exam_Paper_Format_C1.pdf',
      badge: 'Academic Split',
      desc: 'Two-column text grid with contextual callouts',
      dna: INITIAL_SCANNED_DNA_LIST[0],
    },
    {
      title: 'Modern_Infographic_Matrix_B2.png',
      badge: 'Bento Grid',
      desc: 'Modular vocabulary cards & lexicon chips',
      dna: INITIAL_SCANNED_DNA_LIST[1],
    },
    {
      title: 'Cambridge_Assessment_Grammar_Lab.jpg',
      badge: 'Matching Columns',
      desc: 'Dual parallel connecting blocks & master crypt',
      dna: INITIAL_SCANNED_DNA_LIST[2],
    },
  ];

  const triggerScanSimulation = (dnaTarget: ScannedStyleDna, previewName?: string) => {
    setIsScanning(true);
    setScanProgress(10);
    setScanTelemetry('Initializing optical layout decomposition...');

    const telemetrySteps = [
      { progress: 28, text: 'Detecting column grid coordinates & flex geometry...' },
      { progress: 54, text: 'Sampling dominant color swatches & contrast ratios...' },
      { progress: 76, text: 'Measuring font metrics, line-height & tracking density...' },
      { progress: 95, text: 'Extracting pedagogical exercise module hierarchy...' },
      { progress: 100, text: 'Synthesis complete: Structural DNA cloned.' },
    ];

    telemetrySteps.forEach((step, idx) => {
      setTimeout(() => {
        setScanProgress(step.progress);
        setScanTelemetry(step.text);

        if (idx === telemetrySteps.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            const freshDna: ScannedStyleDna = {
              ...dnaTarget,
              id: 'dna-' + Date.now(),
              sourceName: previewName || dnaTarget.sourceName,
              extractedAt: 'Just now',
            };
            setCurrentResult(freshDna);
            setRecentScans((prev) => [freshDna, ...prev.filter((p) => p.id !== freshDna.id)]);
          }, 500);
        }
      }, (idx + 1) * 450);
    });
  };

  const processFile = (file: File) => {
    if (!file) return;

    // Create a local object URL for preview if it's an image
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setUploadedPreview(url);
    } else {
      setUploadedPreview(null);
    }

    // Pick a complementary sample DNA to customize
    const randomPreset = INITIAL_SCANNED_DNA_LIST[Math.floor(Math.random() * INITIAL_SCANNED_DNA_LIST.length)];
    triggerScanSimulation(randomPreset, file.name);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (isScanning) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div id="visual-structure-scanner" className="flex flex-col h-full space-y-6">
      {/* Header Banner */}
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
              <ScanEye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Visual Structure & Layout Scanner
                </h2>
                <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  OCR DNA ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Clone the visual architecture, typography, and color atmosphere of any physical or digital worksheet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>High-precision grid reconstruction</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Scanner Simulation + Extraction Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Upload Zone & Laser Scanner Simulation) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Dropzone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-2xl border p-6 text-center relative overflow-hidden transition-all duration-300 bg-black/30 interactive-border-card ${
              isDragOver
                ? 'border-cyan-400 bg-cyan-950/40 ring-4 ring-cyan-500/30 scale-[1.01]'
                : isScanning
                ? 'animate-dash-flow border-beam-active'
                : 'hover:border-cyan-400/50'
            }`}
            style={{
              borderColor: isDragOver
                ? '#22d3ee'
                : isScanning
                ? theme.borderFocus
                : theme.borderSubtle,
            }}
          >
            <input
              id="worksheet-file-input"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
              disabled={isScanning}
            />

            {/* Visual Drag Active Overlay Indicator */}
            {isDragOver && (
              <div className="absolute inset-0 z-30 bg-cyan-950/90 backdrop-blur-sm border-2 border-dashed border-cyan-400 rounded-2xl flex flex-col items-center justify-center p-6 space-y-2 pointer-events-none animate-pulse">
                <UploadCloud className="w-12 h-12 text-cyan-300 animate-bounce" />
                <h3 className="text-base font-black text-white tracking-tight">
                  Drop Document to Clone Layout DNA!
                </h3>
                <p className="text-xs text-cyan-200">
                  Release file to start optical layout decomposition
                </p>
              </div>
            )}

            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 text-white shadow-inner"
                style={{ backgroundColor: `${theme.accentPrimary}25` }}
              >
                <UploadCloud className="w-7 h-7 text-cyan-400" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Drag & drop existing worksheet (PDF, PNG, JPG)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  or click to browse local files (Supports up to 25MB documents)
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500 font-mono">
                <span>Auto-detects: Two-Column</span>
                <span>•</span>
                <span>Bento Grids</span>
                <span>•</span>
                <span>Matching Blocks</span>
              </div>
            </div>

            {/* Quick-test Pre-loaded Sample Sheets */}
            <div className="mt-4 pt-4 border-t text-left z-30 relative" style={{ borderColor: theme.borderSubtle }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Or Scan Instant Pre-loaded Curriculum Samples:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {samplePresets.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isScanning}
                    onClick={() => triggerScanSimulation(sample.dna, sample.title)}
                    className="flex flex-col text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-bold text-cyan-300 font-mono">
                        {sample.badge}
                      </span>
                      <FileText className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-white truncate w-full">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">
                      {sample.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scanner Simulation UI Box with Animated Theme Laser */}
          <div
            className={`rounded-2xl border p-5 bg-black/40 relative overflow-hidden min-h-[300px] flex flex-col justify-between transition-all duration-300 ${
              isScanning ? 'border-beam-active shadow-2xl' : ''
            }`}
            style={{
              borderColor: isScanning ? theme.borderFocus : theme.borderSubtle,
            }}
          >
            {/* Corner Reticle Brackets */}
            <div className={`reticle-corner-tl ${isScanning ? 'animate-reticle-pulse' : ''}`} />
            <div className={`reticle-corner-tr ${isScanning ? 'animate-reticle-pulse' : ''}`} />
            <div className={`reticle-corner-bl ${isScanning ? 'animate-reticle-pulse' : ''}`} />
            <div className={`reticle-corner-br ${isScanning ? 'animate-reticle-pulse' : ''}`} />

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-3" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.highlightMint }}
                />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Active Scanner Simulation Stage
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Resolution: 300 DPI Ultra-Clean
              </span>
            </div>

            {/* Document Stage Viewport */}
            <div className={`relative flex-1 rounded-xl border bg-black/80 overflow-hidden flex items-center justify-center p-6 min-h-[220px] transition-all duration-300 ${
              isScanning ? 'animate-border-generating border-cyan-400' : 'border-white/10'
            }`}>
              {/* Simulated Worksheet Document Mock */}
              <div className="w-full max-w-sm rounded-lg border border-white/20 bg-white/5 p-4 text-[10px] text-slate-400 space-y-2.5 shadow-2xl relative select-none">
                <div className="h-3 w-1/3 rounded bg-white/20" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <div className="h-2 rounded bg-white/10" />
                    <div className="h-2 rounded bg-white/10 w-4/5" />
                    <div className="h-2 rounded bg-white/10 w-2/3" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 rounded bg-white/10" />
                    <div className="h-2 rounded bg-white/10 w-3/4" />
                    <div className="h-2 rounded bg-white/10" />
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-1.5">
                  <div className="h-4 rounded bg-cyan-500/20 border border-cyan-400/30" />
                  <div className="h-4 rounded bg-cyan-500/20 border border-cyan-400/30" />
                  <div className="h-4 rounded bg-cyan-500/20 border border-cyan-400/30" />
                </div>
              </div>

              {/* Theme-Styled Animated Laser Sweep Line */}
              {isScanning && (
                <div
                  className="animate-laser absolute left-0 right-0 h-1 shadow-lg pointer-events-none z-30"
                  style={{
                    backgroundColor: theme.highlightMint,
                    boxShadow: `0 0 18px 4px ${theme.highlightMint}`,
                  }}
                />
              )}
            </div>

            {/* Telemetry Progress Status */}
            <div className="mt-3 pt-3 border-t" style={{ borderColor: theme.borderSubtle }}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  {isScanning ? scanTelemetry : `Document Ready: ${currentResult?.sourceName || 'No document loaded'}`}
                </span>
                <span className="font-mono font-bold" style={{ color: theme.highlightMint }}>
                  {isScanning ? `${scanProgress}%` : 'Analysis 100%'}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: isScanning ? `${scanProgress}%` : '100%',
                    background: theme.accentGradient,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Extraction Breakdown Cards & Clone & Apply CTA) - 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {currentResult ? (
            <div className="space-y-4">
              {/* Card 1: Layout Style Breakdown */}
              <div
                className="rounded-2xl border p-4 bg-black/40 shadow-lg space-y-3"
                style={{ borderColor: theme.borderSubtle }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Extracted Layout Architecture
                    </h4>
                  </div>
                  <span className="rounded px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {currentResult.confidence}% MATCH
                  </span>
                </div>

                <div className="rounded-xl border p-3 bg-white/5" style={{ borderColor: theme.borderSubtle }}>
                  <p className="text-sm font-bold text-white">{currentResult.layoutStyle}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Source: <span className="font-mono text-slate-300">{currentResult.sourceName}</span>
                  </p>
                </div>

                {/* Detected Modules list */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                    Detected Structure Modules:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {currentResult.detectedModules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-black/40 px-2 py-1.5 text-[11px] text-slate-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Extracted Color Palette */}
              <div
                className="rounded-2xl border p-4 bg-black/40 shadow-lg space-y-3"
                style={{ borderColor: theme.borderSubtle }}
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Extracted Document Palette
                  </h4>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(currentResult.colorPalette).map(([key, hex]) => (
                    <div
                      key={key}
                      className="flex flex-col items-center rounded-xl border border-white/10 p-2 text-center bg-white/5"
                    >
                      <div
                        className="h-8 w-8 rounded-lg border border-white/20 shadow-inner mb-1.5"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] font-bold capitalize text-slate-300">
                        {key}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 truncate">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Font & Typography Structure */}
              <div
                className="rounded-2xl border p-4 bg-black/40 shadow-lg space-y-2.5"
                style={{ borderColor: theme.borderSubtle }}
              >
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Detected Typography Structure
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] text-slate-400 block">Heading Font</span>
                    <span className="font-semibold text-white truncate block">
                      {currentResult.fontStructure.headingFont.split(',')[0]}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] text-slate-400 block">Body Font</span>
                    <span className="font-semibold text-white truncate block">
                      {currentResult.fontStructure.bodyFont.split(',')[0]}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] text-slate-400 block">Line Height</span>
                    <span className="font-semibold text-white font-mono">
                      {currentResult.fontStructure.lineHeight}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <span className="text-[10px] text-slate-400 block">Rhythmic Density</span>
                    <span className="font-semibold text-cyan-300">
                      {currentResult.fontStructure.density}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA: "Clone & Apply" Workflow Button */}
              <button
                id="clone-and-apply-dna-btn"
                type="button"
                onClick={() => onApplyDna(currentResult)}
                className="group w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 px-4 text-xs font-black uppercase tracking-wider text-white transition-all transform hover:scale-[1.02] cursor-pointer shadow-xl"
                style={{
                  background: theme.accentGradient,
                  boxShadow: theme.accentGlow,
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Clone & Apply Structural DNA</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-slate-400">
              <ScanEye className="w-8 h-8 mx-auto text-slate-500 mb-2" />
              <p className="text-xs">Select or upload a worksheet to extract structural parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans History Carousel */}
      <div className="rounded-2xl border p-5 bg-black/40 space-y-3" style={{ borderColor: theme.borderSubtle }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Recent Scanned DNA Archive
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {recentScans.length} layout profiles cached
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => setCurrentResult(scan)}
              className={`p-3 rounded-xl border transition-all cursor-pointer text-left interactive-border-card ${
                currentResult?.id === scan.id
                  ? 'border-cyan-400 bg-white/10 shadow border-beam-active'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-cyan-300">
                  {scan.layoutStyle}
                </span>
                <span className="text-[9px] text-slate-400">{scan.extractedAt}</span>
              </div>
              <p className="text-xs font-bold text-white truncate">{scan.sourceName}</p>
              <div className="flex items-center gap-1 mt-2">
                {Object.values(scan.colorPalette).map((c, i) => (
                  <div
                    key={i}
                    className="h-2.5 w-5 rounded-sm border border-white/20"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
