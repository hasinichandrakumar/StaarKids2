import type { User } from "@shared/schema";

interface WelcomeSectionProps {
  user: User;
}

export default function WelcomeSection({ user }: WelcomeSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user.firstName || "Student";
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">{getGreeting()}</h2>
          <p className="text-lg opacity-90">Ready to practice for your STAAR test? Let's make today count!</p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm font-medium">Current Grade:</span>
              <span className="text-xl font-bold ml-2">{user.currentGrade || 4}</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
              <span className="text-sm font-medium">Star Power:</span>
              <span className="text-xl font-bold ml-2">{user.starPower || 0}</span>
            </div>
          </div>
        </div>
        {/* Motivational illustration placeholder */}
        <div className="hidden lg:block">
          <div className="w-48 h-32 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span className="text-6xl">📚</span>
          </div>
        </div>
      </div>
    </div>
  );
}
