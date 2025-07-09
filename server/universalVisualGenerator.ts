/**
 * Universal Visual Generator - Creates SVG diagrams for all generated questions
 * Integrates with every question generation system to provide visual elements
 */

import { InsertQuestion } from "@shared/schema";

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
 */
export function generateQuestionVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription?: string;
  svgContent?: string;
} {
  const { questionText, category, subject, grade, teksStandard } = config;
  
  if (subject !== "math") {
    return { hasImage: false };
  }

  const text = questionText.toLowerCase();
  const categoryLower = (category || "").toLowerCase();

  // Division/Grouping Problems
  if (text.includes('÷') || text.includes('divide') || 
      (text.includes('equal') && (text.includes('groups') || text.includes('cases') || text.includes('boxes'))) ||
      (text.includes('stickers') && (text.includes('albums') || text.includes('pages'))) ||
      (text.includes('books') && (text.includes('shelves') || text.includes('boxes'))) ||
      (text.includes('marbles') && text.includes('bags')) ||
      (text.includes('how many') && (text.includes('each') || text.includes('per')))) {
    return generateDivisionVisual(config);
  }

  // Area and Perimeter Problems
  if (text.includes('area') || text.includes('perimeter') || 
      (text.includes('length') && text.includes('width'))) {
    return generateAreaVisual(config);
  }

  // Fraction Problems
  if (text.includes('fraction') || text.includes('/') || 
      categoryLower.includes('fraction') || teksStandard.includes('3.3')) {
    return generateFractionVisual(config);
  }

  // Geometry Problems
  if (categoryLower.includes('geometry') || text.includes('shape') || 
      text.includes('triangle') || text.includes('rectangle') || 
      text.includes('square') || text.includes('circle') ||
      text.includes('quadrilateral') || text.includes('polygon')) {
    return generateGeometryVisual(config);
  }

  // Data Analysis Problems
  if (text.includes('graph') || text.includes('chart') || 
      text.includes('data') || categoryLower.includes('data')) {
    return generateDataVisual(config);
  }

  // Number Line Problems
  if (text.includes('number line') || text.includes('skip count') ||
      (grade <= 4 && (text.includes('count') || text.includes('pattern')))) {
    return generateNumberLineVisual(config);
  }

  // Measurement Problems
  if (text.includes('measure') || text.includes('inches') || 
      text.includes('feet') || text.includes('yards') || 
      text.includes('centimeter') || text.includes('meter')) {
    return generateMeasurementVisual(config);
  }

  // Money Problems
  if (text.includes('dollar') || text.includes('cent') || text.includes('$') ||
      text.includes('coin') || text.includes('bill')) {
    return generateMoneyVisual(config);
  }

  // Time Problems
  if (text.includes('time') || text.includes('clock') || 
      text.includes('hour') || text.includes('minute')) {
    return generateTimeVisual(config);
  }

  // Default: Don't generate visual for this question
  return { hasImage: false };
}

/**
 * Division/Grouping Visual Generator
 */
function generateDivisionVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const { questionText } = config;
  
  // Extract numbers from question
  const numbers = questionText.match(/\d+/g)?.map(n => parseInt(n)) || [];
  const dividend = numbers[0] || 42;
  const divisor = numbers[1] || 7;
  const quotient = Math.floor(dividend / divisor);

  const svgContent = `
    <svg width="400" height="160" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg">
      <style>
        .container { fill: #E0F2FE; stroke: #0891B2; stroke-width: 2; }
        .item { fill: #FF5B00; opacity: 0.8; }
        .label { font-family: Arial, sans-serif; font-size: 12px; fill: #374151; text-anchor: middle; }
        .title { font-family: Arial, sans-serif; font-size: 14px; fill: #1F2937; text-anchor: middle; font-weight: bold; }
      </style>
      
      <text x="200" y="20" class="title">${dividend} items ÷ ${divisor} groups = ${quotient} items per group</text>
      
      ${Array.from({length: divisor}, (_, i) => `
        <g>
          <rect x="${30 + i * 50}" y="40" width="40" height="70" class="container" rx="3"/>
          ${Array.from({length: quotient}, (_, j) => `
            <circle cx="${40 + i * 50 + (j % 3) * 10}" cy="${55 + Math.floor(j / 3) * 15}" r="4" class="item"/>
          `).join('')}
          <text x="${50 + i * 50}" y="125" class="label">Group ${i + 1}</text>
          <text x="${50 + i * 50}" y="140" class="label">${quotient} items</text>
        </g>
      `).join('')}
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: `Division diagram showing ${dividend} items divided into ${divisor} equal groups with ${quotient} items each`,
    svgContent
  };
}

/**
 * Area and Perimeter Visual Generator
 */
function generateAreaVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const { questionText } = config;
  
  // Extract dimensions
  const numbers = questionText.match(/\d+/g)?.map(n => parseInt(n)) || [];
  const length = numbers[0] || 12;
  const width = numbers[1] || 8;
  const area = length * width;

  const svgContent = `
    <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .rectangle { fill: #4ADE80; opacity: 0.3; stroke: #16A34A; stroke-width: 2; }
        .dimension { font-family: Arial, sans-serif; font-size: 14px; fill: #374151; text-anchor: middle; font-weight: bold; }
        .grid { stroke: #16A34A; stroke-width: 0.5; opacity: 0.5; }
      </style>
      
      <rect x="80" y="60" width="${length * 8}" height="${width * 8}" class="rectangle"/>
      
      <!-- Grid lines for visual counting -->
      ${Array.from({length: length + 1}, (_, i) => `
        <line x1="${80 + i * 8}" y1="60" x2="${80 + i * 8}" y2="${60 + width * 8}" class="grid"/>
      `).join('')}
      ${Array.from({length: width + 1}, (_, i) => `
        <line x1="80" y1="${60 + i * 8}" x2="${80 + length * 8}" y1="${60 + i * 8}" class="grid"/>
      `).join('')}
      
      <!-- Length dimension -->
      <line x1="80" y1="45" x2="${80 + length * 8}" y2="45" stroke="#374151" stroke-width="1"/>
      <line x1="80" y1="40" x2="80" y2="50" stroke="#374151" stroke-width="1"/>
      <line x1="${80 + length * 8}" y1="40" x2="${80 + length * 8}" y2="50" stroke="#374151" stroke-width="1"/>
      <text x="${80 + length * 4}" y="35" class="dimension">${length} units</text>
      
      <!-- Width dimension -->
      <line x1="65" y1="60" x2="65" y2="${60 + width * 8}" stroke="#374151" stroke-width="1"/>
      <line x1="60" y1="60" x2="70" y2="60" stroke="#374151" stroke-width="1"/>
      <line x1="60" y1="${60 + width * 8}" x2="70" y2="${60 + width * 8}" stroke="#374151" stroke-width="1"/>
      <text x="55" y="${60 + width * 4}" class="dimension" transform="rotate(-90 55 ${60 + width * 4})">${width} units</text>
      
      <!-- Area calculation -->
      <text x="150" y="180" class="dimension">Area = ${length} × ${width} = ${area} square units</text>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: `Rectangle diagram showing ${length} by ${width} units with area calculation`,
    svgContent
  };
}

/**
 * Fraction Visual Generator
 */
function generateFractionVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const { questionText } = config;
  
  // Extract fraction from question
  const fractionMatch = questionText.match(/(\d+)\/(\d+)/);
  const numerator = fractionMatch ? parseInt(fractionMatch[1]) : 1;
  const denominator = fractionMatch ? parseInt(fractionMatch[2]) : 4;

  const svgContent = `
    <svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
      <style>
        .fraction-part { fill: #FF5B00; stroke: #1F2937; stroke-width: 2; }
        .fraction-whole { fill: #F3F4F6; stroke: #1F2937; stroke-width: 2; }
        .label { font-family: Arial, sans-serif; font-size: 14px; fill: #1F2937; text-anchor: middle; font-weight: bold; }
      </style>
      
      <text x="150" y="25" class="label">Fraction: ${numerator}/${denominator}</text>
      
      <!-- Circle fraction model -->
      <circle cx="150" cy="80" r="40" class="fraction-whole"/>
      ${Array.from({length: denominator}, (_, i) => {
        const angle = (360 / denominator) * i;
        const angle2 = (360 / denominator) * (i + 1);
        const filled = i < numerator;
        return `
          <path d="M 150 80 L ${150 + 40 * Math.cos(angle * Math.PI / 180)} ${80 + 40 * Math.sin(angle * Math.PI / 180)} A 40 40 0 0 1 ${150 + 40 * Math.cos(angle2 * Math.PI / 180)} ${80 + 40 * Math.sin(angle2 * Math.PI / 180)} Z" 
                fill="${filled ? '#FF5B00' : '#F3F4F6'}" 
                stroke="#1F2937" 
                stroke-width="2"/>
        `;
      }).join('')}
      
      <text x="150" y="140" class="label">${numerator} out of ${denominator} parts shaded</text>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: `Circle fraction model showing ${numerator}/${denominator} with shaded parts`,
    svgContent
  };
}

/**
 * Geometry Visual Generator
 */
function generateGeometryVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const { questionText } = config;
  const text = questionText.toLowerCase();

  if (text.includes('quadrilateral') || text.includes('four sides')) {
    const svgContent = `
      <svg width="350" height="120" viewBox="0 0 350 120" xmlns="http://www.w3.org/2000/svg">
        <style>
          .shape1 { fill: #FF5B00; opacity: 0.3; stroke: #FF5B00; stroke-width: 2; }
          .shape2 { fill: #FCC201; opacity: 0.3; stroke: #FCC201; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 11px; fill: #1F2937; text-anchor: middle; }
        </style>
        
        <!-- Square -->
        <rect x="20" y="20" width="40" height="40" class="shape1"/>
        <text x="40" y="75" class="label">Square</text>
        
        <!-- Rectangle -->
        <rect x="90" y="25" width="50" height="30" class="shape2"/>
        <text x="115" y="75" class="label">Rectangle</text>
        
        <!-- Parallelogram -->
        <path d="M170 35 L210 35 L200 55 L160 55 Z" class="shape1"/>
        <text x="185" y="75" class="label">Parallelogram</text>
        
        <!-- Trapezoid -->
        <path d="M240 30 L280 30 L290 55 L230 55 Z" class="shape2"/>
        <text x="260" y="75" class="label">Trapezoid</text>
        
        <text x="175" y="100" class="label">All shapes have 4 sides (quadrilaterals)</text>
      </svg>
    `;

    return {
      hasImage: true,
      imageDescription: "Four different quadrilaterals: square, rectangle, parallelogram, and trapezoid",
      svgContent
    };
  }

  // Default geometry visual
  return { hasImage: false };
}

/**
 * Data Analysis Visual Generator
 */
function generateDataVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const svgContent = `
    <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .bar { fill: #FF5B00; }
        .axis { stroke: #1F2937; stroke-width: 2; }
        .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1F2937; text-anchor: middle; }
      </style>
      
      <!-- Axes -->
      <line x1="50" y1="20" x2="50" y2="160" class="axis"/>
      <line x1="50" y1="160" x2="280" y2="160" class="axis"/>
      
      <!-- Sample bars -->
      <rect x="70" y="120" width="30" height="40" class="bar"/>
      <rect x="120" y="100" width="30" height="60" class="bar"/>
      <rect x="170" y="80" width="30" height="80" class="bar"/>
      <rect x="220" y="140" width="30" height="20" class="bar"/>
      
      <!-- Labels -->
      <text x="85" y="175" class="label">A</text>
      <text x="135" y="175" class="label">B</text>
      <text x="185" y="175" class="label">C</text>
      <text x="235" y="175" class="label">D</text>
      
      <text x="150" y="195" class="label">Sample Bar Graph</text>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: "Bar graph showing data comparison",
    svgContent
  };
}

/**
 * Number Line Visual Generator
 */
function generateNumberLineVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const svgContent = `
    <svg width="400" height="80" viewBox="0 0 400 80" xmlns="http://www.w3.org/2000/svg">
      <style>
        .line { stroke: #1F2937; stroke-width: 3; }
        .tick { stroke: #1F2937; stroke-width: 2; }
        .number { font-family: Arial, sans-serif; font-size: 14px; fill: #1F2937; text-anchor: middle; }
      </style>
      
      <line x1="50" y1="40" x2="350" y2="40" class="line"/>
      
      ${Array.from({length: 11}, (_, i) => `
        <line x1="${50 + i * 30}" y1="35" x2="${50 + i * 30}" y2="45" class="tick"/>
        <text x="${50 + i * 30}" y="60" class="number">${i * 5}</text>
      `).join('')}
      
      <text x="200" y="20" class="number">Number Line (0 to 50)</text>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: "Number line from 0 to 50 with increments of 5",
    svgContent
  };
}

/**
 * Measurement Visual Generator
 */
function generateMeasurementVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const svgContent = `
    <svg width="300" height="100" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
      <style>
        .ruler { fill: #F3F4F6; stroke: #1F2937; stroke-width: 2; }
        .tick { stroke: #1F2937; stroke-width: 1; }
        .number { font-family: Arial, sans-serif; font-size: 12px; fill: #1F2937; text-anchor: middle; }
      </style>
      
      <rect x="50" y="40" width="200" height="20" class="ruler"/>
      
      ${Array.from({length: 9}, (_, i) => `
        <line x1="${50 + i * 25}" y1="40" x2="${50 + i * 25}" y2="60" class="tick"/>
        <text x="${50 + i * 25}" y="75" class="number">${i}</text>
      `).join('')}
      
      <text x="150" y="25" class="number">Ruler (inches)</text>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: "Ruler showing measurement in inches",
    svgContent
  };
}

/**
 * Money Visual Generator
 */
function generateMoneyVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const svgContent = `
    <svg width="300" height="120" viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg">
      <style>
        .quarter { fill: #C0C0C0; stroke: #1F2937; stroke-width: 2; }
        .dime { fill: #C0C0C0; stroke: #1F2937; stroke-width: 2; }
        .coin-text { font-family: Arial, sans-serif; font-size: 10px; fill: #1F2937; text-anchor: middle; }
        .label { font-family: Arial, sans-serif; font-size: 12px; fill: #1F2937; text-anchor: middle; }
      </style>
      
      <!-- Quarters -->
      <circle cx="60" cy="40" r="20" class="quarter"/>
      <text x="60" y="45" class="coin-text">25¢</text>
      <text x="60" y="75" class="label">Quarter</text>
      
      <!-- Dimes -->
      <circle cx="140" cy="40" r="15" class="dime"/>
      <text x="140" y="45" class="coin-text">10¢</text>
      <text x="140" y="75" class="label">Dime</text>
      
      <!-- Nickels -->
      <circle cx="200" cy="40" r="17" class="quarter"/>
      <text x="200" y="45" class="coin-text">5¢</text>
      <text x="200" y="75" class="label">Nickel</text>
      
      <!-- Pennies -->
      <circle cx="260" cy="40" r="15" class="quarter"/>
      <text x="260" y="45" class="coin-text">1¢</text>
      <text x="260" y="75" class="label">Penny</text>
      
      <text x="150" y="100" class="label">U.S. Coins</text>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: "U.S. coins showing quarters, dimes, nickels, and pennies",
    svgContent
  };
}

/**
 * Time Visual Generator
 */
function generateTimeVisual(config: VisualConfig): {
  hasImage: boolean;
  imageDescription: string;
  svgContent: string;
} {
  const svgContent = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .clock-face { fill: white; stroke: #1F2937; stroke-width: 3; }
        .hand { stroke: #1F2937; stroke-width: 3; stroke-linecap: round; }
        .number { font-family: Arial, sans-serif; font-size: 16px; fill: #1F2937; text-anchor: middle; }
        .center { fill: #1F2937; }
      </style>
      
      <circle cx="100" cy="100" r="80" class="clock-face"/>
      
      <!-- Numbers -->
      ${Array.from({length: 12}, (_, i) => {
        const angle = (i + 1) * 30 - 90;
        const x = 100 + 65 * Math.cos(angle * Math.PI / 180);
        const y = 100 + 65 * Math.sin(angle * Math.PI / 180) + 5;
        return `<text x="${x}" y="${y}" class="number">${i + 1}</text>`;
      }).join('')}
      
      <!-- Hour hand pointing to 3 -->
      <line x1="100" y1="100" x2="130" y2="100" class="hand" stroke-width="4"/>
      
      <!-- Minute hand pointing to 6 -->
      <line x1="100" y1="100" x2="100" y2="150" class="hand" stroke-width="2"/>
      
      <circle cx="100" cy="100" r="5" class="center"/>
    </svg>
  `;

  return {
    hasImage: true,
    imageDescription: "Clock face showing 3:30",
    svgContent
  };
}

/**
 * Enhanced question generation with automatic visual detection
 */
export function enhanceQuestionWithVisual(question: InsertQuestion): InsertQuestion {
  if (question.subject !== "math") {
    return question;
  }

  const visual = generateQuestionVisual({
    grade: question.grade,
    subject: question.subject,
    questionText: question.questionText,
    category: question.category,
    teksStandard: question.teksStandard,
    answerChoices: question.answerChoices,
    correctAnswer: question.correctAnswer
  });

  return {
    ...question,
    hasImage: visual.hasImage,
    imageDescription: visual.imageDescription,
    svgContent: visual.svgContent
  };
}