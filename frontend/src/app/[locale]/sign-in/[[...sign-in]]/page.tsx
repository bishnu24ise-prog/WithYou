'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSafeClerk } from '@/lib/auth-context';
import { Shield, User, ArrowLeft, Lock, Mail, BadgeCheck, Sparkles, Building, Phone, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignInPage() {
  const router = useRouter();
  const { loginAs } = useSafeClerk();
  const [activeTab, setActiveTab] = useState<'authority' | 'victim'>('authority');

  // Authority Form State
  const [authName, setAuthName] = useState('Insp. Ananya Sharma');
  const [authEmail, setAuthEmail] = useState('insp.sharma@police.gov.in');
  const [authDept, setAuthDept] = useState('Special Police Unit for Women & Children (SPUWAC)');
  const [authPassword, setAuthPassword] = useState('GovSecure@2026');

  // Survivor Form State
  const [victimName, setVictimName] = useState('Priya Sharma');
  const [victimPhone, setVictimPhone] = useState('+91 98765 43210');
  const [victimPin, setVictimPin] = useState('4789');

  const handleAuthoritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('authority', {
      name: authName.trim() || 'Insp. Ananya Sharma',
      email: authEmail.trim() || 'insp.sharma@police.gov.in',
      department: authDept.trim() || 'Police / NGO Command',
      badge: 'Law Enforcement / Official',
    });
    router.push('/dashboard');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 150);
  };

  const handleSurvivorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('victim', {
      name: victimName.trim() || 'Priya Sharma (Protected)',
      email: victimPhone.trim() || 'priya.protected@safespark.org',
      department: 'Confidential Survivor Account',
      badge: 'Protected Citizen',
    });
    router.push('/create-post');
    setTimeout(() => {
      window.location.href = '/create-post';
    }, 150);
  };

  const executeQuickLogin = (role: 'police' | 'ngo' | 'anonymous' | 'verified_citizen') => {
    if (role === 'police') {
      loginAs('authority', {
        name: 'Insp. Ananya Sharma',
        email: 'insp.sharma@police.gov.in',
        department: 'Special Police Unit for Women & Children (SPUWAC)',
        badge: 'Law Enforcement / Official',
      });
      router.push('/dashboard');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 150);
    } else if (role === 'ngo') {
      loginAs('authority', {
        name: 'Dr. Meera Iyer',
        email: 'meera.iyer@onestopcrisis.org',
        department: 'One-Stop Crisis Center (Sakhi Center 181)',
        badge: 'Crisis Center Director',
      });
      router.push('/dashboard');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 150);
    } else if (role === 'anonymous') {
      loginAs('victim', {
        name: 'Anonymous Survivor',
        email: 'anonymous@safespark.org',
        department: 'Zero-Trace Confidential Account',
        badge: 'Protected Citizen',
      });
      router.push('/create-post');
      setTimeout(() => {
        window.location.href = '/create-post';
      }, 150);
    } else if (role === 'verified_citizen') {
      loginAs('victim', {
        name: 'Kavita Verma',
        email: 'kavita.verma@gmail.com',
        department: 'Community Member (Case Tracker)',
        badge: 'Protected Citizen',
      });
      router.push('/create-post');
      setTimeout(() => {
        window.location.href = '/create-post';
      }, 150);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rani mb-2 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to SafeSpark Home
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rani via-saffron to-marigold text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            SafeSpark Login Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Choose your account role to access authorized case dossiers, official investigation tools, or confidential survivor resources.
          </p>
        </div>

        {/* 1-Click Fast Track Hero Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Instant 1-Click Demo Login
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => executeQuickLogin('police')}
              className="flex items-center justify-between p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 text-left">
                <Shield className="w-4 h-4 shrink-0" />
                <div>
                  <div className="font-bold">Login as Authority</div>
                  <div className="text-[10px] text-blue-200">Insp. Sharma (SPUWAC Police)</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => executeQuickLogin('anonymous')}
              className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rani to-saffron hover:opacity-95 text-white font-semibold text-xs shadow-md transition-all group"
            >
              <div className="flex items-center gap-2 text-left">
                <User className="w-4 h-4 shrink-0" />
                <div>
                  <div className="font-bold">Login as Survivor</div>
                  <div className="text-[10px] text-pink-100">Confidential Citizen SOS</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('authority')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'authority'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Authority / Official</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('victim')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'victim'
                ? 'bg-gradient-to-r from-rani to-saffron text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Citizen / Survivor</span>
          </button>
        </div>

        {/* Tab 1: Authority Form */}
        {activeTab === 'authority' && (
          <form onSubmit={handleAuthoritySubmit} className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
              <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Authorized Responders:</strong> Police dispatch, Protection Officers under PWDVA 2005, and certified NGO case managers.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Official Name & Rank
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Insp. Ananya Sharma"
                  className="pl-9 bg-white dark:bg-slate-950"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Govt Official Email / Service ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="e.g. insp.sharma@police.gov.in"
                  className="pl-9 bg-white dark:bg-slate-950"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Assigned Unit / Department
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  value={authDept}
                  onChange={(e) => setAuthDept(e.target.value)}
                  placeholder="e.g. Special Police Unit for Women & Children (SPUWAC)"
                  className="pl-9 bg-white dark:bg-slate-950"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 bg-white dark:bg-slate-950"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              Sign In as Authority Officer →
            </Button>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                ⚡ More 1-Click Authority Profiles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => executeQuickLogin('police')}
                  className="text-left p-2.5 rounded-xl border border-burgundy-200 dark:border-burgundy-800 hover:border-burgundy-400 bg-white dark:bg-burgundy-950 text-xs text-foreground hover:bg-burgundy-50/50 transition-colors"
                >
                  <div className="font-bold text-primary dark:text-primary">Police Duty Officer</div>
                  <div className="text-[10px] text-slate-400">Insp. Sharma • SPUWAC Command</div>
                </button>
                <button
                  type="button"
                  onClick={() => executeQuickLogin('ngo')}
                  className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="font-bold text-purple-600 dark:text-purple-400">🏥 NGO Crisis Director</div>
                  <div className="text-[10px] text-slate-400">Dr. Meera Iyer • Sakhi 181</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Survivor Form */}
        {activeTab === 'victim' && (
          <form onSubmit={handleSurvivorSubmit} className="space-y-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-rani shrink-0 mt-0.5" />
              <span>
                <strong>Confidential Sanctuary:</strong> Zero device trackers, encrypted local session, and instant Triple-Esc privacy exit.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Safe Alias / Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  value={victimName}
                  onChange={(e) => setVictimName(e.target.value)}
                  placeholder="e.g. Priya Sharma or Anonymous"
                  className="pl-9 bg-white dark:bg-slate-950"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Contact Phone / Safe Callback Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  value={victimPhone}
                  onChange={(e) => setVictimPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210 (or leave blank)"
                  className="pl-9 bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Private Access PIN (Optional)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  type="password"
                  value={victimPin}
                  onChange={(e) => setVictimPin(e.target.value)}
                  placeholder="e.g. 4-digit PIN"
                  className="pl-9 bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rani via-saffron to-marigold hover:opacity-95 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              Sign In as Citizen / Survivor →
            </Button>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                ⚡ More 1-Click Survivor Profiles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => executeQuickLogin('anonymous')}
                  className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rani bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="font-bold text-rani">🌸 Anonymous Survivor</div>
                  <div className="text-[10px] text-slate-400">Zero ID trace • Steganography SOS</div>
                </button>
                <button
                  type="button"
                  onClick={() => executeQuickLogin('verified_citizen')}
                  className="text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rani bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">👤 Registered Citizen</div>
                  <div className="text-[10px] text-slate-400">Kavita Verma • Case Tracking</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Footer links */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>Don&apos;t have an account?</span>
          <Link
            href="/sign-up"
            className="text-rani font-bold hover:underline"
          >
            Register SafeSpark Identity →
          </Link>
        </div>
      </div>
    </div>
  );
}
