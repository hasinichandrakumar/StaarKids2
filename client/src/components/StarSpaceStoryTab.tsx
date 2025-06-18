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
    title: "The Mysterious Letter",
    unlockStars: 0,
    description: "Your adventure begins with a strange glowing letter that arrived at your door!",
    story: "🌟 One ordinary morning, a shimmering letter appears on your doorstep. Written in starlight, it reads: 'Brave young mind, the galaxy needs you! Report to StarSpace Academy immediately - Commander Nova.' As you touch the letter, it transforms into a rocket ship that whisks you away to the stars!",
    mission: "Complete 10 practice questions with 80% accuracy to prove you're ready",
    reward: 50,
    planet: "Academy Station",
    unlocked: true
  },
  {
    id: 2,
    title: "Commander Nova's Secret",
    unlockStars: 500,
    description: "Commander Nova reveals why you were chosen and shows you the Academy's greatest secret!",
    story: "✨ Commander Nova leads you through glowing corridors to a hidden chamber. 'Long ago,' she whispers, 'evil Shadow Doubts attacked our galaxy, stealing confidence from young learners. Only by mastering knowledge can we restore the Crystal of Learning!' She points to a dimmed crystal that once lit the entire galaxy with wisdom.",
    mission: "Answer 25 questions correctly with 85% accuracy to begin restoring the crystal",
    reward: 100,
    planet: "Academy Station",
    unlocked: false
  },
  {
    id: 3,
    title: "The First Clue",
    unlockStars: 1000,
    description: "Your first mission leads to Planet Lumina where ancient star maps hold crucial information!",
    story: "🗺️ The Academy's ancient computer reveals the first clue: 'Seek the Star Maps of Lumina, where crystals sing with knowledge.' Captain Stellar volunteers to pilot your ship through the dangerous Asteroid Belt. 'Hold tight!' she grins, 'We have meteors to dodge and mysteries to solve!'",
    mission: "Complete 40 questions in under 20 minutes with 80% accuracy to reach Planet Lumina safely",
    reward: 150,
    planet: "En Route to Lumina",
    unlocked: false
  },
  {
    id: 4,
    title: "The Crystal Singers of Lumina",
    unlockStars: 1800,
    description: "On Planet Lumina, you discover the crystal caves and meet their musical guardians!",
    story: "💎 You land on Planet Lumina and hear beautiful singing echoing from crystal caves. The Luminoids, beings made of pure crystal, greet you with musical tones. 'The Shadow Doubts silenced our knowledge songs,' they chime sadly. 'Help us remember the ancient melodies by solving the riddles written in the crystal walls!'",
    mission: "Master 5 different TEKS standards with 90% accuracy each to restore their songs",
    reward: 200,
    planet: "Planet Lumina",
    unlocked: false
  },
  {
    id: 5,
    title: "The Broken Star Map",
    unlockStars: 2500,
    description: "The ancient star map is damaged! Use your skills to piece together the cosmic puzzle.",
    story: "🗺️ Inside the crystal caves, you find the legendary Star Map, but it's shattered into pieces! Each correct answer helps reconstruct a piece of the map. The Luminoids gasp with excitement as sections begin to glow, revealing the path to the next clue about defeating the Shadow Doubts.",
    mission: "Achieve 90% accuracy on 50 consecutive questions to rebuild the map",
    reward: 300,
    planet: "Planet Lumina",
    unlocked: false
  },
  {
    id: 6,
    title: "The Space Whale's Warning",
    unlockStars: 3500,
    description: "Giant space whales appear with an urgent message about the Shadow Doubts!",
    story: "🐋 As you leave Lumina, enormous space whales surround your ship! Their leader, Elder Cosmos, speaks telepathically: 'Young hero, the Shadow Doubts grow stronger! They have captured our song-keeper, Melody. Only by mastering patterns can you free her and learn the secret of the Crystal of Learning's location.'",
    mission: "Complete 20 advanced pattern-based problems with perfect accuracy",
    reward: 350,
    planet: "Deep Space",
    unlocked: false
  },
  {
    id: 7,
    title: "Journey to the Time Rift",
    unlockStars: 4800,
    description: "The space whales guide you to a mysterious rift in time where past and future collide!",
    story: "⏰ Following the whales' directions, you discover a swirling time rift! Professor Chronos, guardian of time itself, emerges from the portal. 'The Shadow Doubts are trying to erase educational history!' he warns. 'Quick! We must gather knowledge from different time periods to strengthen our defenses!'",
    mission: "Complete 8 challenging historical reading passages with 95% comprehension",
    reward: 400,
    planet: "Time Rift Station",
    unlocked: false
  },
  {
    id: 8,
    title: "The Gravity Prison",
    unlockStars: 6200,
    description: "You discover that Melody the song-keeper is trapped in a gravity prison on Planet Bounce!",
    story: "🏃‍♂️ Professor Chronos reveals that Melody is imprisoned on Planet Bounce, where gravity itself has been weaponized by the Shadow Doubts! 'The only way to break the gravity locks,' he explains, 'is to solve geometric puzzles that control the planet's physics. Be careful - one wrong calculation and you'll float away forever!'",
    mission: "Solve 25 advanced geometry problems in under 30 minutes with 85% accuracy",
    reward: 500,
    planet: "Planet Bounce",
    unlocked: false
  },
  {
    id: 9,
    title: "Melody's Story Library",
    unlockStars: 8000,
    description: "Free Melody, who reveals the location of the legendary Story Library!",
    story: "📚 You successfully free Melody! Grateful, she sings a beautiful note that opens a portal to the hidden Story Library. 'In this magical place,' Melody explains, 'stories hold the power to defeat Shadow Doubts. But first, you must prove your mastery of reading comprehension. The books will test you, but if you succeed, they'll reveal the Crystal of Learning's secret!'",
    mission: "Achieve perfect scores on 10 complex reading comprehension passages",
    reward: 600,
    planet: "Story Library Dimension",
    unlocked: false
  },
  {
    id: 10,
    title: "The Shadow Doubts' Attack",
    unlockStars: 10500,
    description: "The Shadow Doubts discover your location and launch their first major attack!",
    story: "🌑 Dark clouds suddenly fill the library as the Shadow Doubts appear! Their leader, Lord Confusion, sneers: 'So, you're the one trying to restore confidence to young learners! Let's see how you handle my Number Vanishing Curse!' All the numbers in the library begin disappearing. You must solve complex problems quickly before all mathematical knowledge is lost forever!",
    mission: "Solve 30 multi-step word problems in 25 minutes with 90% accuracy",
    reward: 700,
    planet: "Story Library Under Attack",
    unlocked: false
  },
  {
    id: 11,
    title: "Alliance of the Cosmic Circus",
    unlockStars: 13000,
    description: "The legendary Cosmic Circus offers to help in your fight against the Shadow Doubts!",
    story: "🎪 After repelling the attack, Ringmaster Cosmos appears with his traveling circus! 'We've been hiding from the Shadow Doubts for years,' he explains. 'But your courage inspires us! Our performers know ancient mathematical secrets. Learn from our acrobats and you'll gain the skills needed to find the Crystal of Learning!'",
    mission: "Complete 100 mixed practice problems with 92% overall accuracy",
    reward: 800,
    planet: "Mobile Circus Ship",
    unlocked: false
  },
  {
    id: 12,
    title: "The Storm Clue",
    unlockStars: 16500,
    description: "Weather Wizard Nimbus holds a crucial clue hidden in the patterns of cosmic storms!",
    story: "⛈️ The circus leads you to Cloud City, where Weather Wizard Nimbus greets you urgently. 'The Shadow Doubts have been creating chaos storms to hide their movements!' she reveals. 'But I've discovered their pattern! Use data analysis to decode the storm sequences and reveal the location of their secret base!'",
    mission: "Master 15 advanced data analysis problems with perfect accuracy",
    reward: 900,
    planet: "Cloud City",
    unlocked: false
  },
  {
    id: 13,
    title: "The Pirate's Secret Chart",
    unlockStars: 20000,
    description: "Space pirates reveal they've been guarding a secret treasure map all along!",
    story: "🏴‍☠️ Following the storm clues, you reach Treasure Cove where Captain Starbones awaits. 'Arrr! We've been protecting this secret chart from the Shadow Doubts for centuries!' She unfolds an ancient map. 'It shows the coordinates of the Crystal of Learning's hiding place, but the coordinates are in a mathematical code only the worthy can solve!'",
    mission: "Solve 35 complex coordinate geometry problems in 40 minutes with 88% accuracy",
    reward: 1000,
    planet: "Treasure Cove",
    unlocked: false
  },
  {
    id: 14,
    title: "Building the Crystal Detector",
    unlockStars: 24000,
    description: "The galaxy's greatest inventors help you build a device to locate the Crystal of Learning!",
    story: "⚙️ At Innovation Hub, brilliant inventors have been working on a Crystal Detector! 'The device is almost complete,' explains Chief Engineer Bolt, 'but we need someone with exceptional mathematical skills to calibrate the final calculations. One mistake and the detector could lead us into a Shadow Doubt trap instead!'",
    mission: "Complete 50 engineering-based math challenges with 95% precision",
    reward: 1200,
    planet: "Innovation Hub",
    unlocked: false
  },
  {
    id: 15,
    title: "The Harmony of Knowledge",
    unlockStars: 28500,
    description: "Maestro Harmony reveals that music holds the key to awakening the Crystal of Learning!",
    story: "🎵 With the detector complete, Maestro Harmony appears with startling news! 'The Crystal of Learning doesn't just need to be found - it needs to be awakened with the perfect mathematical harmony!' She explains that combining musical patterns with mathematical precision creates the resonance frequency needed to restore the crystal's power.",
    mission: "Master 40 fraction and pattern problems with 98% accuracy in sequence",
    reward: 1400,
    planet: "Harmonia",
    unlocked: false
  },
  {
    id: 16,
    title: "The Final Test",
    unlockStars: 33000,
    description: "Lord Confusion challenges you to the ultimate battle of minds!",
    story: "🏆 Your detector leads you to the Shadow Doubts' fortress, where Lord Confusion awaits! 'Before you can claim the Crystal of Learning,' he snarls, 'you must prove your knowledge is stronger than my confusion!' He summons the greatest academic challenge you've ever faced - a test that combines everything you've learned.",
    mission: "Complete 3 full mock exams with 90% average accuracy to defeat Lord Confusion",
    reward: 1600,
    planet: "Shadow Fortress",
    unlocked: false
  },
  {
    id: 17,
    title: "The Crystal's Hidden Location",
    unlockStars: 38000,
    description: "Defeat Lord Confusion and discover where the Crystal of Learning is truly hidden!",
    story: "🗺️ As Lord Confusion fades away, defeated by your knowledge, he gasps: 'The Crystal... it was never hidden from you... it was hidden within you all along!' Suddenly, you understand - the Crystal of Learning grows stronger inside every student who masters their subjects. Your journey has been awakening your own inner crystal!",
    mission: "Solve 75 complex multi-step problems with 96% accuracy to fully awaken your inner crystal",
    reward: 1800,
    planet: "Within Yourself",
    unlocked: false
  },
  {
    id: 18,
    title: "The Heroes Return",
    unlockStars: 44000,
    description: "Return to StarSpace Academy as a true Knowledge Hero!",
    story: "🦸‍♀️ You return to StarSpace Academy, where all your friends celebrate your victory! Commander Nova smiles proudly: 'You've learned the greatest secret - that knowledge itself is the most powerful force in the universe!' Captain Calculate, Reading Ranger, and all the allies you've met cheer as you're inducted into the Knowledge Heroes Hall of Fame!",
    mission: "Achieve 97% accuracy across 200 advanced problems spanning all subjects",
    reward: 2000,
    planet: "StarSpace Academy",
    unlocked: false
  },
  {
    id: 19,
    title: "Guardian of the Galaxy",
    unlockStars: 51000,
    description: "The galaxy chooses you as its Guardian of Learning and Knowledge!",
    story: "💎 With the Shadow Doubts defeated, confidence returns to learners across the galaxy! The Council of Wise Planets unanimously chooses you as the Guardian of Learning. Elder Cosmos presents you with the Time Crystal Badge - a symbol that you'll help other students believe in themselves and never give up learning!",
    mission: "Achieve perfect mastery (95%+ accuracy) in ALL Grade 3-5 TEKS standards",
    reward: 2500,
    planet: "Council of Planets",
    unlocked: false
  },
  {
    id: 20,
    title: "The New Generation",
    unlockStars: 60000,
    description: "Become a mentor and guide new space cadets on their learning adventures!",
    story: "⭐ Years have passed, and now you stand where Commander Nova once stood, welcoming new cadets to StarSpace Academy! 'Remember,' you tell them with a warm smile, 'every expert was once a beginner. Your journey of learning never truly ends - it only gets more exciting!' You pass the Star Commander badge to a new generation of heroes.",
    mission: "Maintain 98% accuracy over 500 questions while helping mentor other students",
    reward: 3000,
    planet: "StarSpace Academy",
    unlocked: false
  },
  {
    id: 21,
    title: "The Infinite Adventure",
    unlockStars: 75000,
    description: "Discover that learning is truly infinite and the adventure continues forever!",
    story: "♾️ As you gaze out at the infinite cosmos, you realize your greatest adventure is just beginning! There are always new worlds to explore, new problems to solve, and new friends to help. The Crystal of Learning within you glows brighter than ever, ready for whatever challenges and discoveries await in the endless galaxy of knowledge!",
    mission: "Demonstrate legendary mastery: 99% accuracy on 1000 problems across all subjects",
    reward: 5000,
    planet: "The Infinite Cosmos",
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