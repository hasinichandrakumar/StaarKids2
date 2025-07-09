import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, X, Clock, CheckCircle, XCircle } from "lucide-react";
import { StarIcon, SparklesIcon } from "@heroicons/react/24/solid";

// SVG Display Component
function SvgDisplay({ svgContent, description, questionId, hasImage, subject }: { 
  svgContent?: string | null; 
  description?: string; 
  questionId?: number;
  hasImage?: boolean;
  subject?: string;
}) {
  // Don't show visuals for reading questions unless they have explicit SVG content
  if (subject === "reading" && !svgContent) {
    return null;
  }

  // For math questions, show visual if hasImage is true OR if svgContent exists
  const shouldShowVisual = svgContent || (subject === "math" && hasImage);
  
  if (!shouldShowVisual) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-center">
        <div className="inline-block bg-white p-3 rounded border">
          {svgContent ? (
            <div 
              className="w-full h-64 flex items-center justify-center bg-white"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <img 
              src={`/api/question-svg/${questionId}`}
              alt={description || "Question diagram"}
              className="w-full h-64 object-contain bg-white"
              style={{ maxWidth: '600px' }}
            />
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}

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
        return { success: true, authenticated: true };
      } catch (error: any) {
        // If authentication fails, use demo endpoint
        if (error.status === 401) {
          try {
            await fetch("/api/demo/practice/attempt", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(attemptData)
            });
            return { success: true, authenticated: false };
          } catch (demoError) {
            console.log("Demo practice attempt failed:", demoError);
            return { success: false, error: "Demo practice failed" };
          }
        } else {
          console.log("Practice attempt failed:", error);
          return { success: false, error: error.message };
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/practice/history"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats", grade, subject] });
    },
  });

  const getDetailedExplanation = async (question: any, userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
    setLoadingExplanation(true);
    try {
      // First try to get Nova's detailed explanation
      const response = await fetch("/api/nova-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Please provide a detailed, step-by-step explanation for this ${subject} question: "${question.questionText}" 

The correct answer is "${correctAnswer}" and I selected "${userAnswer}". ${isCorrect ? 'I got it right!' : 'I got it wrong.'}

Please explain:
1. What concept this question tests
2. Step-by-step solution process
3. Why the correct answer is right
4. Common mistakes to avoid
5. Tips for similar problems

Make it appropriate for a Grade ${grade} student.`,
          grade
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiExplanation(data.response);
      } else {
        // Fallback to detailed built-in explanations
        const detailedExplanation = generateDetailedExplanation(question, userAnswer, correctAnswer, isCorrect);
        setAiExplanation(detailedExplanation);
      }
    } catch (error) {
      console.error("Error getting explanation:", error);
      // Generate comprehensive fallback explanation
      const detailedExplanation = generateDetailedExplanation(question, userAnswer, correctAnswer, isCorrect);
      setAiExplanation(detailedExplanation);
    } finally {
      setLoadingExplanation(false);
    }
  };

  const generateDetailedExplanation = (question: any, userAnswer: string, correctAnswer: string, isCorrect: boolean) => {
    const questionText = question.questionText.toLowerCase();
    const category = question.category?.toLowerCase() || '';
    const teks = question.teksStandard || '';

    // Math explanations
    if (subject === 'math') {
      // Fraction problems
      if (questionText.includes('fraction') && questionText.includes('equivalent')) {
        return `**Understanding Equivalent Fractions**

**What this tests:** TEKS ${teks} - Understanding that fractions can represent the same amount even with different denominators.

**Step-by-Step Solution:**
1. **Identify what each fraction represents:** Look at each fraction model carefully
2. **Count the shaded parts:** In each model, count how many parts are shaded
3. **Count the total parts:** Count how many equal parts each model is divided into
4. **Compare the fractions:** 
   - 1/4 means 1 out of 4 equal parts
   - 2/8 means 2 out of 8 equal parts (same as 1/4)
   - 3/12 means 3 out of 12 equal parts (same as 1/4)

**Why "${correctAnswer}" is correct:** All three fractions represent exactly the same amount - one quarter of the whole shape.

**Visual Check:** If you color in 1/4, 2/8, and 3/12 of identical shapes, they will have the same amount of coloring.

**Common Mistakes to Avoid:**
- Don't just look at the numbers - visualize the actual amounts
- Remember that bigger denominators don't always mean bigger fractions

**Tips for Success:** Always think "What part of the whole does this represent?" when working with fractions.`;
      }

      // Area problems
      if (questionText.includes('area') && (questionText.includes('rectangle') || questionText.includes('garden'))) {
        const dimensions = questionText.match(/(\d+)\s*feet?\s*.*?(\d+)\s*feet?/);
        const length = dimensions ? dimensions[1] : '';
        const width = dimensions ? dimensions[2] : '';
        
        return `**Calculating Rectangular Area**

**What this tests:** TEKS ${teks} - Finding the area of rectangles using length × width.

**Step-by-Step Solution:**
1. **Identify the formula:** Area of rectangle = Length × Width
2. **Find the measurements:** 
   - Length = ${length} feet
   - Width = ${width} feet
3. **Multiply the dimensions:** ${length} × ${width} = ${parseInt(length) * parseInt(width)} square feet
4. **Include proper units:** Always write "square feet" for area

**Why "${correctAnswer}" is correct:** ${length} × ${width} = ${parseInt(length) * parseInt(width)} square feet

**Visual Understanding:** Imagine covering the garden with 1-foot square tiles. You'd need ${parseInt(length) * parseInt(width)} tiles total.

**Common Mistakes to Avoid:**
- Don't add length + width (that gives perimeter, not area)
- Don't forget to include "square" in your units
- Make sure you multiply, not add

**Memory Tip:** "Area = Length × Width" - think of it as "how many square units fit inside?"`;
      }

      // Pattern problems
      if (questionText.includes('pattern') || questionText.includes('sequence')) {
        return `**Understanding Number Patterns**

**What this tests:** TEKS ${teks} - Identifying and extending arithmetic patterns.

**Step-by-Step Solution:**
1. **Look for the pattern rule:** Compare each number to the next
2. **Find the difference:** What number is being added each time?
3. **Check your rule:** Apply the same difference throughout the sequence
4. **Extend the pattern:** Add the same difference to the last given number

**Pattern Analysis:**
- Look at the sequence in the question
- Find what's being added (or subtracted) each step
- Apply that same rule to find the next number

**Why "${correctAnswer}" is correct:** Following the established pattern rule gives us this answer.

**Common Mistakes to Avoid:**
- Don't assume it's always +1 or +2
- Check that your rule works for ALL numbers in the sequence
- Make sure you're adding the right amount

**Success Strategy:** Always verify your pattern rule works for every step before finding the next number.`;
      }

      // Bar graph problems
      if (questionText.includes('bar graph') || questionText.includes('graph')) {
        return `**Reading and Interpreting Bar Graphs**

**What this tests:** TEKS ${teks} - Analyzing data presented in bar graphs.

**Step-by-Step Solution:**
1. **Read the graph title and labels:** Understand what data is being shown
2. **Identify the scale:** Look at the numbers on the y-axis
3. **Read each bar height:** Find the value for each category
4. **Compare the data:** Look for differences between specific bars
5. **Calculate the answer:** Subtract to find "how many more"

**Graph Reading Skills:**
- Always start with the axis labels
- Match each bar to its category
- Read the height where the bar ends
- Double-check your reading

**Why "${correctAnswer}" is correct:** By comparing the specific bars mentioned in the question.

**Common Mistakes to Avoid:**
- Don't guess at bar heights - read them carefully
- Make sure you're comparing the right categories
- Remember "how many more" means subtract

**Pro Tip:** Always trace from the top of each bar down to the scale to get accurate readings.`;
      }
    }

    // Reading comprehension explanations
    if (subject === 'reading') {
      return `**Reading Comprehension Strategy**

**What this tests:** TEKS ${teks} - ${category || 'Reading comprehension and analysis'}

**Step-by-Step Approach:**
1. **Read the passage carefully:** Look for key details and main ideas
2. **Identify the question type:** What kind of information is being asked?
3. **Find text evidence:** Look back at the passage for supporting details
4. **Eliminate wrong answers:** Cross out choices that don't match the text
5. **Choose the best answer:** Select the option most supported by the passage

**Reading Strategies:**
- Underline or highlight important information
- Pay attention to character thoughts and actions
- Look for cause and effect relationships
- Notice the author's purpose and tone

**Why "${correctAnswer}" is correct:** This answer is best supported by specific evidence in the text.

**Common Mistakes to Avoid:**
- Don't rely on outside knowledge - stick to what's in the passage
- Don't choose answers just because they sound good
- Always look for text evidence to support your choice

**Success Tips:** 
- Read the question first, then read the passage with that question in mind
- Always go back to the text to verify your answer choice`;
    }

    // General fallback explanation
    return `**Detailed Problem Analysis**

**What this tests:** TEKS ${teks} - ${category || 'Core academic skills'}

**Your Answer:** You selected "${userAnswer}"
**Correct Answer:** "${correctAnswer}"

**Step-by-Step Approach:**
1. **Understand the question:** Break down what's being asked
2. **Identify key information:** Find the important details
3. **Apply the right strategy:** Use the appropriate method or formula
4. **Check your work:** Verify your answer makes sense

**Why "${correctAnswer}" is correct:** This answer follows the proper solution method and matches the question requirements.

**Learning Strategy:**
- Practice similar problems to build confidence
- Always read questions carefully before answering
- Take your time and double-check your work

${isCorrect ? '**Great job!** You demonstrated strong understanding of this concept.' : '**Keep practicing!** Understanding these concepts takes time and effort.'}`;
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
      // Show detailed explanation for incorrect answer
      setShowExplanation(true);
      const userAnswerChoice = currentQuestion.answerChoices.find((choice: any) => (choice.id || choice) === selectedAnswer);
      const userAnswerText = userAnswerChoice?.text || userAnswerChoice || selectedAnswer;
      await getDetailedExplanation(currentQuestion, userAnswerText, currentQuestion.correctAnswer, false);
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



          {/* Question Content - Reading vs Math Layout */}
          <div className="mb-8">
            {subject === 'reading' ? (
              /* Reading Comprehension Layout: Text on Left, Questions on Right */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reading Passage on Left */}
                <div className="lg:border-r lg:pr-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    {currentQuestion.passage?.title || 'Reading Passage'}
                  </h4>
                  <div className="prose prose-lg max-w-none">
                    <div 
                      className="text-base leading-relaxed text-gray-800 bg-blue-50 p-6 rounded-lg border border-blue-200"
                      style={{ maxHeight: '500px', overflowY: 'auto' }}
                      dangerouslySetInnerHTML={{
                        __html: (currentQuestion.passage?.passageText || currentQuestion.questionText)
                          .replace(/\n\n/g, '</p><p class="mb-3">')
                          .replace(/\n/g, '<br/>')
                          .replace(/^/, '<p class="mb-3">')
                          .replace(/$/, '</p>')
                      }}
                    />
                  </div>
                </div>

                {/* Question and Answer Choices on Right */}
                <div className="lg:pl-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Question</h4>
                  
                  {/* Extract and display the actual question */}
                  <div className="mb-6">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">
                      {currentQuestion.questionText}
                    </p>
                  </div>

                  {/* Answer Choices */}
                  <div className="space-y-3">
                    {currentQuestion.answerChoices.map((choice: any, index: number) => {
                      const choiceId = choice.id || choice;
                      const choiceText = choice.text || choice;
                      
                      let buttonStyle = "";
                      let textStyle = "";
                      
                      if (showExplanation) {
                        if (choiceId === currentQuestion.correctAnswer) {
                          buttonStyle = "border-green-500 bg-green-50 hover:bg-green-100";
                          textStyle = "text-green-700";
                        } else if (choiceId === selectedAnswer) {
                          buttonStyle = "border-red-500 bg-red-50 hover:bg-red-100";
                          textStyle = "text-red-700";
                        } else {
                          buttonStyle = "border-gray-200 bg-gray-50";
                          textStyle = "text-gray-500";
                        }
                      } else {
                        if (selectedAnswer === choiceId) {
                          buttonStyle = "border-orange-300 bg-orange-50 hover:bg-orange-100";
                          textStyle = "text-orange-800";
                        } else {
                          buttonStyle = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                          textStyle = "text-gray-700";
                        }
                      }

                      return (
                        <button
                          key={choiceId}
                          onClick={() => !showExplanation && setSelectedAnswer(choiceId)}
                          disabled={showExplanation}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${buttonStyle} ${
                            showExplanation ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start">
                            <span className={`text-lg font-semibold mr-3 mt-0.5 ${textStyle}`}>{choiceId})</span>
                            <span className={`text-base leading-relaxed ${textStyle}`}>{choiceText}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Math Layout: Traditional Single Column */
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                  {currentQuestion.questionText}
                </h3>

                {/* Question Image/Diagram for Math */}
                <SvgDisplay 
                  svgContent={currentQuestion.svgContent} 
                  description={currentQuestion.imageDescription || "Question diagram"}
                  questionId={currentQuestion.id}
                  hasImage={currentQuestion.hasImage}
                  subject={subject}
                />

                {/* Answer Choices for Math */}
                <div className="space-y-3">
                  {currentQuestion.answerChoices.map((choice: any, index: number) => {
                    const choiceId = choice.id || choice;
                    const choiceText = choice.text || choice;
                    
                    let buttonStyle = "";
                    let textStyle = "";
                    
                    if (showExplanation) {
                      if (choiceId === currentQuestion.correctAnswer) {
                        buttonStyle = "border-green-500 bg-green-50 hover:bg-green-100";
                        textStyle = "text-green-700";
                      } else if (choiceId === selectedAnswer) {
                        buttonStyle = "border-red-500 bg-red-50 hover:bg-red-100";
                        textStyle = "text-red-700";
                      } else {
                        buttonStyle = "border-gray-200 bg-gray-50";
                        textStyle = "text-gray-500";
                      }
                    } else {
                      if (selectedAnswer === choiceId) {
                        buttonStyle = "border-orange-300 bg-orange-50 hover:bg-orange-100";
                        textStyle = "text-orange-800";
                      } else {
                        buttonStyle = "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                        textStyle = "text-gray-700";
                      }
                    }

                    return (
                      <button
                        key={choiceId}
                        onClick={() => !showExplanation && setSelectedAnswer(choiceId)}
                        disabled={showExplanation}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${buttonStyle} ${
                          showExplanation ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className={`text-lg font-semibold mr-4 ${textStyle}`}>{choiceId})</span>
                          <span className={`text-lg ${textStyle}`}>{choiceText}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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