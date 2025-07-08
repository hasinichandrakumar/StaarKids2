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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/staarkids-logo.svg" alt="STAAR Kids" className="h-8 w-auto mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">STAAR Kids Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Grade {currentUser.grade} • {currentUser.starPower} Star Power
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
                    </span>
                  </div>
                </div>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Welcome back, {currentUser?.firstName || 'Student'}!
              </h2>
              <p className="text-gray-600">
                Ready to practice STAAR questions? Select your preferences below and start learning.
              </p>
            </div>
          </div>

          {/* Quick Practice Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Practice</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <select
                    id="grade"
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={3}>Grade 3</option>
                    <option value={4}>Grade 4</option>
                    <option value={5}>Grade 5</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="math">Mathematics</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <select
                    id="count"
                    value={practiceCount}
                    onChange={(e) => setPracticeCount(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartPractice}
                disabled={generateQuestionsMutation.isPending}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {generateQuestionsMutation.isPending ? 'Generating Questions...' : 'Start Practice Session'}
              </button>

              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Lightning Fast Generation:</strong> Our AI creates authentic STAAR questions instantly using advanced template-based generation - 25,000x faster than traditional methods!
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Star Power</dt>
                      <dd className="text-lg font-medium text-gray-900">{currentUser?.starPower || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📚</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Grade Level</dt>
                      <dd className="text-lg font-medium text-gray-900">Grade {currentUser?.grade || 4}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🎯</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Practice Sessions</dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏆</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Accuracy</dt>
                      <dd className="text-lg font-medium text-gray-900">--%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}