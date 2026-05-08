import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
}

export function parseToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  const payload = parseToken(token);
  if (!payload) return true;
  // bufferSeconds provides a safety margin for clock skew between client and server
  return payload.exp < Date.now() / 1000 + bufferSeconds;
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/authToken=([^;]+)/);
  return match ? match[1] : null;
}

export function getTokenExpiresAt(token: string): Date | null {
  const payload = parseToken(token);
  if (!payload) return null;
  return new Date(payload.exp * 1000);
}

export function getTokenSubject(token: string): string | null {
  return parseToken(token)?.sub ?? null;
}
