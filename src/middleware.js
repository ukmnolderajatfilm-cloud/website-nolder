import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Biarkan semua request admin lewat, client-side akan handle authentication
  // Ini untuk mencegah redirect loop
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
