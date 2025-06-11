import { InsertQuestion } from "../shared/schema";
import { AUTHENTIC_STAAR_MATH_QUESTIONS, AUTHENTIC_STAAR_READING_QUESTIONS, AUTHENTIC_TEKS_STANDARDS, STAAR_QUESTION_PATTERNS, STAAR_DIFFICULTY_PATTERNS } from "./staarAnalysis";
import { createEnhancedSTAARPrompt, getDifficultyLevel, TEKS_DESCRIPTIONS } from "./staarTraining";

// Using authentic TEKS Standards extracted from actual STAAR tests (2013-2015)
export const TEKS_STANDARDS = AUTHENTIC_TEKS_STANDARDS;

// Sample questions extracted from STAAR documents to use as examples
export const SAMPLE_QUESTIONS = {
  3: {
    math: [
      {
        teks: "3.2A",
        question: "Jake has 24 stickers. He gives away 8 stickers. How many stickers does Jake have left?",
        choices: ["A) 16", "B) 32", "C) 8", "D) 18"],
        correct: "A",
        explanation: "Subtract: 24 - 8 = 16 stickers remaining."
      }
    ],
    reading: [
      {
        teks: "3.6A",
        question: "Based on the story, what can you conclude about Jake's feelings toward computers?",
        choices: ["A) He is afraid of them", "B) He enjoys using them", "C) He thinks they are too difficult", "D) He prefers books"],
        correct: "B",
        explanation: "The text states 'I've always liked computers' which shows Jake enjoys using them."
      }
    ]
  },
  4: {
    math: [
      {
        teks: "4.2A",
        question: "Rita bought three and forty-eight hundredths pounds of bananas. How is this written in expanded notation?",
        choices: ["F) (3 × 1) + (4 × 0.1) + (8 × 0.01)", "G) (3 × 100) + (4 × 10) + (8 × 1)", "H) (3 × 1) + (4 × 0.01) + (8 × 0.1)", "J) (3 × 100) + (4 × 0.1) + (8 × 0.01)"],
        correct: "F",
        explanation: "3.48 = (3 × 1) + (4 × 0.1) + (8 × 0.01)"
      }
    ],
    reading: [
      {
        teks: "4.6A",
        question: "What is the main idea of the passage about William Wrigley Jr.?",
        choices: ["A) Soap was his first business", "B) Good advertising helps businesses succeed", "C) Wrigley's clever ideas made gum popular", "D) Chicago was a good place for business"],
        correct: "C",
        explanation: "The passage focuses on how Wrigley's innovative marketing ideas led to gum's popularity."
      }
    ]
  },
  5: {
    math: [
      {
        teks: "5.3A",
        question: "What is 2/3 ÷ 1/6?",
        choices: ["A) 2/18", "B) 4", "C) 1/9", "D) 8"],
        correct: "B",
        explanation: "2/3 ÷ 1/6 = 2/3 × 6/1 = 12/3 = 4"
      }
    ],
    reading: [
      {
        teks: "5.6A",
        question: "Based on the article about R2, what can you infer about the future of space exploration?",
        choices: ["A) Humans will stop going to space", "B) Robots will replace all astronauts", "C) Technology will continue to assist astronauts", "D) Space missions will become less important"],
        correct: "C",
        explanation: "The article shows how R2 assists astronauts, suggesting technology will continue supporting human space exploration."
      }
    ]
  }
};

// Create authentic STAAR question prompts based on real test patterns from 2013-2019
function createAuthenticSTAARPrompt(grade: number, subject: "math" | "reading", teksStandard: string, category?: string): string {
  const staarPatterns = {
    3: {
      math: {
        "Number and Operations": [
          "Point identification on number lines (like: Which point best represents 13 on the number line?)",
          "Division story problems with equal groups (like: Sofia will arrange 42 feathers into 7 glass cases)",
          "Fact family relationships (like: Which expression is in the same fact family as 8 × 5 = 40?)",
          "Multiplication and division word problems with real-world contexts"
        ],
        "Geometry and Measurement": [
          "3D shape vertex counting (like: How many vertices does this figure have?)",
          "Shape identification and classification (like: Which of these is NOT an octagon?)",
          "Time and measurement conversions using reference materials"
        ]
      },
      reading: [
        "Character motivation questions (What is the most likely reason [character] does [action]?)",
        "Story inference questions (What are the characters thinking at this point?)",
        "Dictionary definition matching in context",
        "Main idea identification from passages about animals or real people"
      ]
    },
    4: {
      math: {
        "Geometry": [
          "Shape classification (Which statement best describes these figures?)",
          "Quadrilateral properties and identification"
        ],
        "Algebraic Reasoning": [
          "Variable representation in equations",
          "Pattern recognition and rule identification"
        ]
      },
      reading: [
        "Character perspective analysis",
        "Inference about character feelings and motivations",
        "Plot development and story progression questions"
      ]
    },
    5: {
      math: {
        "Number and Operations": [
          "Fraction to decimal conversions",
          "Multi-step word problems with real-world contexts"
        ],
        "Algebraic Reasoning": [
          "Number pattern rules and sequences",
          "Expression evaluation and simplification"
        ]
      },
      reading: [
        "Advanced inference questions about character development",
        "Theme identification and analysis",
        "Author's purpose in complex texts"
      ]
    }
  };

  const gradePatterns = staarPatterns[grade as keyof typeof staarPatterns];
  const subjectPatterns = subject === "math" ? gradePatterns?.math : gradePatterns?.reading;
  
  if (subject === "math" && typeof subjectPatterns === "object" && category && subjectPatterns[category as keyof typeof subjectPatterns]) {
    const categoryPatterns = subjectPatterns[category as keyof typeof subjectPatterns] as string[];
    return `Use these authentic STAAR ${grade}th grade ${subject} patterns for ${category}: ${categoryPatterns.join(", ")}`;
  } else if (subject === "reading" && Array.isArray(subjectPatterns)) {
    return `Use these authentic STAAR ${grade}th grade reading patterns: ${subjectPatterns.join(", ")}`;
  }
  
  return `Create authentic STAAR-style ${grade}th grade ${subject} questions similar to Texas state test patterns`;
}

export async function generateQuestionWithOpenAI(
  grade: number,
  subject: "math" | "reading",
  teksStandard: string,
  category?: string
): Promise<Omit<InsertQuestion, "id" | "createdAt">> {
  // Use enhanced STAAR prompt with authentic test patterns from 2013-2015 documents
  const authenticPrompt = createEnhancedSTAARPrompt(grade, subject, teksStandard, category);
  
  const sampleQuestions = SAMPLE_QUESTIONS[grade as keyof typeof SAMPLE_QUESTIONS]?.[subject] || [];
  const exampleQuestion = sampleQuestions.find(q => q.teks === teksStandard) || sampleQuestions[0];
  
  const prompt = `Generate a ${grade}th grade ${subject} question aligned with Texas TEKS standard ${teksStandard}${category ? ` in the category "${category}"` : ''}.

${authenticPrompt}

Based on actual STAAR test patterns from 2013-2019, create a question that:
1. Matches the complexity level of ${grade}th grade students
2. Follows the exact format of Texas STAAR assessments
3. Aligns with TEKS standard ${teksStandard}
4. Includes 4 multiple choice answers (A, B, C, D for grades 3-4; F, G, H, J for some grade 4-5 questions)
5. Has a clear explanation for the correct answer

${exampleQuestion ? `Use this example as a style reference:
Question: ${exampleQuestion.question}
Choices: ${exampleQuestion.choices.join(", ")}
Correct: ${exampleQuestion.correct}
Explanation: ${exampleQuestion.explanation}` : ''}

For ${subject} questions:
${subject === 'math' ? `- Use real-world contexts (sports, shopping, measurement, etc.)
- Include computational problems appropriate for grade ${grade}
- Focus on problem-solving strategies
- Use clear, unambiguous mathematical language` : `- Base questions on reading comprehension
- Include literary analysis appropriate for grade ${grade}
- Focus on reading strategies and text analysis
- Use age-appropriate vocabulary and themes`}

Return ONLY a JSON object with this exact format:
{
  "grade": ${grade},
  "subject": "${subject}",
  "teksStandard": "${teksStandard}",
  "questionText": "The main question text here",
  "answerChoices": [
    {"id": "A", "text": "First answer choice"},
    {"id": "B", "text": "Second answer choice"},
    {"id": "C", "text": "Third answer choice"},
    {"id": "D", "text": "Fourth answer choice"}
  ],
  "correctAnswer": "A",
  "explanation": "Clear explanation of why this answer is correct",
  "difficulty": "easy|medium|hard",
  "year": 2024
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: 'system',
            content: `You are an expert Texas STAAR test question generator with extensive knowledge of authentic STAAR test patterns from 2013-2019. Create questions that exactly match official Texas state test formats, complexity levels, and question structures.

${authenticPrompt}

For grade ${grade} ${subject}, use these specific STAAR conventions:
- Exact question phrasing patterns from real tests
- Authentic answer choice formats and distractors
- Real-world contexts that appear in actual STAAR tests
- Appropriate cognitive complexity for the grade level

Always respond with valid JSON only.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    // Parse the JSON response
    let questionData;
    try {
      questionData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      console.error('Parse error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and format the response
    return {
      grade: questionData.grade || grade,
      subject: questionData.subject || subject,
      teksStandard: questionData.teksStandard || teksStandard,
      questionText: questionData.questionText || '',
      answerChoices: questionData.answerChoices || [],
      correctAnswer: questionData.correctAnswer || 'A',
      explanation: questionData.explanation || '',
      difficulty: questionData.difficulty || 'medium',
      year: questionData.year || 2024
    };

  } catch (error) {
    console.error('Error generating question with OpenAI:', error);
    
    // Fallback to a template-based question if API fails
    return generateFallbackQuestion(grade, subject, teksStandard, category);
  }
}

function generateFallbackQuestion(
  grade: number,
  subject: "math" | "reading",
  teksStandard: string,
  category?: string
): Omit<InsertQuestion, "id" | "createdAt"> {
  const sampleQuestions = SAMPLE_QUESTIONS[grade as keyof typeof SAMPLE_QUESTIONS]?.[subject] || [];
  const template = sampleQuestions[0];
  
  if (!template) {
    // Ultimate fallback
    return {
      grade,
      subject,
      teksStandard,
      questionText: `This is a ${grade}th grade ${subject} question for TEKS ${teksStandard}.`,
      answerChoices: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
        { id: "C", text: "Option C" },
        { id: "D", text: "Option D" }
      ],
      correctAnswer: "A",
      explanation: "This is the correct answer explanation.",
      difficulty: "medium",
      year: 2024
    };
  }

  return {
    grade,
    subject,
    teksStandard,
    questionText: template.question,
    answerChoices: template.choices.map((choice, index) => ({
      id: String.fromCharCode(65 + index), // A, B, C, D
      text: choice.replace(/^[A-J]\)\s*/, '') // Remove existing letter prefixes
    })),
    correctAnswer: template.correct,
    explanation: template.explanation,
    difficulty: "medium",
    year: 2024
  };
}

export function getRandomTeksStandard(grade: number, subject: "math" | "reading", category?: string): string {
  const standards = TEKS_STANDARDS[grade as keyof typeof TEKS_STANDARDS]?.[subject];
  if (!standards) return `${grade}.1A`;
  
  if (category && standards[category as keyof typeof standards]) {
    const categoryStandards = standards[category as keyof typeof standards] as string[];
    return categoryStandards[Math.floor(Math.random() * categoryStandards.length)];
  }
  
  // Get all standards from all categories
  const allStandards = Object.values(standards).flat();
  return allStandards[Math.floor(Math.random() * allStandards.length)];
}

export function getTeksCategories(grade: number, subject: "math" | "reading"): string[] {
  const standards = TEKS_STANDARDS[grade as keyof typeof TEKS_STANDARDS]?.[subject];
  return standards ? Object.keys(standards) : [];
}