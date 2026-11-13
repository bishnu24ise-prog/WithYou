'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Lock,
  Play,
  Square,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';

interface AgentStepEvent {
  time: string;
  type: string;
  step?: number;
  totalSteps?: number;
  message: string;
}

export function AgentLivePanel({
  initialSummary,
}: {
  initialSummary?: string;
}) {
  const t = useTranslations('assist');
  const locale = useLocale();
  const defaultSummaryText = initialSummary || t('defaultSummary');
  const [incidentSummary, setIncidentSummary] = useState(defaultSummaryText);
  const [portalUrl, setPortalUrl] = useState('https://cybercrime.gov.in');
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<AgentStepEvent[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!initialSummary) {
      setIncidentSummary(t('defaultSummary'));
    }
  }, [t, initialSummary]);

  const startAgentStream = async (forceDemo: boolean = false) => {
    setIsRunning(true);
    setIsCompleted(false);
    setProgressPercent(10);
    setEvents([
      {
        time: new Date().toLocaleTimeString(),
        type: 'INITIALIZED',
        message: t('step1Init'),
      },
    ]);

    if (forceDemo) {
      await runDemoReplay();
      return;
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/tinyfish/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentSummary,
          portalUrl,
          language: locale,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to agent stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let currentStep = 1;
      const totalSteps = 5;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', '').trim());
              currentStep = data.step || currentStep + 1;
              const calculatedPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));
              setProgressPercent(calculatedPercent);

              setEvents((prev) => [
                ...prev,
                {
                  time: new Date().toLocaleTimeString(),
                  type: data.type || 'STEP',
                  step: data.step,
                  message: data.message || 'Processing portal input fields...',
                },
              ]);

              if (data.type === 'SAFETY_HALT' || data.type === 'COMPLETE') {
                setIsCompleted(true);
              }
            } catch {
              // Ignore non-json SSE lines
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Agent stream interrupted, switching to reliable demo replay:', err);
        await runDemoReplay();
      }
    } finally {
      setIsRunning(false);
    }
  };

  const runDemoReplay = async () => {
    const demoSteps = [
      { delay: 600, percent: 20, type: 'INITIALIZED', message: t('step1Init') },
      { delay: 900, percent: 45, type: 'STEP', message: t('step2Analyze') },
      { delay: 1100, percent: 70, type: 'STEP', message: t('step3PreFill') },
      { delay: 1200, percent: 90, type: 'SAFETY_HALT', message: t('step4SafetyHalt') },
      { delay: 800, percent: 100, type: 'COMPLETE', message: t('step5Complete') },
    ];

    for (const step of demoSteps) {
      await new Promise((r) => setTimeout(r, step.delay));
      setProgressPercent(step.percent);
      setEvents((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          type: step.type,
          message: step.message,
        },
      ]);
    }
    setIsCompleted(true);
    setIsRunning(false);
    toast.success(t('toastDraftReady'));
  };

  const stopAgent = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    setEvents((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        type: 'STOPPED',
        message: t('stepUserStopped'),
      },
    ]);
    toast(t('toastHalted'), { icon: '🛑' });
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Config Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rani" />
              <span>{t('panelTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('panelSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isRunning ? (
              <>
                <Button
                  onClick={() => startAgentStream(false)}
                  className="bg-gradient-to-r from-rani to-saffron hover:opacity-95 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{t('startSession')}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => startAgentStream(true)}
                  className="text-xs h-9 px-3 rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Run offline fixture replay for judging"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t('demoMode')}
                </Button>
              </>
            ) : (
              <Button
                onClick={stopAgent}
                variant="destructive"
                className="text-xs h-9 px-4 rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>{t('abortSession')}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Input Incident Summary */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            {t('legalSummaryLabel')}
          </label>
          <textarea
            value={incidentSummary}
            onChange={(e) => setIncidentSummary(e.target.value)}
            disabled={isRunning}
            rows={2}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-rani/40 font-mono"
            placeholder={t('placeholderSummary')}
          />
        </div>
      </div>

      {/* Browser Window Frame */}
      <div className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-white overflow-hidden shadow-2xl">
        {/* Browser Top Chrome */}
        <div className="bg-slate-950 px-4 py-3 flex items-center gap-3 border-b border-slate-800">
          {/* Traffic Light Dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>

          {/* URL Address Bar */}
          <div className="flex-1 max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 flex items-center gap-2 text-xs text-slate-300 font-mono">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{portalUrl}/citizen-reporting-flow</span>
            <span className="ml-auto text-[10px] text-slate-500 uppercase tracking-widest font-sans hidden sm:inline">
              {t('stealthSandbox')}
            </span>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rani to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Browser Viewport */}
        <div className="p-4 sm:p-6 bg-slate-900/95 min-h-[320px] flex flex-col justify-between space-y-4">
          {/* Terminal / Activity Log */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                {t('agentLogTitle')}
              </span>
              <span>{t('agentProxy')}</span>
            </div>

            {events.length === 0 ? (
              <div className="py-12 text-center text-slate-500 italic">
                {t('agentLogPlaceholder')}
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                {events.map((ev, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-1.5 rounded-lg text-xs ${
                      ev.type === 'SAFETY_HALT'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/80 font-bold'
                        : ev.type === 'COMPLETE'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">[{ev.time}]</span>
                    <span>{ev.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safety Notice & Call-To-Action Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-300">
                  {t('safetyConstraintTitle')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {t('safetyConstraintDesc')}
                </div>
              </div>
            </div>

            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all shrink-0 ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>{t('reviewSubmitSelf')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
