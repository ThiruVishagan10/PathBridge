import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { LinkIcon, MapPinIcon, GraduationCapIcon, UserIcon, ExternalLinkIcon, CodeIcon, BriefcaseIcon } from "lucide-react";

async function Sidebar() {
  const user = await getCurrentUser();
  if (!user) return <UnAuthenticatedSidebar />;

  const isAlumni = user.role === "ALUMNI";

  return (
    <div className="sticky top-20">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={user.image || "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
                <div className="flex items-center justify-center text-xs text-primary">
                  {isAlumni ? (
                    <>
                      <GraduationCapIcon className="w-3 h-3 mr-1" />
                      Alumni
                    </>
                  ) : (
                    <>
                      <UserIcon className="w-3 h-3 mr-1" />
                      Student
                    </>
                  )}
                </div>
              </div>
            </Link>

            {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user.bio}</p>}
            
            {/* Role-specific info */}
            {user.role === 'ALUMNI' && user.currentPosition && (
              <p className="mt-2 text-sm font-medium text-primary">
                {user.currentPosition}{user.currentOrganization && ` @ ${user.currentOrganization}`}
              </p>
            )}
            {user.role === 'STUDENT' && user.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {user.interests.slice(0, 3).map((interest, index) => (
                  <span key={index} className="bg-secondary px-2 py-1 rounded-md text-xs">
                    {interest}
                  </span>
                ))}
              </div>
            )}
            
            {/* Social links */}
            <div className="flex gap-3 mt-3">
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl.startsWith("http") ? user.linkedinUrl : `https://${user.linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLinkIcon className="size-4" />
                </a>
              )}
              {user.githubUrl && (
                <a
                  href={user.githubUrl.startsWith("http") ? user.githubUrl : `https://${user.githubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <CodeIcon className="size-4" />
                </a>
              )}
            </div>

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{user._count.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{user._count.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              {user.institution && (
                <div className="flex items-center text-muted-foreground">
                  <GraduationCapIcon className="w-4 h-4 mr-2" />
                  {user.institution}
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {user.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {user.website ? (
                  <a href={`${user.website}`} className="hover:underline truncate" target="_blank">
                    {user.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sidebar;

const UnAuthenticatedSidebar = () => (
  <div className="sticky top-20">
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-xl font-semibold">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-4">
          Login to access your profile and connect with others.
        </p>
        <Link href="/sign-in">
          <Button className="w-full" variant="outline">
            Login
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="w-full mt-2" variant="default">
            Sign Up
          </Button>
        </Link>
      </CardContent>
    </Card>
  </div>
);