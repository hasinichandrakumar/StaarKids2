import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Clock, Trophy } from "lucide-react";

interface StarPowerStats {
  dailyStarPower: number;
  weeklyStarPower: number;
  allTimeStarPower: number;
}

export default function StarPowerDashboard() {
  const { data: starPowerStats, isLoading } = useQuery<StarPowerStats>({
    queryKey: ["/api/star-power/stats"],
    staleTime: 30 * 1000, // Cache for 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = starPowerStats || { dailyStarPower: 0, weeklyStarPower: 0, allTimeStarPower: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Daily Star Power */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Today's Starpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-blue-500 fill-current" />
            <span className="text-2xl font-bold text-blue-800">{stats.dailyStarPower}</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">Starpower earned today</p>
        </CardContent>
      </Card>

      {/* Weekly Starpower */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            This Week's Starpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-purple-500 fill-current" />
            <span className="text-2xl font-bold text-purple-800">{stats.weeklyStarPower}</span>
          </div>
          <p className="text-xs text-purple-600 mt-1">Starpower earned this week</p>
        </CardContent>
      </Card>

      {/* All-Time Starpower */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-indigo-700 flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            All Time Starpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-indigo-500 fill-current" />
            <span className="text-2xl font-bold text-indigo-800">{stats.allTimeStarPower.toLocaleString()}</span>
          </div>
          <p className="text-xs text-indigo-600 mt-1">Total starpower earned</p>
        </CardContent>
      </Card>
    </div>
  );
}