import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Target, Brain, Zap, BarChart3, BookOpen, Calculator, ChevronRight, Filter, Search, Sparkles, Trophy, Clock, CheckCircle } from "lucide-react";

interface UnlimitedPracticeTabProps {
  grade: number;
  onStartPractice: (subject: "math" | "reading", category?: string) => void;
}

// TEKS Standards organized by subject and category
const TEKS_STANDARDS = {
  math: {
    3: {
      "Number & Operations": [
        { code: "3.2A", description: "Compose and decompose numbers up to 100,000" },
        { code: "3.2B", description: "Describe the mathematical relationships found in place value" },
        { code: "3.2C", description: "Represent a number on a number line" },
        { code: "3.2D", description: "Compare and order whole numbers up to 100,000" }
      ],
      "Algebraic Reasoning": [
        { code: "3.4A", description: "Solve one-step and two-step problems" },
        { code: "3.4B", description: "Represent and solve addition and subtraction word problems" },
        { code: "3.4K", description: "Solve one-step and two-step problems involving multiplication" }
      ],
      "Geometry & Measurement": [
        { code: "3.6A", description: "Classify and sort two- and three-dimensional figures" },
        { code: "3.6B", description: "Use attributes to recognize rhombuses, parallelograms, trapezoids" },
        { code: "3.7A", description: "Represent fractions greater than zero and less than or equal to one" }
      ]
    },
    4: {
      "Number & Operations": [
        { code: "4.2A", description: "Interpret the value of each place-value position" },
        { code: "4.2B", description: "Represent the value of the digit in whole numbers" },
        { code: "4.2C", description: "Compare and order whole numbers to 1,000,000" },
        { code: "4.2D", description: "Round whole numbers to a given place value" }
      ],
      "Algebraic Reasoning": [
        { code: "4.4A", description: "Add and subtract whole numbers and decimals" },
        { code: "4.4B", description: "Determine products of a number and 10 or 100" },
        { code: "4.4C", description: "Represent the product of 2 two-digit numbers" }
      ],
      "Geometry & Measurement": [
        { code: "4.5A", description: "Identify points, lines, line segments, rays, angles" },
        { code: "4.5B", description: "Identify and draw one or more lines of symmetry" },
        { code: "4.6A", description: "Apply mathematics to problems connected to everyday experiences" }
      ]
    },
    5: {
      "Number & Operations": [
        { code: "5.2A", description: "Represent the value of the digit in decimals" },
        { code: "5.2B", description: "Compare and order two decimals to thousandths" },
        { code: "5.2C", description: "Round decimals to tenths or hundredths" }
      ],
      "Algebraic Reasoning": [
        { code: "5.3A", description: "Estimate to determine solutions to mathematical problems" },
        { code: "5.3B", description: "Multiply with fluency a three-digit number by a two-digit number" },
        { code: "5.3C", description: "Solve with fluency one-step and two-step problems" }
      ],
      "Geometry & Measurement": [
        { code: "5.4A", description: "Identify prime and composite numbers" },
        { code: "5.4B", description: "Represent and solve multi-step problems" },
        { code: "5.6A", description: "Recognize a cube with side length s" }
      ]
    }
  },
  reading: {
    3: {
      "Comprehension": [
        { code: "3.6A", description: "Establish purpose for reading selected texts" },
        { code: "3.6B", description: "Generate questions about text before, during, and after reading" },
        { code: "3.6C", description: "Make and correct or confirm predictions" },
        { code: "3.6D", description: "Create mental images to deepen understanding" }
      ],
      "Response": [
        { code: "3.7A", description: "Describe personal connections to a variety of sources" },
        { code: "3.7B", description: "Write a response to a literary or informational text" },
        { code: "3.7C", description: "Use text evidence to support an appropriate response" }
      ],
      "Literary Elements": [
        { code: "3.8A", description: "Infer the theme of a work, distinguishing theme from topic" },
        { code: "3.8B", description: "Explain the relationships among the major characters" },
        { code: "3.8C", description: "Analyze plot elements, including the sequence of events" }
      ]
    },
    4: {
      "Comprehension": [
        { code: "4.6A", description: "Establish purpose for reading selected texts" },
        { code: "4.6B", description: "Generate questions about text before, during, and after reading" },
        { code: "4.6C", description: "Make and correct or confirm predictions" },
        { code: "4.6D", description: "Create mental images to deepen understanding" }
      ],
      "Response": [
        { code: "4.7A", description: "Describe personal connections to a variety of sources" },
        { code: "4.7B", description: "Write a response to a literary or informational text" },
        { code: "4.7C", description: "Use text evidence to support an appropriate response" }
      ],
      "Author's Craft": [
        { code: "4.9A", description: "Demonstrate knowledge of distinguishing characteristics" },
        { code: "4.9B", description: "Explain figurative language such as simile and metaphor" },
        { code: "4.9C", description: "Explain structure in drama such as character tags" }
      ]
    },
    5: {
      "Comprehension": [
        { code: "5.6A", description: "Establish purpose for reading selected texts" },
        { code: "5.6B", description: "Generate questions about text before, during, and after reading" },
        { code: "5.6C", description: "Make and correct or confirm predictions" },
        { code: "5.6D", description: "Create mental images to deepen understanding" }
      ],
      "Response": [
        { code: "5.7A", description: "Describe personal connections to a variety of sources" },
        { code: "5.7B", description: "Write a response to a literary or informational text" },
        { code: "5.7C", description: "Use text evidence to support an appropriate response" }
      ],
      "Composition": [
        { code: "5.11A", description: "Plan a first draft by selecting a genre" },
        { code: "5.11B", description: "Develop drafts into a focused piece of writing" },
        { code: "5.11C", description: "Revise drafts to improve sentence structure" }
      ]
    }
  }
};

// Daily Challenge Topics
const DAILY_CHALLENGES = [
  {
    id: 1,
    title: "Fraction Masters",
    description: "Practice fraction operations and comparisons",
    subject: "math" as const,
    difficulty: "Medium",
    questionsCount: 10,
    timeLimit: 15,
    starReward: 25,
    completed: false,
    progress: 0
  },
  {
    id: 2,
    title: "Reading Detective",
    description: "Analyze character motivations and plot elements",
    subject: "reading" as const,
    difficulty: "Hard",
    questionsCount: 5,
    timeLimit: 20,
    starReward: 35,
    completed: true,
    progress: 100
  },
  {
    id: 3,
    title: "Geometry Explorer",
    description: "Identify shapes, angles, and geometric properties",
    subject: "math" as const,
    difficulty: "Easy",
    questionsCount: 8,
    timeLimit: 12,
    starReward: 20,
    completed: false,
    progress: 60
  }
];

// Practice History Data
const PRACTICE_HISTORY = [
  {
    id: 1,
    subject: "math" as const,
    category: "Number & Operations",
    teksCode: "4.2A",
    questionsAnswered: 15,
    correctAnswers: 12,
    accuracy: 80,
    timeSpent: 18,
    datePracticed: "2024-12-15T14:30:00Z"
  },
  {
    id: 2,
    subject: "reading" as const,
    category: "Comprehension",
    teksCode: "4.6B",
    questionsAnswered: 8,
    correctAnswers: 7,
    accuracy: 88,
    timeSpent: 22,
    datePracticed: "2024-12-14T16:45:00Z"
  },
  {
    id: 3,
    subject: "math" as const,
    category: "Geometry & Measurement",
    teksCode: "4.5A",
    questionsAnswered: 12,
    correctAnswers: 9,
    accuracy: 75,
    timeSpent: 25,
    datePracticed: "2024-12-13T10:15:00Z"
  }
];

export default function UnlimitedPracticeTab({ grade, onStartPractice }: UnlimitedPracticeTabProps) {
  const [selectedTab, setSelectedTab] = useState("practice");
  const [selectedSubject, setSelectedSubject] = useState<"math" | "reading">("math");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTeks, setSelectedTeks] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get TEKS for current grade and subject
  const currentTeks = TEKS_STANDARDS[selectedSubject][grade as keyof typeof TEKS_STANDARDS[typeof selectedSubject]] || {};
  const categories = Object.keys(currentTeks);

  // Filter TEKS standards based on search and category
  const filteredTeks = selectedCategory === "all" 
    ? Object.values(currentTeks).flat()
    : currentTeks[selectedCategory as keyof typeof currentTeks] || [];

  const searchFilteredTeks = filteredTeks.filter(teks =>
    teks.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teks.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate accuracy by TEKS
  const getTeksAccuracy = (teksCode: string) => {
    const practiceForTeks = PRACTICE_HISTORY.filter(p => p.teksCode === teksCode);
    if (practiceForTeks.length === 0) return null;
    
    const totalQuestions = practiceForTeks.reduce((sum, p) => sum + p.questionsAnswered, 0);
    const totalCorrect = practiceForTeks.reduce((sum, p) => sum + p.correctAnswers, 0);
    return Math.round((totalCorrect / totalQuestions) * 100);
  };

  const handleStartPractice = (subject: "math" | "reading", teksCode?: string, category?: string) => {
    onStartPractice(subject, category);
    toast({
      title: "Practice Started",
      description: `Starting ${subject} practice${teksCode ? ` for ${teksCode}` : ''}`,
    });
  };

  const handleStartChallenge = (challengeId: number) => {
    const challenge = DAILY_CHALLENGES.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      onStartPractice(challenge.subject);
      toast({
        title: "Challenge Started",
        description: `Starting daily challenge: ${challenge.title}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Unlimited Practice</h2>
          <p className="text-gray-600">AI-powered questions organized by TEKS standards</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500 flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>AI-Generated</span>
          </Badge>
          <Badge variant="outline">Grade {grade}</Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="practice">Practice by TEKS</TabsTrigger>
          <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
          <TabsTrigger value="history">Practice History</TabsTrigger>
          <TabsTrigger value="analytics">TEKS Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-6">
          {/* Subject and Category Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-blue-500" />
                <span>Practice Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Select value={selectedSubject} onValueChange={(value) => setSelectedSubject(value as "math" | "reading")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Search TEKS</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search standards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Quick Start</label>
                  <Button
                    onClick={() => handleStartPractice(selectedSubject)}
                    className="w-full"
                  >
                    Start Mixed Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TEKS Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchFilteredTeks.map((teks) => {
              const accuracy = getTeksAccuracy(teks.code);
              return (
                <Card key={teks.code} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{teks.code}</CardTitle>
                      {accuracy !== null && (
                        <Badge
                          className={
                            accuracy >= 80
                              ? "bg-green-500"
                              : accuracy >= 70
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        >
                          {accuracy}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{teks.description}</p>
                    
                    {accuracy !== null && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Mastery Level</span>
                          <span>{accuracy}%</span>
                        </div>
                        <Progress value={accuracy} className="h-2" />
                      </div>
                    )}

                    <Button
                      onClick={() => handleStartPractice(selectedSubject, teks.code, selectedCategory)}
                      className={`w-full ${
                        selectedSubject === "math"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      Practice {teks.code}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-500" />
                <span>Daily Challenges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DAILY_CHALLENGES.map((challenge) => (
                  <Card key={challenge.id} className={`${challenge.completed ? 'bg-green-50 border-green-200' : 'hover:shadow-lg'} transition-all`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        {challenge.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={challenge.subject === "math" ? "bg-red-500" : "bg-blue-500"}>
                          {challenge.subject === "math" ? "Mathematics" : "Reading"}
                        </Badge>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-gray-500" />
                          <span>{challenge.questionsCount} questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{challenge.timeLimit} minutes</span>
                        </div>
                      </div>

                      {!challenge.completed && challenge.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">+{challenge.starReward} StarPower</span>
                        </div>
                        <Button
                          onClick={() => handleStartChallenge(challenge.id)}
                          disabled={challenge.completed}
                          size="sm"
                          className={challenge.completed ? "" : 
                            challenge.subject === "math"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-blue-500 hover:bg-blue-600"
                          }
                        >
                          {challenge.completed ? "Completed" : "Start Challenge"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                <span>Practice History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PRACTICE_HISTORY.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold flex items-center space-x-2">
                          {session.subject === "math" ? (
                            <Calculator className="w-4 h-4 text-red-500" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-blue-500" />
                          )}
                          <span>{session.teksCode} - {session.category}</span>
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(session.datePracticed).toLocaleDateString()} at {new Date(session.datePracticed).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          session.accuracy >= 80
                            ? "bg-green-500"
                            : session.accuracy >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      >
                        {session.accuracy}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Questions:</span>
                        <div className="font-semibold">{session.questionsAnswered}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Correct:</span>
                        <div className="font-semibold">{session.correctAnswers}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Accuracy:</span>
                        <div className="font-semibold">{session.accuracy}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <div className="font-semibold">{session.timeSpent}m</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress value={session.accuracy} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const categoryTeks = currentTeks[category as keyof typeof currentTeks] || [];
              const categoryAccuracies = categoryTeks.map(teks => getTeksAccuracy(teks.code)).filter(acc => acc !== null);
              const avgAccuracy = categoryAccuracies.length > 0 
                ? Math.round(categoryAccuracies.reduce((sum, acc) => sum + (acc || 0), 0) / categoryAccuracies.length)
                : 0;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Average Accuracy</span>
                      <Badge
                        className={
                          avgAccuracy >= 80
                            ? "bg-green-500"
                            : avgAccuracy >= 70
                            ? "bg-yellow-500"
                            : avgAccuracy > 0
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }
                      >
                        {avgAccuracy > 0 ? `${avgAccuracy}%` : "No Data"}
                      </Badge>
                    </div>
                    
                    {avgAccuracy > 0 && (
                      <Progress value={avgAccuracy} className="h-2" />
                    )}

                    <div className="space-y-2">
                      {categoryTeks.map((teks) => {
                        const accuracy = getTeksAccuracy(teks.code);
                        return (
                          <div key={teks.code} className="flex items-center justify-between text-sm">
                            <span className="truncate flex-1 mr-2">{teks.code}</span>
                            {accuracy !== null ? (
                              <Badge
                                size="sm"
                                className={
                                  accuracy >= 80
                                    ? "bg-green-500"
                                    : accuracy >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }
                              >
                                {accuracy}%
                              </Badge>
                            ) : (
                              <Badge size="sm" variant="outline">
                                Not Practiced
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}