import { getMyStudents } from '@/actions/alumni.action';
import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import MyStudentsClient from './MyStudentsClient';

export default async function MyStudentsPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'ALUMNI') {
    redirect('/');
  }

  const students = await getMyStudents();

  return <MyStudentsClient students={students} />;
}