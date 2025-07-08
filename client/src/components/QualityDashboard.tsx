import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QualityMetrics {
  averageScore: number;
  questionsNeedingReview: number;
  visualElements: number;
}

interface ReviewItem {
  questionId: string;
  priority: 'low' | 'medium' | 'high';
  issues: string[];
  suggestions: string[];
  timestamp: string;
  question: {
    grade: number;
    subject: string;
    category: string;
    questionText: string;
  };
}

export default function QualityDashboard() {
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [questionCount, setQuestionCount] = useState(5);
  const [generationResults, setGenerationResults] = useState<any>(null);

  // Fetch review queue
  const { data: reviewQueue } = useQuery({
    queryKey: ['/api/questions/review-queue'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleGenerateQualityQuestions = async () => {
    try {
      const result = await apiRequest('/api/questions/generate-quality', {
        method: 'POST',
        body: {
          grade: selectedGrade,
          subject: selectedSubject,
          count: questionCount,
          category: 'General'
        }
      });
      
      setGenerationResults(result);
    } catch (error) {
      console.error('Failed to generate quality questions:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quality Control Dashboard</h1>
        
        {/* Generation Controls */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Quality-Controlled Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={3}>Grade 3</option>
                <option value={4}>Grade 4</option>
                <option value={5}>Grade 5</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="math">Mathematics</option>
                <option value="reading">Reading</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            onClick={handleGenerateQualityQuestions}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
          >
            Generate with Quality Control
          </button>
        </div>

        {/* Generation Results */}
        {generationResults && (
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {(generationResults.qualityStats.averageScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Average Quality Score</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">
                  {generationResults.questions.length}
                </div>
                <div className="text-sm text-gray-600">Questions Generated</div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">
                  {generationResults.qualityStats.visualElements}
                </div>
                <div className="text-sm text-gray-600">With Visual Elements</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Generated Questions:</h4>
              {generationResults.questions.map((question: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-600">
                      {question.subject} • Grade {question.grade} • {question.category}
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.qualityScore >= 0.8 ? 'bg-green-100 text-green-800' :
                        question.qualityScore >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {(question.qualityScore * 100).toFixed(0)}% Quality
                      </span>
                      {question.needsReview && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          Needs Review
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-900 mb-2">{question.questionText}</p>
                  <div className="text-sm text-gray-600">
                    Correct Answer: {question.correctAnswer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Queue */}
        {reviewQueue && (
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quality Review Queue ({reviewQueue.pendingReviews} items)
            </h3>
            
            {reviewQueue.pendingReviews === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">✅</div>
                <p>All questions meet quality standards!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewQueue.queue.map((item: ReviewItem) => (
                  <div key={item.questionId} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm text-gray-600">
                          Question ID: {item.questionId} • {item.question.subject} • Grade {item.question.grade}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority.toUpperCase()} Priority
                      </span>
                    </div>
                    
                    <p className="text-gray-900 mb-3">{item.question.questionText}</p>
                    
                    {item.issues.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-red-700 mb-1">Issues Found:</h4>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {item.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {item.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-blue-700 mb-1">Suggestions:</h4>
                        <ul className="text-sm text-blue-600 list-disc list-inside">
                          {item.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}