import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isClerkConfigured =
  publishableKey.startsWith('pk_test_') &&
  !publishableKey.includes('ZXhhbXBsZ') &&
  !publishableKey.includes('your_clerk');

export default isClerkConfigured ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
