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
  ShieldAlert,
  BookOpen,
  AlertTriangle,
  ImageOff,
  MapPin,
} from 'lucide-react';
import { GNANI_LANGUAGES, GnaniLanguage } from '@/lib/gnani';
import { Button } from '@/components/ui/button';
import { convertAudioBlobToWav } from '@/lib/audio-converter';

const GNANI_DIRECT_KEY =
  process.env.NEXT_PUBLIC_GNANI_API_KEY ||
  'vach_1ytE2CY5X2Ou0P0yPaoQaijATV9H6AC2vDsQtS8dgXk6mUiO7nosR3zooCkBJT8SN5B5fkX50nyMP5eYFaAnn4ot8qELeVUd_463065025f61f6385cdda8592c2c37b4';

async function fetchDirectGnaniTTS(text: string, lang: string): Promise<string> {
  const cleanText = text.slice(0, 400).trim();
  const res = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key-ID': GNANI_DIRECT_KEY,
    },
    body: JSON.stringify({
      text: cleanText,
      voice: 'Nalini',
      model: 'timbre-v2.5',
      language: lang,
      speed: 1.0,
      audio_config: {
        sample_rate: 24000,
        num_channels: 1,
        sample_width: 2,
        encoding: 'linear_pcm',
        container: 'wav',
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Direct Gnani TTS HTTP ${res.status}`);
  }
  const buf = await res.arrayBuffer();
  const blob = new Blob([buf], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

export function GnaniVoiceGuide() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [guidance, setGuidance] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    running: boolean;
    data?: any;
    error?: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const currentLangObj =
    GNANI_LANGUAGES.find((l) => l.code === selectedLang) || GNANI_LANGUAGES[0];

  // Prime/unlock audio context within user gesture
  const primeAudioContext = () => {
    if (audioElementRef.current) {
      audioElementRef.current.load();
    }
  };

  // Browser SpeechSynthesis fallback if server TTS has no audio
  const speakWithBrowserVoice = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Browser speech synthesis error:', e);
    }
  };

  const playAudio = async (url: string) => {
    if (!audioElementRef.current) return;
    try {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      audioElementRef.current.pause();
      audioElementRef.current.src = url;
      audioElementRef.current.currentTime = 0;
      setAutoplayBlocked(false);
      setIsPlaying(true);
      await audioElementRef.current.play();
    } catch (err: any) {
      console.warn('Autoplay restricted by browser policy:', err);
      setIsPlaying(false);
      setAutoplayBlocked(true);
    }
  };

  const stopAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleAskGuidance = async (customCommand?: string) => {
    primeAudioContext();
    setIsLoading(true);
    setAutoplayBlocked(false);
    const query = customCommand || 'How to use this page?';
    setTranscript(query);

    try {
      const res = await fetch('/api/gnani/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: query,
          page: pathname,
          language: selectedLang,
        }),
      });

      const data = await res.json();
      if (data.success && data.guidanceText) {
        setGuidance(data.guidanceText);

        if (data.audioBase64) {
          const audioBlob = b64toBlob(data.audioBase64, 'audio/wav');
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          await playAudio(url);
        } else {
          // Direct client synthesis via Gnani Timbre v2.5
          try {
            const directUrl = await fetchDirectGnaniTTS(data.guidanceText, selectedLang);
            setAudioUrl(directUrl);
            await playAudio(directUrl);
          } catch (gnaniErr) {
            console.warn('Direct Gnani TTS fallback to browser voice:', gnaniErr);
            speakWithBrowserVoice(data.guidanceText, selectedLang);
          }
        }
      }
    } catch (err) {
      console.error('Failed to get voice guidance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    primeAudioContext();
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
          const rawBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/webm',
          });
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
        setTranscript('Voice captured. Reading page guide aloud:');
        await handleAskGuidance('What should I do here?');
      }
    } catch (err) {
      console.error('STT failed:', err);
      await handleAskGuidance('What should I do here?');
    } finally {
      setIsLoading(false);
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

  return (
    <>
      {/* Hidden DOM Audio Element with explicit handlers */}
      <audio
        ref={audioElementRef}
        playsInline
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Floating Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            primeAudioContext();
            setIsOpen(!isOpen);
            if (!isOpen && !guidance) {
              handleAskGuidance();
            }
          }}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-rani via-burgundy-400 to-burgundy-300 text-white font-semibold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
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
        <div className="fixed inset-x-3 bottom-18 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-[430px] max-w-[calc(100vw-1.5rem)] max-h-[85vh] overflow-y-auto z-50 bg-burgundy-900/95 backdrop-blur-xl border border-rani/40 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-rani/20 text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rani/20 rounded-xl text-rani border border-rani/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                  Gnani AI Voice Guide
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-normal border border-emerald-500/30">
                    Live Spoken Voice
                  </span>
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
              <Languages className="h-4 w-4 text-burgundy-300" />
              <span>Spoken Language:</span>
            </div>
            <select
              value={selectedLang}
              onChange={(e) => {
                primeAudioContext();
                const newLang = e.target.value;
                setSelectedLang(newLang);
                setTimeout(() => handleAskGuidance(), 50);
              }}
              className="bg-black/60 text-white text-xs font-medium rounded-xl px-2.5 py-1.5 border border-white/20 focus:outline-none focus:border-rani cursor-pointer"
            >
              {GNANI_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Active Audio Playback Equalizer Banner */}
          {isPlaying && (
            <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-burgundy-500/20 border border-burgundy-400/40 text-beige-100 text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="flex gap-1 items-end h-3.5">
                  <span className="w-1 bg-burgundy-400 animate-[pulse_0.6s_ease-in-out_infinite] rounded-full h-3"></span>
                  <span className="w-1 bg-beige-300 animate-[pulse_0.8s_ease-in-out_infinite_150ms] rounded-full h-4"></span>
                  <span className="w-1 bg-rani animate-[pulse_0.5s_ease-in-out_infinite_300ms] rounded-full h-2"></span>
                  <span className="w-1 bg-burgundy-300 animate-[pulse_0.7s_ease-in-out_infinite_200ms] rounded-full h-3.5"></span>
                </span>
                <span className="text-xs font-semibold text-beige-200">
                  Reading aloud in {currentLangObj.nativeName}...
                </span>
              </div>
              <button
                onClick={stopAudio}
                className="text-[11px] bg-red-500/20 hover:bg-red-500/40 text-red-200 px-2 py-0.5 rounded-lg border border-red-500/30 transition flex items-center gap-1"
              >
                <VolumeX className="h-3 w-3" /> Stop
              </button>
            </div>
          )}

          {/* Guidance Audio & Text Display */}
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 min-h-[120px] flex flex-col justify-between">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-zinc-300 text-xs">
                <Loader2 className="h-6 w-6 animate-spin text-rani" />
                <span>Synthesizing voice guidance with Gnani AI Timbre v2.5...</span>
              </div>
            ) : guidance ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-burgundy-300 flex items-center gap-1">
                    <Volume2 className="h-3.5 w-3.5" />
                    Spoken Guide ({currentLangObj.nativeName})
                  </span>
                  <div className="flex items-center gap-1.5">
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
                        className="flex items-center gap-1 text-[11px] bg-burgundy-400/40 text-white px-2.5 py-1 rounded-full border border-burgundy-300/60 hover:bg-burgundy-400/60 transition"
                      >
                        <Play className="h-3.5 w-3.5" /> Play Aloud
                      </button>
                    ) : (
                      <button
                        onClick={() => speakWithBrowserVoice(guidance, selectedLang)}
                        className="flex items-center gap-1 text-[11px] bg-burgundy-400/40 text-white px-2.5 py-1 rounded-full border border-burgundy-300/60 hover:bg-burgundy-400/60 transition"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Read Aloud
                      </button>
                    )}
                  </div>
                </div>

                {/* Spoken Text in Local Language */}
                <p className="text-xs sm:text-[13px] leading-relaxed text-zinc-100 font-medium bg-black/30 p-3 rounded-xl border border-white/5">
                  {guidance}
                </p>

                {transcript && (
                  <p className="mt-2 text-[10px] text-zinc-400 italic flex items-center gap-1">
                    <span className="text-burgundy-300 font-bold">Query:</span> "{transcript}"
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-zinc-300 text-xs">
                Tap "How to use this page" or speak in {currentLangObj.nativeName} to hear the voice guide speak out loud.
              </div>
            )}
          </div>

          {/* Browser Autoplay Blocked Fallback Action */}
          {autoplayBlocked && audioUrl && (
            <button
              onClick={() => {
                if (audioElementRef.current) {
                  audioElementRef.current.play().then(() => {
                    setIsPlaying(true);
                    setAutoplayBlocked(false);
                  }).catch(console.error);
                }
              }}
              className="mt-3 w-full py-3 px-4 bg-gradient-to-r from-burgundy-500 via-burgundy-400 to-rani text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm border border-burgundy-300/40"
            >
              <Volume2 className="h-4 w-4" />
              <span>Tap Here to Listen Aloud in {currentLangObj.nativeName}</span>
            </button>
          )}

          {/* Quick Questions Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAskGuidance('How do I use this page?')}
              disabled={isLoading || isRecording}
              className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-200 transition flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" /> How to use this page?
            </button>
            <button
              onClick={() => handleAskGuidance('Call emergency police 112')}
              disabled={isLoading || isRecording}
              className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-200 transition flex items-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Emergency & 112 Help
            </button>
            <button
              onClick={() => handleAskGuidance('How to hide photo steganography?')}
              disabled={isLoading || isRecording}
              className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-200 transition flex items-center gap-1.5"
            >
              <ImageOff className="h-3.5 w-3.5 shrink-0" /> Hide Secret Message
            </button>
            <button
              onClick={() => handleAskGuidance('Find nearest crisis centres and shelter')}
              disabled={isLoading || isRecording}
              className="p-2 text-left rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-200 transition flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" /> Nearby Help Centres
            </button>
          </div>

          {/* Live API Health & Diagnostics */}
          <div className="mt-3">
            <button
              onClick={runGnaniSelfTest}
              disabled={testResult?.running}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-zinc-300 transition"
            >
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-burgundy-300" />
                <span>Gnani AI Live Diagnostic Test (STT + TTS)</span>
              </div>
              <span className="font-semibold text-rani">
                {testResult?.running ? 'Testing...' : 'Run Test →'}
              </span>
            </button>

            {testResult?.running && (
              <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-xs text-zinc-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-burgundy-300" />
                <span>Verifying api.vachana.ai Timbre v2.5 voice synthesis...</span>
              </div>
            )}

            {testResult?.data && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Gnani AI Operational ({testResult.data.totalLatencyMs}ms)</span>
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  • Timbre TTS: {testResult.data.tts?.audioBytes} bytes generated ({testResult.data.tts?.durationMs}ms)
                  <br />
                  • Prisma STT: {testResult.data.stt?.model} (Transcribed: "{testResult.data.stt?.transcribedText}")
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

          {/* Primary Action Buttons */}
          <div className="mt-3 flex items-center gap-3">
            <Button
              onClick={() => handleAskGuidance('How to use this page?')}
              disabled={isLoading || isRecording}
              className="flex-1 bg-gradient-to-r from-rani to-saffron hover:opacity-90 text-white text-xs font-semibold rounded-2xl py-5 shadow-lg"
            >
              <Volume2 className="h-4 w-4 mr-1.5" />
              Listen to Page Guide
            </Button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`p-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-400/50'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 shadow-lg'
              }`}
              title={isRecording ? 'Tap to Stop Recording' : 'Tap to Speak a Question'}
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-zinc-400">
              {isRecording
                ? 'Listening in ' + currentLangObj.nativeName + '... Tap mic again to transcribe & speak.'
                : 'Supports Hindi, English, Tamil, Telugu, Kannada, Bengali & Marathi'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
