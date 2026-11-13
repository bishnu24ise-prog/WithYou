'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Scale, HeartHandshake, ArrowRight, Lock } from 'lucide-react';
import womenHeroImg from '@/assets/women-hero.webp';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function HeroSpark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Fireflies drifting softly and reacting to mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const checkMobile = window.innerWidth < 768;
    const particleCount = checkMobile ? 25 : 55;

    const colors = ['#FFB300', '#FF7A1A', '#D81B60', '#B79CFF', '#00A6A6'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1, // soft upward drift
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 650;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Gentle cursor push
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }

        // Draw glowing particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const headlineWords = [
    'A',
    'Silent',
    'Shield,',
    'A',
    'Strong',
    'Voice.',
    'Built',
    'For',
    'Women,',
    'Powered',
    'By',
    'Courage.',
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream/30 via-background to-background dark:from-slate-950 dark:via-background dark:to-background">
      {/* High-Visibility Women Hero Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <Image
          src={womenHeroImg}
          alt="Women Empowerment Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-right opacity-85 dark:opacity-75 transition-opacity duration-700 filter contrast-110 brightness-105 dark:brightness-95"
        />
        {/* Soft directional gradient: preserves readability on text while keeping the woman image vividly visible */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/20 dark:from-slate-950/90 dark:via-slate-950/60 dark:to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-75" />
      </div>

      {/* Background Interactive Firefly Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-[1]"
      />

      {/* Subtle Aurora Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-rani/20 via-saffron/15 to-marigold/10 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-peacock/10 rounded-full blur-3xl pointer-events-none z-[1]" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Column: Staggered Blur-to-Sharp Text & Actions */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          {/* Eyebrow badge with mandala motif */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rani/10 dark:bg-rani/20 border border-rani/30 text-rani-600 dark:text-rani-300 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-marigold animate-spin-slow" />
            <span>THE SPARK WITHIN • CONFIDENTIAL & ENCRYPTED</span>
          </div>

          {/* Staggered Blur-to-Sharp Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
            {headlineWords.map((word, idx) => {
              const isAccent =
                word.includes('Shield') ||
                word.includes('Voice') ||
                word.includes('Courage');
              return (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
                  animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.07, ease: 'easeOut' }}
                  className={`inline-block mr-2 sm:mr-3 ${
                    isAccent ? 'text-gradient-aurora' : ''
                  }`}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>

          {/* Body Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-base sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed font-normal"
          >
            SafeSpark provides a discreet refuge: covert distress signals hidden inside everyday images, instant legal clarity on PWDVA 2005 & BNS rights, and a confidential 3D AI companion who listens without judgment.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link
              href="/create-post"
              prefetch={false}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rani via-saffron to-marigold hover:opacity-95 text-white font-bold text-base shadow-lg shadow-rani/25 hover:shadow-xl hover:shadow-rani/35 hover:-translate-y-0.5 transition-all flex items-center gap-2.5 group"
            >
              <Lock className="w-5 h-5 text-marigold-100 group-hover:rotate-12 transition-transform" />
              <span>Get Support Quietly</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/lawbot"
              prefetch={false}
              className="px-6 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border-2 border-peacock/40 hover:border-peacock text-peacock dark:text-peacock-300 font-bold text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Scale className="w-5 h-5 text-peacock" />
              <span>Know Your Rights</span>
            </Link>

            <Link
              href="/therapybot"
              prefetch={false}
              className="px-4 py-3 rounded-2xl bg-lavender/10 hover:bg-lavender/20 text-slate-700 dark:text-lavender-200 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-lavender" />
              <span>3D Companion</span>
            </Link>
          </motion.div>

          {/* Quick reassurance micro-tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs text-slate-500 dark:text-slate-400 pt-3"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
              No phone logs created
            </span>
            <span className="hidden xs:inline">•</span>
            <span>Zero ad tracking</span>
            <span className="hidden xs:inline">•</span>
            <span>Instant history cleanup</span>
          </motion.div>
        </div>

        {/* Right Column: Custom Animated SVG Lotus + Rotating Mandala Ring + Spark */}
        <div className="flex-1 flex justify-center items-center relative w-full max-w-[420px] sm:max-w-[480px] aspect-square">
          {/* Slow-Rotating Kolam / Mandala Geometry */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin-slow opacity-60 dark:opacity-40">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full text-marigold/40 dark:text-marigold/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <circle cx="200" cy="200" r="185" strokeDasharray="4 8" />
              <circle cx="200" cy="200" r="160" />
              <circle cx="200" cy="200" r="135" strokeDasharray="6 6" />
              {/* Radial mandala petals */}
              {[...Array(12)].map((_, i) => (
                <path
                  key={i}
                  d="M200 65 C185 110 185 150 200 170 C215 150 215 110 200 65"
                  transform={`rotate(${i * 30} 200 200)`}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
              {[...Array(24)].map((_, i) => (
                <circle
                  key={i}
                  cx="200"
                  cy="25"
                  r="2.5"
                  fill="currentColor"
                  transform={`rotate(${i * 15} 200 200)`}
                />
              ))}
            </svg>
          </div>

          {/* Reverse Rotating Outer Bangle Ring */}
          <div className="absolute inset-4 flex items-center justify-center pointer-events-none animate-spin-slow-reverse opacity-40 dark:opacity-30">
            <svg
              viewBox="0 0 350 350"
              className="w-full h-full text-peacock/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              <circle cx="175" cy="175" r="150" strokeDasharray="2 12" />
              {[...Array(8)].map((_, i) => (
                <polygon
                  key={i}
                  points="175,40 182,55 168,55"
                  transform={`rotate(${i * 45} 175 175)`}
                  fill="currentColor"
                />
              ))}
            </svg>
          </div>

          {/* Center SVG Lotus: Stroke draw & gradient fill */}
          <div className="relative z-10 w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center filter drop-shadow-2xl">
            <svg
              viewBox="0 0 300 300"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lotusOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D81B60" />
                  <stop offset="60%" stopColor="#FF7A1A" />
                  <stop offset="100%" stopColor="#FFB300" />
                </linearGradient>
                <linearGradient id="lotusInnerGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF7A1A" />
                  <stop offset="50%" stopColor="#FFB300" />
                  <stop offset="100%" stopColor="#FFF8E1" />
                </linearGradient>
                <linearGradient id="lotusTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00A6A6" />
                  <stop offset="100%" stopColor="#B79CFF" />
                </linearGradient>
                <filter id="sparkGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Lotus Leaf / Water Foundation */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.85 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                d="M 60 230 C 110 260, 190 260, 240 230 C 210 245, 90 245, 60 230 Z"
                fill="url(#lotusTealGrad)"
                stroke="#00A6A6"
                strokeWidth="1.5"
              />

              {/* Outer Petals (Left and Right) */}
              <motion.path
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.75 }}
                transition={{ duration: 1.8, delay: 0.2, ease: 'easeOut' }}
                d="M 150 220 C 80 200, 30 160, 45 120 C 65 145, 105 185, 150 220 Z"
                fill="url(#lotusOuterGrad)"
                stroke="#D81B60"
                strokeWidth="2"
              />
              <motion.path
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.75 }}
                transition={{ duration: 1.8, delay: 0.2, ease: 'easeOut' }}
                d="M 150 220 C 220 200, 270 160, 255 120 C 235 145, 195 185, 150 220 Z"
                fill="url(#lotusOuterGrad)"
                stroke="#D81B60"
                strokeWidth="2"
              />

              {/* Mid Petals */}
              <motion.path
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.85 }}
                transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
                d="M 150 220 C 100 170, 75 125, 95 85 C 120 120, 135 170, 150 220 Z"
                fill="url(#lotusOuterGrad)"
                stroke="#FF7A1A"
                strokeWidth="2"
              />
              <motion.path
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.85 }}
                transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
                d="M 150 220 C 200 170, 225 125, 205 85 C 180 120, 165 170, 150 220 Z"
                fill="url(#lotusOuterGrad)"
                stroke="#FF7A1A"
                strokeWidth="2"
              />

              {/* Central Hero Petal */}
              <motion.path
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.95 }}
                transition={{ duration: 1.8, delay: 0.8, ease: 'easeOut' }}
                d="M 150 220 C 125 155, 125 105, 150 50 C 175 105, 175 155, 150 220 Z"
                fill="url(#lotusInnerGrad)"
                stroke="#FFB300"
                strokeWidth="2.2"
              />

              {/* Rising Glowing Hero Spark from the Lotus Centre */}
              <g filter="url(#sparkGlow)">
                {/* Pulsing Spark Particle */}
                <motion.circle
                  cx="150"
                  cy="125"
                  r="8"
                  fill="#FFF"
                  animate={{
                    cy: [135, 115, 135],
                    scale: [0.9, 1.25, 0.9],
                    opacity: [0.85, 1, 0.85],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.circle
                  cx="150"
                  cy="125"
                  r="14"
                  fill="#FFB300"
                  opacity="0.6"
                  animate={{
                    cy: [135, 115, 135],
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* 4-point Diamond Starburst */}
                <motion.path
                  d="M 150 105 L 154 121 L 170 125 L 154 129 L 150 145 L 146 129 L 130 125 L 146 121 Z"
                  fill="#FFFFFF"
                  animate={{
                    scale: [0.8, 1.15, 0.8],
                    rotate: [0, 90, 180],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ transformOrigin: '150px 125px' }}
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
