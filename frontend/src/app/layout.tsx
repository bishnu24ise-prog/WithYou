import type { Metadata } from 'next';
import './globals.css';
import { Roboto } from 'next/font/google';
import { SafeAuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import QuickExitBar from '@/components/QuickExitBar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';
import ServiceWorkerCleaner from '@/components/ServiceWorkerCleaner';

export const metadata: Metadata = {
  title: 'SafeSpark - Confidential Support & Legal Protection Platform',
  description: 'Discreet emergency distress reporting, 24/7 AI legal assistant, and empathetic therapy support.',
};

const roboto = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.className} antialiased selection:bg-rani selection:text-white`}
        suppressHydrationWarning
      >
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
            </div>
            <Toaster position="top-right" />
          </ThemeProvider>
        </SafeAuthProvider>
      </body>
    </html>
  );
}
