// STAAR AI Training Module
// Trains the AI model using authentic STAAR test questions from 2013-2015

import { AUTHENTIC_STAAR_MATH_QUESTIONS, AUTHENTIC_STAAR_READING_QUESTIONS, AUTHENTIC_TEKS_STANDARDS } from "./staarAnalysis";

export interface TrainingData {
  input: string;
  output: string;
  teksStandard: string;
  grade: number;
  subject: "math" | "reading";
  category: string;
}

// Generate training data from authentic STAAR questions
export function generateTrainingData(): TrainingData[] {
  const trainingData: TrainingData[] = [];
  
  // Process math questions
  AUTHENTIC_STAAR_MATH_QUESTIONS.forEach(question => {
    trainingData.push({
      input: createTrainingInput(question.grade, question.subject, question.teksStandard, question.category),
      output: JSON.stringify({
        question: question.questionText,
        choices: question.answerChoices || ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        correct: question.correctAnswer || "A",
        explanation: `This question tests ${question.teksStandard} - ${question.category}`,
        teksStandard: question.teksStandard,
        category: question.category
      }),
      teksStandard: question.teksStandard,
      grade: question.grade,
      subject: question.subject,
      category: question.category
    });
  });
  
  // Process reading questions
  AUTHENTIC_STAAR_READING_QUESTIONS.forEach(question => {
    trainingData.push({
      input: createTrainingInput(question.grade, question.subject, question.teksStandard, question.category),
      output: JSON.stringify({
        question: question.questionText,
        choices: question.answerChoices || ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        correct: question.correctAnswer || "A",
        explanation: `This question tests ${question.teksStandard} - ${question.category}`,
        teksStandard: question.teksStandard,
        category: question.category
      }),
      teksStandard: question.teksStandard,
      grade: question.grade,
      subject: question.subject,
      category: question.category
    });
  });
  
  return trainingData;
}

function createTrainingInput(grade: number, subject: "math" | "reading", teksStandard: string, category: string): string {
  return `Create a Grade ${grade} ${subject} question for TEKS ${teksStandard} in category ${category}`;
}

// Enhanced prompt generation using authentic STAAR patterns
export function createEnhancedSTAARPrompt(grade: number, subject: "math" | "reading", teksStandard: string, category?: string): string {
  // Get relevant authentic questions for context
  const relevantQuestions = subject === "math" 
    ? AUTHENTIC_STAAR_MATH_QUESTIONS.filter(q => q.grade === grade && q.category === category)
    : AUTHENTIC_STAAR_READING_QUESTIONS.filter(q => q.grade === grade && q.category === category);
  
  const exampleQuestion = relevantQuestions[Math.floor(Math.random() * relevantQuestions.length)];
  
  // Get TEKS standards for this grade and subject
  const gradeStandards = AUTHENTIC_TEKS_STANDARDS[grade as keyof typeof AUTHENTIC_TEKS_STANDARDS];
  const subjectStandards = gradeStandards?.[subject];
  const categoryStandards = subjectStandards?.[category || "Reading Comprehension"] || [];
  
  return `You are creating authentic STAAR test questions based on actual Texas assessments from 2013-2015.

GRADE: ${grade}
SUBJECT: ${subject.toUpperCase()}
TEKS STANDARD: ${teksStandard}
CATEGORY: ${category || "General"}

AUTHENTIC EXAMPLE FROM STAAR TESTS:
${exampleQuestion ? `
Question: ${exampleQuestion.questionText}
TEKS: ${exampleQuestion.teksStandard}
Type: ${exampleQuestion.questionType}
Difficulty: ${exampleQuestion.difficulty}
${exampleQuestion.answerChoices ? `Choices: ${JSON.stringify(exampleQuestion.answerChoices)}` : ''}
${exampleQuestion.correctAnswer ? `Correct: ${exampleQuestion.correctAnswer}` : ''}
` : 'No exact match found - create based on STAAR patterns'}

RELATED TEKS STANDARDS: ${JSON.stringify(categoryStandards)}

AUTHENTIC STAAR REQUIREMENTS:
1. Use precise Texas academic language
2. Include real-world contexts relevant to Texas students
3. Follow exact STAAR format and complexity
4. Test specific cognitive skills defined by TEKS
5. Use appropriate grade-level vocabulary
6. Include proper multiple-choice format (A,B,C,D or F,G,H,J)

${subject === "math" ? `
MATH-SPECIFIC REQUIREMENTS:
- Include visual/spatial elements when appropriate
- Use Texas measurement units and contexts
- Reference real Texas locations, situations
- Test mathematical reasoning, not just computation
- Include proper mathematical language and symbols
` : `
READING-SPECIFIC REQUIREMENTS:
- Base on authentic literary or informational passages
- Test comprehension, analysis, and inference skills
- Include Texas cultural references when appropriate
- Test vocabulary in context
- Require evidence-based thinking
`}

Generate a question that authentically matches STAAR test patterns. Return ONLY JSON:
{
  "question": "Complete question text following STAAR format",
  "choices": ["A) Choice 1", "B) Choice 2", "C) Choice 3", "D) Choice 4"],
  "correct": "A",
  "explanation": "Why this answer is correct based on TEKS standard",
  "teksStandard": "${teksStandard}",
  "category": "${category || "General"}"
}`;
}

// TEKS standard descriptions for better AI understanding
export const TEKS_DESCRIPTIONS = {
  math: {
    "3.2A": "Compose and decompose numbers up to 100,000",
    "3.2B": "Describe the mathematical relationships found in place value system",
    "3.2C": "Represent a number on a number line",
    "3.2D": "Compare and order whole numbers up to 100,000",
    "3.4A": "Represent multiplication facts by using various approaches",
    "3.4B": "Represent division facts by using various approaches",
    "3.4C": "Determine the number of objects in each group when objects are partitioned",
    "3.4D": "Use multiplication to solve problems involving equal-sized groups",
    "3.4E": "Represent and solve one- and two-step multiplication and division problems",
    "3.4F": "Recall facts to multiply up to 10 by 10 with automaticity",
    "3.6A": "Classify and sort two- and three-dimensional figures",
    "3.6B": "Use attributes to recognize rhombuses, parallelograms, trapezoids",
    "3.6C": "Determine the area of rectangles with whole number side lengths",
    "3.6D": "Decompose composite figures formed by rectangles",
    "3.7A": "Represent fractions greater than zero and less than or equal to one",
    "3.7B": "Determine the corresponding fraction greater than zero and less than one",
    "3.7C": "Explain that the unit fraction 1/b represents the quantity formed",
    "3.7D": "Compose and decompose a fraction a/b with a > 1",
    "3.7E": "Solve problems involving partitioning an object or set of objects",
    "3.8A": "Summarize a data set with multiple categories using a frequency table",
    "3.8B": "Solve one- and two-step problems using categorical data"
  },
  reading: {
    "3.6A": "Describe personal connections to a variety of sources",
    "3.6B": "Describe and explain the lesson or message of a work",
    "3.6C": "Identify and describe the theme of a work",
    "3.6D": "Describe the relationship between an illustration and the text",
    "3.6E": "Describe the structure of a work",
    "3.6F": "Describe how the author uses language to achieve a purpose",
    "3.6G": "Describe connections between texts",
    "3.6H": "Synthesize information to create new understanding",
    "3.7A": "Describe personal connections to a variety of sources",
    "3.7B": "Describe and explain the lesson or message of a work",
    "3.7C": "Use text evidence to support an appropriate response",
    "3.7D": "Retell and paraphrase texts in ways that maintain meaning",
    "3.7E": "Interact with sources in meaningful ways",
    "3.7F": "Respond using newly acquired vocabulary",
    "3.7G": "Discuss specific ideas in the text"
  }
};

// Function to get appropriate difficulty level based on TEKS and grade
export function getDifficultyLevel(grade: number, teksStandard: string): "low" | "medium" | "high" {
  // Analyze TEKS standard complexity
  const standardNumber = teksStandard.split('.')[1];
  const complexity = parseInt(standardNumber) || 1;
  
  if (grade === 3) {
    return complexity <= 2 ? "low" : complexity <= 4 ? "medium" : "high";
  } else if (grade === 4) {
    return complexity <= 3 ? "low" : complexity <= 6 ? "medium" : "high";
  } else { // grade 5
    return complexity <= 4 ? "low" : complexity <= 7 ? "medium" : "high";
  }
}