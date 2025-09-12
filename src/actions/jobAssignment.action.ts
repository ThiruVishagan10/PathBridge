"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function createJobAssignment(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ALUMNI") {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadline = formData.get("deadline") as string;
    const assignmentType = formData.get("assignmentType") as string;
    const skillsRequired = formData.get("skillsRequired") as string;

    const assignment = await prisma.jobAssignment.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        assignmentType,
        skillsRequired: skillsRequired ? skillsRequired.split(",").map(s => s.trim()) : [],
        createdById: user.id,
      },
    });

    revalidatePath("/jobs");
    revalidatePath("/refer");
    return { success: true, assignment };
  } catch (error) {
    console.error("Error creating job assignment:", error);
    return { success: false, error: "Failed to create assignment" };
  }
}

export async function getJobAssignments() {
  try {
    const user = await getCurrentUser();
    const assignments = await prisma.jobAssignment.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const result = assignments.map(assignment => ({
      ...assignment,
      isOwner: user?.id === assignment.createdById,
    }));

    return result;
  } catch (error) {
    console.error("Error fetching job assignments:", error);
    return [];
  }
}

export async function getMyJobAssignments() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const assignments = await prisma.jobAssignment.findMany({
      where: {
        createdById: user.id,
      },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return assignments;
  } catch (error) {
    console.error("Error fetching my job assignments:", error);
    return [];
  }
}

export async function submitAssignment(assignmentId: string, submissionText: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const existingSubmission = await prisma.jobSubmission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.id,
        },
      },
    });

    if (existingSubmission) {
      throw new Error("You have already submitted this assignment");
    }

    const submission = await prisma.jobSubmission.create({
      data: {
        assignmentId,
        studentId: user.id,
        submissionText,
      },
    });

    revalidatePath("/jobs");
    return { success: true, submission };
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit assignment" };
  }
}

export async function getAssignmentSubmissions(assignmentId: string) {
  "use server";
  
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ALUMNI") {
      return { success: false, error: "Unauthorized" };
    }

    const submissions = await prisma.jobSubmission.findMany({
      where: {
        assignmentId,
        assignment: {
          createdById: user.id,
        },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            email: true,
          },
        },
        assignment: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, submissions };
  } catch (error) {
    console.error("Error fetching assignment submissions:", error);
    return { success: false, error: "Failed to fetch submissions" };
  }
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: string,
  reviewNotes?: string,
  referralCompany?: string
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ALUMNI") {
      throw new Error("Unauthorized");
    }

    const submission = await prisma.jobSubmission.update({
      where: { id: submissionId },
      data: {
        status: status as any,
        reviewNotes,
        referralCompany,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        assignment: {
          select: {
            title: true,
          },
        },
      },
    });

    // Send congratulatory message if referred
    if (status === "REFERRED" && referralCompany && reviewNotes) {
      const congratsMessage = `🎉 Congratulations! You have been referred to ${referralCompany} based on your excellent performance in the "${submission.assignment.title}" assignment.\n\nReferral Notes: ${reviewNotes}\n\nBest of luck with your application!`;
      
      await prisma.message.create({
        data: {
          content: congratsMessage,
          senderId: user.id,
          receiverId: submission.student.id,
        },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          userId: submission.student.id,
          creatorId: user.id,
          type: "MESSAGE",
        },
      });
    }

    revalidatePath("/refer");
    revalidatePath("/messages");
    revalidatePath("/notifications");
    return { success: true, submission };
  } catch (error) {
    console.error("Error updating submission status:", error);
    return { success: false, error: "Failed to update submission" };
  }
}