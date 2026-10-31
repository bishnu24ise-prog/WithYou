'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider, useClerk as useClerkOriginal, UserButton as UserButtonOriginal } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const isClerkConfigured =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'string' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('ZXhhbXBsZ') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('your_clerk');

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: 'authority' | 'victim';
  badge: string;
  department?: string;
  avatar?: string;
}

export interface SafeClerkContextType {
  user: SafeUser | any;
  isSignedIn: boolean;
  role: 'authority' | 'victim' | 'guest';
  openSignIn: () => void;
  openSignUp: () => void;
  loginAs: (role: 'authority' | 'victim', details?: Partial<SafeUser>) => void;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const defaultContext: SafeClerkContextType = {
  user: null,
  isSignedIn: false,
  role: 'guest',
  openSignIn: () => {},
  openSignUp: () => {},
  loginAs: () => {},
  signOut: async () => {},
  isConfigured: false,
};

const SafeClerkContext = createContext<SafeClerkContextType>(defaultContext);

const LOCAL_STORAGE_KEY = 'safespark_authenticated_user';

function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);
  const [mounted, setMounted] = useState(false);

  // Restore session from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role === 'authority' || parsed.role === 'victim')) {
          setUser(parsed);
          document.cookie = `safespark_role=${parsed.role}; path=/; max-age=86400; SameSite=Lax`;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    setMounted(true);
  }, []);

  const loginAs = (role: 'authority' | 'victim', details?: Partial<SafeUser>) => {
    const newUser: SafeUser = {
      id: details?.id || `${role}_${Date.now()}`,
      name: details?.name || (role === 'authority' ? 'Insp. Ananya Sharma' : 'Priya Sharma (Protected)'),
      email: details?.email || (role === 'authority' ? 'insp.sharma@police.gov.in' : 'priya.survivor@safespark.org'),
      role,
      badge: role === 'authority' ? 'Law Enforcement / Official' : 'Protected Citizen',
      department: details?.department || (role === 'authority' ? 'Special Police Unit for Women & Children (SPUWAC)' : 'Confidential Case Reporting'),
      avatar: details?.avatar || (role === 'authority' ? '🛡️' : '🌸'),
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
      document.cookie = `safespark_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }

    setUser(newUser);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      document.cookie = 'safespark_role=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // Ignore
    }
    setUser(null);
    router.push('/');
  };

  const mockValue: SafeClerkContextType = {
    user: mounted ? user : null,
    isSignedIn: mounted ? !!user : false,
    role: mounted ? (user?.role || 'guest') : 'guest',
    openSignIn: () => router.push('/sign-in'),
    openSignUp: () => router.push('/sign-up'),
    loginAs,
    signOut,
    isConfigured: false,
  };

  return (
    <SafeClerkContext.Provider value={mockValue}>
      {children}
    </SafeClerkContext.Provider>
  );
}

function RealClerkBridge({ children }: { children: React.ReactNode }) {
  const clerk = useClerkOriginal();
  const [mounted, setMounted] = useState(false);
  const [overrideUser, setOverrideUser] = useState<SafeUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setOverrideUser(JSON.parse(stored));
      }
    } catch {}
    setMounted(true);
  }, []);

  const loginAs = (role: 'authority' | 'victim', details?: Partial<SafeUser>) => {
    const newUser: SafeUser = {
      id: details?.id || `${role}_${Date.now()}`,
      name: details?.name || (role === 'authority' ? 'Insp. Ananya Sharma' : 'Priya Sharma (Protected)'),
      email: details?.email || (role === 'authority' ? 'insp.sharma@police.gov.in' : 'priya.survivor@safespark.org'),
      role,
      badge: role === 'authority' ? 'Law Enforcement / Official' : 'Protected Citizen',
      department: details?.department || (role === 'authority' ? 'SPUWAC Police Unit' : 'Confidential'),
      avatar: role === 'authority' ? '🛡️' : '🌸',
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    setOverrideUser(newUser);
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    setOverrideUser(null);
    await clerk.signOut();
  };

  const activeUser = overrideUser || clerk.user;
  const isSignedIn = mounted ? !!activeUser : false;
  const role: 'authority' | 'victim' | 'guest' = overrideUser?.role || (clerk.user ? 'authority' : 'guest');

  const bridgeValue: SafeClerkContextType = {
    user: mounted ? activeUser : null,
    isSignedIn,
    role,
    openSignIn: () => clerk.openSignIn?.(),
    openSignUp: () => clerk.openSignUp?.(),
    loginAs,
    signOut,
    isConfigured: true,
  };

  return (
    <SafeClerkContext.Provider value={bridgeValue}>
      {children}
    </SafeClerkContext.Provider>
  );
}

export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured) {
    return (
      <ClerkProvider
        dynamic
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <RealClerkBridge>{children}</RealClerkBridge>
      </ClerkProvider>
    );
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
}

export function useSafeClerk() {
  return useContext(SafeClerkContext);
}

export function useSafeAuth() {
  const context = useContext(SafeClerkContext);
  return {
    user: context.user,
    isSignedIn: context.isSignedIn,
    role: context.role,
    userId: context.user?.id || null,
    loginAs: context.loginAs,
    signOut: context.signOut,
  };
}

export function SafeUserButton() {
  const [mounted, setMounted] = useState(false);
  const { user, role, signOut } = useSafeClerk();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  if (isClerkConfigured && !user.role) {
    return <UserButtonOriginal afterSignOutUrl="/" />;
  }

  return (
    <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs ${
        role === 'authority'
          ? 'bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800'
          : 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800'
      }`}>
        <span>{user.avatar || (role === 'authority' ? '🛡️' : '🌸')}</span>
        <span className="truncate max-w-[120px]">{user.name?.split(' ')[0]}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
          [{role === 'authority' ? 'Official' : 'Citizen'}]
        </span>
      </div>
    </div>
  );
}
