import { Star, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { User } from "@shared/schema";

interface HeaderProps {
  user: User;
  onOpenAvatarModal: () => void;
}

export default function Header({ user, onOpenAvatarModal }: HeaderProps) {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Commander": return "bg-success";
      case "Captain": return "bg-primary";
      default: return "bg-secondary";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b-2 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-700">StaarKid</h1>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Star Power Points */}
            <div className="bg-secondary text-white px-4 py-2 rounded-full flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="font-semibold">{user.starPower?.toLocaleString() || 0}</span>
            </div>
            
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full border-3 border-primary flex items-center justify-center text-2xl cursor-pointer"
                style={{ backgroundColor: user.avatarColor || "#FF5B00" }}
                onClick={onOpenAvatarModal}
              >
                {getAvatarEmoji(user.avatarType || "fox")}
              </div>
              {/* Level Badge */}
              <div className={`absolute -bottom-1 -right-1 ${getRankColor(user.userRank || "Cadet")} text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold`}>
                <span>{user.currentGrade || 4}</span>
              </div>
            </div>
            
            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAvatarModal}
              className="text-gray-700 hover:text-primary"
            >
              <Settings className="w-5 h-5" />
            </Button>
            
            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-gray-700 hover:text-primary border-gray-300"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function getAvatarEmoji(avatarType: string): string {
  switch (avatarType) {
    case "shooting-star": return "🌟";
    case "star": return "⭐";
    case "sparkles": return "✨";
    case "comet": return "☄️";
    case "constellation": return "🌌";
    case "dizzy": return "💫";
    case "glowing-star": return "🌠";
    case "bright-star": return "⭐";
    case "magic-wand": return "🪄";
    default: return "🌟";
  }
}
