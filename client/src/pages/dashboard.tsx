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
import EnhancedMockExamsTab from "@/components/EnhancedMockExamsTab";
import UnlimitedPracticeTab from "@/components/UnlimitedPracticeTab";
import StarSpaceStoryTab from "@/components/StarSpaceStoryTab";
import AIStudyPlanTab from "@/components/AIStudyPlanTab";
import EssaysTab from "@/components/EssaysTab";
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
  
  // Check if demo mode is enabled via localStorage
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
  
  // Get demo role from localStorage, default to student
  const demoRole = typeof window !== 'undefined' ? localStorage.getItem('demoRole') || 'student' : 'student';
  
  // Demo user data when in demo mode
  const demoUser = {
    id: "demo-user",
    email: "demo@staarkids.org",
    firstName: "Demo",
    lastName: demoRole === 'parent' ? "Parent" : demoRole === 'teacher' ? "Teacher" : "Student",
    profileImageUrl: null,
    starPower: 1250,
    role: demoRole,
    grade: 4,
    rank: "Explorer"
  };
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [activeTab, setActiveTab] = useState("starspace");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNovaChat, setShowNovaChat] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [practiceSubject, setPracticeSubject] = useState<"math" | "reading">("math");
  const [practiceCategory, setPracticeCategory] = useState<string | undefined>(undefined);

  // Use demo data when in demo mode, otherwise use authenticated user data
  const currentUser = isDemo ? demoUser : user;
  
  // In demo mode, skip loading state
  if (!isDemo && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  // If not in demo mode and not authenticated, show loading or redirect
  if (!isDemo && (!user && !isLoading)) {
    window.location.href = '/';
    return null;
  }

  // Handle role-based dashboard routing - default to student if no role specified
  const userRole = currentUser && typeof currentUser === 'object' && 'role' in currentUser ? (currentUser as any).role : 'student';
  
  if (!userRole || userRole === 'new') {
    // Skip role selection in demo mode
    if (isDemo) {
      // Continue with student dashboard
    } else {
      return (
        <RoleSelector 
          onRoleSelected={() => window.location.reload()} 
          currentUser={user as any} 
        />
      );
    }
  }

  // Parent dashboard
  if (userRole === 'parent' && !isDemo) {
    return <ParentDashboard user={user as any} />;
  }

  // Teacher dashboard
  if (userRole === 'teacher' && !isDemo) {
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
      {/* Demo mode indicator */}
      {isDemo && (
        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white px-4 py-2 text-center text-sm font-semibold">
          🎯 Demo Mode - Exploring StaarKids Platform
          <button 
            className="ml-4 underline hover:no-underline"
            onClick={() => {
              localStorage.removeItem('demoMode');
              window.location.href = '/';
            }}
          >
            Exit Demo
          </button>
        </div>
      )}
      
      <Header 
        user={currentUser as any} 
        onOpenAvatarModal={() => setShowAvatarModal(true)}
        onOpenNovaChat={() => setShowNovaChat(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={currentUser as any} />
        
        <QuickStatsOverview grade={selectedGrade} />
        
        <DailyChallenges grade={selectedGrade} onStartPractice={startPractice} />
        
        <StarPowerDashboard />
        
        <NavigationTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        {activeTab === "starspace" && (
          <StarSpaceStoryTab 
            user={currentUser as any}
            starPower={currentUser?.starPower || 1250}
          />
        )}

        {activeTab === "unlimited-practice" && (
          <UnlimitedPracticeTab 
            grade={selectedGrade} 
            onStartPractice={startPractice}
          />
        )}
        
        {activeTab === "mock-exams" && (
          <EnhancedMockExamsTab grade={selectedGrade} />
        )}

        {activeTab === "practice" && (
          <PracticeTab 
            grade={selectedGrade} 
            onStartPractice={startPractice}
          />
        )}
        
        
        {activeTab === "performance" && (
          <PerformanceTab grade={selectedGrade} />
        )}

        {activeTab === "ai-study-plan" && (
          <AIStudyPlanTab 
            grade={selectedGrade}
            user={currentUser as any}
          />
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
