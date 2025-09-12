"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";

export async function getMyStudents() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ALUMNI') throw new Error("Alumni access required");

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        institution: user.institution
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        institution: true,
        degree: true,
        department: true,
        yearOfStudy: true,
        graduationYear: true,
        skills: true,
        interests: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          }
        },
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

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw new Error("Failed to fetch students");
  }
}

export async function getStudentDetails(studentId: string) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ALUMNI') throw new Error("Alumni access required");

    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true,
        institution: true,
        degree: true,
        department: true,
        yearOfStudy: true,
        graduationYear: true,
        skills: true,
        interests: true,
        projects: true,
        achievements: true,
        linkedinUrl: true,
        githubUrl: true,
        portfolioUrl: true,
        resumeUrl: true,
        location: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
          }
        }
      }
    });

    return student;
  } catch (error) {
    console.error("Error fetching student details:", error);
    throw new Error("Failed to fetch student details");
  }
}