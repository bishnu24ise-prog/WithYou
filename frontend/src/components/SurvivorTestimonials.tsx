'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const STORIES = [
  {
    quote: "Leaving took every drop of courage I had. Finding support meant I wasn't invisible anymore.",
    author: "Meera K.",
    city: "Bengaluru, Karnataka",
    badge: "Verified Survivor",
  },
  {
    quote: "When the fear settled, dignity took its place. The night and the streets belong to us too.",
    author: "Priya S.",
    city: "Pune, Maharashtra",
    badge: "Community Advocate",
  },
  {
    quote: "A single spark of belief that I deserve safety and respect changed my entire life.",
    author: "Sunita D.",
    city: "New Delhi",
    badge: "Free Legal Aid Recipient",
  },
  {
    quote: "I didn't think anyone would believe me. Having an encrypted space gave me my voice back.",
    author: "Ananya R.",
    city: "Jaipur, Rajasthan",
    badge: "Protected Survivor",
  },
];

export default function SurvivorTestimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STORIES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + STORIES.length) % STORIES.length);
  const next = () => setIndex((i) => (i + 1) % STORIES.length);

  const story = STORIES[index];

  return (
    <section className="w-full py-10 px-4 sm:px-6 lg:px-8 bg-[#0D0208] border-y border-[#F5EBE1]/8">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-10">

        {/* Left: label */}
        <div className="shrink-0 flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9C1F52]/30 text-[#FFA8B8] text-[10px] font-bold tracking-widest uppercase border border-[#C32F6E]/30">
            <Heart className="w-3 h-3 text-[#FF7A90] fill-current" />
            Their Words
          </span>
          <p className="text-[11px] text-[#E8D7C3]/50 font-medium hidden sm:block">
            Real stories.<br />Real courage.
          </p>
        </div>

        {/* Center: rotating quote */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <p className="text-sm sm:text-base text-[#FAF4EC]/90 italic font-serif leading-relaxed">
                &ldquo;{story.quote}&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-sm font-semibold text-[#FFB5C5]">{story.author}</span>
                <span className="text-[11px] text-[#E8D7C3]/50">{story.city}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#54102C]/60 text-[#FFA8B8] text-[10px] font-semibold border border-[#C32F6E]/25 hidden sm:inline-block">
                  {story.badge}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: prev/next + dots */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={prev}
            aria-label="Previous story"
            className="p-2 rounded-full bg-[#1A040D]/80 border border-[#F5EBE1]/12 text-[#FAF4EC]/60 hover:text-[#FAF4EC] hover:border-[#F5EBE1]/25 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {STORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Story ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-5 h-1.5 bg-[#FF7A90]'
                    : 'w-1.5 h-1.5 bg-[#FAF4EC]/25 hover:bg-[#FAF4EC]/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Next story"
            className="p-2 rounded-full bg-[#1A040D]/80 border border-[#F5EBE1]/12 text-[#FAF4EC]/60 hover:text-[#FAF4EC] hover:border-[#F5EBE1]/25 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
