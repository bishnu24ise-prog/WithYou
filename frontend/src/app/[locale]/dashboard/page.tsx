import LiveTitle from '@/components/LiveTitle';
import RealtimeList from '@/components/RealtimeList';
import { DashboardRoleBanner } from '@/components/DashboardRoleBanner';
import { UpdatesFeed } from '@/components/UpdatesFeed';
import React from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="flex flex-col justify-center mx-auto max-w-5xl w-full p-4 space-y-6">
      <DashboardRoleBanner />
      <UpdatesFeed />
      <LiveTitle />
      <RealtimeList />
    </div>
  );
}
