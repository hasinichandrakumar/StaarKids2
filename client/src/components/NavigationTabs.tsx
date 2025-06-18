import { PencilIcon, ClipboardDocumentListIcon, ChartBarIcon, CpuChipIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { 
      id: "practice", 
      label: "Practice", 
      icon: PencilIcon,
      description: "Quick practice sessions",
      color: "from-blue-500 to-blue-600"
    },
    { 
      id: "mock-exams", 
      label: "Mock Exams", 
      icon: ClipboardDocumentListIcon,
      description: "Full-length practice tests",
      color: "from-purple-500 to-purple-600"
    },
    { 
      id: "essays", 
      label: "Essays", 
      icon: DocumentTextIcon,
      description: "Writing practice & prompts",
      color: "from-red-500 to-pink-600"
    },
    { 
      id: "performance", 
      label: "Performance", 
      icon: ChartBarIcon,
      description: "Track your progress",
      color: "from-green-500 to-green-600"
    },
    { 
      id: "ai-coach", 
      label: "AI Coach", 
      icon: CpuChipIcon,
      description: "Personalized learning guidance",
      color: "from-orange-500 to-yellow-500"
    },
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative group p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? `bg-gradient-to-br ${tab.color} text-white shadow-xl scale-105`
                  : "bg-white hover:bg-gray-50 text-gray-700 shadow-lg border border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-xl mb-3 transition-colors duration-200 ${
                  isActive 
                    ? "bg-white bg-opacity-20" 
                    : "bg-gray-100 group-hover:bg-orange-100"
                }`}>
                  <Icon className={`w-8 h-8 ${
                    isActive 
                      ? "text-white" 
                      : "text-gray-600 group-hover:text-orange-500"
                  }`} />
                </div>
                
                <h3 className={`text-xl font-bold mb-1 ${
                  isActive ? "text-white" : "text-gray-900"
                }`}>
                  {tab.label}
                </h3>
                
                <p className={`text-sm ${
                  isActive ? "text-white text-opacity-90" : "text-gray-500"
                }`}>
                  {tab.description}
                </p>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
