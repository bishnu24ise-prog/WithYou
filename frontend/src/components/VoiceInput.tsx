'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Volume2, ShieldAlert } from 'lucide-react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useTranslations } from 'next-intl';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
  className?: string;
  showWarning?: boolean;
  buttonSize?: 'sm' | 'md' | 'lg';
}

export default function VoiceInput({
  onTranscript,
  language,
  className = '',
  showWarning = false,
  buttonSize = 'md',
}: VoiceInputProps) {
  const t = useTranslations('voice');
  const [hasSeenWarning, setHasSeenWarning] = useState(false);

  const { isRecording, isTranscribing, toggleListening, error } = useVoiceAgent({
    language,
    onTranscript: (text) => {
      onTranscript(text);
    },
  });

  const sizeClasses = {
    sm: 'w-9 h-9 p-1.5',
    md: 'w-11 h-11 p-2.5',
    lg: 'w-14 h-14 p-3.5',
  };

  const handleClick = () => {
    if (!hasSeenWarning) {
      setHasSeenWarning(true);
    }
    toggleListening();
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isTranscribing}
        className={`rounded-2xl flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rani min-w-[44px] min-h-[44px] ${
          sizeClasses[buttonSize]
        } ${
          isRecording
            ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
            : isTranscribing
            ? 'bg-amber-500 text-white'
            : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
        }`}
        title={isRecording ? t('listening') : t('micTooltip')}
        aria-label={isRecording ? t('listening') : t('micTooltip')}
      >
        {isTranscribing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <Mic className="w-5 h-5 text-white animate-bounce" />
        ) : (
          <Mic className="w-5 h-5 text-rani" />
        )}
      </button>

      {/* Recording live waveform badge */}
      {isRecording && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
        </span>
      )}

      {/* Gentle safety notice on first mic activation */}
      {showWarning && hasSeenWarning && isRecording && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 rounded-xl p-2 text-[11px] text-amber-900 dark:text-amber-200 shadow-lg z-30 pointer-events-none animate-in fade-in flex items-start gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{t('voiceWarning')}</span>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="absolute top-full mt-1.5 left-0 w-56 bg-rose-50 dark:bg-rose-950 border border-rose-200 text-rose-700 dark:text-rose-200 rounded-lg p-1.5 text-[10px] z-30 shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}

