import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { useTheme } from '../context/ThemeContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { isDark } = useTheme();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:from-sky-400 hover:to-cyan-400 transition-all cursor-pointer border border-white/20 active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install Phone App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
            isDark
              ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-sm'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-500" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-sky-500" />
                  <h3 className="text-base font-bold">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-lg p-1 hover:bg-slate-500/20 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-400">
                <p>To run LexiLens as a standalone app on your iPhone home screen:</p>
                <ol className="list-decimal list-inside space-y-2 font-medium text-slate-300">
                  <li>Tap the <strong className="text-sky-400">Share</strong> icon in your Safari browser bar.</li>
                  <li>Scroll down the share sheet and tap <strong className="text-sky-400">Add to Home Screen</strong>.</li>
                  <li>Tap <strong className="text-sky-400">Add</strong> in the top-right corner.</li>
                </ol>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-sky-500 py-2.5 text-xs font-bold text-white hover:bg-sky-400 transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      onClick={() => {
        alert("To install on your phone:\n1. Push your code to GitHub\n2. Deploy to Vercel/Netlify/Cloud Run or open the Shared URL on your phone browser\n3. Tap 'Add to Home Screen' in your mobile browser menu!");
      }}
      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
        isDark
          ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
      }`}
      title="Install on Mobile Phone"
    >
      <Smartphone className="w-3.5 h-3.5 text-sky-500" />
      <span className="hidden sm:inline">Phone App Ready</span>
    </button>
  );
};
