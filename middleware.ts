import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired } from '@/lib/auth/token';

const PROTECTED = [
  '/painel',
  '/perfil',
  '/carrinho',
  '/pedidos',
  '/cadastrar-produto',
  '/editar-produto',
  '/gerenciar-vendas',
  '/contato',
];

const AUTH_ONLY = ['/entrar', '/registrar'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;

  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  const isAuthOnly = AUTH_ONLY.some((r) => pathname.startsWith(r));

  if (isProtected) {
    if (!token || isTokenExpired(token)) {
      const res = NextResponse.redirect(new URL('/entrar', request.url));
      if (token) res.cookies.delete('authToken');
      return res;
    }
  }

  if (isAuthOnly && token && !isTokenExpired(token)) {
    return NextResponse.redirect(new URL('/painel', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
