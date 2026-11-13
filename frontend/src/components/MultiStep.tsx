'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { CheckCircleIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';

interface HorizontalLinearStepperProps {
  activeStep: number;
  stepContent: React.ReactNode[];
}

export default function HorizontalLinearStepper({
  activeStep,
  stepContent,
}: HorizontalLinearStepperProps) {
  const [poem, setPoem] = React.useState(null as string | null);
  const t = useTranslations('sos');
  const tToast = useTranslations('toasts');
  const locale = useLocale();

  const steps = [
    t('step1Title'),
    t('step2Title'),
    t('step3Title'),
    tToast('reportSubmitted'),
  ];

  React.useEffect(() => {
    if (activeStep === 4 && !poem) {
      const generatePoem = async () => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
              userInput: 'tell me 10 lines poem on women equality',
              language: locale,
            }),
            headers: { 'Content-Type': 'application/json' },
          });

          const result = await response.json();
          if (result.reply) {
            setPoem(result.reply);
          }
        } catch (e) {
          console.log(e);
        }
      };

      generatePoem();
    }
  }, [activeStep, poem, locale]);

  return (
    <div className="max-w-4xl mx-auto w-full mt-6">
      <div className="w-full overflow-x-auto pb-3 pt-1 scrollbar-none">
        <div className="min-w-[500px]">
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
      {activeStep === steps.length ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mt={4}
        >
          <div className="flex items-center gap-1">
            <CheckCircleIcon style={{ fontSize: 60, color: 'green' }} />
            <Typography sx={{ ml: 2 }} variant="h5">
              {tToast('reportSubmitted')}
            </Typography>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all duration-150"
            >
              {t('viewOnDashboard')}
            </Link>
          </div>
          {poem && (
            <Box
              mt={4}
              p={4}
              sx={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.2rem',
                backgroundColor: '#f9f9f9',
                borderLeft: '4px solid #4CAF50',
                color: '#555',
                textAlign: 'center',
                maxWidth: '600px',
                whiteSpace: 'pre-line',
              }}
            >
              {poem.split('. ').map((line, index) => (
                <Typography key={index} variant="body1" gutterBottom>
                  {line.trim()}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ mt: 2, mb: 1 }}>{stepContent[activeStep]}</Box>
      )}
    </div>
  );
}
