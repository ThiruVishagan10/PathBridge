import { cookies } from 'next/headers';
import { getUserFromToken } from './auth';

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;

    return await getUserFromToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAlumni() {
  const user = await requireAuth();
  if (user.role !== 'ALUMNI') throw new Error('Alumni access required');
  return user;
}