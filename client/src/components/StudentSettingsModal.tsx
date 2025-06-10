import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, GraduationCap, School, Users, Code, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User as UserType } from "@shared/schema";

interface StudentSettingsModalProps {
  user: UserType | any;
  selectedGrade: number;
  onGradeChange: (grade: number) => void;
  onClose: () => void;
}

export default function StudentSettingsModal({ user, selectedGrade, onGradeChange, onClose }: StudentSettingsModalProps) {
  const [tempGrade, setTempGrade] = useState(selectedGrade);
  const [classroomCode, setClassroomCode] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch student's classrooms
  const { data: studentClassrooms } = useQuery({
    queryKey: ['/api/classroom/student'],
    enabled: user?.role === 'student'
  });

  // Join classroom mutation
  const joinClassroomMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest("POST", "/api/classroom/join", { classroomCode: code });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully joined classroom!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/classroom/student'] });
      setClassroomCode("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join classroom",
        variant: "destructive"
      });
    }
  });

  // Link to parent mutation
  const linkToParentMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/parent/link-child", { childEmail: user?.email });
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Parent has been notified and can now view your progress!",
      });
      setParentEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send parent link",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    onGradeChange(tempGrade);
    onClose();
  };

  const handleJoinClassroom = () => {
    if (!classroomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a classroom code",
        variant: "destructive"
      });
      return;
    }
    joinClassroomMutation.mutate(classroomCode.trim());
  };

  const handleLinkParent = () => {
    if (!parentEmail.trim()) {
      toast({
        title: "Error", 
        description: "Please enter your parent's email",
        variant: "destructive"
      });
      return;
    }
    linkToParentMutation.mutate(parentEmail.trim());
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings & Account Management
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="classroom">Classroom</TabsTrigger>
            <TabsTrigger value="parent">Parent Link</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-gray-600">Name</Label>
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-600">Email</Label>
                  <p className="text-sm text-gray-700">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Grade Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="grade-select" className="text-xs font-medium text-gray-600">
                    Select your current grade
                  </Label>
                  <Select value={tempGrade.toString()} onValueChange={(value) => setTempGrade(parseInt(value))}>
                    <SelectTrigger id="grade-select" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3rd Grade</SelectItem>
                      <SelectItem value="4">4th Grade</SelectItem>
                      <SelectItem value="5">5th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose} className="px-6">
                Cancel
              </Button>
              <Button onClick={handleSave} className="px-6">
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="classroom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="w-5 h-5" />
                  Join Classroom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter the classroom code provided by your teacher to join their class.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="classroomCode">Classroom Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="classroomCode"
                      placeholder="Enter 8-character code"
                      value={classroomCode}
                      onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleJoinClassroom}
                      disabled={joinClassroomMutation.isPending}
                    >
                      {joinClassroomMutation.isPending ? "Joining..." : "Join"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {studentClassrooms && studentClassrooms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    My Classrooms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {studentClassrooms.map((classroom: any) => (
                      <div
                        key={classroom.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{classroom.className}</p>
                          <p className="text-sm text-gray-500">
                            Grade {classroom.grade} • {classroom.subject || 'All Subjects'}
                          </p>
                        </div>
                        <Badge variant="outline">{classroom.code}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="parent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Connect with Parent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Allow your parent to view your progress and support your learning by entering their email address.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Parent's Email</Label>
                  <div className="flex gap-2">
                    <Input
                      id="parentEmail"
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleLinkParent}
                      disabled={linkToParentMutation.isPending}
                    >
                      {linkToParentMutation.isPending ? "Linking..." : "Link Parent"}
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>How it works:</strong> Your parent will be able to see your practice scores, 
                    progress reports, and StarPower achievements. They can create their own parent account 
                    using the same email to access the full parent dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}