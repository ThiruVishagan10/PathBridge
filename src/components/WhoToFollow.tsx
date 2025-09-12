import { getRandomUsers } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";
import { ExternalLinkIcon, CodeIcon } from "lucide-react";
// import FollowButton from "./FollowButton";

async function WhoToFollow() {
  const users = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex gap-2 items-center justify-between ">
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  {user.role === 'ALUMNI' && user.currentPosition && (
                    <p className="text-xs text-primary font-medium">
                      {user.currentPosition}{user.currentOrganization && ` @ ${user.currentOrganization}`}
                    </p>
                  )}
                  {user.role === 'STUDENT' && user.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interests.slice(0, 2).map((interest, index) => (
                        <span key={index} className="bg-secondary px-1 py-0.5 rounded text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">{user._count.followers} followers</span>
                    <div className="flex gap-1">
                      {user.linkedinUrl && (
                        <a
                          href={user.linkedinUrl.startsWith("http") ? user.linkedinUrl : `https://${user.linkedinUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLinkIcon className="size-3" />
                        </a>
                      )}
                      {user.githubUrl && (
                        <a
                          href={user.githubUrl.startsWith("http") ? user.githubUrl : `https://${user.githubUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <CodeIcon className="size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default WhoToFollow;