"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Award, Eye } from "lucide-react";
import { submitAssignment, getAssignmentSubmissions } from "@/actions/jobAssignment.action";
import SubmissionsView from "@/components/SubmissionsView";
import toast from "react-hot-toast";

interface JobsPageClientProps {
  assignments: any[];
}

export default function JobsPageClient({ assignments }: JobsPageClientProps) {
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [showSubmissionsView, setShowSubmissionsView] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    const formData = new FormData(e.currentTarget);
    const submissionText = formData.get("submissionText") as string;

    const result = await submitAssignment(selectedAssignment.id, submissionText);
    if (result.success) {
      toast.success("Assignment submitted successfully!");
      setShowSubmissionModal(false);
      setSelectedAssignment(null);
    } else {
      toast.error(result.error || "Failed to submit assignment");
    }
  };

  const viewSubmissions = async (assignmentId: string, assignmentTitle: string) => {
    setLoadingSubmissions(true);
    const result = await getAssignmentSubmissions(assignmentId);
    if (result.success) {
      setSubmissions(result.submissions);
      setSelectedAssignment({ id: assignmentId, title: assignmentTitle });
      setShowSubmissionsView(true);
    } else {
      toast.error(result.error || 'Failed to load submissions');
    }
    setLoadingSubmissions(false);
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Assignments</h1>
        <p className="text-muted-foreground">Complete assignments from alumni to showcase your skills</p>
      </div>

      <div className="grid gap-6">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No assignments available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {assignment.createdBy.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Posted {new Date(assignment.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due {new Date(assignment.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={isDeadlinePassed(assignment.deadline) ? "destructive" : "default"}>
                      {assignment.assignmentType}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Award className="w-4 h-4" />
                      {assignment._count.submissions} submissions
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{assignment.description}</p>
                
                {assignment.skillsRequired && assignment.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Skills Required:</p>
                    <div className="flex flex-wrap gap-2">
                      {assignment.skillsRequired.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={assignment.createdBy.image || "/avatar.png"} />
                    </Avatar>
                    <span className="text-sm">@{assignment.createdBy.username}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {assignment.isOwner && (
                      <button 
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        onClick={() => viewSubmissions(assignment.id, assignment.title)}
                        disabled={loadingSubmissions}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Submissions
                      </button>
                    )}
                    {!assignment.isOwner && !isDeadlinePassed(assignment.deadline) && (
                      <Button 
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmissionModal(true);
                        }}
                      >
                        Submit Assignment
                      </Button>
                    )}
                    {!assignment.isOwner && isDeadlinePassed(assignment.deadline) && (
                      <Badge variant="destructive">Deadline Passed</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showSubmissionModal} onOpenChange={setShowSubmissionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {selectedAssignment?.title}
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              name="submissionText"
              placeholder="Describe your solution, approach, and any relevant links (GitHub, live demo, etc.)"
              className="min-h-[120px]"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Submit</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowSubmissionModal(false);
                  setSelectedAssignment(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubmissionsView} onOpenChange={setShowSubmissionsView}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assignment Submissions</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <SubmissionsView 
              submissions={submissions}
              assignmentTitle={selectedAssignment.title}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}