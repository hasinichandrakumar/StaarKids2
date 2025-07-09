/**
 * Custom LLM Question Generator - Uses flexible LLM adapter for question generation
 * Supports any LLM provider while maintaining STAAR authenticity
 */

import { InsertQuestion } from "@shared/schema";
import { CustomLLMAdapter, createLLMAdapter } from "./customLLMAdapter";

export class CustomLLMQuestionGenerator {
  private llmAdapter: CustomLLMAdapter;

  constructor(llmAdapter?: CustomLLMAdapter) {
    this.llmAdapter = llmAdapter || createLLMAdapter();
  }

  /**
   * Generate multiple questions using custom LLM
   */
  async generateQuestions(
    grade: number,
    subject: "math" | "reading",
    count: number = 5,
    category?: string
  ): Promise<InsertQuestion[]> {
    const questions: InsertQuestion[] = [];
    const teksStandards = this.getTeksStandards(grade, subject);

    for (let i = 0; i < count; i++) {
      const teksStandard = teksStandards[i % teksStandards.length];
      const question = await this.llmAdapter.generateQuestion(
        grade,
        subject,
        teksStandard,
        category
      );

      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  /**
   * Generate a single question with custom LLM
   */
  async generateSingleQuestion(
    grade: number,
    subject: "math" | "reading",
    teksStandard?: string,
    category?: string
  ): Promise<InsertQuestion | null> {
    const standard = teksStandard || this.getRandomTeksStandard(grade, subject);
    return this.llmAdapter.generateQuestion(grade, subject, standard, category);
  }

  /**
   * Generate questions with specific requirements
   */
  async generateTargetedQuestions(
    requirements: {
      grade: number;
      subject: "math" | "reading";
      teksStandards: string[];
      categories?: string[];
      difficulty?: "easy" | "medium" | "hard";
      includeImages?: boolean;
    }
  ): Promise<InsertQuestion[]> {
    const questions: InsertQuestion[] = [];

    for (const teksStandard of requirements.teksStandards) {
      const category = requirements.categories 
        ? requirements.categories[Math.floor(Math.random() * requirements.categories.length)]
        : undefined;

      const question = await this.llmAdapter.generateQuestion(
        requirements.grade,
        requirements.subject,
        teksStandard,
        category
      );

      if (question) {
        // Apply additional requirements
        if (requirements.difficulty) {
          question.difficulty = requirements.difficulty;
        }
        questions.push(question);
      }
    }

    return questions;
  }

  /**
   * Validate generated questions for STAAR compliance
   */
  validateQuestion(question: InsertQuestion): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Check required fields
    if (!question.questionText || question.questionText.length < 10) {
      issues.push("Question text too short or missing");
    }

    if (!question.answerChoices || question.answerChoices.length !== 4) {
      issues.push("Must have exactly 4 answer choices");
    }

    if (!question.correctAnswer || !['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
      issues.push("Correct answer must be A, B, C, or D");
    }

    if (!question.explanation || question.explanation.length < 10) {
      issues.push("Explanation too short or missing");
    }

    // Check TEKS standard format
    if (!question.teksStandard || !/^\d+\.\d+[A-Z]?$/.test(question.teksStandard)) {
      issues.push("Invalid TEKS standard format");
    }

    // Subject-specific validation
    if (question.subject === "math") {
      this.validateMathQuestion(question, issues);
    } else if (question.subject === "reading") {
      this.validateReadingQuestion(question, issues);
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Validate math question specifics
   */
  private validateMathQuestion(question: InsertQuestion, issues: string[]) {
    // Check for numerical accuracy
    if (question.questionText.includes('=') || question.explanation.includes('=')) {
      // Extract and verify calculations
      const calculations = this.extractCalculations(question.questionText + ' ' + question.explanation);
      for (const calc of calculations) {
        if (!this.verifyCalculation(calc)) {
          issues.push(`Invalid calculation: ${calc}`);
        }
      }
    }

    // Check for common math terms
    const mathTerms = ['add', 'subtract', 'multiply', 'divide', 'area', 'perimeter', 'volume', 'fraction', 'decimal'];
    const hasRelevantTerms = mathTerms.some(term => 
      question.questionText.toLowerCase().includes(term) ||
      question.explanation.toLowerCase().includes(term)
    );

    if (!hasRelevantTerms) {
      issues.push("Question may not be math-related");
    }
  }

  /**
   * Validate reading question specifics
   */
  private validateReadingQuestion(question: InsertQuestion, issues: string[]) {
    // Check for reading comprehension elements
    const readingTerms = ['passage', 'story', 'text', 'author', 'character', 'main idea', 'detail'];
    const hasRelevantTerms = readingTerms.some(term => 
      question.questionText.toLowerCase().includes(term)
    );

    if (!hasRelevantTerms) {
      issues.push("Question may not be reading-related");
    }

    // Check question length (reading questions often longer)
    if (question.questionText.length < 50) {
      issues.push("Reading question may be too short");
    }
  }

  /**
   * Extract mathematical calculations from text
   */
  private extractCalculations(text: string): string[] {
    const calcRegex = /(\d+(?:\.\d+)?)\s*([+\-×÷*\/])\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/g;
    const calculations = [];
    let match;

    while ((match = calcRegex.exec(text)) !== null) {
      calculations.push(match[0]);
    }

    return calculations;
  }

  /**
   * Verify mathematical calculation accuracy
   */
  private verifyCalculation(calculation: string): boolean {
    try {
      const parts = calculation.match(/(\d+(?:\.\d+)?)\s*([+\-×÷*\/])\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)/);
      if (!parts) return false;

      const [, num1, operator, num2, result] = parts;
      const a = parseFloat(num1);
      const b = parseFloat(num2);
      const expected = parseFloat(result);

      let actual: number;
      switch (operator) {
        case '+': actual = a + b; break;
        case '-': actual = a - b; break;
        case '×': case '*': actual = a * b; break;
        case '÷': case '/': actual = a / b; break;
        default: return false;
      }

      return Math.abs(actual - expected) < 0.001;
    } catch {
      return false;
    }
  }

  /**
   * Get TEKS standards for grade and subject
   */
  private getTeksStandards(grade: number, subject: "math" | "reading"): string[] {
    if (subject === "math") {
      return [
        `${grade}.1A`, `${grade}.1B`, `${grade}.1C`, `${grade}.1D`,
        `${grade}.2A`, `${grade}.2B`, `${grade}.2C`,
        `${grade}.3A`, `${grade}.3B`, `${grade}.3C`,
        `${grade}.4A`, `${grade}.4B`, `${grade}.4C`,
        `${grade}.5A`, `${grade}.5B`, `${grade}.5C`
      ];
    } else {
      return [
        `${grade}.6A`, `${grade}.6B`, `${grade}.6C`,
        `${grade}.7A`, `${grade}.7B`, `${grade}.7C`,
        `${grade}.8A`, `${grade}.8B`, `${grade}.8C`,
        `${grade}.9A`, `${grade}.9B`, `${grade}.9C`,
        `${grade}.10A`, `${grade}.10B`, `${grade}.10C`
      ];
    }
  }

  /**
   * Get random TEKS standard
   */
  private getRandomTeksStandard(grade: number, subject: "math" | "reading"): string {
    const standards = this.getTeksStandards(grade, subject);
    return standards[Math.floor(Math.random() * standards.length)];
  }
}

/**
 * Factory function to create question generator with environment-based LLM
 */
export function createCustomLLMGenerator(): CustomLLMQuestionGenerator {
  return new CustomLLMQuestionGenerator();
}

/**
 * Export for backwards compatibility
 */
export async function generateWithCustomLLM(
  grade: number,
  subject: "math" | "reading",
  count: number = 1,
  category?: string
): Promise<InsertQuestion[]> {
  const generator = createCustomLLMGenerator();
  return generator.generateQuestions(grade, subject, count, category);
}