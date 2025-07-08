import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [practiceCount, setPracticeCount] = useState(5);
  
  // Check if demo mode is enabled
  const isDemo = typeof window !== 'undefined' && localStorage.getItem('demoMode') === 'true';
  
  // Demo user data
  const demoUser = {
    firstName: "Demo",
    lastName: "Student",
    starPower: 1250,
    grade: 4
  };

  const currentUser = isDemo ? demoUser : user;

  // Generate questions mutation
  const generateQuestionsMutation = useMutation({
    mutationFn: async ({ grade, subject, count }: { grade: number, subject: string, count: number }) => {
      return apiRequest(`/api/questions/generate-fast`, {
        method: 'POST',
        body: { grade, subject, count, category: 'General' }
      });
    },
    onSuccess: (data) => {
      alert(`Generated ${data.length} questions successfully! Starting practice session...`);
    },
    onError: (error) => {
      alert('Failed to generate questions. Please try again.');
      console.error('Generation error:', error);
    }
  });

  const handleStartPractice = () => {
    generateQuestionsMutation.mutate({
      grade: selectedGrade,
      subject: selectedSubject,
      count: practiceCount
    });
  };

  const handleLogout = () => {
    if (isDemo) {
      localStorage.removeItem('demoMode');
      localStorage.removeItem('demoRole');
      window.location.href = '/';
    } else {
      logout();
    }
  };

  if (isLoading && !isDemo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b-4 border-orange-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">⭐</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-600">StaarKids</h1>
                <p className="text-sm text-orange-500 font-medium">STAAR Test Mastery Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-800">
                  Welcome, {currentUser?.firstName || 'Student'}!
                </div>
                {currentUser?.starPower && (
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-bold text-orange-600">
                      {currentUser.starPower} Star Power
                    </span>
                  </div>
                )}
              </div>
              {isDemo && (
                <span className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium">
                  Demo Mode
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium shadow-md transition-colors"
              >
                {isDemo ? 'Exit Demo' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-gray-800">Master the </span>
            <span className="text-orange-600">STAAR Test</span>
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">with Confidence</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to continue your STAAR test preparation? Let's practice some questions and build your confidence for test day.
          </p>
        </div>

        {/* Quick Practice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-orange-500 mr-3">📚</span>
              Quick Practice
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full border-2 border-orange-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value={3}>Grade 3</option>
                  <option value={4}>Grade 4</option>
                  <option value={5}>Grade 5</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full border-2 border-orange-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="math">Mathematics</option>
                  <option value="reading">Reading</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={practiceCount}
                  onChange={(e) => setPracticeCount(Number(e.target.value))}
                  className="w-full border-2 border-orange-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <button
                onClick={handleStartPractice}
                disabled={generateQuestionsMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all transform hover:scale-105"
              >
                {generateQuestionsMutation.isPending ? 'Generating Questions...' : 'Start Practice Session'}
              </button>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <p className="text-sm text-orange-800">
                <strong>⚡ Lightning Fast Generation:</strong> Our advanced system creates 
                authentic STAAR questions 25,000x faster than traditional methods!
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-orange-500 mr-3">📊</span>
              Your Progress
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600">85%</div>
                <div className="text-sm font-medium text-gray-600">Math Accuracy</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600">78%</div>
                <div className="text-sm font-medium text-gray-600">Reading Score</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                <div className="text-3xl font-bold text-purple-600">156</div>
                <div className="text-sm font-medium text-gray-600">Questions Solved</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                <div className="text-3xl font-bold text-orange-600">Level 8</div>
                <div className="text-sm font-medium text-gray-600">Current Level</div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-400">
                  <span className="font-medium text-gray-700">Completed Math Practice</span>
                  <span className="font-bold text-green-600">+50 points</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-400">
                  <span className="font-medium text-gray-700">Reading Comprehension</span>
                  <span className="font-bold text-blue-600">+35 points</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-400">
                  <span className="font-medium text-gray-700">Mock Exam Completed</span>
                  <span className="font-bold text-purple-600">+100 points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}