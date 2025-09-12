"use client";

import { useState } from "react";
import { sendMessage } from "@/actions/message.action";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
};

type User = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

export default function ChatInterface({ 
  otherUser, 
  initialMessages 
}: { 
  otherUser: User;
  initialMessages: Message[];
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending || !user) return;

    setIsSending(true);
    try {
      const result = await sendMessage(otherUser.id, newMessage);
      if (result.success && result.message) {
        setMessages(prev => [...prev, {
          ...result.message,
          sender: {
            id: user.id,
            name: user.name,
            username: user.username,
            image: user.image,
          }
        }]);
        setNewMessage("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-row items-center gap-3 pb-4">
        <Avatar>
          <AvatarImage src={otherUser.image || "/avatar.png"} />
        </Avatar>
        <div>
          <h3 className="font-medium">{otherUser.name}</h3>
          <p className="text-sm text-muted-foreground">@{otherUser.username}</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender.id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender.id !== user?.id && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={message.sender.image || "/avatar.png"} />
                </Avatar>
              )}
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender.id === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatDistanceToNow(new Date(message.createdAt))} ago
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            disabled={isSending}
          />
          <Button onClick={handleSend} disabled={!newMessage.trim() || isSending}>
            <SendIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}