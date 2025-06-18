import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Target, Brain, TrendingUp, Star, Trophy, Calendar, BookOpen, Calculator, Zap, Eye, History, Shield } from "lucide-react";

export const ENHANCED_FEATURE_DESCRIPTIONS = {
  gamification: {
    title: "StarSpace Gamification Hub",
    subtitle: "Transform learning into an epic space adventure",
    description: "Experience the most advanced educational gamification system designed specifically for STAAR preparation. Students embark on a cosmic journey through 8 progressive rank levels, from Cadet to Cosmic Legend, earning StarPower points for every achievement.",
    features: [
      {
        name: "StarPower Progression System",
        detail: "Dynamic point system that rewards accuracy, consistency, and improvement. Earn 10-50 StarPower per correct answer, with bonus multipliers for streaks and challenging questions. Track progress through beautifully visualized rank progressions with over 32,000 StarPower levels available."
      },
      {
        name: "Cosmic Avatar Customization",
        detail: "Choose from 12+ space-themed avatars including rockets, astronauts, planets, and galaxies. Each avatar unlocks new color schemes and accessories as you progress. Personalize your learning identity with cosmic colors like Deep Space Purple, Galaxy Blue, and Stellar Gold."
      },
      {
        name: "Achievement System",
        detail: "Unlock 50+ achievements including First Steps (complete initial session), Math Whiz (80% accuracy on 10 questions), Perfect Score (100% session), 7-Day Streak (consistent daily practice), and TEKS Master (practice all standards). Each achievement provides substantial StarPower rewards."
      },
      {
        name: "Daily Mission Challenges",
        detail: "Fresh daily objectives that adapt to your skill level and learning gaps. Complete missions like 'Morning Practice' (5 math questions), 'Reading Explorer' (complete passage), and 'TEKS Adventurer' (practice 3 different standards). Missions reset daily with escalating difficulty."
      }
    ]
  },
  mockExams: {
    title: "Comprehensive Mock Examination System",
    subtitle: "Authentic STAAR testing experience with 13 years of historical data",
    description: "Access the most extensive collection of STAAR practice tests available, featuring authentic questions from 2013-2025 with AI-enhanced variations. Experience test conditions identical to actual STAAR assessments.",
    features: [
      {
        name: "Historical Test Archive (2013-2025)",
        detail: "Complete repository of released STAAR tests spanning over a decade, continuously updated with each year's new releases. Each test maintains authentic formatting, question types, and difficulty progressions exactly as they appeared on official assessments."
      },
      {
        name: "AI-Generated Mock Exams",
        detail: "Advanced AI creates unlimited practice tests that mirror official STAAR patterns. Questions are generated using machine learning models trained on years of authentic STAAR data, ensuring realistic difficulty curves and topic distributions."
      },
      {
        name: "Comprehensive Test History Analytics",
        detail: "Detailed performance tracking for every test taken, including score progression, time analysis, question-by-question breakdown, and comparative performance against grade-level benchmarks. View trends across multiple attempts and identify improvement patterns."
      },
      {
        name: "Smart Question Review System",
        detail: "Efficiently review both accurate and inaccurate responses with detailed explanations. Color-coded question banks separate mastered content from areas needing improvement. One-click access to similar practice questions for targeted remediation."
      },
      {
        name: "Interactive Formula Sheet",
        detail: "Digital mathematics reference sheet available during all math assessments, featuring geometry formulas, measurement conversions, and algebraic expressions. Organized by category with visual examples and quick search functionality."
      },
      {
        name: "Reading-Specific Dictionary",
        detail: "Contextual vocabulary support exclusively for reading assessments. Includes grade-appropriate definitions, pronunciation guides, and usage examples. Smart word suggestions based on passage content and difficulty level."
      }
    ]
  },
  unlimitedPractice: {
    title: "Unlimited AI-Powered Practice Engine",
    subtitle: "Infinite question generation aligned to every TEKS standard",
    description: "Revolutionary practice system that generates unlimited, unique questions for every Texas Essential Knowledge and Skills (TEKS) standard. Never run out of practice material with AI that creates fresh content daily.",
    features: [
      {
        name: "TEKS-Organized Question Library",
        detail: "Questions systematically organized by all Grade 3-5 TEKS standards across Mathematics and Reading. Each standard includes 100+ practice questions with varying difficulty levels. Visual progress tracking shows mastery percentage for each individual TEKS code."
      },
      {
        name: "Dynamic Daily Challenges",
        detail: "Fresh challenge sets generated every 24 hours, featuring mixed-skill practice, timed challenges, and themed learning adventures. Challenges adapt to individual performance data, focusing on areas needing improvement while reinforcing strengths."
      },
      {
        name: "AI-Enhanced Visual Problems",
        detail: "Sophisticated image generation creates diagrams, charts, graphs, and geometric figures for mathematics problems. Visual word problems include realistic scenarios with accompanying illustrations that enhance comprehension and engagement."
      },
      {
        name: "Intelligent Reading Comprehension",
        detail: "AI generates original passages across multiple genres including fiction, non-fiction, poetry, and informational texts. Each passage includes 3-5 comprehension questions targeting specific reading skills like main idea, inference, vocabulary in context, and text structure."
      },
      {
        name: "Real-Time Accuracy Tracking",
        detail: "Live percentage calculations for every TEKS standard as you practice. Watch your accuracy improve in real-time with color-coded progress indicators: red (below 60%), yellow (60-79%), green (80%+). Historical accuracy trends show learning progression over time."
      },
      {
        name: "Comprehensive Practice History",
        detail: "Complete archive of every practice session including questions attempted, time spent, accuracy achieved, and areas of focus. Filter history by date, subject, TEKS standard, or performance level. Export detailed reports for teachers and parents."
      }
    ]
  },
  novaBot: {
    title: "Nova AI Chatbot Assistant",
    subtitle: "Your personal AI tutor available 24/7",
    description: "Meet Nova, the most advanced educational AI designed specifically for elementary STAAR preparation. Nova provides instant tutoring, motivation, and personalized learning guidance whenever you need support.",
    features: [
      {
        name: "Interactive Question Generation",
        detail: "Request custom practice questions on any topic with natural language commands like 'Generate 5 fraction problems for Grade 4' or 'Create reading questions about animals.' Nova instantly creates TEKS-aligned questions with multiple choice answers and detailed explanations."
      },
      {
        name: "Concept Explanation in Simple Terms",
        detail: "Nova breaks down complex concepts using age-appropriate language, analogies, and real-world examples. Explains mathematical operations, reading strategies, and test-taking techniques in ways that 8-12 year olds easily understand."
      },
      {
        name: "Personalized Motivational Support",
        detail: "Provides encouragement tailored to individual challenges and achievements. Celebrates progress with personalized messages, offers study tips during difficult moments, and maintains positive learning momentum through adaptive motivational strategies."
      },
      {
        name: "Smart Study Recommendations",
        detail: "Analyzes your performance data to suggest specific areas for improvement, optimal practice schedules, and strategic test preparation approaches. Provides data-driven insights about learning patterns and suggests personalized learning paths."
      }
    ]
  },
  analytics: {
    title: "Advanced Performance Analytics Dashboard",
    subtitle: "Comprehensive insights into learning progress and achievement",
    description: "Professional-grade analytics provide deep insights into learning patterns, skill development, and test readiness. Track progress across all subjects with detailed breakdowns and predictive performance indicators.",
    features: [
      {
        name: "Multi-Dimensional Accuracy Tracking",
        detail: "Monitor overall accuracy, subject-specific performance (Math/Reading), grade-level proficiency, and individual TEKS standard mastery. Real-time calculations provide instant feedback on learning progress with historical trend analysis."
      },
      {
        name: "Predictive Performance Modeling",
        detail: "AI algorithms analyze practice patterns to predict STAAR test performance with increasing accuracy. Confidence intervals show likelihood of achieving different performance levels: Does Not Meet, Approaches, Meets, or Masters Grade Level."
      },
      {
        name: "Detailed Progress Visualization",
        detail: "Interactive charts and graphs display learning trajectories, skill development timelines, and comparative performance metrics. Visual dashboards make complex data accessible to students, parents, and teachers."
      },
      {
        name: "Weakness Identification System",
        detail: "Sophisticated algorithms identify specific learning gaps and provide targeted recommendations for improvement. Prioritized lists show which skills need immediate attention versus those ready for advancement to next level."
      }
    ]
  },
  studyPlan: {
    title: "AI-Generated Personalized Study Plans",
    subtitle: "Intelligent scheduling that adapts to your goals and timeline",
    description: "Revolutionary study planning system that creates customized, week-by-week learning schedules based on your test dates, current performance level, and target achievement goals.",
    features: [
      {
        name: "Adaptive Timeline Generation",
        detail: "Input your STAAR test date and current performance level to receive a comprehensive study schedule. AI calculates optimal pacing, daily time requirements, and milestone checkpoints to ensure test readiness by your target date."
      },
      {
        name: "Intelligent Content Prioritization",
        detail: "Study plans automatically prioritize content based on your individual strengths and weaknesses. Areas needing improvement receive more attention while maintaining skills you've already mastered. Dynamic adjustments based on ongoing performance."
      },
      {
        name: "Weekly Goal Setting",
        detail: "Each week includes specific, measurable objectives like 'Master fraction operations' or 'Improve reading comprehension speed by 15%.' Progress tracking ensures you stay on schedule with automatic adjustments for missed goals."
      },
      {
        name: "Multi-Subject Integration",
        detail: "Balanced study plans coordinate Mathematics and Reading preparation, ensuring neither subject is neglected. Time allocation adjusts based on relative performance in each area, with integrated review sessions for maximum retention."
      },
      {
        name: "Performance Milestone Tracking",
        detail: "Regular assessment checkpoints measure progress toward ultimate goals. Predictive modeling shows likelihood of achieving target performance levels with recommendations for schedule adjustments if needed."
      }
    ]
  }
};

export default function DetailedFeatureDescriptions() {
  return (
    <div className="space-y-8">
      {Object.entries(ENHANCED_FEATURE_DESCRIPTIONS).map(([key, section]) => (
        <Card key={key} className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                {key === 'gamification' && <Rocket className="w-6 h-6 text-white" />}
                {key === 'mockExams' && <Target className="w-6 h-6 text-white" />}
                {key === 'unlimitedPractice' && <Zap className="w-6 h-6 text-white" />}
                {key === 'novaBot' && <Brain className="w-6 h-6 text-white" />}
                {key === 'analytics' && <TrendingUp className="w-6 h-6 text-white" />}
                {key === 'studyPlan' && <Calendar className="w-6 h-6 text-white" />}
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
                <p className="text-lg text-blue-600 font-medium">{section.subtitle}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{section.description}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-500 text-white">
                      {index + 1}
                    </Badge>
                    <h4 className="font-semibold text-lg">{feature.name}</h4>
                  </div>
                  <p className="text-gray-600 leading-relaxed pl-8">
                    {feature.detail}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}