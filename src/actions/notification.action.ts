"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function getUnreadNotificationCount() {
  try {
    const user = await getCurrentUser();
    if (!user) return 0;

    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false,
        type: {
          not: "MESSAGE",
        },
      },
    });

    return count;
  } catch (error) {
    return 0;
  }
}

export async function getNotifications() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        type: {
          not: "MESSAGE",
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notifications;
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
}

export async function markNotificationsAsRead(notificationIds?: string[]) {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    if (notificationIds && notificationIds.length > 0) {
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: user.id,
        },
        data: {
          read: true,
        },
      });
    } else {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          read: false,
        },
        data: {
          read: true,
        },
      });
    }

    revalidatePath("/notifications");
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
}

export async function getUnreadMessageCount() {
  try {
    const user = await getCurrentUser();
    if (!user) return 0;

    const count = await prisma.message.count({
      where: {
        receiverId: user.id,
        read: false,
      },
    });

    return count;
  } catch (error) {
    return 0;
  }
}

export async function markMessagesAsRead(senderId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
  }
}