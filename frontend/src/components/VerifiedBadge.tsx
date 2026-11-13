'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Globe } from 'lucide-react';

interface VerifiedBadgeProps {
  verifiedAt?: string;
  sourceUrl?: string;
  size?: 'sm' | 'xs';
}

export function VerifiedBadge({
  verifiedAt = 'Recent',
  sourceUrl,
  size = 'xs',
}: VerifiedBadgeProps) {
  let domain = 'Official Portal';
  if (sourceUrl) {
    try {
      domain = new URL(sourceUrl).hostname.replace(/^www\./, '');
    } catch {
      domain = sourceUrl;
    }
  }

  const isSmall = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border shadow-2xs transition-all ${
        isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80`}
      title={`Verified via TinyFish Web Agent from ${domain} on ${verifiedAt}`}
    >
      <CheckCircle2 className={`${isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-emerald-600 dark:text-emerald-400 shrink-0`} />
      <span>Verified {verifiedAt.split('T')[0]}</span>
      {sourceUrl && (
        <span className="opacity-70 flex items-center gap-0.5 border-l border-emerald-200 dark:border-emerald-800 pl-1 ml-0.5 text-[9px] font-mono">
          <Globe className="w-2.5 h-2.5" />
          <span className="truncate max-w-[80px]">{domain}</span>
        </span>
      )}
    </span>
  );
}

