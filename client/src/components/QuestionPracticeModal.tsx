import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, X, Clock } from "lucide-react";

interface QuestionPracticeModalProps {
  grade: number;
  subject: "math" | "reading";
  onClose: () => void;
}

export default function QuestionPracticeModal({ grade, subject, onClose }: QuestionPracticeModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions", grade, subject],
    queryFn: () => fetch(`/api/questions/${grade}/${subject}`).then(res => res.json()),
  });

  const generateQuestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/questions/generate", {
        grade,
        subject,
        count: 5
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions", grade, subject] });
      toast({
        title: "New Questions Generated",
        description: `5 new ${subject} questions created based on authentic STAAR tests!`,
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate new questions. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const submitAnswerMutation = useMutation({
    mutationFn: async (attemptData: any) => {
      await apiRequest("POST", "/api/practice/attempt", attemptData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/practice/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats", grade, subject] });
    },
  });

  const getAiExplanation = async (question: any, userAnswer: string, correctAnswer: string) => {
    setLoadingExplanation(true);
    try {
      const response = await fetch("/api/chat/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question_text,
          userAnswer,
          correctAnswer,
          grade,
          subject,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get explanation");
      }

      const data = await response.json();
      setAiExplanation(data.explanation || "Here's the correct answer and explanation.");
    } catch (error) {
      console.error("Error getting AI explanation:", error);
      setAiExplanation("Sorry, I couldn't generate an explanation right now. Please try again later.");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) {
      toast({
        title: "Please select an answer",
        description: "Choose an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      hintsUsed: 0,
      timeSpent,
      skipped: false,
    });

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! You earned 60 Star Power points!",
      });

      // Move to next question or close modal
      if (currentQuestionIndex < (questions?.length || 0) - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer("");
      } else {
        onClose();
      }
    } else {
      // Show AI explanation for incorrect answer
      setShowExplanation(true);
      const userAnswerChoice = currentQuestion.answer_choices.find((choice: any) => choice.id === selectedAnswer);
      await getAiExplanation(currentQuestion, userAnswerChoice?.text || selectedAnswer, currentQuestion.correctAnswer);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    setAiExplanation("");
    
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkipQuestion = () => {
    if (!currentQuestion) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      selectedAnswer: null,
      isCorrect: false,
      hintsUsed: 0,
      timeSpent,
      skipped: true,
    });

    toast({
      title: "Question Skipped",
      description: "Moving to the next question.",
    });

    // Move to next question
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Questions...</h3>
            <p className="text-gray-600">Getting ready for your practice session.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl mx-4">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">No Questions Available</h3>
            <p className="mb-4">No questions found for Grade {grade} {subject}.</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-gray-500 capitalize">
                {subject} • Grade {grade}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentQuestion.question_text}
            </h3>

            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.answer_choices.map((choice: any) => (
                <button
                  key={choice.id}
                  onClick={() => setSelectedAnswer(choice.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === choice.id
                      ? "border-primary bg-primary bg-opacity-10 text-primary"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-semibold mr-4">{choice.id})</span>
                    <span className="text-lg">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Explanation Display */}
          {showExplanation && (
            <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">Let me explain that!</h4>
                  {loadingExplanation ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      <span className="text-red-700">Getting personalized explanation...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-red-700 mb-4">{aiExplanation}</p>
                      <div className="bg-white p-3 rounded-lg border border-red-100 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                        <p className="font-medium text-green-700">{currentQuestion.correctAnswer}</p>
                        <p className="text-sm text-gray-600 mt-2">{currentQuestion.explanation}</p>
                      </div>
                      <Button 
                        onClick={handleNextQuestion}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Next Question
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showExplanation && (
            <div className="flex justify-between items-center mt-8">
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleSkipQuestion}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Skip Question
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => generateQuestionsMutation.mutate()}
                  disabled={generateQuestionsMutation.isPending}
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {generateQuestionsMutation.isPending ? "Generating..." : "Generate More Questions"}
                </Button>
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer || submitAnswerMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}