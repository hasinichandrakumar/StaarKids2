import { useState } from "react";
import { Trophy, Target, Zap, CheckCircle, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DailyChallengesProps {
  grade: number;
  onStartPractice: (subject: "math" | "reading", category?: string) => void;
}

export default function DailyChallenges({ grade, onStartPractice }: DailyChallengesProps) {
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const challenges = [
    {
      id: "math-mastery",
      title: "Math Mastery",
      description: "Complete 5 math practice questions",
      subject: "math" as const,
      reward: 25,
      icon: Target,
      difficulty: "Easy",
      timeEstimate: "10 min"
    },
    {
      id: "reading-rocket",
      title: "Reading Rocket",
      description: "Answer 3 reading comprehension questions correctly",
      subject: "reading" as const,
      reward: 30,
      icon: Zap,
      difficulty: "Medium",
      timeEstimate: "15 min"
    },
    {
      id: "perfect-score",
      title: "Perfect Score",
      description: "Get 100% on any practice session",
      subject: "math" as const,
      reward: 50,
      icon: Trophy,
      difficulty: "Hard",
      timeEstimate: "20 min"
    }
  ];

  const startChallenge = (challenge: typeof challenges[0]) => {
    onStartPractice(challenge.subject);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Challenges</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Resets in 6h 23m</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          const Icon = challenge.icon;
          
          return (
            <Card key={challenge.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:scale-105'}`}>
              <CardContent className="p-6">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
                
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    challenge.subject === 'math' 
                      ? 'bg-orange-100' 
                      : 'bg-yellow-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      challenge.subject === 'math' 
                        ? 'text-orange-600' 
                        : 'text-yellow-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{challenge.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{challenge.timeEstimate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">+{challenge.reward} StarPower</span>
                  </div>
                  
                  <Button
                    onClick={() => startChallenge(challenge)}
                    disabled={isCompleted}
                    className={`${
                      isCompleted 
                        ? 'bg-green-500 text-white cursor-not-allowed' 
                        : challenge.subject === 'math'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    } transition-colors duration-200`}
                    size="sm"
                  >
                    {isCompleted ? 'Complete!' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Today's Progress</p>
            <p className="text-lg font-bold text-gray-900">
              {completedChallenges.length} of {challenges.length} challenges completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Potential StarPower</p>
            <p className="text-2xl font-bold text-purple-600">
              {challenges.reduce((sum, c) => sum + c.reward, 0)}
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}