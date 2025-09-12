import { getCurrentUser } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}