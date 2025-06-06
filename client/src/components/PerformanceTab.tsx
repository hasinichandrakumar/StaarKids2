import { useQuery } from "@tanstack/react-query";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { TrendingUp, Target, Brain, Clock, Award, AlertTriangle, CheckCircle2, Calculator, BookOpen } from "lucide-react";
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

  const formatLastAttempted = (date: Date | null | undefined) => {
    if (!date) return "Never";
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.ceil(diffDays / 7)} weeks ago`;
  };

  const getTeksForCategory = (grade: number, subject: string, category: string) => {
    const teksMap: Record<string, Record<string, string>> = {
      math: {
        "Number and Operations": grade === 3 ? "3.2A, 3.2B, 3.2C" : grade === 4 ? "4.2A, 4.2B, 4.2C" : "5.2A, 5.2B, 5.2C",
        "Algebraic Reasoning": grade === 3 ? "3.5A, 3.5B" : grade === 4 ? "4.5A, 4.5B" : "5.4A, 5.4B, 5.4C",
        "Geometry and Measurement": grade === 3 ? "3.6A, 3.6B, 3.6C" : grade === 4 ? "4.6A, 4.6B, 4.6C" : "5.6A, 5.6B, 5.6C",
        "Data Analysis": grade === 3 ? "3.8A, 3.8B" : grade === 4 ? "4.9A, 4.9B" : "5.9A, 5.9B, 5.9C",
        "Multi-digit Operations": grade === 3 ? "3.4A, 3.4B" : grade === 4 ? "4.4A, 4.4B" : "5.3A, 5.3B"
      },
      reading: {
        "Literary Elements": grade === 3 ? "3.8A, 3.8B, 3.8C" : grade === 4 ? "4.8A, 4.8B, 4.8C" : "5.8A, 5.8B, 5.8C",
        "Reading Comprehension": grade === 3 ? "3.6A, 3.6B, 3.6C" : grade === 4 ? "4.6A, 4.6B, 4.6C" : "5.6A, 5.6B, 5.6C",
        "Vocabulary Development": grade === 3 ? "3.3A, 3.3B" : grade === 4 ? "4.3A, 4.3B" : "5.3A, 5.3B",
        "Author's Purpose": grade === 3 ? "3.9A, 3.9B" : grade === 4 ? "4.9A, 4.9B" : "5.9A, 5.9B"
      }
    };
    return teksMap[subject]?.[category] || "Various TEKS standards";
  };

  const getDetailedAnalysis = (accuracy: number, totalQuestions: number) => {
    if (totalQuestions < 5) return "Complete more questions to get detailed analysis.";
    if (accuracy >= 85) return "Excellent mastery! You've shown strong understanding of this concept.";
    if (accuracy >= 70) return "Good progress! Consider reviewing challenging areas to reach mastery.";
    if (accuracy >= 50) return "Developing skills. Focus on this area with additional practice.";
    return "This area needs attention. Consider working with additional resources or asking for help.";
  };

  return (
    <div className="space-y-8">
      {/* Grade Overview Header */}
      <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400 rounded-xl p-6 border border-orange-300 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">Grade {grade} STAAR Performance Dashboard</h2>
        <p className="text-orange-50">Detailed analytics aligned with Texas Essential Knowledge and Skills (TEKS) standards</p>
      </div>

      {/* Comprehensive Accuracy Dashboard */}
      <AccuracyDashboard selectedGrade={grade} />

      {/* Overall Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Math Performance */}
        <Card className="border-orange-300 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Calculator className="w-6 h-6 drop-shadow-sm" />
                Mathematics
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Grade {grade} TEKS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
            {mathLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Math Stats */}
                <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                  <div className="flex justify-center mb-4">
                    <ProgressRing 
                      progress={overallMathAccuracy} 
                      color="#FF5B00" 
                      size={100} 
                    />
                  </div>
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
        <Card className="border-yellow-300 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-amber-500">
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 drop-shadow-sm" />
                Reading
              </div>
              <Badge className="bg-white/20 text-white border-white/30">
                Grade {grade} TEKS
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
            {readingLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Reading Stats */}
                <div className="text-center bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                  <div className="flex justify-center mb-4">
                    <ProgressRing 
                      progress={overallReadingAccuracy} 
                      color="#FCC201" 
                      size={100} 
                    />
                  </div>
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
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Target className="w-5 h-5" />
              Math Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mathCategoryStats.length > 0 ? (
              <div className="space-y-3">
                {mathCategoryStats.map((stat, index) => {
                  const teksStandards = getTeksForCategory(grade, 'math', stat.category);
                  const analysis = getDetailedAnalysis(stat.accuracy, stat.totalQuestions);
                  return (
                    <div key={index} className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">{stat.category}</div>
                        <Badge className={getAccuracyBadgeColor(stat.accuracy)}>
                          {Math.round(stat.accuracy)}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>TEKS Standards:</strong> {teksStandards}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                        <span>{stat.correctAnswers}/{stat.totalQuestions} correct</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatLastAttempted(stat.lastAttempted)}</span>
                      </div>
                      <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                        <strong>Analysis:</strong> {analysis}
                      </div>
                    </div>
                  );
                })}
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
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Target className="w-5 h-5" />
              Reading Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {readingCategoryStats.length > 0 ? (
              <div className="space-y-3">
                {readingCategoryStats.map((stat, index) => {
                  const teksStandards = getTeksForCategory(grade, 'reading', stat.category);
                  const analysis = getDetailedAnalysis(stat.accuracy, stat.totalQuestions);
                  return (
                    <div key={index} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-800">{stat.category}</div>
                        <Badge className={getAccuracyBadgeColor(stat.accuracy)}>
                          {Math.round(stat.accuracy)}%
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>TEKS Standards:</strong> {teksStandards}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                        <span>{stat.correctAnswers}/{stat.totalQuestions} correct</span>
                        <Clock className="w-3 h-3" />
                        <span>{formatLastAttempted(stat.lastAttempted)}</span>
                      </div>
                      <div className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                        <strong>Analysis:</strong> {analysis}
                      </div>
                    </div>
                  );
                })}
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

      {/* Detailed Learning Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Brain className="w-5 h-5" />
            Personalized Learning Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Math Recommendations */}
            <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
              <h4 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Math Focus Areas
              </h4>
              <div className="space-y-3">
                {mathCategoryStats.length > 0 ? (
                  mathCategoryStats.slice(0, 3).map((stat, index) => {
                    const recommendation = getMathRecommendation(stat.category, stat.accuracy, grade);
                    return (
                      <div key={index} className="p-3 bg-white rounded border border-orange-100">
                        <div className="font-medium text-gray-800 mb-1">{stat.category}</div>
                        <div className="text-sm text-orange-700">{recommendation}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Practice more to improve from {Math.round(stat.accuracy)}% accuracy
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Start practicing math to get personalized recommendations!
                  </div>
                )}
              </div>
            </div>

            {/* Reading Recommendations */}
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
              <h4 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Reading Focus Areas
              </h4>
              <div className="space-y-3">
                {readingCategoryStats.length > 0 ? (
                  readingCategoryStats.slice(0, 3).map((stat, index) => {
                    const recommendation = getReadingRecommendation(stat.category, stat.accuracy, grade);
                    return (
                      <div key={index} className="p-3 bg-white rounded border border-yellow-100">
                        <div className="font-medium text-gray-800 mb-1">{stat.category}</div>
                        <div className="text-sm text-yellow-700">{recommendation}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Practice more to improve from {Math.round(stat.accuracy)}% accuracy
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Start practicing reading to get personalized recommendations!
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Plan Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Target className="w-5 h-5" />
            Weekly Study Plan Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">This Week</h4>
              <div className="text-sm text-green-700 space-y-2">
                <div>• Focus on lowest-scoring categories</div>
                <div>• Practice 15 minutes daily</div>
                <div>• Review incorrect answers</div>
                <div>• Take one mock exam</div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Next Week</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <div>• Review improved areas</div>
                <div>• Increase practice time to 20 minutes</div>
                <div>• Mixed practice sessions</div>
                <div>• Complete two mock exams</div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Long Term</h4>
              <div className="text-sm text-purple-700 space-y-2">
                <div>• Maintain 80%+ accuracy</div>
                <div>• Full-length practice tests</div>
                <div>• Test day simulation</div>
                <div>• Confidence building</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  function getMathRecommendation(category: string, accuracy: number, grade: number): string {
    if (accuracy < 50) {
      return `Focus on fundamental concepts. Start with basic ${category.toLowerCase()} problems and work with visual aids.`;
    } else if (accuracy < 70) {
      return `Good foundation! Practice more word problems and multi-step questions in ${category.toLowerCase()}.`;
    } else {
      return `Strong performance! Challenge yourself with advanced ${category.toLowerCase()} problems and test strategies.`;
    }
  }

  function getReadingRecommendation(category: string, accuracy: number, grade: number): string {
    if (accuracy < 50) {
      return `Start with shorter passages and practice identifying key details in ${category.toLowerCase()}.`;
    } else if (accuracy < 70) {
      return `Build comprehension skills by reading diverse texts and discussing ${category.toLowerCase()}.`;
    } else {
      return `Excellent progress! Practice with complex passages and advanced ${category.toLowerCase()} questions.`;
    }
  }
}