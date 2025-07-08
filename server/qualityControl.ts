/**
 * Enhanced Quality Control System for STAAR Kids
 * Implements validation pipelines, content accuracy checks, and image generation guardrails
 */

import { InsertQuestion } from "@shared/schema";

export interface QualityMetrics {
  accuracy: number;
  readability: number;
  gradeAppropriate: boolean;
  teksAlignment: boolean;
  imageQuality?: number;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
  metrics: QualityMetrics;
}

/**
 * Main quality control pipeline for questions
 */
export async function validateQuestionQuality(question: InsertQuestion): Promise<ValidationResult> {
  const validations = await Promise.all([
    validateMathAccuracy(question),
    validateReadingComprehension(question),
    validateGradeAppropriate(question),
    validateTeksAlignment(question),
    validateImageContent(question)
  ]);

  const issues: string[] = [];
  const suggestions: string[] = [];
  let totalScore = 0;

  validations.forEach(result => {
    issues.push(...result.issues);
    suggestions.push(...result.suggestions);
    totalScore += result.score;
  });

  const averageScore = totalScore / validations.length;
  const isValid = averageScore >= 0.8 && issues.length === 0;

  return {
    isValid,
    score: averageScore,
    issues,
    suggestions,
    metrics: {
      accuracy: validations[0].score,
      readability: validations[1].score,
      gradeAppropriate: validations[2].score > 0.8,
      teksAlignment: validations[3].score > 0.8,
      imageQuality: validations[4]?.score
    }
  };
}

/**
 * Validate mathematical accuracy and calculations
 */
async function validateMathAccuracy(question: InsertQuestion): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (question.subject !== 'math') {
    return { score: 1.0, issues, suggestions };
  }

  // Extract numbers and operations from question text
  const numbers = extractNumbers(question.questionText);
  const operations = extractOperations(question.questionText);

  // Validate answer choices are mathematically sound
  if (question.answerChoices && question.correctAnswer) {
    const correctIndex = question.answerChoices.indexOf(question.correctAnswer);
    if (correctIndex === -1) {
      issues.push("Correct answer not found in answer choices");
    }

    // Check for realistic distractors
    const numericChoices = question.answerChoices
      .map(choice => parseFloat(choice.replace(/[^\d.-]/g, '')))
      .filter(num => !isNaN(num));

    if (numericChoices.length > 1) {
      const range = Math.max(...numericChoices) - Math.min(...numericChoices);
      const correctValue = parseFloat(question.correctAnswer.replace(/[^\d.-]/g, ''));
      
      if (range === 0) {
        issues.push("All answer choices are identical");
      }
      
      if (!isNaN(correctValue) && numericChoices.some(val => Math.abs(val - correctValue) < 0.01 && val !== correctValue)) {
        suggestions.push("Consider making distractors more distinct from correct answer");
      }
    }
  }

  // Validate grade-appropriate number ranges
  const maxNumber = Math.max(...numbers);
  const gradeRanges = {
    3: 1000,
    4: 10000,
    5: 100000
  };

  if (maxNumber > gradeRanges[question.grade as keyof typeof gradeRanges]) {
    issues.push(`Numbers too large for grade ${question.grade}`);
  }

  const score = issues.length === 0 ? 1.0 : Math.max(0, 1 - (issues.length * 0.3));
  return { score, issues, suggestions };
}

/**
 * Validate reading comprehension question structure
 */
async function validateReadingComprehension(question: InsertQuestion): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (question.subject !== 'reading') {
    return { score: 1.0, issues, suggestions };
  }

  // Check passage length and complexity
  if (question.passage) {
    const wordCount = question.passage.split(/\s+/).length;
    const gradeWordRanges = {
      3: { min: 50, max: 200 },
      4: { min: 75, max: 300 },
      5: { min: 100, max: 400 }
    };

    const range = gradeWordRanges[question.grade as keyof typeof gradeWordRanges];
    if (wordCount < range.min) {
      issues.push("Passage too short for grade level");
    } else if (wordCount > range.max) {
      issues.push("Passage too long for grade level");
    }

    // Check sentence complexity
    const sentences = question.passage.split(/[.!?]+/).filter(s => s.trim());
    const avgWordsPerSentence = wordCount / sentences.length;
    
    if (avgWordsPerSentence > 20) {
      suggestions.push("Consider shorter sentences for better readability");
    }
  }

  // Validate question asks for text-supported answers
  const supportKeywords = ['according to', 'based on', 'the text states', 'the passage', 'the story'];
  const hasTextSupport = supportKeywords.some(keyword => 
    question.questionText.toLowerCase().includes(keyword)
  );

  if (!hasTextSupport) {
    suggestions.push("Consider adding text reference to ensure answer is passage-based");
  }

  const score = issues.length === 0 ? 1.0 : Math.max(0, 1 - (issues.length * 0.2));
  return { score, issues, suggestions };
}

/**
 * Validate content is appropriate for grade level
 */
async function validateGradeAppropriate(question: InsertQuestion): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check vocabulary complexity
  const complexWords = extractComplexWords(question.questionText);
  const gradeWordLimits = {
    3: 2,
    4: 3,
    5: 4
  };

  if (complexWords.length > gradeWordLimits[question.grade as keyof typeof gradeWordLimits]) {
    suggestions.push("Consider simpler vocabulary for grade level");
  }

  // Check TEKS alignment
  if (!question.teksStandard || !question.teksStandard.includes(question.grade.toString())) {
    issues.push("TEKS standard doesn't match grade level");
  }

  const score = issues.length === 0 ? 1.0 : 0.5;
  return { score, issues, suggestions };
}

/**
 * Validate TEKS standard alignment
 */
async function validateTeksAlignment(question: InsertQuestion): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!question.teksStandard) {
    issues.push("Missing TEKS standard");
    return { score: 0, issues, suggestions };
  }

  // Validate TEKS format (e.g., "3.4A", "4.2B")
  const teksPattern = /^\d\.\d+[A-Z]$/;
  if (!teksPattern.test(question.teksStandard)) {
    issues.push("Invalid TEKS format");
  }

  // Check if content matches TEKS category
  const teksCategories = {
    math: ['Number and Operations', 'Algebraic Reasoning', 'Geometry', 'Measurement', 'Data Analysis'],
    reading: ['Reading Comprehension', 'Literary Analysis', 'Informational Text', 'Vocabulary', 'Author\'s Purpose']
  };

  if (question.category && !teksCategories[question.subject]?.includes(question.category)) {
    suggestions.push("Verify category alignment with TEKS standards");
  }

  const score = issues.length === 0 ? 1.0 : 0.3;
  return { score, issues, suggestions };
}

/**
 * Validate image content and quality
 */
async function validateImageContent(question: InsertQuestion): Promise<{ score: number; issues: string[]; suggestions: string[] }> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!question.imageUrl && !question.svgContent) {
    return { score: 1.0, issues, suggestions }; // No image to validate
  }

  if (question.svgContent) {
    // Validate SVG structure
    if (!question.svgContent.includes('<svg') || !question.svgContent.includes('</svg>')) {
      issues.push("Invalid SVG structure");
    }

    // Check for appropriate dimensions
    const widthMatch = question.svgContent.match(/width="(\d+)"/);
    const heightMatch = question.svgContent.match(/height="(\d+)"/);
    
    if (widthMatch && heightMatch) {
      const width = parseInt(widthMatch[1]);
      const height = parseInt(heightMatch[1]);
      
      if (width > 800 || height > 600) {
        suggestions.push("Consider smaller image dimensions for better display");
      }
    }

    // Validate accessibility attributes
    if (!question.svgContent.includes('aria-label') && !question.svgContent.includes('title')) {
      suggestions.push("Add accessibility labels to SVG");
    }
  }

  const score = issues.length === 0 ? 1.0 : Math.max(0, 1 - (issues.length * 0.4));
  return { score, issues, suggestions };
}

/**
 * Helper functions
 */
function extractNumbers(text: string): number[] {
  const numberMatches = text.match(/\d+\.?\d*/g);
  return numberMatches ? numberMatches.map(Number) : [];
}

function extractOperations(text: string): string[] {
  const operations = [];
  if (text.includes('+') || text.includes('add')) operations.push('addition');
  if (text.includes('-') || text.includes('subtract')) operations.push('subtraction');
  if (text.includes('×') || text.includes('*') || text.includes('multiply')) operations.push('multiplication');
  if (text.includes('÷') || text.includes('/') || text.includes('divide')) operations.push('division');
  return operations;
}

function extractComplexWords(text: string): string[] {
  const words = text.split(/\s+/);
  return words.filter(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    return cleanWord.length > 8 || 
           cleanWord.includes('tion') || 
           cleanWord.includes('sion') ||
           cleanWord.includes('ology') ||
           cleanWord.includes('ment');
  });
}

/**
 * Human-in-the-loop quality assurance
 */
export interface ReviewRequest {
  questionId: string;
  question: InsertQuestion;
  validationResult: ValidationResult;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export class QualityReviewSystem {
  private reviewQueue: ReviewRequest[] = [];

  addToReviewQueue(questionId: string, question: InsertQuestion, validationResult: ValidationResult) {
    const priority = this.determinePriority(validationResult);
    
    this.reviewQueue.push({
      questionId,
      question,
      validationResult,
      priority,
      timestamp: new Date()
    });

    // Sort by priority
    this.reviewQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private determinePriority(result: ValidationResult): 'low' | 'medium' | 'high' {
    if (result.score < 0.6 || result.issues.length > 2) return 'high';
    if (result.score < 0.8 || result.issues.length > 0) return 'medium';
    return 'low';
  }

  getReviewQueue(): ReviewRequest[] {
    return this.reviewQueue;
  }

  approveQuestion(questionId: string): boolean {
    const index = this.reviewQueue.findIndex(req => req.questionId === questionId);
    if (index !== -1) {
      this.reviewQueue.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const reviewSystem = new QualityReviewSystem();