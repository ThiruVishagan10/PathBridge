"use client";

import Link from "next/link";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import { cn } from "@/lib/utils";

export default function MessageNavLink() {
  const { hasNewMessages, unreadCount, isBlinking, markAsRead } = useMessageNotifications();

  return (
    <Link 
      href="/messages" 
      onClick={markAsRead}
      className={cn(
        "text-sm font-medium hover:text-primary transition-colors relative",
        hasNewMessages && "text-primary font-semibold",
        isBlinking && "animate-pulse"
      )}
    >
      Messages
      {hasNewMessages && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}