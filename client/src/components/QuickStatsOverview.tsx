import { useQuery } from "@tanstack/react-query";
import { Trophy, Target, Zap, TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuickStatsOverviewProps {
  grade: number;
}

export default function QuickStatsOverview({ grade }: QuickStatsOverviewProps) {
  const { data: overallStats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: starPowerStats } = useQuery({
    queryKey: ["/api/star-power/stats"],
  });

  const getAchievementLevel = (starPower: number) => {
    if (starPower >= 1000) return { title: "STAAR Champion", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50" };
    if (starPower >= 500) return { title: "Rising Star", icon: Award, color: "text-purple-500", bg: "bg-purple-50" };
    if (starPower >= 200) return { title: "Quick Learner", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" };
    return { title: "Getting Started", icon: Target, color: "text-green-500", bg: "bg-green-50" };
  };

  const getDailyGoalProgress = () => {
    const dailyStarPower = starPowerStats?.dailyStarPower || 0;
    const dailyGoal = 50; // 50 StarPower points per day
    return Math.min((dailyStarPower / dailyGoal) * 100, 100);
  };

  const achievement = getAchievementLevel(starPowerStats?.allTimeStarPower || 0);
  const AchievementIcon = achievement.icon;
  const dailyProgress = getDailyGoalProgress();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Overall Accuracy */}
      <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(overallStats?.overallAccuracy || 0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.round(overallStats?.overallAccuracy || 0)}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Level */}
      <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achievement</p>
              <p className="text-lg font-bold text-gray-900">{achievement.title}</p>
            </div>
            <div className={`w-12 h-12 ${achievement.bg} rounded-xl flex items-center justify-center`}>
              <AchievementIcon className={`w-6 h-6 ${achievement.color}`} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              {(starPowerStats?.allTimeStarPower || 0).toLocaleString()} StarPower earned
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal */}
      <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Daily Goal</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(dailyProgress)}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${dailyProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Practice Sessions */}
      <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats?.totalAttempts || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              {overallStats?.correctAttempts || 0} correct answers
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}