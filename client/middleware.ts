import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth?.user;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/home', '/chat', '/profile', '/dashboard'];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from login page to home
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
});

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)'
  ]
};
