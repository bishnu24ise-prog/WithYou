'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  HelpCircle,
  Loader2,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { GNANI_LANGUAGES, GnaniLanguage } from '@/lib/gnani';
import { Button } from '@/components/ui/button';
import { convertAudioBlobToWav } from '@/lib/audio-converter';

export function GnaniVoiceGuide() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [guidance, setGuidance] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    running: boolean;
    data?: any;
    error?: string;
  } | null>(null);

  const runGnaniSelfTest = async () => {
    setTestResult({ running: true });
    try {
      const res = await fetch('/api/gnani/test');
      const json = await res.json();
      if (res.ok && json.overallStatus === 'ALL_SYSTEMS_OPERATIONAL') {
        setTestResult({ running: false, data: json });
      } else {
        setTestResult({ running: false, error: json.error || 'Test failed' });
      }
    } catch (err: any) {
      setTestResult({ running: false, error: err.message || 'Network error' });
    }
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on unmount or close
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    };
  }, []);

  const currentLangObj =
    GNANI_LANGUAGES.find((l) => l.code === selectedLang) || GNANI_LANGUAGES[0];

  const handleAskGuidance = async (customCommand?: string) => {
    setIsLoading(true);
    setTranscript(customCommand || 'What am I supposed to do on this page?');

    try {
      const res = await fetch('/api/gnani/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: customCommand || 'What am I supposed to do on this page?',
          page: pathname,
          language: selectedLang,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGuidance(data.guidanceText);

        if (data.audioBase64) {
          const audioBlob = b64toBlob(data.audioBase64, 'audio/wav');
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          playAudio(url);
        }
      }
    } catch (err) {
      console.error('Failed to get voice guidance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    setTranscript('');
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
        setIsLoading(true);
        try {
          const rawBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
          const wavBlob = await convertAudioBlobToWav(rawBlob);
          await handleAudioUpload(wavBlob);
        } catch (err) {
          console.error('Audio processing error:', err);
          await handleAskGuidance('What should I do here?');
        } finally {
          stream.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is needed for Gnani AI voice commands.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio_file', blob, 'speech.wav');
      formData.append('language_code', selectedLang);

      const sttRes = await fetch('/api/gnani/stt', {
        method: 'POST',
        body: formData,
      });

      const sttData = await sttRes.json();
      if (sttData.success && sttData.transcript) {
        setTranscript(sttData.transcript);
        await handleAskGuidance(sttData.transcript);
      } else {
        setTranscript('Voice captured (silent or unclear). Dictating default guide.');
        await handleAskGuidance('What should I do here?');
      }
    } catch (err) {
      console.error('STT failed:', err);
      await handleAskGuidance('What should I do here?');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (url: string) => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    const audio = new Audio(url);
    audioElementRef.current = audio;
    setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
    audio.play().catch((e) => console.warn('Audio playback error:', e));
  };

  const stopAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && !guidance) {
              handleAskGuidance();
            }
          }}
          className="group relative flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-rani via-saffron to-peacock text-white font-semibold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          title="Gnani AI Multi-lingual Voice Guide"
        >
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
          </span>
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm tracking-wide hidden sm:inline">
            {isOpen ? 'Close Guide' : 'Voice Guide (Gnani AI)'}
          </span>
        </button>
      </div>

      {/* Voice Guide Panel Modal */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-18 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-[420px] max-w-[calc(100vw-1.5rem)] max-h-[82vh] overflow-y-auto z-50 bg-[#1A0B2E]/95 backdrop-blur-xl border border-rani/40 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-rani/20 text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rani/20 rounded-xl text-rani border border-rani/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white">
                  Gnani AI Voice Companion
                </h3>
                <p className="text-[11px] text-zinc-300">
                  Prisma v3.0 STT & Timbre v2.5 TTS
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                stopAudio();
                setIsOpen(false);
              }}
              className="text-zinc-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Language Selector */}
          <div className="mt-3 flex items-center justify-between gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 pl-1">
              <Languages className="h-4 w-4 text-saffron" />
              <span>Language:</span>
            </div>
            <select
              value={selectedLang}
              onChange={(e) => {
                const newLang = e.target.value;
                setSelectedLang(newLang);
                handleAskGuidance();
              }}
              className="bg-black/60 text-white text-xs font-medium rounded-xl px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-rani"
            >
              {GNANI_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Guidance Audio Display */}
          <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 min-h-[120px] flex flex-col justify-between">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-zinc-300 text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-rani" />
                <span>Generating voice guidance with Gnani AI...</span>
              </div>
            ) : guidance ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-saffron">
                    Audio Dictation ({currentLangObj.nativeName})
                  </span>
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <button
                        onClick={stopAudio}
                        className="flex items-center gap-1 text-[11px] bg-rani/30 text-white px-2.5 py-1 rounded-full border border-rani/50 hover:bg-rani/50 transition"
                      >
                        <VolumeX className="h-3.5 w-3.5" /> Pause
                      </button>
                    ) : audioUrl ? (
                      <button
                        onClick={() => playAudio(audioUrl)}
                        className="flex items-center gap-1 text-[11px] bg-peacock/30 text-white px-2.5 py-1 rounded-full border border-peacock/50 hover:bg-peacock/50 transition"
                      >
                        <Play className="h-3.5 w-3.5" /> Replay
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-zinc-200">
                  {guidance}
                </p>
                {transcript && (
                  <p className="mt-2 text-[10px] text-zinc-300 italic border-t border-white/5 pt-1">
                    Heard: "{transcript}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-300 text-xs">
                Tap the microphone or "What to do here?" to receive dictated guidance in {currentLangObj.nativeName}.
              </div>
            )}
          </div>

          {/* Live API Health & Diagnostics */}
          <div className="mt-3">
            <button
              onClick={runGnaniSelfTest}
              disabled={testResult?.running}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 transition"
            >
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-peacock" />
                <span>Diagnostic Test: Gnani AI (STT + TTS)</span>
              </div>
              <span className="font-semibold text-rani">
                {testResult?.running ? 'Testing...' : 'Run Test →'}
              </span>
            </button>

            {testResult?.running && (
              <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-xs text-zinc-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-peacock" />
                <span>Contacting api.vachana.ai (testing Timbre v2.5 & Prisma v3.0)...</span>
              </div>
            )}

            {testResult?.data && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Gnani AI 100% Operational ({testResult.data.totalLatencyMs}ms)</span>
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  • TTS: {testResult.data.tts?.model} ({testResult.data.tts?.audioBytes} bytes, {testResult.data.tts?.durationMs}ms)
                  <br />
                  • STT: {testResult.data.stt?.model} (Transcribed: "{testResult.data.stt?.transcribedText}", {testResult.data.stt?.durationMs}ms)
                </div>
              </div>
            )}

            {testResult?.error && (
              <div className="mt-2 p-2.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-[11px] flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Gnani Test Notice: {testResult.error}</span>
              </div>
            )}
          </div>

          {/* Actions & Mic Controls */}
          <div className="mt-3 flex items-center gap-3">
            <Button
              onClick={() => handleAskGuidance()}
              disabled={isLoading || isRecording}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 rounded-2xl py-5"
            >
              <HelpCircle className="h-4 w-4 mr-1.5 text-peacock" />
              What to do here?
            </Button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-400/50'
                  : 'bg-gradient-to-r from-rani to-saffron text-white hover:scale-105 active:scale-95 shadow-lg'
              }`}
              title={isRecording ? 'Tap to Stop Recording' : 'Tap to Speak (Voice Command)'}
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-zinc-300">
              {isRecording
                ? 'Listening in ' + currentLangObj.nativeName + '... Tap mic again to transcribe.'
                : 'Speak in Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, or English'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

