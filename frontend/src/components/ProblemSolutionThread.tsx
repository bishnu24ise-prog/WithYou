'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { SOLUTION_BRIDGES } from '@/data/stats';
import { Shield, HeartHandshake, Scale, Activity, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ProblemSolutionThread() {
  const t = useTranslations('pipeline');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Shield':
        return <Shield className="w-6 h-6 text-rani" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-lavender" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-saffron" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-peacock" />;
      default:
        return <Shield className="w-6 h-6 text-rani" />;
    }
  };

  const bridgeKeys = [
    { pTitle: 's1ProblemTitle', pDesc: 's1ProblemDesc', sTag: 's1SolutionTag', sTitle: 's1SolutionTitle', sDesc: 's1SolutionDesc' },
    { pTitle: 's2ProblemTitle', pDesc: 's2ProblemDesc', sTag: 's2SolutionTag', sTitle: 's2SolutionTitle', sDesc: 's2SolutionDesc' },
    { pTitle: 's3ProblemTitle', pDesc: 's3ProblemDesc', sTag: 's3SolutionTag', sTitle: 's3SolutionTitle', sDesc: 's3SolutionDesc' },
    { pTitle: 's4ProblemTitle', pDesc: 's4ProblemDesc', sTag: 's4SolutionTag', sTitle: 's4SolutionTitle', sDesc: 's4SolutionDesc' },
    { pTitle: 's5ProblemTitle', pDesc: 's5ProblemDesc', sTag: 's5SolutionTag', sTitle: 's5SolutionTitle', sDesc: 's5SolutionDesc' },
  ] as const;

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-peacock/10 text-peacock font-semibold text-xs tracking-wider uppercase">
          {t('badge')}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('title')} <span className="text-gradient-peacock">{t('titleHighlight')}</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {SOLUTION_BRIDGES.map((bridge, index) => {
          const k = bridgeKeys[index] || bridgeKeys[0];
          return (
            <div
              key={bridge.problemId}
              className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-200 dark:border-slate-800 relative group overflow-hidden"
            >
              {/* Top decorative gradient edge */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: bridge.color }}
              />

              <div>
                {/* Problem tag */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-900/60">
                    {t('problemLabel')} 0{index + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t(k.sTag)}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {t(k.pTitle)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  {t(k.pDesc)}
                </p>

                {/* Connected Thread Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="w-full border-t border-dashed border-slate-300 dark:border-slate-700" />
                  <span className="absolute px-3 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    {t('safesparkAnswer')}
                  </span>
                </div>

                {/* Solution Answer Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
                      {getIcon(bridge.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                        {t(k.sTitle)}
                      </h4>
                      <span className="text-[11px] font-semibold text-peacock dark:text-peacock-400">
                        {t(k.sTag)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {t(k.sDesc)}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={bridge.routeHref}
                  prefetch={false}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-md transition-all group-hover:shadow-lg"
                  style={{ backgroundColor: bridge.color }}
                >
                  <span>{t('launchPrefix')} {t(k.sTitle)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
