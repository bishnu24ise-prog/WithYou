import React from 'react';
import { LiveEnrichTable } from '@/components/LiveEnrichTable';
import { ShieldCheck, HeartHandshake, PhoneCall, Sparkles } from 'lucide-react';
import { GnaniAudioPlayerButton } from '@/components/GnaniAudioPlayerButton';

export const metadata = {
  title: 'Self-Healing Crisis & Legal Aid Directory - SafeSpark',
  description: 'Verified directory of Indian One Stop Centres, legal aid clinics, and emergency shelters actively self-healed by TinyFish Web Agent.',
};

export default function DirectoryPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-peacock/10 border border-peacock/30 text-peacock-800 dark:text-peacock-300 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-peacock" />
          <span>Feature 2: TinyFish Self-Healing Directory (Batch Fetch)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Live Verified Crisis & Legal Aid Directory
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Real-time institutional directory for survivors and citizens. Helplines, operating hours, and legal assistance are actively verified against official government portals using TinyFish Web Agent.
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Dictate in your language:</span>
          <GnaniAudioPlayerButton text="SafeSpark Help Directory. Dial 112 for Police Emergency, 1091 for Women Distress, 181 for One Stop Sakhi Centre, or 15100 for Free Legal Aid." />
        </div>
      </div>

      {/* Quick Overview Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-rose-100 dark:bg-rose-950/60 text-rani rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">One-Touch Helplines</div>
            <div className="text-xs text-slate-500">112 (Emergency), 181 (Sakhi), 1091 (Police)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Free Legal Aid (NALSA)</div>
            <div className="text-xs text-slate-500">Statutory free counsel for every woman</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">733+ Sakhi Centres</div>
            <div className="text-xs text-slate-500">Emergency shelter, medical aid & legal care</div>
          </div>
        </div>
      </div>

      {/* Live Table */}
      <LiveEnrichTable />
    </div>
  );
}

