'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const MANIFESTO_WORDS = [
  { word: 'Artist', color: '#D81B60' }, // Rani
  { word: 'Engineer', color: '#00A6A6' }, // Peacock
  { word: 'Healer', color: '#2BB673' }, // Jade
  { word: 'Fighter', color: '#FF7A1A' }, // Saffron
  { word: 'Storyteller', color: '#B79CFF' }, // Lavender
  { word: 'Leader', color: '#FFB300' }, // Marigold
];

export default function Manifesto() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MANIFESTO_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const current = MANIFESTO_WORDS[index];

  return (
    <section id="manifesto" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rani/10 dark:bg-rani/20 text-rani-600 dark:text-rani-300 font-bold text-xs uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 text-rani fill-current" />
          The SafeSpark Manifesto
        </div>

        <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center flex-wrap gap-3 sm:gap-4">
          <span>She is an</span>
          <div className="relative inline-flex flex-col items-center min-w-[220px] sm:min-w-[320px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.word}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                style={{ color: current.color }}
                className="inline-block"
              >
                {current.word}.
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
                key={`line-${current.word}`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                d="M 5 15 Q 125 5, 245 12 Q 135 18, 15 16"
                stroke={current.color}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-4">
          A woman is not one fragile thing. She carries quiet galaxies, boundless resilience, and fierce tenderness. SafeSpark exists not to define her by what she has suffered, but to stand beside her with unshakeable confidentiality while she rises.
        </p>

        <div className="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          <span>Unbroken</span>
          <span>•</span>
          <span>Sovereign</span>
          <span>•</span>
          <span>Supported</span>
        </div>
      </div>
    </section>
  );
}
