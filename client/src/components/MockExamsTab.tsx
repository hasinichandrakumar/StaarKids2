import { useQuery } from "@tanstack/react-query";
import { ClipboardDocumentListIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MockExamsTabProps {
  grade: number;
}

export default function MockExamsTab({ grade }: MockExamsTabProps) {
  const { data: exams } = useQuery({
    queryKey: ["/api/exams", grade],
  });

  const { data: examHistory } = useQuery({
    queryKey: ["/api/exams/history"],
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "border-success";
    if (score >= 70) return "border-secondary";
    return "border-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 70) return "text-secondary";
    return "text-red-500";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Available Tests */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-6">Available Practice Tests</h3>
          {exams && exams.length > 0 ? (
            <div className="space-y-4">
              {exams.map((exam: any) => (
                <div key={exam.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700">{exam.name}</h4>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Grade {exam.grade}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <ClipboardDocumentListIcon className="w-4 h-4 mr-1" />
                    {exam.totalQuestions} questions
                    {exam.timeLimit && (
                      <>
                        <ClockIcon className="w-4 h-4 ml-4 mr-1" />
                        {exam.timeLimit} minutes
                      </>
                    )}
                  </p>
                  <Button 
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      exam.subject === "math" 
                        ? "bg-primary text-white hover:bg-primary/90" 
                        : "bg-secondary text-white hover:bg-secondary/90"
                    }`}
                  >
                    Start Test
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No practice tests available for grade {grade}</p>
              <p className="text-sm mt-2">Check back later for new tests!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test History */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-6">Test History</h3>
          {examHistory && examHistory.length > 0 ? (
            <div className="space-y-4">
              {examHistory.map((exam: any) => {
                const score = Math.round((exam.correctAnswers / exam.totalQuestions) * 100);
                return (
                  <div key={exam.id} className={`border-l-4 bg-gray-50 p-4 rounded-r-xl ${getScoreColor(score)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-700">{exam.examName}</h4>
                      <span className={`text-lg font-bold ${getScoreTextColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {exam.completedAt ? new Date(exam.completedAt).toLocaleDateString() : "In Progress"}
                      </span>
                      <Button variant="link" className="text-primary hover:underline p-0 h-auto font-medium">
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No test history yet</p>
              <p className="text-sm mt-2">Take your first practice test to see your results here!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
