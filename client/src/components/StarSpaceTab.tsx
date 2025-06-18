import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Rocket, Trophy, Target, Zap, Crown, Medal, Award } from "lucide-react";

interface StarSpaceTabProps {
  user: any;
  onOpenAvatarModal: () => void;
}

const RANK_LEVELS = [
  { name: "Cadet", minStars: 0, maxStars: 499, color: "#64748B", icon: "🌟" },
  { name: "Explorer", minStars: 500, maxStars: 999, color: "#3B82F6", icon: "🚀" },
  { name: "Navigator", minStars: 1000, maxStars: 1999, color: "#8B5CF6", icon: "🌙" },
  { name: "Captain", minStars: 2000, maxStars: 3999, color: "#EC4899", icon: "🛸" },
  { name: "Commander", minStars: 4000, maxStars: 7999, color: "#F59E0B", icon: "⭐" },
  { name: "Admiral", minStars: 8000, maxStars: 15999, color: "#EF4444", icon: "👨‍🚀" },
  { name: "Galaxy Master", minStars: 16000, maxStars: 31999, color: "#10B981", icon: "🌌" },
  { name: "Cosmic Legend", minStars: 32000, maxStars: Infinity, color: "#A855F7", icon: "☄️" }
];

const ACHIEVEMENTS = [
  { id: 1, name: "First Steps", description: "Complete your first practice session", icon: "🎯", starReward: 50, unlocked: true },
  { id: 2, name: "Math Whiz", description: "Score 80% or higher on 10 math questions", icon: "🧮", starReward: 100, unlocked: true },
  { id: 3, name: "Reading Champion", description: "Complete 5 reading passages", icon: "📚", starReward: 150, unlocked: false },
  { id: 4, name: "Perfect Score", description: "Get 100% on any practice session", icon: "💯", starReward: 200, unlocked: false },
  { id: 5, name: "Consistent Learner", description: "Practice for 7 days in a row", icon: "🔥", starReward: 300, unlocked: false },
  { id: 6, name: "Mock Master", description: "Complete your first full mock exam", icon: "🏆", starReward: 250, unlocked: false },
  { id: 7, name: "TEKS Explorer", description: "Practice questions from 10 different TEKS standards", icon: "🗺️", starReward: 400, unlocked: false },
  { id: 8, name: "Speed Demon", description: "Answer 20 questions in under 10 minutes", icon: "⚡", starReward: 350, unlocked: false }
];

const DAILY_MISSIONS = [
  { id: 1, name: "Morning Practice", description: "Complete 5 math questions", progress: 3, target: 5, starReward: 25, completed: false },
  { id: 2, name: "Reading Time", description: "Read 1 passage and answer questions", progress: 0, target: 1, starReward: 30, completed: false },
  { id: 3, name: "TEKS Mastery", description: "Practice 3 different TEKS standards", progress: 1, target: 3, starReward: 40, completed: false }
];

export default function StarSpaceTab({ user, onOpenAvatarModal }: StarSpaceTabProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Get user's current rank
  const currentStars = user?.starPower || 0;
  const currentRank = RANK_LEVELS.find(rank => 
    currentStars >= rank.minStars && currentStars <= rank.maxStars
  ) || RANK_LEVELS[0];
  
  const nextRank = RANK_LEVELS[RANK_LEVELS.indexOf(currentRank) + 1];
  const progressToNextRank = nextRank ? 
    ((currentStars - currentRank.minStars) / (nextRank.minStars - currentRank.minStars)) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg"
            style={{ backgroundColor: currentRank.color }}
          >
            {currentRank.icon}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome to StarSpace!</h2>
            <p className="text-gray-600">Your cosmic journey through STAAR mastery</p>
          </div>
        </div>

        {/* Current Rank Display */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{currentRank.name}</h3>
                <p className="text-purple-100">Current Rank</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentStars.toLocaleString()}</div>
                <p className="text-purple-100">StarPower</p>
              </div>
            </div>
            
            {nextRank && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextRank.name}</span>
                  <span>{nextRank.minStars - currentStars} stars needed</span>
                </div>
                <Progress value={progressToNextRank} className="h-3 bg-purple-300" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="missions">Daily Missions</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Rank Progression */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span>Rank Progression</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {RANK_LEVELS.map((rank, index) => (
                  <div
                    key={rank.name}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      currentStars >= rank.minStars
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{rank.icon}</div>
                    <h4 className="font-semibold text-sm">{rank.name}</h4>
                    <p className="text-xs text-gray-600">
                      {rank.minStars.toLocaleString()}+ stars
                    </p>
                    {currentStars >= rank.minStars && (
                      <Badge className="mt-2 bg-green-500">Unlocked</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent StarPower Gains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Recent StarPower Gains</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      +15
                    </div>
                    <div>
                      <p className="font-medium">Completed Math Practice</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      +25
                    </div>
                    <div>
                      <p className="font-medium">Reading Comprehension</p>
                      <p className="text-sm text-gray-600">Yesterday</p>
                    </div>
                  </div>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      +50
                    </div>
                    <div>
                      <p className="font-medium">Achievement Unlocked</p>
                      <p className="text-sm text-gray-600">2 days ago</p>
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={achievement.unlocked ? "default" : "secondary"}
                            className={achievement.unlocked ? "bg-green-500" : ""}
                          >
                            {achievement.unlocked ? "Unlocked" : "Locked"}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">+{achievement.starReward}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Daily Missions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAILY_MISSIONS.map((mission) => (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-lg border-2 ${
                      mission.completed
                        ? "border-green-400 bg-green-50"
                        : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{mission.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">+{mission.starReward}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{mission.progress}/{mission.target}</span>
                      </div>
                      <Progress 
                        value={(mission.progress / mission.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    {mission.completed && (
                      <Badge className="mt-3 bg-green-500">Completed</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-purple-500" />
                <span>Customize Your Avatar</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-6xl">
                  🚀
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Space Explorer</h3>
                  <p className="text-gray-600">Your current avatar</p>
                </div>
              </div>

              <Button 
                onClick={onOpenAvatarModal}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Customize Avatar
              </Button>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-700">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">Pro Tip:</span>
                </div>
                <p className="text-sm text-yellow-600 mt-1">
                  Unlock new avatar options by earning StarPower and completing achievements!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}