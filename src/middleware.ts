// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token'); // Get the token from cookies

  // If the user is authenticated and tries to access the login page, redirect to home
  if (token && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Define public routes and APIs
  const publicRoutes = [
    '/login', // Allow access to the login page
    '/register', // Allow access to the registration page
    '/api', // Allow access to all routes starting with /api/
    '/_next/static', // Allow access to Next.js static files
    '/_next/image', // Allow access to Next.js image optimization
    '/favicon.ico', // Allow access to the favicon
  ];

  // Check if the request is for a public route or API
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes and APIs
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to /profile if the user is on the root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // If the user is not authenticated and the route is not public, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}