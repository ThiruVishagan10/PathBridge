"use client";

import { Button } from "./ui/button";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useMessageNotifications } from "@/hooks/useMessageNotifications";
import { cn } from "@/lib/utils";

export default function MessageButton() {
  const { hasNewMessages, unreadCount, isBlinking, markAsRead } = useMessageNotifications();

  return (
    <Button 
      variant={hasNewMessages ? "default" : "ghost"}
      size="sm" 
      asChild
      className={cn(
        "relative transition-all duration-300",
        isBlinking && "animate-pulse",
        hasNewMessages && "bg-primary/10 border-primary/20 border"
      )}
    >
      <Link href="/messages" onClick={markAsRead}>
        <MessageCircleIcon className="w-4 h-4" />
        <span className="hidden lg:inline ml-2">Messages</span>
        {hasNewMessages && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
}