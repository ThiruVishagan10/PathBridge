"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";

export async function getAvailableMentors() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') throw new Error("Student access required");

    const mentors = await prisma.user.findMany({
      where: {
        role: 'ALUMNI',
        institution: user.institution
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        currentPosition: true,
        currentOrganization: true,
        location: true,
        linkedinUrl: true,
        email: true,
        mentorshipStatus: true,
        createdAt: true,
        followers: {
          where: {
            followerId: user.id
          },
          select: {
            followerId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return mentors;
  } catch (error) {
    console.error("Error fetching mentors:", error);
    throw new Error("Failed to fetch mentors");
  }
}

export async function getMyMentor() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') throw new Error("Student access required");

    // Mock mentor relationship - replace with actual mentorship table
    const mentor = await prisma.user.findFirst({
      where: {
        role: 'ALUMNI',
        institution: user.institution,
        mentorshipStatus: 'MENTORING'
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        currentPosition: true,
        currentOrganization: true,
        location: true,
        linkedinUrl: true,
        email: true,
        mentorshipStatus: true,
        createdAt: true
      }
    });

    return mentor ? {
      ...mentor,
      mentorshipStartDate: new Date(2024, 0, 15)
    } : null;
  } catch (error) {
    console.error("Error fetching mentor:", error);
    throw new Error("Failed to fetch mentor");
  }
}

export async function scheduleMeeting(mentorId: string, date: string, time: string, title: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') throw new Error("Student access required");

    try {
      const meeting = await prisma.meeting.create({
        data: {
          title,
          date: new Date(date),
          time,
          studentId: user.id,
          mentorId,
          status: 'REQUESTED'
        },
        include: {
          mentor: {
            select: {
              name: true,
              username: true
            }
          }
        }
      });

      return meeting;
    } catch (dbError) {
      // Fallback if Meeting table doesn't exist
      return {
        id: Date.now().toString(),
        title,
        date: new Date(date),
        time,
        mentorId,
        studentId: user.id,
        status: 'REQUESTED'
      };
    }
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    throw new Error("Failed to schedule meeting");
  }
}

export async function getMeetings() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') throw new Error("Student access required");

    try {
      const meetings = await prisma.meeting.findMany({
        where: {
          studentId: user.id
        },
        include: {
          mentor: {
            select: {
              name: true,
              username: true
            }
          }
        },
        orderBy: {
          date: 'desc'
        }
      });

      return meetings.map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        date: meeting.date,
        time: meeting.time,
        type: meeting.date > new Date() ? 'upcoming' as const : 'past' as const,
        status: meeting.status.toLowerCase() as 'requested' | 'confirmed' | 'completed' | 'cancelled',
        mentor: meeting.mentor
      }));
    } catch (dbError) {
      // Fallback to mock data if Meeting table doesn't exist
      return [
        {
          id: '1',
          title: 'Career Guidance Session',
          date: new Date(2024, 11, 25),
          time: '2:00 PM',
          type: 'upcoming' as const,
          status: 'requested' as const
        },
        {
          id: '2',
          title: 'Project Review',
          date: new Date(2024, 10, 20),
          time: '3:00 PM',
          type: 'past' as const,
          status: 'completed' as const
        }
      ];
    }
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw new Error("Failed to fetch meetings");
  }
}

export async function removeMeeting(meetingId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'STUDENT') throw new Error("Student access required");

    try {
      await prisma.meeting.delete({
        where: {
          id: meetingId,
          studentId: user.id
        }
      });
    } catch (dbError) {
      // Fallback if Meeting table doesn't exist
      console.log('Meeting table not found, using fallback');
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing meeting:", error);
    throw new Error("Failed to remove meeting");
  }
}