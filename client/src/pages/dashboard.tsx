import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import StarPowerDashboard from "@/components/StarPowerDashboard";
import QuickStatsOverview from "@/components/QuickStatsOverview";
import DailyChallenges from "@/components/DailyChallenges";
import NavigationTabs from "@/components/NavigationTabs";
import PracticeTab from "@/components/PracticeTab";
import MockExamsTab from "@/components/MockExamsTab";
import PerformanceTab from "@/components/PerformanceTab";
import AICoachTab from "@/components/AICoachTab";
import AvatarCustomizationModal from "@/components/AvatarCustomizationModal";
import QuestionPracticeModal from "@/components/QuestionPracticeModal";
import NovaChat from "@/components/NovaChat";
import SettingsModal from "@/components/SettingsModal";
import RoleSelector from "@/components/RoleSelector";
import ParentDashboard from "@/components/ParentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [activeTab, setActiveTab] = useState("practice");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNovaChat, setShowNovaChat] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [practiceSubject, setPracticeSubject] = useState<"math" | "reading">("math");
  const [practiceCategory, setPracticeCategory] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  // Handle role-based dashboard routing - default to student if no role specified
  const userRole = user && typeof user === 'object' && 'role' in user ? (user as any).role : 'student';
  
  if (!userRole || userRole === 'new') {
    return (
      <RoleSelector 
        onRoleSelected={() => window.location.reload()} 
        currentUser={user as any} 
      />
    );
  }

  // Parent dashboard
  if (userRole === 'parent') {
    return <ParentDashboard user={user as any} />;
  }

  // Teacher dashboard
  if (userRole === 'teacher') {
    return <TeacherDashboard user={user as any} />;
  }

  // Default to student dashboard for 'student' role or undefined

  const startPractice = (subject: "math" | "reading", category?: string) => {
    setPracticeSubject(subject);
    setPracticeCategory(category);
    setShowQuestionModal(true);
  };

  return (
    <div className="min-h-screen">
      <Header 
        user={user as any} 
        onOpenAvatarModal={() => setShowAvatarModal(true)}
        onOpenNovaChat={() => setShowNovaChat(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={user as any} />
        
        <QuickStatsOverview grade={selectedGrade} />
        
        <DailyChallenges grade={selectedGrade} onStartPractice={startPractice} />
        
        <StarPowerDashboard />
        
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {activeTab === "practice" && (
          <PracticeTab 
            grade={selectedGrade} 
            onStartPractice={startPractice}
          />
        )}
        
        {activeTab === "mock-exams" && (
          <MockExamsTab grade={selectedGrade} />
        )}
        
        {activeTab === "performance" && (
          <PerformanceTab grade={selectedGrade} />
        )}
        
        {activeTab === "ai-coach" && (
          <AICoachTab grade={selectedGrade} />
        )}
      </main>

      {showAvatarModal && (
        <AvatarCustomizationModal 
          user={user as any}
          onClose={() => setShowAvatarModal(false)} 
        />
      )}

      {showQuestionModal && (
        <QuestionPracticeModal
          grade={selectedGrade}
          subject={practiceSubject}
          category={practiceCategory}
          onClose={() => {
            setShowQuestionModal(false);
            setPracticeCategory(undefined);
          }}
        />
      )}

      {showNovaChat && (
        <NovaChat
          grade={selectedGrade}
          isOpen={showNovaChat}
          onClose={() => setShowNovaChat(false)}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          user={user as any}
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
