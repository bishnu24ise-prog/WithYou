'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { GNANI_LANGUAGES } from '@/lib/gnani';

interface GnaniAudioPlayerButtonProps {
  text: string;
  defaultLang?: string;
  className?: string;
}

export function GnaniAudioPlayerButton({
  text,
  defaultLang = 'hi-IN',
  className = '',
}: GnaniAudioPlayerButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState(defaultLang);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/gnani/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: selectedLang,
          voice: 'Nalini',
          speed: 1.0,
        }),
      });

      if (!res.ok) {
        throw new Error(`TTS failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      setIsPlaying(true);

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);

      await audio.play();
    } catch (err) {
      console.error('Gnani TTS error:', err);
      alert('Could not synthesize speech audio. Please check network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        disabled={isLoading || isPlaying}
        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-md px-1.5 py-0.5 focus:outline-none"
        title="Select Voice Language"
      >
        {GNANI_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleTogglePlay}
        disabled={isLoading}
        className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
          isPlaying
            ? 'bg-rani/20 text-rani border border-rani/40 animate-pulse'
            : isLoading
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-wait'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
        }`}
        title={isPlaying ? 'Pause Speech' : 'Listen with Gnani AI'}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin text-rani" />
            <span>Loading...</span>
          </>
        ) : isPlaying ? (
          <>
            <VolumeX className="h-3 w-3 text-rani" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Volume2 className="h-3 w-3 text-burgundy-300" />
            <span>Listen (Gnani AI)</span>
          </>
        )}
      </button>
    </div>
  );
}

