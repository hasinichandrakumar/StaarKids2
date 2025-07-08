import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const { user, login } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, string>>({});

  const handleDemo = () => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', 'student');
    window.location.href = '/dashboard';
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswer(prev => ({ ...prev, [questionId]: answer }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/staarkids-logo.svg" alt="StaarKids" className="h-8 w-auto mr-3" />
              <h1 className="text-xl font-bold text-gray-900">StaarKids</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <span className="text-sm text-gray-600">Welcome, {user.firstName}</span>
              ) : (
                <button
                  onClick={login}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master the STAAR Test<br />
            <span className="text-blue-600">with Confidence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of Texas students mastering grades 3-5 STAAR Math and Reading with our gamified, 
            TEKS-aligned practice platform featuring real test questions and AI-powered personalized learning.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Available for Students, Parents, and Teachers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <button
              onClick={user ? () => window.location.href = '/dashboard' : login}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              Start Practicing Free
            </button>
            <button
              onClick={handleDemo}
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200"
            >
              Try Demo
            </button>
          </div>
          <p className="text-sm text-gray-500">Free account • No credit card required</p>
        </div>
      </section>

      {/* Try Authentic Questions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Try Authentic STAAR Questions
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Practice with real questions from official STAAR tests (2013-2019)
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Grade 3 Math */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600">Grade 3 Math • TEKS 3.4K</span>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authentic 2014 STAAR</span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">
                Sofia will arrange 42 feathers into 7 glass cases for her collection. There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?
              </p>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: '42 ÷ 7 = 6' },
                  { letter: 'B', text: '42 + 7 = 49' },
                  { letter: 'C', text: '42 × 7 = 294' },
                  { letter: 'D', text: '42 − 7 = 35' }
                ].map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect('q1', option.letter)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedAnswer['q1'] === option.letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Authentic STAAR question from 2014</p>
            </div>

            {/* Grade 4 Math */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600">Grade 4 Math • TEKS 4.6D</span>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authentic 2013 STAAR</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded ml-1">Visual</span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">
                The figures below share a characteristic. Which statement best describes these figures?
              </p>
              <div className="bg-gray-100 p-4 rounded mb-4 text-center">
                <p className="text-sm text-gray-600 italic">Multiple geometric shapes including squares, rectangles, and other quadrilaterals</p>
              </div>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: 'They are all trapezoids.' },
                  { letter: 'B', text: 'They are all rectangles.' },
                  { letter: 'C', text: 'They are all squares.' },
                  { letter: 'D', text: 'They are all quadrilaterals.' }
                ].map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect('q2', option.letter)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedAnswer['q2'] === option.letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Authentic STAAR question from 2013</p>
            </div>

            {/* Grade 5 Math */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600">Grade 5 Math • TEKS 5.4H</span>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authentic 2016 STAAR</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded ml-1">Visual</span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">
                A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?
              </p>
              <div className="bg-gray-100 p-4 rounded mb-4 text-center">
                <p className="text-sm text-gray-600 italic">A rectangular diagram showing a garden with labeled dimensions of 12 feet by 8 feet</p>
              </div>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: '20 square feet' },
                  { letter: 'B', text: '40 square feet' },
                  { letter: 'C', text: '96 square feet' },
                  { letter: 'D', text: '192 square feet' }
                ].map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect('q3', option.letter)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedAnswer['q3'] === option.letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Authentic STAAR question from 2016</p>
            </div>

            {/* Grade 3 Reading */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600">Grade 3 Reading • TEKS 3.8A</span>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authentic 2016 STAAR</span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">
                Based on the story 'Lizard Problems', what is Amy's main problem at the beginning?
              </p>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: "She doesn't like her new teacher." },
                  { letter: 'B', text: 'She is afraid of the classroom lizard.' },
                  { letter: 'C', text: "She doesn't want to sit near Trent." },
                  { letter: 'D', text: 'She wants to change classes.' }
                ].map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect('q4', option.letter)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedAnswer['q4'] === option.letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Authentic STAAR question from 2016</p>
            </div>

            {/* Grade 4 Reading */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600">Grade 4 Reading • TEKS 4.6B</span>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authentic 2016 STAAR</span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">
                According to the passage 'The Puppy Bowl', why was the Puppy Bowl created?
              </p>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: 'To train puppies for television.' },
                  { letter: 'B', text: 'To compete with the Super Bowl.' },
                  { letter: 'C', text: 'To provide entertainment during the Super Bowl.' },
                  { letter: 'D', text: 'To help animals find homes.' }
                ].map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect('q5', option.letter)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedAnswer['q5'] === option.letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Authentic STAAR question from 2016</p>
            </div>

            {/* Grade 5 Reading */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-600">Grade 5 Reading • TEKS 5.6A</span>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Authentic 2015 STAAR</span>
                </div>
              </div>
              <p className="text-gray-900 mb-4">
                In 'Princess for a Week', what does Roddy want to prove to his mother?
              </p>
              <div className="space-y-2">
                {[
                  { letter: 'A', text: 'That he can build a doghouse.' },
                  { letter: 'B', text: 'That he is responsible enough to care for a dog.' },
                  { letter: 'C', text: 'That he can make friends easily.' },
                  { letter: 'D', text: 'That he deserves a reward.' }
                ].map((option) => (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect('q6', option.letter)}
                    className={`w-full text-left p-3 rounded border transition-colors ${
                      selectedAnswer['q6'] === option.letter
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{option.letter}.</span> {option.text}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">Authentic STAAR question from 2015</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">Ready to practice with thousands more authentic STAAR questions?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={user ? () => window.location.href = '/dashboard' : login}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
              >
                Start Practicing Free
              </button>
              <button
                onClick={handleDemo}
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Students Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Test Score Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2013-2025</div>
              <div className="text-gray-600">Authentic STAAR Questions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Comprehensive STAAR test preparation with authentic questions, adaptive learning, and gamified progress tracking.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Math Mastery</h3>
              <p className="text-gray-600">Practice authentic STAAR Math questions from grades 3-5 with step-by-step solutions and TEKS alignment.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reading Excellence</h3>
              <p className="text-gray-600">Master reading comprehension with real STAAR passages and questions designed to build critical thinking skills.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mock Exams</h3>
              <p className="text-gray-600">Take full-length practice tests that mirror the actual STAAR format and timing for complete preparation.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor improvement with detailed analytics, performance insights, and personalized learning recommendations.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">StarPower Rewards</h3>
              <p className="text-gray-600">Earn points and achievements as you master concepts, making learning engaging and motivational.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Learning</h3>
              <p className="text-gray-600">Get personalized question recommendations and adaptive learning paths powered by advanced AI technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Trusted by Students, Parents, and Teachers
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Join thousands of families who have improved their STAAR test performance with StaarKids
          </p>
          
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="text-xl text-gray-700 italic mb-4">
              "My daughter's math scores improved by 2 grade levels in just 3 months!"
            </blockquote>
            <div className="text-gray-600">
              <div className="font-semibold">Sarah M., Parent</div>
              <div className="text-sm">Parent of 4th grader</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Master the STAAR Test?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of Texas students achieving test success with StaarKids
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={user ? () => window.location.href = '/dashboard' : login}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              Start Learning Free
            </button>
            <button
              onClick={handleDemo}
              className="bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}