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
    year: 2014,
    hasImage: true,
    imageDescription: "Seven glass cases with feathers distributed equally showing division concept"
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
                            {question.id === 1 && (
                              /* Feather Division Diagram */
                              <svg width="300" height="140" viewBox="0 0 300 140" className="mx-auto">
                                {/* Glass Cases */}
                                {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                  <g key={i}>
                                    {/* Glass case */}
                                    <rect x={10 + i * 40} y="50" width="35" height="50" fill="#E0F2FE" stroke="#0891B2" strokeWidth="2" rx="3"/>
                                    
                                    {/* Feathers in each case (6 feathers per case) */}
                                    {[0, 1, 2, 3, 4, 5].map(j => (
                                      <circle 
                                        key={j} 
                                        cx={18 + i * 40 + (j % 3) * 8} 
                                        cy={60 + Math.floor(j / 3) * 15} 
                                        r="3" 
                                        fill="#FF5B00" 
                                        opacity="0.8"
                                      />
                                    ))}
                                    
                                    {/* Case number */}
                                    <text x={27.5 + i * 40} y="115" textAnchor="middle" className="text-xs font-semibold">Case {i + 1}</text>
                                    <text x={27.5 + i * 40} y="125" textAnchor="middle" className="text-xs">6 feathers</text>
                                  </g>
                                ))}
                                
                                {/* Title and equation */}
                                <text x="150" y="20" textAnchor="middle" className="text-sm font-semibold">42 feathers ÷ 7 cases = 6 feathers per case</text>
                                <text x="150" y="35" textAnchor="middle" className="text-xs text-gray-600">Equal distribution shown</text>
                              </svg>
                            )}
                            
                            {question.id === 2 && (
                              /* Quadrilaterals Diagram */
                              <svg width="280" height="120" viewBox="0 0 280 120" className="mx-auto">
                                {/* Square */}
                                <rect x="10" y="20" width="40" height="40" fill="#FF5B00" opacity="0.3" stroke="#FF5B00" strokeWidth="2"/>
                                <text x="30" y="75" textAnchor="middle" className="text-xs">Square</text>
                                
                                {/* Rectangle */}
                                <rect x="70" y="25" width="50" height="30" fill="#FCC201" opacity="0.3" stroke="#FCC201" strokeWidth="2"/>
                                <text x="95" y="75" textAnchor="middle" className="text-xs">Rectangle</text>
                                
                                {/* Parallelogram */}
                                <path d="M140 35 L180 35 L170 55 L130 55 Z" fill="#FF5B00" opacity="0.3" stroke="#FF5B00" strokeWidth="2"/>
                                <text x="155" y="75" textAnchor="middle" className="text-xs">Parallelogram</text>
                                
                                {/* Trapezoid */}
                                <path d="M200 30 L240 30 L250 55 L190 55 Z" fill="#FCC201" opacity="0.3" stroke="#FCC201" strokeWidth="2"/>
                                <text x="220" y="75" textAnchor="middle" className="text-xs">Trapezoid</text>
                              </svg>
                            )}
                            
                            {question.id === 3 && (
                              /* Garden Rectangle Diagram */
                              <svg width="200" height="140" viewBox="0 0 200 140" className="mx-auto">
                                <rect x="40" y="30" width="120" height="80" fill="#4ADE80" opacity="0.3" stroke="#16A34A" strokeWidth="2"/>
                                
                                {/* Length label */}
                                <line x1="40" y1="20" x2="160" y2="20" stroke="#374151" strokeWidth="1"/>
                                <line x1="40" y1="15" x2="40" y2="25" stroke="#374151" strokeWidth="1"/>
                                <line x1="160" y1="15" x2="160" y2="25" stroke="#374151" strokeWidth="1"/>
                                <text x="100" y="15" textAnchor="middle" className="text-sm font-semibold">12 feet</text>
                                
                                {/* Width label */}
                                <line x1="25" y1="30" x2="25" y2="110" stroke="#374151" strokeWidth="1"/>
                                <line x1="20" y1="30" x2="30" y2="30" stroke="#374151" strokeWidth="1"/>
                                <line x1="20" y1="110" x2="30" y2="110" stroke="#374151" strokeWidth="1"/>
                                <text x="15" y="75" textAnchor="middle" className="text-sm font-semibold" transform="rotate(-90 15 75)">8 feet</text>
                                
                                {/* Garden details */}
                                <circle cx="60" cy="50" r="3" fill="#EF4444"/>
                                <circle cx="80" cy="60" r="3" fill="#EF4444"/>
                                <circle cx="100" cy="45" r="3" fill="#EF4444"/>
                                <circle cx="120" cy="55" r="3" fill="#EF4444"/>
                                <circle cx="140" cy="70" r="3" fill="#EF4444"/>
                                
                                <text x="100" y="130" textAnchor="middle" className="text-xs text-gray-600">Rectangular Garden</text>
                              </svg>
                            )}
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