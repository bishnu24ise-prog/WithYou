'use client';

import React, { useState, useEffect } from 'react';
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
    <nav className="w-full h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      {/* Brand Logo */}
      <Link
        href="/"
        prefetch={false}
        className="font-black text-xl sm:text-2xl tracking-wide flex items-center gap-2 group"
      >
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-rani via-saffron to-marigold flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md shadow-rani/20 group-hover:scale-105 transition-transform">
          ✦
        </span>
        <span className="text-slate-900 dark:text-white">
          Safe<span className="text-gradient-aurora">Spark</span>
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center justify-center gap-3 lg:gap-5 font-semibold text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          const isSos = link.href === '/create-post';
          return (
            <Link
              key={link.href}
              href={link.href as any}
              prefetch={false}
              className={`transition-colors duration-200 relative py-1 ${
                active
                  ? 'text-rani font-bold'
                  : 'hover:text-rani dark:hover:text-rani-300'
              } ${isSos ? 'flex items-center gap-1.5 text-rani font-bold' : ''}`}
            >
              {isSos && <Lock className="w-3.5 h-3.5 text-rani animate-pulse" />}
              <span>{link.label}</span>
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rani to-saffron rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Controls: Language + Theme + Auth + Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5">
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
          <div className="w-20 h-8 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 animate-pulse" />
        )}

        {/* Mobile menu trigger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-rani"
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

