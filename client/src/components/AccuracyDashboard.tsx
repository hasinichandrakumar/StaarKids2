import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, BookOpen, Calculator } from "lucide-react";

interface OverallAccuracy {
  totalAttempts: number;
  correctAttempts: number;
  overallAccuracy: number;
  mathAccuracy: number;
  readingAccuracy: number;
  gradeBreakdown: Array<{
    grade: number;
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

interface ModuleAccuracy {
  overallAccuracy: number;
  teksStandardStats: Array<{
    teksStandard: string;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    lastAttempted: Date | null;
  }>;
}

interface AccuracyDashboardProps {
  selectedGrade: number;
}

export default function AccuracyDashboard({ selectedGrade }: AccuracyDashboardProps) {
  const { data: overallAccuracy, isLoading: overallLoading } = useQuery<OverallAccuracy>({
    queryKey: ["/api/accuracy/overall"],
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  const { data: mathAccuracy, isLoading: mathLoading } = useQuery<ModuleAccuracy>({
    queryKey: ["/api/accuracy", selectedGrade, "math"],
    staleTime: 60 * 1000,
  });

  const { data: readingAccuracy, isLoading: readingLoading } = useQuery<ModuleAccuracy>({
    queryKey: ["/api/accuracy", selectedGrade, "reading"],
    staleTime: 60 * 1000,
  });

  if (overallLoading || mathLoading || readingLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const overall = overallAccuracy || { totalAttempts: 0, correctAttempts: 0, overallAccuracy: 0, mathAccuracy: 0, readingAccuracy: 0, gradeBreakdown: [] };
  const math = mathAccuracy || { overallAccuracy: 0, teksStandardStats: [] };
  const reading = readingAccuracy || { overallAccuracy: 0, teksStandardStats: [] };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-500";
    if (accuracy >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-6">
      {/* Overall Accuracy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Overall Accuracy */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Overall Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getAccuracyColor(overall.overallAccuracy)}`}>
                {overall.overallAccuracy}%
              </span>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <Progress 
              value={overall.overallAccuracy} 
              className="h-2"
            />
            <p className="text-xs text-orange-600 mt-1">
              {overall.correctAttempts}/{overall.totalAttempts} correct
            </p>
          </CardContent>
        </Card>

        {/* Math Accuracy */}
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Math Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getAccuracyColor(overall.mathAccuracy)}`}>
                {overall.mathAccuracy}%
              </span>
            </div>
            <Progress 
              value={overall.mathAccuracy} 
              className="h-2"
            />
            <p className="text-xs text-orange-600 mt-1">All grades combined</p>
          </CardContent>
        </Card>

        {/* Reading Accuracy */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Reading Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-2xl font-bold ${getAccuracyColor(overall.readingAccuracy)}`}>
                {overall.readingAccuracy}%
              </span>
            </div>
            <Progress 
              value={overall.readingAccuracy} 
              className="h-2"
            />
            <p className="text-xs text-yellow-600 mt-1">All grades combined</p>
          </CardContent>
        </Card>

        {/* Current Grade Accuracy */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Grade {selectedGrade} Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const gradeData = overall.gradeBreakdown.find(g => g.grade === selectedGrade);
              const gradeAccuracy = gradeData?.accuracy || 0;
              return (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${getAccuracyColor(gradeAccuracy)}`}>
                      {gradeAccuracy}%
                    </span>
                  </div>
                  <Progress 
                    value={gradeAccuracy} 
                    className="h-2"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    {gradeData?.correct || 0}/{gradeData?.attempts || 0} correct
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* TEKS Standards Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Math TEKS Standards */}
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-orange-800 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Grade {selectedGrade} Math - TEKS Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {math.teksStandardStats && math.teksStandardStats.length > 0 ? (
              <div className="space-y-3">
                {math.teksStandardStats.slice(0, 5).map((teks, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-orange-700">{teks.teksStandard}</span>
                      <span className={`text-sm font-bold ${getAccuracyColor(teks.accuracy)}`}>
                        {Math.round(teks.accuracy)}%
                      </span>
                    </div>
                    <Progress value={teks.accuracy} className="h-2" />
                    <p className="text-xs text-orange-600">
                      {teks.correctAnswers}/{teks.totalQuestions} correct
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-orange-600 text-sm">No math practice data yet. Start practicing to see your progress!</p>
            )}
          </CardContent>
        </Card>

        {/* Grade Reading TEKS Standards */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-yellow-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Grade {selectedGrade} Reading - TEKS Standards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reading.teksStandardStats && reading.teksStandardStats.length > 0 ? (
              <div className="space-y-3">
                {reading.teksStandardStats.slice(0, 5).map((teks, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-yellow-700">{teks.teksStandard}</span>
                      <span className={`text-sm font-bold ${getAccuracyColor(teks.accuracy)}`}>
                        {Math.round(teks.accuracy)}%
                      </span>
                    </div>
                    <Progress value={teks.accuracy} className="h-2" />
                    <p className="text-xs text-yellow-600">
                      {teks.correctAnswers}/{teks.totalQuestions} correct
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-yellow-600 text-sm">No reading practice data yet. Start practicing to see your progress!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}