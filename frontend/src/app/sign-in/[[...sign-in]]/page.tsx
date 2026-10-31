'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSafeClerk } from '@/lib/auth-context';
import { Shield, User, ArrowLeft, Lock, Mail, BadgeCheck, Sparkles, Building, Phone } from 'lucide-react';
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
  };

  const loadPreset = (type: 'police' | 'ngo' | 'anonymous' | 'verified_citizen') => {
    if (type === 'police') {
      setActiveTab('authority');
      setAuthName('Insp. Ananya Sharma');
      setAuthEmail('insp.sharma@police.gov.in');
      setAuthDept('Special Police Unit for Women & Children (SPUWAC)');
    } else if (type === 'ngo') {
      setActiveTab('authority');
      setAuthName('Dr. Meera Iyer');
      setAuthEmail('meera.iyer@onestopcrisis.org');
      setAuthDept('One-Stop Crisis Center (Sakhi Center 181)');
    } else if (type === 'anonymous') {
      setActiveTab('victim');
      setVictimName('Anonymous Survivor');
      setVictimPhone('+91 Confidential');
    } else if (type === 'verified_citizen') {
      setActiveTab('victim');
      setVictimName('Kavita Verma');
      setVictimPhone('+91 98112 34567');
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
            Choose your account role to access authorized tools, case dossiers, or confidential survivor resources.
          </p>
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
                ⚡ 1-Click Quick Demo Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset('police')}
                  className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="font-bold text-blue-600 dark:text-blue-400">🛡️ Police Duty Officer</div>
                  <div className="text-[10px] text-slate-400">Insp. Sharma • SPUWAC</div>
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('ngo')}
                  className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50/50 transition-colors"
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
                ⚡ 1-Click Quick Demo Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => loadPreset('anonymous')}
                  className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rani bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="font-bold text-rani">🌸 Anonymous Survivor</div>
                  <div className="text-[10px] text-slate-400">Zero ID trace • Steganography SOS</div>
                </button>
                <button
                  type="button"
                  onClick={() => loadPreset('verified_citizen')}
                  className="text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rani bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 hover:bg-rose-50/50 transition-colors"
                >
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">👤 Registered Citizen</div>
                  <div className="text-[10px] text-slate-400">Kavita Verma • Case Tracking</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Need a new account?{' '}
            <Link href="/sign-up" className="text-rani font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
