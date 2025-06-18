import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, Brain, Target, Clock, CheckCircle, AlertCircle, TrendingUp, BookOpen, Calculator, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIStudyPlanTabProps {
  grade: number;
  user: any;
}

interface StudyPlan {
  id: string;
  testDate: string;
  testType: string;
  currentLevel: string;
  targetScore: number;
  weeklySchedule: WeeklyPlan[];
  recommendations: string[];
  focusAreas: string[];
  estimatedHours: number;
  createdAt: string;
}

interface WeeklyPlan {
  week: number;
  startDate: string;
  endDate: string;
  goals: string[];
  mathTopics: string[];
  readingTopics: string[];
  practiceTests: string[];
  dailyMinutes: number;
  completed: boolean;
  progress: number;
}

const SAMPLE_STUDY_PLAN: StudyPlan = {
  id: "plan-1",
  testDate: "2025-04-15",
  testType: "STAAR Grade 4 Math & Reading",
  currentLevel: "Approaches Grade Level",
  targetScore: 85,
  weeklySchedule: [
    {
      week: 1,
      startDate: "2024-12-16",
      endDate: "2024-12-22",
      goals: ["Master fraction fundamentals", "Improve reading comprehension speed"],
      mathTopics: ["Fraction basics", "Decimal place value", "Simple geometry"],
      readingTopics: ["Main idea identification", "Character analysis", "Vocabulary in context"],
      practiceTests: ["2023 Math Practice Test"],
      dailyMinutes: 30,
      completed: false,
      progress: 0
    },
    {
      week: 2,
      startDate: "2024-12-23",
      endDate: "2024-12-29",
      goals: ["Practice word problems", "Strengthen inference skills"],
      mathTopics: ["Multi-step word problems", "Measurement conversions", "Data analysis"],
      readingTopics: ["Making inferences", "Author's purpose", "Text structure"],
      practiceTests: ["2022 Reading Practice Test"],
      dailyMinutes: 35,
      completed: false,
      progress: 0
    },
    {
      week: 3,
      startDate: "2024-12-30",
      endDate: "2025-01-05",
      goals: ["Review weak areas", "Build test-taking confidence"],
      mathTopics: ["Problem-solving strategies", "Review fractions", "Algebraic thinking"],
      readingTopics: ["Literary elements", "Compare and contrast", "Summarizing"],
      practiceTests: ["2024 Full Practice Test"],
      dailyMinutes: 40,
      completed: false,
      progress: 0
    }
  ],
  recommendations: [
    "Focus 60% of study time on mathematics as current accuracy is 72%",
    "Practice reading passages daily to improve speed and comprehension",
    "Take a full practice test every two weeks to track progress",
    "Review missed questions immediately after each practice session"
  ],
  focusAreas: ["Fractions and Decimals", "Word Problems", "Reading Comprehension", "Vocabulary"],
  estimatedHours: 45,
  createdAt: "2024-12-15T10:00:00Z"
};

export default function AIStudyPlanTab({ grade, user }: AIStudyPlanTabProps) {
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [testDate, setTestDate] = useState("");
  const [testType, setTestType] = useState("both");
  const [currentLevel, setCurrentLevel] = useState("");
  const [targetScore, setTargetScore] = useState(80);
  const [studyTimePerDay, setStudyTimePerDay] = useState(30);
  const [weakAreas, setWeakAreas] = useState("");
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(SAMPLE_STUDY_PLAN);
  const { toast } = useToast();

  const generatePlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      return apiRequest("POST", "/api/ai/generate-study-plan", planData);
    },
    onSuccess: (data) => {
      setStudyPlan(data);
      setShowCreatePlan(false);
      toast({
        title: "Study Plan Generated",
        description: "Your personalized AI study plan has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate study plan. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGeneratePlan = () => {
    if (!testDate || !currentLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const planData = {
      grade,
      testDate,
      testType,
      currentLevel,
      targetScore,
      studyTimePerDay,
      weakAreas: weakAreas.split(',').map(area => area.trim()).filter(Boolean),
      userId: user?.id
    };

    generatePlanMutation.mutate(planData);
  };

  const getDaysUntilTest = () => {
    if (!studyPlan?.testDate) return 0;
    const testDate = new Date(studyPlan.testDate);
    const today = new Date();
    const diffTime = testDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getCurrentWeek = () => {
    if (!studyPlan) return null;
    const today = new Date();
    return studyPlan.weeklySchedule.find(week => {
      const startDate = new Date(week.startDate);
      const endDate = new Date(week.endDate);
      return today >= startDate && today <= endDate;
    });
  };

  const getOverallProgress = () => {
    if (!studyPlan) return 0;
    const totalWeeks = studyPlan.weeklySchedule.length;
    const completedWeeks = studyPlan.weeklySchedule.filter(week => week.completed).length;
    const currentWeek = getCurrentWeek();
    const currentProgress = currentWeek ? currentWeek.progress / 100 : 0;
    return Math.round(((completedWeeks + currentProgress) / totalWeeks) * 100);
  };

  if (!studyPlan && !showCreatePlan) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">AI-Powered Study Plan</h2>
          <p className="text-gray-600 mb-6">
            Get a personalized, week-by-week study plan generated by AI to help you achieve mastery
          </p>
          <Button 
            onClick={() => setShowCreatePlan(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Create Your Study Plan
          </Button>
        </div>
      </div>
    );
  }

  if (showCreatePlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create AI Study Plan</h2>
            <p className="text-gray-600">Tell us about your goals and we'll create a personalized plan</p>
          </div>
          <Button variant="outline" onClick={() => setShowCreatePlan(false)}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Study Plan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="testDate">Test Date *</Label>
                <Input
                  id="testDate"
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="testType">Test Type</Label>
                <select
                  id="testType"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="both">Math & Reading</option>
                  <option value="math">Mathematics Only</option>
                  <option value="reading">Reading Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currentLevel">Current Performance Level *</Label>
                <select
                  id="currentLevel"
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select your level</option>
                  <option value="Does Not Meet Grade Level">Does Not Meet Grade Level</option>
                  <option value="Approaches Grade Level">Approaches Grade Level</option>
                  <option value="Meets Grade Level">Meets Grade Level</option>
                  <option value="Masters Grade Level">Masters Grade Level</option>
                </select>
              </div>
              <div>
                <Label htmlFor="targetScore">Target Score (%)</Label>
                <Input
                  id="targetScore"
                  type="number"
                  min="60"
                  max="100"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="studyTime">Daily Study Time (minutes)</Label>
              <Input
                id="studyTime"
                type="number"
                min="15"
                max="120"
                value={studyTimePerDay}
                onChange={(e) => setStudyTimePerDay(parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="weakAreas">Areas You Want to Focus On (optional)</Label>
              <Textarea
                id="weakAreas"
                placeholder="e.g., fractions, reading comprehension, word problems"
                value={weakAreas}
                onChange={(e) => setWeakAreas(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGeneratePlan}
              disabled={generatePlanMutation.isPending}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {generatePlanMutation.isPending ? "Generating Plan..." : "Generate AI Study Plan"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysUntilTest = getDaysUntilTest();
  const currentWeek = getCurrentWeek();
  const overallProgress = getOverallProgress();

  return (
    <div className="space-y-6">
      {/* Header with Test Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your AI Study Plan</h2>
          <p className="text-gray-600">{studyPlan.testType}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{daysUntilTest}</div>
          <div className="text-sm text-gray-600">days until test</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Overall Progress</h3>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Test Date</h3>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-green-600">
                {new Date(studyPlan.testDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold">Total Study Time</h3>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-orange-600">{studyPlan.estimatedHours}h</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">Target Score</h3>
            </div>
            <div className="mt-3">
              <div className="text-lg font-bold text-purple-600">{studyPlan.targetScore}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Week Highlight */}
      {currentWeek && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span>This Week - Week {currentWeek.week}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">This Week's Goals</h4>
                <ul className="space-y-1">
                  {currentWeek.goals.map((goal, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Daily Study Time</h4>
                <div className="text-2xl font-bold text-blue-600">{currentWeek.dailyMinutes} minutes</div>
                <Progress value={currentWeek.progress} className="mt-2" />
                <p className="text-sm text-gray-600 mt-1">{currentWeek.progress}% completed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-red-500" />
                  <span>Math Topics</span>
                </h4>
                <ul className="space-y-1">
                  {currentWeek.mathTopics.map((topic, index) => (
                    <li key={index} className="text-sm text-gray-600">• {topic}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Reading Topics</span>
                </h4>
                <ul className="space-y-1">
                  {currentWeek.readingTopics.map((topic, index) => (
                    <li key={index} className="text-sm text-gray-600">• {topic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studyPlan.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studyPlan.weeklySchedule.map((week) => (
              <div key={week.week} className={`border rounded-lg p-4 ${week.completed ? 'bg-green-50 border-green-200' : currentWeek?.week === week.week ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">Week {week.week}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {week.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                    <Badge className={week.completed ? "bg-green-500" : currentWeek?.week === week.week ? "bg-blue-500" : "bg-gray-500"}>
                      {week.completed ? "Completed" : currentWeek?.week === week.week ? "Current" : "Upcoming"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-1">Goals</h5>
                    <ul className="space-y-1">
                      {week.goals.map((goal, index) => (
                        <li key={index} className="text-gray-600">• {goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Practice Tests</h5>
                    <ul className="space-y-1">
                      {week.practiceTests.map((test, index) => (
                        <li key={index} className="text-gray-600">• {test}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Daily Study</h5>
                    <p className="text-gray-600">{week.dailyMinutes} minutes per day</p>
                    {!week.completed && (
                      <div className="mt-2">
                        <Progress value={week.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{week.progress}% complete</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle>Focus Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {studyPlan.focusAreas.map((area, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {area}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          onClick={() => setShowCreatePlan(true)}
          variant="outline"
        >
          Update Plan
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600">
          Start Today's Study Session
        </Button>
      </div>
    </div>
  );
}