import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Calculator, Trophy, Target, Zap, ArrowRight, CheckCircle, CheckCircle2, Users, Award, Play, Brain, Lightbulb, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import InteractiveDemo from "@/components/InteractiveDemo";

export default function Landing() {
  const { login } = useAuth();
  const [_, setLocation] = useLocation();
  const [animatedCount, setAnimatedCount] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
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
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Calculator,
      title: "Math Mastery",
      description: "Complete TEKS-aligned math practice with instant feedback",
      color: "#FF5B00",
      bgColor: "#FF5B0010"
    },
    {
      icon: BookOpen,
      title: "Reading Excellence",
      description: "Improve comprehension with authentic STAAR passages",
      color: "#FCC201",
      bgColor: "#FCC20110"
    },
    {
      icon: Trophy,
      title: "Mock Exams",
      description: "Full-length practice tests with detailed analytics",
      color: "#FF5B00",
      bgColor: "#FF5B0010"
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor improvement across all TEKS standards",
      color: "#FCC201",
      bgColor: "#FCC20110"
    }
  ];

  const testimonials = [
    {
      text: "My daughter improved her math scores by 40% in just 2 months!",
      author: "Sarah Johnson",
      role: "Parent",
      grade: "Grade 4 Student"
    },
    {
      text: "The daily challenges keep my students motivated and engaged.",
      author: "Mr. Rodriguez",
      role: "Teacher",
      grade: "Elementary School"
    },
    {
      text: "I love earning StarPower points - it makes studying fun!",
      author: "Alex Chen",
      role: "Student",
      grade: "Grade 5"
    }
  ];

  const stats = [
    { value: "98%", label: "Student Improvement Rate" },
    { value: "50K+", label: "Practice Questions" },
    { value: "15+", label: "TEKS Standards Covered" }
  ];

  const handleLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-white">
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
                <Star className="w-8 h-8 text-white" />
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={handleLogin}
                className="text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Learning Free
              </Button>
              <Button
                variant="outline"
                className="border-2 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-opacity-10"
                style={{ 
                  borderColor: '#FF5B00', 
                  color: '#FF5B00',
                  backgroundColor: 'transparent'
                }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
              Our comprehensive platform provides authentic STAAR preparation with gamified learning that keeps students engaged and motivated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isReadingFeature = feature.title === "Reading Excellence";
              const isMathFeature = feature.title === "Math Mastery";
              const isMockExams = feature.title === "Mock Exams";
              const isProgressTracking = feature.title === "Progress Tracking";
              
              return (
                <Card key={index} className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 ${
                  isReadingFeature || isProgressTracking
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50'
                    : (isMathFeature || isMockExams)
                      ? 'bg-gradient-to-br from-orange-50 to-yellow-50'
                      : `bg-gradient-to-br ${feature.bgColor}`
                }`}>
                  <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300`} style={{
                    backgroundColor: feature.color
                  }}></div>
                  <CardContent className="relative p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`} style={{
                      background: isReadingFeature
                        ? `linear-gradient(135deg, ${feature.color}, #B8860B)` 
                        : isProgressTracking
                          ? `linear-gradient(135deg, #DAA520, ${feature.color})`
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
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-6">Master Math with Confidence</h4>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Our math practice covers all TEKS standards with authentic STAAR-style questions. Students work through Number & Operations, 
                  Algebraic Reasoning, Geometry & Measurement, and Data Analysis with step-by-step explanations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Adaptive Difficulty</h5>
                      <p className="text-gray-600">Questions adjust to your skill level for optimal learning</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Visual Learning Tools</h5>
                      <p className="text-gray-600">Interactive diagrams and manipulatives for better understanding</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Real-time Feedback</h5>
                      <p className="text-gray-600">Instant explanations help students learn from mistakes</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Card className="p-8 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Grade 4 Math Progress</span>
                      <span className="text-sm text-orange-600 font-semibold">87% Complete</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Number & Operations</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{width: '92%'}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Algebraic Reasoning</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Geometry & Measurement</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">Today's Achievement</span>
                      </div>
                      <p className="text-sm text-gray-600">Mastered multiplication with 2-digit numbers! +50 StarPower</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Reading Excellence Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <Card className="p-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Reading Comprehension</span>
                      <span className="text-sm text-yellow-600 font-semibold">Grade 5 Level</span>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-yellow-200">
                      <h5 className="font-semibold text-gray-900 mb-2">Current Passage: "The Life of Butterflies"</h5>
                      <p className="text-sm text-gray-600 mb-3">
                        "Butterflies undergo complete metamorphosis, which means they go through four distinct stages..."
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Literary Nonfiction</Badge>
                        <Badge className="bg-blue-100 text-blue-800">Main Idea</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Reading Speed</span>
                        <span className="font-semibold text-yellow-600">145 WPM</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Comprehension</span>
                        <span className="font-semibold text-yellow-600">89%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Vocabulary Growth</span>
                        <span className="font-semibold text-yellow-600">+23 words</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="order-2">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-6">Build Reading Excellence</h4>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Develop strong reading skills with authentic STAAR passages covering Literary Fiction, Literary Nonfiction, 
                  Informational Text, and Poetry. Our AI analyzes reading patterns to provide personalized recommendations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Diverse Text Types</h5>
                      <p className="text-gray-600">Fiction, nonfiction, poetry, and informational texts from real STAAR tests</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Vocabulary Builder</h5>
                      <p className="text-gray-600">Context-based vocabulary learning with grade-appropriate words</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">Reading Strategies</h5>
                      <p className="text-gray-600">Learn annotation, summarization, and critical thinking skills</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Exams & Progress Tracking Combined */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12">
              <div className="text-center mb-12">
                <h4 className="text-3xl font-bold text-gray-900 mb-4">Complete Test Preparation Experience</h4>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Practice with full-length mock exams that mirror the actual STAAR test experience, then track your progress with detailed analytics.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Mock Exams */}
                <Card className="p-8 bg-white shadow-lg">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-900">Full Mock Exams</h5>
                      <p className="text-gray-600">Authentic STAAR test experience</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Grade 4 Math Mock Exam #3</span>
                        <Badge className="bg-orange-100 text-orange-800">40 Questions</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time Limit: 4 hours</span>
                        <span className="text-gray-600">Last Score: 87%</span>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Realistic timing and question distribution</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Immediate detailed score reports</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Question-by-question analysis</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* Progress Tracking */}
                <Card className="p-8 bg-white shadow-lg">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-gray-900">Smart Progress Tracking</h5>
                      <p className="text-gray-600">Data-driven insights and recommendations</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">94%</div>
                          <div className="text-sm text-gray-600">Overall Accuracy</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">156</div>
                          <div className="text-sm text-gray-600">Questions Completed</div>
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>TEKS standard mastery tracking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Weakness identification and remediation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Parent and teacher progress reports</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>

            {/* AI-Powered Learning */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-3xl font-bold text-gray-900 mb-6">AI-Powered Personalized Learning</h4>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Our advanced AI analyzes each student's learning patterns, identifies strengths and weaknesses, 
                  and creates personalized study plans. Nova, your AI learning companion, provides real-time 
                  explanations and encouragement throughout the journey.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">Smart Recommendations</h5>
                    <p className="text-sm text-gray-600">AI identifies exactly what to study next based on your performance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">Adaptive Learning</h5>
                    <p className="text-sm text-gray-600">Difficulty adjusts automatically to keep you challenged but not overwhelmed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">Nova AI Assistant</h5>
                    <p className="text-sm text-gray-600">24/7 AI tutor provides explanations and answers questions instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Try It <span className="text-blue-600">Yourself</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience authentic STAAR questions with instant feedback and detailed explanations. 
              See how our platform makes learning engaging and effective.
            </p>
          </div>
          
          <InteractiveDemo />
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              This is just a small sample. Get access to thousands more questions!
            </p>
            <Button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Your Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by <span className="text-orange-600">Students, Parents & Teachers</span>
            </h3>
            <div className="flex justify-center items-center space-x-2 mb-8">
              <Users className="w-6 h-6 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">
                {animatedCount.toLocaleString()}+
              </span>
              <span className="text-gray-600">Happy Students</span>
            </div>
          </div>

          <div className="relative h-56 mb-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
                  index === currentTestimonial 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform translate-x-full'
                }`}
              >
                <Card className="bg-white shadow-xl border-0 h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                    <div className="flex justify-center mb-6 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="space-y-1">
                      <div className="font-bold text-lg text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600 font-medium">{testimonial.role}</div>
                      <div className="text-sm text-orange-600 font-semibold">{testimonial.grade}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  index === currentTestimonial 
                    ? 'bg-orange-500 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Start Your STAAR Success Journey?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already improving their scores with StaarKids
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleLogin}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Award className="w-5 h-5 mr-2" />
              Get Started Today
            </Button>
          </div>
          
          <div className="mt-8 flex justify-center items-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free to Start
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Authentic STAAR Questions
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant Results
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}