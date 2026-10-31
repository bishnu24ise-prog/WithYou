'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
  ArrowUp,
  Scale,
  Triangle,
  Check,
  Fingerprint,
  Scale as ScaleIcon,
  Volume2,
  VolumeX,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSafeClerk } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VoiceInput from '@/components/VoiceInput';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useTranslations, useLocale } from 'next-intl';

const ChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type ChatFormValues = z.infer<typeof ChatSchema>;

export default function LawBotPage() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean; isEmergency?: boolean }[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [handsFree, setHandsFree] = useState<boolean>(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useSafeClerk();
  const t = useTranslations('lawbot');
  const locale = useLocale();

  const { speak, stopAudio, isSpeaking, startListening } = useVoiceAgent({
    language: locale,
  });

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(ChatSchema),
    defaultValues: { message: '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const promptSuggestions = [
    { text: t('sugg1'), icon: <Scale className="text-rani" size={16} /> },
    { text: t('sugg2'), icon: <Triangle className="text-saffron" size={16} /> },
    { text: t('sugg3'), icon: <Check className="text-jade" size={16} /> },
    { text: t('sugg4'), icon: <Fingerprint className="text-peacock" size={16} /> },
  ];

  const onSubmit = async (data: ChatFormValues) => {
    if (!data.message || !data.message.trim()) return;
    const userText = data.message;
    setMessages((prev) => [...prev, { text: userText, isUser: true }]);
    form.reset({ message: '' });
    setIsThinking(true);
    stopAudio();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          userInput: userText,
          language: locale,
          voice_enabled: handsFree,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      const replyText =
        result?.reply ||
        result?.error ||
        'I am analyzing legal statutes for your situation. In emergency situations, please dial 1091 (Women Helpline) or 112 immediately.';
      const isEmerg = !!result?.is_emergency;

      const newMsgIndex = messages.length + 1;
      setMessages((prev) => [...prev, { text: replyText, isUser: false, isEmergency: isEmerg }]);

      if (handsFree) {
        setSpeakingMessageIndex(newMsgIndex);
        speak(replyText, locale, () => {
          setSpeakingMessageIndex(null);
          // Re-open mic for hands-free loop
          startListening();
        });
      }
    } catch (err: any) {
      console.warn('Lawbot request notice:', err);
      const fallback =
        'Under the Protection of Women from Domestic Violence Act (PWDVA) 2005, you have the right to seek emergency protection orders, residence orders, and immediate assistance. For immediate emergency help in India, please contact the Women Helpline at 1091 or National Emergency at 112.';
      setMessages((prev) => [...prev, { text: fallback, isUser: false }]);
      if (handsFree) {
        speak(fallback, locale);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (promptText: string) => {
    form.setValue('message', promptText, { shouldValidate: true });
    form.handleSubmit(onSubmit)();
  };

  const toggleSpeakMessage = (index: number, text: string) => {
    if (speakingMessageIndex === index) {
      stopAudio();
      setSpeakingMessageIndex(null);
    } else {
      setSpeakingMessageIndex(index);
      speak(text, locale, () => {
        setSpeakingMessageIndex(null);
      });
    }
  };

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading Law Bot...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] max-w-5xl mx-auto w-full p-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
            <ScaleIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              {t('title')}
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">{t('subtitle')}</p>
          </div>
        </div>

        {/* Hands-free mode toggle */}
        <button
          onClick={() => {
            const next = !handsFree;
            setHandsFree(next);
            if (!next) stopAudio();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            handsFree
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
          title="Hands-free spoken conversation mode"
        >
          <Radio className={`w-3.5 h-3.5 ${handsFree ? 'animate-pulse' : ''}`} />
          <span>{t('handsFree')}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 mb-3 shadow-inner">
              <ScaleIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {t('title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mb-6">
              {t('subtitle')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
              {promptSuggestions.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePromptClick(prompt.text)}
                  className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition shadow-xs"
                >
                  {prompt.icon}
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  msg.isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                }`}
              >
                {/* Emergency Highlight Banner */}
                {msg.isEmergency && (
                  <div className="mb-2 p-2 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-2 text-xs font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>EMERGENCY: Call Police: 112 | Women Helpline: 1091</span>
                  </div>
                )}

                <div className="prose dark:prose-invert text-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>

                {/* Spoken playback button on bot replies */}
                {!msg.isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => toggleSpeakMessage(index, msg.text)}
                      className={`text-xs flex items-center gap-1 font-semibold transition-colors ${
                        speakingMessageIndex === index
                          ? 'text-rose-600 animate-pulse'
                          : 'text-slate-500 hover:text-blue-600'
                      }`}
                    >
                      {speakingMessageIndex === index ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>{t('stopListening')}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{t('listen')}</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400">Indian Law (PWDVA/BNS)</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
            <Skeleton className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
            <span>{t('thinking')}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Integrated Voice Dictation */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
          <Input
            {...form.register('message')}
            placeholder={t('inputPlaceholder')}
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-1 placeholder:text-slate-400"
            autoComplete="off"
          />
          <VoiceInput
            buttonSize="sm"
            language={locale}
            showWarning={true}
            onTranscript={(txt) => {
              const cur = form.getValues('message') || '';
              form.setValue('message', cur ? `${cur} ${txt}` : txt, { shouldValidate: true });
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={isThinking}
          className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 p-0 shrink-0 shadow-md"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
