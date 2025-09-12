'use client';

import { BellIcon, HomeIcon, SearchIcon, UserIcon, GraduationCapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { searchUsers } from "@/actions/user.action";
import { signOut } from "@/actions/auth.action";

type SerializedUser = {
  id: string;
  username: string | null;
  emailAddress: string;
  role?: string;
} | null;

type SearchResult = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  _count: {
    followers: number;
    following: number;
  };
}[];

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        try {
          setIsSearching(true);
          setError(null);

          const searchResults = await searchUsers(query);
          setResults(searchResults);
        } catch (err) {
          console.error(err);
          setError("Something went wrong while searching.");
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setError(null);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleUserClick = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-64">
      <div className="relative">
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <SearchIcon
          className={`absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 ${
            isSearching ? "animate-spin text-primary" : "text-muted-foreground"
          }`}
        />
      </div>

      {error && (
        <div className="absolute mt-1 w-full p-2 bg-destructive text-destructive-foreground rounded-md text-sm z-50 shadow">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute mt-1 w-full bg-background border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {results.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              onClick={handleUserClick}
              className="flex items-center gap-2 p-2 hover:bg-accent transition-colors"
            >
              <img
                src={user.image ?? "/default-avatar.png"}
                alt={user.name ?? "User"}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{user.name ?? "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                  <span className="ml-2 text-xs">
                    {user._count.followers} followers
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface DesktopNavbarProps {
  user: SerializedUser;
}

function DesktopNavbar({ user }: DesktopNavbarProps) {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {user ? (
        <>
          <SearchBar />

          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>

          {user.role === 'ALUMNI' && (
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/my-students">
                <GraduationCapIcon className="w-4 h-4" />
                <span className="hidden lg:inline">My Students</span>
              </Link>
            </Button>
          )}

          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.username ?? user.emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>

          <form action={signOut}>
            <Button variant="ghost" size="sm">Sign Out</Button>
          </form>
        </>
      ) : (
        <Link href="/sign-in">
          <Button variant="default">Sign In</Button>
        </Link>
      )}
    </div>
  );
}

export default DesktopNavbar;