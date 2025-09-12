"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function sendMessage(receiverId: string, content: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true, 
            username: true,
            image: true,
          },
        },
      },
    });

    // Create notification for message
    await prisma.notification.create({
      data: {
        userId: receiverId,
        creatorId: user.id,
        type: "MESSAGE",
      },
    });

    revalidatePath("/messages");
    revalidatePath("/notifications");
    return { success: true, message };
  } catch (error) {
    return { success: false, error: "Failed to send message" };
  }
}

export async function getConversations() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return conversations;
  } catch (error) {
    return [];
  }
}

export async function getMessages(otherUserId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: user.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error) {
    return [];
  }
}