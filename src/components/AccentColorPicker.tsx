import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette, RotateCcw, Check, Sparkles, Sliders } from 'lucide-react';

const PRESET_ACCENT_COLORS = [
  { name: 'Sky Azure', hex: '#0284c7' },
  { name: 'Neon Cyan', hex: '#06b6d4' },
  { name: 'Ocean Sapphire', hex: '#2563eb' },
  { name: 'Royal Indigo', hex: '#6366f1' },
  { name: 'Amethyst Violet', hex: '#9333ea' },
  { name: 'Cosmic Pink', hex: '#ec4899' },
  { name: 'Sunset Crimson', hex: '#f43f5e' },
  { name: 'Coral Orange', hex: '#f97316' },
  { name: 'Amber Gold', hex: '#f59e0b' },
  { name: 'Emerald Mint', hex: '#10b981' },
];

export const AccentColorPicker: React.FC = () => {
  const { theme, customAccentColor, setCustomAccentColor, resetAccentColor } = useTheme();

  const currentAccent = customAccentColor || theme.accentPrimary;
  const [hexInput, setHexInput] = useState(currentAccent);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setCustomAccentColor(val);
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setHexInput(color);
    setCustomAccentColor(color);
  };

  const handlePresetSelect = (hex: string) => {
    setHexInput(hex);
    setCustomAccentColor(hex);
  };

  return (
    <div
      id="accent-color-picker-panel"
      className="rounded-2xl border p-5 bg-black/40 shadow-lg space-y-4 transition-all"
      style={{ borderColor: theme.borderSubtle }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" style={{ color: currentAccent }} />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Workspace Accent Primary Color
          </h4>
        </div>

        {customAccentColor && (
          <button
            type="button"
            onClick={() => {
              resetAccentColor();
              setHexInput(theme.accentPrimary);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset to active theme default accent color"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Dynamically customize the primary accent color across buttons, glows, focus rings, and active UI highlights.
      </p>

      {/* Preset Swatches */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Preset Palettes
        </label>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {PRESET_ACCENT_COLORS.map((preset) => {
            const isSelected = currentAccent.toLowerCase() === preset.hex.toLowerCase();
            return (
              <button
                key={preset.hex}
                type="button"
                onClick={() => handlePresetSelect(preset.hex)}
                title={`${preset.name} (${preset.hex})`}
                className={`relative group flex h-8 w-full items-center justify-center rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'scale-110 ring-2 ring-white shadow-lg z-10'
                    : 'hover:scale-105 hover:border-white/40'
                }`}
                style={{
                  backgroundColor: preset.hex,
                  borderColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.2)',
                }}
              >
                {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Input & Color Picker */}
      <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Native HTML5 Color Swatch */}
          <div className="relative flex items-center justify-center shrink-0">
            <input
              type="color"
              value={currentAccent}
              onChange={handleColorPickerChange}
              aria-label="Pick custom accent primary color"
              className="h-10 w-10 cursor-pointer rounded-xl border border-white/20 bg-transparent p-0.5 shadow transition-transform hover:scale-105"
            />
          </div>

          {/* Hex Input */}
          <div className="flex-1 sm:w-40">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Custom HEX Code
            </label>
            <div className="relative">
              <input
                type="text"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#0284c7"
                maxLength={7}
                className="w-full rounded-xl border px-3 py-1.5 text-xs font-mono text-white bg-black/60 focus:outline-none uppercase"
                style={{ borderColor: theme.borderFocus }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Live Button Preview */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Live Preview
            </span>
            <span className="text-[11px] font-mono text-cyan-300">{currentAccent}</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-transform hover:scale-105 select-none cursor-pointer"
            style={{
              background: theme.accentGradient,
              boxShadow: theme.accentGlow,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Accent</span>
          </button>
        </div>
      </div>
    </div>
  );
};
