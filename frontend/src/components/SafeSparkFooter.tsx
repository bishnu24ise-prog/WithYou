'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { EMERGENCY_HELPLINES } from '@/data/stats';
import { PhoneCall, Scale, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SafeSparkFooter() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const performQuickExit = () => {
    // Clear cookies immediately
    if (typeof document !== 'undefined') {
      document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
    }
    window.location.replace('https://www.google.com/search?q=today+weather+and+news');
  };

  return (
    <footer className="w-full bg-slate-950 text-white border-t border-slate-800 pt-16 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 mt-12 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Emergency Directory Banner */}
        <div id="helplines" className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                <PhoneCall className="w-4 h-4 animate-pulse" />
                {t('emergencyTitle')}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t('emergencySubtitle')}
              </h3>
            </div>
            <button
              onClick={performQuickExit}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              {t('quickExitBtn')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_HELPLINES.map((item) => (
              <a
                key={item.number}
                href={item.action}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">
                    {item.number}
                  </div>
                  <div className="text-xs font-bold text-slate-300 mt-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {item.description}
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-rose-400 flex items-center gap-1">
                  <span>{t('callTollFree')}</span>
                  <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Main Footer Links & Legal Reference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="font-black text-2xl tracking-wide flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rani via-saffron to-marigold flex items-center justify-center text-white text-sm font-bold shadow-md">
                ✦
              </span>
              <span>Safe<span className="text-gradient-aurora">Spark</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              &quot;A Silent Shield, A Strong Voice&quot; — Built for women to give them support, confidential distress reporting, legal self-advocacy, and emotional grounding.
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div>{t('statutoryNotice')}</div>
            </div>
          </div>

          {/* Platform Capabilities */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <div className="font-bold text-white uppercase tracking-wider">
              {tNav('lawbot')} &amp; Tools
            </div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/create-post" className="hover:text-white transition-colors">
                  {tNav('sos')}
                </Link>
              </li>
              <li>
                <Link href="/lawbot" className="hover:text-white transition-colors">
                  {tNav('lawbot')}
                </Link>
              </li>
              <li>
                <Link href="/therapybot" className="hover:text-white transition-colors">
                  {tNav('therapy')}
                </Link>
              </li>
              <li>
                <Link href="/directory" className="hover:text-white transition-colors">
                  {tNav('directory')}
                </Link>
              </li>
              <li>
                <Link href="/assist" className="hover:text-white transition-colors">
                  {tNav('assist')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  {tNav('dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Rights Reference */}
          <div className="md:col-span-4 space-y-2.5 text-xs">
            <div className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-peacock" />
              Statutory Protections
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <strong className="text-slate-300">PWDVA 2005:</strong> Protection Orders (Sec 18), Residence Rights (Sec 19), Monetary Relief (Sec 20).
              </li>
              <li>
                <strong className="text-slate-300">Bharatiya Nyaya Sanhita (BNS):</strong> Replaced IPC 498A with updated spousal cruelty &amp; harassment provisions.
              </li>
              <li>
                <strong className="text-slate-300">IT Act 2000 (Sec 66E / 67):</strong> Legal penalties for privacy violation, cyberstalking, and non-consensual imagery.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} SafeSpark. {t('rightsReserved')}
          </div>
          <div className="flex items-center gap-4">
            <Link href="#privacy" className="hover:text-slate-300">
              Privacy Promise
            </Link>
            <span>•</span>
            <Link href="#the-silence" className="hover:text-slate-300">
              Verified Data Story
            </Link>
            <span>•</span>
            <Link href="#manifesto" className="hover:text-slate-300">
              Manifesto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
