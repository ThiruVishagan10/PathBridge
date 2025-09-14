import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function SignOutPage() {
  const cookieStore = cookies();
  cookieStore.delete('auth-token');
  redirect('/sign-in');
}

export const dynamic = 'force-dynamic';