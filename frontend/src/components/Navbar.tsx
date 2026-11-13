'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LoginDropdown } from './LoginDropdown';
import { ModeToggle } from './ModeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import SignOut from './SignOut';
import { usePathname, Link } from '@/i18n/routing';
import { useSafeClerk, SafeUserButton } from '@/lib/auth-context';
import { Lock, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useSafeClerk();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => pathname === href;

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/create-post', label: t('sos') },
    { href: '/lawbot', label: t('lawbot') },
    { href: '/therapybot', label: t('therapy') },
    { href: '/directory', label: 'Help Directory' },
    { href: '/assist', label: 'Complaint Assist' },
    { href: '/dashboard', label: t('dashboard') },
  ];

  return (
    <nav className="w-full h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#F5EBE1]/15 bg-[#1F0511]/85 dark:bg-[#15030A]/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg shadow-black/20 text-[#FAF4EC]">
      {/* Brand Logo with User Uploaded Glowing Lotus Spark */}
      <Link
        href="/"
        prefetch={false}
        className="font-black text-xl sm:text-2xl tracking-wide flex items-center gap-2.5 group"
      >
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden shadow-md shadow-[#C0265D]/40 group-hover:scale-105 transition-transform border border-[#F5EBE1]/25 flex items-center justify-center bg-[#2D0717]">
          <Image
            src="/images/logo.png"
            alt="SafeSpark Lotus Flame Logo"
            fill
            sizes="36px"
            className="object-contain p-0.5 filter brightness-110 drop-shadow-[0_0_8px_rgba(255,122,144,0.6)]"
          />
        </div>
        <span className="text-[#FAF4EC] font-bold tracking-tight">
          Safe<span className="text-gradient-sparkle">Spark</span>
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 font-medium text-xs sm:text-[13px] text-[#FAF4EC]/85">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          const isSos = link.href === '/create-post';
          return (
            <Link
              key={link.href}
              href={link.href as any}
              prefetch={false}
              className={`transition-colors duration-200 relative py-1.5 ${
                active
                  ? 'text-[#FFA8B8] font-bold drop-shadow-[0_0_8px_rgba(255,122,144,0.4)]'
                  : 'hover:text-[#FFA8B8] text-[#FAF4EC]/80'
              } ${isSos ? 'flex items-center gap-1.5 text-[#FF7A90] font-semibold' : ''}`}
            >
              {isSos && <Lock className="w-3.5 h-3.5 text-[#FF7A90] animate-pulse" />}
              <span>{link.label}</span>
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C32F6E] via-[#FF7A90] to-[#FAF4EC] rounded-full shadow-[0_0_6px_rgba(255,122,144,0.6)]" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Controls: Language + Theme + Auth + Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <ModeToggle />
        {mounted ? (
          !user ? (
            <LoginDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <SafeUserButton />
              <SignOut />
            </div>
          )
        ) : (
          <div className="w-20 h-8 rounded-full bg-[#3B0B1E]/60 animate-pulse border border-[#F5EBE1]/20" />
        )}

        {/* Mobile menu trigger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#FAF4EC]/80 hover:text-[#FFA8B8] rounded-lg bg-[#2D0717]/60 border border-[#F5EBE1]/10"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 md:hidden shadow-xl z-50">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rani'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

