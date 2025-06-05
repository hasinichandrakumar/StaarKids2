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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
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
      const response = await apiRequest("POST", "/api/chat/explain", {
        question: question.question_text,
        userAnswer,
        correctAnswer,
        grade,
        subject,
      });
      setAiExplanation(response.explanation || "Here's the correct answer and explanation.");
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
      hintsUsed,
      timeSpent,
      skipped: false,
    });

    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `Great job! You earned ${hintsUsed === 0 ? 60 : Math.max(20, 60 - (hintsUsed * 10))} Star Power points!`,
      });

      // Move to next question or close modal
      if (currentQuestionIndex < (questions?.length || 0) - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer("");
        setHintsUsed(0);
        setShowHint(false);
      } else {
        onClose();
      }
    } else {
      // Show explanation for incorrect answer without AI for now
      setShowExplanation(true);
      setAiExplanation(`The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setHintsUsed(0);
    setShowHint(false);
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
      hintsUsed,
      timeSpent,
      skipped: true,
    });

    toast({
      title: "Question Skipped",
      description: "This question will count as incorrect.",
      variant: "destructive",
    });

    // Move to next question or close modal
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
      setHintsUsed(0);
      setShowHint(false);
    } else {
      onClose();
    }
  };

  const handleGetHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
      toast({
        title: "Hint",
        description: "Read the question carefully and eliminate obviously wrong answers first.",
      });
    } else {
      toast({
        title: "No hints remaining",
        description: "You've used all 3 hints for this question set.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading questions...</p>
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{3 - hintsUsed} hints left</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {currentQuestion.questionText}
            </h3>
            
            {/* Answer Choices */}
            <div className="space-y-3">
              {currentQuestion.answerChoices?.map((choice: any, index: number) => {
                const choiceId = String.fromCharCode(65 + index); // A, B, C, D
                return (
                  <button
                    key={choiceId}
                    onClick={() => setSelectedAnswer(choiceId)}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-colors ${
                      selectedAnswer === choiceId
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <span className="inline-block w-8 h-8 bg-gray-100 text-gray-700 rounded-full text-center font-semibold mr-3 leading-8">
                      {choiceId}
                    </span>
                    {choice.text || choice}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hint Display */}
          {showHint && (
            <div className="mb-6 p-4 bg-secondary bg-opacity-10 border border-secondary rounded-xl">
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 text-secondary mr-2" />
                <span className="font-semibold text-secondary">Hint</span>
              </div>
              <p className="text-gray-700">
                {currentQuestion.explanation || "Think about the key concepts and eliminate obviously wrong answers."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={handleSkipQuestion}
              disabled={submitAnswerMutation.isPending}
            >
              Skip Question
            </Button>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={handleGetHint}
                disabled={hintsUsed >= 3 || submitAnswerMutation.isPending}
                className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Hint
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
        </CardContent>
      </Card>
    </div>
  );
}
