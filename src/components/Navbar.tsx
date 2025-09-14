import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions/auth.action";
import { Button } from "./ui/button";
import { UserIcon } from "lucide-react";

import MessageButton from "./MessageButton";
import NotificationBell from "./NotificationBell";
import MessageNavLink from "./MessageNavLink";

async function Navbar() {
  const user = await getCurrentUser();
  const isAlumni = user?.role === "ALUMNI";

  return (
    <nav className="sticky top-0 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="PathBridge" className="h-24 w-auto" />
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                
                {isAlumni ? (
                  <>
                    <Link href="/refer" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                      Refer
                    </Link>
                    <Link href="/my-students" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                      My Students
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/jobs" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                      Jobs
                    </Link>
                    <Link href="/my-mentor" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
                      My Mentor
                    </Link>
                  </>
                )}
                
                <MessageNavLink />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">

            
            {user ? (
              <>
                
                <NotificationBell />
                
                {!isAlumni && (
                  <Button variant="ghost" size="sm" asChild className="text-white hover:text-gray-300">
                    <Link href="/portfolio-templates">
                      <span className="hidden lg:inline">Generate Portfolio</span>
                    </Link>
                  </Button>
                )}
                
                <Button variant="ghost" size="sm" asChild className="text-white hover:text-gray-300">
                  <Link href={`/profile/${user.username}`}>
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden lg:inline ml-2">Profile</span>
                  </Link>
                </Button>
                

                
                <form action={signOut}>
                  <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">Sign Out</Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200">Sign Up</Button>
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