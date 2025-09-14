import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('MIDDLEWARE RUNNING FOR:', request.nextUrl.pathname);
  
  // Force redirect to test
  if (request.nextUrl.pathname === '/') {
    console.log('Redirecting / to /sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};