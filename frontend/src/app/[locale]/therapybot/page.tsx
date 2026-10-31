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
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello, I am your confidential Therapy Assistant. You are in a safe, judgment-free space. Take a gentle breath, and share whatever is on your heart.',
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

  const t = useTranslations('therapy');
  const locale = useLocale();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stopAudio, startListening } = useVoiceAgent({
    language: locale,
  });

  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

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

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setExpression('listening');
    stopAudio();

    try {
      const chatRes = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: locale,
          voice_enabled: voiceEnabled,
        }),
      });

      let botReply =
        'I hear you deeply, and what you are experiencing is real and important. You are safe in this moment, and you do not have to carry this alone.';
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
        setIsSpeaking(true);
        setExpression('talking');
        speak(botReply, locale, () => {
          setIsSpeaking(false);
          setExpression('comforting');
          if (handsFree) {
            startListening();
          }
        });
      }
    } catch (err) {
      console.warn('Therapy chat notice:', err);
      const fallback =
        'I am here with you right now. Please take a slow, gentle breath. You are safe, and help is always within reach.';
      setMessages((prev) => [...prev, { sender: 'bot', text: fallback }]);
      if (voiceEnabled) {
        speak(fallback, locale);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center text-slate-500 gap-2">
        <RefreshCw className="h-5 w-5 animate-spin text-rani" /> Loading Sanctuary...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4.5rem)] max-w-7xl mx-auto w-full p-4 gap-4">
      {/* Left Column: Native 3D Avatar & Sanctuary Visualizer */}
      <div className="w-full lg:w-5/12 flex flex-col bg-gradient-to-b from-rose-50/60 via-indigo-50/40 to-purple-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden">
        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
            <button
              onClick={() => setView3D(true)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                view3D ? 'bg-rani text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-rani'
              }`}
            >
              <Box className="h-3.5 w-3.5" /> {t('view3D')}
            </button>
            <button
              onClick={() => setView3D(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !view3D ? 'bg-rani text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-rani'
              }`}
            >
              <Heart className="h-3.5 w-3.5" /> {t('viewSanctuary')}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Hands-free mode toggle */}
            <button
              onClick={() => setHandsFree(!handsFree)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 transition-all ${
                handsFree
                  ? 'bg-rani text-white border-rani shadow-sm'
                  : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 text-slate-600 dark:text-slate-300'
              }`}
              title="Hands-free Conversation Mode"
            >
              <Radio className={`w-3 h-3 ${handsFree ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">Hands-free</span>
            </button>

            {view3D && (
              <a
                href={`/avatar/index.html?locale=${locale}`}
                target="_blank"
                rel="noreferrer"
                title="Open 3D Avatar in full window"
                className="text-xs text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-md border shadow-sm flex items-center gap-1 hover:text-rani font-medium"
              >
                <Maximize2 className="h-3 w-3" /> Full
              </a>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const next = !voiceEnabled;
                setVoiceEnabled(next);
                if (!next) {
                  stopAudio();
                  setIsSpeaking(false);
                }
              }}
              className="text-xs h-8 px-2.5 flex items-center gap-1.5 border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 shadow-sm"
              title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-rani animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">{t('voiceOn')}</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[11px] font-medium text-slate-400">{t('muted')}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Companion Display Container */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] relative bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-inner">
          {view3D ? (
            /* Fully Native 3D Avatar (Built directly into Next.js public directory with locale parameter) */
            <iframe
              src={`/avatar/index.html?embedded=true&locale=${locale}`}
              title="Maya 3D Avatar"
              allow="microphone; camera; autoplay"
              loading="eager"
              className="w-full h-full border-none rounded-2xl min-h-[340px] bg-slate-950"
            />
          ) : (
            /* Active Sanctuary Visualizer */
            <div className="flex flex-col items-center justify-center p-6 text-center w-full">
              <div className="relative mb-5 flex items-center justify-center">
                <div
                  className={`absolute rounded-full transition-all duration-1000 ${
                    breathPhase === 'Inhale'
                      ? 'w-48 h-48 bg-rani/15 scale-110'
                      : breathPhase === 'Hold'
                      ? 'w-48 h-48 bg-purple-400/20 scale-105'
                      : 'w-40 h-40 bg-peacock/15 scale-90'
                  }`}
                />
                <div
                  className={`absolute rounded-full transition-all duration-700 ${
                    isSpeaking
                      ? 'w-40 h-40 bg-rani/25 animate-ping'
                      : loading
                      ? 'w-36 h-36 bg-amber-400/20 animate-spin'
                      : 'w-36 h-36 bg-indigo-300/20'
                  }`}
                />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-rani via-purple-600 to-peacock flex items-center justify-center shadow-xl shadow-rani/20 text-white transition-transform duration-500 hover:scale-105">
                  {isSpeaking ? (
                    <Sparkles className="h-12 w-12 animate-pulse text-amber-200" />
                  ) : loading ? (
                    <RefreshCw className="h-10 w-10 animate-spin text-white" />
                  ) : (
                    <Heart className="h-12 w-12 text-rose-100 fill-rose-100/40 animate-pulse" />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{t('title')}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rani">
                    {expression}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{t('subtitle')}</p>
                <div className="mt-2 text-xs font-semibold text-rani">
                  Breath: <span className="underline uppercase tracking-wide">{breathPhase}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Grounding Exercises */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSend('Can you guide me through a 2-minute 4-7-8 calming breath exercise?')}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:border-rani hover:text-rani transition shadow-xs font-medium"
            >
              🌬️ {t('quickBreath')}
            </button>
            <button
              onClick={() =>
                handleSend('I am feeling overwhelmed and panic-stricken. Please guide me through 5-4-3-2-1 grounding.')
              }
              className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:border-rani hover:text-rani transition shadow-xs font-medium"
            >
              🧘 {t('quickGrounding')}
            </button>
            <button
              onClick={() => handleSend('I feel in danger right now. What safety steps should I follow immediately?')}
              className="text-xs bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-lg px-2.5 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition shadow-xs font-medium"
            >
              🚨 {t('quickUrgent')}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Sanctuary */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm">
        <div className="border-b pb-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rani fill-rani/20" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">{t('title')}</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Shield className="h-3.5 w-3.5 text-emerald-500" /> 100% Confidential
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[300px] scrollbar-thin">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-slate-800 flex items-center justify-center text-rani shrink-0 border border-rose-200 dark:border-slate-700">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-rani text-white rounded-br-none shadow-rani/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/70 dark:border-slate-700/70'
                  }`}
                >
                  {msg.text}
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
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-rani" /> Maya is listening...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form with Dedicated Voice Dictation */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800"
        >
          <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 px-3 py-1 focus-within:ring-2 focus-within:ring-rani shadow-xs">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              disabled={loading}
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-1 placeholder:text-slate-400"
            />
            <VoiceInput
              buttonSize="sm"
              language={locale}
              showWarning={true}
              onTranscript={(txt) => {
                setInput((prev) => (prev ? `${prev} ${txt}` : txt));
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-rani hover:bg-rani/90 text-white w-11 h-11 p-0 rounded-2xl shadow-sm shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
