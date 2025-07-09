import { InsertQuestion } from "../shared/schema";
import { AUTHENTIC_TEKS_STANDARDS } from "./staarAnalysis";
import { enhanceQuestionWithVisual } from "./universalVisualGenerator";

/**
 * Generate unlimited questions using authentic STAAR patterns without API dependencies
 */
export async function generateAuthenticPatternQuestions(
  grade: number,
  subject: "math" | "reading",
  count: number = 5,
  options: {
    category?: string;
    teksStandard?: string;
  } = {}
): Promise<InsertQuestion[]> {
  const questions: InsertQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const question = generateSinglePatternQuestion(grade, subject, options);
    // Enhance with visual elements for math questions
    const enhancedQuestion = enhanceQuestionWithVisual(question);
    questions.push(enhancedQuestion);
  }

  return questions;
}

function generateSinglePatternQuestion(
  grade: number,
  subject: "math" | "reading",
  options: { category?: string; teksStandard?: string }
): InsertQuestion {
  const teksStandard = options.teksStandard || getRandomTeksStandard(grade, subject);
  const category = options.category || getDefaultCategory(subject);

  if (subject === "math") {
    return generateMathQuestion(grade, teksStandard, category);
  } else {
    return generateReadingQuestion(grade, teksStandard, category);
  }
}

function generateMathQuestion(grade: number, teksStandard: string, category: string): InsertQuestion {
  const mathQuestions = {
    3: [
      {
        questionText: "Maria collected 84 stickers. She wants to put them in albums with 12 stickers on each page. How many pages will she need?",
        answerChoices: ["A. 6", "B. 7", "C. 8", "D. 9"],
        correctAnswer: "B",
        explanation: "84 ÷ 12 = 7 pages needed"
      },
      {
        questionText: "A rectangular garden has a length of 8 feet and a width of 5 feet. What is the perimeter of the garden?",
        answerChoices: ["A. 13 feet", "B. 18 feet", "C. 26 feet", "D. 40 feet"],
        correctAnswer: "C",
        explanation: "Perimeter = 2 × (length + width) = 2 × (8 + 5) = 26 feet"
      },
      {
        questionText: "Which fraction represents the shaded part of this rectangle divided into 8 equal parts with 3 parts shaded?",
        answerChoices: ["A. 3/8", "B. 5/8", "C. 3/5", "D. 8/3"],
        correctAnswer: "A",
        explanation: "3 out of 8 equal parts are shaded, so the fraction is 3/8"
      },
      {
        questionText: "Sarah has 96 baseball cards. She wants to put them into groups of 8. How many groups will she have?",
        answerChoices: ["A. 10", "B. 11", "C. 12", "D. 13"],
        correctAnswer: "C",
        explanation: "96 ÷ 8 = 12 groups"
      }
    ],
    4: [
      {
        questionText: "A bakery sold 1,248 muffins on Monday and 2,156 muffins on Tuesday. How many muffins did they sell in total?",
        answerChoices: ["A. 3,304", "B. 3,404", "C. 3,394", "D. 3,204"],
        correctAnswer: "B",
        explanation: "1,248 + 2,156 = 3,404 muffins"
      },
      {
        questionText: "What is 0.75 written as a fraction in simplest form?",
        answerChoices: ["A. 75/100", "B. 3/4", "C. 7/10", "D. 15/20"],
        correctAnswer: "B",
        explanation: "0.75 = 75/100 = 3/4 when simplified"
      },
      {
        questionText: "A square playground has sides that are 15 meters long. What is the area of the playground?",
        answerChoices: ["A. 60 square meters", "B. 150 square meters", "C. 225 square meters", "D. 30 square meters"],
        correctAnswer: "C",
        explanation: "Area of a square = side × side = 15 × 15 = 225 square meters"
      },
      {
        questionText: "Jake has 2,340 stickers. He wants to share them equally among 6 friends. How many stickers will each friend get?",
        answerChoices: ["A. 390", "B. 380", "C. 400", "D. 350"],
        correctAnswer: "A",
        explanation: "2,340 ÷ 6 = 390 stickers per friend"
      }
    ],
    5: [
      {
        questionText: "Emma bought 3.5 pounds of apples and 2.75 pounds of oranges. How many pounds of fruit did she buy altogether?",
        answerChoices: ["A. 5.25 pounds", "B. 6.25 pounds", "C. 6.20 pounds", "D. 5.75 pounds"],
        correctAnswer: "B",
        explanation: "3.5 + 2.75 = 6.25 pounds of fruit"
      },
      {
        questionText: "What is 4/5 × 3/8?",
        answerChoices: ["A. 12/40", "B. 3/10", "C. 7/13", "D. 12/13"],
        correctAnswer: "B",
        explanation: "4/5 × 3/8 = 12/40 = 3/10 when simplified"
      },
      {
        questionText: "A rectangular room is 12 feet long and 9 feet wide. If carpet costs $4 per square foot, how much will it cost to carpet the entire room?",
        answerChoices: ["A. $432", "B. $84", "C. $108", "D. $48"],
        correctAnswer: "A",
        explanation: "Area = 12 × 9 = 108 square feet. Cost = 108 × $4 = $432"
      },
      {
        questionText: "What is 7.8 - 3.45?",
        answerChoices: ["A. 4.35", "B. 4.45", "C. 3.35", "D. 5.35"],
        correctAnswer: "A",
        explanation: "7.8 - 3.45 = 4.35"
      }
    ]
  };

  const gradeQuestions = mathQuestions[grade as keyof typeof mathQuestions] || mathQuestions[4];
  const randomIndex = Math.floor(Math.random() * gradeQuestions.length);
  const selectedQuestion = gradeQuestions[randomIndex];

  return {
    grade,
    subject: "math",
    questionText: selectedQuestion.questionText,
    answerChoices: selectedQuestion.answerChoices,
    correctAnswer: selectedQuestion.correctAnswer,
    teksStandard,
    category,
    difficulty: "medium",
    year: new Date().getFullYear(),
    explanation: selectedQuestion.explanation
  };
}

function generateReadingQuestion(grade: number, teksStandard: string, category: string): InsertQuestion {
  const readingQuestions = {
    3: [
      {
        questionText: "In the story 'The Brave Little Mouse', what lesson does the mouse learn?",
        answerChoices: [
          "A. Size doesn't matter when you're brave",
          "B. Always listen to your parents",
          "C. Cats and mice can't be friends",
          "D. It's better to stay home where it's safe"
        ],
        correctAnswer: "A",
        explanation: "The mouse learns that being small doesn't prevent you from being brave and helping others"
      },
      {
        questionText: "What does the word 'gleaming' mean in the sentence: 'The knight's gleaming armor shone in the sunlight'?",
        answerChoices: ["A. Heavy", "B. Shining", "C. Old", "D. Silver"],
        correctAnswer: "B",
        explanation: "Gleaming means shining brightly, which is supported by 'shone in the sunlight'"
      },
      {
        questionText: "In the passage about dolphins, what is the main idea?",
        answerChoices: [
          "A. Dolphins are dangerous animals",
          "B. Dolphins are intelligent sea creatures that live in groups",
          "C. Dolphins only eat fish",
          "D. Dolphins can't swim very fast"
        ],
        correctAnswer: "B",
        explanation: "The passage focuses on dolphins' intelligence and social behavior"
      }
    ],
    4: [
      {
        questionText: "According to the passage about recycling, what is the main benefit of recycling paper?",
        answerChoices: [
          "A. It saves money for families",
          "B. It creates jobs for workers",
          "C. It helps protect forests and trees",
          "D. It makes paper stronger"
        ],
        correctAnswer: "C",
        explanation: "The passage emphasizes that recycling paper reduces the need to cut down trees"
      },
      {
        questionText: "In the story, why does Jake feel nervous about the science fair?",
        answerChoices: [
          "A. He forgot to do his project",
          "B. He's worried his project isn't good enough",
          "C. He doesn't like speaking in public",
          "D. He's afraid of disappointing his teacher"
        ],
        correctAnswer: "B",
        explanation: "The story shows Jake comparing his project to others and doubting its quality"
      },
      {
        questionText: "What can you conclude about the character Rosa based on her actions in the story?",
        answerChoices: [
          "A. She is impatient and rushes through things",
          "B. She is thoughtful and considers others' feelings",
          "C. She is careless with her belongings",
          "D. She prefers to work alone"
        ],
        correctAnswer: "B",
        explanation: "Rosa consistently shows care for others throughout the story"
      }
    ],
    5: [
      {
        questionText: "Based on the character's actions throughout the story, what can you conclude about Maya's personality?",
        answerChoices: [
          "A. She is selfish and only thinks about herself",
          "B. She is kind and always helps others in need",
          "C. She is lazy and avoids doing work",
          "D. She is dishonest and often lies"
        ],
        correctAnswer: "B",
        explanation: "Maya consistently helps her classmates and volunteers for community service throughout the story"
      },
      {
        questionText: "What is the author's main purpose in writing this article about solar energy?",
        answerChoices: [
          "A. To entertain readers with interesting facts",
          "B. To persuade people to buy solar panels",
          "C. To inform readers about how solar energy works",
          "D. To compare solar energy to other energy sources"
        ],
        correctAnswer: "C",
        explanation: "The article focuses on explaining the process and benefits of solar energy in an informative way"
      },
      {
        questionText: "Which sentence from the passage best supports the idea that butterflies are important to nature?",
        answerChoices: [
          "A. Butterflies have colorful wings that attract attention",
          "B. Butterflies help pollinate flowers as they feed on nectar",
          "C. Butterflies go through a metamorphosis process",
          "D. Butterflies can be found in many different climates"
        ],
        correctAnswer: "B",
        explanation: "Pollination is the key ecological role that butterflies play in nature"
      }
    ]
  };

  const gradeQuestions = readingQuestions[grade as keyof typeof readingQuestions] || readingQuestions[4];
  const randomIndex = Math.floor(Math.random() * gradeQuestions.length);
  const selectedQuestion = gradeQuestions[randomIndex];

  return {
    grade,
    subject: "reading",
    questionText: selectedQuestion.questionText,
    answerChoices: selectedQuestion.answerChoices,
    correctAnswer: selectedQuestion.correctAnswer,
    teksStandard,
    category,
    difficulty: "medium",
    year: new Date().getFullYear(),
    explanation: selectedQuestion.explanation
  };
}

function getRandomTeksStandard(grade: number, subject: "math" | "reading"): string {
  const gradeStandards = AUTHENTIC_TEKS_STANDARDS[grade as keyof typeof AUTHENTIC_TEKS_STANDARDS];
  if (!gradeStandards) return `${grade}.1A`;
  
  const subjectStandards = gradeStandards[subject];
  if (!subjectStandards || !Array.isArray(subjectStandards)) return `${grade}.1A`;
  
  return subjectStandards[Math.floor(Math.random() * subjectStandards.length)] || `${grade}.1A`;
}

function getDefaultCategory(subject: "math" | "reading"): string {
  return subject === "math" ? "Number & Operations" : "Comprehension";
}

/**
 * Generate mixed practice sets with authentic and pattern-based questions
 */
export async function generateMixedPracticeQuestions(
  grade: number,
  subject: "math" | "reading",
  count: number = 10
): Promise<{
  questions: InsertQuestion[];
  metadata: {
    total: number;
    authentic: number;
    generated: number;
    grade: number;
    subject: string;
  };
}> {
  try {
    const { getHomepageAuthenticQuestions } = await import("./populateAuthenticQuestions");
    
    // Get some authentic questions
    const authenticQuestions = getHomepageAuthenticQuestions()
      .filter(q => q.grade === grade && q.subject === subject)
      .slice(0, Math.floor(count / 2));

    // Generate pattern-based questions for the rest
    const generatedCount = count - authenticQuestions.length;
    const generatedQuestions = await generateAuthenticPatternQuestions(grade, subject, generatedCount);

    const allQuestions = [...authenticQuestions, ...generatedQuestions];

    // Shuffle questions
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    return {
      questions: allQuestions.slice(0, count),
      metadata: {
        total: allQuestions.length,
        authentic: authenticQuestions.length,
        generated: generatedQuestions.length,
        grade,
        subject
      }
    };

  } catch (error) {
    console.error("Error generating mixed practice questions:", error);
    
    // Fallback to pattern-based only
    const fallbackQuestions = await generateAuthenticPatternQuestions(grade, subject, count);
    return {
      questions: fallbackQuestions,
      metadata: {
        total: fallbackQuestions.length,
        authentic: 0,
        generated: fallbackQuestions.length,
        grade,
        subject
      }
    };
  }
}