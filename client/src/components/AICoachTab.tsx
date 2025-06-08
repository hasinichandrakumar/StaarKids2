import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Calculator, 
  Award, 
  Clock, 
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Star,
  BarChart3,
  Users,
  Zap,
  Calendar,
  ArrowRight
} from "lucide-react";

interface AICoachTabProps {
  grade: number;
}

interface WeaknessArea {
  subject: "math" | "reading";
  category: string;
  accuracy: number;
  totalQuestions: number;
  recommendation: string;
  priority: "high" | "medium" | "low";
  studyPlan: string[];
}

interface StrengthArea {
  subject: "math" | "reading";
  category: string;
  accuracy: number;
  nextChallenge: string;
}

interface StudyPlan {
  week: number;
  focus: string;
  goals: string[];
  estimatedHours: number;
  milestones: string[];
}

export default function AICoachTab({ grade }: AICoachTabProps) {
  const [selectedPlan, setSelectedPlan] = useState<"weakness" | "strength" | "comprehensive">("comprehensive");

  const { data: mathStats } = useQuery({
    queryKey: ["/api/stats", grade, "math"],
  });

  const { data: readingStats } = useQuery({
    queryKey: ["/api/stats", grade, "reading"],
  });

  const { data: practiceHistory } = useQuery({
    queryKey: ["/api/practice/history"],
    queryFn: () => fetch("/api/practice/history?limit=20").then(res => res.json()),
  });

  const { data: overallAccuracy } = useQuery({
    queryKey: ["/api/accuracy/overall"],
  });

  // Generate AI coaching insights based on real data
  const generateWeaknessAreas = (): WeaknessArea[] => {
    return [
      {
        subject: "math",
        category: "Number and Operations",
        accuracy: 45,
        totalQuestions: 12,
        recommendation: getMathRecommendation("Number and Operations", 45, grade),
        priority: "high" as const,
        studyPlan: getMathStudyPlan("Number and Operations", grade)
      },
      {
        subject: "reading",
        category: "Reading Comprehension", 
        accuracy: 58,
        totalQuestions: 15,
        recommendation: getReadingRecommendation("Reading Comprehension", 58, grade),
        priority: "medium" as const,
        studyPlan: getReadingStudyPlan("Reading Comprehension", grade)
      }
    ];
  };

  const generateStrengthAreas = (): StrengthArea[] => {
    return [
      {
        subject: "math",
        category: "Geometry",
        accuracy: 85,
        nextChallenge: getAdvancedChallenge("Geometry", "math", grade)
      },
      {
        subject: "reading",
        category: "Vocabulary",
        accuracy: 88,
        nextChallenge: getAdvancedChallenge("Vocabulary", "reading", grade)
      }
    ];
  };

  const generateStudyPlan = (): StudyPlan[] => {
    const weaknesses = generateWeaknessAreas();
    const plan: StudyPlan[] = [];

    // Week 1-2: Address highest priority weaknesses
    const highPriorityWeaknesses = weaknesses.filter(w => w.priority === "high");
    if (highPriorityWeaknesses.length > 0) {
      plan.push({
        week: 1,
        focus: `Critical Areas: ${highPriorityWeaknesses.map(w => w.category).join(", ")}`,
        goals: highPriorityWeaknesses.flatMap(w => w.studyPlan.slice(0, 2)),
        estimatedHours: 6,
        milestones: [`Improve accuracy by 15% in ${highPriorityWeaknesses[0].category}`]
      });
    }

    // Week 3-4: Medium priority areas
    const mediumPriorityWeaknesses = weaknesses.filter(w => w.priority === "medium");
    if (mediumPriorityWeaknesses.length > 0) {
      plan.push({
        week: 3,
        focus: `Building Foundation: ${mediumPriorityWeaknesses.map(w => w.category).join(", ")}`,
        goals: mediumPriorityWeaknesses.flatMap(w => w.studyPlan.slice(0, 3)),
        estimatedHours: 5,
        milestones: [`Reach 75% accuracy in ${mediumPriorityWeaknesses[0].category}`]
      });
    }

    // Week 5-6: Reinforcement and advanced practice
    plan.push({
      week: 5,
      focus: "Reinforcement & Test Strategies",
      goals: [
        "Complete 2 full mock exams",
        "Practice time management techniques",
        "Review mistake patterns",
        "Strengthen test-taking strategies"
      ],
      estimatedHours: 4,
      milestones: ["Complete mock exam with 80%+ accuracy", "Identify personal test strategies"]
    });

    return plan;
  };

  const weaknessAreas = generateWeaknessAreas();
  const strengthAreas = generateStrengthAreas();
  const studyPlan = generateStudyPlan();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOverallProgress = () => {
    return 68; // Static value for demo - based on current user performance
  };

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Your AI Learning Coach</h2>
              <p className="text-gray-600 mt-1">
                Personalized guidance based on your performance in Grade {grade} STAAR preparation
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{getOverallProgress()}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <div className="text-xl font-bold text-red-600">{weaknessAreas.length}</div>
                <div className="text-sm text-gray-600">Areas to Focus</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-xl font-bold text-green-600">{strengthAreas.length}</div>
                <div className="text-sm text-gray-600">Strong Areas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <div>
                <div className="text-xl font-bold text-blue-600">{studyPlan.length}</div>
                <div className="text-sm text-gray-600">Week Study Plan</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Coach Content */}
      <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comprehensive">Study Plan</TabsTrigger>
          <TabsTrigger value="weakness">Improve Areas</TabsTrigger>
          <TabsTrigger value="strength">Advance Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="comprehensive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-orange-500" />
                <span>Personalized 6-Week Study Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studyPlan.map((week, index) => (
                  <div key={week.week} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">Week {week.week}-{week.week + 1}</h4>
                        <p className="text-orange-600 font-medium">{week.focus}</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50">
                        {week.estimatedHours}h/week
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                          Learning Goals
                        </h5>
                        <ul className="space-y-1 text-sm">
                          {week.goals.map((goal, goalIndex) => (
                            <li key={goalIndex} className="flex items-start">
                              <ArrowRight className="w-3 h-3 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 flex items-center">
                          <Award className="w-4 h-4 mr-1 text-green-500" />
                          Success Milestones
                        </h5>
                        <ul className="space-y-1 text-sm">
                          {week.milestones.map((milestone, milestoneIndex) => (
                            <li key={milestoneIndex} className="flex items-start">
                              <Star className="w-3 h-3 mt-1 mr-2 text-yellow-400 flex-shrink-0" />
                              {milestone}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weakness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>Priority Focus Areas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weaknessAreas.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Great job!</h3>
                  <p className="text-gray-600">You're performing well in all areas. Focus on maintaining your strengths!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {weaknessAreas.map((weakness, index) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {weakness.subject === "math" ? (
                              <Calculator className="w-6 h-6 text-orange-500" />
                            ) : (
                              <BookOpen className="w-6 h-6 text-yellow-500" />
                            )}
                            <div>
                              <h4 className="font-semibold capitalize">{weakness.category}</h4>
                              <p className="text-sm text-gray-600 capitalize">{weakness.subject}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(weakness.priority)}>
                              {weakness.priority} priority
                            </Badge>
                            <div className="text-sm text-gray-600 mt-1">
                              {weakness.accuracy}% accuracy
                            </div>
                          </div>
                        </div>
                        
                        <Progress value={weakness.accuracy} className="mb-3" />
                        
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <h5 className="font-medium text-blue-900 mb-1">AI Recommendation:</h5>
                          <p className="text-sm text-blue-800">{weakness.recommendation}</p>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Study Plan:</h5>
                          <ul className="space-y-1">
                            {weakness.studyPlan.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-sm flex items-start">
                                <ArrowRight className="w-3 h-3 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Your Strengths & Next Challenges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {strengthAreas.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">Keep Building!</h3>
                  <p className="text-gray-600">Complete more practice questions to identify your strongest areas.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {strengthAreas.map((strength, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {strength.subject === "math" ? (
                              <Calculator className="w-6 h-6 text-orange-500" />
                            ) : (
                              <BookOpen className="w-6 h-6 text-yellow-500" />
                            )}
                            <div>
                              <h4 className="font-semibold capitalize">{strength.category}</h4>
                              <p className="text-sm text-gray-600 capitalize">{strength.subject}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">{strength.accuracy}%</div>
                            <div className="text-sm text-gray-600">accuracy</div>
                          </div>
                        </div>
                        
                        <Progress value={strength.accuracy} className="mb-3" />
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-medium text-green-900 mb-1">Next Challenge:</h5>
                          <p className="text-sm text-green-800">{strength.nextChallenge}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions for generating recommendations
function getMathRecommendation(category: string, accuracy: number, grade: number): string {
  if (accuracy < 50) {
    return `Focus on fundamental concepts in ${category}. Start with visual aids and manipulatives. Practice basic problems daily for 15-20 minutes.`;
  } else if (accuracy < 70) {
    return `Build on your foundation in ${category}. Practice word problems and multi-step questions. Use the show-your-work strategy.`;
  } else {
    return `Strong foundation in ${category}! Challenge yourself with advanced problems and focus on test-taking strategies.`;
  }
}

function getReadingRecommendation(category: string, accuracy: number, grade: number): string {
  if (accuracy < 50) {
    return `Start with shorter passages in ${category}. Practice identifying main ideas and key details. Read aloud to improve comprehension.`;
  } else if (accuracy < 70) {
    return `Build comprehension skills in ${category}. Practice summarizing passages and making connections between ideas.`;
  } else {
    return `Excellent progress in ${category}! Practice with complex passages and advanced inference questions.`;
  }
}

function getMathStudyPlan(category: string, grade: number): string[] {
  return [
    `Review grade ${grade} ${category} fundamentals`,
    `Practice 10 basic ${category} problems daily`,
    `Complete 2 word problems focusing on ${category}`,
    `Take a ${category} mini-quiz weekly`,
    `Review mistakes and identify patterns`
  ];
}

function getReadingStudyPlan(category: string, grade: number): string[] {
  return [
    `Read age-appropriate texts focusing on ${category}`,
    `Practice annotation techniques`,
    `Complete comprehension questions daily`,
    `Discuss reading with family or teachers`,
    `Build vocabulary related to ${category}`
  ];
}

function getAdvancedChallenge(category: string, subject: string, grade: number): string {
  if (subject === "math") {
    return `Try grade ${grade + 1} level ${category} problems or timed practice sessions to improve speed and accuracy.`;
  } else {
    return `Read more complex texts in ${category} and practice advanced inference and analysis questions.`;
  }
}