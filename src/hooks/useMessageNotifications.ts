"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "./useAuth";

interface MessageNotification {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
}

export function useMessageNotifications() {
  const { user } = useAuth();
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const lastCheckRef = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout>();

  const checkForNewMessages = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/messages/unread?since=${lastCheckRef.current.toISOString()}`);
      const data = await response.json();

      if (data.newMessages?.length > 0) {
        setHasNewMessages(true);
        setUnreadCount(prev => prev + data.newMessages.length);
        setIsBlinking(true);
        
        // Stop blinking after 3 seconds
        setTimeout(() => setIsBlinking(false), 3000);
        
        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `You have ${data.newMessages.length} new message(s)`,
            icon: "/favicon.ico",
          });
        }
      }

      lastCheckRef.current = new Date();
    } catch (error) {
      console.error("Error checking for new messages:", error);
    }
  };

  const markAsRead = () => {
    setHasNewMessages(false);
    setUnreadCount(0);
    setIsBlinking(false);
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    if (!user) return;

    // Request notification permission on mount
    requestNotificationPermission();

    // Start polling every 5 seconds
    intervalRef.current = setInterval(checkForNewMessages, 5000);

    // Initial check
    checkForNewMessages();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  return {
    hasNewMessages,
    unreadCount,
    isBlinking,
    markAsRead,
  };
}