'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  'Fill out the form',
  'Review and Generate Image',
  'Submit post',
  'Submission complete',
];

interface HorizontalLinearStepperProps {
  activeStep: number;
  stepContent: React.ReactNode[];
}

export default function HorizontalLinearStepper({
  activeStep,
  stepContent,
}: HorizontalLinearStepperProps) {
  const [poem, setPoem] = React.useState(null as string | null);

  React.useEffect(() => {
    if (activeStep === 4 && !poem) {
      const generatePoem = async () => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
              userInput: 'tell me 10 lines poem on women equality',
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
  }, [activeStep, poem]);

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
            <CheckCircle2 className="w-14 h-14 text-accent" />
            <Typography sx={{ ml: 2 }} variant="h5">
              Post successfully submitted!
            </Typography>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burgundy-500 to-burgundy-400 hover:brightness-110 text-beige-50 rounded-xl text-sm font-semibold shadow-md transition-all duration-150"
            >
              View on Live Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {poem && (
            <Box
              mt={4}
              p={4}
              sx={{
                fontFamily: 'var(--font-display), Georgia, serif',
                fontSize: '1.2rem',
                backgroundColor: 'hsl(var(--card))',
                borderLeft: '4px solid var(--accent)',
                color: 'hsl(var(--muted-foreground))',
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
