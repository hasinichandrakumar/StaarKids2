import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Card, 
  Badge, 
  Group, 
  Stack, 
  Grid, 
  Center,
  Paper,
  Flex,
  Image,
  List,
  ThemeIcon,
  Overlay
} from '@mantine/core';
import { 
  IconStar, 
  IconBook, 
  IconCalculator, 
  IconTrophy, 
  IconTarget, 
  IconBolt, 
  IconArrowRight, 
  IconCheck, 
  IconUsers, 
  IconAward, 
  IconPlayerPlay, 
  IconBrain, 
  IconBulb, 
  IconTrendingUp,
  IconEye,
  IconBrandGoogle
} from '@tabler/icons-react';
import { useLocation } from "wouter";
import { notifications } from '@mantine/notifications';

export default function Landing() {
  const { login, loginWithGoogle } = useAuth();
  const [_, setLocation] = useLocation();
  const [animatedCount, setAnimatedCount] = useState(0);

  const processGoogleOAuth = async (code: string) => {
    try {
      localStorage.setItem('oauthCode', code);
      window.history.replaceState({}, document.title, '/');
      window.location.href = `/auth-process?code=${encodeURIComponent(code)}`;
    } catch (error) {
      console.error("OAuth processing error:", error);
      notifications.show({
        title: 'Authentication Error',
        message: 'Failed to process login. Please try again.',
        color: 'red'
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get('callback');
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    
    if (callback === 'google' && code) {
      console.log('Processing Google OAuth callback...');
      processGoogleOAuth(code);
    } else if (callback === 'google' && error) {
      console.error('OAuth error:', error);
      notifications.show({
        title: 'Login Failed',
        message: 'Google authentication was cancelled or failed.',
        color: 'red'
      });
    }

    // Animate student count
    const timer = setTimeout(() => {
      let count = 0;
      const target = 15000;
      const increment = target / 100;
      const interval = setInterval(() => {
        count += increment;
        if (count >= target) {
          setAnimatedCount(target);
          clearInterval(interval);
        } else {
          setAnimatedCount(Math.floor(count));
        }
      }, 20);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    window.location.href = "/auth/google/login";
  };

  const handleGoogleSignIn = () => {
    window.location.href = "/auth/google/login";
  };

  const stats = [
    { value: "15,000+", label: "Students Served" },
    { value: "95%", label: "Test Score Improvement" },
    { value: "2013-2025", label: "Authentic STAAR Questions" }
  ];

  const features = [
    {
      icon: IconCalculator,
      title: "Math Mastery",
      description: "Practice authentic STAAR Math questions from grades 3-5 with step-by-step solutions and TEKS alignment.",
      color: "#FF5B00"
    },
    {
      icon: IconBook,
      title: "Reading Excellence",
      description: "Master reading comprehension with real STAAR passages and questions designed to build critical thinking skills.",
      color: "#FCC201"
    },
    {
      icon: IconTarget,
      title: "Mock Exams",
      description: "Take full-length practice tests that mirror the actual STAAR format and timing for complete preparation.",
      color: "#FF5B00"
    },
    {
      icon: IconTrendingUp,
      title: "Progress Tracking",
      description: "Monitor improvement with detailed analytics, performance insights, and personalized learning recommendations.",
      color: "#DAA520"
    },
    {
      icon: IconTrophy,
      title: "StarPower Rewards",
      description: "Earn points and achievements as you master concepts, making learning engaging and motivational.",
      color: "#FF5B00"
    },
    {
      icon: IconBrain,
      title: "AI-Powered Learning",
      description: "Get personalized question recommendations and adaptive learning paths powered by advanced AI technology.",
      color: "#FCC201"
    }
  ];

  const testimonials = [
    {
      quote: "My daughter's math scores improved by 2 grade levels in just 3 months!",
      author: "Sarah M., Parent",
      role: "Parent of 4th grader"
    },
    {
      quote: "The practice tests helped my students feel confident and prepared for the real STAAR test.",
      author: "Ms. Rodriguez",
      role: "3rd Grade Teacher"
    },
    {
      quote: "I love earning StarPower points while learning. It makes studying fun!",
      author: "Alex, Age 10",
      role: "5th Grade Student"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{
                background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
              }}>
                <IconStar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                StaarKids
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => {
                  // Set demo mode and go to dashboard directly
                  localStorage.setItem('demoMode', 'true');
                  window.location.href = '/dashboard';
                }}
                variant="outline"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 font-medium"
              >
                Try Dashboard
              </Button>
              <Button
                onClick={handleLogin}
                variant="ghost"
                className="text-gray-600 hover:text-orange-600"
              >
                Sign In
              </Button>
              <Button
                onClick={handleLogin}
                className="text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                }}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-red-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-amber-400 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo and Title */}
            <div className="flex justify-center items-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300" style={{
                background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
              }}>
                <IconStar className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent" style={{
                  background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)',
                  WebkitBackgroundClip: 'text'
                }}>
                  StaarKids
                </h1>
                <p className="font-medium" style={{ color: '#FF5B00' }}>STAAR Test Mastery Platform</p>
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master the <span className="bg-clip-text text-transparent" style={{
                background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)',
                WebkitBackgroundClip: 'text'
              }}>STAAR Test</span>
              <br />
              with Confidence
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of Texas students mastering grades 3-5 STAAR Math and Reading 
              with our gamified, TEKS-aligned practice platform featuring real test questions 
              and AI-powered personalized learning.
            </p>

            {/* Call to Action */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-6">Available for Students, Parents, and Teachers</p>
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <Button
                  variant="ghost" 
                  className="bg-orange-100 text-orange-700 px-4 py-2 text-sm font-medium hover:bg-orange-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={handleLogin}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Student Practice
                </Button>
                <Button
                  variant="ghost"
                  className="bg-green-100 text-green-700 px-4 py-2 text-sm font-medium hover:bg-green-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={handleLogin}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Parent Monitoring
                </Button>
                <Button
                  variant="ghost"
                  className="bg-purple-100 text-purple-700 px-4 py-2 text-sm font-medium hover:bg-purple-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={handleLogin}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Teacher Management
                </Button>
              </div>
              <p className="text-sm text-gray-500">Free account • No credit card required</p>
            </div>

            {/* Authentic STAAR Questions Preview */}
            <div className="mt-16 mb-16">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Try Authentic STAAR Questions
              </h3>
              <p className="text-center text-gray-600 mb-8">
                Practice with real questions from official STAAR tests (2013-2019)
              </p>
              <AuthenticSTAARQuestions />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#FF5B00' }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to <span style={{ color: '#FF5B00' }}>Excel</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive STAAR test preparation with authentic questions, adaptive learning, and gamified progress tracking.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isMathFeature = feature.title.toLowerCase().includes('math');
              const isReadingFeature = feature.title.toLowerCase().includes('reading');
              const isMockExams = feature.title.toLowerCase().includes('mock');
              const isProgressTracking = feature.title.toLowerCase().includes('progress');
              
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{
                      background: isReadingFeature
                        ? 'linear-gradient(135deg, #FCC201 0%, #FF5B00 100%)'
                        : isProgressTracking
                          ? 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                        : (isMathFeature || isMockExams)
                          ? 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                          : 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                    }}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Features Section */}
          <div className="mt-24 space-y-16">
            {/* Math Mastery Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h4 className="text-3xl font-bold text-gray-900 mb-6">
                  <span style={{ color: '#FF5B00' }}>Math Mastery</span> Made Simple
                </h4>
                <p className="text-lg text-gray-600 mb-6">
                  Practice with authentic STAAR Math questions from 2013-2025, covering all grade levels 3-5. 
                  Our AI-powered system adapts to your learning pace and identifies areas for improvement.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FF5B00' }} />
                    <span className="text-gray-700">Number & Operations mastery</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FF5B00' }} />
                    <span className="text-gray-700">Algebraic reasoning practice</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FF5B00' }} />
                    <span className="text-gray-700">Geometry & measurement skills</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FF5B00' }} />
                    <span className="text-gray-700">Data analysis & personal financial literacy</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-8 shadow-xl">
                  <InteractiveDemo />
                </div>
              </div>
            </div>

            {/* Reading Excellence Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-xl">
                <div className="text-center">
                  <BookOpen className="w-24 h-24 mx-auto mb-6" style={{ color: '#FCC201' }} />
                  <h5 className="text-2xl font-bold text-gray-900 mb-4">Reading Comprehension</h5>
                  <p className="text-gray-600">
                    Interactive passages with authentic STAAR questions to build critical reading skills
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-gray-900 mb-6">
                  <span style={{ color: '#FCC201' }}>Reading Excellence</span> Through Practice
                </h4>
                <p className="text-lg text-gray-600 mb-6">
                  Develop strong reading comprehension skills with authentic STAAR Reading passages and questions. 
                  Our platform provides immediate feedback and targeted practice for improvement.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FCC201' }} />
                    <span className="text-gray-700">Literary text analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FCC201' }} />
                    <span className="text-gray-700">Informational text comprehension</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FCC201' }} />
                    <span className="text-gray-700">Vocabulary development</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: '#FCC201' }} />
                    <span className="text-gray-700">Critical thinking skills</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Questions Preview */}
          <div className="mt-24">
            <h3 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Try Real <span style={{ color: '#FF5B00' }}>STAAR Questions</span>
            </h3>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Experience authentic STAAR test questions from our comprehensive question bank
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Math Question 1 */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)' }}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-orange-700">Grade 3 Math • TEKS 3.4A</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">
                  What is 7 × 8?
                </p>
                <div className="space-y-2">
                  {["54", "56", "63", "64"].map((choice, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                      onClick={handleLogin}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Math Question 2 */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)' }}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-orange-700">Grade 4 Math • TEKS 4.2E</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">
                  Which decimal represents the fraction 3/10?
                </p>
                <div className="space-y-2">
                  {["0.03", "0.3", "3.0", "30.0"].map((choice, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                      onClick={handleLogin}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Math Question 3 */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)' }}>
                    <Calculator className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-orange-700">Grade 5 Math • TEKS 5.3K</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">
                  What is 2/3 + 1/6?
                </p>
                <div className="space-y-2">
                  {["3/9", "5/6", "3/18", "1/2"].map((choice, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                      onClick={handleLogin}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Question 1 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #FCC201 0%, #FF5B00 100%)' }}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-yellow-700">Grade 3 Reading • TEKS 3.6B</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">
                  "The brave knight rode through the dark forest." What does the word "brave" tell us about the knight?
                </p>
                <div className="space-y-2">
                  {["He is afraid", "He is courageous", "He is tall", "He is fast"].map((choice, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                      onClick={handleLogin}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Question 2 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #FCC201 0%, #FF5B00 100%)' }}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-yellow-700">Grade 4 Reading • TEKS 4.7C</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">
                  What is the main purpose of a table of contents in a book?
                </p>
                <div className="space-y-2">
                  {["To show pictures", "To list chapter titles and page numbers", "To tell the story", "To show the author's name"].map((choice, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                      onClick={handleLogin}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Question 3 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ background: 'linear-gradient(135deg, #FCC201 0%, #FF5B00 100%)' }}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-yellow-700">Grade 5 Reading • TEKS 5.6F</span>
                </div>
                <p className="text-gray-800 font-medium mb-4">
                  Which sentence uses a simile?
                </p>
                <div className="space-y-2">
                  {["The cat ran quickly", "She was as quiet as a mouse", "The book is on the table", "He walked to school"].map((choice, idx) => (
                    <button 
                      key={idx}
                      className="w-full text-left p-3 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                      onClick={handleLogin}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">Click any question to sign in and start practicing!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span style={{ color: '#FF5B00' }}>Students</span>, 
            <span style={{ color: '#FCC201' }}> Parents</span>, and 
            <span style={{ color: '#FF5B00' }}> Teachers</span>
          </h3>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of families who have improved their STAAR test performance with StaarKids
          </p>
          
          <div className="relative">
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-12">
                <div className="mb-6">
                  <p className="text-2xl text-gray-700 font-medium italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'w-8' 
                      : 'opacity-50'
                  }`}
                  style={{ 
                    backgroundColor: index === currentTestimonial ? '#FF5B00' : '#FCC201'
                  }}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Master the STAAR Test?
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of Texas students achieving test success with StaarKids
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleLogin}
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Learning Free
            </Button>
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-semibold rounded-2xl transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                  });
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{
                  background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                }}>
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">StaarKids</h4>
              </div>
              <p className="text-gray-400">
                Empowering Texas students to excel in STAAR Math and Reading tests through innovative, 
                gamified learning experiences.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Math Practice</li>
                <li>Reading Comprehension</li>
                <li>Mock Exams</li>
                <li>Progress Tracking</li>
                <li>StarPower Rewards</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Grades Supported</h5>
              <ul className="space-y-2 text-gray-400">
                <li>3rd Grade STAAR</li>
                <li>4th Grade STAAR</li>
                <li>5th Grade STAAR</li>
                <li>TEKS Aligned Content</li>
                <li>Authentic Test Questions</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StaarKids. All rights reserved. Helping Texas students succeed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}