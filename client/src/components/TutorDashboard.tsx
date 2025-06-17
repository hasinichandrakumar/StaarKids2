import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Users,
  BookOpen,
  Calculator,
  Award,
  Clock
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  grade: number;
  avatar: string;
  overallProgress: number;
  mathAccuracy: number;
  readingAccuracy: number;
  weakSkills: string[];
  recentActivity: string;
  needsAttention: boolean;
  parentContact: string;
}

interface TutorDashboardProps {
  tutorName: string;
}

export function TutorDashboard({ tutorName }: TutorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - in real implementation, this would come from API
  const students: Student[] = [
    {
      id: "1",
      name: "Marcus Johnson",
      grade: 4,
      avatar: "🦊",
      overallProgress: 72,
      mathAccuracy: 65,
      readingAccuracy: 78,
      weakSkills: ["2-digit multiplication", "Fractions"],
      recentActivity: "Practiced fractions 2 hours ago",
      needsAttention: true,
      parentContact: "parent1@example.com"
    },
    {
      id: "2", 
      name: "Sophia Rodriguez",
      grade: 3,
      avatar: "🐱",
      overallProgress: 85,
      mathAccuracy: 88,
      readingAccuracy: 82,
      weakSkills: ["Reading comprehension"],
      recentActivity: "Completed mock exam yesterday",
      needsAttention: false,
      parentContact: "parent2@example.com"
    },
    {
      id: "3",
      name: "Mia Chen",
      grade: 5,
      avatar: "🐺",
      overallProgress: 58,
      mathAccuracy: 52,
      readingAccuracy: 64,
      weakSkills: ["Geometry", "Literary analysis", "Vocabulary"],
      recentActivity: "Last active 3 days ago",
      needsAttention: true,
      parentContact: "parent3@example.com"
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || 
      (selectedFilter === "needs-attention" && student.needsAttention) ||
      (selectedFilter === "high-performers" && student.overallProgress >= 80) ||
      (selectedFilter === "grade-3" && student.grade === 3) ||
      (selectedFilter === "grade-4" && student.grade === 4) ||
      (selectedFilter === "grade-5" && student.grade === 5);
    
    return matchesSearch && matchesFilter;
  });

  const dashboardStats = {
    totalStudents: students.length,
    needingAttention: students.filter(s => s.needsAttention).length,
    averageProgress: Math.round(students.reduce((acc, s) => acc + s.overallProgress, 0) / students.length),
    activeToday: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {tutorName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor student progress and provide targeted support
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Need Attention</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardStats.needingAttention}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Progress</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.averageProgress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Today</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.activeToday}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All Students
                </Button>
                <Button
                  variant={selectedFilter === "needs-attention" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("needs-attention")}
                >
                  Need Attention
                </Button>
                <Button
                  variant={selectedFilter === "high-performers" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("high-performers")}
                >
                  High Performers
                </Button>
                <Button
                  variant={selectedFilter === "grade-3" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("grade-3")}
                >
                  Grade 3
                </Button>
                <Button
                  variant={selectedFilter === "grade-4" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("grade-4")}
                >
                  Grade 4
                </Button>
                <Button
                  variant={selectedFilter === "grade-5" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("grade-5")}
                >
                  Grade 5
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredStudents.map((student) => (
            <Card key={student.id} className={`${student.needsAttention ? 'border-l-4 border-l-red-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="text-2xl">{student.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Grade {student.grade}</p>
                    </div>
                  </div>
                  {student.needsAttention && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Attention
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{student.overallProgress}%</span>
                    </div>
                    <Progress value={student.overallProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Math: {student.mathAccuracy}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Reading: {student.readingAccuracy}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skill Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.weakSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.recentActivity}</p>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message Parent
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      View Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Coaching Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              AI Coaching Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Get personalized coaching strategies
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Ask for help with specific students or teaching challenges. Get motivational strategies, 
                micro-lesson plans, and confidence boosters tailored to each student's profile.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Open AI Coach
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}