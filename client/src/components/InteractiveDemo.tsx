import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Star, Calculator, BookOpen } from "lucide-react";

export default function InteractiveDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const demoQuestions = [
    {
      id: 1,
      subject: "math",
      question: "What is 7 × 8?",
      choices: [
        { id: "A", text: "54" },
        { id: "B", text: "56" },
        { id: "C", text: "63" },
        { id: "D", text: "64" }
      ],
      correct: "B",
      explanation: "7 × 8 = 56. This is a basic multiplication fact."
    },
    {
      id: 2,
      subject: "reading",
      question: "What is the main idea of a story about friendship?",
      choices: [
        { id: "A", text: "Characters solving problems together" },
        { id: "B", text: "The setting of the story" },
        { id: "C", text: "The time period" },
        { id: "D", text: "The author's name" }
      ],
      correct: "A",
      explanation: "The main idea focuses on the central theme - characters working together through friendship."
    }
  ];

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
  };

  const handleSubmit = () => {
    if (selectedAnswer === demoQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Demo complete
      setShowResult(true);
    }
  };

  const resetDemo = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const question = demoQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;

  if (currentQuestion >= demoQuestions.length) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">Demo Complete!</h3>
          <p className="text-green-600 mb-4">
            You scored {score} out of {demoQuestions.length}
          </p>
          <p className="text-gray-600 mb-6">
            Experience thousands more authentic STAAR questions with detailed explanations
          </p>
          <Button
            onClick={resetDemo}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white shadow-xl border-0">
        <CardContent className="p-8">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                question.subject === 'math' 
                  ? 'bg-orange-100' 
                  : 'bg-yellow-50'
              }`}>
                {question.subject === 'math' ? (
                  <Calculator className={`w-5 h-5 text-orange-600`} />
                ) : (
                  <BookOpen className={`w-5 h-5`} style={{ color: '#FCC201' }} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 capitalize">
                  {question.subject} Practice
                </h4>
                <p className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {demoQuestions.length}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{score}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {question.question}
            </h3>
          </div>

          {/* Answer Choices */}
          <div className="space-y-3 mb-6">
            {question.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => !showResult && handleAnswerSelect(choice.id)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  showResult
                    ? choice.id === question.correct
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : choice.id === selectedAnswer && choice.id !== question.correct
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                    : selectedAnswer === choice.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold">{choice.id}.</span>
                    <span>{choice.text}</span>
                  </div>
                  {showResult && choice.id === question.correct && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {showResult && choice.id === selectedAnswer && choice.id !== question.correct && (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result and Explanation */}
          {showResult && (
            <div className={`p-4 rounded-xl mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
                <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
                {isCorrect && (
                  <div className="flex items-center space-x-1 ml-auto">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">+10 StarPower</span>
                  </div>
                )}
              </div>
              <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {question.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={`px-8 py-3 font-semibold rounded-xl text-white disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  question.subject === 'math'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'hover:opacity-90'
                }`}
                style={question.subject === 'reading' ? { backgroundColor: '#FCC201' } : {}}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={`px-8 py-3 font-semibold rounded-xl text-white ${
                  question.subject === 'math'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'hover:opacity-90'
                }`}
                style={question.subject === 'reading' ? { backgroundColor: '#FCC201' } : {}}
              >
                {currentQuestion < demoQuestions.length - 1 ? 'Next Question' : 'Complete Demo'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}