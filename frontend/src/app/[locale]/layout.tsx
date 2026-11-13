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
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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
        className="font-sans antialiased selection:bg-rani selection:text-white"
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
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <QuickExitBar />
                <Navbar />
                <main className="flex-1 flex flex-col">{children}</main>
                <FirstVisitLanguageModal />
                <GnaniVoiceGuide />
              </div>
              <Toaster position="top-right" />
            </ThemeProvider>
          </SafeAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
