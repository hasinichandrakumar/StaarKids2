import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, BookOpen, CheckCircle, Star, Target } from "lucide-react";

interface SampleQuestion {
  id: number;
  grade: number;
  subject: "math" | "reading";
  teksStandard: string;
  questionText: string;
  answerChoices: string[];
  correctAnswer: string;
  category: string;
  isFromRealSTAAR: boolean;
  year: number;
  hasImage?: boolean;
  imageDescription?: string;
  passage?: {
    title: string;
    text: string;
  };
}

const SAMPLE_QUESTIONS: SampleQuestion[] = [
  // Math Sample Questions
  {
    id: 1,
    grade: 3,
    subject: "math",
    teksStandard: "3.4K",
    questionText: "Sofia will arrange 42 feathers into 7 glass cases for her collection. There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?",
    answerChoices: [
      "A. 42 + 7 = 6",
      "B. 42 ÷ 7 = 49", 
      "C. 42 × 7 = 294",
      "D. 42 ÷ 7 = 35"
    ],
    correctAnswer: "B",
    category: "Number & Operations",
    isFromRealSTAAR: true,
    year: 2014
  },
  {
    id: 2,
    grade: 4,
    subject: "math", 
    teksStandard: "4.5D",
    questionText: "The figures below share a characteristic. Which statement best describes these figures?",
    answerChoices: [
      "A. They are all trapezoids.",
      "B. They are all rectangles.", 
      "C. They are all squares.",
      "D. They are all quadrilaterals."
    ],
    correctAnswer: "D",
    category: "Geometry",
    isFromRealSTAAR: true,
    year: 2013,
    hasImage: true,
    imageDescription: "Multiple geometric shapes including squares, rectangles, parallelograms, and other quadrilaterals"
  },
  {
    id: 3,
    grade: 5,
    subject: "math",
    teksStandard: "5.4H", 
    questionText: "A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?",
    answerChoices: [
      "A. 20 square feet",
      "B. 40 square feet",
      "C. 96 square feet", 
      "D. 192 square feet"
    ],
    correctAnswer: "C",
    category: "Measurement",
    isFromRealSTAAR: true,
    year: 2016,
    hasImage: true,
    imageDescription: "A rectangular diagram showing a garden with labeled dimensions of 12 feet by 8 feet"
  },
  // Reading Sample Questions
  {
    id: 4,
    grade: 3,
    subject: "reading",
    teksStandard: "3.8A",
    questionText: "Based on the story 'Lizard Problems', what is Amy's main problem at the beginning?",
    answerChoices: [
      "A. She doesn't like her new teacher.",
      "B. She is afraid of the classroom lizard.",
      "C. She doesn't want to sit near Trent.", 
      "D. She wants to change classes."
    ],
    correctAnswer: "B", 
    category: "Comprehension",
    isFromRealSTAAR: true,
    year: 2016,
    passage: {
      title: "Lizard Problems",
      text: "Amy walked into her new third-grade classroom and stopped. There, sitting in a glass tank near the window, was a large green lizard. Amy had never seen a real lizard before, and she didn't like the way it was looking at her with its beady black eyes.\n\n'That's our class pet, Iggy,' said Mrs. Chen, Amy's new teacher. 'He's very friendly.'\n\nAmy wasn't so sure about that. The lizard seemed to be staring right at her. She quickly found an empty desk as far away from the lizard as possible."
    }
  },
  {
    id: 5,
    grade: 4,
    subject: "reading",
    teksStandard: "4.6B", 
    questionText: "According to the passage 'The Puppy Bowl', why was the Puppy Bowl created?",
    answerChoices: [
      "A. To train puppies for television.",
      "B. To compete with the Super Bowl.",
      "C. To provide entertainment during the Super Bowl.",
      "D. To help animals find homes."
    ],
    correctAnswer: "C",
    category: "Comprehension", 
    isFromRealSTAAR: true,
    year: 2016,
    passage: {
      title: "The Puppy Bowl",
      text: "Every year on Super Bowl Sunday, millions of people gather to watch the big football game. But not everyone is interested in football. That's why Animal Planet created the Puppy Bowl.\n\nThe Puppy Bowl features adorable puppies playing in a miniature football stadium. They chase toys, tumble around, and have fun while the game is happening. The show provides light-hearted entertainment for viewers who want something cute and fun to watch during the Super Bowl.\n\nThe puppies that participate in the Puppy Bowl are all from animal shelters and rescue organizations. Many of them find loving homes after appearing on the show."
    }
  },
  {
    id: 6,
    grade: 5,
    subject: "reading", 
    teksStandard: "5.6A",
    questionText: "In 'Princess for a Week', what does Roddy want to prove to his mother?",
    answerChoices: [
      "A. That he can build a doghouse.",
      "B. That he is responsible enough to care for a dog.",
      "C. That he can make friends easily.",
      "D. That he deserves a reward."
    ],
    correctAnswer: "B",
    category: "Comprehension",
    isFromRealSTAAR: true, 
    year: 2015,
    passage: {
      title: "Princess for a Week",
      text: "Roddy had been asking his mother for a dog for months. 'Dogs are a big responsibility,' she always said. 'You have to feed them, walk them, and clean up after them every single day.'\n\n'I know I can do it!' Roddy would reply. But his mother wasn't convinced.\n\nThen one day, Roddy's neighbor Mrs. Garcia asked if he could watch her dog Princess while she was out of town for a week. This was Roddy's chance to show his mother that he was ready for the responsibility of having his own dog."
    }
  }
];

export default function SampleQuestionsSection() {
  const [selectedSubject, setSelectedSubject] = useState<"math" | "reading">("math");
  const [selectedGrade, setSelectedGrade] = useState(3);
  const [showAnswer, setShowAnswer] = useState<number | null>(null);

  const filteredQuestions = SAMPLE_QUESTIONS.filter(q => 
    q.subject === selectedSubject && q.grade === selectedGrade
  );

  const toggleAnswer = (questionId: number) => {
    setShowAnswer(showAnswer === questionId ? null : questionId);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sample STAAR Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience authentic STAAR test questions from past exams. All questions are based on 
            real Texas state assessments to ensure accurate practice.
          </p>
        </div>

        {/* Subject and Grade Selection */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex bg-white rounded-lg p-2 shadow-sm border">
            <Button
              variant={selectedSubject === "math" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedSubject("math")}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Math
            </Button>
            <Button
              variant={selectedSubject === "reading" ? "default" : "ghost"} 
              size="sm"
              onClick={() => setSelectedSubject("reading")}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Reading
            </Button>
          </div>

          <div className="flex bg-white rounded-lg p-2 shadow-sm border">
            {[3, 4, 5].map(grade => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedGrade(grade)}
              >
                Grade {grade}
              </Button>
            ))}
          </div>
        </div>

        {/* Sample Questions */}
        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      question.subject === 'math' 
                        ? 'bg-orange-100' 
                        : 'bg-blue-100'
                    }`}>
                      {question.subject === 'math' ? (
                        <Calculator className="w-5 h-5 text-orange-600" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Grade {question.grade} {question.subject === "math" ? "Math" : "Reading"}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        TEKS {question.teksStandard} • {question.category}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Star className="w-3 h-3 mr-1" />
                      Authentic {question.year} STAAR
                    </Badge>
                    {question.hasImage && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        <Target className="w-3 h-3 mr-1" />
                        Visual
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {question.subject === 'reading' ? (
                  /* Reading Layout: Passage and Question */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Reading Passage */}
                    <div className="lg:border-r lg:pr-6">
                      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">
                        {question.passage?.title}
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-h-64 overflow-y-auto">
                        <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                          {question.passage?.text}
                        </div>
                      </div>
                    </div>

                    {/* Question and Choices */}
                    <div className="lg:pl-6">
                      <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Question</h4>
                      <p className="text-base font-medium text-gray-800 mb-4 leading-relaxed">
                        {question.questionText}
                      </p>
                      
                      <div className="space-y-2">
                        {question.answerChoices.map((choice, index) => {
                          const choiceId = choice.charAt(0);
                          const isCorrect = choiceId === question.correctAnswer;
                          const showAnswerState = showAnswer === question.id;
                          
                          return (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border transition-all ${
                                showAnswerState && isCorrect
                                  ? 'bg-green-50 border-green-300 text-green-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center">
                                {showAnswerState && isCorrect && (
                                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                                )}
                                <span className="text-sm">{choice}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Math Layout: Traditional Format */
                  <div>
                    <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                      {question.questionText}
                    </p>

                    {question.hasImage && (
                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-center">
                          <div className="inline-block bg-white p-3 rounded border">
                            <p className="text-sm text-gray-600 italic">
                              {question.imageDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {question.answerChoices.map((choice, index) => {
                        const choiceId = choice.charAt(0);
                        const isCorrect = choiceId === question.correctAnswer;
                        const showAnswerState = showAnswer === question.id;
                        
                        return (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border transition-all ${
                              showAnswerState && isCorrect
                                ? 'bg-green-50 border-green-300 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center">
                              {showAnswerState && isCorrect && (
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              )}
                              <span className="text-sm">{choice}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Show Answer Button */}
                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAnswer(question.id)}
                    className="text-sm"
                  >
                    {showAnswer === question.id ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                  
                  {showAnswer === question.id && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Correct Answer:</strong> {question.correctAnswer}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        This question tests {question.category} skills according to TEKS standard {question.teksStandard}.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Practicing?</h3>
              <p className="text-orange-100 mb-6">
                Access thousands more authentic STAAR questions with detailed explanations, 
                progress tracking, and personalized study plans.
              </p>
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                Start Free Practice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}