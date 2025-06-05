import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calculator, BookOpen, Target, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-700">Staarkid</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-700 mb-6">
            Master Your <span className="text-primary">STAAR</span> Tests
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empower Texas students in grades 3–5 to effectively prepare for STAAR tests 
            in Math and Reading through personalized, engaging, and standards-aligned practice.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary hover:bg-primary/90 text-white text-lg font-semibold px-8 py-4 rounded-xl"
          >
            Start Learning Today
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Math Practice</h3>
              <p className="text-gray-600">
                TEKS-aligned math questions covering fractions, geometry, and problem-solving
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Reading Skills</h3>
              <p className="text-gray-600">
                Comprehension, literary elements, and critical thinking exercises
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Personalized Learning</h3>
              <p className="text-gray-600">
                Adaptive practice paths tailored to your strengths and weaknesses
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Gamified Experience</h3>
              <p className="text-gray-600">
                Earn Star Power points, unlock avatars, and track your progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-700 text-center mb-8">How Staarkid Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Select Your Grade</h4>
              <p className="text-gray-600">Choose your grade level (3, 4, or 5) and subject to begin practicing</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Practice & Learn</h4>
              <p className="text-gray-600">Work through TEKS-aligned questions with hints and detailed explanations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">Track Progress</h4>
              <p className="text-gray-600">Monitor your improvement and earn rewards as you master new skills</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Excel on Your STAAR Tests?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of Texas students who are already improving their scores with Staarkid
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-primary hover:bg-gray-100 text-lg font-semibold px-8 py-4 rounded-xl"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
