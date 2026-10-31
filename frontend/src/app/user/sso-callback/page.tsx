'use client';

import dynamic from 'next/dynamic';
import { isClerkConfigured } from '@/lib/auth-context';
import Link from 'next/link';

const DynamicCallback = dynamic(
  () => import('@clerk/nextjs').then((m) => m.AuthenticateWithRedirectCallback),
  { ssr: false }
);

export default function SSOCallback() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <p className="text-sm text-slate-500">SSO callback is active only when Clerk keys are configured.</p>
        <Link href="/" className="mt-2 text-xs text-rani underline">Return Home</Link>
      </div>
    );
  }

  return <DynamicCallback />;
}
