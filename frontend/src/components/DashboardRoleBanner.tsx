'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSafeAuth } from '@/lib/auth-context';
import { ShieldCheck, ShieldAlert, User, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardRoleBanner() {
  const [mounted, setMounted] = useState(false);
  const { user, role, loginAs } = useSafeAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 1. Logged in as Authority
  if (role === 'authority' && user) {
    return (
      <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-blue-950 dark:text-blue-100">
                {user.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200 uppercase tracking-wide">
                Verified Authority
              </span>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
              {user.department || 'Law Enforcement Command'} • Full case management & dossier resolution privileges enabled.
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
            Switch to Survivor View
          </Button>
        </div>
      </div>
    );
  }

  // 2. Logged in as Survivor
  if (role === 'victim' && user) {
    return (
      <div className="mb-5 bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/40 dark:to-purple-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-rani to-saffron text-white rounded-xl shadow-xs shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-slate-900 dark:text-slate-100">
                {user.name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                Protected Citizen
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              You are viewing the community safety monitor. Official case closure requires an Authority account.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            size="sm"
            onClick={() => loginAs('authority')}
            className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            Switch to Authority Mode →
          </Button>
        </div>
      </div>
    );
  }

  // 3. Guest Mode
  return (
    <div className="mb-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-xs text-amber-900 dark:text-amber-100">
            Guest Preview Mode
          </span>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
            You are browsing incident dossiers in guest preview. Log in as an official to resolve cases or as a citizen to track reports.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <Button
          size="sm"
          onClick={() => loginAs('authority')}
          className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          <LogIn className="w-3.5 h-3.5 mr-1" /> Login as Official
        </Button>
        <Link
          href="/sign-in"
          className="text-xs text-slate-600 dark:text-slate-300 hover:underline px-2"
        >
          Other Accounts →
        </Link>
      </div>
    </div>
  );
}

