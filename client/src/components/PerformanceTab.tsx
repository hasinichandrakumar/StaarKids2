import { useQuery } from "@tanstack/react-query";
import { ChartBarIcon, TrendingUpIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";

interface PerformanceTabProps {
  grade: number;
}

export default function PerformanceTab({ grade }: PerformanceTabProps) {
  const { data: mathStats } = useQuery({
    queryKey: ["/api/stats", grade, "math"],
  });

  const { data: readingStats } = useQuery({
    queryKey: ["/api/stats", grade, "reading"],
  });

  const mockWeakSkills = {
    math: [
      { name: "Fractions & Decimals", accuracy: 45 },
      { name: "Word Problems", accuracy: 62 },
    ],
    reading: [
      { name: "Inferences & Conclusions", accuracy: 52 },
      { name: "Author's Purpose", accuracy: 68 },
    ],
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 70) return "border-yellow-200 bg-yellow-50 text-yellow-700";
    return "border-red-200 bg-red-50 text-red-700";
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 70) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Math Performance Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Math Performance Trend</h3>
            {/* Placeholder for chart */}
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Performance Chart</p>
                <p className="text-sm">Coming Soon</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {mathStats ? Math.round(mathStats.averageScore) : 0}%
                </p>
                <p className="text-sm text-gray-500">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 mr-1" />
                  {mathStats ? `+${Math.round(mathStats.improvementTrend || 0)}` : "+0"}%
                </p>
                <p className="text-sm text-gray-500">Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Performance Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Reading Performance Trend</h3>
            {/* Placeholder for chart */}
            <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                <p>Performance Chart</p>
                <p className="text-sm">Coming Soon</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {readingStats ? Math.round(readingStats.averageScore) : 0}%
                </p>
                <p className="text-sm text-gray-500">Average Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 mr-1" />
                  {readingStats ? `+${Math.round(readingStats.improvementTrend || 0)}` : "+0"}%
                </p>
                <p className="text-sm text-gray-500">Improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-6">Skills That Need Attention</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Math Skills */}
            <div>
              <h4 className="text-lg font-semibold text-primary mb-3">Math</h4>
              <div className="space-y-3">
                {mockWeakSkills.math.map((skill, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${getAccuracyColor(skill.accuracy)}`}>
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${getAccuracyBadgeColor(skill.accuracy)}`}>
                      {skill.accuracy}% accuracy
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Skills */}
            <div>
              <h4 className="text-lg font-semibold text-secondary mb-3">Reading</h4>
              <div className="space-y-3">
                {mockWeakSkills.reading.map((skill, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${getAccuracyColor(skill.accuracy)}`}>
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${getAccuracyBadgeColor(skill.accuracy)}`}>
                      {skill.accuracy}% accuracy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
