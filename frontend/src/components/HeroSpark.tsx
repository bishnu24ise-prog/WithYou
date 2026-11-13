'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  EyeOff,
  Zap,
  ArrowRight,
  Lock,
  Scale,
  Users,
  Heart,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import WomenStoryCinematicBackground from './WomenStoryCinematicBackground';
import TypewriterText from './TypewriterText';

// Nighttime safety statistics across regions (Gallup 2025 verified dataset)
const SAFETY_GAP_DATA: Record<string, { day: number; night: number }> = {
  India: { day: 76, night: 52 },
  Urban: { day: 79, night: 48 },
  Rural: { day: 72, night: 55 },
};

export default function HeroSpark() {
  const t = useTranslations('hero');
  const [selectedRegion, setSelectedRegion] = useState<'India' | 'Urban' | 'Rural'>('India');
  const fireflyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background floating firefly embers (burgundy & champagne warm glow)
  useEffect(() => {
    const canvas = fireflyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 900);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.2 - Math.random() * 0.3,
      size: 1 + Math.random() * 2.2,
      alpha: 0.3 + Math.random() * 0.6,
      color: Math.random() > 0.5 ? '#FFA8B8' : '#FAF4EC',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 900;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currentStats = SAFETY_GAP_DATA[selectedRegion];

  return (
    <section className="relative min-h-[85vh] w-full flex flex-col justify-start pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-[#0D0208] text-[#FAF4EC]">
      {/* 1. Authentic Women's Story Cinematic Background */}
      <WomenStoryCinematicBackground />

      {/* 2. Floating Fireflies Canvas */}
      <canvas
        ref={fireflyCanvasRef}
        className="absolute inset-0 pointer-events-none z-[2]"
      />

      {/* 3. Subtle ambient light leak & radial glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-gradient-to-b from-[#C32F6E]/20 via-[#9C1F52]/10 to-transparent rounded-full blur-[100px] pointer-events-none z-[2]" />

      {/* ======================================================== */}
      {/* HERO CENTERED HEADER */}
      {/* ======================================================== */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center justify-center pt-6 sm:pt-12 pb-12">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3D0B20]/75 border border-[#F5EBE1]/20 text-[#FAF4EC] text-xs sm:text-sm font-medium tracking-wide shadow-lg mb-6 backdrop-blur-md"
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
          >
            <Sparkles className="w-3.5 h-3.5 text-burgundy-300" />
          </motion.span>
          <span>{t('eyebrow')}</span>
        </motion.div>

        {/* Big Centered Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-semibold font-display tracking-tight leading-[1.12] text-[#FAF4EC] max-w-4xl"
        >
          {t('headlineLine1')}
          <br />
          <span className="font-display italic font-normal text-gradient-sparkle">
            {t('headlineLine2')}
          </span>
        </motion.h1>

        {/* Centered Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mt-6 mb-8 text-center space-y-2"
        >
          <p className="text-base sm:text-lg text-[#FAF4EC]/90 font-normal leading-relaxed">
            {t('subtitle').split('. You deserve')[0]}.
          </p>
          <p className="text-base sm:text-lg text-[#FAF4EC]/70 font-normal leading-relaxed italic">
            You deserve to feel safe. You deserve to be heard.
          </p>
        </motion.div>

        {/* Centered Action CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-5"
        >
          <Link
            href="/create-post"
            prefetch={false}
            className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#B0164E] via-[#C0265D] to-[#E04D7A] hover:brightness-110 text-[#FAF4EC] font-bold text-sm sm:text-base shadow-xl shadow-[#C0265D]/35 hover:shadow-2xl hover:shadow-[#C0265D]/50 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 border border-[#F5EBE1]/25 group"
          >
            <span>{t('ctaSupport')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/lawbot"
            prefetch={false}
            className="px-7 py-3.5 rounded-full bg-[#FAF4EC]/10 hover:bg-[#FAF4EC]/20 text-[#FAF4EC] font-bold text-sm sm:text-base border border-[#F5EBE1]/35 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <span>{t('ctaRights')}</span>
          </Link>
        </motion.div>

        {/* Centered Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-[#E8D7C3]/80 mt-8 pt-2"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-burgundy-300" />
            {t('badgeNoLogs')}
          </span>
          <span className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-burgundy-300" />
            {t('badgeNoTracking')}
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-burgundy-300" />
            {t('badgeInstantExit')}
          </span>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* MIDDLE DASHBOARD: THE 4 GLASSMORPHIC CARDS IN BURGUNDY */}
      {/* ======================================================== */}
      <div className="relative z-10 max-w-6xl mx-auto w-full mt-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* CARD 1: The Silence in Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-[#1A040D]/60 backdrop-blur-md border border-[#F5EBE1]/12 hover:-translate-y-1 transition-transform duration-300"
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#54102C]/80 border border-[#F5EBE1]/20 text-[#FFA8B8] text-[11px] font-semibold tracking-wide uppercase mb-3">
                {t('cardSilenceTag')}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-[#FAF4EC] leading-tight mb-2">
                {t('cardSilenceTitle')}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#FAF4EC]/75 leading-relaxed">
                {t('cardSilenceBody')}
              </p>
            </div>
            <Link
              href="/#data-story"
              className="text-burgundy-300 hover:text-[#FFA8B8] font-bold text-xs inline-flex items-center gap-1.5 mt-5 group"
            >
              <span>{t('cardSilenceCta')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* CARD 2: Nighttime Safety Gap (Interactive Tabs + Chart) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-[#1A040D]/60 backdrop-blur-md border border-[#F5EBE1]/12 hover:-translate-y-1 transition-transform duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold font-display text-[#FAF4EC]">
                  {t('cardNightTitle')}
                </h3>
                {/* Region Selector Tabs */}
                <div className="flex items-center p-0.5 rounded-full bg-[#1A040D]/80 border border-[#F5EBE1]/15 text-[10px]">
                  {(['India', 'Urban', 'Rural'] as const).map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-2 py-0.5 rounded-full transition-all font-semibold ${selectedRegion === region
                          ? 'bg-[#C0265D] text-beige-50 shadow-sm'
                          : 'text-[#E8D7C3]/70 hover:text-white'
                        }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-[#FAF4EC]/70 mb-4">
                {t('cardNightBody')}
              </p>

              {/* Dynamic Animated Bars */}
              <div className="flex items-end justify-center gap-6 h-28 pt-2">
                {/* Day Bar */}
                <div className="flex flex-col items-center gap-1.5 w-14">
                  <span className="text-xs font-bold text-[#FAF4EC]">{currentStats.day}%</span>
                  <div className="w-full bg-[#3D0B20]/60 rounded-t-xl h-20 flex items-end p-1">
                    <motion.div
                      key={`day-${selectedRegion}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${currentStats.day}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-[#B0164E] to-[#C32F6E] rounded-t-lg shadow-[0_0_12px_rgba(195,47,110,0.5)]"
                    />
                  </div>
                  <span className="text-[10px] text-[#E8D7C3]/80">Day</span>
                </div>

                {/* Night Bar */}
                <div className="flex flex-col items-center gap-1.5 w-14">
                  <span className="text-xs font-bold text-[#FAF4EC]">{currentStats.night}%</span>
                  <div className="w-full bg-[#3D0B20]/60 rounded-t-xl h-20 flex items-end p-1">
                    <motion.div
                      key={`night-${selectedRegion}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${currentStats.night}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-[#54102C] to-[#74173D] rounded-t-lg shadow-[0_0_8px_rgba(84,16,44,0.4)]"
                    />
                  </div>
                  <span className="text-[10px] text-[#E8D7C3]/80">Night</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 3: 1 in 3 Women */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between items-center text-center bg-[#1A040D]/60 backdrop-blur-md border border-[#F5EBE1]/12 hover:-translate-y-1 transition-transform duration-300"
          >
            {/* 3 Silhouette figures */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
                className="p-2.5 rounded-full bg-[#C0265D]/40 text-[#FF7A90] border border-[#FF7A90]/40 shadow-[0_0_16px_rgba(255,122,144,0.4)]"
              >
                <Users className="w-6 h-6" />
              </motion.div>
              <div className="p-2.5 rounded-full bg-[#3D0B20]/60 text-[#E8D7C3]/40 border border-[#F5EBE1]/10">
                <Users className="w-6 h-6" />
              </div>
              <div className="p-2.5 rounded-full bg-[#3D0B20]/60 text-[#E8D7C3]/40 border border-[#F5EBE1]/10">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="my-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-display text-[#FAF4EC] tracking-tight block">
                {t('cardOneInThreeBig')}
              </span>
              <p className="text-xs sm:text-[13px] text-[#FAF4EC]/80 mt-1.5 leading-snug">
                {t('cardOneInThreeBody')}
              </p>
            </div>

            <span className="text-[10px] text-[#E8D7C3]/60 italic font-mono">
              {t('cardOneInThreeSource')}
            </span>
          </motion.div>

          {/* CARD 4: Know more. Stay safe. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-[#1A040D]/60 backdrop-blur-md border border-[#F5EBE1]/12 hover:-translate-y-1 transition-transform duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2 rounded-xl bg-[#54102C]/60 text-[#FF7A90] border border-[#F5EBE1]/15">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-burgundy-900/60 text-beige-200 text-[10px] font-semibold border border-beige-300/30">
                  <CheckCircle2 className="w-3 h-3 text-beige-300" />
                  Verified
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#FAF4EC] leading-tight mb-2">
                {t('cardKnowTitle')}
              </h3>
              <p className="text-xs text-[#FAF4EC]/75 leading-relaxed">
                {t('cardKnowBody')}
              </p>
            </div>
            <Link
              href="/lawbot"
              className="text-burgundy-300 hover:text-[#FFA8B8] font-bold text-xs inline-flex items-center gap-1.5 mt-5 group"
            >
              <span>{t('cardKnowCta')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK ACTIONS ROW: "Your Safety, Our Priority" */}
      {/* ======================================================== */}
      <div className="relative z-10 max-w-6xl mx-auto w-full mt-2 mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
          <div className="lg:w-44 shrink-0 text-center lg:text-left">
            <span className="text-base sm:text-lg font-black text-[#FAF4EC] block leading-tight">
              {t('quickHeader1')}
            </span>
            <span className="text-base sm:text-lg font-bold text-[#FFA8B8] block leading-tight">
              {t('quickHeader2')}
            </span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            {/* 1. Report Abuse */}
            <Link
              href="/create-post"
              className="rounded-xl p-3.5 flex items-center justify-between gap-3 group bg-[#1A040D]/50 backdrop-blur-sm border border-[#F5EBE1]/10 hover:border-[#F5EBE1]/20 hover:bg-[#1A040D]/70 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#B0164E] to-[#E04D7A] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm text-[#FAF4EC] block leading-tight">
                    {t('qaReportTitle')}
                  </span>
                  <span className="text-[11px] text-[#FAF4EC]/65 block leading-snug line-clamp-1">
                    {t('qaReportBody')}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-burgundy-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            {/* 2. LawBot */}
            <Link
              href="/lawbot"
              className="rounded-xl p-3.5 flex items-center justify-between gap-3 group bg-[#1A040D]/50 backdrop-blur-sm border border-[#F5EBE1]/10 hover:border-[#F5EBE1]/20 hover:bg-[#1A040D]/70 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-burgundy-500 to-burgundy-300 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Scale className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm text-[#FAF4EC] block leading-tight">
                    {t('qaLawbotTitle')}
                  </span>
                  <span className="text-[11px] text-[#FAF4EC]/65 block leading-snug line-clamp-1">
                    {t('qaLawbotBody')}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-burgundy-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            {/* 3. Find Support */}
            <Link
              href="/directory"
              className="rounded-xl p-3.5 flex items-center justify-between gap-3 group bg-[#1A040D]/50 backdrop-blur-sm border border-[#F5EBE1]/10 hover:border-[#F5EBE1]/20 hover:bg-[#1A040D]/70 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-burgundy-600 to-burgundy-400 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm text-[#FAF4EC] block leading-tight">
                    {t('qaDirectoryTitle')}
                  </span>
                  <span className="text-[11px] text-[#FAF4EC]/65 block leading-snug line-clamp-1">
                    {t('qaDirectoryBody')}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-burgundy-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            {/* 4. Your Companion */}
            <Link
              href="/therapybot"
              className="rounded-xl p-3.5 flex items-center justify-between gap-3 group bg-[#1A040D]/50 backdrop-blur-sm border border-[#F5EBE1]/10 hover:border-[#F5EBE1]/20 hover:bg-[#1A040D]/70 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-burgundy-700 to-burgundy-300 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm text-[#FAF4EC] block leading-tight">
                    {t('qaTherapyTitle')}
                  </span>
                  <span className="text-[11px] text-[#FAF4EC]/65 block leading-snug line-clamp-1">
                    {t('qaTherapyBody')}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-burgundy-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
