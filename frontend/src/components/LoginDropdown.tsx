'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSafeClerk } from '@/lib/auth-context';
import { Shield, User, UserPlus, LogIn, ChevronDown, KeyRound, Sparkles } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function LoginDropdown() {
  const [mounted, setMounted] = React.useState(false);
  const { loginAs } = useSafeClerk();
  const router = useRouter();
  const t = useTranslations('nav');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="default" size="sm" className="bg-rani hover:bg-rani-600 text-white font-medium">
        {t('loginButton')}
      </Button>
    );
  }

  const handleOfficialLogin = () => {
    loginAs('authority', {
      name: 'Insp. Ananya Sharma',
      email: 'insp.sharma@police.gov.in',
      department: 'Special Police Unit for Women & Children (SPUWAC)',
      badge: 'Law Enforcement / Official',
    });
    router.push('/dashboard');
  };

  const handleCitizenLogin = () => {
    loginAs('victim', {
      name: 'Priya Sharma (Survivor)',
      email: 'priya.protected@safespark.org',
      department: 'Confidential Case Follower',
      badge: 'Protected Citizen',
    });
    router.push('/create-post');
  };

  const handleCustomPortal = () => {
    router.push('/sign-in');
  };

  const handleRegister = () => {
    router.push('/sign-up');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="bg-gradient-to-r from-rani to-saffron hover:opacity-95 text-white font-semibold flex items-center gap-1.5 shadow-sm px-3.5 py-1.5 rounded-lg transition-all"
        >
          <LogIn className="h-4 w-4" />
          <span>{t('loginButton')}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl z-50" align="end">
        <DropdownMenuLabel className="font-semibold text-xs text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
          <span>{t('chooseRole')}</span>
          <span className="text-[10px] text-rani font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {t('quickAccess')}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        {/* 1. Law Enforcement & Govt Officials */}
        <DropdownMenuItem
          onClick={handleOfficialLogin}
          className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg text-blue-700 dark:text-blue-300 mt-0.5 shrink-0 shadow-xs">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t('roleAuthority')}
              </span>
              <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold">
                {t('verifiedOfficialBadge')}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              {t('lawOfficerDesc')}
            </span>
          </div>
        </DropdownMenuItem>

        {/* 2. Citizens & Survivors */}
        <DropdownMenuItem
          onClick={handleCitizenLogin}
          className="flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors mt-1"
        >
          <div className="p-2 bg-rose-100 dark:bg-rose-950 rounded-lg text-rose-700 dark:text-rose-300 mt-0.5 shrink-0 shadow-xs">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {t('roleSurvivor')}
              </span>
              <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded text-[10px] font-bold">
                {t('protectedCitizenBadge')}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              {t('citizenDesc')}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        {/* 3. Custom Credentials Form */}
        <DropdownMenuItem
          onClick={handleCustomPortal}
          className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
        >
          <KeyRound className="h-4 w-4 text-slate-500 shrink-0" />
          <span>{t('customOfficer')}</span>
        </DropdownMenuItem>

        {/* 4. New Registration */}
        <DropdownMenuItem
          onClick={handleRegister}
          className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 font-medium text-xs transition-colors"
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          <span>{t('registerCitizen')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
