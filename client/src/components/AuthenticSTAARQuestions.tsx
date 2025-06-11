import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calculator, BookOpen, Eye, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthenticQuestion {
  id: number;
  grade: number;
  subject: "math" | "reading";
  teksStandard: string;
  questionText: string;
  answerChoices: string[];
  correctAnswer: string;
  category: string;
  isFromRealSTAAR: boolean;
  year: number;
  hasImage?: boolean;
  imageDescription?: string;
}

export default function AuthenticSTAARQuestions() {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const { data: questions = [], isLoading } = useQuery<AuthenticQuestion[]>({
    queryKey: ["/api/sample-questions"],
  });

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleDemo = () => {
    localStorage.setItem('demoMode', 'true');
    window.location.href = '/dashboard';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No questions available at the moment.</p>
      </div>
    );
  }

  // Take first 6 questions for homepage display
  const displayQuestions = questions.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {displayQuestions.map((question: AuthenticQuestion, index: number) => {
          const isSelected = selectedAnswers[question.id];
          const isCorrect = isSelected === question.correctAnswer;
          const showResult = isSelected;

          return (
            <div 
              key={question.id} 
              className={`rounded-2xl p-6 border transition-all duration-200 ${
                question.subject === "math" 
                  ? "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-100" 
                  : "bg-gradient-to-br from-blue-50 to-green-50 border-blue-100"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center mb-4">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ 
                    background: question.subject === "math" 
                      ? 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)'
                      : 'linear-gradient(135deg, #4A90E2 0%, #7ED321 100%)'
                  }}
                >
                  {question.subject === "math" ? (
                    <Calculator className="w-4 h-4 text-white" />
                  ) : (
                    <BookOpen className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-sm font-semibold ${
                    question.subject === "math" ? "text-orange-700" : "text-blue-700"
                  }`}>
                    Grade {question.grade} {question.subject === "math" ? "Math" : "Reading"} • TEKS {question.teksStandard}
                  </span>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Authentic {question.year} STAAR
                    </span>
                    {question.hasImage && (
                      <span className="text-xs text-gray-500 bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-2">
                        <Image className="w-3 h-3 inline mr-1" />
                        Visual
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-gray-800 font-medium mb-4 leading-relaxed">
                {question.questionText}
              </p>

              {/* Visual Element Indicator */}
              {question.hasImage && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center text-sm text-gray-600">
                    <Image className="w-4 h-4 mr-2" />
                    <span>This question includes visual elements from the original STAAR test</span>
                  </div>
                  {question.imageDescription && (
                    <p className="text-xs text-gray-500 mt-1">{question.imageDescription}</p>
                  )}
                </div>
              )}

              {/* Answer Choices */}
              <div className="space-y-2 mb-4">
                {question.answerChoices.map((choice, idx) => {
                  const choiceLetter = String.fromCharCode(65 + idx);
                  const isThisSelected = isSelected === choiceLetter;
                  const isThisCorrect = question.correctAnswer === choiceLetter;
                  
                  return (
                    <button 
                      key={idx}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        showResult 
                          ? isThisCorrect
                            ? "bg-green-100 border-green-300 text-green-800"
                            : isThisSelected
                            ? "bg-red-100 border-red-300 text-red-800"
                            : "bg-gray-50 border-gray-200"
                          : question.subject === "math"
                          ? "border-orange-200 hover:bg-orange-100"
                          : "border-blue-200 hover:bg-blue-100"
                      }`}
                      onClick={() => handleAnswerSelect(question.id, choiceLetter)}
                      disabled={!!showResult}
                    >
                      <span className={`font-medium mr-3 ${
                        showResult && isThisCorrect ? "text-green-700" :
                        showResult && isThisSelected ? "text-red-700" :
                        question.subject === "math" ? "text-orange-700" : "text-blue-700"
                      }`}>
                        {choiceLetter}.
                      </span>
                      {choice}
                    </button>
                  );
                })}
              </div>

              {/* Result or CTA */}
              {showResult ? (
                <div className="text-center">
                  <p className={`text-sm font-medium mb-2 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}>
                    {isCorrect ? "Correct! 🎉" : "Not quite right"}
                  </p>
                  {!isCorrect && (
                    <p className="text-xs text-gray-600 mb-2">
                      The correct answer is {question.correctAnswer}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    From {question.year} STAAR Grade {question.grade} {question.subject === "math" ? "Math" : "Reading"} test
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Select an answer to see the result
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Authentic STAAR question from {question.year}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">Ready to practice with thousands more authentic STAAR questions?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            className="px-8 py-3 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #FF5B00 0%, #FCC201 100%)' }}
            onClick={handleLogin}
          >
            Start Practicing Free
          </Button>
          <Button
            variant="outline"
            className="px-8 py-3 font-semibold rounded-2xl border-2 hover:bg-gray-50 transition-all duration-200"
            style={{ 
              borderColor: '#FF5B00', 
              color: '#FF5B00'
            }}
            onClick={handleDemo}
          >
            <Eye className="w-4 h-4 mr-2" />
            Try Demo
          </Button>
        </div>
      </div>
    </div>
  );
}