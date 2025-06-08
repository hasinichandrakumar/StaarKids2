import type { User } from "@shared/schema";
import { BookOpen, Star, Trophy, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface WelcomeSectionProps {
  user: User | any;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const [animatedStars, setAnimatedStars] = useState(0);
  const starPower = user.starPower || 0;

  useEffect(() => {
    // Animate star count on load
    const timer = setTimeout(() => {
      setAnimatedStars(starPower);
    }, 500);
    return () => clearTimeout(timer);
  }, [starPower]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user.firstName || "Student";
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to become a STAAR champion?",
      "Let's turn practice into progress!",
      "Every question gets you closer to success!",
      "Your STAAR journey starts here!",
      "Practice makes perfect - let's go!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getStarLevel = () => {
    if (starPower >= 1000) return { level: "STAAR Champion", icon: Trophy, color: "text-yellow-300" };
    if (starPower >= 500) return { level: "Rising Star", icon: Star, color: "text-yellow-200" };
    if (starPower >= 200) return { level: "Quick Learner", icon: Zap, color: "text-blue-200" };
    return { level: "Getting Started", icon: Target, color: "text-green-200" };
  };

  const starLevel = getStarLevel();
  const StarIcon = starLevel.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 text-white mb-8 shadow-2xl" style={{
      background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-8 w-16 h-16 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-12 w-8 h-8 bg-white rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white rounded-full animate-ping delay-700"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-4xl font-bold">{getGreeting()}</h2>
            <div className="flex items-center space-x-1">
              <StarIcon className={`w-6 h-6 ${starLevel.color} animate-pulse`} />
              <span className={`text-sm font-medium ${starLevel.color}`}>{starLevel.level}</span>
            </div>
          </div>
          
          <p className="text-xl opacity-95 mb-6 font-medium">{getMotivationalMessage()}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-medium">Grade</span>
              </div>
              <span className="text-2xl font-bold block">{user.currentGrade || 4}</span>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium">Star Power</span>
              </div>
              <span className="text-2xl font-bold block">
                {animatedStars.toLocaleString()}
              </span>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Today's Goal</span>
              </div>
              <span className="text-lg font-bold block">Practice & Excel!</span>
            </div>
          </div>
        </div>

        {/* Enhanced illustration */}
        <div className="hidden lg:block ml-8">
          <div className="relative">
            <div className="w-64 h-40 bg-white bg-opacity-15 backdrop-blur-sm rounded-2xl flex items-center justify-center transform hover:rotate-1 transition-transform duration-300">
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-3">
                  <Star className="w-8 h-8 text-yellow-200 animate-spin" style={{ animationDuration: '3s' }} />
                  <BookOpen className="w-12 h-12 text-white" />
                  <Star className="w-8 h-8 text-yellow-200 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <p className="text-sm font-medium opacity-90">STAAR Success</p>
                <p className="text-xs opacity-75">Starts Here!</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
