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
import { useRouter } from 'next/navigation';

export function LoginDropdown() {
  const [mounted, setMounted] = React.useState(false);
  const { loginAs } = useSafeClerk();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="default" size="sm" className="bg-[#C0265D] hover:bg-[#9C1F52] text-[#FAF4EC] font-semibold rounded-full px-4">
        Login
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
    setTimeout(() => {
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
    }, 150);
  };

  const handleCitizenLogin = () => {
    loginAs('victim', {
      name: 'Priya Sharma (Survivor)',
      email: 'priya.protected@safespark.org',
      department: 'Confidential Case Follower',
      badge: 'Protected Citizen',
    });
    router.push('/create-post');
    setTimeout(() => {
      if (window.location.pathname !== '/create-post') {
        window.location.href = '/create-post';
      }
    }, 150);
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
          className="bg-gradient-to-r from-[#B0164E] via-[#C0265D] to-[#E04D7A] hover:brightness-110 text-[#FAF4EC] font-bold flex items-center gap-1.5 shadow-md shadow-[#C0265D]/30 px-4 py-1.5 rounded-full transition-all border border-[#F5EBE1]/20 hover:scale-105 active:scale-95"
        >
          <LogIn className="h-3.5 w-3.5" />
          <span>Login</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-2 shadow-2xl border border-[#F5EBE1]/15 bg-[#250714] text-[#FAF4EC] rounded-2xl z-50 backdrop-blur-xl" align="end">
        <DropdownMenuLabel className="font-semibold text-xs text-[#E8D7C3]/70 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
          <span>Choose Your Role</span>
          <span className="text-[10px] text-[#FFA8B8] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Access
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-[#F5EBE1]/10" />

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
                Authority / Official
              </span>
              <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold">
                Police/NGO
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Instant login as Duty Officer to review dossiers and resolve cases
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
                Citizen / Survivor
              </span>
              <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded text-[10px] font-bold">
                Confidential
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Instant login to submit covert SOS reports and track case progress
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
          <span>Login with Custom ID / Password</span>
        </DropdownMenuItem>

        {/* 4. New Registration */}
        <DropdownMenuItem
          onClick={handleRegister}
          className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 font-medium text-xs transition-colors"
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          <span>Register New Account</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
