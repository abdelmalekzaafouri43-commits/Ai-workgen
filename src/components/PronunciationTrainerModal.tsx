import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  X,
  Sparkles,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  VolumeX,
} from 'lucide-react';
import { useSpeechRecognition, evaluatePronunciation, PronunciationScore } from '../utils/useSpeechRecognition';
import { useTheme } from '../context/ThemeContext';

interface PronunciationTrainerModalProps {
  targetWord: string;
  phonetic?: string;
  contextSentence?: string;
  onClose: () => void;
}

export const PronunciationTrainerModal: React.FC<PronunciationTrainerModalProps> = ({
  targetWord,
  phonetic,
  contextSentence,
  onClose,
}) => {
  const { theme } = useTheme();
  const { isSupported, isListening, startListening, stopListening, error } = useSpeechRecognition();

  const [spokenText, setSpokenText] = useState('');
  const [evaluation, setEvaluation] = useState<PronunciationScore | null>(null);
  const [isPlayingNativeAudio, setIsPlayingNativeAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.9);

  // Native speech synthesis model
  const handlePlayNativeAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlayingNativeAudio) {
      setIsPlayingNativeAudio(false);
      return;
    }

    const textToSpeak = targetWord;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = audioSpeed;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onend = () => setIsPlayingNativeAudio(false);
    utterance.onerror = () => setIsPlayingNativeAudio(false);

    setIsPlayingNativeAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Start microphone recording and evaluate speech on result
  const handleRecordVoice = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setSpokenText('');
      setEvaluation(null);

      startListening({
        continuous: false,
        onResult: (text) => {
          setSpokenText(text);
          const scoreResult = evaluatePronunciation(text, targetWord);
          setEvaluation(scoreResult);
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-6 relative overflow-hidden"
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
          className="absolute top-4 right-4 p-1.5 rounded-full border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-2.5 border-b pb-4" style={{ borderColor: theme.borderSubtle }}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md"
            style={{ background: theme.accentGradient }}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              AI Pronunciation Practice Lab
            </h3>
            <p className="text-xs text-cyan-300">
              Listen to native audio & practice speaking with instant voice AI feedback
            </p>
          </div>
        </div>

        {/* Target Word Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-black/40 p-5 text-center space-y-2 relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
            Target Lexicon / Phrase
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            "{targetWord}"
          </h2>
          {phonetic && (
            <p className="text-sm font-mono text-cyan-300/80">{phonetic}</p>
          )}

          {contextSentence && (
            <p className="text-xs text-slate-300 italic pt-2 border-t border-white/10">
              "{contextSentence}"
            </p>
          )}

          {/* Native Audio Model Controls */}
          <div className="pt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handlePlayNativeAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isPlayingNativeAudio
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-white/20 bg-white/10 text-white hover:border-cyan-400 hover:bg-white/20'
              }`}
            >
              {isPlayingNativeAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span>{isPlayingNativeAudio ? 'Stop Native Audio' : 'Listen Native Speaker'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAudioSpeed(audioSpeed === 0.9 ? 0.65 : 0.9)}
              className="px-2.5 py-1.5 rounded-xl border border-white/10 bg-black/30 text-[11px] font-mono font-bold text-slate-300 hover:text-white"
              title="Toggle Slow / Normal Native Speed"
            >
              {audioSpeed === 0.65 ? '🐢 0.65x Slow' : '⚡ 0.9x Normal'}
            </button>
          </div>
        </div>

        {/* Microphone Interactive Recording Stage */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleRecordVoice}
              className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all cursor-pointer shadow-xl ${
                isListening
                  ? 'border-rose-500 bg-rose-950/90 text-rose-300 animate-pulse ring-8 ring-rose-500/30'
                  : 'border-cyan-400/80 bg-cyan-950/60 text-cyan-300 hover:scale-105 hover:border-cyan-300'
              }`}
            >
              {isListening ? (
                <Mic className="w-9 h-9 animate-bounce text-rose-400" />
              ) : (
                <Mic className="w-9 h-9 text-cyan-300" />
              )}
            </button>

            <span className="block text-xs font-bold text-slate-300">
              {isListening ? '🎙️ Listening... Speak clearly now!' : 'Tap Microphone & Speak Target Word'}
            </span>
          </div>

          {/* Live Transcript Display */}
          {spokenText && (
            <div className="rounded-xl border border-white/10 bg-black/50 p-3 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Speech AI Recognized:
              </span>
              <p className="text-sm font-mono font-semibold text-cyan-200">"{spokenText}"</p>
            </div>
          )}

          {/* Feedback & Score Evaluation Result */}
          {evaluation && (
            <div
              className={`rounded-xl border p-4 space-y-3 animate-in fade-in zoom-in-95 ${
                evaluation.score >= 80
                  ? 'border-emerald-500/50 bg-emerald-950/40'
                  : evaluation.score >= 50
                  ? 'border-amber-500/50 bg-amber-950/40'
                  : 'border-rose-500/50 bg-rose-950/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award
                    className={`w-5 h-5 ${
                      evaluation.score >= 80
                        ? 'text-emerald-400'
                        : evaluation.score >= 50
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-white">{evaluation.label}</h4>
                    <p className="text-[10px] text-slate-300">Accuracy Score: {evaluation.score}%</p>
                  </div>
                </div>
                <span className="text-lg font-black font-mono text-white">{evaluation.score}%</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${evaluation.score}%`,
                    backgroundColor:
                      evaluation.score >= 80 ? '#10b981' : evaluation.score >= 50 ? '#f59e0b' : '#f43f5e',
                  }}
                />
              </div>

              {/* Matched Words & Needs Work Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded-lg bg-black/30 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3 h-3" /> Matched Phonemes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.matchedWords.length > 0 ? (
                      evaluation.matchedWords.map((w, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                          {w}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[10px]">None matched</span>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-black/30 border border-amber-500/20">
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3 h-3" /> Practice Needed:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.missingWords.length > 0 ? (
                      evaluation.missingWords.map((w, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                          {w}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-400 font-bold text-[10px]">Perfect Match!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/60 text-rose-200 text-xs text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.borderSubtle }}>
          <button
            type="button"
            onClick={() => {
              setSpokenText('');
              setEvaluation(null);
            }}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Attempt</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
