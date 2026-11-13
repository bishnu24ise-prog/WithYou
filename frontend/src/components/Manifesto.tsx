'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

const COLORS = ['#D81B60', '#00A6A6', '#2BB673', '#FF7A1A', '#B79CFF', '#FFB300'];

export default function Manifesto() {
  const [index, setIndex] = useState(0);
  const t = useTranslations('manifesto');

  const words = t.raw('words') as string[];
  const wordList = Array.isArray(words) && words.length > 0 ? words : [
    'Courageous', 'Unbroken', 'Sovereign', 'Resilient', 'Protected', 'Free'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % wordList.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [wordList.length]);

  const currentWord = wordList[index] || wordList[0];
  const currentColor = COLORS[index % COLORS.length];

  return (
    <section id="manifesto" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rani/10 dark:bg-rani/20 text-rani-600 dark:text-rani-300 font-bold text-xs uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 text-rani fill-current" />
          {t('badge')}
        </div>

        <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center flex-wrap gap-3 sm:gap-4">
          <span>{t('sheIs')}</span>
          <div className="relative inline-flex flex-col items-center min-w-[220px] sm:min-w-[320px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                style={{ color: currentColor }}
                className="inline-block"
              >
                {currentWord}.
              </motion.span>
            </AnimatePresence>

            {/* Hand-drawn animated SVG underline stroke */}
            <svg
              className="w-full h-4 sm:h-6 -mt-1 sm:-mt-2 overflow-visible"
              viewBox="0 0 250 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                key={`line-${currentWord}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                d="M 5 15 Q 125 5, 245 12 Q 135 18, 15 16"
                stroke={currentColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-4">
          {t('body1')}
        </p>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          {t('body2')}
        </p>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          <span>{wordList[1] || 'Unbroken'}</span>
          <span>•</span>
          <span>{wordList[2] || 'Sovereign'}</span>
          <span>•</span>
          <span>{wordList[4] || 'Protected'}</span>
        </div>
      </div>
    </section>
  );
}
