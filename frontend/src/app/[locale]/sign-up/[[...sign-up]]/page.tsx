'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { useSafeClerk } from '@/lib/auth-context';
import { Shield, User, ArrowLeft, Lock, Mail, BadgeCheck, Sparkles, Building, Phone, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

export default function SignUpPage() {
  const router = useRouter();
  const { loginAs } = useSafeClerk();
  const t = useTranslations('auth');
  const [activeTab, setActiveTab] = useState<'authority' | 'victim'>('victim');

  // Authority Form State
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authDept, setAuthDept] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [authPassword, setAuthPassword] = useState('');

  // Survivor Form State
  const [victimName, setVictimName] = useState('');
  const [victimPhone, setVictimPhone] = useState('');
  const [victimPin, setVictimPin] = useState('');

  const handleAuthoritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('authority', {
      name: authName.trim() || 'Insp. Rajesh Kumar',
      email: authEmail.trim() || 'rajesh.kumar@delhipolice.gov.in',
      department: authDept.trim() || 'Women Safety & Cyber Crime Cell',
      badge: badgeId.trim() ? `Badge #${badgeId}` : 'Law Enforcement / Official',
    });
    router.push('/dashboard');
  };

  const handleSurvivorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs('victim', {
      name: victimName.trim() || 'Anonymous Survivor',
      email: victimPhone.trim() || 'confidential@safespark.org',
      department: 'Protected Account',
      badge: 'Protected Citizen',
    });
    router.push('/create-post');
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
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('signUpTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {t('demoDisclaimer')}
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800">
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
            <span>{t('citizenTab')}</span>
          </button>
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
            <span>{t('officialTab')}</span>
          </button>
        </div>

        {/* Tab 1: Survivor Registration */}
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
                  placeholder="Create a private PIN or password"
                  className="pl-9 bg-white dark:bg-slate-950"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rani via-saffron to-marigold hover:opacity-95 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm"
            >
              {t('signUpBtn')} →
            </Button>
          </form>
        )}

        {/* Tab 2: Authority Registration */}
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
                  placeholder="e.g. Insp. Rajesh Kumar"
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
                  placeholder="e.g. rajesh.kumar@delhipolice.gov.in"
                  className="pl-9 bg-white dark:bg-slate-950"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('department')}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <Input
                    value={authDept}
                    onChange={(e) => setAuthDept(e.target.value)}
                    placeholder="e.g. Connaught Place PS"
                    className="pl-9 bg-white dark:bg-slate-950"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t('badgeId')}
                </label>
                <Input
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  placeholder="e.g. DP-88392"
                  className="bg-white dark:bg-slate-950"
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
              {t('signUpBtn')} →
            </Button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">
            {t('haveAccount')}{' '}
            <Link href="/sign-in" className="text-rani font-bold hover:underline">
              {t('signInBtn')}
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
