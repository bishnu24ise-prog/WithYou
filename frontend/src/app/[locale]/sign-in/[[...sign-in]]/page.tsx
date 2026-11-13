'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useSafeClerk } from '@/lib/auth-context';
import { Shield, User, ArrowLeft, Lock, Mail, Building, Phone, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

export default function SignInPage() {
  const router = useRouter();
  const { loginAs } = useSafeClerk();
  const t = useTranslations('auth');
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

  const executeQuickLogin = (role: 'police' | 'ngo' | 'anonymous' | 'verified_citizen') => {
    if (role === 'police') {
      loginAs('authority', {
        name: 'Insp. Ananya Sharma',
        email: 'insp.sharma@police.gov.in',
        department: 'Special Police Unit for Women & Children (SPUWAC)',
        badge: 'Law Enforcement / Official',
      });
      router.push('/dashboard');
    } else if (role === 'ngo') {
      loginAs('authority', {
        name: 'Dr. Meera Iyer',
        email: 'meera.iyer@onestopcrisis.org',
        department: 'One-Stop Crisis Center (Sakhi Center 181)',
        badge: 'Crisis Center Director',
      });
      router.push('/dashboard');
    } else if (role === 'anonymous') {
      loginAs('victim', {
        name: 'Anonymous Survivor',
        email: 'anonymous@safespark.org',
        department: 'Zero-Trace Confidential Account',
        badge: 'Protected Citizen',
      });
      router.push('/create-post');
    } else if (role === 'verified_citizen') {
      loginAs('victim', {
        name: 'Kavita Verma',
        email: 'kavita.verma@gmail.com',
        department: 'Community Member (Case Tracker)',
        badge: 'Protected Citizen',
      });
      router.push('/create-post');
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
            <ArrowLeft className="w-3.5 h-3.5" /> {t('backHome')}
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rani via-saffron to-marigold text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('signInTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {t('demoDisclaimer')}
          </p>
        </div>

        {/* 1-Click Fast Track Hero Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {t('quickLogin')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              type="button"
              onClick={() => executeQuickLogin('police')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 justify-start"
            >
              <Shield className="w-3.5 h-3.5 mr-1" />
              <span>{t('quickDemoPolice')}</span>
            </Button>
            <Button
              type="button"
              onClick={() => executeQuickLogin('anonymous')}
              className="bg-gradient-to-r from-rani to-saffron text-white font-bold text-xs h-9 justify-start"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              <span>{t('quickDemoCitizen')}</span>
            </Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('authority')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'authority'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t('officialTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('victim')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'victim'
                ? 'bg-white dark:bg-slate-900 text-rani shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('citizenTab')}</span>
          </button>
        </div>

        {/* Tab 1: Authority Form */}
        {activeTab === 'authority' && (
          <form onSubmit={handleAuthoritySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('officialName')}
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
                {t('govtEmail')}
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
                {t('department')}
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
                {t('password')}
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
              {t('signInBtn')} →
            </Button>
          </form>
        )}

        {/* Tab 2: Survivor Form */}
        {activeTab === 'victim' && (
          <form onSubmit={handleSurvivorSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('citizenName')}
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
                {t('safePhone')}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  value={victimPhone}
                  onChange={(e) => setVictimPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="pl-9 bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t('safePin')}
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
              {t('signInBtn')} →
            </Button>
          </form>
        )}

        {/* Footer links */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{t('noAccount')}</span>
          <Link
            href="/sign-up"
            className="text-rani font-bold hover:underline"
          >
            {t('signUpBtn')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
