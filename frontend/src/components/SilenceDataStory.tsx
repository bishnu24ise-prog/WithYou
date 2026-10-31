'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SILENCE_CHAPTERS, StatStory } from '@/data/stats';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { VerifiedBadge } from '@/components/VerifiedBadge';

export default function SilenceDataStory() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const activeChapter: StatStory = SILENCE_CHAPTERS[activeChapterIndex];

  return (
    <section id="the-silence" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-rani/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-lavender/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rani/10 dark:bg-rani/20 text-rani-600 dark:text-rani-300 font-semibold text-xs tracking-wider uppercase">
          Chaptered Data Story
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          The Silence <span className="text-gradient-aurora">In Numbers</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Behind every statistic lies a sister, mother, daughter, or friend. These five verified data chapters reveal why silence is maintained, and why SafeSpark had to be built.
        </p>

        {/* Content Note Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start sm:items-center gap-2.5 text-left">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <span className="font-semibold">Content Note:</span> This section contains verified statistical survey findings regarding domestic abuse, psychological distress, and legal barriers. All data is cited from official WHO, NFHS-5, and NMHS records.
          </div>
        </div>
      </div>

      {/* Chapter Step Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
        {SILENCE_CHAPTERS.map((chapter, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <button
              key={chapter.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`p-3 rounded-2xl text-left transition-all border text-xs sm:text-sm flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-white dark:bg-slate-900 shadow-md border-rani dark:border-rani ring-2 ring-rani/20'
                  : 'bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-rani' : 'text-slate-400'}`}>
                  0{idx + 1}
                </span>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-rani animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
              </div>
              <p className={`font-semibold line-clamp-2 leading-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {chapter.theme}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChapter.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="glass-card rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeChapter.accentColor }} />
                <span>{activeChapter.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {activeChapter.headline}
              </h3>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-6xl font-black tracking-tight" style={{ color: activeChapter.accentColor }}>
                  {activeChapter.number}
                </span>
                <span className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
                  {activeChapter.unit}
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {activeChapter.subtext}
              </p>

              {/* Exact Survey Definition Badge */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
                  Survey Metric Definition
                </div>
                <div>{activeChapter.definition}</div>
              </div>

              {/* Verified Source Citation */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <VerifiedBadge verifiedAt="2026-10-31" sourceUrl={activeChapter.sourceUrl} size="sm" /><span>Source: <strong className="text-slate-700 dark:text-slate-300">{activeChapter.source} ({activeChapter.year})</strong></span>
                <a
                  href={activeChapter.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-peacock hover:underline font-semibold"
                >
                  <span>Read report</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Visualization Column */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50/70 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              {/* Visual Type 1: Figures (1 in 3 Representation) */}
              {activeChapter.visualType === 'figures' && (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="flex items-center justify-center gap-6 sm:gap-8 py-4">
                    {[1, 2, 3].map((num) => {
                      const isAffected = num === 1;
                      return (
                        <div key={num} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-16 h-28 sm:w-20 sm:h-32 rounded-2xl flex items-center justify-center transition-all ${
                              isAffected
                                ? 'bg-gradient-to-t from-rani via-saffron to-marigold text-white shadow-lg shadow-rani/30 scale-105'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-60'
                            }`}
                          >
                            <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
                              <circle cx="12" cy="7" r="4" />
                              <path d="M12 14c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
                            </svg>
                          </div>
                          <span className={`text-xs font-bold ${isAffected ? 'text-rani' : 'text-slate-400'}`}>
                            {isAffected ? '1 in 3 (Affected)' : `Subject ${num}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-center text-slate-500">
                    WHO global epidemiological model representing 840M+ living women.
                  </p>
                </div>
              )}

              {/* Visual Type 2: Circular Progress Ring (Treatment Gap 85.2%) */}
              {activeChapter.visualType === 'ring' && (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-slate-200 dark:text-slate-800"
                        fill="none"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#B79CFF"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 40}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.852) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-lavender-600 dark:text-lavender">85.2%</span>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Untreated</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-lavender" />
                      <span>No Treatment (85.2%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span>Received Care (14.8%)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Visual Type 3: 10x10 Dot Grid (80.1% Never Disclosed or 1.3% Law Gap) */}
              {activeChapter.visualType === 'dotgrid' && (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="grid grid-cols-10 gap-1.5 sm:gap-2 p-2">
                    {[...Array(100)].map((_, i) => {
                      const filled = i < Math.round(activeChapter.numericValue);
                      return (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.005 }}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-colors ${
                            filled
                              ? 'bg-rani dark:bg-rani shadow-sm shadow-rani/40'
                              : 'bg-slate-200 dark:bg-slate-800'
                          }`}
                          title={`Unit ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-center text-slate-500">
                    100-dot population grid: <strong className="text-slate-800 dark:text-slate-200">{Math.round(activeChapter.numericValue)} of 100</strong> units highlighted.
                  </p>
                </div>
              )}

              {/* Visual Type 4: Aid Gap Micro Bars (0.2% vs 99.8%) */}
              {activeChapter.visualType === 'bars' && (
                <div className="w-full flex flex-col gap-5 py-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span>General Development Aid</span>
                      <span className="text-slate-500">99.8%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-slate-400 dark:bg-slate-600 rounded-full w-[99.8%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5 text-marigold-600 dark:text-marigold">
                      <span>Violence Prevention ODA Allocation</span>
                      <span>0.2%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-marigold rounded-full w-[2%] min-w-[6px]" />
                    </div>
                  </div>

                  <p className="text-xs text-center text-slate-500 pt-2">
                    UN Women funding audit: Less than $2 of every $1,000 in international development reaches gender-based violence prevention programs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
