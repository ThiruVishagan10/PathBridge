"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { User, Calendar, MessageCircle } from "lucide-react";
import { sendMessage } from "@/actions/message.action";
import toast from "react-hot-toast";

interface Submission {
  id: string;
  submissionText: string;
  status: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    username: string;
    image: string;
    email: string;
  };
  assignment: {
    title: string;
  };
}

interface SubmissionsViewProps {
  submissions: Submission[];
  assignmentTitle: string;
}

export default function SubmissionsView({ submissions, assignmentTitle }: SubmissionsViewProps) {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Submission["student"] | null>(null);

  const handleSendResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message") as string;

    const result = await sendMessage(selectedStudent.id, message);
    if (result.success) {
      toast.success("Message sent successfully!");
      setShowResponseModal(false);
      setSelectedStudent(null);
    } else {
      toast.error("Failed to send message");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "default";
      case "REVIEWED": return "secondary";
      case "REFERRED": return "default";
      case "REJECTED": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Submissions for "{assignmentTitle}"</h2>
        <p className="text-muted-foreground">{submissions.length} students submitted</p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No submissions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={submission.student.image || "/avatar.png"} />
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{submission.student.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          @{submission.student.username}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(submission.status)}>
                      {submission.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedStudent(submission.student);
                        setShowResponseModal(true);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Response
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{submission.submissionText}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Response Modal */}
      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Alumni Message</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Responding to {selectedStudent?.name}
            </p>
          </DialogHeader>
          <form onSubmit={handleSendResponse} className="space-y-4">
            <Textarea
              name="message"
              placeholder="Write your alumni message to the student..."
              className="min-h-[120px]"
              required
            />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Send Message</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedStudent(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}