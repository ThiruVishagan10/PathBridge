"use client";

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MessageNotificationBell() {
  const { hasNewMessages, unreadCount, isBlinking, markAsRead } = useMessageNotifications();

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn(
        "relative",
        isBlinking && "animate-pulse"
      )}
      onClick={markAsRead}
    >
      <Link href="/messages">
        <Bell className="w-4 h-4" />
        {hasNewMessages && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}