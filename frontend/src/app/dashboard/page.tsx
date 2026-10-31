import LiveTitle from '@/components/LiveTitle';
import RealtimeList from '@/components/RealtimeList';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let user = null;
  try {
    user = await currentUser();
  } catch {
    user = null;
  }

  return (
    <div className="flex flex-col justify-center mx-auto max-w-5xl w-full p-4">
      {!user && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span>
              <strong>Authority Preview Mode:</strong> You are viewing live reported cases in guest preview mode.
            </span>
          </div>
          <Link
            href="/sign-in"
            prefetch={false}
            className="text-rani-600 dark:text-rani-400 font-semibold hover:underline shrink-0"
          >
            Sign in as Govt Official →
          </Link>
        </div>
      )}
      <LiveTitle />
      <RealtimeList />
    </div>
  );
}
