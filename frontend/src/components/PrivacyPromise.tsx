'use client';

import React from 'react';
import { ShieldCheck, EyeOff, Trash2, KeyRound, Lock } from 'lucide-react';

export default function PrivacyPromise() {
  const promises = [
    {
      icon: <EyeOff className="w-6 h-6 text-rani" />,
      title: 'Zero Ad Trackers or Pixels',
      description: 'We do not run Meta pixels, Google Analytics, or third-party marketing tags that could leak your browsing patterns.',
    },
    {
      icon: <Trash2 className="w-6 h-6 text-burgundy-300" />,
      title: 'Emergency Cache Cleanup',
      description: 'Clicking Quick Exit or pressing Esc x 3 immediately redirects to a neutral search query and clears temporary local cache.',
    },
    {
      icon: <KeyRound className="w-6 h-6 text-beige-400" />,
      title: 'Anonymous Incident Dispatch',
      description: 'You can submit distress alerts without signing in or providing your email. We prioritize physical safety above all.',
    },
    {
      icon: <Lock className="w-6 h-6 text-burgundy-400" />,
      title: 'Encrypted Steganography',
      description: 'Distress messages and location markers are embedded inside innocuous pixel matrices indistinguishable from common phone photos.',
    },
  ];

  return (
    <section id="privacy" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rani/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy-500/10 text-burgundy-300 font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-burgundy-300" />
            Zero-Compromise Security Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Our Ironclad <span className="text-gradient-aurora">Privacy Promise</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            For a woman facing domestic intimidation, a digital trace can be dangerous. We engineered SafeSpark with paranoia-grade safeguards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-3"
            >
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 w-fit">
                {p.icon}
              </div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
