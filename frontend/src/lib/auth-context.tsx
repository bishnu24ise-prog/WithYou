'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkProvider, useClerk as useClerkOriginal, UserButton as UserButtonOriginal } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export const isClerkConfigured =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'string' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_test_') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('ZXhhbXBsZ') &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('your_clerk');

interface SafeClerkContextType {
  user: any;
  isSignedIn: boolean;
  openSignIn: () => void;
  openSignUp: () => void;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const SafeClerkContext = createContext<SafeClerkContextType>({
  user: null,
  isSignedIn: false,
  openSignIn: () => {},
  openSignUp: () => {},
  signOut: async () => {},
  isConfigured: false,
});

function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const mockValue: SafeClerkContextType = {
    user: null,
    isSignedIn: false,
    openSignIn: () => router.push('/sign-in'),
    openSignUp: () => router.push('/sign-up'),
    signOut: async () => {},
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const bridgeValue: SafeClerkContextType = {
    user: mounted ? clerk.user : null,
    isSignedIn: mounted ? !!clerk.user : false,
    openSignIn: () => clerk.openSignIn?.(),
    openSignUp: () => clerk.openSignUp?.(),
    signOut: () => clerk.signOut(),
    isConfigured: true,
  };

  return (
    <SafeClerkContext.Provider value={bridgeValue}>
      {children}
    </SafeClerkContext.Provider>
  );
}

export function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  // If Clerk is configured with a real key, wrap with actual ClerkProvider
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

  // Otherwise, use fallback mock auth provider so the app never crashes
  return <MockAuthProvider>{children}</MockAuthProvider>;
}

export function useSafeClerk() {
  const context = useContext(SafeClerkContext);
  return context;
}

export function useSafeAuth() {
  const context = useContext(SafeClerkContext);
  return {
    isSignedIn: context.isSignedIn,
    userId: context.user?.id || null,
    signOut: context.signOut,
  };
}

export function SafeUserButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && isClerkConfigured) {
    return <UserButtonOriginal afterSignOutUrl="/" />;
  }
  return null;
}
