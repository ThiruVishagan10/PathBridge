"use client";

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MessageCircleIcon, MailIcon, ExternalLinkIcon, CalendarIcon, MapPinIcon, BriefcaseIcon, UserCheckIcon, ClockIcon, VideoIcon, TrashIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { scheduleMeeting, removeMeeting } from '@/actions/student.action';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'upcoming' | 'past';
  status: 'requested' | 'confirmed' | 'completed' | 'cancelled';
  mentor?: {
    name: string;
    username: string;
  };
}

interface Mentor {
  id: string;
  name: string;
  username: string;
  image?: string;
  currentPosition?: string;
  currentOrganization?: string;
  location?: string;
  linkedinUrl?: string;
  email?: string;
  mentorshipStartDate?: Date;
  mentorshipStatus: string;
  followers?: { followerId: string }[];
}

interface MyMentorClientProps {
  mentor: Mentor | null;
  meetings: Meeting[];
  availableMentors: Mentor[];
}

export default function MyMentorClient({ mentor, meetings, availableMentors }: MyMentorClientProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showAvailableMentors, setShowAvailableMentors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingMeetings = meetings.filter(m => m.type === 'upcoming');
  const pastMeetings = meetings.filter(m => m.type === 'past');
  const mutualMentors = availableMentors.filter(m => m.followers && m.followers.length > 0);
  const filteredMentors = availableMentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.currentPosition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.currentOrganization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScheduleMeeting = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime || !meetingTitle) return;
    
    try {
      await scheduleMeeting(selectedMentor.id, selectedDate, selectedTime, meetingTitle);
      
      const meetingRequest = `Hi ${selectedMentor.name}, I would like to schedule a meeting titled "${meetingTitle}" on ${selectedDate} at ${selectedTime}. Please let me know if this works for you.`;
      
      window.location.href = `/messages?user=${selectedMentor.username}&message=${encodeURIComponent(meetingRequest)}`;
      
      setShowScheduleModal(false);
      setSelectedDate('');
      setSelectedTime('');
      setMeetingTitle('');
      setSelectedMentor(null);
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      alert('Failed to schedule meeting. Please try again.');
    }
  };

  const handleRemoveMeeting = async (meetingId: string) => {
    try {
      await removeMeeting(meetingId);
    } catch (error) {
      console.error('Failed to remove meeting:', error);
    }
  };

  const openScheduleModal = (mentorToSchedule: Mentor) => {
    setSelectedMentor(mentorToSchedule);
    setShowAvailableMentors(false);
    setShowScheduleModal(true);
  };

  const noMentorLayout = (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content - Alumni List */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Available Mentors</h1>
            <p className="text-muted-foreground">Alumni from your institution available for mentorship</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Search mentors by name, position, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Alumni List */}
          <div className="space-y-4">
            {filteredMentors.map((availableMentor) => (
              <Card key={availableMentor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/profile/${availableMentor.username}`}>
                      <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80">
                        <AvatarImage src={availableMentor.image || '/avatar.png'} />
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/profile/${availableMentor.username}`} className="hover:text-primary transition-colors">
                          <h3 className="font-semibold">{availableMentor.name}</h3>
                        </Link>
                        {availableMentor.followers && availableMentor.followers.length > 0 && (
                          <Badge variant="secondary" className="text-xs">Mutual</Badge>
                        )}
                      </div>
                      <Link href={`/profile/${availableMentor.username}`} className="hover:text-primary transition-colors">
                        <p className="text-sm text-muted-foreground mb-1">@{availableMentor.username}</p>
                      </Link>
                      {availableMentor.currentPosition && (
                        <p className="text-sm">
                          {availableMentor.currentPosition}
                          {availableMentor.currentOrganization && ` at ${availableMentor.currentOrganization}`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {availableMentor.followers && availableMentor.followers.length > 0 ? (
                        <Button size="sm" asChild>
                          <Link href={`/messages?user=${availableMentor.username}`}>Message</Link>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Follow
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setSelectedMentor(availableMentor)}
                      >
                        Schedule 
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Schedule Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Mentor Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMentor ? (
                <>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={selectedMentor.image || '/avatar.png'} />
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedMentor.name}</p>
                      <p className="text-xs text-muted-foreground">@{selectedMentor.username}</p>
                    </div>
                  </div>
                  
                  {selectedMentor.followers && selectedMentor.followers.length > 0 ? (
                    <>
                      <Input
                        placeholder="Meeting title"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                      />
                      
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        {['10:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'].map((time) => (
                          <Button 
                            key={time}
                            size="sm"
                            variant={selectedTime === time ? 'default' : 'outline'}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handleScheduleMeeting}
                        disabled={!selectedMentor || !selectedDate || !selectedTime || !meetingTitle}
                      >
                        Schedule Meeting
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Follow this mentor to schedule meetings
                      </p>
                      <Button className="w-full">
                        Follow {selectedMentor.name}
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setSelectedMentor(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Select a mentor to view options
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (!mentor) {
    return noMentorLayout;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={mentor.image || '/avatar.png'} />
                </Avatar>
                <h2 className="text-xl font-bold">{mentor.name}</h2>
                <p className="text-muted-foreground">@{mentor.username}</p>
              </div>

              {mentor.currentPosition && (
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{mentor.currentPosition}</p>
                    {mentor.currentOrganization && (
                      <p className="text-sm text-muted-foreground">{mentor.currentOrganization}</p>
                    )}
                  </div>
                </div>
              )}

              {mentor.location && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{mentor.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <UserCheckIcon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <Badge variant="secondary">{mentor.mentorshipStatus}</Badge>
                  {mentor.mentorshipStartDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Since {mentor.mentorshipStartDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/messages?user=${mentor.username}`}>
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Message
                  </Link>
                </Button>
                
                {mentor.email && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${mentor.email}`}>
                      <MailIcon className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}

                {mentor.linkedinUrl && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Meetings</CardTitle>
              <div className="flex gap-2">
                <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule New Meeting</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Meeting title"
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                      />
                      <input 
                        type="date" 
                        className="w-full p-2 border rounded" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {['10:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'].map((time) => (
                          <Button 
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleScheduleMeeting}
                        disabled={!selectedMentor || !selectedDate || !selectedTime || !meetingTitle}
                      >
                        Send Meeting Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => setShowAvailableMentors(true)}>
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Browse Mentors
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.date.toLocaleDateString()} at {meeting.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <VideoIcon className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline">Reschedule</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No upcoming meetings scheduled</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meeting Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4">
                <input 
                  type="date" 
                  className="w-full p-2 border rounded" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {pastMeetings.length > 0 ? (
                <div className="space-y-3">
                  {pastMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg opacity-75">
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{meeting.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.date.toLocaleDateString()} at {meeting.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={meeting.status === 'completed' ? 'default' : meeting.status === 'confirmed' ? 'secondary' : 'outline'}>
                          {meeting.status}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleRemoveMeeting(meeting.id)}>
                          <TrashIcon className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No past meetings</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showAvailableMentors} onOpenChange={setShowAvailableMentors}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>All Available Mentors</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Search mentors by name, position, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.map((availableMentor) => (
              <Card key={availableMentor.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={availableMentor.image || '/avatar.png'} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{availableMentor.name}</h3>
                    <p className="text-sm text-muted-foreground">@{availableMentor.username}</p>
                  </div>
                </div>
                {availableMentor.currentPosition && (
                  <p className="text-sm mb-2">
                    {availableMentor.currentPosition}
                    {availableMentor.currentOrganization && ` at ${availableMentor.currentOrganization}`}
                  </p>
                )}
                {availableMentor.followers && availableMentor.followers.length > 0 && (
                  <Badge variant="secondary" className="mb-3">Mutual Connection</Badge>
                )}
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/messages?user=${availableMentor.username}`}>Message</Link>
                  </Button>
                  {availableMentor.followers && availableMentor.followers.length > 0 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => openScheduleModal(availableMentor)}
                    >
                      Schedule
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}