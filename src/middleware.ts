import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Path:', pathname, 'Token exists:', !!token);

  // Public routes
  const publicRoutes = ['/sign-in', '/sign-up'];
  
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - redirect if no token
  if (!token) {
    console.log('No token, redirecting to sign-in');
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  console.log('Token found, allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'],
};