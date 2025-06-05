import { PencilIcon, ClipboardDocumentListIcon, ChartBarIcon } from "@heroicons/react/24/outline";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: "practice", label: "Practice", icon: PencilIcon },
    { id: "mock-exams", label: "Mock Exams", icon: ClipboardDocumentListIcon },
    { id: "performance", label: "Performance", icon: ChartBarIcon },
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center py-4 px-1 text-lg font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
