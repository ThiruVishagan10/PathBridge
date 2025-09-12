"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getMessages, sendMessage } from "@/actions/message.action";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendIcon, SearchIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import StartConversationDialog from "./StartConversationDialog";

type Message = {
  id: string;
  content: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
};

export default function MessagingInterface({ initialConversations, currentUser }: { 
  initialConversations: Message[];
  currentUser: { id: string; name: string | null; username: string; image: string | null; } | null;
}) {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const targetUser = searchParams.get('user');
  const prefilledMessage = searchParams.get('message');

  // Group conversations by user
  const [conversations, setConversations] = useState(() => {
    return initialConversations.reduce((acc, message) => {
      const otherUser = message.senderId === currentUser?.id ? message.receiver : message.sender;
      const key = otherUser.id;
      
      if (!acc[key] || new Date(message.createdAt) > new Date(acc[key].createdAt)) {
        acc[key] = { ...message, otherUser };
      }
      return acc;
    }, {} as any);
  });

  useEffect(() => {
    // Fetch all users for new conversations
    import("@/actions/search.action").then(({ getAllUsers }) => {
      getAllUsers().then((users) => {
        setAllUsers(users);
      });
    });
  }, []);

  useEffect(() => {
    // Auto-select user if specified in URL
    if (targetUser && allUsers.length > 0) {
      const user = allUsers.find(u => u.username === targetUser);
      if (user) {
        handleSelectChat(user.id);
        // Set pre-filled message if provided
        if (prefilledMessage) {
          setNewMessage(decodeURIComponent(prefilledMessage));
        }
      }
    }
  }, [targetUser, allUsers, prefilledMessage]);

  const filteredConversations = Object.values(conversations).filter((conv: any) =>
    conv.otherUser.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMessages = async (userId: string) => {
    const msgs = await getMessages(userId);
    setMessages(msgs);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh messages every 5 seconds
  useEffect(() => {
    if (selectedChat) {
      const interval = setInterval(async () => {
        try {
          const newMessages = await getMessages(selectedChat);
          if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
            setMessages(newMessages);
          }
        } catch (error) {
          console.error('Failed to refresh messages:', error);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedChat, messages]);

  const handleSelectChat = (userId: string) => {
    setSelectedChat(userId);
    loadMessages(userId);
    
    // Add user to conversations if not already there
    if (!conversations[userId]) {
      const user = allUsers?.find(u => u.id === userId);
      if (user) {
        conversations[userId] = {
          otherUser: user,
          content: "Start a conversation...",
          createdAt: new Date(),
          id: `temp-${userId}`,
          senderId: userId,
          receiverId: currentUser?.id || "",
          sender: user,
          receiver: currentUser || { id: "", name: null, username: "", image: null }
        };
      }
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || isSending || !selectedChat || !currentUser) return;

    setIsSending(true);
    try {
      const result = await sendMessage(selectedChat, newMessage);
      if (result.success && result.message) {
        const newMsg = {
          ...result.message,
          sender: {
            id: currentUser.id,
            name: currentUser.name,
            username: currentUser.username,
            image: currentUser.image,
          }
        };
        setMessages(prev => [...prev, newMsg]);
        setNewMessage("");
        
        // Update conversations list with new message
        setConversations(prev => ({
          ...prev,
          [selectedChat]: {
            ...newMsg,
            otherUser: conversations[selectedChat]?.otherUser
          }
        }));
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const selectedUser = selectedChat ? conversations[selectedChat]?.otherUser : null;

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      {/* Conversations Sidebar */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <StartConversationDialog onSelectUser={(user) => handleSelectChat(user.id)} />
          </div>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          {filteredConversations.length > 0 ? (
            <div className="space-y-1">
              {filteredConversations.map((conv: any) => (
                <button
                  key={conv.otherUser.id}
                  onClick={() => handleSelectChat(conv.otherUser.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left hover:bg-accent transition-colors ${
                    selectedChat === conv.otherUser.id ? "bg-accent" : ""
                  }`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.otherUser.image || "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{conv.otherUser.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conv.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conv.content}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No conversations found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <CardHeader className="flex-row items-center gap-3 pb-4 border-b">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.image || "/avatar.png"} />
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 h-[500px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.senderId === currentUser?.id ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.senderId !== currentUser?.id && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarImage src={message.sender.image || "/avatar.png"} />
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl break-words ${
                          message.senderId === currentUser?.id
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
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-background">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} disabled={!newMessage.trim() || isSending}>
                    <SendIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}