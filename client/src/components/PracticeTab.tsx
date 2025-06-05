import { useQuery } from "@tanstack/react-query";
import { Calculator, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgressRing from "./ProgressRing";

interface PracticeTabProps {
  grade: number;
  onStartPractice: (subject: "math" | "reading") => void;
}

export default function PracticeTab({ grade, onStartPractice }: PracticeTabProps) {
  const { data: mathStats } = useQuery({
    queryKey: ["/api/stats", grade, "math"],
  });

  const { data: readingStats } = useQuery({
    queryKey: ["/api/stats", grade, "reading"],
  });

  const { data: practiceHistory } = useQuery({
    queryKey: ["/api/practice/history"],
    queryFn: () => fetch("/api/practice/history?limit=5").then(res => res.json()),
  });

  const mathProgress = mathStats ? Math.round(mathStats.averageScore) : 0;
  const readingProgress = readingStats ? Math.round(readingStats.averageScore) : 0;

  const getSkillStatus = (accuracy: number) => {
    if (accuracy >= 80) return { label: "Excellent", color: "bg-primary text-white" };
    if (accuracy >= 65) return { label: "Good", color: "bg-success text-white" };
    return { label: "Needs Work", color: "bg-secondary text-white" };
  };

  const mockMathSkills = [
    { name: "Fractions & Decimals", accuracy: 45 },
    { name: "Measurement & Data", accuracy: 75 },
    { name: "Geometry", accuracy: 85 },
  ];

  const mockReadingSkills = [
    { name: "Reading Comprehension", accuracy: 85 },
    { name: "Literary Elements", accuracy: 70 },
    { name: "Inferences & Conclusions", accuracy: 52 },
  ];

  return (
    <div>
      {/* Subject Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Math Section */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">Math</h3>
            </div>
            
            {/* Progress Ring */}
            <div className="flex justify-center mb-4">
              <ProgressRing progress={mathProgress} color="#FF5B00" />
            </div>
            
            {/* TEKS Skills */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">TEKS Skills to Practice:</h4>
              <div className="space-y-2">
                {mockMathSkills.map((skill, index) => {
                  const status = getSkillStatus(skill.accuracy);
                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Button 
              onClick={() => onStartPractice("math")}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105"
            >
              Start Math Practice
            </Button>
          </CardContent>
        </Card>

        {/* Reading Section */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700">Reading</h3>
            </div>
            
            {/* Progress Ring */}
            <div className="flex justify-center mb-4">
              <ProgressRing progress={readingProgress} color="#FCC201" />
            </div>
            
            {/* TEKS Skills */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-3">TEKS Skills to Practice:</h4>
              <div className="space-y-2">
                {mockReadingSkills.map((skill, index) => {
                  const status = getSkillStatus(skill.accuracy);
                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Button 
              onClick={() => onStartPractice("reading")}
              className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-secondary/90 transition-all duration-200 transform hover:scale-105"
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
