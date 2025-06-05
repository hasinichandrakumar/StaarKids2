import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import StarPowerDashboard from "@/components/StarPowerDashboard";
import GradeSelector from "@/components/GradeSelector";
import NavigationTabs from "@/components/NavigationTabs";
import PracticeTab from "@/components/PracticeTab";
import MockExamsTab from "@/components/MockExamsTab";
import PerformanceTab from "@/components/PerformanceTab";
import AvatarCustomizationModal from "@/components/AvatarCustomizationModal";
import QuestionPracticeModal from "@/components/QuestionPracticeModal";
import NovaChat from "@/components/NovaChat";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [activeTab, setActiveTab] = useState("practice");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showNovaChat, setShowNovaChat] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [practiceSubject, setPracticeSubject] = useState<"math" | "reading">("math");
  const [practiceCategory, setPracticeCategory] = useState<string | undefined>(undefined);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const startPractice = (subject: "math" | "reading", category?: string) => {
    setPracticeSubject(subject);
    setPracticeCategory(category);
    setShowQuestionModal(true);
  };

  return (
    <div className="min-h-screen">
      <Header 
        user={user} 
        onOpenAvatarModal={() => setShowAvatarModal(true)}
        onOpenNovaChat={() => setShowNovaChat(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={user} />
        
        <StarPowerDashboard />
        
        <GradeSelector 
          selectedGrade={selectedGrade} 
          onGradeChange={setSelectedGrade} 
        />
        
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
      </main>

      {showAvatarModal && (
        <AvatarCustomizationModal 
          user={user}
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
    </div>
  );
}
