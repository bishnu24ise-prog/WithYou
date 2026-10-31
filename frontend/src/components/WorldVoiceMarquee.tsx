'use client';

import React, { useState } from 'react';
import { WORLD_VOICES_ROW_1, WORLD_VOICES_ROW_2, MarqueeCard } from '@/data/stats';
import { ExternalLink, RotateCw, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

function FlipCard({ card }: { card: MarqueeCard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-[300px] sm:w-[350px] h-[230px] shrink-0 cursor-pointer select-none perspective-[1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsFlipped(!isFlipped);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Card: ${card.theme}. Click to flip.`}
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of Card: The Reality & Verified Source */}
        <div className="absolute inset-0 [backface-visibility:hidden] glass-card rounded-2xl p-5 flex flex-col justify-between border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-rani-600 dark:text-rani-400 uppercase tracking-wider text-[11px]">
                {card.theme}
              </span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <RotateCw className="w-2.5 h-2.5" /> Tap to flip
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">
              {card.statHighlight}
            </div>

            {/* Short summary in own words (<= 25 words) */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
              {card.summary}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium truncate max-w-[190px]">
              {card.sourceName} ({card.year})
            </span>
            <a
              href={card.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-peacock hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Back of Card: How SafeSpark Responds */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl p-5 flex flex-col justify-between bg-gradient-to-br from-plum via-aubergine to-slate-950 text-white border border-rani/40 shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-marigold font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> How SafeSpark Responds
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <RotateCw className="w-2.5 h-2.5" /> Flip back
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white mb-1.5">
              {card.safeSparkSolution.title}
            </h4>

            <p className="text-xs text-slate-200 line-clamp-4 leading-relaxed">
              {card.safeSparkSolution.description}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={card.safeSparkSolution.actionHref}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rani hover:bg-rani-600 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>{card.safeSparkSolution.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorldVoiceMarquee() {
  return (
    <section id="what-the-world-is-saying" className="py-20 relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rani/10 dark:bg-rani/20 text-rani-600 dark:text-rani-300 font-semibold text-xs tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-marigold" />
          Global Survey & Evidence Registry
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          What The World <span className="text-gradient-aurora">Is Saying</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Hover or tap any card to flip it and explore how SafeSpark directly counters each challenge with discreet, privacy-first technology.
        </p>
      </div>

      {/* Row 1 Marquee (Moving Left) */}
      <div className="relative w-full overflow-hidden mb-6 group">
        <div className="flex gap-4 sm:gap-6 animate-marquee-left group-hover:[animation-play-state:paused] w-max">
          {[...WORLD_VOICES_ROW_1, ...WORLD_VOICES_ROW_1].map((card, i) => (
            <FlipCard key={`r1-${card.id}-${i}`} card={card} />
          ))}
        </div>
      </div>

      {/* Row 2 Marquee (Moving Right) */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex gap-4 sm:gap-6 animate-marquee-right group-hover:[animation-play-state:paused] w-max">
          {[...WORLD_VOICES_ROW_2, ...WORLD_VOICES_ROW_2].map((card, i) => (
            <FlipCard key={`r2-${card.id}-${i}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
