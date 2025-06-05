import { useQuery } from "@tanstack/react-query";
import { ChartBarIcon, BookOpenIcon, CalculatorIcon } from "@heroicons/react/24/outline";
import { TrendingUp, Target, Brain, Clock, Award, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressRing from "@/components/ProgressRing";
import AccuracyDashboard from "@/components/AccuracyDashboard";

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

// TEKS-aligned categories for each grade
const GRADE_TEKS_CATEGORIES = {
  3: {
    math: ["Number and Operations", "Algebraic Reasoning", "Geometry and Measurement", "Data Analysis"],
    reading: ["Reading Comprehension", "Literary Elements", "Author's Purpose", "Genre Features"]
  },
  4: {
    math: ["Number and Operations", "Algebraic Reasoning", "Geometry and Measurement", "Data Analysis"],
    reading: ["Reading Comprehension", "Literary Elements", "Author's Purpose", "Genre Features"]
  },
  5: {
    math: ["Number and Operations", "Algebraic Reasoning", "Geometry and Measurement", "Data Analysis"],
    reading: ["Reading Comprehension", "Literary Elements", "Author's Purpose", "Genre Features"]
  }
};

export default function PerformanceTab({ grade }: PerformanceTabProps) {
  const { data: mathStats, isLoading: mathLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats", grade, "math"],
  });

  const { data: readingStats, isLoading: readingLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats", grade, "reading"],
  });

  // Get TEKS categories for current grade
  const gradeCategories = GRADE_TEKS_CATEGORIES[grade as keyof typeof GRADE_TEKS_CATEGORIES];
  
  // Extract category-specific performance from authentic user data
  const mathCategoryStats = mathStats?.categoryStats || [];
  const readingCategoryStats = readingStats?.categoryStats || [];

  // Calculate overall subject performance
  const overallMathAccuracy = mathStats?.averageScore || 0;
  const overallReadingAccuracy = readingStats?.averageScore || 0;
  
  // Identify mastery levels for each TEKS category
  const getMasteryLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: "Mastered", color: "text-green-600", bgColor: "bg-green-100" };
    if (accuracy >= 80) return { level: "Proficient", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (accuracy >= 70) return { level: "Developing", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { level: "Needs Focus", color: "text-red-600", bgColor: "bg-red-100" };
  };

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
      {/* Grade Overview Header */}
      <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl p-6 border border-red-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Grade {grade} STAAR Performance Dashboard</h2>
        <p className="text-gray-600">Detailed analytics aligned with Texas Essential Knowledge and Skills (TEKS) standards</p>
      </div>

      {/* Comprehensive Accuracy Dashboard */}
      <AccuracyDashboard selectedGrade={grade} />

      {/* Overall Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Performance */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center justify-between text-red-800">
              <div className="flex items-center gap-2">
                <CalculatorIcon className="w-6 h-6" />
                Mathematics
              </div>
              <Badge className="bg-red-100 text-red-700">
                Grade {grade} TEKS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {mathLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Math Stats */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <ProgressRing 
                      progress={overallMathAccuracy} 
                      color="#DC2626" 
                      size={100} 
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-red-600 mb-1">
                    {Math.round(overallMathAccuracy)}%
                  </h3>
                  <p className="text-gray-600">Overall Math Performance</p>
                </div>
                
                {/* Math Category Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    TEKS Category Performance
                  </h4>
                  {gradeCategories.math.map((category) => {
                    const categoryData = mathCategoryStats.find(stat => stat.category === category);
                    const accuracy = categoryData?.accuracy || 0;
                    const mastery = getMasteryLevel(accuracy);
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{category}</p>
                          <p className="text-xs text-gray-500">
                            {categoryData?.totalQuestions || 0} questions • Last: {formatLastAttempted(categoryData?.lastAttempted)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${mastery.bgColor} ${mastery.color} text-xs`}>
                            {mastery.level}
                          </Badge>
                          <span className="font-bold text-sm w-12 text-right">
                            {Math.round(accuracy)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reading Performance */}
        <Card className="border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="flex items-center justify-between text-yellow-800">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6" />
                Reading
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">
                Grade {grade} TEKS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {readingLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Reading Stats */}
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <ProgressRing 
                      progress={overallReadingAccuracy} 
                      color="#CA8A04" 
                      size={100} 
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-600 mb-1">
                    {Math.round(overallReadingAccuracy)}%
                  </h3>
                  <p className="text-gray-600">Overall Reading Performance</p>
                </div>
                
                {/* Reading Category Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    TEKS Category Performance
                  </h4>
                  {gradeCategories.reading.map((category) => {
                    const categoryData = readingCategoryStats.find(stat => stat.category === category);
                    const accuracy = categoryData?.accuracy || 0;
                    const mastery = getMasteryLevel(accuracy);
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{category}</p>
                          <p className="text-xs text-gray-500">
                            {categoryData?.totalQuestions || 0} questions • Last: {formatLastAttempted(categoryData?.lastAttempted)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${mastery.bgColor} ${mastery.color} text-xs`}>
                            {mastery.level}
                          </Badge>
                          <span className="font-bold text-sm w-12 text-right">
                            {Math.round(accuracy)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
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