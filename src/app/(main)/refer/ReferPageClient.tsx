"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Briefcase, CheckCircle } from "lucide-react";
import { createJobAssignment, getMyJobAssignments, updateSubmissionStatus } from "@/actions/jobAssignment.action";
import toast from "react-hot-toast";

export default function ReferPageClient() {
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignmentType: "",
    skillsRequired: ""
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await getMyJobAssignments();
      setAssignments(data);
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    assignmentsPosted: assignments.length,
    submissionsReceived: assignments.reduce((acc, a) => acc + a._count.submissions, 0),
    studentsReferred: assignments.reduce((acc, a) => acc + a.submissions.filter((s: any) => s.status === 'REFERRED').length, 0)
  };

  const handleCreateAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", assignmentForm.title);
    formData.append("description", assignmentForm.description);
    formData.append("deadline", assignmentForm.deadline);
    formData.append("assignmentType", assignmentForm.assignmentType);
    formData.append("skillsRequired", assignmentForm.skillsRequired);
    
    const result = await createJobAssignment(formData);
    if (result.success) {
      toast.success("Assignment posted successfully!");
      setShowProjectModal(false);
      setAssignmentForm({
        title: "",
        description: "",
        deadline: "",
        assignmentType: "",
        skillsRequired: ""
      });
      loadAssignments();
    } else {
      toast.error(result.error || "Failed to post assignment");
    }
  };

  const handleReferStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    
    const formData = new FormData(e.currentTarget);
    const company = formData.get("company") as string;
    const notes = formData.get("notes") as string;
    
    const result = await updateSubmissionStatus(
      selectedSubmission.id,
      "REFERRED",
      notes,
      company
    );
    
    if (result.success) {
      toast.success("Student referred and notified successfully!");
      setShowReferralModal(false);
      setSelectedSubmission(null);
      loadAssignments();
    } else {
      toast.error("Failed to refer student");
    }
  };

  const allSubmissions = assignments.flatMap(a => 
    a.submissions.map((s: any) => ({
      ...s,
      assignmentTitle: a.title
    }))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Refer Students</h1>
          <p className="text-muted-foreground">Review assignment reports and refer qualified students</p>
        </div>
        <Button onClick={() => setShowProjectModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Post Assignment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Briefcase className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.assignmentsPosted}</p>
                <p className="text-sm text-muted-foreground">Assignments Posted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.submissionsReceived}</p>
                <p className="text-sm text-muted-foreground">Submissions Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.studentsReferred}</p>
                <p className="text-sm text-muted-foreground">Students Referred</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment History */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
          <p className="text-sm text-muted-foreground">Track your posted assignments and student progress</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assignments">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assignments">Posted Assignments</TabsTrigger>
              <TabsTrigger value="workflow">Student Workflow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignments" className="mt-6">
              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const reviewedCount = assignment.submissions.filter((s: any) => s.status !== 'SUBMITTED').length;
                  const referredCount = assignment.submissions.filter((s: any) => s.status === 'REFERRED').length;
                  
                  return (
                    <div key={assignment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">Posted on {new Date(assignment.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(new Date(assignment.deadline) > new Date() ? 'active' : 'completed')}>
                          {new Date(assignment.deadline) > new Date() ? 'active' : 'completed'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{assignment._count.submissions}</p>
                          <p className="text-muted-foreground">Submissions</p>
                        </div>
                        <div>
                          <p className="font-medium">{reviewedCount}</p>
                          <p className="text-muted-foreground">Reviewed</p>
                        </div>
                        <div>
                          <p className="font-medium">{referredCount}</p>
                          <p className="text-muted-foreground">Referred</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="workflow" className="mt-6">
              <div className="space-y-4">
                {allSubmissions.map((submission) => (
                  <div key={submission.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{submission.student.name}</h4>
                        <p className="text-sm text-muted-foreground">{submission.assignmentTitle}</p>
                        <p className="text-xs text-muted-foreground">Submitted: {new Date(submission.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(submission.status.toLowerCase())}>
                          {submission.status}
                        </Badge>
                      </div>
                    </div>
                    {submission.referralCompany && (
                      <p className="text-sm text-green-600">Referred to: {submission.referralCompany}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedSubmission(submission);
                          setShowSubmissionModal(true);
                        }}
                      >
                        View Submission
                      </Button>
                      {submission.status === 'SUBMITTED' && (
                        <Button size="sm" onClick={() => {
                          setSelectedSubmission(submission);
                          setShowReferralModal(true);
                        }}>Refer Student</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Referral Modal */}
      <Dialog open={showReferralModal} onOpenChange={setShowReferralModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Refer Student</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedSubmission && `Referring ${selectedSubmission.student.name}`}
            </p>
          </DialogHeader>
          <form onSubmit={handleReferStudent} className="space-y-4">
            <Input name="company" placeholder="Company/Organization" required />
            <Textarea name="notes" placeholder="Referral notes (based on assignment performance)" className="min-h-[100px]" required />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Send Referral</Button>
              <Button type="button" variant="outline" onClick={() => {
                setShowReferralModal(false);
                setSelectedSubmission(null);
              }}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Submission View Modal */}
      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            {selectedSubmission && (
              <p className="text-sm text-muted-foreground">
                {selectedSubmission.student.name} - {selectedSubmission.assignmentTitle}
              </p>
            )}
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Submission:</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedSubmission.submissionText}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  onClick={() => {
                    setShowSubmissionModal(false);
                    setShowReplyModal(true);
                  }}
                >
                  Reply
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSubmissionModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Submission</DialogTitle>
            {selectedSubmission && (
              <p className="text-sm text-muted-foreground">
                Replying to {selectedSubmission.student.name}
              </p>
            )}
          </DialogHeader>
          {selectedSubmission && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const message = formData.get("message") as string;
              const contextMessage = `Regarding your submission for "${selectedSubmission.assignmentTitle}":\n\n${selectedSubmission.submissionText}\n\n---\n\n${message}`;
              
              const { sendMessage } = await import("@/actions/message.action");
              const result = await sendMessage(selectedSubmission.student.id, contextMessage);
              
              if (result.success) {
                toast.success("Reply sent successfully!");
                setShowReplyModal(false);
                setSelectedSubmission(null);
              } else {
                toast.error("Failed to send reply");
              }
            }} className="space-y-4">
              <div className="bg-muted/50 p-3 rounded text-sm">
                <strong>Context:</strong> {selectedSubmission.assignmentTitle}
              </div>
              <Textarea
                name="message"
                placeholder="Write your reply message..."
                className="min-h-[120px]"
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Send Reply</Button>
                <Button type="button" variant="outline" onClick={() => setShowReplyModal(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Post Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Post Assignment</DialogTitle>
            <p className="text-sm text-muted-foreground">Create assignment post in Jobs page for students</p>
          </DialogHeader>
          <form onSubmit={handleCreateAssignment} className="space-y-4">
            <Input 
              placeholder="Assignment title" 
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
              required 
            />
            <Textarea 
              placeholder="Assignment description, requirements, and evaluation criteria" 
              className="min-h-[120px]" 
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
              required 
            />
            <Input 
              type="date" 
              value={assignmentForm.deadline}
              onChange={(e) => setAssignmentForm({...assignmentForm, deadline: e.target.value})}
              required 
            />
            <Select 
              value={assignmentForm.assignmentType} 
              onValueChange={(value) => setAssignmentForm({...assignmentForm, assignmentType: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Assignment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project">Project Assignment</SelectItem>
                <SelectItem value="coding">Coding Challenge</SelectItem>
                <SelectItem value="research">Research Task</SelectItem>
                <SelectItem value="design">Design Assignment</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Skills required (comma separated)" 
              value={assignmentForm.skillsRequired}
              onChange={(e) => setAssignmentForm({...assignmentForm, skillsRequired: e.target.value})}
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Post to Jobs Page</Button>
              <Button type="button" variant="outline" onClick={() => setShowProjectModal(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}