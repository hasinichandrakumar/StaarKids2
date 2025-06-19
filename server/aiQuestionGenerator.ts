import OpenAI from "openai";
import { InsertQuestion } from "../shared/schema";
import { AUTHENTIC_TEKS_STANDARDS } from "./staarAnalysis";
import { getDifficultyLevel } from "./staarTraining";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate unlimited authentic STAAR questions using AI
 * Supports both text-only and visual questions with diagrams
 */
export async function generateAuthenticSTAARQuestion(
  grade: number,
  subject: "math" | "reading",
  options: {
    teksStandard?: string;
    category?: string;
    includeVisual?: boolean;
    difficulty?: "easy" | "medium" | "hard";
    count?: number;
  } = {}
): Promise<InsertQuestion[]> {
  const {
    teksStandard,
    category,
    includeVisual = false,
    difficulty,
    count = 1
  } = options;

  const questions: InsertQuestion[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const selectedTeks = teksStandard || getRandomTeksStandard(grade, subject, category);
      const questionDifficulty = difficulty || getDifficultyLevel(grade, selectedTeks);
      
      const prompt = createEnhancedQuestionPrompt(
        grade,
        subject,
        selectedTeks,
        category,
        includeVisual,
        questionDifficulty
      );

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are an expert STAAR test creator with access to authentic Texas state assessment data from 2013-2024. You generate questions that perfectly match official STAAR test formats.

MATHEMATICAL ACCURACY REQUIREMENTS:
- All calculations must be 100% mathematically correct
- Answer choices include common student calculation errors as distractors
- Show explicit mathematical work in explanations
- Verify arithmetic multiple times before finalizing

AUTHENTIC STAAR PATTERNS:
- Use exact language patterns from real STAAR tests
- Follow official Texas Education Agency question structures
- Include authentic Texas contexts (schools, students, everyday scenarios)
- Match cognitive complexity levels for each grade

QUALITY CONTROL:
- Double-check all numerical answers
- Ensure distractors are mathematically plausible but incorrect
- Use grade-appropriate vocabulary and contexts
- Follow official TEKS alignment requirements`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5, // Lower temperature for more consistent, accurate generation
        max_tokens: 1200
      });

      const questionData = JSON.parse(response.choices[0].message.content!);
      
      const question: InsertQuestion = {
        grade,
        subject,
        questionText: questionData.questionText,
        answerChoices: formatAnswerChoices(questionData.answerChoices),
        correctAnswer: questionData.correctAnswer,
        teksStandard: selectedTeks,
        category: category || questionData.category || getDefaultCategory(subject),
        difficulty: questionDifficulty,
        isFromRealSTAAR: false,
        year: new Date().getFullYear(),
        hasImage: questionData.hasImage || includeVisual || false,
        imageDescription: questionData.imageDescription || null,
        explanation: questionData.explanation || null
      };

      questions.push(question);

    } catch (error) {
      console.error(`Error generating question ${i + 1}:`, error);
      // Add fallback question to maintain count
      questions.push(generateFallbackQuestion(grade, subject, teksStandard, category));
    }
  }

  return questions;
}

/**
 * Generate visual math diagrams using AI
 */
export async function generateMathVisualQuestion(
  grade: number,
  category: string,
  teksStandard?: string
): Promise<InsertQuestion> {
  const visualCategories = {
    "Geometry": ["shapes", "angles", "symmetry", "transformations"],
    "Measurement": ["area", "perimeter", "volume", "time", "money"],
    "Data Analysis": ["graphs", "charts", "tables", "probability"]
  };

  const visualType = visualCategories[category as keyof typeof visualCategories]?.[
    Math.floor(Math.random() * visualCategories[category as keyof typeof visualCategories]?.length || 0)
  ] || "shapes";

  const prompt = `Generate a Grade ${grade} STAAR Math question requiring visual interpretation:

TEKS Standard: ${teksStandard || getRandomTeksStandard(grade, "math", category)}
Category: ${category}
Visual Element: ${visualType}

Create an authentic STAAR-style question that:
1. Requires students to analyze a visual diagram
2. Matches official STAAR formatting exactly
3. Uses grade-appropriate mathematical concepts
4. Includes a clear, detailed description of the visual element
5. Provides 4 realistic answer choices with proper distractors

For the visual element, describe exactly what would appear in the diagram:
- Geometric shapes with measurements
- Charts or graphs with data
- Measurement tools with readings
- Mathematical representations

Return JSON format:
{
  "questionText": "Question text referencing the diagram",
  "answerChoices": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "correctAnswer": "A",
  "hasImage": true,
  "imageDescription": "Detailed description of the visual element",
  "explanation": "Why the correct answer is right",
  "category": "${category}"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a STAAR test visual question specialist trained on authentic Texas assessment data. Create questions requiring diagram interpretation that match official STAAR standards.

MATHEMATICAL ACCURACY REQUIREMENTS:
- All calculations must be 100% mathematically correct
- Verify area, perimeter, volume, and other measurements
- Answer choices include realistic student calculation errors
- Double-check all arithmetic operations

VISUAL ELEMENT REQUIREMENTS:
- Describe diagrams that appear in real STAAR tests
- Include specific measurements, labels, and scales
- Match authentic STAAR visual formatting
- Ensure diagrams support the mathematical question

QUALITY VERIFICATION:
- Show mathematical work in explanations
- Use authentic Texas contexts and vocabulary
- Follow grade-appropriate complexity levels`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4 // Lower temperature for mathematical accuracy
    });

    const questionData = JSON.parse(response.choices[0].message.content!);

    return {
      grade,
      subject: "math",
      questionText: questionData.questionText,
      answerChoices: formatAnswerChoices(questionData.answerChoices),
      correctAnswer: questionData.correctAnswer,
      teksStandard: teksStandard || getRandomTeksStandard(grade, "math", category),
      category,
      difficulty: getDifficultyLevel(grade, teksStandard || ""),
      isFromRealSTAAR: false,
      year: new Date().getFullYear(),
      hasImage: true,
      imageDescription: questionData.imageDescription,
      explanation: questionData.explanation
    };

  } catch (error) {
    console.error("Error generating visual math question:", error);
    return generateFallbackQuestion(grade, "math", teksStandard, category);
  }
}

/**
 * Generate reading comprehension questions with passages
 */
export async function generateReadingPassageQuestion(
  grade: number,
  category: string = "Comprehension",
  teksStandard?: string
): Promise<InsertQuestion> {
  const passageTypes = {
    3: ["animal stories", "friendship tales", "adventure stories", "family stories"],
    4: ["historical narratives", "science articles", "biography excerpts", "mystery stories"],
    5: ["complex narratives", "informational texts", "persuasive articles", "literary analysis"]
  };

  const passageType = passageTypes[grade as keyof typeof passageTypes]?.[
    Math.floor(Math.random() * passageTypes[grade as keyof typeof passageTypes]?.length || 0)
  ] || "stories";

  const prompt = `Generate a Grade ${grade} STAAR Reading question with original passage:

TEKS Standard: ${teksStandard || getRandomTeksStandard(grade, "reading", category)}
Category: ${category}
Passage Type: ${passageType}

Create an authentic STAAR reading assessment that includes:
1. An original passage (150-300 words) appropriate for Grade ${grade}
2. A comprehension question that tests specific reading skills
3. 4 answer choices with realistic distractors
4. Grade-appropriate vocabulary and themes
5. Follows official STAAR reading question patterns

The passage should be:
- Age-appropriate and engaging
- Curriculum-aligned content
- Similar to authentic STAAR reading materials
- Original content (not copyrighted material)

Return JSON format:
{
  "questionText": "Full passage followed by the comprehension question",
  "answerChoices": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "correctAnswer": "A",
  "explanation": "Explanation referencing specific text evidence",
  "category": "${category}",
  "hasImage": false
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a STAAR reading specialist trained on authentic Texas assessment data from 2013-2024. Create reading comprehension assessments that match official STAAR test patterns.

AUTHENTIC STAAR READING PATTERNS:
- Use exact question formats from real STAAR tests
- Include original passages that sound like authentic STAAR selections
- Follow official Texas reading standards and complexity levels
- Match authentic vocabulary and sentence structures

PASSAGE REQUIREMENTS:
- Create grade-appropriate fiction, nonfiction, or poetry
- Use authentic Texas contexts and themes
- Include clear text evidence for all questions
- Match official STAAR passage length and complexity

QUESTION ACCURACY:
- Questions must have clear, text-based answers
- Include realistic distractors based on common student errors
- Follow authentic STAAR question stems and formats
- Provide detailed explanations with text evidence

QUALITY VERIFICATION:
- Ensure all answer choices are plausible
- Verify correct answers are clearly supported by text
- Use grade-appropriate reading levels and vocabulary`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6, // Balanced for creativity with accuracy
      max_tokens: 1500
    });

    const questionData = JSON.parse(response.choices[0].message.content!);

    return {
      grade,
      subject: "reading",
      questionText: questionData.questionText,
      answerChoices: formatAnswerChoices(questionData.answerChoices),
      correctAnswer: questionData.correctAnswer,
      teksStandard: teksStandard || getRandomTeksStandard(grade, "reading", category),
      category,
      difficulty: getDifficultyLevel(grade, teksStandard || ""),
      isFromRealSTAAR: false,
      year: new Date().getFullYear(),
      hasImage: false,
      imageDescription: null,
      explanation: questionData.explanation
    };

  } catch (error) {
    console.error("Error generating reading passage question:", error);
    return generateFallbackQuestion(grade, "reading", teksStandard, category);
  }
}

// Helper functions
function createEnhancedQuestionPrompt(
  grade: number,
  subject: "math" | "reading",
  teksStandard: string,
  category?: string,
  includeVisual?: boolean,
  difficulty?: string
): string {
  const visualPrompt = includeVisual ? 
    `Include a visual element (diagram, chart, graph, or geometric figure) that requires students to interpret visual information. Provide detailed description of the visual.` : '';

  // Get authentic STAAR examples for this grade and subject
  const mathExamples = {
    3: "Maria has 24 stickers. She wants to put them equally into 6 albums. How many stickers will be in each album?",
    4: "There are 27 teams in a hockey league. Each team has 16 players. How many players are in the league altogether?",
    5: "A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?"
  };

  const readingExamples = {
    3: "Based on the story, what is the main problem the character faces?",
    4: "According to the passage, why are butterflies important for nature?",
    5: "What is the central conflict in this story?"
  };

  const exampleQuestion = subject === "math" ? 
    mathExamples[grade as keyof typeof mathExamples] || mathExamples[4] :
    readingExamples[grade as keyof typeof readingExamples] || readingExamples[4];

  return `Generate an authentic Grade ${grade} STAAR ${subject} question based on official test patterns:

TEKS Standard: ${teksStandard}
Category: ${category || (subject === "math" ? "Number & Operations" : "Comprehension")}
Difficulty: ${difficulty || "medium"}
${visualPrompt}

AUTHENTIC STAAR PATTERNS TO FOLLOW:
Example from actual STAAR tests: "${exampleQuestion}"

CRITICAL REQUIREMENTS:
1. Use EXACT STAAR test language and formatting
2. For math: Ensure ALL calculations are mathematically correct
3. Answer choices must include realistic numbers that students might calculate incorrectly
4. Use authentic Texas contexts (schools, students, everyday scenarios)
5. Follow grade ${grade} cognitive complexity and vocabulary levels
6. ${subject === "math" ? "Double-check all arithmetic - calculations must be 100% accurate" : "Create original passages that sound like authentic STAAR reading selections"}

MATH ACCURACY VERIFICATION:
- Show your work for all calculations
- Verify each answer choice is mathematically sound
- Include common student errors as distractors

Return JSON with this exact structure:
{
  "questionText": "Complete question text matching STAAR style",
  "answerChoices": ["A. First option", "B. Second option", "C. Third option", "D. Fourth option"],
  "correctAnswer": "A",
  "explanation": "Step-by-step solution showing mathematical work",
  "category": "${category || (subject === "math" ? "Number & Operations" : "Comprehension")}",
  "hasImage": ${includeVisual || false},
  "imageDescription": ${includeVisual ? '"Detailed visual description"' : 'null'}
}`;
}

function formatAnswerChoices(choices: string[]): string[] {
  return choices.map((choice, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, D
    return choice.startsWith(`${letter}.`) ? choice : `${letter}. ${choice}`;
  });
}

function getRandomTeksStandard(grade: number, subject: "math" | "reading", category?: string): string {
  try {
    const gradeStandards = AUTHENTIC_TEKS_STANDARDS[grade as keyof typeof AUTHENTIC_TEKS_STANDARDS];
    if (!gradeStandards) return `${grade}.1A`;
    
    const subjectStandards = gradeStandards[subject];
    if (!subjectStandards) return `${grade}.1A`;
    
    // Convert category standards to flat array
    const allStandards: string[] = [];
    for (const categoryStandards of Object.values(subjectStandards as any)) {
      if (Array.isArray(categoryStandards)) {
        allStandards.push(...categoryStandards.filter(std => typeof std === 'string'));
      }
    }
    
    if (category && allStandards.length > 0) {
      const categoryStandards = allStandards.filter((std: string) => std.includes(category.slice(0, 3)));
      if (categoryStandards.length > 0) {
        return categoryStandards[Math.floor(Math.random() * categoryStandards.length)];
      }
    }
    return allStandards[Math.floor(Math.random() * allStandards.length)] || `${grade}.1A`;
  } catch (error) {
    return `${grade}.1A`;
  }
}

function getDefaultCategory(subject: "math" | "reading"): string {
  return subject === "math" ? "Number & Operations" : "Comprehension";
}

function generateFallbackQuestion(grade: number, subject: "math" | "reading", teksStandard?: string, category?: string): InsertQuestion {
  const fallbackQuestions = {
    math: {
      3: {
        questionText: "Sarah has 24 stickers. She gives 8 stickers to her friend. How many stickers does Sarah have left?",
        answerChoices: ["A. 16", "B. 32", "C. 8", "D. 18"],
        correctAnswer: "A"
      },
      4: {
        questionText: "A rectangle has a length of 8 cm and a width of 5 cm. What is the area of the rectangle?",
        answerChoices: ["A. 13 cm²", "B. 26 cm²", "C. 40 cm²", "D. 45 cm²"],
        correctAnswer: "C"
      },
      5: {
        questionText: "What is 3/4 written as a decimal?",
        answerChoices: ["A. 0.34", "B. 0.75", "C. 0.43", "D. 1.75"],
        correctAnswer: "B"
      }
    },
    reading: {
      3: {
        questionText: "Based on the story, what is the main character's problem?",
        answerChoices: ["A. He lost his book", "B. He forgot his lunch", "C. He missed the bus", "D. He broke his toy"],
        correctAnswer: "A"
      },
      4: {
        questionText: "What is the main idea of this passage?",
        answerChoices: ["A. Animals need food", "B. Plants grow in soil", "C. Weather changes daily", "D. People help animals"],
        correctAnswer: "D"
      },
      5: {
        questionText: "Which sentence best describes the author's purpose?",
        answerChoices: ["A. To entertain readers", "B. To give information", "C. To persuade readers", "D. To tell a story"],
        correctAnswer: "B"
      }
    }
  };

  const fallback = fallbackQuestions[subject][grade as keyof typeof fallbackQuestions[typeof subject]];

  return {
    grade,
    subject,
    questionText: fallback.questionText,
    answerChoices: fallback.answerChoices,
    correctAnswer: fallback.correctAnswer,
    teksStandard: teksStandard || `${grade}.1A`,
    category: category || getDefaultCategory(subject),
    difficulty: "medium" as const,
    isFromRealSTAAR: false,
    year: new Date().getFullYear(),
    hasImage: false,
    imageDescription: null,
    explanation: "This is a fallback question."
  };
}

