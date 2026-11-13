import { clerkMiddleware } from '@clerk/nextjs/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createIntlMiddleware(routing);

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isClerkConfigured =
  publishableKey.startsWith('pk_test_') &&
  !publishableKey.includes('ZXhhbXBsZ') &&
  !publishableKey.includes('your_clerk');

function middlewareHandler(req: NextRequest) {
  const host = req.headers.get('host') || '';
  // Canonical redirect: merge all old URLs into the single official project URL
  if (
    host.includes('safespark.vercel.app') ||
    host.includes('safespark-app.vercel.app')
  ) {
    const targetUrl = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      'https://with-you-puce.vercel.app'
    );
    return NextResponse.redirect(targetUrl, 308);
  }

  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/chat') ||
    pathname.startsWith('/avatar') ||
    pathname.startsWith('/models') ||
    pathname.startsWith('/animations')
  ) {
    return NextResponse.next();
  }
  return handleI18nRouting(req);
}

export default isClerkConfigured
  ? clerkMiddleware(async (_auth, req) => {
      return middlewareHandler(req);
    })
  : (req: NextRequest) => middlewareHandler(req);

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and avatar bundle
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf|fbx|bin)|avatar|models|animations).*)',
    '/(api|trpc)(.*)',
  ],
};
