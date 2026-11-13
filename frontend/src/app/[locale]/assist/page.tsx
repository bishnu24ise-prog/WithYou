'use client';

import React from 'react';
import { AgentLivePanel } from '@/components/AgentLivePanel';
import { Sparkles, Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { GnaniAudioPlayerButton } from '@/components/GnaniAudioPlayerButton';
import { useTranslations } from 'next-intl';

export default function AssistPage() {
  const t = useTranslations('assist');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/lawbot"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rani transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t('backToLawbot')}
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rani/10 text-rani uppercase tracking-wider">
            {t('badge')}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {t('poweredBy')}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          {t('subtitle')}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">{t('listenPrompt')}</span>
          <GnaniAudioPlayerButton text={t('audioText')} />
        </div>
      </div>

      {/* Live Agent Sandbox Panel */}
      <AgentLivePanel />
    </div>
  );
}
