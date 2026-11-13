'use client';

import React, { useState, useEffect } from 'react';
import { InputForm } from '@/components/InputForm';
import Share from '@/components/Share';
import { useSafeClerk } from '@/lib/auth-context';
import HorizontalLinearStepper from '@/components/MultiStep';
import ImageGen from '@/components/ImageGen';
import { Link } from '@/i18n/routing';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CreatePostPage() {
  const t = useTranslations('sos');
  const [resImage, setResImage] = useState<string | null>(null);
  const [resText, setText] = useState<string | null>(null);
  const [resTextGemma, setTextGemma] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const { user } = useSafeClerk();
  const [activeStep, setActiveStep] = useState(0);
  const [shared, setShared] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resText && resTextGemma) {
      setActiveStep(1);
    }
  }, [resText, resTextGemma]);

  useEffect(() => {
    if (resImage) {
      setActiveStep(2);
    }
  }, [resImage]);

  useEffect(() => {
    if (shared) {
      setActiveStep(4);
    }
  }, [shared]);

  const stepContent = [
    <InputForm
      key="step1"
      setText={setText}
      setTextGemma={setTextGemma}
      setFormData={setFormData}
    />,
    <ImageGen
      key="step2"
      text={resText || ''}
      setResImage={setResImage}
      textGemma={resTextGemma || ''}
    />,
    <Share
      key="step3"
      imageURL={resImage || ''}
      setShared={setShared}
      resText={resText || ''}
      formData={formData}
    />,
  ];

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center">{t('loadingPortal')}</div>;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-6 px-4">
      {/* Notice Banner */}
      {!user && (
        <div className="w-full mb-6 bg-rani/5 dark:bg-rani/10 border border-rani/20 dark:border-rani/30 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
            <ShieldCheck className="h-4 w-4 text-jade shrink-0" />
            <span>
              {t('anonymousModeNotice')}
            </span>
          </div>
          <Link
            href="/sign-in"
            prefetch={false}
            className="text-rani-600 dark:text-rani-400 hover:underline font-bold shrink-0"
          >
            {t('signInWithAccount')}
          </Link>
        </div>
      )}

      {/* Main Multi-Step Form */}
      <div className="w-full">
        <HorizontalLinearStepper
          activeStep={activeStep}
          stepContent={stepContent}
        />
      </div>
    </div>
  );
}
