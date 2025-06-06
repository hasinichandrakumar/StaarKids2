import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

export default function ExamPage() {
  const [match, params] = useRoute("/exam/:examId");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const queryClient = useQueryClient();

  const examId = params?.examId ? parseInt(params.examId) : null;

  const { data: exam, isLoading } = useQuery({
    queryKey: ["/api/exams/details", examId],
    enabled: !!examId,
    queryFn: () => fetch(`/api/exams/details/${examId}`).then(res => res.json()),
  });

  const submitExamMutation = useMutation({
    mutationFn: async (examData: any) => {
      return apiRequest("POST", "/api/exams/submit", examData);
    },
    onSuccess: () => {
      setExamCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
    },
  });

  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !examCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted, timeRemaining, examCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleAnswerSelect = (questionIndex: number, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerId
    }));
  };

  const handleSubmitExam = () => {
    const answers = exam?.questions?.map((question: any, index: number) => ({
      questionId: question.id,
      selectedAnswer: selectedAnswers[index] || "",
      isCorrect: selectedAnswers[index] === question.correctAnswer
    })) || [];

    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / answers.length) * 100);

    submitExamMutation.mutate({
      examId,
      answers,
      score,
      timeSpent: 3600 - timeRemaining,
      completed: true
    });
  };

  const goToHome = () => {
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Exam...</h3>
            <p className="text-gray-600">Preparing your STAAR practice test.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4 text-red-600">Exam Not Found</h3>
            <p className="mb-4">The requested exam could not be found.</p>
            <Button onClick={goToHome}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (examCompleted) {
    const correctAnswers = Object.values(selectedAnswers).filter((answer, index) => 
      answer === exam.questions[index]?.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / exam.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-green-700">
              Exam Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">{score}%</div>
              <p className="text-lg text-gray-700">
                You got {correctAnswers} out of {exam.questions.length} questions correct
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600">Time Spent</div>
                <div className="text-lg font-semibold">{formatTime(3600 - timeRemaining)}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600">Accuracy</div>
                <div className="text-lg font-semibold">{score}%</div>
              </div>
            </div>
            <Button onClick={goToHome} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {exam.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-4">Exam Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Questions</div>
                  <div className="text-2xl font-bold text-blue-600">{exam.questions?.length || 0}</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Time Limit</div>
                  <div className="text-2xl font-bold text-green-600">60 min</div>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Subject</div>
                  <div className="text-2xl font-bold text-purple-600 capitalize">{exam.subject}</div>
                </div>
              </div>
              <div className="text-left bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• You can navigate between questions using the navigation buttons</li>
                  <li>• Your exam will be automatically submitted when time runs out</li>
                  <li>• Make sure you have a stable internet connection</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={goToHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={handleStartExam} className="bg-blue-600 hover:bg-blue-700">
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{exam.name}</h1>
              <span className="text-gray-500">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
              <Button 
                onClick={handleSubmitExam}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>

        {/* Question */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 leading-relaxed">
              {currentQuestion.questionText}
            </h3>

            <div className="space-y-3 mb-8">
              {currentQuestion.answerChoices.map((choice: any) => (
                <button
                  key={choice.id}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, choice.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestionIndex] === choice.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-medium">
                      {choice.id}
                    </span>
                    <span className="flex-1">{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous Question
              </Button>

              <div className="text-sm text-gray-500">
                {Object.keys(selectedAnswers).length} of {exam.questions.length} answered
              </div>

              <Button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                disabled={currentQuestionIndex === exam.questions.length - 1}
              >
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}