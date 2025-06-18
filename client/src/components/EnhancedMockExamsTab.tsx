import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Target, Trophy, History, Download, Eye, FileText, CheckCircle, XCircle, Star, Clock, Calculator, BookOpen, Search, ChevronRight, Award, TrendingUp } from "lucide-react";

interface EnhancedMockExamsTabProps {
  grade: number;
}

// Comprehensive mock exam data covering 2013-2025
const AVAILABLE_EXAMS = [
  // 2025 AI-Generated Exams
  { id: "2025-math", year: 2025, subject: "math", type: "AI-Generated", totalQuestions: 45, timeLimit: 180, difficulty: "Adaptive", new: true },
  { id: "2025-reading", year: 2025, subject: "reading", type: "AI-Generated", totalQuestions: 45, timeLimit: 180, difficulty: "Adaptive", new: true },
  
  // 2024 Authentic + AI-Enhanced
  { id: "2024-math", year: 2024, subject: "math", type: "Authentic + AI", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2024-reading", year: 2024, subject: "reading", type: "Authentic + AI", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  
  // Historical Authentic Exams (2013-2023)
  { id: "2023-math", year: 2023, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2023-reading", year: 2023, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2022-math", year: 2022, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2022-reading", year: 2022, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2021-math", year: 2021, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2021-reading", year: 2021, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2019-math", year: 2019, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2019-reading", year: 2019, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2018-math", year: 2018, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2018-reading", year: 2018, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2017-math", year: 2017, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2017-reading", year: 2017, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2016-math", year: 2016, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2016-reading", year: 2016, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2015-math", year: 2015, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2015-reading", year: 2015, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2014-math", year: 2014, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2014-reading", year: 2014, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2013-math", year: 2013, subject: "math", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" },
  { id: "2013-reading", year: 2013, subject: "reading", type: "Authentic", totalQuestions: 45, timeLimit: 180, difficulty: "Grade Level" }
];

const TEST_HISTORY = [
  {
    id: 1,
    examId: "2024-math",
    year: 2024,
    subject: "math",
    score: 87,
    performanceLevel: "Masters Grade Level",
    totalQuestions: 45,
    correctAnswers: 39,
    timeSpent: 165,
    dateTaken: "2024-12-15T10:30:00Z",
    accurateQuestions: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19, 21, 22, 23, 25, 26, 27, 29, 30, 31, 33, 34, 35, 37, 38, 39, 41, 42, 43, 45, 46, 47, 49, 50, 51],
    inaccurateQuestions: [4, 8, 12, 16, 20, 24]
  },
  {
    id: 2,
    examId: "2024-reading",
    year: 2024,
    subject: "reading",
    score: 82,
    performanceLevel: "Approaches Grade Level",
    totalQuestions: 45,
    correctAnswers: 37,
    timeSpent: 175,
    dateTaken: "2024-12-12T14:20:00Z",
    accurateQuestions: [1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 20, 21, 22, 24, 25, 26, 28, 29, 30, 32, 33, 34, 36, 37, 38, 40, 41, 42, 44, 45, 46, 48, 49],
    inaccurateQuestions: [3, 7, 11, 15, 19, 23, 27, 31]
  },
  {
    id: 3,
    examId: "2023-math",
    year: 2023,
    subject: "math",
    score: 76,
    performanceLevel: "Approaches Grade Level",
    totalQuestions: 45,
    correctAnswers: 34,
    timeSpent: 180,
    dateTaken: "2024-12-08T09:15:00Z",
    accurateQuestions: [1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 17, 19, 20, 22, 23, 24, 26, 27, 29, 30, 31, 33, 34, 36, 37, 38, 40, 41, 43, 44, 45, 47],
    inaccurateQuestions: [4, 7, 11, 14, 18, 21, 25, 28, 32, 35, 39]
  }
];

const FORMULA_SHEET_CONTENT = {
  area: "Area of rectangle = length × width\nArea of square = side × side",
  perimeter: "Perimeter of rectangle = 2(length + width)\nPerimeter of square = 4 × side",
  volume: "Volume of rectangular prism = length × width × height",
  conversion: "1 foot = 12 inches\n1 yard = 3 feet\n1 mile = 5,280 feet"
};

const DICTIONARY_WORDS = [
  { word: "analyze", definition: "to study or examine something carefully", example: "Analyze the character's actions in the story." },
  { word: "compare", definition: "to look at similarities between two or more things", example: "Compare the main characters in both stories." },
  { word: "contrast", definition: "to show the differences between things", example: "Contrast the settings of the two poems." },
  { word: "evaluate", definition: "to judge or determine the value of something", example: "Evaluate the author's argument." },
  { word: "infer", definition: "to conclude based on evidence and reasoning", example: "What can you infer about the character's feelings?" },
  { word: "summarize", definition: "to give the main points briefly", example: "Summarize the main events of the story." }
];

export default function EnhancedMockExamsTab({ grade }: EnhancedMockExamsTabProps) {
  const [selectedTab, setSelectedTab] = useState("available");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [dictionarySearch, setDictionarySearch] = useState("");

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return "Masters Grade Level";
    if (score >= 70) return "Meets Grade Level";
    if (score >= 60) return "Approaches Grade Level";
    return "Does Not Meet Grade Level";
  };

  const filteredExams = AVAILABLE_EXAMS.filter(exam => {
    const yearMatch = selectedYear === "all" || exam.year.toString() === selectedYear;
    const subjectMatch = selectedSubject === "all" || exam.subject === selectedSubject;
    return yearMatch && subjectMatch;
  });

  const filteredDictionary = DICTIONARY_WORDS.filter(item =>
    item.word.toLowerCase().includes(dictionarySearch.toLowerCase()) ||
    item.definition.toLowerCase().includes(dictionarySearch.toLowerCase())
  );

  const handleStartExam = (examId: string, year: number, subject: string) => {
    if (confirm(`Start ${year} ${subject.charAt(0).toUpperCase() + subject.slice(1)} STAAR Test? This will begin a timed 3-hour exam.`)) {
      // Navigate to exam interface
      window.open(`/exam/${examId}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mock Exams</h2>
          <p className="text-gray-600">Comprehensive STAAR practice tests from 2013-2025</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showFormulaSheet} onOpenChange={setShowFormulaSheet}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Calculator className="w-4 h-4" />
                <span>Formula Sheet</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Math Formula Sheet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {Object.entries(FORMULA_SHEET_CONTENT).map(([category, formulas]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold capitalize">{category}</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap">{formulas}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showDictionary} onOpenChange={setShowDictionary}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Dictionary</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Reading Dictionary</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search for words..."
                    value={dictionarySearch}
                    onChange={(e) => setDictionarySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {filteredDictionary.map((item, index) => (
                      <div key={index} className="border-b pb-3">
                        <h4 className="font-semibold text-blue-600">{item.word}</h4>
                        <p className="text-sm text-gray-600 mb-1">{item.definition}</p>
                        <p className="text-sm italic text-gray-500">Example: {item.example}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Exams</TabsTrigger>
          <TabsTrigger value="history">Test History</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Filter Exams</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2025">2025 (AI-Generated)</SelectItem>
                      <SelectItem value="2024">2024 (AI-Enhanced)</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2017">2017</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                      <SelectItem value="2015">2015</SelectItem>
                      <SelectItem value="2014">2014</SelectItem>
                      <SelectItem value="2013">2013</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Grade Level</label>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-700">Grade {grade}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {exam.year} {exam.subject === "math" ? "Mathematics" : "Reading"}
                    </CardTitle>
                    {exam.new && (
                      <Badge className="bg-green-500">NEW</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{exam.type}</Badge>
                    <Badge variant="secondary">{exam.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{exam.timeLimit} minutes</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartExam(exam.id, exam.year, exam.subject)}
                    className={`w-full ${
                      exam.subject === "math"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    Start Exam
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="w-5 h-5 text-purple-500" />
                <span>Your Test History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TEST_HISTORY.map((test) => (
                  <div key={test.id} className={`border-2 rounded-lg p-4 ${getPerformanceColor(test.score)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">
                          {test.year} {test.subject === "math" ? "Mathematics" : "Reading"} STAAR
                        </h4>
                        <p className="text-sm opacity-80">
                          Taken on {new Date(test.dateTaken).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{test.score}%</div>
                        <div className="text-sm">{test.performanceLevel}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="font-semibold">{test.correctAnswers}/{test.totalQuestions}</div>
                        <div className="text-sm opacity-80">Correct</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{Math.floor(test.timeSpent / 60)}h {test.timeSpent % 60}m</div>
                        <div className="text-sm opacity-80">Time Spent</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{test.accurateQuestions.length}</div>
                        <div className="text-sm opacity-80">Accurate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{test.inaccurateQuestions.length}</div>
                        <div className="text-sm opacity-80">Needs Review</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Review Accurate Questions</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <XCircle className="w-4 h-4" />
                        <span>Review Missed Questions</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>Download Report</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>Overall Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Score</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Tests Completed</span>
                      <span className="font-semibold">3</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Total Study Time</span>
                      <span className="font-semibold">8h 40m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-red-500" />
                  <span>Mathematics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Score</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Strong in: Geometry, Measurement</p>
                    <p>Needs work: Data Analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span>Reading</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Average Score</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Strong in: Comprehension</p>
                    <p>Needs work: Vocabulary</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Progress Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span>Your scores are improving! Keep up the great work.</span>
                  <Award className="w-5 h-5 text-green-500" />
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">76%</div>
                    <div className="text-sm text-gray-600">First Test</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">82%</div>
                    <div className="text-sm text-gray-600">Second Test</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-gray-600">Latest Test</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}