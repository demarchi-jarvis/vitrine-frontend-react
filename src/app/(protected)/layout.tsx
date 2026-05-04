import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isTokenExpired } from '@/lib/auth/token';
import { ROUTES } from '@/lib/routes';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token || isTokenExpired(token)) {
    redirect(ROUTES.entrar);
  }

  return <>{children}</>;
}
