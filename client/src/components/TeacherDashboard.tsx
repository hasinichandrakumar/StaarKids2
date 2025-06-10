import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, BarChart3, TrendingUp, Building2, Star, BookOpen, Calculator, Search, Filter, LogOut } from "lucide-react";

interface TeacherDashboardProps {
  user: any;
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: organization } = useQuery({
    queryKey: ['/api/organization', user?.organizationId],
    enabled: !!user?.organizationId
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ['/api/organization/students'],
    enabled: user?.role === 'teacher' && !!user?.organizationId
  });

  const filteredStudents = students?.filter((student: any) => {
    const matchesSearch = !searchTerm || 
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !selectedGrade || student.currentGrade === selectedGrade;
    return matchesSearch && matchesGrade;
  }) || [];

  if (!user?.organizationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Verification Pending</h2>
            <p className="text-gray-600 mb-6">
              Your teacher account is being verified. You'll have full access once approved by our team.
            </p>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 max-w-md mx-auto">
              <p className="text-sm text-purple-800">
                <strong>What's next:</strong> We'll review your organization details and contact you 
                within 1-2 business days with access credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your classroom data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              Teacher Dashboard
            </h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{organization?.name || 'Your Organization'}</span>
              <Badge variant="outline">{organization?.type || 'School'}</Badge>
            </div>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Class Overview</TabsTrigger>
            <TabsTrigger value="students">Student Management</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold">Total Students</h3>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-purple-600">
                      {students?.length || 0}
                    </div>
                    <p className="text-sm text-gray-600">Active students</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold">Class Average</h3>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-orange-600">
                      78%
                    </div>
                    <p className="text-sm text-gray-600">Overall accuracy</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">Improvement</h3>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-green-600">
                      +12%
                    </div>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold">Total StarPower</h3>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-yellow-600">
                      {students?.reduce((total: number, student: any) => total + (student.starPower || 0), 0) || 0}
                    </div>
                    <p className="text-sm text-gray-600">Class earned</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Class Distribution by Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[3, 4, 5].map(grade => {
                    const gradeStudents = students?.filter((s: any) => s.currentGrade === grade) || [];
                    return (
                      <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">
                          {gradeStudents.length}
                        </div>
                        <p className="text-sm text-gray-600">Grade {grade} Students</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            {/* Student Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search students by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedGrade?.toString() || ""} onValueChange={(value) => setSelectedGrade(value ? parseInt(value) : null)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Grades</SelectItem>
                      <SelectItem value="3">Grade 3</SelectItem>
                      <SelectItem value="4">Grade 4</SelectItem>
                      <SelectItem value="5">Grade 5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student: any) => (
                <Card key={student.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                        {student.email?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.email || 'Student'}</h3>
                        <p className="text-sm text-gray-600">Grade {student.currentGrade}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">StarPower</span>
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          {student.starPower || 0}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-red-600">Math</span>
                          <span>--% </span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-yellow-600">Reading</span>
                          <span>--%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Students Found</h3>
                  <p className="text-gray-500">
                    {students?.length === 0 
                      ? "No students have been enrolled in your organization yet."
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-red-700">Math Performance</h3>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">
                          Detailed math analytics across all TEKS standards for your students will be displayed here.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-yellow-700">Reading Performance</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          Detailed reading analytics across all TEKS standards for your students will be displayed here.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Organization Name</label>
                    <p className="mt-1 text-gray-900">{organization?.name || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="mt-1 text-gray-900 capitalize">{organization?.type || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Email</label>
                    <p className="mt-1 text-gray-900">{organization?.email || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{organization?.phone || 'Not specified'}</p>
                  </div>
                </div>
                
                {organization?.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-gray-900">{organization.address}</p>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Badge variant={organization?.isVerified ? "default" : "secondary"}>
                    {organization?.isVerified ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}