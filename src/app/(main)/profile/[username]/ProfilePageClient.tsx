"use client";

import { getProfileByUsername, getUserPosts, updateProfile } from "@/actions/profile.action";
import { toggleFollow } from "@/actions/user.action";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Base64ImageUpload from "@/components/Base64ImageUpload";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import Link from "next/link";
import {
  CalendarIcon,
  EditIcon,
  FileTextIcon,
  GraduationCapIcon,
  HeartIcon,
  LinkIcon,
  MapPinIcon,
  BriefcaseIcon,
  UserIcon,
  AwardIcon,
  CodeIcon,
  BookOpenIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type User = Awaited<ReturnType<typeof getProfileByUsername>>;
type Posts = Awaited<ReturnType<typeof getUserPosts>>;

interface ProfilePageClientProps {
  user: NonNullable<User>;
  posts: Posts;
  likedPosts: Posts;
  isFollowing: boolean;
}

function ProfilePageClient({
  isFollowing: initialIsFollowing,
  likedPosts,
  posts,
  user,
}: ProfilePageClientProps) {
  const { user: currentUser } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    website: user.website || "",
    institution: user.institution || "",
    degree: user.degree || "",
    department: user.department || "",
    yearOfStudy: user.yearOfStudy || "",
    graduationYear: user.graduationYear?.toString() || "",
    currentPosition: user.currentPosition || "",
    currentOrganization: user.currentOrganization || "",
    linkedinUrl: user.linkedinUrl || "",
    githubUrl: user.githubUrl || "",
    portfolioUrl: user.portfolioUrl || "",
    resumeUrl: user.resumeUrl || "",
    skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
    interests: Array.isArray(user.interests) ? user.interests.join(", ") : "",
    mentorshipStatus: user.mentorshipStatus || "NONE",
    image: user.image || "",
  });

  const handleEditSubmit = async () => {
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => {
      if (key === 'skills' || key === 'interests') {
        const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
        formData.append(key, JSON.stringify(arrayValue));
      } else {
        formData.append(key, value);
      }
    });

    const result = await updateProfile(formData);
    if (result.success) {
      setShowEditDialog(false);
      toast.success("Profile updated successfully");
      window.location.reload();
    }
  };

  const handleFollow = async () => {
    if (!currentUser) return;

    try {
      setIsUpdatingFollow(true);
      await toggleFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const isOwnProfile = currentUser?.username === user.username;

  const formattedDate = format(new Date(user.createdAt), "MMMM yyyy");

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="bg-card border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                  {user.role && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'STUDENT' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {user.role === 'STUDENT' ? 'Student' : 'Alumni'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{user.name ?? user.username}</h1>
                  <p className="text-muted-foreground text-lg">@{user.username}</p>
                  {user.bio && (
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{user.bio}</p>
                  )}
                </div>
                
                {/* Role-specific info */}
                {user.role === 'ALUMNI' && user.currentPosition && (
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 rounded-lg">
                    <p className="font-semibold text-primary">
                      {user.currentPosition}
                      {user.currentOrganization && (
                        <span className="text-muted-foreground font-normal"> @ {user.currentOrganization}</span>
                      )}
                    </p>
                  </div>
                )}
                
                {user.role === 'STUDENT' && user.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {user.interests.slice(0, 4).map((interest, index) => (
                      <span key={index} className="bg-secondary/80 hover:bg-secondary px-3 py-1 rounded-full text-sm font-medium transition-colors">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Social links */}
                <div className="flex gap-4">
                  {user.linkedinUrl && (
                    <a
                      href={user.linkedinUrl.startsWith("http") ? user.linkedinUrl : `https://${user.linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                    >
                      <ExternalLinkIcon className="size-5" />
                    </a>
                  )}
                  {user.githubUrl && (
                    <a
                      href={user.githubUrl.startsWith("http") ? user.githubUrl : `https://${user.githubUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                    >
                      <CodeIcon className="size-5" />
                    </a>
                  )}
                  {user.portfolioUrl && (
                    <a
                      href={user.portfolioUrl.startsWith("http") ? user.portfolioUrl : `https://${user.portfolioUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                    >
                      <LinkIcon className="size-5" />
                    </a>
                  )}
                </div>

                {/* PROFILE STATS */}
                <div className="w-full bg-muted/30 rounded-xl p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{user._count.following.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Following</div>
                    </div>
                    <div className="text-center border-x border-border/50">
                      <div className="text-2xl font-bold text-primary">{user._count.followers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{user._count.posts.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground font-medium">Posts</div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="w-full">
                  {!currentUser ? (
                    <Link href="/sign-in">
                      <Button size="lg" className="w-full">Follow</Button>
                    </Link>
                  ) : isOwnProfile ? (
                    <Button size="lg" className="w-full" onClick={() => setShowEditDialog(true)}>
                      <EditIcon className="size-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleFollow}
                        disabled={isUpdatingFollow}
                        variant={isFollowing ? "outline" : "default"}
                      >
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                      {isFollowing && (
                        <Button size="lg" className="flex-1" variant="outline" asChild>
                          <Link href={`/messages?user=${user.username}`}>
                            Message
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* DETAILED PROFILE INFO */}
                <div className="w-full space-y-3 text-sm bg-card border rounded-xl p-6">
                  {user.role && (
                    <div className="flex items-center text-muted-foreground">
                      <UserIcon className="size-4 mr-2" />
                      {user.role === 'STUDENT' ? 'Student' : 'Alumni'}
                    </div>
                  )}
                  {user.institution && (
                    <div className="flex items-center text-muted-foreground">
                      <GraduationCapIcon className="size-4 mr-2" />
                      {user.institution}
                      {user.degree && ` - ${user.degree}`}
                      {user.department && ` (${user.department})`}
                    </div>
                  )}
                  {user.yearOfStudy && user.role === 'STUDENT' && (
                    <div className="flex items-center text-muted-foreground">
                      <BookOpenIcon className="size-4 mr-2" />
                      {user.yearOfStudy}
                    </div>
                  )}
                  {user.graduationYear && user.role === 'ALUMNI' && (
                    <div className="flex items-center text-muted-foreground">
                      <AwardIcon className="size-4 mr-2" />
                      Graduated {user.graduationYear}
                    </div>
                  )}
                  {user.currentPosition && user.role === 'ALUMNI' && (
                    <div className="flex items-center text-muted-foreground">
                      <BriefcaseIcon className="size-4 mr-2" />
                      {user.currentPosition}
                      {user.currentOrganization && ` at ${user.currentOrganization}`}
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPinIcon className="size-4 mr-2" />
                      {user.location}
                    </div>
                  )}
                  {user.skills && Array.isArray(user.skills) && user.skills.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <CodeIcon className="size-4 mr-2" />
                        <span className="font-medium">Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center text-muted-foreground">
                      <LinkIcon className="size-4 mr-2" />
                      <a
                        href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  {user.linkedinUrl && (
                    <div className="flex items-center text-muted-foreground">
                      <ExternalLinkIcon className="size-4 mr-2" />
                      <a
                        href={user.linkedinUrl.startsWith("http") ? user.linkedinUrl : `https://${user.linkedinUrl}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {user.githubUrl && (
                    <div className="flex items-center text-muted-foreground">
                      <ExternalLinkIcon className="size-4 mr-2" />
                      <a
                        href={user.githubUrl.startsWith("http") ? user.githubUrl : `https://${user.githubUrl}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    </div>
                  )}
                  {user.portfolioUrl && (
                    <div className="flex items-center text-muted-foreground">
                      <ExternalLinkIcon className="size-4 mr-2" />
                      <a
                        href={user.portfolioUrl.startsWith("http") ? user.portfolioUrl : `https://${user.portfolioUrl}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Portfolio
                      </a>
                    </div>
                  )}
                  {user.resumeUrl && (
                    <div className="flex items-center text-muted-foreground">
                      <FileTextIcon className="size-4 mr-2" />
                      <a
                        href={user.resumeUrl.startsWith("http") ? user.resumeUrl : `https://${user.resumeUrl}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Resume
                      </a>
                    </div>
                  )}
                  {user.mentorshipStatus && user.mentorshipStatus !== 'NONE' && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-lg border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center text-amber-800 dark:text-amber-200">
                        <UserIcon className="size-4 mr-2" />
                        <span className="font-medium">Mentorship</span>
                      </div>
                      <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-medium">
                        {user.mentorshipStatus === 'SEEKING_MENTOR' && 'Seeking Mentor'}
                        {user.mentorshipStatus === 'OPEN_TO_MENTOR' && 'Open to Mentor'}
                        {user.mentorshipStatus === 'MENTORING' && 'Currently Mentoring'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="size-4 mr-2" />
                    Joined {formattedDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold"
            >
              <FileTextIcon className="size-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
               data-[state=active]:bg-transparent px-6 font-semibold"
            >
              <HeartIcon className="size-4" />
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No posts yet</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <div className="space-y-6">
              {likedPosts.length > 0 ? (
                likedPosts.map((post) => <PostCard key={post.id} post={post} dbUserId={user.id} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">No liked posts to show</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <Base64ImageUpload
                  value={editForm.image}
                  onChange={(base64) => setEditForm({ ...editForm, image: base64 })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="City, Country"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="min-h-[80px]"
                  placeholder="Tell us about yourself"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={editForm.institution}
                    onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                    placeholder="Your college/university"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={editForm.degree}
                    onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                    placeholder="B.Tech, M.Tech, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    placeholder="Computer Science, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{user.role === 'STUDENT' ? 'Year of Study' : 'Graduation Year'}</Label>
                  <Input
                    value={user.role === 'STUDENT' ? editForm.yearOfStudy : editForm.graduationYear}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      [user.role === 'STUDENT' ? 'yearOfStudy' : 'graduationYear']: e.target.value 
                    })}
                    placeholder={user.role === 'STUDENT' ? '2nd year B.Tech' : '2023'}
                  />
                </div>
              </div>

              {user.role === 'ALUMNI' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Position</Label>
                    <Input
                      value={editForm.currentPosition}
                      onChange={(e) => setEditForm({ ...editForm, currentPosition: e.target.value })}
                      placeholder="Software Engineer, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Organization</Label>
                    <Input
                      value={editForm.currentOrganization}
                      onChange={(e) => setEditForm({ ...editForm, currentOrganization: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Skills</Label>
                <Input
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  placeholder="JavaScript, React, Node.js (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <Input
                  value={editForm.interests}
                  onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                  placeholder="Web Development, AI, etc. (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    placeholder="yourwebsite.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio URL</Label>
                  <Input
                    value={editForm.portfolioUrl}
                    onChange={(e) => setEditForm({ ...editForm, portfolioUrl: e.target.value })}
                    placeholder="portfolio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={editForm.linkedinUrl}
                    onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={editForm.githubUrl}
                    onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                    placeholder="github.com/username"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resume URL</Label>
                  <Input
                    value={editForm.resumeUrl}
                    onChange={(e) => setEditForm({ ...editForm, resumeUrl: e.target.value })}
                    placeholder="Link to your resume"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mentorship Status</Label>
                  <Select
                    value={editForm.mentorshipStatus}
                    onValueChange={(value) => setEditForm({ ...editForm, mentorshipStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">None</SelectItem>
                      <SelectItem value="SEEKING_MENTOR">Seeking Mentor</SelectItem>
                      <SelectItem value="OPEN_TO_MENTOR">Open to Mentor</SelectItem>
                      <SelectItem value="MENTORING">Currently Mentoring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleEditSubmit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
export default ProfilePageClient;