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
import { Shield, User, UserPlus, LogIn, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoginDropdown() {
  const [mounted, setMounted] = React.useState(false);
  const { openSignIn, openSignUp } = useSafeClerk();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
        Login
      </Button>
    );
  }

  const handleOfficialLogin = () => {
    try {
      if (typeof openSignIn === 'function') {
        openSignIn();
      } else {
        router.push('/sign-in');
      }
    } catch {
      router.push('/sign-in');
    }
  };

  const handleCitizenLogin = () => {
    try {
      if (typeof openSignIn === 'function') {
        openSignIn();
      } else {
        router.push('/sign-in');
      }
    } catch {
      router.push('/sign-in');
    }
  };

  const handleRegister = () => {
    try {
      if (typeof openSignUp === 'function') {
        openSignUp();
      } else {
        router.push('/sign-up');
      }
    } catch {
      router.push('/sign-up');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 shadow-sm px-3.5 py-1.5 rounded-lg transition-all"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" align="end">
        <DropdownMenuLabel className="font-semibold text-xs text-slate-500 uppercase tracking-wider px-2 py-1">
          Select Purpose
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />

        {/* 1. Law Enforcement & Govt Officials */}
        <DropdownMenuItem
          onClick={handleOfficialLogin}
          className="flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="p-1.5 bg-blue-100 dark:bg-blue-950 rounded-md text-blue-700 dark:text-blue-300 mt-0.5 shrink-0">
            <Shield className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              Authority / Official Login
            </span>
            <span className="text-xs text-slate-500">
              For police, NGOs & case managers to resolve distress cases
            </span>
          </div>
        </DropdownMenuItem>

        {/* 2. Citizens & Survivors */}
        <DropdownMenuItem
          onClick={handleCitizenLogin}
          className="flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors mt-1"
        >
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950 rounded-md text-emerald-700 dark:text-emerald-300 mt-0.5 shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              Citizen / Survivor Login
            </span>
            <span className="text-xs text-slate-500">
              To track your filed reports & legal/therapy history
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5" />

        {/* 3. New User Registration */}
        <DropdownMenuItem
          onClick={handleRegister}
          className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer hover:bg-purple-50 dark:hover:bg-slate-800 text-purple-700 dark:text-purple-300 font-medium text-sm transition-colors"
        >
          <UserPlus className="h-4 w-4 shrink-0" />
          <span>Register New Account</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
