import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '../utils/useSpeechRecognition';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  appendMode?: boolean;
  value?: string;
  className?: string;
  buttonText?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  appendMode = false,
  value = '',
  className = '',
  buttonText,
  size = 'md',
  title = 'Speak to type using microphone',
}) => {
  const { isSupported, isListening, startListening, stopListening, error } =
    useSpeechRecognition();

  const [localLiveText, setLocalLiveText] = useState('');

  const handleToggle = () => {
    if (!isSupported) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      setLocalLiveText('');
      startListening({
        continuous: true,
        onResult: (latestText) => {
          setLocalLiveText(latestText);
          if (appendMode) {
            const combined = value ? `${value} ${latestText}` : latestText;
            onTranscript(combined);
          } else {
            onTranscript(latestText);
          }
        },
      });
    }
  };

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  const padding = size === 'sm' ? 'px-2 py-1' : size === 'lg' ? 'px-4 py-2.5' : 'px-3 py-1.5';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        title={title}
        className={`flex items-center gap-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm select-none ${
          isListening
            ? 'border-rose-500 bg-rose-950/90 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
            : 'border-white/15 bg-black/40 text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-black/60'
        } ${padding} ${className}`}
      >
        {isListening ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <MicOff className={`${iconSize} text-rose-400`} />
            <span>{buttonText || 'Listening...'}</span>
          </>
        ) : (
          <>
            <Mic className={`${iconSize} text-cyan-400`} />
            {buttonText && <span>{buttonText}</span>}
          </>
        )}
      </button>

      {/* Live speech toast floating indicator */}
      {isListening && localLiveText && (
        <div className="absolute bottom-full mb-2 left-0 z-50 min-w-[200px] max-w-[280px] p-2.5 rounded-xl bg-slate-900/95 border border-cyan-400/50 text-cyan-200 text-[11px] shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-1.5 font-semibold text-[10px] uppercase text-cyan-400 mb-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Transcribing Speech:</span>
          </div>
          <p className="italic font-mono leading-tight">"{localLiveText}"</p>
        </div>
      )}

      {/* Error notification if mic access fails */}
      {error && !isListening && (
        <div className="absolute top-full mt-1 left-0 z-50 p-2 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-200 text-[10px] shadow-lg max-w-[220px]">
          {error}
        </div>
      )}
    </div>
  );
};
