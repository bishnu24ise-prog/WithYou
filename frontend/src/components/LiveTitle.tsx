'use client';
import React, { useState, useEffect, useRef } from 'react';
import ICON from '../assets/liveicon.json';
import { useTranslations } from 'next-intl';

export default function LiveTitle() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('dashboard');

  useEffect(() => {
    setMounted(true);
    let anim: any = null;

    // Dynamically import lottie-web only on client side after component mounts
    import('lottie-web').then((lottie) => {
      if (containerRef.current) {
        // Clear any previous child elements to prevent duplicate icon rendering
        containerRef.current.innerHTML = '';
        anim = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: ICON,
        });
      }
    }).catch((err) => {
      console.warn('Lottie icon notice:', err);
    });

    return () => {
      if (anim) {
        anim.destroy();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <h1 className="font-bold text-xl tracking-wide text-slate-800 dark:text-slate-100">
          {t('liveDistressTitle')}
        </h1>
      </div>
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        {mounted && <div ref={containerRef} className="w-6 h-6" />}
      </div>
    </div>
  );
}
