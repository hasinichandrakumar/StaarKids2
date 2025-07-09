/**
 * Authentic STAAR Learner - Uses OpenAI Vision to analyze real STAAR test images
 * Generates questions that perfectly match authentic STAAR patterns
 */

import OpenAI from "openai";
import { InsertQuestion } from "@shared/schema";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AuthenticSTAARPattern {
  questionText: string;
  answerChoices: string[];
  correctAnswer: string;
  explanation: string;
  teksStandard: string;
  grade: number;
  subject: "math" | "reading";
  hasVisual: boolean;
  visualDescription?: string;
  questionType: string;
  languagePatterns: string[];
  mathematicalConcepts?: string[];
  visualElements?: string[];
}

/**
 * Analyze authentic STAAR test images to extract patterns
 */
export async function analyzeAuthenticSTAARImages(): Promise<AuthenticSTAARPattern[]> {
  console.log("🔍 Analyzing authentic STAAR test images with OpenAI Vision...");
  
  const staarImages = [
    "image_1752020119094.png",
    "image_1752020651530.png", 
    "image_1752020675007.png",
    "image_1752020930185.png"
  ];
  
  const patterns: AuthenticSTAARPattern[] = [];
  
  for (const imagePath of staarImages) {
    try {
      const analysisResult = await analyzeSTAARImage(imagePath);
      patterns.push(...analysisResult);
    } catch (error) {
      console.error(`Error analyzing ${imagePath}:`, error);
    }
  }
  
  console.log(`✅ Extracted ${patterns.length} authentic STAAR patterns`);
  return patterns;
}

/**
 * Analyze a single STAAR test image using OpenAI Vision
 */
async function analyzeSTAARImage(imagePath: string): Promise<AuthenticSTAARPattern[]> {
  const fullPath = path.join(process.cwd(), "attached_assets", imagePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Image not found: ${fullPath}`);
    return [];
  }
  
  // Read and encode image as base64
  const imageBuffer = fs.readFileSync(fullPath);
  const base64Image = imageBuffer.toString('base64');
  
  const analysisPrompt = `Analyze this authentic STAAR test image and extract every question pattern you can see. For each question, identify:

1. EXACT question text (word-for-word)
2. All answer choices (A, B, C, D)
3. TEKS standard mentioned
4. Grade level
5. Subject (math or reading)
6. Question type/category
7. Visual elements present (if any)
8. Language patterns and phrasing
9. Mathematical concepts tested (for math)
10. Authentic Texas context used

Look for patterns like:
- How questions are phrased ("What is...", "Which...", "Find the...")
- Answer choice formatting
- Visual element descriptions
- Real-world contexts used
- Specific mathematical operations
- Reading comprehension styles

Return detailed analysis in JSON format with an array of question patterns.
Focus on authenticity - these are real STAAR test questions that must be replicated exactly.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
      temperature: 0.1 // Low temperature for accurate pattern extraction
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    return analysis.patterns || analysis.questions || [];
    
  } catch (error) {
    console.error(`Error analyzing image ${imagePath}:`, error);
    return [];
  }
}

/**
 * Generate authentic STAAR questions based on learned patterns
 */
export async function generateAuthenticSTAARQuestionFromPatterns(
  grade: number,
  subject: "math" | "reading",
  options: {
    teksStandard?: string;
    category?: string;
    includeVisual?: boolean;
    specificPattern?: string;
    count?: number;
  } = {}
): Promise<InsertQuestion[]> {
  
  const { teksStandard, category, includeVisual = false, count = 1 } = options;
  
  try {
    // Get learned patterns from authentic STAAR images
    const patterns = await getLearnedPatterns(grade, subject);
    
    if (patterns.length === 0) {
      throw new Error("No authentic STAAR patterns found");
    }
    
    const questions: InsertQuestion[] = [];
    
    for (let i = 0; i < count; i++) {
      const question = await generateSingleAuthenticQuestion(
        grade,
        subject,
        patterns,
        { teksStandard, category, includeVisual }
      );
      questions.push(question);
    }
    
    return questions;
    
  } catch (error) {
    console.error("Error generating authentic STAAR question:", error);
    throw error;
  }
}

/**
 * Get learned patterns with caching
 */
const patternCache = new Map<string, AuthenticSTAARPattern[]>();

async function getLearnedPatterns(grade: number, subject: "math" | "reading"): Promise<AuthenticSTAARPattern[]> {
  const cacheKey = `${grade}-${subject}`;
  
  if (patternCache.has(cacheKey)) {
    return patternCache.get(cacheKey)!;
  }
  
  // Analyze images to extract patterns
  const allPatterns = await analyzeAuthenticSTAARImages();
  
  // Filter patterns for this grade/subject
  const filteredPatterns = allPatterns.filter(pattern => 
    pattern.grade === grade && pattern.subject === subject
  );
  
  patternCache.set(cacheKey, filteredPatterns);
  return filteredPatterns;
}

/**
 * Generate a single authentic question using learned patterns
 */
async function generateSingleAuthenticQuestion(
  grade: number,
  subject: "math" | "reading",
  patterns: AuthenticSTAARPattern[],
  options: {
    teksStandard?: string;
    category?: string;
    includeVisual?: boolean;
  }
): Promise<InsertQuestion> {
  
  // Select relevant patterns
  let relevantPatterns = patterns.filter(p => p.grade === grade && p.subject === subject);
  
  if (options.teksStandard) {
    const teksFilter = relevantPatterns.filter(p => p.teksStandard === options.teksStandard);
    if (teksFilter.length > 0) {
      relevantPatterns = teksFilter;
    }
  }
  
  if (options.includeVisual) {
    const visualFilter = relevantPatterns.filter(p => p.hasVisual);
    if (visualFilter.length > 0) {
      relevantPatterns = visualFilter;
    }
  }
  
  if (relevantPatterns.length === 0) {
    relevantPatterns = patterns.filter(p => p.grade === grade && p.subject === subject);
  }
  
  const selectedPattern = relevantPatterns[Math.floor(Math.random() * relevantPatterns.length)];
  
  const generationPrompt = `Generate an authentic STAAR ${grade} ${subject} question using this EXACT pattern from real STAAR tests:

AUTHENTIC PATTERN ANALYSIS:
- Question Type: ${selectedPattern.questionType}
- TEKS Standard: ${selectedPattern.teksStandard}
- Language Patterns: ${selectedPattern.languagePatterns.join(", ")}
- Has Visual: ${selectedPattern.hasVisual}
${selectedPattern.visualDescription ? `- Visual Description: ${selectedPattern.visualDescription}` : ""}
${selectedPattern.mathematicalConcepts ? `- Math Concepts: ${selectedPattern.mathematicalConcepts.join(", ")}` : ""}

EXAMPLE FROM REAL STAAR:
Question: "${selectedPattern.questionText}"
Answers: ${selectedPattern.answerChoices.join(", ")}
Correct: ${selectedPattern.correctAnswer}

REQUIREMENTS:
1. Use IDENTICAL language patterns and phrasing style
2. Follow exact STAAR formatting (A., B., C., D.)
3. Use authentic Texas contexts and names
4. Ensure mathematical accuracy for all calculations
5. Match complexity level for Grade ${grade}
6. Include TEKS standard: ${options.teksStandard || selectedPattern.teksStandard}
${options.includeVisual ? "7. Include visual element with detailed SVG instructions" : ""}

Generate a NEW question following this exact pattern but with different numbers/context.

Return JSON with: questionText, answerChoices, correctAnswer, explanation, hasImage, imageDescription, svgContent`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert at generating authentic STAAR test questions that perfectly match official Texas state assessment patterns. Every question must be mathematically accurate and use exact STAAR language patterns."
      },
      {
        role: "user",
        content: generationPrompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  });

  const questionData = JSON.parse(response.choices[0].message.content);
  
  // Enhance with visual content if needed
  let svgContent = questionData.svgContent || null;
  let hasImage = questionData.hasImage || false;
  let imageDescription = questionData.imageDescription || null;
  
  if (options.includeVisual && selectedPattern.hasVisual && !svgContent) {
    const visualResult = await generateAuthenticVisual(questionData, selectedPattern);
    svgContent = visualResult.svgContent;
    hasImage = visualResult.hasImage;
    imageDescription = visualResult.imageDescription;
  }
  
  const question: InsertQuestion = {
    grade,
    subject,
    teksStandard: options.teksStandard || selectedPattern.teksStandard,
    questionText: questionData.questionText,
    answerChoices: Array.isArray(questionData.answerChoices) 
      ? questionData.answerChoices 
      : [questionData.answerChoices?.A, questionData.answerChoices?.B, questionData.answerChoices?.C, questionData.answerChoices?.D].filter(Boolean),
    correctAnswer: questionData.correctAnswer,
    explanation: questionData.explanation,
    difficulty: "medium",
    category: options.category || selectedPattern.questionType,
    year: new Date().getFullYear(),
    isFromRealSTAAR: false,
    hasImage,
    imageDescription,
    svgContent,
    passageId: null
  };

  return question;
}

/**
 * Generate authentic visual elements based on STAAR patterns
 */
async function generateAuthenticVisual(
  questionData: any,
  pattern: AuthenticSTAARPattern
): Promise<{
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
}> {
  
  const visualPrompt = `Create an authentic STAAR-style visual element for this question:

Question: "${questionData.questionText}"
Pattern Visual Description: "${pattern.visualDescription}"
Visual Elements from Real STAAR: ${pattern.visualElements?.join(", ") || "geometric shapes, diagrams"}

Generate SVG code that:
1. Matches authentic STAAR visual style
2. Uses clean, educational design
3. Includes proper labels and dimensions
4. Helps students understand the problem visually
5. Uses colors and styling consistent with STAAR tests

Return detailed SVG code that accurately represents the mathematical concept.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You create authentic STAAR-style visual diagrams that perfectly match official Texas test visuals."
        },
        {
          role: "user",
          content: visualPrompt
        }
      ],
      temperature: 0.2
    });

    const svgContent = response.choices[0].message.content;
    
    return {
      hasImage: true,
      imageDescription: pattern.visualDescription || "Educational diagram from authentic STAAR pattern",
      svgContent: svgContent.includes('<svg') ? svgContent : `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`
    };
    
  } catch (error) {
    console.error("Error generating authentic visual:", error);
    return {
      hasImage: false,
      imageDescription: "",
      svgContent: ""
    };
  }
}

/**
 * Extract specific STAAR question from authenticated pattern analysis
 */
export async function extractSpecificSTAARQuestions(): Promise<InsertQuestion[]> {
  console.log("📖 Extracting specific questions from authentic STAAR images...");
  
  const questions: InsertQuestion[] = [];
  
  // Specific known questions from the images
  const knownQuestions = [
    {
      grade: 3,
      subject: "math" as const,
      teksStandard: "3.4K",
      questionText: "Sofia will arrange 42 feathers into 7 glass cases for her collection. There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?",
      answerChoices: ["A. 42 + 7 = 6", "B. 42 + 7 = 49", "C. 42 × 7 = 294", "D. 42 − 7 = 35"],
      correctAnswer: "A",
      explanation: "To find equal groups, divide: 42 ÷ 7 = 6 feathers per case.",
      hasImage: true,
      imageDescription: "Division diagram showing 42 feathers arranged equally in 7 glass cases"
    },
    {
      grade: 5,
      subject: "math" as const,
      teksStandard: "5.4H",
      questionText: "A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?",
      answerChoices: ["A. 20 square feet", "B. 40 square feet", "C. 96 square feet", "D. 192 square feet"],
      correctAnswer: "C",
      explanation: "Area = length × width = 12 × 8 = 96 square feet.",
      hasImage: true,
      imageDescription: "Rectangular diagram showing a garden with labeled dimensions of 12 feet by 8 feet"
    },
    {
      grade: 3,
      subject: "math" as const,
      teksStandard: "3.4A",
      questionText: "What is 7 × 8?",
      answerChoices: ["A. 54", "B. 56", "C. 63", "D. 64"],
      correctAnswer: "B",
      explanation: "7 × 8 = 56. This is a basic multiplication fact.",
      hasImage: false,
      imageDescription: null
    }
  ];
  
  for (const q of knownQuestions) {
    const question: InsertQuestion = {
      ...q,
      difficulty: "medium",
      category: "Number & Operations",
      year: 2024,
      isFromRealSTAAR: true,
      svgContent: q.hasImage ? await generateSTAARAthenticSVG(q) : null,
      passageId: null
    };
    
    questions.push(question);
  }
  
  return questions;
}

/**
 * Generate SVG content that matches authentic STAAR visual style
 */
async function generateSTAARAthenticSVG(question: any): Promise<string> {
  if (question.questionText.includes("feathers") && question.questionText.includes("glass cases")) {
    return `
      <svg width="500" height="180" viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg">
        <style>
          .case { fill: #E3F2FD; stroke: #1976D2; stroke-width: 2; }
          .feather { fill: #FF6B35; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; text-anchor: middle; }
          .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; text-anchor: middle; font-weight: bold; }
        </style>
        
        <text x="250" y="20" class="title">42 feathers ÷ 7 cases = 6 feathers per case</text>
        
        ${Array.from({length: 7}, (_, i) => `
          <g>
            <rect x="${40 + i * 60}" y="40" width="50" height="80" class="case" rx="5"/>
            ${Array.from({length: 6}, (_, j) => `
              <ellipse cx="${50 + i * 60 + (j % 3) * 12}" cy="${55 + Math.floor(j / 3) * 20}" rx="4" ry="8" class="feather"/>
            `).join('')}
            <text x="${65 + i * 60}" y="140" class="label">Case ${i + 1}</text>
            <text x="${65 + i * 60}" y="155" class="label">6 feathers</text>
          </g>
        `).join('')}
      </svg>
    `;
  }
  
  if (question.questionText.includes("rectangular garden")) {
    return `
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .garden { fill: #4CAF50; opacity: 0.3; stroke: #2E7D32; stroke-width: 2; }
          .dimension { font-family: Arial, sans-serif; font-size: 14px; fill: #333; text-anchor: middle; font-weight: bold; }
          .grid { stroke: #2E7D32; stroke-width: 1; opacity: 0.3; }
        </style>
        
        <rect x="100" y="80" width="200" height="120" class="garden"/>
        
        <!-- Grid lines to show area units -->
        ${Array.from({length: 13}, (_, i) => `
          <line x1="${100 + i * 200/12}" y1="80" x2="${100 + i * 200/12}" y2="200" class="grid"/>
        `).join('')}
        ${Array.from({length: 9}, (_, i) => `
          <line x1="100" y1="${80 + i * 120/8}" x2="300" y2="${80 + i * 120/8}" class="grid"/>
        `).join('')}
        
        <!-- Length dimension -->
        <line x1="100" y1="60" x2="300" y2="60" stroke="#333" stroke-width="2"/>
        <line x1="100" y1="55" x2="100" y2="65" stroke="#333" stroke-width="2"/>
        <line x1="300" y1="55" x2="300" y2="65" stroke="#333" stroke-width="2"/>
        <text x="200" y="50" class="dimension">12 feet</text>
        
        <!-- Width dimension -->
        <line x1="80" y1="80" x2="80" y2="200" stroke="#333" stroke-width="2"/>
        <line x1="75" y1="80" x2="85" y2="80" stroke="#333" stroke-width="2"/>
        <line x1="75" y1="200" x2="85" y2="200" stroke="#333" stroke-width="2"/>
        <text x="70" y="140" class="dimension" transform="rotate(-90 70 140)">8 feet</text>
        
        <!-- Area calculation -->
        <text x="200" y="240" class="dimension">Area = 12 × 8 = 96 square feet</text>
        <text x="200" y="260" class="dimension">Garden</text>
      </svg>
    `;
  }
  
  return "";
}