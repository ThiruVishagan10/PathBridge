"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "@/actions/search.action";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";
import { PlusIcon, SearchIcon } from "lucide-react";

type User = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

export default function StartConversationDialog({ onSelectUser }: { onSelectUser: (user: User) => void }) {
  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      console.log("Dialog opened, fetching users...");
      setLoading(true);
      getAllUsers().then((users) => {
        console.log("Got users:", users);
        setAllUsers(users);
        setLoading(false);
      }).catch(error => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
    }
  }, [open]);

  const filteredUsers = searchTerm 
    ? allUsers.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers;

  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <PlusIcon className="w-4 h-4" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
          <DialogDescription>
            Select a user to start messaging
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.image || "/avatar.png"} />
                  </Avatar>
                  <div className="text-left">
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No users found
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}