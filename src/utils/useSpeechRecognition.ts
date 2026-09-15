import { useState, useEffect, useRef, useCallback } from 'react';

// Type definitions for Web Speech API SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export interface PronunciationScore {
  score: number; // 0 - 100
  label: string; // "Perfect", "Great", "Good", "Needs Practice"
  spokenText: string;
  targetText: string;
  matchedWords: string[];
  missingWords: string[];
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onResultCallbackRef = useRef<((text: string) => void) | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Safe catch if already stopped
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (options?: {
      lang?: string;
      onResult?: (text: string) => void;
      continuous?: boolean;
    }) => {
      setError(null);

      if (!isSupported) {
        setError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.');
        return;
      }

      if (isListening) {
        stopListening();
        return;
      }

      try {
        const SpeechRecognitionClass =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognitionClass) {
          setError('Speech recognition engine unavailable');
          return;
        }

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = options?.continuous ?? false;
        recognition.interimResults = true;
        recognition.lang = options?.lang || 'en-US';

        if (options?.onResult) {
          onResultCallbackRef.current = options.onResult;
        } else {
          onResultCallbackRef.current = null;
        }

        recognition.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }

          setTranscript(currentTranscript);

          if (onResultCallbackRef.current) {
            onResultCallbackRef.current(currentTranscript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            setError('Microphone access was denied. Please allow microphone permissions in your browser settings.');
          } else if (event.error === 'no-speech') {
            setError('No speech was detected. Please try speaking closer to your microphone.');
          } else {
            setError(`Speech recognition error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start speech recognition:', err);
        setError('Could not access microphone: ' + (err?.message || 'Unknown error'));
        setIsListening(false);
      }
    },
    [isSupported, isListening, stopListening]
  );

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // cleanup
        }
      }
    };
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript: () => setTranscript(''),
  };
}

/**
 * Calculates pronunciation similarity score between target string and spoken string.
 */
export function evaluatePronunciation(spoken: string, target: string): PronunciationScore {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim();

  const spokenClean = clean(spoken);
  const targetClean = clean(target);

  if (!spokenClean || !targetClean) {
    return {
      score: 0,
      label: 'No Speech Detected',
      spokenText: spoken,
      targetText: target,
      matchedWords: [],
      missingWords: targetClean ? targetClean.split(/\s+/) : [],
    };
  }

  const targetWords = targetClean.split(/\s+/).filter(Boolean);
  const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

  const matchedWords: string[] = [];
  const missingWords: string[] = [];

  targetWords.forEach((tw) => {
    if (spokenWords.some((sw) => sw === tw || levenshteinDistance(sw, tw) <= 1)) {
      matchedWords.push(tw);
    } else {
      missingWords.push(tw);
    }
  });

  const accuracy = Math.min(100, Math.round((matchedWords.length / Math.max(1, targetWords.length)) * 100));

  let label = 'Needs Practice 🎯';
  if (accuracy >= 90) label = 'Excellent Pronunciation! 🌟';
  else if (accuracy >= 75) label = 'Great Effort! 👍';
  else if (accuracy >= 50) label = 'Good Attempt 😊';

  return {
    score: accuracy,
    label,
    spokenText: spoken,
    targetText: target,
    matchedWords,
    missingWords,
  };
}

// Levenshtein edit distance helper for subtle fuzzy match
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
