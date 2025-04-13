import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get('loggedIn')?.value;

  // Check if the request is for /dashboard or its subroutes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If not logged in, redirect to login page
    if (!loggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*', 
};
