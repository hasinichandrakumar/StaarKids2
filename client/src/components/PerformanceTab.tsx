import { useQuery } from "@tanstack/react-query";
import { ChartBarIcon, BookOpenIcon, CalculatorIcon } from "@heroicons/react/24/outline";
import { TrendingUp, Target, Brain, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PerformanceTabProps {
  grade: number;
}

interface CategoryStat {
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  lastAttempted: Date | null;
}

interface UserStats {
  totalAttempts: number;
  correctAttempts: number;
  averageScore: number;
  improvementTrend: number;
  categoryStats: CategoryStat[];
}

export default function PerformanceTab({ grade }: PerformanceTabProps) {
  const { data: mathStats, isLoading: mathLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats", grade, "math"],
  });

  const { data: readingStats, isLoading: readingLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats", grade, "reading"],
  });

  // Extract category-specific performance from authentic user data
  const mathCategoryStats = mathStats?.categoryStats || [];
  const readingCategoryStats = readingStats?.categoryStats || [];

  // Identify weak skills based on actual performance data (accuracy < 70%)
  const weakMathSkills = mathCategoryStats
    .filter(stat => stat.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const weakReadingSkills = readingCategoryStats
    .filter(stat => stat.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "border-green-200 bg-green-50 text-green-700";
    if (accuracy >= 70) return "border-yellow-200 bg-yellow-50 text-yellow-700";
    return "border-red-200 bg-red-50 text-red-700";
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-100 text-green-700";
    if (accuracy >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const formatLastAttempted = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.ceil(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="space-y-8">
      {/* Overall Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <CalculatorIcon className="w-5 h-5" />
              Math Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mathLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {mathStats ? Math.round(mathStats.averageScore) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Average Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-700">
                      {mathStats?.totalAttempts || 0}
                    </p>
                    <p className="text-sm text-gray-500">Questions Answered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 mr-1" />
                      {mathStats ? `+${Math.round(mathStats.improvementTrend || 0)}` : "+0"}%
                    </p>
                    <p className="text-sm text-gray-500">Trend</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reading Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <BookOpenIcon className="w-5 h-5" />
              Reading Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {readingLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {readingStats ? Math.round(readingStats.averageScore) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Average Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-700">
                      {readingStats?.totalAttempts || 0}
                    </p>
                    <p className="text-sm text-gray-500">Questions Answered</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 mr-1" />
                      {readingStats ? `+${Math.round(readingStats.improvementTrend || 0)}` : "+0"}%
                    </p>
                    <p className="text-sm text-gray-500">Trend</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Target className="w-5 h-5" />
              Math Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mathCategoryStats.length > 0 ? (
              <div className="space-y-3">
                {mathCategoryStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{stat.category}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{stat.correctAnswers}/{stat.totalQuestions} correct</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatLastAttempted(stat.lastAttempted)}</span>
                      </div>
                    </div>
                    <Badge className={getAccuracyBadgeColor(stat.accuracy)}>
                      {stat.accuracy}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No math practice data yet</p>
                <p className="text-sm">Start practicing to see detailed category breakdown!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reading Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Target className="w-5 h-5" />
              Reading Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {readingCategoryStats.length > 0 ? (
              <div className="space-y-3">
                {readingCategoryStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{stat.category}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{stat.correctAnswers}/{stat.totalQuestions} correct</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatLastAttempted(stat.lastAttempted)}</span>
                      </div>
                    </div>
                    <Badge className={getAccuracyBadgeColor(stat.accuracy)}>
                      {stat.accuracy}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No reading practice data yet</p>
                <p className="text-sm">Start practicing to see detailed category breakdown!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Areas Needing Improvement */}
      {(weakMathSkills.length > 0 || weakReadingSkills.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Target className="w-5 h-5" />
              Areas Needing Improvement (Below 70% Accuracy)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Math Weak Areas */}
              <div>
                <h4 className="text-lg font-semibold text-blue-700 mb-3">Math</h4>
                {weakMathSkills.length > 0 ? (
                  <div className="space-y-3">
                    {weakMathSkills.map((skill, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${getAccuracyColor(skill.accuracy)}`}>
                        <div>
                          <span className="font-medium text-gray-700">{skill.category}</span>
                          <div className="text-xs text-gray-500">{skill.correctAnswers}/{skill.totalQuestions} correct</div>
                        </div>
                        <Badge className={getAccuracyBadgeColor(skill.accuracy)}>
                          {skill.accuracy}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-green-600 bg-green-50 rounded-lg">
                    Great job! All practiced areas are above 70% accuracy.
                  </div>
                )}
              </div>

              {/* Reading Weak Areas */}
              <div>
                <h4 className="text-lg font-semibold text-purple-700 mb-3">Reading</h4>
                {weakReadingSkills.length > 0 ? (
                  <div className="space-y-3">
                    {weakReadingSkills.map((skill, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${getAccuracyColor(skill.accuracy)}`}>
                        <div>
                          <span className="font-medium text-gray-700">{skill.category}</span>
                          <div className="text-xs text-gray-500">{skill.correctAnswers}/{skill.totalQuestions} correct</div>
                        </div>
                        <Badge className={getAccuracyBadgeColor(skill.accuracy)}>
                          {skill.accuracy}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-green-600 bg-green-50 rounded-lg">
                    Great job! All practiced areas are above 70% accuracy.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}