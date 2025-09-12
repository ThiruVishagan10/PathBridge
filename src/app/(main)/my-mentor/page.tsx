import { getCurrentUser } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import MyMentorClient from './MyMentorClient';
import { getMyMentor, getMeetings, getAvailableMentors } from '@/actions/student.action';

export default async function MyMentorPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'STUDENT') {
    redirect('/');
  }

  const [mentor, meetings, availableMentors] = await Promise.all([
    getMyMentor(),
    getMeetings(),
    getAvailableMentors()
  ]);

  return <MyMentorClient mentor={mentor} meetings={meetings} availableMentors={availableMentors} />;
}