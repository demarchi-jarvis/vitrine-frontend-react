import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie, isTokenExpired } from '@/lib/auth/token';

const PROTECTED_PATHS = [
  '/painel',
  '/perfil',
  '/carrinho',
  '/pedidos',
  '/cadastrar-produto',
  '/editar-produto',
  '/gerenciar-vendas',
  '/contato',
];

const PUBLIC_ONLY_PATHS = ['/entrar', '/registrar'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isPublicOnly = PUBLIC_ONLY_PATHS.some((p) => pathname.startsWith(p));

  const cookieHeader = request.headers.get('cookie');
  const token = getTokenFromCookie(cookieHeader);
  const isAuthed = token !== null && !isTokenExpired(token);

  if (isProtected && !isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = '/entrar';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isPublicOnly && isAuthed) {
    const redirect = request.nextUrl.searchParams.get('redirect') ?? '/painel';
    const url = request.nextUrl.clone();
    url.pathname = redirect.startsWith('/') ? redirect : '/painel';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets|robots.txt|sitemap.xml).*)',
  ],
};
