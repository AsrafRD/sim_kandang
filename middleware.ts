import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET || 'super-secret-kandang-key-please-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/farm');

  let sessionValid = false;

  if (sessionCookie) {
    try {
      await jwtVerify(sessionCookie, key, {
        algorithms: ['HS256'],
      });
      sessionValid = true;
    } catch (_) {
      sessionValid = false;
    }
  }

  // If trying to access protected route without valid session
  if (isProtectedRoute && !sessionValid) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access auth routes with valid session, redirect to farm selection / default page
  if (isAuthRoute && sessionValid) {
    // In a real app we might want to get the user's default farm, but for now redirect to root or a generic dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/farm/:path*', '/login', '/register'],
};
