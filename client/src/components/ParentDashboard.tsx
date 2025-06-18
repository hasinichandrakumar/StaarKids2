import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, BarChart3, TrendingUp, Clock, Star, BookOpen, Calculator } from "lucide-react";

interface ParentDashboardProps {
  user: any;
}

function getAvatarEmoji(avatarType: string): string {
  switch (avatarType) {
    case "moon": return "🌙";
    case "full-moon": return "🌕";
    case "rocket": return "🚀";
    case "astronaut": return "👨‍🚀";
    case "satellite": return "🛰️";
    case "ufo": return "🛸";
    case "milky-way": return "🌌";
    case "planet": return "🪐";
    case "shooting-star": return "🌠";
    case "comet": return "☄️";
    case "sun": return "☀️";
    case "earth": return "🌍";
    default: return "🌟";
  }
}

export default function ParentDashboard({ user }: ParentDashboardProps) {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Check if in demo mode
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';

  // Demo data for parent dashboard
  const demoStudents = [
    {
      id: "student-1",
      firstName: "Emma",
      lastName: "Johnson",
      grade: 4,
      avatarType: "rocket",
      avatarColor: "#4F46E5",
      starPower: 1250,
      overallAccuracy: 78,
      mathAccuracy: 75,
      readingAccuracy: 82,
      recentActivity: "Completed reading practice 2 hours ago",
      weeklyProgress: [65, 70, 72, 75, 78],
      totalQuestions: 156,
      correctAnswers: 122
    },
    {
      id: "student-2", 
      firstName: "Liam",
      lastName: "Chen",
      grade: 3,
      avatarType: "moon",
      avatarColor: "#7C3AED",
      starPower: 890,
      overallAccuracy: 65,
      mathAccuracy: 62,
      readingAccuracy: 68,
      recentActivity: "Practiced math problems yesterday",
      weeklyProgress: [58, 60, 63, 64, 65],
      totalQuestions: 89,
      correctAnswers: 58
    }
  ];

  const { data: students, isLoading } = useQuery({
    queryKey: ['/api/parent/students'],
    enabled: user?.role === 'parent' && !isDemo,
    staleTime: Infinity
  });

  const { data: selectedStudentStats } = useQuery({
    queryKey: ['/api/stats/overall', selectedStudent?.id],
    enabled: !!selectedStudent?.id && !isDemo
  });

  // Use demo data if in demo mode, otherwise use API data
  const studentsData = isDemo ? demoStudents : (students || []);
  const statsData = isDemo ? selectedStudent : selectedStudentStats;

  if (isLoading && !isDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your children's progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!studentsData || studentsData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Students Linked</h2>
            <p className="text-gray-600 mb-6">
              You haven't linked any student accounts yet. Ask your child for their account ID to get started.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>How to link:</strong> Your child can find their account ID in their profile settings. 
                Enter this ID when setting up your parent account.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            Parent Dashboard
          </h1>
          <p className="text-gray-600">Monitor your children's STAAR test preparation progress</p>
        </div>

        {/* Student Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Select a Student</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentsData.map((student: any) => (
              <Card
                key={student.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedStudent?.id === student.id
                    ? "ring-2 ring-orange-400 bg-orange-50"
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: student.avatarColor || "#4F46E5" }}
                    >
                      {getAvatarEmoji(student.avatarType)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{student.firstName} {student.lastName}</h3>
                      <p className="text-sm text-gray-600">Grade {student.grade}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{student.starPower || 0} StarPower</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Progress Dashboard */}
        {selectedStudent && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="math">Math Progress</TabsTrigger>
              <TabsTrigger value="reading">Reading Progress</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold">Overall Progress</h3>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedStudent?.overallAccuracy || 0}%
                      </div>
                      <p className="text-sm text-gray-600">Average accuracy</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold">Math</h3>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedStudent?.mathAccuracy || 0}%
                      </div>
                      <p className="text-sm text-gray-600">Math accuracy</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold">Reading</h3>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedStudent?.readingAccuracy || 0}%
                      </div>
                      <p className="text-sm text-gray-600">Reading accuracy</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-semibold">StarPower</h3>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedStudent.starPower || 0}
                      </div>
                      <p className="text-sm text-gray-600">Total earned</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress by Grade Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Grade {selectedStudent.grade} Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-red-700">Math Progress</span>
                        <span className="text-sm text-gray-600">
                          {selectedStudent?.mathAccuracy || 0}% accuracy
                        </span>
                      </div>
                      <Progress value={selectedStudent?.mathAccuracy || 0} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-yellow-700">Reading Progress</span>
                        <span className="text-sm text-gray-600">
                          {selectedStudent?.readingAccuracy || 0}% accuracy
                        </span>
                      </div>
                      <Progress value={selectedStudent?.readingAccuracy || 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="math" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Math Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Detailed math progress and TEKS standard breakdown for Grade {selectedStudent.currentGrade}
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-red-800">
                      Math-specific analytics and recommendations will be displayed here based on 
                      your child's practice sessions and test performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reading" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-yellow-700">Reading Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Detailed reading progress and TEKS standard breakdown for Grade {selectedStudent.currentGrade}
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Reading-specific analytics and recommendations will be displayed here based on 
                      your child's practice sessions and test performance.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Learning Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Practice Session - Math</p>
                        <p className="text-xs text-gray-600">85% accuracy on Grade {selectedStudent.currentGrade} geometry</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Mock Exam - Reading</p>
                        <p className="text-xs text-gray-600">Completed Grade {selectedStudent.currentGrade} reading comprehension</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}