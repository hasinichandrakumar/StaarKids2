import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Plus, School, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [classroomCode, setClassroomCode] = useState('');
  const [parentCode, setParentCode] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate monitoring code for parents
  const generateCodeMutation = useMutation({
    mutationFn: () => apiRequest('/api/generate-monitoring-code', { method: 'POST' }),
    onSuccess: (data) => {
      toast({
        title: "Monitoring Code Generated",
        description: `Your code is ${data.code}. Give this to your parent to monitor your progress.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate monitoring code",
        variant: "destructive",
      });
    }
  });

  // Join classroom
  const joinClassroomMutation = useMutation({
    mutationFn: (code: string) => apiRequest('/api/join-classroom-code', { 
      method: 'POST',
      body: JSON.stringify({ code })
    }),
    onSuccess: (data) => {
      toast({
        title: "Joined Classroom",
        description: `Successfully joined ${data.classroom.name}`,
      });
      setClassroomCode('');
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join classroom",
        variant: "destructive",
      });
    }
  });

  // Connect parent (for parent accounts)
  const connectParentMutation = useMutation({
    mutationFn: (code: string) => apiRequest('/api/connect-to-student', { 
      method: 'POST',
      body: JSON.stringify({ code })
    }),
    onSuccess: (data) => {
      toast({
        title: "Connected to Student",
        description: `Successfully connected to ${data.student.firstName}`,
      });
      setParentCode('');
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to connect to student",
        variant: "destructive",
      });
    }
  });

  // Get user data to check role
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    queryFn: () => apiRequest('/api/user')
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  const handleGenerateCode = () => {
    generateCodeMutation.mutate();
  };

  const handleJoinClassroom = () => {
    if (!classroomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a classroom code",
        variant: "destructive",
      });
      return;
    }
    joinClassroomMutation.mutate(classroomCode.trim());
  };

  const handleConnectParent = () => {
    if (!parentCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a monitoring code",
        variant: "destructive",
      });
      return;
    }
    connectParentMutation.mutate(parentCode.trim());
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and connections</p>
      </div>

      <Tabs defaultValue="codes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="codes" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Parent Monitoring
          </TabsTrigger>
          <TabsTrigger value="classroom" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            Classroom
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Parent Monitoring Tab */}
        <TabsContent value="codes" className="space-y-6">
          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Parent Monitoring Code
                </CardTitle>
                <CardDescription>
                  Generate a unique code that your parent can use to monitor your progress and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleGenerateCode}
                    disabled={generateCodeMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {generateCodeMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Generate New Code
                  </Button>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>How it works:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Click "Generate New Code" to create a 6-character code</li>
                    <li>• Share this code with your parent or guardian</li>
                    <li>• They can enter it in their parent account to monitor your progress</li>
                    <li>• You can generate a new code anytime to update access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'parent' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Connect to Student
                </CardTitle>
                <CardDescription>
                  Enter your child's monitoring code to access their progress and activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-code">Student Monitoring Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="parent-code"
                      placeholder="Enter 6-character code"
                      value={parentCode}
                      onChange={(e) => setParentCode(e.target.value.toUpperCase())}
                      maxLength={6}
                      className="uppercase"
                    />
                    <Button 
                      onClick={handleConnectParent}
                      disabled={connectParentMutation.isPending}
                    >
                      {connectParentMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Instructions:</strong>
                  </p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Ask your child to generate a monitoring code in their settings</li>
                    <li>• Enter the 6-character code above</li>
                    <li>• You'll gain access to view their progress and test results</li>
                    <li>• Your child can generate a new code to update access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Classroom Tab */}
        <TabsContent value="classroom" className="space-y-6">
          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-purple-600" />
                  Join Classroom
                </CardTitle>
                <CardDescription>
                  Enter a classroom code from your teacher to join their class
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="classroom-code">Classroom Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="classroom-code"
                      placeholder="Enter 8-character code"
                      value={classroomCode}
                      onChange={(e) => setClassroomCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="uppercase"
                    />
                    <Button 
                      onClick={handleJoinClassroom}
                      disabled={joinClassroomMutation.isPending}
                    >
                      {joinClassroomMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        'Join Class'
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800 mb-2">
                    <strong>About Classroom Codes:</strong>
                  </p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Get the classroom code from your teacher</li>
                    <li>• Each classroom has a unique 8-character code</li>
                    <li>• Your teacher can see your progress and assign practice</li>
                    <li>• You can join multiple classrooms if needed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-indigo-600" />
                  Your Classroom Codes
                </CardTitle>
                <CardDescription>
                  View and manage your classroom codes for student enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Create classroom codes in the Teacher Dashboard to allow students to join your classes.
                </p>
                <Button variant="outline" onClick={() => window.location.href = '/teacher'}>
                  Go to Teacher Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Badge variant="secondary" className="mt-1">
                    {user.role}
                  </Badge>
                </div>
                {user.role === 'student' && (
                  <div>
                    <Label>Grade</Label>
                    <p className="text-sm text-gray-600 mt-1">Grade {user.currentGrade}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}