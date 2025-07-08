/**
 * Context-Aware Question Generation System
 * Adapts to learner's level, progress, and performance patterns
 */

import { InsertQuestion } from "@shared/schema";
import { validateQuestionQuality, QualityMetrics } from "./qualityControl";
import { generateQualityImage, ImageGenerationConfig } from "./enhancedImageGenerator";

export interface LearnerContext {
  userId: string;
  grade: number;
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  recentPerformance: PerformanceData[];
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  timeSpentPerQuestion: number;
  errorPatterns: ErrorPattern[];
}

export interface PerformanceData {
  questionId: string;
  category: string;
  teksStandard: string;
  correct: boolean;
  timeSpent: number;
  timestamp: Date;
}

export interface ErrorPattern {
  type: string;
  frequency: number;
  category: string;
  description: string;
}

export interface AdaptiveGenerationConfig {
  grade: number;
  subject: 'math' | 'reading';
  category: string;
  targetDifficulty: number; // 0.3-0.9 (30%-90% success rate)
  learnerContext: LearnerContext;
  includeVisuals: boolean;
  focusAreas?: string[];
}

/**
 * Generate questions adapted to learner's current level and needs
 */
export async function generateContextAwareQuestions(
  config: AdaptiveGenerationConfig,
  count: number = 5
): Promise<InsertQuestion[]> {
  
  const questions: InsertQuestion[] = [];
  
  // Analyze learner patterns to determine optimal question types
  const questionStrategy = analyzeOptimalStrategy(config.learnerContext);
  
  for (let i = 0; i < count; i++) {
    // Determine question parameters based on context
    const questionParams = determineQuestionParameters(config, questionStrategy, i);
    
    // Generate base question
    let question = await generateAdaptiveQuestion(questionParams);
    
    // Apply difficulty adjustment
    question = adjustQuestionDifficulty(question, config.targetDifficulty, config.learnerContext);
    
    // Add visual elements if beneficial for this learner
    if (shouldIncludeVisual(question, config.learnerContext)) {
      question = await addContextualVisual(question, config);
    }
    
    // Validate quality and appropriateness
    const validation = await validateQuestionQuality(question);
    
    if (validation.isValid || validation.score > 0.7) {
      questions.push(question);
    } else {
      // Generate fallback question
      const fallback = generateFallbackContextQuestion(questionParams);
      questions.push(fallback);
    }
  }
  
  return questions;
}

/**
 * Analyze learner performance to determine optimal generation strategy
 */
function analyzeOptimalStrategy(context: LearnerContext): QuestionStrategy {
  const recentAccuracy = calculateRecentAccuracy(context.recentPerformance);
  const averageTime = context.timeSpentPerQuestion;
  
  // Determine if learner needs more practice in specific areas
  const strugglingAreas = identifyStrugglePatterms(context);
  
  // Adapt to learning style based on performance patterns
  const preferredQuestionTypes = analyzePreferredTypes(context);
  
  return {
    focusAreas: strugglingAreas,
    preferredTypes: preferredQuestionTypes,
    targetAccuracy: recentAccuracy,
    timeConstraint: averageTime > 120 ? 'extended' : 'standard',
    scaffoldingLevel: recentAccuracy < 0.6 ? 'high' : recentAccuracy < 0.8 ? 'medium' : 'low'
  };
}

interface QuestionStrategy {
  focusAreas: string[];
  preferredTypes: string[];
  targetAccuracy: number;
  timeConstraint: 'standard' | 'extended';
  scaffoldingLevel: 'low' | 'medium' | 'high';
}

/**
 * Determine specific parameters for each question
 */
function determineQuestionParameters(
  config: AdaptiveGenerationConfig,
  strategy: QuestionStrategy,
  questionIndex: number
): QuestionGenerationParams {
  
  // Progressive difficulty within the set
  const difficultyProgression = 0.1 + (questionIndex * 0.15);
  const adjustedDifficulty = Math.min(config.targetDifficulty + difficultyProgression, 0.9);
  
  // Select category based on learner needs
  const category = selectOptimalCategory(config, strategy, questionIndex);
  
  // Determine question type based on performance patterns
  const questionType = selectQuestionType(config.subject, strategy, questionIndex);
  
  return {
    grade: config.grade,
    subject: config.subject,
    category,
    questionType,
    difficulty: adjustedDifficulty,
    includeScaffolding: strategy.scaffoldingLevel !== 'low',
    timeLimit: strategy.timeConstraint === 'extended' ? 180 : 120,
    focusSkills: strategy.focusAreas
  };
}

interface QuestionGenerationParams {
  grade: number;
  subject: 'math' | 'reading';
  category: string;
  questionType: string;
  difficulty: number;
  includeScaffolding: boolean;
  timeLimit: number;
  focusSkills: string[];
}

/**
 * Generate adaptive question based on parameters
 */
async function generateAdaptiveQuestion(params: QuestionGenerationParams): Promise<InsertQuestion> {
  
  if (params.subject === 'math') {
    return generateAdaptiveMathQuestion(params);
  } else {
    return generateAdaptiveReadingQuestion(params);
  }
}

/**
 * Generate math question adapted to learner context
 */
function generateAdaptiveMathQuestion(params: QuestionGenerationParams): InsertQuestion {
  const templates = getMathTemplatesByType(params.questionType, params.difficulty);
  const template = selectBestTemplate(templates, params);
  
  // Generate variables appropriate for difficulty level
  const variables = generateDifficultyAppropriateVariables(params);
  
  // Apply template with scaffolding if needed
  let questionText = template.questionText;
  let explanation = template.explanation;
  
  if (params.includeScaffolding) {
    questionText = addMathScaffolding(questionText, params);
    explanation = enhanceExplanation(explanation, params);
  }
  
  // Replace variables
  questionText = replaceTemplateVariables(questionText, variables);
  explanation = replaceTemplateVariables(explanation, variables);
  
  const answerChoices = generateAnswerChoices(template, variables, params.difficulty);
  const correctAnswer = calculateCorrectAnswer(template, variables);
  
  return {
    id: Date.now(),
    questionText,
    answerChoices,
    correctAnswer,
    explanation,
    subject: params.subject,
    grade: params.grade,
    category: params.category,
    teksStandard: getTeksStandard(params.grade, params.category),
    difficulty: params.difficulty,
    timeLimit: params.timeLimit
  };
}

/**
 * Generate reading question adapted to learner context  
 */
function generateAdaptiveReadingQuestion(params: QuestionGenerationParams): InsertQuestion {
  const passages = getReadingPassagesByDifficulty(params.grade, params.difficulty);
  const passage = selectAppropriatePassage(passages, params);
  
  let questionText = generateReadingQuestionText(passage, params);
  
  if (params.includeScaffolding) {
    questionText = addReadingScaffolding(questionText, params);
  }
  
  const answerChoices = generateReadingChoices(passage, questionText, params.difficulty);
  const correctAnswer = determineCorrectReadingAnswer(passage, questionText);
  const explanation = generateReadingExplanation(passage, questionText, correctAnswer);
  
  return {
    id: Date.now(),
    questionText,
    answerChoices,
    correctAnswer,
    explanation,
    passage: passage.text,
    subject: params.subject,
    grade: params.grade,
    category: params.category,
    teksStandard: getTeksStandard(params.grade, params.category),
    difficulty: params.difficulty,
    timeLimit: params.timeLimit
  };
}

/**
 * Adjust question difficulty based on target success rate
 */
function adjustQuestionDifficulty(
  question: InsertQuestion,
  targetDifficulty: number,
  context: LearnerContext
): InsertQuestion {
  
  // If learner struggles with time, simplify language
  if (context.timeSpentPerQuestion > 150) {
    question.questionText = simplifyLanguage(question.questionText);
  }
  
  // If accuracy is low, add more context clues
  const recentAccuracy = calculateRecentAccuracy(context.recentPerformance);
  if (recentAccuracy < 0.6) {
    question.questionText = addContextClues(question.questionText, question.subject);
    question.explanation = enhanceExplanationWithSteps(question.explanation);
  }
  
  // Adjust numerical complexity for math
  if (question.subject === 'math' && targetDifficulty < 0.5) {
    question = simplifyMathComplexity(question);
  }
  
  return question;
}

/**
 * Determine if visual aid would benefit this learner
 */
function shouldIncludeVisual(question: InsertQuestion, context: LearnerContext): boolean {
  // Visual learners benefit from diagrams
  const isVisualLearner = context.strengths.includes('visual') || 
                         context.recentPerformance.filter(p => p.correct).length > 
                         context.recentPerformance.filter(p => !p.correct).length;
  
  // Math geometry always benefits from visuals
  if (question.subject === 'math' && 
      (question.category.includes('Geometry') || question.questionText.includes('shape'))) {
    return true;
  }
  
  // Struggling learners benefit from visual aids
  const recentAccuracy = calculateRecentAccuracy(context.recentPerformance);
  if (recentAccuracy < 0.7) {
    return true;
  }
  
  return isVisualLearner;
}

/**
 * Add contextual visual elements
 */
async function addContextualVisual(
  question: InsertQuestion,
  config: AdaptiveGenerationConfig
): Promise<InsertQuestion> {
  
  const imageConfig: ImageGenerationConfig = {
    questionId: question.id.toString(),
    questionText: question.questionText,
    grade: question.grade,
    subject: question.subject,
    imageType: determineImageType(question),
    complexity: config.targetDifficulty > 0.7 ? 'complex' : 'simple',
    requirements: extractImageRequirements(question.questionText)
  };
  
  try {
    const generatedImage = await generateQualityImage(imageConfig);
    
    if (generatedImage.validationScore > 0.7) {
      question.svgContent = generatedImage.svgContent;
      question.imageDescription = generatedImage.description;
    }
  } catch (error) {
    console.error('Failed to generate contextual visual:', error);
  }
  
  return question;
}

/**
 * Helper functions for context analysis
 */
function calculateRecentAccuracy(performance: PerformanceData[]): number {
  if (performance.length === 0) return 0.5; // neutral starting point
  
  const recent = performance.slice(-10); // last 10 questions
  const correct = recent.filter(p => p.correct).length;
  return correct / recent.length;
}

function identifyStrugglePatterms(context: LearnerContext): string[] {
  const struggles: string[] = [];
  
  // Analyze recent performance by category
  const categoryPerformance = new Map<string, { correct: number; total: number }>();
  
  context.recentPerformance.forEach(p => {
    if (!categoryPerformance.has(p.category)) {
      categoryPerformance.set(p.category, { correct: 0, total: 0 });
    }
    const stats = categoryPerformance.get(p.category)!;
    stats.total++;
    if (p.correct) stats.correct++;
  });
  
  // Identify categories with <60% accuracy
  categoryPerformance.forEach((stats, category) => {
    if (stats.total >= 3 && (stats.correct / stats.total) < 0.6) {
      struggles.push(category);
    }
  });
  
  return struggles;
}

function analyzePreferredTypes(context: LearnerContext): string[] {
  // This would analyze which question types the learner performs best on
  return ['word_problem', 'multiple_choice', 'visual_aid'];
}

function selectOptimalCategory(
  config: AdaptiveGenerationConfig,
  strategy: QuestionStrategy,
  questionIndex: number
): string {
  
  // Prioritize struggling areas for earlier questions
  if (questionIndex < 2 && strategy.focusAreas.length > 0) {
    return strategy.focusAreas[questionIndex % strategy.focusAreas.length];
  }
  
  // Use specified focus areas
  if (config.focusAreas && config.focusAreas.length > 0) {
    return config.focusAreas[questionIndex % config.focusAreas.length];
  }
  
  // Default category
  return config.category;
}

function selectQuestionType(subject: string, strategy: QuestionStrategy, index: number): string {
  const mathTypes = ['calculation', 'word_problem', 'visual_spatial', 'pattern_recognition'];
  const readingTypes = ['comprehension', 'vocabulary', 'inference', 'main_idea'];
  
  const types = subject === 'math' ? mathTypes : readingTypes;
  return types[index % types.length];
}

// Placeholder implementations for template and content functions
function getMathTemplatesByType(type: string, difficulty: number): any[] {
  return [{ questionText: "Solve: {a} + {b} = ?", explanation: "Add {a} and {b}" }];
}

function selectBestTemplate(templates: any[], params: QuestionGenerationParams): any {
  return templates[0];
}

function generateDifficultyAppropriateVariables(params: QuestionGenerationParams): any {
  const maxValue = params.difficulty * params.grade * 20;
  return {
    a: Math.floor(Math.random() * maxValue) + 1,
    b: Math.floor(Math.random() * maxValue) + 1
  };
}

function addMathScaffolding(questionText: string, params: QuestionGenerationParams): string {
  return `Remember to show your work step by step.\n\n${questionText}`;
}

function enhanceExplanation(explanation: string, params: QuestionGenerationParams): string {
  return `${explanation}\n\nStep-by-step solution:\n1. Identify what you need to find\n2. Set up the problem\n3. Solve carefully`;
}

function replaceTemplateVariables(text: string, variables: any): string {
  let result = text;
  Object.keys(variables).forEach(key => {
    result = result.replace(new RegExp(`{${key}}`, 'g'), variables[key].toString());
  });
  return result;
}

function generateAnswerChoices(template: any, variables: any, difficulty: number): string[] {
  const correct = variables.a + variables.b;
  const choices = [correct.toString()];
  
  // Generate distractors
  choices.push((correct + 1).toString());
  choices.push((correct - 1).toString());
  choices.push((variables.a * variables.b).toString());
  
  return shuffleArray(choices);
}

function calculateCorrectAnswer(template: any, variables: any): string {
  return (variables.a + variables.b).toString();
}

function getTeksStandard(grade: number, category: string): string {
  return `${grade}.1A`; // Simplified
}

function getReadingPassagesByDifficulty(grade: number, difficulty: number): any[] {
  return [{ text: "Sample passage text for reading comprehension." }];
}

function selectAppropriatePassage(passages: any[], params: QuestionGenerationParams): any {
  return passages[0];
}

function generateReadingQuestionText(passage: any, params: QuestionGenerationParams): string {
  return "What is the main idea of the passage?";
}

function addReadingScaffolding(questionText: string, params: QuestionGenerationParams): string {
  return `Tip: Look for the most important point the author is making.\n\n${questionText}`;
}

function generateReadingChoices(passage: any, question: string, difficulty: number): string[] {
  return ["Main idea A", "Main idea B", "Main idea C", "Main idea D"];
}

function determineCorrectReadingAnswer(passage: any, question: string): string {
  return "Main idea A";
}

function generateReadingExplanation(passage: any, question: string, answer: string): string {
  return `The correct answer is "${answer}" because it best represents the central theme of the passage.`;
}

function simplifyLanguage(text: string): string {
  return text.replace(/complex/g, 'hard').replace(/utilize/g, 'use');
}

function addContextClues(text: string, subject: string): string {
  if (subject === 'math') {
    return `Hint: Look for key math words like "total," "sum," or "difference."\n\n${text}`;
  }
  return `Hint: Read the question carefully and look back at the text for clues.\n\n${text}`;
}

function enhanceExplanationWithSteps(explanation: string): string {
  return `${explanation}\n\nDetailed Steps:\n1. Read the problem carefully\n2. Identify what you know\n3. Determine what you need to find\n4. Choose the right strategy\n5. Solve step by step\n6. Check your answer`;
}

function simplifyMathComplexity(question: InsertQuestion): InsertQuestion {
  // Reduce number complexity
  question.questionText = question.questionText.replace(/\d{3,}/g, (match) => {
    return Math.floor(parseInt(match) / 10).toString();
  });
  return question;
}

function determineImageType(question: InsertQuestion): 'diagram' | 'chart' | 'illustration' | 'geometric' {
  const text = question.questionText.toLowerCase();
  if (text.includes('shape') || text.includes('triangle') || text.includes('rectangle')) {
    return 'geometric';
  }
  if (text.includes('chart') || text.includes('graph') || text.includes('data')) {
    return 'chart';
  }
  return 'diagram';
}

function extractImageRequirements(questionText: string): string[] {
  const requirements = [];
  if (questionText.includes('label')) requirements.push('labels');
  if (questionText.includes('measure')) requirements.push('measurements');
  if (questionText.includes('color')) requirements.push('colors');
  return requirements;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateFallbackContextQuestion(params: QuestionGenerationParams): InsertQuestion {
  return {
    id: Date.now(),
    questionText: `What is 2 + 2?`,
    answerChoices: ["3", "4", "5", "6"],
    correctAnswer: "4",
    explanation: "2 + 2 = 4",
    subject: params.subject,
    grade: params.grade,
    category: params.category,
    teksStandard: getTeksStandard(params.grade, params.category),
    difficulty: 0.3
  };
}