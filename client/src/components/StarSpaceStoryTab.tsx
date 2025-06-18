import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Star, Users, MapPin, Zap, Trophy, Target, Book } from "lucide-react";

interface StarSpaceStoryTabProps {
  user: any;
  starPower: number;
}

const STORY_CHAPTERS = [
  {
    id: 1,
    title: "Welcome to StarSpace Academy",
    unlockStars: 0,
    description: "You've just arrived at the most amazing space academy in the galaxy! Meet Commander Nova and begin your journey.",
    story: "🚀 Welcome, Space Cadet! You've been selected to join StarSpace Academy, where young explorers learn to master the stars. Commander Nova awaits you in the training center!",
    mission: "Complete your first practice session to meet Commander Nova",
    reward: 50,
    unlocked: true
  },
  {
    id: 2,
    title: "The Crystal Caverns",
    unlockStars: 500,
    description: "Discover the mysterious Crystal Caverns where knowledge crystals grow. Each correct answer makes them glow brighter!",
    story: "✨ Deep beneath StarSpace Academy lie the magical Crystal Caverns. These crystals hold ancient knowledge and grow stronger when you answer questions correctly. The more you practice, the brighter they shine!",
    mission: "Answer 20 questions correctly to power up the crystals",
    reward: 100,
    unlocked: false
  },
  {
    id: 3,
    title: "The Comet Chase",
    unlockStars: 1000,
    description: "Join Captain Stellar on an exciting chase through the asteroid belt to catch shooting stars!",
    story: "☄️ Captain Stellar needs your help! A shower of magical comets is racing through space, each carrying precious StarPower. Use your math and reading skills to catch them before they disappear!",
    mission: "Complete 3 practice sessions in one day",
    reward: 150,
    unlocked: false
  },
  {
    id: 4,
    title: "Planet Explorer",
    unlockStars: 2000,
    description: "Explore mysterious planets where each correct answer reveals new alien friends and hidden treasures!",
    story: "🪐 You've discovered a series of uncharted planets! Each planet holds friendly aliens who speak in math problems and reading riddles. Help them by solving their puzzles to unlock their treasures!",
    mission: "Master 5 different TEKS standards",
    reward: 200,
    unlocked: false
  },
  {
    id: 5,
    title: "The Galaxy Tournament",
    unlockStars: 4000,
    description: "Compete in the ultimate space championship where young cadets from across the galaxy test their skills!",
    story: "🏆 The Galaxy Tournament has begun! Space cadets from hundreds of planets have gathered to compete in the greatest test of knowledge. Represent Earth and show them what you've learned!",
    mission: "Complete a full mock exam with 80% accuracy",
    reward: 300,
    unlocked: false
  },
  {
    id: 6,
    title: "Commander of the Stars",
    unlockStars: 8000,
    description: "Achieve the highest honor and become a commander, leading other young explorers on their space adventures!",
    story: "⭐ Congratulations! Your dedication and skills have earned you the title of Star Commander. Now you get to help guide other young explorers and share your knowledge across the galaxy!",
    mission: "Maintain 90% accuracy for one week",
    reward: 500,
    unlocked: false
  }
];

const SPACE_FRIENDS = [
  { name: "Zara the Alien", unlockStars: 100, description: "A friendly purple alien who loves math puzzles", emoji: "👽" },
  { name: "Rocket the Robot", unlockStars: 300, description: "A helpful robot who assists with reading comprehension", emoji: "🤖" },
  { name: "Stella Stardust", unlockStars: 600, description: "A magical space fairy who grants bonus StarPower", emoji: "🧚‍♀️" },
  { name: "Captain Cosmos", unlockStars: 1200, description: "A brave space captain who teaches test-taking strategies", emoji: "👨‍🚀" },
  { name: "Luna the Space Cat", unlockStars: 2500, description: "A curious space cat who finds hidden treasures", emoji: "🐱‍🚀" }
];

const SPACE_ACHIEVEMENTS = [
  { name: "Asteroid Miner", description: "Find 10 hidden knowledge gems", emoji: "💎", unlockStars: 200 },
  { name: "Comet Rider", description: "Complete 5 speed challenges", emoji: "☄️", unlockStars: 400 },
  { name: "Planet Discoverer", description: "Explore all 8 knowledge planets", emoji: "🌍", unlockStars: 800 },
  { name: "Star Collector", description: "Gather 1000 StarPower in one week", emoji: "⭐", unlockStars: 1500 },
  { name: "Galaxy Guardian", description: "Help 3 space friends with their missions", emoji: "🛡️", unlockStars: 3000 }
];

export default function StarSpaceStoryTab({ user, starPower }: StarSpaceStoryTabProps) {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [discoveredFriends, setDiscoveredFriends] = useState<string[]>([]);
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);

  // Unlock logic based on StarPower
  const unlockedChapters = STORY_CHAPTERS.filter(chapter => starPower >= chapter.unlockStars);
  const unlockedFriends = SPACE_FRIENDS.filter(friend => starPower >= friend.unlockStars);
  const unlockedAchievements = SPACE_ACHIEVEMENTS.filter(achievement => starPower >= achievement.unlockStars);

  const handleStartMission = (chapterId: number) => {
    // This would integrate with the main practice system
    console.log(`Starting mission for chapter ${chapterId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with current progress */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Rocket className="w-8 h-8" />
                StarSpace Adventure
              </CardTitle>
              <p className="text-blue-100">Your epic journey through the cosmos of learning!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{starPower.toLocaleString()}</div>
              <div className="text-blue-200">StarPower Collected</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="story" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="story" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            Story
          </TabsTrigger>
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Space Friends
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Galaxy Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STORY_CHAPTERS.map((chapter) => {
              const isUnlocked = starPower >= chapter.unlockStars;
              const isCompleted = completedMissions.includes(chapter.id);
              
              return (
                <Card 
                  key={chapter.id} 
                  className={`relative overflow-hidden transition-all duration-300 ${
                    isUnlocked 
                      ? isCompleted 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 hover:shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={isUnlocked ? isCompleted ? "default" : "secondary" : "outline"}>
                        Chapter {chapter.id}
                      </Badge>
                      {isCompleted && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                    </div>
                    <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    <p className="text-sm text-gray-600">{chapter.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="text-sm">{chapter.story}</p>
                    </div>
                    
                    {isUnlocked && !isCompleted && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">Mission:</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">{chapter.mission}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">+{chapter.reward} StarPower</span>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleStartMission(chapter.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start Mission
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {!isUnlocked && (
                      <div className="text-center py-4">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            Unlock at {chapter.unlockStars.toLocaleString()} StarPower
                          </span>
                        </div>
                        <Progress 
                          value={(starPower / chapter.unlockStars) * 100} 
                          className="mt-2 h-2"
                        />
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="text-center py-2">
                        <Badge className="bg-green-500 text-white">
                          Mission Complete! ⭐
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="friends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPACE_FRIENDS.map((friend) => {
              const isUnlocked = starPower >= friend.unlockStars;
              
              return (
                <Card 
                  key={friend.name} 
                  className={`transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-2">{friend.emoji}</div>
                    <CardTitle className="text-xl">{friend.name}</CardTitle>
                    <p className="text-sm text-gray-600">{friend.description}</p>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    {isUnlocked ? (
                      <Badge className="bg-green-500 text-white">
                        Friend Discovered! 🎉
                      </Badge>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            Unlock at {friend.unlockStars.toLocaleString()} StarPower
                          </span>
                        </div>
                        <Progress 
                          value={(starPower / friend.unlockStars) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPACE_ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = starPower >= achievement.unlockStars;
              
              return (
                <Card 
                  key={achievement.name} 
                  className={`transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{achievement.emoji}</div>
                      <div>
                        <CardTitle className="text-lg">{achievement.name}</CardTitle>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {isUnlocked ? (
                      <Badge className="bg-yellow-500 text-white">
                        Achievement Unlocked! 🏆
                      </Badge>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">
                            Unlock at {achievement.unlockStars.toLocaleString()} StarPower
                          </span>
                        </div>
                        <Progress 
                          value={(starPower / achievement.unlockStars) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white min-h-96">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                🌌 Galaxy Map 🌌
              </CardTitle>
              <p className="text-center text-purple-200">
                Your journey through the cosmos of learning
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 overflow-hidden rounded-lg">
                {/* Animated star background */}
                <div className="absolute inset-0">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Journey path */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🚀</div>
                    <div className="text-xl font-bold">Current Location</div>
                    <div className="text-lg">
                      Chapter {Math.max(1, unlockedChapters.length)}
                    </div>
                    <Badge className="bg-white text-purple-900">
                      {starPower.toLocaleString()} StarPower Collected
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}