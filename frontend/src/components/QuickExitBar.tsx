'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { PhoneCall, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QuickExitBar() {
  const escCountRef = useRef(0);
  const t = useTranslations('quickExit');

  const performQuickExit = useCallback(() => {
    // Clear cookies immediately
    if (typeof document !== 'undefined') {
      document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    // Clear session and local storage
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
    }
    // Replace current history to leave no traces of the site
    window.location.replace('https://www.google.com/search?q=today+weather+and+news');
  }, []);

  // Listen for Triple Esc keypress
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escCountRef.current += 1;
        if (escCountRef.current >= 3) {
          performQuickExit();
          escCountRef.current = 0;
          return;
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
          escCountRef.current = 0;
        }, 1200);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [performQuickExit]);

  return (
    <>
      {/* Desktop & Tablet Top Safety Banner */}
      <div className="w-full bg-gradient-to-r from-plum via-aubergine to-plum text-white border-b border-rani/20 py-1.5 px-3 sm:px-6 relative z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Quick Helplines */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1 text-marigold font-semibold tracking-wide uppercase text-[10px] sm:text-xs">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse text-marigold" />
              {t('helplineTitle')}
            </span>
            <a
              href="tel:1091"
              className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono tracking-tight transition"
              title="National Women Helpline (1091)"
            >
              {t('womenHelpline')}
            </a>
            <a
              href="tel:112"
              className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono tracking-tight transition"
              title="National Emergency Police (112)"
            >
              {t('emergencyHelpline')}
            </a>
            <a
              href="tel:181"
              className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono tracking-tight transition"
              title="Domestic Abuse Helpline (181)"
            >
              {t('domesticAbuseHelpline')}
            </a>
          </div>

          {/* Quick Exit Action */}
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-white/70 text-[11px]">
              {t('tripleEscTip')}
            </span>
            <button
              onClick={performQuickExit}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-md transition-colors flex items-center gap-1 shadow-sm uppercase tracking-wider text-[11px]"
              title="Click or press Esc 3 times to immediately navigate to Google News and wipe session history"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t('label')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
