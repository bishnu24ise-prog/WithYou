'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Heart, Shield, Sparkles, RefreshCw, User, Bot, ExternalLink, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}

export default function TherapyBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hello, I am your confidential Therapy Assistant. You are in a safe, judgment-free space. Take a gentle breath, and share whatever is on your heart.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [view3D, setView3D] = useState(true);
  const [expression, setExpression] = useState<'listening' | 'talking' | 'comforting'>('listening');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const playVoice = (audioUrl?: string) => {
    if (!audioUrl) return;
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      setIsSpeaking(true);
      setExpression('talking');
      audio.play().catch((err) => {
        console.warn('Audio play notice:', err);
        setIsSpeaking(false);
        setExpression('comforting');
      });
      audio.onended = () => {
        setIsSpeaking(false);
        setExpression('comforting');
      };
    } catch (e) {
      console.warn('Voice play error:', e);
      setIsSpeaking(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text || !text.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);
    setExpression('listening');

    try {
      const chatRes = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      let botReply = "I hear you deeply, and what you are experiencing is real and important. You are safe in this moment, and you do not have to carry this alone.";
      let audioUrl: string | undefined = undefined;

      if (chatRes.ok) {
        const chatData = await chatRes.json();
        const msg = chatData?.messages?.[0];
        if (msg) {
          botReply = msg.text;
          if (voiceEnabled && msg.audio) {
            audioUrl = `data:audio/mp3;base64,${msg.audio}`;
            playVoice(audioUrl);
          }
        }
      }

      setExpression('comforting');
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply, audioUrl }]);
    } catch (err) {
      console.warn('Therapy notice:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I am here with you right now. Please take a slow, gentle breath. You are safe, and help is available.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">Loading Sanctuary...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4.5rem)] max-w-7xl mx-auto w-full p-4 gap-4">
      {/* Left Column: 3D Avatar & Grounding Tools */}
      <div className="w-full lg:w-5/12 flex flex-col bg-gradient-to-b from-blue-50/70 via-indigo-50/50 to-purple-50/40 dark:from-slate-900 dark:to-slate-950 rounded-2xl border p-4 shadow-sm relative overflow-hidden">
        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setView3D(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                view3D ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Box className="h-3.5 w-3.5" /> 3D Avatar
            </button>
            <button
              onClick={() => setView3D(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                !view3D ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Heart className="h-3.5 w-3.5 text-rose-400" /> Sanctuary
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              title="Open full-screen 3D Avatar"
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium bg-blue-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-blue-200 dark:border-slate-700"
            >
              Fullscreen <ExternalLink className="h-3 w-3" />
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-xs h-7 px-2 flex items-center gap-1"
            >
              {voiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-blue-600" /> : <VolumeX className="h-3.5 w-3.5 text-slate-400" />}
            </Button>
          </div>
        </div>

        {/* Avatar Display Container */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[340px] relative bg-white/80 dark:bg-slate-800/60 rounded-2xl border overflow-hidden shadow-inner">
          {view3D ? (
            /* Live 3D Canvas from localhost:5173 */
            <iframe
              src="http://localhost:5173"
              title="3D Avatar"
              className="w-full h-full border-none rounded-2xl min-h-[340px]"
            />
          ) : (
            /* Sanctuary Visual */
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-4 flex items-center justify-center">
                <div
                  className={`absolute w-36 h-36 rounded-full transition-all duration-700 ${
                    isSpeaking
                      ? 'bg-blue-400/30 scale-125 animate-pulse'
                      : loading
                      ? 'bg-purple-400/20 scale-110 animate-spin'
                      : 'bg-indigo-300/20 scale-100'
                  }`}
                />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl text-white">
                  {isSpeaking ? (
                    <Sparkles className="h-14 w-14 animate-bounce" />
                  ) : (
                    <Heart className="h-14 w-14 animate-pulse text-rose-200" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  Maya • Trauma Support Specialist
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-lavender/30 text-lavender-900 dark:text-lavender-200">
                  {expression}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                {isSpeaking ? "Speaking with compassion... Listen to my voice." : "I am actively listening. You can speak freely without judgment."}
              </p>
            </div>
          )}
        </div>

        {/* Quick Grounding Exercises */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSend("Can you guide me through a 2-minute 4-7-8 calming breath exercise?")}
              className="text-xs bg-white dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition shadow-sm font-medium"
            >
              🌬️ Calm Breathing
            </button>
            <button
              onClick={() => handleSend("I am feeling overwhelmed and panic-stricken. Please guide me through 5-4-3-2-1 grounding.")}
              className="text-xs bg-white dark:bg-slate-800 border rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition shadow-sm font-medium"
            >
              🧘 5-4-3-2-1 Grounding
            </button>
            <button
              onClick={() => handleSend("I feel in danger right now. What safety steps should I follow immediately?")}
              className="text-xs bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 rounded-lg px-2.5 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition shadow-sm font-medium"
            >
              🚨 Urgent Safety Steps
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Sanctuary */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-sm">
        <div className="border-b pb-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Safe Mental Health Sanctuary</h2>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Shield className="h-3.5 w-3.5 text-emerald-500" /> 100% Confidential
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[300px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
              {msg.audioUrl && (
                <button
                  onClick={() => playVoice(msg.audioUrl)}
                  className="mt-1.5 ml-9 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Volume2 className="h-3.5 w-3.5" /> Replay Voice
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2 ml-9">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-500" /> Formulating compassionate guidance & voice...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-3 flex items-center gap-2 pt-3 border-t"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type how you are feeling or what you are experiencing..."
            disabled={loading}
            className="flex-1 text-sm bg-slate-50 dark:bg-slate-800 focus-visible:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
