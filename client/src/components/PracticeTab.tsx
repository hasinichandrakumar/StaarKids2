import { useQuery } from "@tanstack/react-query";
import { Calculator, BookOpen, Clock, Plus, Minus, X, Divide, Play, Star, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgressRing from "./ProgressRing";

interface PracticeTabProps {
  grade: number;
  onStartPractice: (subject: "math" | "reading", category?: string) => void;
}

export default function PracticeTab({ grade, onStartPractice }: PracticeTabProps) {
  const { data: mathStats } = useQuery({
    queryKey: ["/api/stats", grade, "math"],
  });

  const { data: readingStats } = useQuery({
    queryKey: ["/api/stats", grade, "reading"],
  });

  const { data: moduleAccuracy } = useQuery({
    queryKey: ["/api/accuracy", grade],
  });

  const { data: practiceHistory } = useQuery({
    queryKey: ["/api/practice/history"],
    queryFn: () => fetch("/api/practice/history?limit=5").then(res => res.json()),
  });

  const { data: mathAccuracy } = useQuery({
    queryKey: ["/api/accuracy", grade, "math"],
    queryFn: () => fetch(`/api/accuracy?grade=${grade}&subject=math`).then(res => res.json()),
  });

  const { data: readingAccuracy } = useQuery({
    queryKey: ["/api/accuracy", grade, "reading"],
    queryFn: () => fetch(`/api/accuracy?grade=${grade}&subject=reading`).then(res => res.json()),
  });

  const mathProgress = mathAccuracy ? Math.round(mathAccuracy.overallAccuracy || 0) : 0;
  const readingProgress = readingAccuracy ? Math.round(readingAccuracy.overallAccuracy || 0) : 0;

  const getMathSkillStatus = (accuracy: number) => {
    if (accuracy >= 80) return { label: "Excellent", color: "bg-green-600 text-white" };
    if (accuracy >= 65) return { label: "Good", color: "bg-blue-600 text-white" };
    return { label: "Needs Work", color: "bg-orange-600 text-white" };
  };

  const getReadingSkillStatus = (accuracy: number) => {
    if (accuracy >= 80) return { label: "Excellent", color: "bg-green-600 text-white" };
    if (accuracy >= 65) return { label: "Good", color: "bg-blue-600 text-white" };
    return { label: "Needs Work", color: "text-black", style: { backgroundColor: "#FCC201" } };
  };

  const getMathSkills = (grade: number) => {
    const baseSkills = (() => {
      switch (grade) {
        case 3:
          return [
            { name: "Multiplication and Division", teks: "3.4E,3.4F" },
            { name: "Place Value to 1,000", teks: "3.2A,3.2B" },
            { name: "Add and Subtract within 1,000", teks: "3.4A" },
            { name: "Perimeter and Area", teks: "3.6D,3.6E" },
            { name: "2D and 3D Shapes", teks: "3.6A,3.6B" },
          ];
        case 4:
          return [
            { name: "Multi-digit Operations", teks: "4.4A,4.4B" },
            { name: "Fractions and Decimals", teks: "4.2G,4.3E" },
            { name: "Factors and Multiples", teks: "4.4C,4.4D" },
            { name: "Shape Properties", teks: "4.5D,4.6A" },
            { name: "Data Analysis", teks: "4.9A,4.9B" },
          ];
        case 5:
          return [
            { name: "Decimal and Fraction Operations", teks: "5.3G,5.3H" },
            { name: "Volume and Measurement", teks: "5.4H,5.6A" },
            { name: "Variables and Expressions", teks: "5.4E,5.4F" },
            { name: "2D and 3D Figure Classification", teks: "5.5A,5.6B" },
            { name: "Data Representation", teks: "5.9A,5.9C" },
          ];
        default:
          return [];
      }
    })();

    return baseSkills.map(skill => ({
      ...skill,
      accuracy: mathStats?.categoryStats?.find((cat: any) => 
        cat.category.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0])
      )?.accuracy || 0
    }));
  };

  const getReadingSkills = (grade: number) => {
    const baseSkills = (() => {
      switch (grade) {
        case 3:
          return [
            { name: "Inferences and Conclusions", teks: "3.6G,3.6H" },
            { name: "Main Idea and Details", teks: "3.6E,3.6F" },
            { name: "Story Elements", teks: "3.6A,3.6B" },
            { name: "Context Clues", teks: "3.4B,3.4C" },
            { name: "Text Types", teks: "3.9A,3.9B" },
          ];
        case 4:
          return [
            { name: "Text Structure and Purpose", teks: "4.6D,4.9C" },
            { name: "Compare and Contrast", teks: "4.6F,4.6H" },
            { name: "Reference Materials", teks: "4.7A,4.7B" },
            { name: "Complex Text Comprehension", teks: "4.6A,4.6G" },
            { name: "Narrative and Informational", teks: "4.8A,4.9A" },
          ];
        case 5:
          return [
            { name: "Text Arguments and Evidence", teks: "5.6H,5.9F" },
            { name: "Multiple Text Analysis", teks: "5.6I,5.9G" },
            { name: "Figurative Language", teks: "5.4C,5.4D" },
            { name: "Multiple-meaning Words", teks: "5.4A,5.4B" },
            { name: "Complex Text Independence", teks: "5.6A,5.6G" },
          ];
        default:
          return [];
      }
    })();

    return baseSkills.map(skill => ({
      ...skill,
      accuracy: readingStats?.categoryStats?.find((cat: any) => 
        cat.category.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0])
      )?.accuracy || 0
    }));
  };

  const mathSkills = getMathSkills(grade);
  const readingSkills = getReadingSkills(grade);

  return (
    <div>
      {/* Subject Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Math Section */}
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-orange-700 mb-1">Math</h3>
                  <p className="text-orange-600 text-sm">Problem Solving & Numbers</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-orange-500" />
                  <span className="text-2xl font-bold text-orange-700">{mathProgress}%</span>
                </div>
                <span className="text-xs text-orange-600 font-medium">Current Progress</span>
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="flex justify-center mb-4">
              <ProgressRing progress={mathProgress} color="#FF5B00" />
            </div>
            
            {/* TEKS Skills */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">TEKS Skills to Practice:</h4>
              <div className="space-y-2">
                {mathSkills.map((skill, index) => {
                  const status = getMathSkillStatus(skill.accuracy);
                  return (
                    <button
                      key={index}
                      onClick={() => onStartPractice("math", skill.name)}
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 w-full transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.teks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-orange-600">{Math.round(skill.accuracy)}%</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <Button 
              onClick={() => onStartPractice("math")}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-200 transform hover:scale-105"
            >
              Start Math Practice
            </Button>
          </CardContent>
        </Card>

        {/* Reading Section */}
        <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-amber-700 mb-1">Reading</h3>
                  <p className="text-amber-600 text-sm">Comprehension & Analysis</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span className="text-2xl font-bold text-amber-700">{readingProgress}%</span>
                </div>
                <span className="text-xs text-amber-600 font-medium">Current Progress</span>
              </div>
            </div>
            
            {/* Progress Ring */}
            <div className="flex justify-center mb-4">
              <ProgressRing progress={readingProgress} color="#FCC201" />
            </div>
            
            {/* TEKS Skills */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">TEKS Skills to Practice:</h4>
              <div className="space-y-2">
                {readingSkills.map((skill, index) => {
                  const status = getReadingSkillStatus(skill.accuracy);
                  return (
                    <button
                      key={index}
                      onClick={() => onStartPractice("reading", skill.name)}
                      className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg p-3 w-full transition-colors cursor-pointer"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-xs text-gray-500">{skill.teks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: "#B8860B" }}>{Math.round(skill.accuracy)}%</span>
                        <span 
                          className={`text-xs px-2 py-1 rounded-full ${status.color}`}
                          style={status.style || {}}
                        >
                          {status.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <Button 
              onClick={() => onStartPractice("reading")}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 text-black"
              style={{ backgroundColor: "#FCC201", borderColor: "#FCC201" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E6AE01";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FCC201";
              }}
            >
              Start Reading Practice
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h3>
          {practiceHistory && practiceHistory.length > 0 ? (
            <div className="space-y-4">
              {practiceHistory.map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                      {activity.subject === "math" ? (
                        <Calculator className="w-5 h-5 text-primary" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        {activity.subject === "math" ? "Math" : "Reading"} Practice
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${activity.isCorrect ? "text-success" : "text-red-500"}`}>
                      {activity.isCorrect ? "Correct" : "Incorrect"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.isCorrect && !activity.skipped ? "+50 Star Power" : "No points"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No practice history yet. Start practicing to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
