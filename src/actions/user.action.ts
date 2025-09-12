"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-auth";
import { revalidatePath } from "next/cache";

export async function toggleFollow(targetUserId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.follows.create({
        data: {
          followerId: user.id,
          followingId: targetUserId,
        },
      });
      
      // Create notification for follow
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          creatorId: user.id,
          type: "FOLLOW",
        },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update follow status" };
  }
}

export async function getDbUserId() {
  try {
    const user = await getCurrentUser();
    return user?.id || null;
  } catch (error) {
    return null;
  }
}

export async function getFollowing() {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) return [];

    const [following, followers] = await Promise.all([
      prisma.follows.findMany({
        where: { followerId: currentUserId },
        include: {
          following: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      }),
      prisma.follows.findMany({
        where: { followingId: currentUserId },
        include: {
          follower: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      }),
    ]);

    const followingUsers = following.map(f => f.following);
    const followerUsers = followers.map(f => f.follower);
    
    const allUsers = [...followingUsers, ...followerUsers];
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );

    return uniqueUsers;
  } catch (error) {
    return [];
  }
}

export async function getRandomUsers() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const followingIds = await prisma.follows.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });

    const users = await prisma.user.findMany({
      where: {
        NOT: {
          OR: [
            { id: user.id },
            { id: { in: followingIds.map(f => f.followingId) } },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        role: true,
        currentPosition: true,
        currentOrganization: true,
        interests: true,
        linkedinUrl: true,
        githubUrl: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return users;
  } catch (error) {
    return [];
  }
}