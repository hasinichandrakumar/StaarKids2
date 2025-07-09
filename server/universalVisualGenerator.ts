/**
 * Universal Visual Generator - Creates SVG diagrams for all generated questions
 * Integrates with every question generation system to provide visual elements
 * NOW USING AUTHENTIC STAAR FORMATTING EXCLUSIVELY
 */

import { InsertQuestion } from "@shared/schema";
import { generateAuthenticSTAARVisual, type AuthenticSTAARConfig } from "./authenticSTAARVisualGenerator";

export interface VisualConfig {
  questionId?: number;
  grade: number;
  subject: "math" | "reading";
  questionText: string;
  category: string;
  teksStandard: string;
  answerChoices: Array<{id: string; text: string}> | string[];
  correctAnswer: string;
}

/**
 * Main function to generate SVG diagrams for any question
 * Uses authentic STAAR formatting for all visuals
 */
export function generateQuestionVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription?: string;
  svgContent?: string;
} {
  // Convert to AuthenticSTAARConfig format
  const staarConfig: AuthenticSTAARConfig = {
    questionId: config.questionId,
    grade: config.grade,
    subject: config.subject,
    questionText: config.questionText,
    category: config.category || "Number & Operations",
    teksStandard: config.teksStandard,
    answerChoices: config.answerChoices,
    correctAnswer: config.correctAnswer
  };

  // Use authentic STAAR visual generator
  const result = generateAuthenticSTAARVisual(staarConfig);
  
  return {
    hasImage: result.hasImage,
    imageDescription: result.imageDescription,
    svgContent: result.svgContent
  };
}

/**
 * Enhanced visual generator for new questions being created
 * Ensures all newly generated questions include proper visual elements
 */
export function generateEnhancedQuestionWithVisual(question: InsertQuestion): InsertQuestion {
  if (question.subject === "math") {
    const visualConfig: VisualConfig = {
      questionId: question.id,
      grade: question.grade,
      subject: question.subject,
      questionText: question.questionText,
      category: question.category || "Number & Operations",
      teksStandard: question.teksStandard,
      answerChoices: question.answerChoices,
      correctAnswer: question.correctAnswer
    };

    const visual = generateQuestionVisual(visualConfig);
    
    return {
      ...question,
      hasImage: visual.hasImage,
      imageDescription: visual.imageDescription,
      svgContent: visual.svgContent
    };
  }

  return question;
}