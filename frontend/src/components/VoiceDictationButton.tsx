'use client';

import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { GNANI_LANGUAGES } from '@/lib/gnani';
import { convertAudioBlobToWav } from '@/lib/audio-converter';
import { useTranslations } from 'next-intl';

interface VoiceDictationButtonProps {
  onTranscribed: (text: string) => void;
  language?: string;
  className?: string;
  buttonText?: string;
}

export function VoiceDictationButton({
  onTranscribed,
  language = 'hi-IN',
  className = '',
  buttonText = 'Speak to Type (Gnani AI)',
}: VoiceDictationButtonProps) {
  const t = useTranslations('audio');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        try {
          const rawBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          const wavBlob = await convertAudioBlobToWav(rawBlob);
          await handleTranscribe(wavBlob);
        } catch (err) {
          console.error('Audio processing error:', err);
          setIsTranscribing(false);
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required for voice typing.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', blob, 'speech.wav');
      formData.append('language_code', selectedLang);

      const res = await fetch('/api/gnani/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.transcript) {
        onTranscribed(data.transcript);
      } else {
        alert('Could not detect speech. Please try speaking clearly into the microphone.');
      }
    } catch (err) {
      console.error('Gnani STT error:', err);
      alert('Voice transcription failed. Please check your network.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const currentLangObj =
    GNANI_LANGUAGES.find((l) => l.code === selectedLang) || GNANI_LANGUAGES[0];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        disabled={isRecording || isTranscribing}
        className="text-[11px] bg-black/40 text-zinc-200 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-rani"
        title="Select Spoken Language"
      >
        {GNANI_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
          isRecording
            ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
            : isTranscribing
            ? 'bg-rani/20 text-rani border-rani/40 cursor-wait'
            : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10 hover:border-rani/40'
        }`}
        title="Dictate with Gnani AI"
      >
        {isTranscribing ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-rani" />
            <span>{t('transcribing')}</span>
          </>
        ) : isRecording ? (
          <>
            <MicOff className="h-3.5 w-3.5 text-red-400 animate-bounce" />
            <span>{t('stop')} ({currentLangObj.nativeName})</span>
          </>
        ) : (
          <>
            <Mic className="h-3.5 w-3.5 text-saffron" />
            <span>{buttonText}</span>
          </>
        )}
      </button>
    </div>
  );
}

