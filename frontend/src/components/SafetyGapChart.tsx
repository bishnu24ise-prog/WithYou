'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COUNTRY_SAFETY_DATA } from '@/data/stats';
import { Globe, Moon, Shield, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SafetyGapChart() {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GL');
  const t = useTranslations('safetyGap');

  const activeMetric =
    COUNTRY_SAFETY_DATA.find((c) => c.code === selectedCountryCode) ||
    COUNTRY_SAFETY_DATA[0];

  return (
    <section id="safety-gap" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Background Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-peacock/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peacock/10 text-peacock font-semibold text-xs tracking-wider uppercase mb-2">
              <Moon className="w-3.5 h-3.5 text-peacock" />
              {t('badge')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('title')} <span className="text-gradient-peacock">{t('titleHighlight')}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {t('subtitle')}
            </p>
          </div>

          <a
            href="https://www.gallup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-peacock font-medium transition-colors"
          >
            <span>{t('gallupPoll')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Interactive Country Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {COUNTRY_SAFETY_DATA.map((item) => {
            const isSelected = item.code === selectedCountryCode;
            return (
              <button
                key={item.code}
                onClick={() => setSelectedCountryCode(item.code)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-peacock text-white border-peacock shadow-md shadow-peacock/25'
                    : 'bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{item.country}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  Δ {item.gap}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Comparative Split Cards & Animated Horizontal Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Bars Visualizer */}
          <div className="lg:col-span-7 space-y-6">
            {/* Women Metric Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="flex items-center gap-2 text-rani">
                  <span className="w-2.5 h-2.5 rounded-full bg-rani" />
                  {t('womenSafeCol')}:
                </span>
                <span className="text-xl font-bold text-rani">{activeMetric.womenSafe}%</span>
              </div>
              <div className="w-full h-5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                <motion.div
                  key={`women-${activeMetric.code}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${activeMetric.womenSafe}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-rani to-saffron"
                />
              </div>
            </div>

            {/* Men Metric Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="flex items-center gap-2 text-peacock">
                  <span className="w-2.5 h-2.5 rounded-full bg-peacock" />
                  {t('menSafeCol')}:
                </span>
                <span className="text-xl font-bold text-peacock">{activeMetric.menSafe}%</span>
              </div>
              <div className="w-full h-5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                <motion.div
                  key={`men-${activeMetric.code}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${activeMetric.menSafe}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-peacock to-lavender"
                />
              </div>
            </div>

            {/* Gap Metric Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {t('gapCol')} (<strong>{activeMetric.country}</strong>):
              </div>
              <div className="flex items-center gap-2 font-black text-rose-600 dark:text-rose-400 text-lg">
                <span>{activeMetric.gap}%</span>
              </div>
            </div>
          </div>

          {/* Right Insights Card */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Globe className="w-4 h-4 text-peacock" />
              <span>{activeMetric.region} ({t('regionCol')})</span>
            </div>

            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeMetric.country}
            </h4>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeMetric.notes}
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-rani shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">{t('keyFinding')} </strong>
                  <span>{t('keyFindingDesc')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
