"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";

export async function getAllUsers() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    // Get all users except current user
    const users = await prisma.user.findMany({
      where: {
        NOT: { id: currentUser.id }
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      }
    });

    return users;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}