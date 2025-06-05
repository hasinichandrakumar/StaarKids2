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
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Today's Starpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-orange-500 fill-current" />
            <span className="text-2xl font-bold text-orange-800">{stats.dailyStarPower}</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">Starpower earned today</p>
        </CardContent>
      </Card>

      {/* Weekly Starpower */}
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-700 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            This Week's Starpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold text-yellow-800">{stats.weeklyStarPower}</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1">Starpower earned this week</p>
        </CardContent>
      </Card>

      {/* All-Time Starpower */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-amber-700 flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            All Time Starpower
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-amber-500 fill-current" />
            <span className="text-2xl font-bold text-amber-800">{stats.allTimeStarPower.toLocaleString()}</span>
          </div>
          <p className="text-xs text-amber-600 mt-1">Total starpower earned</p>
        </CardContent>
      </Card>
    </div>
  );
}