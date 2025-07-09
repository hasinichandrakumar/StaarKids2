/**
 * Efficient Question Generator - Fast, deterministic question generation
 * Uses template-based approach instead of slow AI calls
 */

import { InsertQuestion } from "../shared/schema";

interface QuestionTemplate {
  questionText: string;
  answerChoices: string[];
  correctAnswer: string;
  explanation: string;
  variables?: { [key: string]: () => number };
  imageGenerator?: (vars: any) => string;
}

// Fast template-based question generation
export const EFFICIENT_QUESTION_TEMPLATES = {
  math: {
    3: {
      division: {
        questionText: "Maria has {total} stickers. She wants to put them equally into {groups} albums. How many stickers will be in each album?",
        answerChoices: [
          "A. {answer} stickers",
          "B. {wrong1} stickers", 
          "C. {wrong2} stickers",
          "D. {wrong3} stickers"
        ],
        correctAnswer: "A",
        explanation: "Divide {total} ÷ {groups} = {answer} stickers in each album.",
        variables: {
          total: () => [24, 36, 48, 60][Math.floor(Math.random() * 4)],
          groups: () => [3, 4, 6, 8][Math.floor(Math.random() * 4)]
        },
        imageGenerator: (vars: any) => ({
          type: 'sticker_division',
          data: { total: vars.total, groups: vars.groups }
        })
      },
      area: {
        questionText: "A rectangular garden has a length of {length} feet and a width of {width} feet. What is the area of the garden?",
        answerChoices: [
          "A. {answer} square feet",
          "B. {perimeter} square feet",
          "C. {wrong1} square feet", 
          "D. {wrong2} square feet"
        ],
        correctAnswer: "A",
        explanation: "Area = length × width = {length} × {width} = {answer} square feet.",
        variables: {
          length: () => [10, 12, 15, 18][Math.floor(Math.random() * 4)],
          width: () => [6, 8, 10, 12][Math.floor(Math.random() * 4)]
        },
        imageGenerator: (vars: any) => ({
          type: 'rectangle_area',
          data: { length: vars.length, width: vars.width, unit: 'feet' }
        })
      },
      addition: {
        questionText: "Sarah collected {num1} bottle caps. Jake collected {num2} bottle caps. How many bottle caps did they collect altogether?",
        answerChoices: [
          "A. {answer} bottle caps",
          "B. {wrong1} bottle caps",
          "C. {wrong2} bottle caps",
          "D. {wrong3} bottle caps"
        ],
        correctAnswer: "A",
        explanation: "Add {num1} + {num2} = {answer} bottle caps total.",
        variables: {
          num1: () => Math.floor(Math.random() * 200) + 100,
          num2: () => Math.floor(Math.random() * 150) + 50
        }
      }
    },
    4: {
      multiplication: {
        questionText: "There are {teams} teams in a hockey league. Each team has {players} players. How many players are in the league altogether?",
        answerChoices: [
          "A. {answer} players",
          "B. {addition} players",
          "C. {wrong1} players",
          "D. {wrong2} players"
        ],
        correctAnswer: "A",
        explanation: "Multiply {teams} × {players} = {answer} players total.",
        variables: {
          teams: () => [15, 20, 25, 30][Math.floor(Math.random() * 4)],
          players: () => [12, 16, 18, 20][Math.floor(Math.random() * 4)]
        }
      },
      area_large: {
        questionText: "A rectangular playground has a length of {length} meters and a width of {width} meters. What is the area of the playground?",
        answerChoices: [
          "A. {answer} square meters",
          "B. {perimeter} square meters", 
          "C. {wrong1} square meters",
          "D. {wrong2} square meters"
        ],
        correctAnswer: "A",
        explanation: "Area = length × width = {length} × {width} = {answer} square meters.",
        variables: {
          length: () => [20, 25, 30, 35][Math.floor(Math.random() * 4)],
          width: () => [12, 15, 18, 20][Math.floor(Math.random() * 4)]
        },
        imageGenerator: (vars: any) => ({
          type: 'rectangle_area',
          data: { length: vars.length, width: vars.width, unit: 'meters' }
        })
      }
    },
    5: {
      fractions: {
        questionText: "What is {numerator}/{denominator} written as a decimal?",
        answerChoices: [
          "A. {answer}",
          "B. {wrong1}",
          "C. {wrong2}", 
          "D. {wrong3}"
        ],
        correctAnswer: "A",
        explanation: "Divide {numerator} ÷ {denominator} = {answer}.",
        variables: {
          numerator: () => [1, 3, 1, 3][Math.floor(Math.random() * 4)],
          denominator: () => [4, 4, 2, 8][Math.floor(Math.random() * 4)]
        }
      }
    }
  },
  reading: {
    3: {
      character_problem: {
        questionText: "Based on the story '{title}', what is {character}'s main problem at the beginning?",
        answerChoices: [
          "A. {correct_problem}",
          "B. {wrong_problem1}",
          "C. {wrong_problem2}",
          "D. {wrong_problem3}"
        ],
        correctAnswer: "A",
        explanation: "The story shows that {character} {explanation_detail}.",
        variables: {
          title: () => ["Lizard Problems", "The New School", "Moving Day", "Best Friends"][Math.floor(Math.random() * 4)],
          character: () => ["Amy", "Jake", "Maria", "Sam"][Math.floor(Math.random() * 4)]
        }
      }
    }
  }
};

/**
 * Generate question instantly using templates - no AI calls needed
 */
export async function generateEfficientQuestion(
  grade: number,
  subject: "math" | "reading",
  category?: string
): Promise<InsertQuestion> {
  const templates = EFFICIENT_QUESTION_TEMPLATES[subject][grade as keyof typeof EFFICIENT_QUESTION_TEMPLATES[typeof subject]];
  
  if (!templates) {
    return generateFallbackQuestion(grade, subject);
  }
  
  // Pick random template
  const templateKeys = Object.keys(templates);
  const randomTemplate = templates[templateKeys[Math.floor(Math.random() * templateKeys.length)] as keyof typeof templates] as QuestionTemplate;
  
  // Generate variables
  const vars: any = {};
  if (randomTemplate.variables) {
    for (const [key, generator] of Object.entries(randomTemplate.variables)) {
      vars[key] = generator();
    }
  }
  
  // Calculate derived values for math
  if (subject === "math") {
    calculateMathVariables(vars, randomTemplate);
  } else {
    calculateReadingVariables(vars, randomTemplate);
  }
  
  // Replace variables in template
  const questionText = replaceVariables(randomTemplate.questionText, vars);
  const answerChoices = randomTemplate.answerChoices.map(choice => replaceVariables(choice, vars));
  const explanation = replaceVariables(randomTemplate.explanation, vars);
  
  // Generate SVG using the universal visual generator for math questions
  let hasImage = false;
  let imageDescription: string | null = null;
  let svgContent: string | null = null;
  
  if (subject === "math") {
    const { generateQuestionVisual } = await import("./universalVisualGenerator");
    
    const visualConfig = {
      grade,
      subject,
      questionText,
      category: category || "Number & Operations",
      teksStandard: `${grade}.3A`,
      answerChoices,
      correctAnswer: randomTemplate.correctAnswer
    };
    
    const visualResult = generateQuestionVisual(visualConfig);
    
    if (visualResult.hasImage) {
      hasImage = true;
      imageDescription = visualResult.imageDescription;
      svgContent = visualResult.svgContent;
    }
  }
  
  return {
    id: Math.floor(Math.random() * 9000) + 1000, // Generate random ID
    grade,
    subject,
    questionText,
    answerChoices,
    correctAnswer: randomTemplate.correctAnswer,
    teksStandard: `${grade}.3A`,
    category: category || (subject === "math" ? "Number & Operations" : "Comprehension"),
    difficulty: "medium" as const,
    isFromRealSTAAR: false,
    year: new Date().getFullYear(),
    hasImage,
    imageDescription,
    svgContent,
    explanation
  };
}

function calculateMathVariables(vars: any, template: QuestionTemplate) {
  // Calculate correct answers and common wrong answers
  if (vars.total && vars.groups) {
    vars.answer = vars.total / vars.groups;
    vars.wrong1 = vars.answer + 1;
    vars.wrong2 = vars.answer - 1;
    vars.wrong3 = vars.groups;
  }
  
  if (vars.length && vars.width) {
    vars.answer = vars.length * vars.width;
    vars.perimeter = 2 * (vars.length + vars.width);
    vars.wrong1 = vars.length + vars.width;
    vars.wrong2 = vars.answer + 10;
  }
  
  if (vars.teams && vars.players) {
    vars.answer = vars.teams * vars.players;
    vars.addition = vars.teams + vars.players;
    vars.wrong1 = vars.answer - 10;
    vars.wrong2 = vars.answer + 20;
  }
  
  if (vars.num1 && vars.num2) {
    vars.answer = vars.num1 + vars.num2;
    vars.wrong1 = Math.abs(vars.num1 - vars.num2);
    vars.wrong2 = vars.answer - 10;
    vars.wrong3 = vars.answer + 10;
  }
  
  if (vars.numerator && vars.denominator) {
    vars.answer = (vars.numerator / vars.denominator).toFixed(2);
    vars.wrong1 = (vars.denominator / vars.numerator).toFixed(2);
    vars.wrong2 = "0." + vars.numerator + vars.denominator;
    vars.wrong3 = vars.numerator + "." + vars.denominator;
  }
}

function calculateReadingVariables(vars: any, template: QuestionTemplate) {
  const problems = {
    "Lizard Problems": {
      correct_problem: "She is afraid of the classroom lizard",
      wrong_problem1: "She doesn't like her new teacher",
      wrong_problem2: "She doesn't want to sit near Trent", 
      wrong_problem3: "She wants to change classes",
      explanation_detail: "is specifically afraid of the classroom lizard"
    }
  };
  
  const problemData = problems[vars.title as keyof typeof problems];
  if (problemData) {
    Object.assign(vars, problemData);
  }
}

function replaceVariables(text: string, vars: any): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return vars[key]?.toString() || match;
  });
}

function generateFallbackQuestion(grade: number, subject: "math" | "reading"): InsertQuestion {
  if (subject === "math") {
    return {
      grade,
      subject: "math",
      questionText: "What is 8 + 6?",
      answerChoices: ["A. 14", "B. 12", "C. 16", "D. 15"],
      correctAnswer: "A",
      teksStandard: `${grade}.3A`,
      category: "Number & Operations",
      difficulty: "medium" as const,
      isFromRealSTAAR: false,
      year: new Date().getFullYear(),
      hasImage: false,
      imageDescription: null,
      svgContent: null,
      explanation: "Add 8 + 6 = 14."
    };
  } else {
    return {
      grade,
      subject: "reading", 
      questionText: "What is the main idea of a story?",
      answerChoices: [
        "A. The most important message",
        "B. The first sentence",
        "C. The character names",
        "D. The last word"
      ],
      correctAnswer: "A",
      teksStandard: `${grade}.6B`,
      category: "Comprehension",
      difficulty: "medium" as const,
      isFromRealSTAAR: false,
      year: new Date().getFullYear(),
      hasImage: false,
      imageDescription: null,
      svgContent: null,
      explanation: "The main idea is the central message of the story."
    };
  }
}

// Fast SVG generators
function generateStickerDivisionSVG(total: number, groups: number): string {
  const stickersPerGroup = total / groups;
  const groupWidth = 60;
  const groupHeight = 40;
  const stickerSize = 6;
  
  let svg = `<svg width="${groups * (groupWidth + 20)}" height="100" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sticker { fill: #FFD700; stroke: #333; stroke-width: 1; }
      .group-box { fill: none; stroke: #666; stroke-width: 2; stroke-dasharray: 5,5; }
      .label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
    </style>`;
  
  for (let group = 0; group < groups; group++) {
    const x = group * (groupWidth + 20) + 10;
    
    // Group box
    svg += `<rect x="${x}" y="20" width="${groupWidth}" height="${groupHeight}" class="group-box"/>`;
    
    // Stickers in this group
    for (let sticker = 0; sticker < stickersPerGroup; sticker++) {
      const stickerX = x + 5 + (sticker % 8) * (stickerSize + 2);
      const stickerY = 25 + Math.floor(sticker / 8) * (stickerSize + 2);
      svg += `<circle cx="${stickerX + stickerSize/2}" cy="${stickerY + stickerSize/2}" r="${stickerSize/2}" class="sticker"/>`;
    }
    
    // Label
    svg += `<text x="${x + groupWidth/2}" y="80" text-anchor="middle" class="label">Album ${group + 1}</text>`;
  }
  
  svg += `</svg>`;
  return svg;
}

function generateRectangleSVG(length: number, width: number, unit: string = "feet"): string {
  const scale = 8;
  const svgWidth = length * scale + 100;
  const svgHeight = width * scale + 80;
  
  return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .garden { fill: #90EE90; stroke: #333; stroke-width: 2; }
      .dimension { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
      .dimension-line { stroke: #666; stroke-width: 1; }
    </style>
    
    <!-- Garden rectangle -->
    <rect x="40" y="30" width="${length * scale}" height="${width * scale}" class="garden"/>
    
    <!-- Length dimension -->
    <line x1="40" y1="${30 + width * scale + 15}" x2="${40 + length * scale}" y2="${30 + width * scale + 15}" class="dimension-line"/>
    <text x="${40 + (length * scale)/2}" y="${30 + width * scale + 30}" text-anchor="middle" class="dimension">${length} ${unit}</text>
    
    <!-- Width dimension -->
    <line x1="25" y1="30" x2="25" y2="${30 + width * scale}" class="dimension-line"/>
    <text x="15" y="${30 + (width * scale)/2}" text-anchor="middle" class="dimension" transform="rotate(-90, 15, ${30 + (width * scale)/2})">${width} ${unit}</text>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="20" text-anchor="middle" class="dimension">Rectangular Garden</text>
  </svg>`;
}