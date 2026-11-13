'use client';

import React, { useState, useEffect } from 'react';
import { WatchAlert, WatchTarget, INITIAL_WATCH_ALERTS, WATCH_TARGETS } from '@/data/watch';
import { Bell, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export function UpdatesFeed() {
  const t = useTranslations('dashboard');
  const [alerts, setAlerts] = useState<WatchAlert[]>(INITIAL_WATCH_ALERTS);
  const [targets, setTargets] = useState<WatchTarget[]>(WATCH_TARGETS);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Initial fetch from watch endpoint
    fetch('/api/tinyfish/watch')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.alerts) setAlerts(data.alerts);
        if (data?.targets) setTargets(data.targets);
      })
      .catch((err) => console.warn('Watch fetch error:', err));
  }, []);

  const handleRunCheck = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/tinyfish/watch', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.alerts) setAlerts(data.alerts);
        toast.success(`TinyFish Watch: ${data.checkedCount || 4} statutory portals verified! 📡`);
      } else {
        toast.error('Watch check encountered an issue.');
      }
    } catch {
      toast.error('Network error during watch check.');
    } finally {
      setIsChecking(false);
    }
  };

  const localizeTargetName = (name: string) => {
    if (name.includes('NCW') || name.includes('Commission for Women')) return t('targetNcw');
    if (name.includes('NALSA') || name.includes('Legal Services')) return t('targetNalsa');
    if (name.includes('Cyber Crime')) return t('targetCyber');
    if (name.includes('Domestic Violence') || name.includes('WCD')) return t('targetWcdAct');
    return name.split('(')[0].trim();
  };

  const localizePortalName = (name: string) => {
    if (name.includes('Cyber Crime')) return t('targetCyber');
    if (name.includes('Women & Child')) return t('targetWcd');
    if (name.includes('NALSA') || name.includes('Legal Services')) return t('targetNalsa');
    if (name.includes('NCW') || name.includes('Commission for Women')) return t('targetNcw');
    return name;
  };

  const localizeAlertType = (type: string) => {
    if (type === 'PORTAL_MAINTENANCE') return t('alertPortalMaintenance');
    if (type === 'STATUTE_AMENDMENT') return t('alertStatuteAmendment');
    if (type === 'HELPLINE_ROUTING') return t('alertHelplineRouting');
    if (type === 'SURVEY_UPDATE') return t('alertSurveyUpdate');
    return type.replace('_', ' ');
  };

  const localizeDiff = (alert: WatchAlert) => {
    if (alert.id === 'alert-1' || alert.diffSummary.includes('1930')) return t('alert1Diff');
    if (alert.id === 'alert-2' || alert.diffSummary.includes('Sakhi One Stop Centres')) return t('alert2Diff');
    if (alert.id === 'alert-3' || alert.diffSummary.includes('15100')) return t('alert3Diff');
    return alert.diffSummary;
  };

  return (
    <div className="w-full space-y-4">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rani/10 text-rani rounded-xl">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {t('watchTitle')}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rani/10 text-rani uppercase tracking-wide">
              {t('watchMonitor')}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('watchDesc')}
          </p>
        </div>

        <Button
          onClick={handleRunCheck}
          disabled={isChecking}
          className="bg-gradient-to-r from-rani to-saffron hover:opacity-95 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? t('checking') : t('runCheck')}</span>
        </Button>
      </div>

      {/* Monitored Portals Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          {t('activelyMonitored')}
        </span>
        {targets.map((target) => (
          <a
            key={target.id}
            href={target.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium shrink-0 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{localizeTargetName(target.name)}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        ))}
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rani/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    alert.severity === 'high'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200'
                      : alert.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200'
                  }`}
                >
                  {localizeAlertType(alert.type)}
                </span>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {localizePortalName(alert.portalName)}
                </span>
                <span className="text-[10px] text-slate-400">
                  • {t('detectedPrefix')} {new Date(alert.detectedAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {localizeDiff(alert)}
              </p>
            </div>

            <a
              href={alert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-blue-600 dark:text-blue-400 text-xs font-semibold shrink-0 border border-slate-200 dark:border-slate-700 transition-colors self-end sm:self-auto"
            >
              <span>{t('viewSource')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
