import React from 'react';
import { AgentLivePanel } from '@/components/AgentLivePanel';
import { Sparkles, Shield, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { GnaniAudioPlayerButton } from '@/components/GnaniAudioPlayerButton';

export const metadata = {
  title: 'Complaint Assist (TinyFish Web Agent) - SafeSpark',
  description: 'Automated legal complaint pre-filling on official public grievance portals with mandatory safety halt for human review.',
};

export default function AssistPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/lawbot"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rani transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to LawBot
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rani/10 text-rani uppercase tracking-wider">
            Feature 4
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Powered by TinyFish Web Agent (SSE Automation)
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Complaint Assist & Portal Pre-Fill
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Watch TinyFish Web Agent safely navigate official Indian grievance portals (National Cyber Crime, NCW, and Sakhi) to pre-fill statutory complaint forms while strictly halting before final submission.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">Listen in your language:</span>
          <GnaniAudioPlayerButton text="Complaint Assist uses an AI web agent to pre-fill public grievance forms safely. The agent will never click submit without your review." />
        </div>
      </div>

      {/* Live Agent Sandbox Panel */}
      <AgentLivePanel />
    </div>
  );
}
