"use client";

import { useEffect, useState } from "react";
import { getUnreadNotificationCount, markNotificationsAsRead } from "@/actions/notification.action";
import { Button } from "./ui/button";
import { BellIcon } from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };
    
    fetchCount();
    const interval = setInterval(fetchCount, 15000); // Check every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = async () => {
    if (unreadCount > 0) {
      try {
        await markNotificationsAsRead();
        setUnreadCount(0);
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    }
  };

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="sm" className="relative" onClick={handleClick}>
        <BellIcon className="w-4 h-4" />
        <span className="hidden lg:inline ml-2">Notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
    </Link>
  );
}