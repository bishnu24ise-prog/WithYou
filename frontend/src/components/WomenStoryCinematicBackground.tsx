'use client';

import React from 'react';
import Image from 'next/image';

export default function WomenStoryCinematicBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Full-bleed background image */}
      <Image
        src="/images/moonlit-lantern.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Single clean dark overlay */}
      <div className="absolute inset-0 bg-[#0D0208]/55" />

      {/* Bottom vignette for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0208]/90 via-[#0D0208]/20 to-[#0D0208]/50" />

      {/* Subtle warm glow behind center content */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C32F6E]/12 rounded-full blur-[120px] pointer-events-none" />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
