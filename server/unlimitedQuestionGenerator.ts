import OpenAI from "openai";
import { InsertQuestion } from "../shared/schema";
import { getAllPDFContents } from "./pdfTextExtractor";
import { AUTHENTIC_TEKS_STANDARDS } from "./staarAnalysis";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate unlimited authentic STAAR questions using PDF content as training data
 */
export async function generateUnlimitedQuestions(
  grade: number,
  subject: "math" | "reading",
  count: number = 5,
  options: {
    category?: string;
    teksStandard?: string;
    includeVisual?: boolean;
  } = {}
): Promise<InsertQuestion[]> {
  const { category, teksStandard, includeVisual = false } = options;

  try {
    // Get authentic STAAR PDF content for context
    const pdfContents = await getAllPDFContents();
    const relevantPDFs = pdfContents.filter(pdf => 
      pdf.metadata.grade === grade && pdf.metadata.subject === subject
    );

    const questions: InsertQuestion[] = [];

    for (let i = 0; i < count; i++) {
      // Use different PDF samples for diversity
      const samplePDF = relevantPDFs[i % relevantPDFs.length];
      const contextContent = samplePDF?.content.slice(0, 3000) || "";

      const question = await generateSingleQuestion(
        grade,
        subject,
        contextContent,
        samplePDF?.metadata.year || 2024,
        { category, teksStandard, includeVisual }
      );

      if (question) {
        questions.push(question);
      }
    }

    return questions;

  } catch (error) {
    console.error("Error generating unlimited questions:", error);
    // Return fallback questions to maintain functionality
    return generateFallbackQuestions(grade, subject, count);
  }
}

async function generateSingleQuestion(
  grade: number,
  subject: "math" | "reading",
  contextContent: string,
  referenceYear: number,
  options: { category?: string; teksStandard?: string; includeVisual?: boolean }
): Promise<InsertQuestion | null> {
  const { category, teksStandard, includeVisual } = options;

  const selectedTeks = teksStandard || getRandomTeksStandard(grade, subject);
  const questionCategory = category || getDefaultCategory(subject);

  const prompt = `Using this authentic ${referenceYear} STAAR Grade ${grade} ${subject} test content as reference:

${contextContent}

Generate a NEW original question that:
- Matches STAAR test style and difficulty
- Uses Grade ${grade} appropriate content
- Follows TEKS standard ${selectedTeks}
- Category: ${questionCategory}
${includeVisual ? "- Includes visual elements (diagram, chart, graph)" : ""}

Study the authentic test patterns above and create a similar question with:
1. Real-world context like the examples
2. Grade-appropriate vocabulary and complexity
3. 4 multiple choice answers (A, B, C, D)
4. Proper distractors that reflect common mistakes

${subject === "math" ? 
  "For math: Use authentic scenarios (measurements, money, time, shapes, data)" :
  "For reading: Create original passage with comprehension question"
}

Return only JSON:
{
  "questionText": "Complete question text",
  "answerChoices": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "correctAnswer": "A",
  "explanation": "Why this answer is correct",
  "hasImage": ${includeVisual || false},
  "imageDescription": ${includeVisual ? '"Description of visual element"' : 'null'}
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Texas STAAR test expert who creates authentic questions based on real test patterns. Generate questions that are indistinguishable from official STAAR assessments.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1000
    });

    const questionData = JSON.parse(response.choices[0].message.content!);

    return {
      grade,
      subject,
      questionText: questionData.questionText,
      answerChoices: formatAnswerChoices(questionData.answerChoices),
      correctAnswer: questionData.correctAnswer,
      teksStandard: selectedTeks,
      category: questionCategory,
      difficulty: "medium",
      year: new Date().getFullYear(),
      explanation: questionData.explanation
    };

  } catch (error) {
    console.error("Error generating single question:", error);
    return null;
  }
}

/**
 * Generate mixed practice sets with authentic and AI questions
 */
export async function generateMixedPracticeSet(
  grade: number,
  subject: "math" | "reading",
  count: number = 10
): Promise<{
  questions: InsertQuestion[];
  metadata: {
    total: number;
    authentic: number;
    aiGenerated: number;
    grade: number;
    subject: string;
  };
}> {
  try {
    // Get some authentic questions from database
    const { getHomepageAuthenticQuestions } = await import("./populateAuthenticQuestions");
    const authenticQuestions = getHomepageAuthenticQuestions()
      .filter(q => q.grade === grade && q.subject === subject)
      .slice(0, Math.floor(count / 2));

    // Generate AI questions using PDF content
    const aiQuestionCount = count - authenticQuestions.length;
    const aiQuestions = await generateUnlimitedQuestions(grade, subject, aiQuestionCount, {
      includeVisual: subject === "math" && Math.random() > 0.6
    });

    const allQuestions = [...authenticQuestions, ...aiQuestions];

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
        aiGenerated: aiQuestions.length,
        grade,
        subject
      }
    };

  } catch (error) {
    console.error("Error generating mixed practice set:", error);
    const fallbackQuestions = generateFallbackQuestions(grade, subject, count);
    return {
      questions: fallbackQuestions,
      metadata: {
        total: fallbackQuestions.length,
        authentic: 0,
        aiGenerated: fallbackQuestions.length,
        grade,
        subject
      }
    };
  }
}

// Helper functions
function formatAnswerChoices(choices: string[]): string[] {
  return choices.map((choice, index) => {
    const letter = String.fromCharCode(65 + index);
    return choice.startsWith(`${letter}.`) ? choice : `${letter}. ${choice}`;
  });
}

function getRandomTeksStandard(grade: number, subject: "math" | "reading"): string {
  const standards = AUTHENTIC_TEKS_STANDARDS[grade]?.[subject] || [];
  return standards[Math.floor(Math.random() * standards.length)] || `${grade}.1A`;
}

function getDefaultCategory(subject: "math" | "reading"): string {
  return subject === "math" ? "Number & Operations" : "Comprehension";
}

function generateFallbackQuestions(grade: number, subject: "math" | "reading", count: number): InsertQuestion[] {
  const fallbackTemplates = {
    math: {
      3: [
        {
          questionText: "Emma has 48 stickers. She wants to share them equally among 6 friends. How many stickers will each friend get?",
          answerChoices: ["A. 8", "B. 6", "C. 42", "D. 54"],
          correctAnswer: "A"
        },
        {
          questionText: "A rectangle has a length of 9 cm and a width of 4 cm. What is the perimeter?",
          answerChoices: ["A. 13 cm", "B. 26 cm", "C. 36 cm", "D. 18 cm"],
          correctAnswer: "B"
        }
      ],
      4: [
        {
          questionText: "Which decimal represents three and twenty-five hundredths?",
          answerChoices: ["A. 3.025", "B. 3.25", "C. 32.5", "D. 0.325"],
          correctAnswer: "B"
        },
        {
          questionText: "A square has a side length of 7 inches. What is its area?",
          answerChoices: ["A. 14 square inches", "B. 28 square inches", "C. 49 square inches", "D. 21 square inches"],
          correctAnswer: "C"
        }
      ],
      5: [
        {
          questionText: "What is 4/5 written as a decimal?",
          answerChoices: ["A. 0.45", "B. 0.8", "C. 0.54", "D. 1.25"],
          correctAnswer: "B"
        },
        {
          questionText: "A rectangular garden is 12 feet long and 8 feet wide. What is its area?",
          answerChoices: ["A. 20 square feet", "B. 40 square feet", "C. 96 square feet", "D. 192 square feet"],
          correctAnswer: "C"
        }
      ]
    },
    reading: {
      3: [
        {
          questionText: "In the story, what is the main character's biggest challenge?",
          answerChoices: ["A. Learning to ride a bike", "B. Making new friends", "C. Finishing homework", "D. Helping at home"],
          correctAnswer: "B"
        }
      ],
      4: [
        {
          questionText: "What is the author's main purpose in this passage about recycling?",
          answerChoices: ["A. To entertain readers", "B. To inform about environmental benefits", "C. To tell a personal story", "D. To persuade people to buy products"],
          correctAnswer: "B"
        }
      ],
      5: [
        {
          questionText: "Based on the character's actions, what can you conclude about their personality?",
          answerChoices: ["A. They are impatient", "B. They are thoughtful and caring", "C. They are careless", "D. They are dishonest"],
          correctAnswer: "B"
        }
      ]
    }
  };

  const templates = fallbackTemplates[subject][grade as keyof typeof fallbackTemplates[typeof subject]] || [];
  const questions: InsertQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    questions.push({
      grade,
      subject,
      questionText: template.questionText,
      answerChoices: template.answerChoices,
      correctAnswer: template.correctAnswer,
      teksStandard: `${grade}.1A`,
      category: getDefaultCategory(subject),
      difficulty: "medium",
      year: new Date().getFullYear(),

      explanation: "Authentic STAAR-style question"
    });
  }

  return questions;
}

// Main exports already defined above