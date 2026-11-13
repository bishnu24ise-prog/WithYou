'use client';

import React from 'react';
import { ExternalLink, BookOpen, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface SourceItem {
  title: string;
  url: string;
  domain: string;
  fetchedAt: string;
  snippet?: string;
}

interface SourcesPanelProps {
  sources: SourceItem[];
  pagesRead?: number;
  isLoading?: boolean;
}

export function SourcesPanel({ sources, pagesRead = 0, isLoading = false }: SourcesPanelProps) {
  const t = useTranslations('sources');

  if (isLoading) {
    return (
      <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 animate-pulse">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <BookOpen className="w-4 h-4 animate-spin text-blue-600" />
          <span>{t('searchingLegal')}</span>
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-3 bg-blue-200 dark:bg-blue-900/60 rounded-full w-3/4" />
          <div className="h-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-1/2" />
        </div>
      </div>
    );
  }

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-left">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('citedSources')}</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-semibold">
            {pagesRead || sources.length} {t('pagesVerified')}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {t('liveFactCheck')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {sources.map((src, index) => (
          <a
            key={index}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                {/* Favicon or fallback */}
                <img
                  src={`https://www.google.com/s2/favicons?domain=${src.domain}&sz=32`}
                  alt=""
                  className="w-3.5 h-3.5 rounded-xs shrink-0"
                  onError={(e) => {
                    // Fallback to hidden if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 truncate">
                  {src.domain}
                </span>
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 ml-auto" />
              </div>

              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-rani transition-colors">
                {src.title}
              </div>

              {src.snippet && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {src.snippet}
                </p>
              )}
            </div>

            <div className="mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>{t('verifiedSource')}</span>
              <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 group-hover:underline">
                {t('readSource')} <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2.5 italic">
        ⚖️ {t('disclaimer')}
      </p>
    </div>
  );
}
