import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDemo = () => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', 'student');
    window.location.href = '/dashboard';
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Master Your STAAR Tests
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Interactive practice for Texas students in grades 3-5. 
            Prepare for STAAR Math and Reading with authentic test questions.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={handleStartDemo}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10"
              >
                Start Free Demo
              </button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 disabled:opacity-50"
              >
                Sign In with Google
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900">Reading Practice</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Improve comprehension skills with authentic STAAR reading passages
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="text-3xl mb-4">🧮</div>
                <h3 className="text-lg font-medium text-gray-900">Math Problems</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Solve authentic STAAR math questions with step-by-step explanations
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-lg font-medium text-gray-900">Progress Tracking</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Monitor your improvement with detailed performance analytics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-lg shadow p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">25K+</div>
              <div className="text-sm text-gray-500">Practice Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">99%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3-5</div>
              <div className="text-sm text-gray-500">Grade Levels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}