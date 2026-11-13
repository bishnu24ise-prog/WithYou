import type { Metadata } from 'next';
import '../globals.css';
import { SafeAuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import QuickExitBar from '@/components/QuickExitBar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import ServiceWorkerCleaner from '@/components/ServiceWorkerCleaner';
import FirstVisitLanguageModal from '@/components/FirstVisitLanguageModal';
import { GnaniVoiceGuide } from '@/components/GnaniVoiceGuide';
import WaterDropRipple from '@/components/WaterDropRipple';
import StickyBottomHelplineBar from '@/components/StickyBottomHelplineBar';
import MuiThemeProvider from '@/components/MuiThemeProvider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Noto Sans', 'Noto Naskh Arabic', 'sans-serif'],
});

const fontDisplay = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'Noto Nastaliq Urdu', 'serif'],
});

export const metadata: Metadata = {
  title: 'SafeSpark - Confidential Support & Legal Protection Platform',
  description:
    'Discreet emergency distress reporting, 24/7 AI legal assistant, and empathetic therapy support.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = locale === 'ur-IN';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased selection:bg-rani selection:text-white`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SafeAuthProvider>
            <ServiceWorkerCleaner />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MuiThemeProvider>
                <div className="min-h-screen flex flex-col bg-background text-foreground relative">
                  <WaterDropRipple />
                  <QuickExitBar />
                  <Navbar />
                  <main className="flex-1 flex flex-col">{children}</main>
                  <StickyBottomHelplineBar />
                  <FirstVisitLanguageModal />
                  <GnaniVoiceGuide />
                </div>
                <Toaster position="top-right" />
              </MuiThemeProvider>
            </ThemeProvider>
          </SafeAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
