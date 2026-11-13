'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { PhoneCall } from 'lucide-react';

export default function QuickExitBar() {
  const escCountRef = useRef(0);

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
    <div className="w-full bg-[#15030A] text-[#FAF4EC] border-b border-[#F5EBE1]/10 py-1.5 px-4 sm:px-6 relative z-50 shadow-sm text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Quick Helplines */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 text-[#FFA8B8] font-medium">
            <PhoneCall className="w-3 h-3 text-[#FFA8B8]" />
            <a href="tel:112" className="hover:text-white transition font-mono font-bold">112</a>
            <span className="opacity-40">|</span>
            <a href="tel:1091" className="hover:text-white transition font-mono font-bold">1091</a>
            <span className="opacity-40">|</span>
            <a href="tel:181" className="hover:text-white transition font-mono font-bold">181</a>
            <span className="opacity-40">|</span>
            <a href="tel:14416" className="hover:text-white transition font-mono font-bold" title="Tele-MANAS Mental Health">14416</a>
          </span>
        </div>

        {/* Quick Exit Action Pill */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[#E8D7C3]/60 text-[10px] font-mono">
            Press Esc
          </span>
          <button
            onClick={performQuickExit}
            className="bg-gradient-to-r from-[#B0164E] to-[#C32F6E] hover:brightness-110 text-[#FAF4EC] font-bold px-3 py-0.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm text-[11px] tracking-wide border border-[#F5EBE1]/20 active:scale-95"
            title="Click or press Esc 3 times to immediately navigate to Google News and wipe session history"
          >
            <span>QUICK EXIT</span>
            <span className="text-[10px] opacity-80">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
