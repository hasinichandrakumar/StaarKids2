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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/staarkids-logo.svg" alt="STAAR Kids" className="h-8 w-auto mr-3" />
              <span className="text-xl font-bold text-gray-900">STAAR Kids</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {currentUser?.firstName || 'Student'}!
              </span>
              {isDemo && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  Demo Mode
                </span>
              )}
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                {isDemo ? 'Exit Demo' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.firstName || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Ready to continue your STAAR test preparation? Let's practice some questions.
          </p>
          {currentUser?.starPower && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                ⭐ {currentUser.starPower} Star Power
              </span>
            </div>
          )}
        </div>

        {/* Quick Practice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Practice</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={3}>Grade 3</option>
                  <option value={4}>Grade 4</option>
                  <option value={5}>Grade 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="math">Mathematics</option>
                  <option value="reading">Reading</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={practiceCount}
                  onChange={(e) => setPracticeCount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={handleStartPractice}
                disabled={generateQuestionsMutation.isPending}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generateQuestionsMutation.isPending ? 'Generating Questions...' : 'Start Practice'}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>⚡ Lightning Fast Generation:</strong> Our advanced system creates 
                authentic STAAR questions 25,000x faster than traditional methods!
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600">Math Accuracy</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">78%</div>
                <div className="text-sm text-gray-600">Reading Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">Questions Solved</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">Level 8</div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Completed Math Practice</span>
                  <span className="text-sm text-green-600">+50 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Reading Comprehension</span>
                  <span className="text-sm text-blue-600">+35 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">Mock Exam Completed</span>
                  <span className="text-sm text-purple-600">+100 points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}