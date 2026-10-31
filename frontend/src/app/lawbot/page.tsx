'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { ArrowUp, Scale, Triangle, Check, Fingerprint, Scale as ScaleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSafeClerk } from '@/lib/auth-context';
import Image from 'next/image';
import modelImage from '@/assets/modelLogo.png';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

type ChatFormValues = z.infer<typeof ChatSchema>;

const promptSuggestions = [
  { text: 'PWDVA 2005 & Protection Orders', icon: <Scale className="text-rani" size={16} /> },
  { text: 'Bharatiya Nyaya Sanhita (BNS Cruelty Provisions)', icon: <Triangle className="text-saffron" size={16} /> },
  { text: 'Residence, Shelter & Maintenance Rights', icon: <Check className="text-jade" size={16} /> },
  { text: 'Emergency Helplines (112, 1091, 181)', icon: <Fingerprint className="text-peacock" size={16} /> },
];

export default function LawBotPage() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useSafeClerk();

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

  const onSubmit = async (data: ChatFormValues) => {
    if (!data.message || !data.message.trim()) return;
    const userText = data.message;
    setMessages((prev) => [...prev, { text: userText, isUser: true }]);
    form.reset({ message: '' });
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: userText }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      const replyText = result?.reply || result?.error || "I am analyzing legal statutes for your situation. In emergency situations, please dial 1091 (Women Helpline) or 112 immediately.";
      setMessages((prev) => [...prev, { text: replyText, isUser: false }]);
    } catch (err: any) {
      console.warn('Lawbot request notice:', err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Under the Protection of Women from Domestic Violence Act (PWDVA) 2005, you have the right to seek emergency protection orders, residence orders, and immediate assistance. For immediate emergency help in India, please contact the Women Helpline at **1091** or National Emergency at **112**.",
          isUser: false,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handlePromptClick = (promptText: string) => {
    form.setValue('message', promptText, { shouldValidate: true });
    form.handleSubmit(onSubmit)();
  };

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading Law Bot...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 max-w-4xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
          <ScaleIcon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100 mb-3">
          24/7 Legal Rights & Protection Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl text-base mb-8">
          Confidential AI legal guidance for domestic abuse, restraining orders, IPC statutes, custody, and women&apos;s constitutional rights.
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center max-w-2xl w-full gap-2 mb-6"
        >
          <div className="rounded-full flex w-full items-center bg-slate-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Input
              {...form.register('message')}
              className="text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 placeholder:text-gray-400"
              placeholder="Ask any legal question (e.g. IPC 498A, divorce, domestic abuse)..."
              autoComplete="off"
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 rounded-full text-white h-9 w-9 p-0 shrink-0"
              disabled={isThinking}
              type="submit"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl">
          {promptSuggestions.map((prompt, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handlePromptClick(prompt.text)}
              className="flex items-center gap-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition shadow-sm"
            >
              {prompt.icon}
              {prompt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl w-full mx-auto p-4">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border">
                <Image
                  src={modelImage}
                  alt="Law Bot"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              </div>
            )}

            <div
              className={`py-3 px-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                message.isUser
                  ? 'bg-gradient-to-r from-rani to-saffron text-white rounded-br-none shadow-md shadow-rani/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
              }`}
            >
              {message.isUser ? (
                message.text
              ) : (
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text || ''}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rani to-saffron text-white flex items-center justify-center font-semibold text-xs shrink-0 shadow-sm">
                {user?.firstName ? user.firstName[0] : 'U'}
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border animate-pulse">
              <ScaleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border w-72">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form at Bottom */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex items-center gap-2 pt-2 border-t"
      >
        <div className="rounded-full flex w-full items-center bg-slate-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
          <Input
            {...form.register('message')}
            className="text-base bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 placeholder:text-gray-400"
            placeholder="Ask follow-up legal question or statute inquiry..."
            autoComplete="off"
            disabled={isThinking}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700 rounded-full text-white h-9 w-9 p-0 shrink-0"
            disabled={isThinking}
            type="submit"
          >
            <ArrowUp size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
}
