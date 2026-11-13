'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EMERGENCY_HELPLINES } from '@/data/stats';
import { PhoneCall, Scale, ShieldAlert, Heart } from 'lucide-react';

export default function SafeSparkFooter() {
  const performQuickExit = () => {
    if (typeof window !== 'undefined') {
      try { localStorage.clear(); sessionStorage.clear(); } catch {}
    }
    window.location.replace('https://www.google.com/search?q=today+weather+and+news');
  };

  return (
    <footer className="w-full bg-[#0E0208] text-[#FAF4EC] border-t border-[#F5EBE1]/10 pt-16 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-64 bg-[#C0265D]/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-48 bg-[#B0164E]/8 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Emergency Directory Banner */}
        <div id="helplines" className="p-6 sm:p-8 rounded-3xl bg-[#1A040D]/80 border border-[#F5EBE1]/12 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#FF7A90] text-xs font-bold uppercase tracking-wider mb-1">
                <PhoneCall className="w-4 h-4 animate-pulse" />
                Verified 24/7 Crisis &amp; Legal Helplines
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#FAF4EC]">
                If you are in immediate danger, call now
              </h3>
            </div>
            <button
              onClick={performQuickExit}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B0164E] to-[#C32F6E] hover:brightness-110 text-[#FAF4EC] text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#C0265D]/30 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              QUICK EXIT (ESC × 3)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EMERGENCY_HELPLINES.map((item) => (
              <a
                key={item.number}
                href={item.action}
                className="p-4 rounded-2xl bg-[#2D0717]/70 hover:bg-[#3D0B20]/90 border border-[#F5EBE1]/10 hover:border-[#FF7A90]/30 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="text-2xl font-black text-[#FAF4EC] group-hover:text-[#FF7A90] transition-colors font-mono">
                    {item.number}
                  </div>
                  <div className="text-xs font-bold text-[#E8D7C3] mt-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#FAF4EC]/55 mt-1 leading-snug">
                    {item.description}
                  </div>
                </div>
                <div className="mt-3 text-xs font-semibold text-[#FF7A90] flex items-center gap-1">
                  <span>Call Toll-Free</span>
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
            <Link href="/" className="font-black text-2xl tracking-wide flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-[#C0265D]/40 border border-[#F5EBE1]/20 bg-[#2D0717] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="SafeSpark Lotus"
                  fill
                  sizes="36px"
                  className="object-cover brightness-110 drop-shadow-[0_0_8px_rgba(255,179,0,0.5)]"
                />
              </div>
              <span className="text-[#FAF4EC] font-bold">
                Safe<span className="text-gradient-sparkle">Spark</span>
              </span>
            </Link>
            <p className="text-xs text-[#FAF4EC]/50 leading-relaxed max-w-sm">
              &quot;A Silent Shield, A Strong Voice&quot; Built for women to give them support, confidential distress reporting, legal self-advocacy, and emotional grounding.
            </p>
            <div className="text-xs text-[#FAF4EC]/35 space-y-1">
              <div>Complies with Indian Digital Personal Data Protection standards.</div>
              <div>Zero commercial ad cookies. E2E steganographic distress encoding.</div>
            </div>
          </div>

          {/* Platform Capabilities */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <div className="font-bold text-[#E8D7C3] uppercase tracking-wider">
              Safety Technology
            </div>
            <ul className="space-y-2 text-[#FAF4EC]/50">
              <li>
                <Link href="/create-post" className="hover:text-[#FFA8B8] transition-colors">
                  Steganographic SOS Reporting
                </Link>
              </li>
              <li>
                <Link href="/lawbot" className="hover:text-[#FFA8B8] transition-colors">
                  AI LawBot (PWDVA &amp; BNS)
                </Link>
              </li>
              <li>
                <Link href="/therapybot" className="hover:text-[#FFA8B8] transition-colors">
                  3D Empathetic AI Companion
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#FFA8B8] transition-colors">
                  Authority Case Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Rights Reference */}
          <div className="md:col-span-4 space-y-2.5 text-xs">
            <div className="font-bold text-[#E8D7C3] uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#FF7A90]" />
              Statutory Protections
            </div>
            <ul className="space-y-1.5 text-[#FAF4EC]/50">
              <li>
                <strong className="text-[#FAF4EC]/70">PWDVA 2005:</strong> Protection Orders (Sec 18), Residence Rights (Sec 19), Monetary Relief (Sec 20).
              </li>
              <li>
                <strong className="text-[#FAF4EC]/70">Bharatiya Nyaya Sanhita (BNS):</strong> Replaced IPC 498A with updated spousal cruelty &amp; harassment provisions.
              </li>
              <li>
                <strong className="text-[#FAF4EC]/70">IT Act 2000 (Sec 66E / 67):</strong> Legal penalties for privacy violation, cyberstalking, and non-consensual imagery.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-[#F5EBE1]/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF4EC]/30">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-[#FF7A90]/60 fill-current" />
            © {new Date().getFullYear()} SafeSpark. Built with courage, confidentiality, and care.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#privacy" className="hover:text-[#FFA8B8] transition-colors">
              Privacy Promise
            </Link>
            <span>•</span>
            <Link href="#the-silence" className="hover:text-[#FFA8B8] transition-colors">
              Verified Data Story
            </Link>
            <span>•</span>
            <Link href="#manifesto" className="hover:text-[#FFA8B8] transition-colors">
              Manifesto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
