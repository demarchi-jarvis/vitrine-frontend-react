import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 2, // 2h — aligns with JWT expiry
  path: '/',
};

function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Same-origin requests may not send Origin header
  try {
    const originUrl = new URL(origin);
    const allowedUrl = new URL(ALLOWED_ORIGIN);
    return originUrl.hostname === allowedUrl.hostname;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json() as { token?: string; nome?: string };
  if (!body?.token) {
    return NextResponse.json({ error: 'Token ausente' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('authToken', body.token, COOKIE_OPTIONS);
  return res;
}

export async function DELETE(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete('authToken');
  return res;
}
