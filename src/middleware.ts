import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { routes } from './libs/utils/routes';

const protectedRoutes = ['/dashboard', '/dashboard/*'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  const session = cookies().get('session');
  const role = cookies().get('role');
  const findPage = routes.find((route) => route.href === path);
  const permissionAccessPage =
    role && findPage?.scope.read.includes(role.value);

  if (isProtectedRoute && !session?.value) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if (path === '/login' && session?.value) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (isProtectedRoute && !permissionAccessPage) {
    return NextResponse.redirect(new URL('/404', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
