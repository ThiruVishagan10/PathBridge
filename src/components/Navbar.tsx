import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions/auth.action";
import { Button } from "./ui/button";
import { SearchIcon, UserIcon } from "lucide-react";
import { Input } from "./ui/input";
import { ModeToggle } from "./ModeToggle";
import MessageButton from "./MessageButton";
import NotificationBell from "./NotificationBell";
import MessageNavLink from "./MessageNavLink";

async function Navbar() {
  const user = await getCurrentUser();
  const isAlumni = user?.role === "ALUMNI";

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary font-mono tracking-wider">
              PathBridge
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                
                {isAlumni ? (
                  <>
                    <Link href="/refer" className="text-sm font-medium hover:text-primary transition-colors">
                      Refer
                    </Link>
                    <Link href="/my-students" className="text-sm font-medium hover:text-primary transition-colors">
                      My Students
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
                      Jobs
                    </Link>
                    <Link href="/my-mentor" className="text-sm font-medium hover:text-primary transition-colors">
                      My Mentor
                    </Link>
                  </>
                )}
                
                <MessageNavLink />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <Input 
                    type="search" 
                    placeholder="Search..." 
                    className="w-64"
                  />
                </div>
                

                
                <NotificationBell />
                
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/profile/${user.username}`}>
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden lg:inline ml-2">Profile</span>
                  </Link>
                </Button>
                

                
                <form action={signOut}>
                  <Button variant="outline" size="sm">Sign Out</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;