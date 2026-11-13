'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  User,
  Bot,
  RefreshCw,
  Box,
  Maximize2,
  Shield,
  Radio,
  Play,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceInput from '@/components/VoiceInput';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useTranslations, useLocale } from 'next-intl';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}

export default function TherapyBotPage() {
  const t = useTranslations('therapy');
  const locale = useLocale();

  // Active language and voice persona for 3D Therapy
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    locale.startsWith('kn') ? 'kn-IN' : locale.startsWith('hi') ? 'hi-IN' : 'kn-IN'
  );
  // Maya 3D Sanctuary voice defaults to female
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');

  const SUPPORTED_LANGUAGES = [
    { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)', short: 'ಕನ್ನಡ' },
    { code: 'hi-IN', label: 'हिन्दी (Hindi)', short: 'हिन्दी' },
    { code: 'en-IN', label: 'English', short: 'English' },
    { code: 'ta-IN', label: 'தமிழ் (Tamil)', short: 'தமிழ்' },
    { code: 'te-IN', label: 'తెలుగు (Telugu)', short: 'తెలుగు' },
    { code: 'bn-IN', label: 'বাংলা (Bengali)', short: 'বাংলা' },
    { code: 'mr-IN', label: 'मराठी (Marathi)', short: 'मराठी' },
    { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)', short: 'ગુજરાતી' },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: t('initialMessage'),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [expression, setExpression] = useState('comforting');
  const [view3D, setView3D] = useState(true);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopAllVoice = () => {
    stopAudio();
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'SAFE_SPARK_STOP' }, '*');
    }
  };

  const { speak, stopAudio, startListening } = useVoiceAgent({
    language: selectedLanguage,
  });

  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Trigger speech playback in parent window and synchronize Maya's 3D motion
  const playSpokenReply = (textToPlay: string, audioUrl?: string, onDone?: () => void) => {
    stopAllVoice();

    // Ensure audio and speech synthesis are resumed on user action
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }

    const handleSpeechStart = () => {
      setIsSpeaking(true);
      setExpression('talking');
      // Signal 3D avatar iframe to animate and lip-sync now that voice is playing
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'SAFE_SPARK_SPEAK',
            text: textToPlay,
            facialExpression: 'smile',
            animation: 'Talking_0',
            duration: Math.max(2.5, textToPlay.split(' ').length * 0.4),
            fromParent: true,
          },
          '*'
        );
      }
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
      setExpression('comforting');
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'SAFE_SPARK_STOP' }, '*');
      }
      onDone?.();
    };

    // Use unified voice agent helper (handles direct audioUrl, backend TTS, or browser SpeechSynthesis)
    speak(textToPlay, selectedLanguage, handleSpeechEnd, handleSpeechStart, audioUrl);
  };

  const handleReplayBot = (textToPlay: string, audioUrl?: string) => {
    playSpokenReply(textToPlay, audioUrl);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Harmonic somatic breathing cycle (4-4-6 timing)
  useEffect(() => {
    if (view3D) return;

    let timer: NodeJS.Timeout;
    if (breathPhase === 'Inhale') {
      timer = setTimeout(() => setBreathPhase('Hold'), 4000);
    } else if (breathPhase === 'Hold') {
      timer = setTimeout(() => setBreathPhase('Exhale'), 4000);
    } else {
      timer = setTimeout(() => setBreathPhase('Inhale'), 6000);
    }

    return () => clearTimeout(timer);
  }, [breathPhase, view3D]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text || !text.trim() || loading) return;

    // Wake speech synthesis immediately during user click event
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setExpression('listening');
    stopAllVoice();

    try {
      const chatRes = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage,
          gender: voiceGender,
          voice_enabled: voiceEnabled,
        }),
      });

      let botReply = t('initialMessage');
      let audioUrl: string | undefined = undefined;

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        const msg = chatData?.messages?.[0] || chatData;
        if (msg) {
          botReply = msg.text || msg.reply || botReply;
          if (voiceEnabled && msg.audio) {
            audioUrl = `data:audio/mp3;base64,${msg.audio}`;
          }
        }
      }

      setExpression('comforting');
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply, audioUrl }]);

      if (voiceEnabled) {
        playSpokenReply(botReply, audioUrl, () => {
          if (handsFree) {
            startListening();
          }
        });
      }
    } catch (err) {
      console.warn('Therapy chat notice:', err);
      const fallback = t('initialMessage');
      setMessages((prev) => [...prev, { sender: 'bot', text: fallback }]);
      if (voiceEnabled) {
        playSpokenReply(fallback);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center text-slate-500 gap-2">
        <RefreshCw className="h-5 w-5 animate-spin text-rani" /> {t('loadingSanctuary')}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-4.5rem)] max-w-7xl mx-auto w-full p-2 sm:p-4 gap-3 sm:gap-4 overflow-x-hidden">
      {/* Left Column: Native 3D Avatar & Sanctuary Visualizer */}
      <div className="w-full lg:w-5/12 flex flex-col bg-gradient-to-b from-rose-50/60 via-indigo-50/40 to-purple-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-sm relative overflow-hidden shrink-0 lg:shrink">
        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            <button
              onClick={() => setView3D(true)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                view3D ? 'bg-rani text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-rani'
              }`}
            >
              <Box className="h-3.5 w-3.5" /> {t('view3D')}
            </button>
            <button
              onClick={() => setView3D(false)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !view3D ? 'bg-rani text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-rani'
              }`}
            >
              <Heart className="h-3.5 w-3.5" /> {t('viewSanctuary')}
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Voice Gender Persona Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = voiceGender === 'female' ? 'male' : 'female';
                setVoiceGender(next);
                stopAllVoice();
              }}
              className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-all shadow-xs ${
                voiceGender === 'female'
                  ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700 ring-1 ring-rose-400'
                  : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
              }`}
              title="Toggle Avatar Voice (Maya Female Voice vs Male Voice)"
            >
              <span>{voiceGender === 'female' ? '🌸 Maya (Female Voice)' : '👨 Male / Boy Voice'}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs shadow-xs">
              <Languages className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  stopAllVoice();
                }}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
                title="Select Companion Language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Voice Test Button */}
            <button
              onClick={() => handleReplayBot(t('testVoiceSample'))}
              className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-rani hover:text-rani transition-all shadow-xs"
              title="Test Maya's Voice & Audio"
            >
              <Play className="w-3 h-3 text-rani fill-rani/20" />
              <span>{t('testVoice')}</span>
            </button>

            {/* Hands-free mode toggle */}
            <button
              onClick={() => setHandsFree(!handsFree)}
              className={`text-[11px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                handsFree
                  ? 'bg-rani text-white border-rani shadow-xs'
                  : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title="Hands-free Conversation Mode"
            >
              <Radio className={`w-3 h-3 ${handsFree ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{t('handsFree')}</span>
            </button>

            {view3D && (
              <a
                href={`/avatar/index.html?locale=${locale}`}
                target="_blank"
                rel="noreferrer"
                title="Open 3D Avatar in full window"
                className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-md border shadow-xs flex items-center gap-1 hover:text-rani font-medium"
              >
                <Maximize2 className="h-3 w-3" /> {t('fullWindow')}
              </a>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) {
                  stopAllVoice();
                  setIsSpeaking(false);
                }
              }}
              className="text-[11px] sm:text-xs h-7 sm:h-8 px-2 sm:px-2.5 flex items-center gap-1 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 shadow-xs"
              title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-rani animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-200">{t('voiceOn')}</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">{t('muted')}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Companion Display Container */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] h-[320px] sm:h-[380px] lg:h-auto relative bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-inner">
          {view3D ? (
            /* Fully Native 3D Avatar (Built directly into Next.js public directory with locale parameter) */
            <iframe
              ref={iframeRef}
              src={`/avatar/index.html?embedded=true&locale=${locale}`}
              title="Maya 3D Avatar"
              allow="microphone; camera; autoplay"
              loading="eager"
              className="w-full h-full border-none rounded-2xl min-h-[300px] bg-slate-950"
            />
          ) : (
            /* Active Sanctuary Visualizer */
            <div className="flex flex-col items-center justify-center p-6 text-center w-full">
              <div className="relative mb-6">
                <div
                  className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'scale-125 bg-rose-200/70 dark:bg-rose-950/60 shadow-xl shadow-rose-300/30'
                      : breathPhase === 'Hold'
                      ? 'scale-115 bg-indigo-200/70 dark:bg-indigo-950/60 shadow-xl shadow-indigo-300/30'
                      : 'scale-90 bg-purple-200/60 dark:bg-purple-950/50 shadow-md'
                  }`}
                >
                  <div
                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-700 ${
                      breathPhase === 'Inhale'
                        ? 'bg-rose-400 text-white'
                        : breathPhase === 'Hold'
                        ? 'bg-indigo-400 text-white'
                        : 'bg-purple-400 text-white'
                    }`}
                  >
                    <Sparkles className="h-6 w-6 animate-pulse" />
                    <span className="text-xs font-semibold mt-1">
                      {breathPhase === 'Inhale' ? t('inhale') : breathPhase === 'Hold' ? t('hold') : t('exhale')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {t('breathingCycle')}
              </p>
            </div>
          )}

          {/* Real-time Status Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-medium border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-1.5 z-10">
            <span
              className={`h-2 w-2 rounded-full ${
                isSpeaking ? 'bg-rani animate-ping' : loading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="capitalize text-slate-700 dark:text-slate-200">
              {isSpeaking ? t('mayaSpeaking') : loading ? t('mayaReflecting') : t('mayaPresent')}
            </span>
          </div>
        </div>

        {/* Quick Grounding Exercises */}
        <div className="mt-2.5 sm:mt-3">
          <p className="text-[11px] text-slate-500 mb-1.5 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-rani" /> {t('groundingExercise')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleSend(t('quickGroundingPrompt'))}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:border-rani hover:text-rani transition shadow-xs font-medium text-left truncate"
            >
              🧘 {t('quickGrounding')}
            </button>
            <button
              onClick={() => handleSend(t('quickUrgentPrompt'))}
              className="text-xs bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-lg px-2.5 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition shadow-xs font-medium text-left truncate"
            >
              🚨 {t('quickUrgent')}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Sanctuary */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-sm min-h-[460px] lg:min-h-0 lg:h-full">
        <div className="border-b pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rani fill-rani/20 shrink-0" />
            <h2 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">{t('title')}</h2>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
            <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" /> {t('confidentialBadge')}
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 sm:pr-2 min-h-[260px] sm:min-h-[320px] lg:min-h-0 scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-2 max-w-[92%] sm:max-w-[85%]">
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-slate-800 flex items-center justify-center text-rani shrink-0 border border-rose-200 dark:border-slate-700">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm relative group ${
                    msg.sender === 'user'
                      ? 'bg-rani text-white rounded-br-none shadow-rani/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/70 dark:border-slate-700/70'
                  }`}
                >
                  {msg.text}
                  {msg.sender === 'bot' && (
                    <button
                      type="button"
                      onClick={() => handleReplayBot(msg.text, msg.audioUrl)}
                      title={t('listenAloud')}
                      className="ml-2 inline-flex items-center text-xs text-rani hover:text-rani-600 transition p-1 hover:bg-rose-50 dark:hover:bg-slate-700 rounded-full"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-rani text-white flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2 ml-9">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-rani" /> {t('mayaListening')}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Language Switcher Pills */}
        <div className="flex items-center gap-1.5 pt-1.5 pb-1 overflow-x-auto scrollbar-none text-[11px] border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px] font-semibold shrink-0">
            <Languages className="w-3 h-3 text-rose-500" />
            <span>Language:</span>
          </span>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setSelectedLanguage(lang.code);
                stopAllVoice();
              }}
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all shrink-0 text-[11px] ${
                selectedLanguage === lang.code
                  ? 'bg-rose-600 text-white shadow-xs font-bold ring-1 ring-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lang.short}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="pt-1 pb-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 w-full"
          >
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedLanguage.startsWith('kn')
                    ? 'ಮಾಯಾ ಜೊತೆ ಮಾತನಾಡಿ ಅಥವಾ ನಿಮ್ಮ ಭಾವನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...'
                    : selectedLanguage.startsWith('hi')
                    ? 'माया से बात करें या अपनी भावनाएं साझा करें...'
                    : t('chatPlaceholder')
                }
                disabled={loading}
                className="pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus-visible:ring-rani h-10 sm:h-11 text-xs sm:text-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInput
                  language={selectedLanguage}
                  onTranscript={(transcribed: string) => setInput(transcribed)}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-rani hover:bg-rani-600 text-white rounded-xl h-10 sm:h-11 px-3.5 sm:px-4 shadow-sm shadow-rani/20 flex items-center gap-1.5 shrink-0 text-xs sm:text-sm"
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('send')}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
