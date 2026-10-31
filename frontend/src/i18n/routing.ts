import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: [
    'en-IN',
    'hi-IN',
    'bn-IN',
    'ta-IN',
    'te-IN',
    'kn-IN',
    'ml-IN',
    'mr-IN',
    'gu-IN',
    'pa-IN',
    'od-IN',
    'as-IN',
    'ur-IN',
  ],
  defaultLocale: 'en-IN',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

