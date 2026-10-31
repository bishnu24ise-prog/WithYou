'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';

export default function QuickExitBar() {
  const escCountRef = useRef(0);

  const performQuickExit = useCallback(() => {
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
              24/7 Helplines:
            </span>
            <a
              href="tel:112"
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-rose-600/80 transition-colors font-medium text-white flex items-center gap-1 border border-white/10"
              title="National Emergency Dispatch"
            >
              <span className="font-bold text-rose-400">112</span> All Emergency
            </a>
            <a
              href="tel:1091"
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-rani/80 transition-colors font-medium text-white flex items-center gap-1 border border-white/10"
              title="Women Police Helpline"
            >
              <span className="font-bold text-pink-300">1091</span> Women Police
            </a>
            <a
              href="tel:181"
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-saffron/80 transition-colors font-medium text-white flex items-center gap-1 border border-white/10"
              title="Women One Stop Crisis Centre"
            >
              <span className="font-bold text-amber-300">181</span> Domestic Support
            </a>
          </div>

          {/* Right Action Control: Quick Exit */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={performQuickExit}
              className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold tracking-wide flex items-center gap-1.5 shadow-sm transition-all text-xs border border-rose-400/40"
              title="Quickly exit this website and replace browser history (Shortcut: Press ESC 3 times)"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>QUICK EXIT</span>
              <kbd className="hidden lg:inline-block px-1 py-0.2 bg-black/30 rounded text-[9px] font-mono opacity-80">
                ESC × 3
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Helpline & Exit Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-aubergine/95 backdrop-blur-md border-t border-rani/30 px-3 py-2 flex items-center justify-between gap-2 shadow-2xl">
        <div className="flex items-center gap-1.5">
          <a
            href="tel:112"
            className="px-2.5 py-1.5 rounded-lg bg-rose-600/90 text-white font-bold text-xs flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" />
            112
          </a>
          <a
            href="tel:1091"
            className="px-2.5 py-1.5 rounded-lg bg-rani/90 text-white font-bold text-xs flex items-center gap-1"
          >
            1091
          </a>
          <a
            href="tel:181"
            className="px-2.5 py-1.5 rounded-lg bg-saffron/90 text-white font-bold text-xs flex items-center gap-1"
          >
            181
          </a>
        </div>

        <button
          onClick={performQuickExit}
          className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-black text-xs flex items-center gap-1 shadow-md border border-rose-400"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          QUICK EXIT
        </button>
      </div>
    </>
  );
}
