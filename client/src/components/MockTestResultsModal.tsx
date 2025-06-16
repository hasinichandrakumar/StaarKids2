import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, CheckCircle, XCircle, Clock, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MockTestResultsModalProps {
  examAttemptId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MockTestResultsModal({ examAttemptId, isOpen, onClose }: MockTestResultsModalProps) {
  const [showAnswerDetails, setShowAnswerDetails] = useState(true);

  const { data: examDetails, isLoading } = useQuery({
    queryKey: ["/api/exam-attempts", examAttemptId, "details"],
    enabled: isOpen && examAttemptId > 0,
  });

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading exam results...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4 text-red-600">Results Not Found</h3>
            <p className="mb-4">Unable to load exam results.</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { attempt, exam, answers } = examDetails;
  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const totalQuestions = answers.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  const timeSpentMinutes = Math.round((attempt.timeSpent || 0));

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent work! You're mastering this material.";
    if (percentage >= 80) return "Great job! You're doing very well.";
    if (percentage >= 70) return "Good effort! Keep practicing to improve.";
    return "Keep studying and practicing. You've got this!";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl mx-4 max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{exam.name} Results</h2>
              <p className="text-gray-600">Grade {exam.grade} • {exam.subject}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(scorePercentage)}`}>
                  {scorePercentage}%
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {correctAnswers}
                </div>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {totalQuestions - correctAnswers}
                </div>
                <p className="text-sm text-gray-600">Incorrect Answers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {timeSpentMinutes}m
                </div>
                <p className="text-sm text-gray-600">Time Spent</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Message */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <p className="text-blue-800 font-medium">{getPerformanceMessage(scorePercentage)}</p>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="mb-6">
            <Button
              onClick={() => setShowAnswerDetails(!showAnswerDetails)}
              variant="outline"
              className="w-full"
            >
              {showAnswerDetails ? "Hide" : "Show"} Answer Details
            </Button>
          </div>

          {/* Detailed Answer Review */}
          {showAnswerDetails && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Question by Question Review</h3>
              
              {answers.map((answer, index) => (
                <Card key={index} className={`border-l-4 ${answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-semibold text-gray-700">
                          Question {answer.questionOrder}
                        </span>
                        <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                          {answer.isCorrect ? "Correct" : "Incorrect"}
                        </Badge>
                        {answer.skipped && (
                          <Badge variant="secondary">Skipped</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {answer.timeSpent ? `${Math.round(answer.timeSpent / 60)}m ${answer.timeSpent % 60}s` : "No time recorded"}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-4">
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {answer.question.questionText}
                      </p>
                    </div>

                    {/* Question Image */}
                    {answer.question.hasImage && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex justify-center">
                          <img 
                            src={`/api/question-svg/${answer.question.id}`}
                            alt={answer.question.imageDescription || "Question diagram"}
                            className="max-w-full h-auto rounded shadow-sm"
                            style={{ maxHeight: '200px' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('.fallback-text');
                              if (fallback) {
                                fallback.textContent = answer.question.imageDescription || "Visual element described in question";
                                (fallback as HTMLElement).style.display = 'block';
                              }
                            }}
                          />
                          <div className="fallback-text hidden text-gray-600 italic text-center p-4">
                            {answer.question.imageDescription}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Answer Choices */}
                    <div className="space-y-2">
                      {JSON.parse(answer.question.answerChoices as string).map((choice: any) => {
                        const isSelected = choice.id === answer.selectedAnswer;
                        const isCorrect = choice.id === answer.correctAnswer;
                        
                        let choiceStyle = "p-3 rounded-lg border ";
                        if (isCorrect) {
                          choiceStyle += "bg-green-50 border-green-200 text-green-800";
                        } else if (isSelected && !isCorrect) {
                          choiceStyle += "bg-red-50 border-red-200 text-red-800";
                        } else {
                          choiceStyle += "bg-gray-50 border-gray-200 text-gray-600";
                        }

                        return (
                          <div key={choice.id} className={choiceStyle}>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{choice.id}) {choice.text}</span>
                              <div className="flex items-center space-x-2">
                                {isSelected && !answer.skipped && (
                                  <Badge variant="outline" className="text-xs">Your Answer</Badge>
                                )}
                                {isCorrect && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                                {isSelected && !isCorrect && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {answer.question.explanation && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                        <p className="text-blue-700">{answer.question.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="text-sm text-gray-500">
              Completed on {new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString()}
            </div>
            <div className="space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close Results
              </Button>
              <Button onClick={() => window.print()}>
                Print Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}