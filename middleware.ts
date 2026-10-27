import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE, verifySession } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const session = await verifySession(req.cookies.get(COOKIE)?.value, process.env.AUTH_SECRET);
  if (session) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|images|favicon.ico|icon.svg|manifest.webmanifest).*)'],
};
