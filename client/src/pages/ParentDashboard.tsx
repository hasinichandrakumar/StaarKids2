import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  Calendar,
  Activity
} from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  currentGrade: number;
  starPower: number;
  avatarType: string;
  avatarColor: string;
}

interface Progress {
  id: number;
  grade: number;
  subject: string;
  teksStandard: string;
  totalAttempts: number;
  correctAttempts: number;
  averageScore: number;
  lastPracticed: string;
}

interface PracticeAttempt {
  id: number;
  questionId: number;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: string;
}

interface ExamAttempt {
  id: number;
  examId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completed: boolean;
  startedAt: string;
}

interface StudentData {
  student: Student;
  progress: Progress[];
  recentPractice: PracticeAttempt[];
  recentExams: ExamAttempt[];
}

export default function ParentDashboard() {
  // Get connected students (this would need to be implemented in the API)
  const { data: connectedStudents } = useQuery<Student[]>({
    queryKey: ['/api/parent/students'],
    queryFn: () => apiRequest('/api/parent/students')
  });

  const [selectedStudent, setSelectedStudent] = useState<string>('');

  // Get specific student's progress
  const { data: studentData, isLoading: isLoadingProgress } = useQuery<StudentData>({
    queryKey: ['/api/student-progress', selectedStudent],
    queryFn: () => apiRequest(`/api/student-progress/${selectedStudent}`),
    enabled: !!selectedStudent
  });

  // Auto-select first student
  useEffect(() => {
    if (connectedStudents?.length && !selectedStudent) {
      setSelectedStudent(connectedStudents[0].id);
    }
  }, [connectedStudents, selectedStudent]);

  if (!connectedStudents?.length) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Parent Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Monitor your child's learning progress</p>
        </div>
        
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Connected</h3>
            <p className="text-gray-600 mb-6">
              Ask your child to generate a monitoring code in their settings and enter it to connect.
            </p>
            <a 
              href="/settings" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Settings
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStudent = connectedStudents.find(s => s.id === selectedStudent);

  const getSubjectStats = (subject: string) => {
    if (!studentData?.progress) return { total: 0, correct: 0, accuracy: 0 };
    
    const subjectProgress = studentData.progress.filter(p => p.subject === subject);
    const totalAttempts = subjectProgress.reduce((sum, p) => sum + p.totalAttempts, 0);
    const correctAttempts = subjectProgress.reduce((sum, p) => sum + p.correctAttempts, 0);
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    
    return { total: totalAttempts, correct: correctAttempts, accuracy };
  };

  const mathStats = getSubjectStats('math');
  const readingStats = getSubjectStats('reading');

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          Parent Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Monitor your child's learning progress and achievements</p>
      </div>

      {/* Student Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {connectedStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student.id)}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                selectedStudent === student.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback style={{ backgroundColor: student.avatarColor }}>
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium">{student.firstName} {student.lastName}</p>
                <p className="text-sm text-gray-500">Grade {student.currentGrade}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Student Overview */}
      {currentStudent && (
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Star Power</p>
                  <p className="text-2xl font-bold">{currentStudent.starPower}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Math Accuracy</p>
                  <p className="text-2xl font-bold">{mathStats.accuracy.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reading Accuracy</p>
                  <p className="text-2xl font-bold">{readingStats.accuracy.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Practice</p>
                  <p className="text-2xl font-bold">{mathStats.total + readingStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Progress */}
      {isLoadingProgress ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : studentData ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="math">Math Progress</TabsTrigger>
            <TabsTrigger value="reading">Reading Progress</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Math Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Accuracy</span>
                    <span className="font-medium">{mathStats.accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={mathStats.accuracy} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Questions Attempted</p>
                      <p className="font-medium">{mathStats.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Correct Answers</p>
                      <p className="font-medium">{mathStats.correct}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    Reading Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Accuracy</span>
                    <span className="font-medium">{readingStats.accuracy.toFixed(1)}%</span>
                  </div>
                  <Progress value={readingStats.accuracy} className="h-2" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Questions Attempted</p>
                      <p className="font-medium">{readingStats.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Correct Answers</p>
                      <p className="font-medium">{readingStats.correct}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="math" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Math Standards Progress</CardTitle>
                <CardDescription>Progress by TEKS standard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.progress
                    .filter(p => p.subject === 'math')
                    .map((progress) => (
                      <div key={`math-${progress.id}-${progress.teksStandard}`} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{progress.teksStandard}</p>
                            <p className="text-sm text-gray-600">
                              {progress.totalAttempts} attempts
                            </p>
                          </div>
                          <Badge variant="outline">
                            {progress.averageScore.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={parseFloat(progress.averageScore.toFixed(0))} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reading Standards Progress</CardTitle>
                <CardDescription>Progress by TEKS standard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.progress
                    .filter(p => p.subject === 'reading')
                    .map((progress) => (
                      <div key={`reading-${progress.id}-${progress.teksStandard}`} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{progress.teksStandard}</p>
                            <p className="text-sm text-gray-600">
                              {progress.totalAttempts} attempts
                            </p>
                          </div>
                          <Badge variant="outline">
                            {progress.averageScore.toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={parseFloat(progress.averageScore.toFixed(0))} className="h-2" />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recent Practice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentData.recentPractice.slice(0, 5).map((attempt) => (
                      <div key={attempt.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            attempt.isCorrect ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span>Question {attempt.questionId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{attempt.timeSpent}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Exams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentData.recentExams.slice(0, 5).map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium">Exam {exam.examId}</p>
                          <p className="text-gray-500">
                            {exam.correctAnswers}/{exam.totalQuestions} correct
                          </p>
                        </div>
                        <Badge variant={exam.score >= 70 ? "default" : "secondary"}>
                          {exam.score.toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data</h3>
            <p className="text-gray-600">
              This student hasn't started practicing yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}