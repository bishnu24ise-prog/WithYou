import { SignUp } from '@clerk/nextjs';
import React from 'react';
import Link from 'next/link';
import { isClerkConfigured } from '@/lib/auth-context';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function Page() {
  if (!isClerkConfigured) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rani/10 text-rani flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Anonymous Mode Active
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            SafeSpark is operating in <strong>Confidential Guest Mode</strong>. You can use Covert SOS reporting, LawBot, and the 3D Therapy Companion without needing an account.
          </p>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-left space-y-1">
            <div className="font-bold text-slate-700 dark:text-slate-300">To enable Clerk accounts:</div>
            <div>Add your keys from <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-rani underline">dashboard.clerk.com</a> into <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">.env.local</code>.</div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rani text-white font-bold text-sm shadow-md hover:bg-rani-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SafeSpark Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: 'mx-auto w-full',
              card: 'shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
            },
          }}
        />
      </div>
    </div>
  );
}
