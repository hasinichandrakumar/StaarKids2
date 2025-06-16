import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, X, Clock, CheckCircle, XCircle } from "lucide-react";
import { StarIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface QuestionPracticeModalProps {
  grade: number;
  subject: "math" | "reading";
  category?: string;
  onClose: () => void;
}

export default function QuestionPracticeModal({ grade, subject, category, onClose }: QuestionPracticeModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime] = useState(Date.now());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions", grade, subject, category],
    queryFn: () => {
      const url = category 
        ? `/api/questions/${grade}/${subject}?category=${encodeURIComponent(category)}`
        : `/api/questions/${grade}/${subject}`;
      return fetch(url).then(res => res.json());
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to ensure category persistence
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const generateQuestionsMutation = useMutation({
    mutationFn: async () => {
      const endpoint = category ? "/api/questions/generate-category" : "/api/questions/generate";
      const response = await apiRequest("POST", endpoint, {
        grade,
        subject,
        category,
        count: 5
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions", grade, subject, category] });
      queryClient.invalidateQueries({ queryKey: ["/api/questions", grade, subject] });
      toast({
        title: "New STAAR-Style Questions Generated",
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
      try {
        // Try authenticated endpoint first
        await apiRequest("POST", "/api/practice/attempt", attemptData);
      } catch (error: any) {
        // If authentication fails, use demo endpoint
        if (error.status === 401) {
          await fetch("/api/demo/practice/attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(attemptData)
          });
        } else {
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/practice/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats", grade, subject] });
    },
  });

  const getNovaExplanation = async (question: any, userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
    setLoadingExplanation(true);
    try {
      const response = await fetch("/api/nova-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `I just answered a ${subject} question: "${question.question_text}" I chose "${userAnswer}" and the correct answer is "${correctAnswer}". ${isCorrect ? 'I got it right!' : 'I got it wrong.'} Can you explain this to me?`,
          grade
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get Nova's explanation");
      }

      const data = await response.json();
      setAiExplanation(data.response || "Great job working on this question! Keep practicing and you'll do amazing!");
    } catch (error) {
      console.error("Error getting Nova's explanation:", error);
      setAiExplanation("Great job working on this question! I'm here to help you learn. Keep practicing and you'll do amazing!");
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

    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Great job! You earned 60 Star Power points!",
      });

      // Show correct status briefly, then move to next question
      setTimeout(() => {
        if (currentQuestionIndex < (questions?.length || 0) - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer("");
          setAnswerStatus(null);
        } else {
          onClose();
        }
      }, 1500);
    } else {
      // Show Nova's explanation for incorrect answer
      setShowExplanation(true);
      const userAnswerChoice = currentQuestion.answer_choices.find((choice: any) => choice.id === selectedAnswer);
      await getNovaExplanation(currentQuestion, userAnswerChoice?.text || selectedAnswer, currentQuestion.correctAnswer, false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    setAiExplanation("");
    setAnswerStatus(null);
    
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
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
                {subject} • Grade {grade}{category ? ` • ${category}` : ''}
              </span>
              {/* Answer Status Indicator */}
              {answerStatus && (
                <div className="flex items-center space-x-2">
                  {answerStatus === 'correct' ? (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Incorrect</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
              {currentQuestion.questionText}
            </h3>

            {/* Question Image/Diagram */}
            {currentQuestion.hasImage && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-center">
                  <img 
                    src={`/api/question-svg/${currentQuestion.id}`}
                    alt={currentQuestion.imageDescription || "Question diagram"}
                    className="max-w-full h-auto rounded shadow-sm"
                    style={{ maxHeight: '300px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-text');
                      if (fallback) {
                        fallback.textContent = currentQuestion.imageDescription || "Visual element described in question";
                        (fallback as HTMLElement).style.display = 'block';
                      }
                    }}
                  />
                  <div className="fallback-text hidden text-gray-600 italic text-center p-4">
                    {currentQuestion.imageDescription}
                  </div>
                </div>
              </div>
            )}

            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.answerChoices.map((choice: any) => {
                // Determine styling based on answer status
                let buttonStyle = "";
                let textStyle = "";
                
                if (showExplanation) {
                  // After answer is submitted, show correct/incorrect feedback
                  if (choice.id === currentQuestion.correctAnswer) {
                    // Correct answer - always green
                    buttonStyle = "border-green-500 bg-green-50 hover:bg-green-100";
                    textStyle = "text-green-700";
                  } else if (choice.id === selectedAnswer) {
                    // Selected wrong answer - red
                    buttonStyle = "border-red-500 bg-red-50 hover:bg-red-100";
                    textStyle = "text-red-700";
                  } else {
                    // Unselected options - gray
                    buttonStyle = "border-gray-200 bg-gray-50";
                    textStyle = "text-gray-500";
                  }
                } else {
                  // Before answer submission - normal selection styling
                  if (selectedAnswer === choice.id) {
                    buttonStyle = "border-primary bg-primary bg-opacity-10";
                    textStyle = "text-primary";
                  } else {
                    buttonStyle = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                    textStyle = "text-gray-700";
                  }
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => !showExplanation && setSelectedAnswer(choice.id)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${buttonStyle} ${
                      showExplanation ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`text-lg font-semibold mr-4 ${textStyle}`}>{choice.id})</span>
                      <span className={`text-lg ${textStyle}`}>{choice.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nova's Explanation Display */}
          {showExplanation && (
            <div className="mb-6 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-orange-800 mb-2 flex items-center">
                  <div className="relative flex-shrink-0 mr-3">
                    <StarIcon className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                        <SparklesIcon className="w-2 h-2 text-white" />
                      </div>
                    </div>
                  </div>
                  Nova explains
                  <SparklesIcon className="w-4 h-4 ml-2 text-yellow-500" />
                </h4>
                {loadingExplanation ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                    <span className="text-orange-700">Nova is thinking about your answer...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-lg border border-yellow-100 mb-4 shadow-sm">
                      <p className="text-orange-700 mb-3 whitespace-pre-wrap break-words leading-relaxed overflow-wrap-anywhere">{aiExplanation}</p>
                      <div className="border-t border-yellow-100 pt-3">
                        <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
                        <p className="font-medium text-green-700">{currentQuestion.correctAnswer}</p>
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap break-words overflow-wrap-anywhere">{currentQuestion.explanation}</p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline"
                        onClick={() => generateQuestionsMutation.mutate()}
                        disabled={generateQuestionsMutation.isPending}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        {generateQuestionsMutation.isPending ? "Generating..." : "Generate Similar Questions"}
                      </Button>
                      <Button 
                        onClick={handleNextQuestion}
                        className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white"
                      >
                        Next Question
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showExplanation && (
            <div className="flex justify-between items-center mt-8">
              <div className="flex space-x-4">
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