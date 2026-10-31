'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { LoginDropdown } from './LoginDropdown';
import { ModeToggle } from './ModeToggle';
import SignOut from './SignOut';
import { usePathname } from 'next/navigation';
import { useSafeClerk, SafeUserButton } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Lock, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useSafeClerk();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => pathname === href;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/create-post', label: 'Report (Covert SOS)' },
    { href: '/lawbot', label: 'Law Bot' },
    { href: '/therapybot', label: '3D Companion' },
    { href: '/dashboard', label: 'Dashboard' },
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
      <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          const isSos = link.href === '/create-post';
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={`transition-colors duration-200 relative py-1 ${
                active
                  ? 'text-rani font-bold'
                  : 'hover:text-rani dark:hover:text-rani-300'
              } ${isSos ? 'flex items-center gap-1.5 text-rani-600 dark:text-rani-400 font-bold' : ''}`}
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

      {/* Right Controls: Theme + Auth + Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
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
          <Button variant="outline" size="sm">Login</Button>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 shadow-xl z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl font-semibold text-sm ${
                isActive(link.href)
                  ? 'bg-rani/10 text-rani font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
