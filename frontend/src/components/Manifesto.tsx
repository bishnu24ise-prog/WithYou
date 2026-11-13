'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const MANIFESTO_WORDS = [
  { word: 'Artist',      color: '#FF7A90' },
  { word: 'Engineer',    color: '#FAD4A8' },
  { word: 'Healer',      color: '#FFC4C4' },
  { word: 'Fighter',     color: '#FFB5D8' },
  { word: 'Storyteller', color: '#E8D7C3' },
  { word: 'Leader',      color: '#FFA8B8' },
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
    <section
      id="manifesto"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative"
    >
      {/* Light mode: warm beige bg; dark mode: deep burgundy bg */}
      <div className="absolute -inset-x-[100vw] inset-y-0 bg-beige-100 dark:bg-burgundy-950 -z-10" />

      {/* Soft radial glow — dark mode only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] dark:bg-[#C0265D]/15 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Eyebrow pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-burgundy-800/80 dark:bg-burgundy-900/80 border border-burgundy-300/30 dark:border-beige-200/15 text-beige-200 dark:text-[#FFA8B8] font-bold text-xs uppercase tracking-widest backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5 text-burgundy-300 dark:text-[#FF7A90] fill-current" />
          The SafeSpark Manifesto
        </div>

        {/* Rotating headline */}
        <div className="text-4xl sm:text-6xl lg:text-7xl font-black text-burgundy-900 dark:text-[#FAF4EC] tracking-tight flex items-center justify-center flex-wrap gap-3 sm:gap-4">
          <span>She is an</span>
          <div className="relative inline-flex flex-col items-center min-w-[220px] sm:min-w-[320px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={current.word}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                style={{
                  color: current.color,
                  textShadow: `0 0 40px ${current.color}55`,
                }}
                className="inline-block font-serif italic font-normal"
              >
                {current.word}.
              </motion.span>
            </AnimatePresence>

            {/* Hand-drawn animated SVG underline */}
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

        {/* Body text */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-burgundy-700 dark:text-[#FAF4EC]/70 font-medium leading-relaxed pt-4">
          A woman is not one fragile thing. She carries quiet galaxies, boundless resilience, and fierce tenderness. SafeSpark exists not to define her by what she has suffered, but to stand beside her with unshakeable confidentiality while she rises.
        </p>

        {/* Word markers */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-burgundy-400 dark:text-[#FAF4EC]/40 uppercase tracking-widest">
          <span>Unbroken</span>
          <span className="text-burgundy-400 dark:text-[#FF7A90]">•</span>
          <span>Sovereign</span>
          <span className="text-burgundy-400 dark:text-[#FF7A90]">•</span>
          <span>Supported</span>
        </div>

        {/* Clear CTA button */}
        <div className="pt-6">
          <a
            href="/create-post"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-burgundy-600 hover:bg-burgundy-500 dark:bg-burgundy-500 dark:hover:bg-burgundy-400 text-beige-50 font-bold text-sm tracking-wide shadow-lg shadow-burgundy-900/20 hover:-translate-y-0.5 active:scale-95 transition-all border border-burgundy-400/40"
          >
            <Heart className="w-4 h-4 fill-current" />
            Get Support Now
          </a>
        </div>
      </div>
    </section>
  );
}
