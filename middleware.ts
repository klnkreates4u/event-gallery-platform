import { auth } from '@/../auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === '/admin';
  const isAdminDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
    }
    return null;
  }

  if (isAdminDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
