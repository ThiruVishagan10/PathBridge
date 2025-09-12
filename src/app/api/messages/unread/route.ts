import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since");
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const newMessages = await prisma.message.findMany({
      where: {
        receiverId: user.id,
        read: false,
        createdAt: {
          gte: sinceDate,
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalUnread = await prisma.message.count({
      where: {
        receiverId: user.id,
        read: false,
      },
    });

    return NextResponse.json({
      newMessages,
      totalUnread,
    });
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}