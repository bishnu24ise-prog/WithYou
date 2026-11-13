'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { SUPPORTED_LANGUAGES } from './LanguageSwitcher';
import { Globe, Heart, Shield, Check } from 'lucide-react';
import { Button } from './ui/button';

export default function FirstVisitLanguageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = useLocale();
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('firstVisitModal');

  useEffect(() => {
    // Check if the user has already chosen a language on this device
    try {
      const hasChosen = localStorage.getItem('safespark_lang_chosen');
      if (!hasChosen) {
        setIsOpen(true);
      }
    } catch (e) {
      // Storage access might be restricted in private mode
    }
  }, []);

  const handleConfirm = () => {
    try {
      localStorage.setItem('safespark_lang_chosen', 'true');
      document.cookie = `NEXT_LOCALE=${selectedLocale};path=/;max-age=31536000;SameSite=Lax`;
    } catch (e) {}

    setIsOpen(false);
    if (selectedLocale !== currentLocale) {
      router.replace(pathname, { locale: selectedLocale as any });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header with safety reassurance */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rani to-burgundy-400 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-rani/20">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {t('title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* 13 Language Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto pr-1 my-2 max-h-60 scrollbar-thin">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === selectedLocale;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLocale(lang.code)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-rani bg-rose-50/90 dark:bg-rose-950/50 shadow-sm ring-1 ring-rani'
                    : 'border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {lang.native}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {lang.name}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-rani text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info & confirm */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <Shield className="w-3.5 h-3.5 text-accent shrink-0" />
            <span>{t('note')}</span>
          </div>
          <Button
            onClick={handleConfirm}
            className="w-full sm:w-auto bg-rani hover:bg-rani-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-rani/20 text-sm"
          >
            {t('continue')}
          </Button>
        </div>
      </div>
    </div>
  );
}

