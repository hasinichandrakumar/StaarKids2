import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Star, CheckCircle, RotateCcw, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WritingPrompt {
  id: number;
  grade: number;
  title: string;
  prompt: string;
  genre: string;
  timeLimit: number; // in minutes
  wordCountMin: number;
  wordCountMax: number;
  rubricPoints: string[];
  sampleResponse?: string;
  difficulty: "easy" | "medium" | "hard";
}

interface EssaySubmission {
  id: number;
  promptId: number;
  content: string;
  wordCount: number;
  timeSpent: number;
  score: number;
  feedback: string;
  submittedAt: string;
}

function EssaysTab() {
  const [selectedGrade, setSelectedGrade] = useState<number>(3);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [essayContent, setEssayContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submissions, setSubmissions] = useState<EssaySubmission[]>([]);
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sample STAAR writing prompts based on actual test formats
  const samplePrompts: WritingPrompt[] = [
    {
      id: 1,
      grade: 3,
      title: "My Favorite Place",
      prompt: "Think about a place that is special to you. It might be a room in your house, a place in your neighborhood, or somewhere you have visited. Write about this special place. Describe what makes it special and explain why you like being there. Use details to help your reader picture this place.",
      genre: "Personal Narrative",
      timeLimit: 45,
      wordCountMin: 100,
      wordCountMax: 300,
      difficulty: "easy",
      rubricPoints: [
        "Clear topic and purpose",
        "Descriptive details",
        "Personal connection",
        "Proper sentence structure",
        "Correct spelling and punctuation"
      ]
    },
    {
      id: 2,
      grade: 4,
      title: "The Best Day Ever",
      prompt: "Think about a day that was really special or exciting for you. It could be a birthday, a holiday, a vacation day, or any other day that was memorable. Write a story about this special day. Include details about what happened and explain why this day was so special to you.",
      genre: "Personal Narrative",
      timeLimit: 50,
      wordCountMin: 150,
      wordCountMax: 400,
      difficulty: "medium",
      rubricPoints: [
        "Engaging beginning",
        "Clear sequence of events",
        "Vivid descriptions",
        "Personal reflection",
        "Strong conclusion"
      ]
    },
    {
      id: 3,
      grade: 5,
      title: "School Improvement Proposal",
      prompt: "Think about one thing you would change about your school to make it better for students. Write an essay explaining what you would change and why this change would improve your school. Use specific reasons and examples to support your ideas. Try to convince your principal that this change would be good for the school.",
      genre: "Persuasive Essay",
      timeLimit: 60,
      wordCountMin: 200,
      wordCountMax: 500,
      difficulty: "hard",
      rubricPoints: [
        "Clear position statement",
        "Supporting reasons with examples",
        "Logical organization",
        "Persuasive language",
        "Strong conclusion with call to action"
      ]
    },
    {
      id: 4,
      grade: 3,
      title: "How to Make a Friend",
      prompt: "Think about what it takes to make a new friend. Write an essay that explains how to make a friend. Include specific steps and examples to help someone who is new to your school learn how to make friends.",
      genre: "Expository Essay",
      timeLimit: 45,
      wordCountMin: 100,
      wordCountMax: 300,
      difficulty: "medium",
      rubricPoints: [
        "Clear main idea",
        "Step-by-step explanation",
        "Helpful examples",
        "Organized structure",
        "Appropriate conclusion"
      ]
    },
    {
      id: 5,
      grade: 4,
      title: "Why Reading is Important",
      prompt: "Reading is an important skill that helps us in many ways. Write an essay explaining why reading is important. Use specific reasons and examples to support your ideas. Think about how reading helps you at school, at home, and in your daily life.",
      genre: "Expository Essay",
      timeLimit: 50,
      wordCountMin: 150,
      wordCountMax: 400,
      difficulty: "medium",
      rubricPoints: [
        "Clear thesis statement",
        "Multiple supporting reasons",
        "Specific examples",
        "Logical paragraph structure",
        "Effective conclusion"
      ]
    },
    {
      id: 6,
      grade: 5,
      title: "The Adventure Begins",
      prompt: "You discover a mysterious map in your attic that leads to an unknown place. Write a story about your adventure following this map. Include details about where the map leads you, what you discover, and what challenges you face along the way. Make your story exciting and interesting for your readers.",
      genre: "Creative Writing",
      timeLimit: 60,
      wordCountMin: 200,
      wordCountMax: 500,
      difficulty: "hard",
      rubricPoints: [
        "Engaging plot development",
        "Descriptive setting details",
        "Character development",
        "Dialogue and action",
        "Satisfying resolution"
      ]
    }
  ];

  useEffect(() => {
    const gradePrompts = samplePrompts.filter(p => p.grade === selectedGrade);
    setPrompts(gradePrompts);
    setSelectedPrompt(null);
    setEssayContent("");
    setIsWriting(false);
    setTimeElapsed(0);
  }, [selectedGrade]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWriting) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWriting]);

  const startWriting = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setEssayContent("");
    setTimeElapsed(0);
    setIsWriting(true);
  };

  const pauseWriting = () => {
    setIsWriting(false);
  };

  const resumeWriting = () => {
    setIsWriting(true);
  };

  const resetEssay = () => {
    setEssayContent("");
    setTimeElapsed(0);
    setIsWriting(false);
  };

  const submitEssay = async () => {
    if (!selectedPrompt) return;

    const wordCount = essayContent.trim().split(/\s+/).length;
    
    if (wordCount < selectedPrompt.wordCountMin) {
      toast({
        title: "Essay too short",
        description: `Your essay needs at least ${selectedPrompt.wordCountMin} words. Current count: ${wordCount}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate AI scoring (in real implementation, this would call an API)
      const score = Math.floor(Math.random() * 20) + 80; // 80-100 score
      const feedback = generateFeedback(essayContent, selectedPrompt, score);
      
      const newSubmission: EssaySubmission = {
        id: Date.now(),
        promptId: selectedPrompt.id,
        content: essayContent,
        wordCount,
        timeSpent: timeElapsed,
        score,
        feedback,
        submittedAt: new Date().toISOString()
      };

      setSubmissions(prev => [newSubmission, ...prev]);
      
      toast({
        title: "Essay submitted!",
        description: `Score: ${score}/100 - Great work!`
      });

      // Reset for next essay
      setSelectedPrompt(null);
      setEssayContent("");
      setIsWriting(false);
      setTimeElapsed(0);
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateFeedback = (content: string, prompt: WritingPrompt, score: number): string => {
    const wordCount = content.trim().split(/\s+/).length;
    const feedback = [];

    if (score >= 90) {
      feedback.push("Excellent work! Your essay demonstrates strong writing skills.");
    } else if (score >= 80) {
      feedback.push("Good job! Your essay meets most requirements.");
    } else {
      feedback.push("Keep practicing! Your writing shows promise.");
    }

    if (wordCount >= prompt.wordCountMin && wordCount <= prompt.wordCountMax) {
      feedback.push("Your essay length is appropriate for the assignment.");
    } else if (wordCount < prompt.wordCountMin) {
      feedback.push("Consider adding more details and examples to reach the minimum word count.");
    } else {
      feedback.push("Your essay is quite detailed - make sure all content directly supports your main idea.");
    }

    feedback.push("Continue practicing different types of writing to improve your skills!");

    return feedback.join(" ");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = () => {
    return essayContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  if (selectedPrompt) {
    return (
      <div className="space-y-6">
        {/* Writing Interface */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900">{selectedPrompt.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="outline">{selectedPrompt.genre}</Badge>
                  <Badge variant="outline">Grade {selectedPrompt.grade}</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(timeElapsed)} / {selectedPrompt.timeLimit}:00
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
                  Back to Prompts
                </Button>
                {isWriting ? (
                  <Button variant="outline" onClick={pauseWriting}>
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" onClick={resumeWriting}>
                    Resume
                  </Button>
                )}
                <Button variant="outline" onClick={resetEssay}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Prompt and Guidelines */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Writing Prompt</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedPrompt.prompt}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Rubric Points</h4>
                  <ul className="space-y-1">
                    {selectedPrompt.rubricPoints.map((point, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-1">Guidelines</h4>
                  <p className="text-sm text-blue-700">
                    Target: {selectedPrompt.wordCountMin}-{selectedPrompt.wordCountMax} words
                  </p>
                  <p className="text-sm text-blue-700">
                    Time limit: {selectedPrompt.timeLimit} minutes
                  </p>
                </div>
              </div>

              {/* Writing Area */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Your Essay</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Words: {getWordCount()}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((getWordCount() / selectedPrompt.wordCountMax) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <Textarea
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  placeholder="Start writing your essay here..."
                  className="min-h-[400px] text-base leading-relaxed resize-none"
                  disabled={!isWriting}
                />

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {getWordCount() < selectedPrompt.wordCountMin && (
                      <span className="text-orange-600">
                        {selectedPrompt.wordCountMin - getWordCount()} more words needed
                      </span>
                    )}
                    {getWordCount() >= selectedPrompt.wordCountMin && getWordCount() <= selectedPrompt.wordCountMax && (
                      <span className="text-green-600">Good length!</span>
                    )}
                    {getWordCount() > selectedPrompt.wordCountMax && (
                      <span className="text-red-600">
                        {getWordCount() - selectedPrompt.wordCountMax} words over limit
                      </span>
                    )}
                  </div>
                  
                  <Button 
                    onClick={submitEssay}
                    disabled={loading || getWordCount() < selectedPrompt.wordCountMin}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? "Submitting..." : "Submit Essay"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Essay Writing Practice</h2>
        <p className="text-lg text-gray-600">Practice STAAR writing with authentic prompts and instant feedback</p>
      </div>

      {/* Grade Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Grade Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {[3, 4, 5].map(grade => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? "default" : "outline"}
                onClick={() => setSelectedGrade(grade)}
                className={selectedGrade === grade ? "bg-gradient-to-r from-red-500 to-pink-600" : ""}
              >
                Grade {grade}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Writing Prompts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map(prompt => (
          <Card key={prompt.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{prompt.title}</CardTitle>
                <div className="flex space-x-2">
                  <Badge variant="outline">{prompt.genre}</Badge>
                  <Badge 
                    variant="outline"
                    className={
                      prompt.difficulty === 'easy' ? 'border-green-500 text-green-600' :
                      prompt.difficulty === 'medium' ? 'border-yellow-500 text-yellow-600' :
                      'border-red-500 text-red-600'
                    }
                  >
                    {prompt.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 line-clamp-3">{prompt.prompt}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {prompt.timeLimit} min
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {prompt.wordCountMin}-{prompt.wordCountMax} words
                </div>
              </div>

              <Button 
                onClick={() => startWriting(prompt)}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                Start Writing
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      {submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Essays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.slice(0, 3).map(submission => {
                const prompt = samplePrompts.find(p => p.id === submission.promptId);
                return (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{prompt?.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{submission.score}/100</Badge>
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{submission.feedback}</p>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span>{submission.wordCount} words</span>
                      <span>{formatTime(submission.timeSpent)}</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default EssaysTab;