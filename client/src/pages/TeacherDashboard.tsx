import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Plus, Users, School, Calendar, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Classroom {
  id: number;
  code: string;
  className: string;
  grade: number;
  subject: string;
  maxStudents: number;
  isActive: boolean;
  enrolledStudents: number;
  createdAt: string;
}

export default function TeacherDashboard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClassroom, setNewClassroom] = useState({
    className: '',
    grade: '',
    subject: 'both',
    maxStudents: '30'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get teacher's classrooms
  const { data: classrooms, isLoading } = useQuery<{ classrooms: Classroom[] }>({
    queryKey: ['/api/my-classroom-codes'],
    queryFn: () => apiRequest('/api/my-classroom-codes')
  });

  // Create new classroom
  const createClassroomMutation = useMutation({
    mutationFn: (classroomData: typeof newClassroom) => 
      apiRequest('/api/create-classroom-code', { 
        method: 'POST',
        body: JSON.stringify(classroomData)
      }),
    onSuccess: (data) => {
      toast({
        title: "Classroom Created",
        description: `Created "${data.classroom.className}" with code ${data.classroom.code}`,
      });
      setIsCreateDialogOpen(false);
      setNewClassroom({ className: '', grade: '', subject: 'both', maxStudents: '30' });
      queryClient.invalidateQueries({ queryKey: ['/api/my-classroom-codes'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create classroom",
        variant: "destructive",
      });
    }
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard`,
    });
  };

  const handleCreateClassroom = () => {
    if (!newClassroom.className.trim() || !newClassroom.grade) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createClassroomMutation.mutate(newClassroom);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <School className="h-8 w-8 text-blue-600" />
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage your classrooms and student enrollments</p>
      </div>

      {/* Create Classroom Button */}
      <div className="mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
              <DialogDescription>
                Create a new classroom and generate a join code for your students
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="className">Classroom Name *</Label>
                <Input
                  id="className"
                  placeholder="e.g., Mrs. Smith's 4th Grade Math"
                  value={newClassroom.className}
                  onChange={(e) => setNewClassroom({ ...newClassroom, className: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select 
                  value={newClassroom.grade} 
                  onValueChange={(value) => setNewClassroom({ ...newClassroom, grade: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3rd Grade</SelectItem>
                    <SelectItem value="4">4th Grade</SelectItem>  
                    <SelectItem value="5">5th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={newClassroom.subject} 
                  onValueChange={(value) => setNewClassroom({ ...newClassroom, subject: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Math & Reading</SelectItem>
                    <SelectItem value="math">Math Only</SelectItem>
                    <SelectItem value="reading">Reading Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Max Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  max="50"
                  value={newClassroom.maxStudents}
                  onChange={(e) => setNewClassroom({ ...newClassroom, maxStudents: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleCreateClassroom}
                disabled={createClassroomMutation.isPending}
                className="w-full"
              >
                {createClassroomMutation.isPending ? 'Creating...' : 'Create Classroom'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classrooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classrooms?.classrooms?.map((classroom) => (
          <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{classroom.className}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <BookOpen className="h-4 w-4" />
                    Grade {classroom.grade} • {classroom.subject === 'both' ? 'Math & Reading' : classroom.subject}
                  </CardDescription>
                </div>
                <Badge variant={classroom.isActive ? "default" : "secondary"}>
                  {classroom.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Classroom Code */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Join Code</p>
                    <p className="text-xl font-mono font-bold text-blue-600 tracking-wider">
                      {classroom.code}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(classroom.code, 'Classroom code')}
                    className="border-blue-300 text-blue-600 hover:bg-blue-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Student Count */}
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  Students Enrolled
                </span>
                <span className="font-medium">
                  {classroom.enrolledStudents} / {classroom.maxStudents}
                </span>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="text-gray-600">
                  {new Date(classroom.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Enrollment</span>
                  <span>{Math.round((classroom.enrolledStudents / classroom.maxStudents) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(classroom.enrolledStudents / classroom.maxStudents) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!classrooms?.classrooms?.length && (
        <Card className="text-center py-12">
          <CardContent>
            <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Classrooms Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first classroom to start managing student enrollments
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Classroom
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">How to Use Classroom Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Teachers:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create classrooms with unique join codes</li>
                <li>• Share codes with your students</li>
                <li>• Monitor enrollment and student progress</li>
                <li>• Set maximum student limits per classroom</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Students:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Get classroom code from your teacher</li>
                <li>• Enter code in Settings → Classroom tab</li>
                <li>• Join multiple classrooms if needed</li>
                <li>• Teacher can track your practice progress</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}