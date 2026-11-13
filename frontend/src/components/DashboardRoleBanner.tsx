'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useSafeAuth } from '@/lib/auth-context';
import { ShieldCheck, ShieldAlert, User, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function DashboardRoleBanner() {
  const [mounted, setMounted] = useState(false);
  const { user, role, loginAs, signOut } = useSafeAuth();
  const t = useTranslations('dashboard');
  const tNav = useTranslations('nav');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 1. Logged in as Authority
  if (role === 'authority' && user) {
    return (
      <div className="mb-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/60 dark:via-indigo-950/50 dark:to-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-blue-950 dark:text-blue-100">
                {user.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 uppercase tracking-wide flex items-center gap-1">
                <Shield className="w-3 h-3" /> {t('verifiedOfficial')}
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              {user.department || t('officialPrivileges')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loginAs('victim')}
            className="text-xs h-8 border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-900 dark:text-blue-200"
          >
            {t('switchCitizen')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => signOut()}
            className="text-xs h-8 text-slate-500 hover:text-rose-600"
          >
            {t('signOut')}
          </Button>
        </div>
      </div>
    );
  }

  // 2. Logged in as Survivor
  if (role === 'victim' && user) {
    return (
      <div className="mb-5 bg-gradient-to-r from-rose-50 via-purple-50 to-rose-50 dark:from-rose-950/50 dark:via-purple-950/40 dark:to-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-rani to-saffron text-white rounded-xl shadow-xs shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-slate-900 dark:text-slate-100">
                {user.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                {tNav('roleSurvivor')}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {t('communityViewNotice')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            size="sm"
            onClick={() => loginAs('authority')}
            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {t('switchOfficial')} →
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => signOut()}
            className="text-xs h-8 text-slate-500 hover:text-rose-600"
          >
            {t('signOut')}
          </Button>
        </div>
      </div>
    );
  }

  // 3. Guest Mode with 1-Click Fast Login
  return (
    <div className="mb-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-amber-900 dark:text-amber-100">
              {t('title')}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.2 bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded">
              {t('guestBadge')}
            </span>
          </div>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
        <Button
          size="sm"
          onClick={() => {
            loginAs('authority', {
              name: 'Insp. Ananya Sharma',
              email: 'insp.sharma@police.gov.in',
              department: 'Special Police Unit for Women & Children (SPUWAC)',
              badge: 'Law Enforcement / Official',
            });
          }}
          className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-xs"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>{tNav('roleAuthority')}</span>
        </Button>

        <Button
          size="sm"
          onClick={() => {
            loginAs('victim', {
              name: 'Priya Sharma (Protected)',
              email: 'priya.protected@safespark.org',
              department: 'Confidential Case Follower',
              badge: 'Protected Citizen',
            });
          }}
          className="text-xs h-8 bg-gradient-to-r from-rani to-saffron hover:opacity-95 text-white font-bold flex items-center gap-1 shadow-xs"
        >
          <User className="w-3.5 h-3.5" />
          <span>{tNav('roleSurvivor')}</span>
        </Button>

        <Link
          href="/sign-in"
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2 ml-1"
        >
          {tNav('signIn')} →
        </Link>
      </div>
    </div>
  );
}
