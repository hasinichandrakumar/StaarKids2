import { useQuery } from "@tanstack/react-query";
import { ClipboardDocumentListIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Calculator, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MockExamsTabProps {
  grade: number;
}

export default function MockExamsTab({ grade }: MockExamsTabProps) {
  const { data: allExams } = useQuery({
    queryKey: ["/api/exams", grade],
    queryFn: () => fetch(`/api/exams/${grade}`).then(res => res.json())
  });

  const { data: examHistory } = useQuery({
    queryKey: ["/api/exams/history", grade],
    queryFn: () => fetch(`/api/exams/history?grade=${grade}`).then(res => res.json()),
    enabled: !!grade
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

  // Filter exams by subject for the selected grade
  const mathExams = Array.isArray(allExams) ? allExams.filter((exam: any) => exam.subject === "math" && exam.grade === grade) : [];
  const readingExams = Array.isArray(allExams) ? allExams.filter((exam: any) => exam.subject === "reading" && exam.grade === grade) : [];

  // Filter exam history by subject
  const mathHistory = Array.isArray(examHistory) ? examHistory.filter((exam: any) => exam.subject === "math") : [];
  const readingHistory = Array.isArray(examHistory) ? examHistory.filter((exam: any) => exam.subject === "reading") : [];

  const cleanExamName = (name: string) => {
    return name
      .replace(/\s+1+\s*$/, '')
      .replace(/Practice\s*1+/g, 'Practice')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleStartExam = (examId: number, examName: string) => {
    if (confirm(`Start "${cleanExamName(examName)}"? This will begin a timed practice exam.`)) {
      // Direct navigation to exam page - authentication handled there
      window.open(`/exam/${examId}`, '_blank');
    }
  };

  const renderExamCard = (exam: any) => (
    <div key={exam.id} className="border border-gray-200 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-700">{cleanExamName(exam.name)}</h4>
        <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
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
        onClick={() => handleStartExam(exam.id, exam.name)}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          exam.subject === "math" 
            ? "bg-primary text-white hover:bg-primary/90" 
            : "bg-secondary text-white hover:bg-secondary/90"
        }`}
      >
        Start Test
      </Button>
    </div>
  );

  const renderHistoryCard = (exam: any) => {
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
  };

  const renderEmptyState = (subject: string, isHistory: boolean = false) => (
    <div className="text-center py-8 text-gray-500">
      <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p>
        {isHistory 
          ? `No ${subject} test history yet` 
          : `No ${subject} tests available for grade ${grade}`
        }
      </p>
      <p className="text-sm mt-2">
        {isHistory 
          ? `Take your first ${subject} test to see results here!`
          : "Check back later for new tests!"
        }
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Available Tests */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-6">Available STAAR Tests</h3>
          <Tabs defaultValue="math" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="math" className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Math ({mathExams.length})
              </TabsTrigger>
              <TabsTrigger value="reading" className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Reading ({readingExams.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="math" className="space-y-4">
              {mathExams.length > 0 ? (
                mathExams.map(renderExamCard)
              ) : (
                renderEmptyState("Math")
              )}
            </TabsContent>
            
            <TabsContent value="reading" className="space-y-4">
              {readingExams.length > 0 ? (
                readingExams.map(renderExamCard)
              ) : (
                renderEmptyState("Reading")
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Test History */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-700 mb-6">Test History</h3>
          <Tabs defaultValue="math" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="math" className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Math ({mathHistory.length})
              </TabsTrigger>
              <TabsTrigger value="reading" className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Reading ({readingHistory.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="math" className="space-y-4">
              {mathHistory.length > 0 ? (
                mathHistory.map(renderHistoryCard)
              ) : (
                renderEmptyState("Math", true)
              )}
            </TabsContent>
            
            <TabsContent value="reading" className="space-y-4">
              {readingHistory.length > 0 ? (
                readingHistory.map(renderHistoryCard)
              ) : (
                renderEmptyState("Reading", true)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
