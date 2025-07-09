/**
 * Question Visual Detector - Automatically identifies which questions need visual elements
 * Analyzes question text to determine if visual aids would be helpful
 */

export function shouldQuestionHaveVisual(questionText: string, subject: "math" | "reading", grade: number): {
  needsVisual: boolean;
  visualType?: string;
  description?: string;
} {
  if (subject !== "math") {
    return { needsVisual: false };
  }

  const text = questionText.toLowerCase();

  // Area and Perimeter Problems - ALWAYS need visuals
  if (text.includes('area') || text.includes('perimeter') || 
      (text.includes('rectangle') && (text.includes('length') || text.includes('width'))) ||
      (text.includes('square') && (text.includes('side') || text.includes('feet') || text.includes('meters'))) ||
      text.includes('garden') && (text.includes('feet') || text.includes('meters'))) {
    return {
      needsVisual: true,
      visualType: 'area',
      description: 'Rectangle diagram showing dimensions and area calculation'
    };
  }

  // Multiplication Problems - Visual arrays help understanding
  if (text.includes('×') || text.includes('multiply') || text.includes('product') ||
      (text.includes('each') && text.includes('total')) ||
      (text.includes('groups') && text.includes('items')) ||
      (text.includes('rows') && text.includes('columns')) ||
      (text.includes('boxes') && text.includes('contains'))) {
    return {
      needsVisual: true,
      visualType: 'multiplication',
      description: 'Visual array or groups showing multiplication concept'
    };
  }

  // Division Problems - Need grouping visuals
  if (text.includes('÷') || text.includes('divide') || text.includes('shared equally') ||
      (text.includes('equal') && (text.includes('groups') || text.includes('cases') || text.includes('boxes'))) ||
      (text.includes('stickers') && (text.includes('albums') || text.includes('pages'))) ||
      (text.includes('how many') && text.includes('each'))) {
    return {
      needsVisual: true,
      visualType: 'division',
      description: 'Items grouped into equal containers showing division'
    };
  }

  // Fraction Problems - ALWAYS need visual models
  if (text.includes('fraction') || text.includes('/') || text.includes('part') ||
      text.includes('shaded') || text.includes('equivalent') ||
      (text.includes('whole') && (text.includes('equal') || text.includes('parts')))) {
    return {
      needsVisual: true,
      visualType: 'fraction',
      description: 'Fraction models showing parts of a whole'
    };
  }

  // Geometry Problems - Shapes and measurements
  if (text.includes('shape') || text.includes('triangle') || text.includes('circle') ||
      text.includes('polygon') || text.includes('angle') || text.includes('vertex') ||
      text.includes('line segment') || text.includes('parallel') || text.includes('perpendicular')) {
    return {
      needsVisual: true,
      visualType: 'geometry',
      description: 'Geometric shapes and measurements diagram'
    };
  }

  // Data Analysis - Graphs and charts
  if (text.includes('graph') || text.includes('chart') || text.includes('data') ||
      text.includes('bar graph') || text.includes('pictograph') || text.includes('table') ||
      text.includes('survey') || text.includes('students read')) {
    return {
      needsVisual: true,
      visualType: 'data',
      description: 'Bar graph or chart showing data relationships'
    };
  }

  // Number Line and Patterns - Visual sequences
  if (text.includes('number line') || text.includes('pattern') || text.includes('sequence') ||
      text.includes('skip count') || (grade <= 4 && text.includes('count by'))) {
    return {
      needsVisual: true,
      visualType: 'number_line',
      description: 'Number line or pattern visualization'
    };
  }

  // Measurement Problems - Length, weight, capacity
  if (text.includes('measure') || text.includes('inches') || text.includes('feet') || 
      text.includes('yards') || text.includes('centimeter') || text.includes('meter') ||
      text.includes('length') || text.includes('distance') || text.includes('height')) {
    return {
      needsVisual: true,
      visualType: 'measurement',
      description: 'Measurement tools and length comparison'
    };
  }

  // Money Problems - Coins and bills
  if (text.includes('dollar') || text.includes('cent') || text.includes('$') ||
      text.includes('coin') || text.includes('bill') || text.includes('penny') ||
      text.includes('nickel') || text.includes('dime') || text.includes('quarter')) {
    return {
      needsVisual: true,
      visualType: 'money',
      description: 'Coins and bills showing money amounts'
    };
  }

  // Time Problems - Clocks and time intervals
  if (text.includes('time') || text.includes('clock') || text.includes('hour') || 
      text.includes('minute') || text.includes('o\'clock') || text.includes('half hour')) {
    return {
      needsVisual: true,
      visualType: 'time',
      description: 'Clock face showing time'
    };
  }

  // Place Value - Base-10 blocks and number representation
  if (text.includes('place value') || text.includes('hundreds') || text.includes('tens') ||
      text.includes('ones') || text.includes('digit') || text.includes('expanded form') ||
      (grade <= 4 && (text.includes('round') || text.includes('nearest')))) {
    return {
      needsVisual: true,
      visualType: 'place_value',
      description: 'Place value blocks or number representation'
    };
  }

  // Word Problems with numbers that benefit from visual representation
  if ((text.includes('students') || text.includes('children') || text.includes('people')) &&
      (text.includes('total') || text.includes('altogether') || text.includes('in all'))) {
    return {
      needsVisual: true,
      visualType: 'counting',
      description: 'Visual counting representation'
    };
  }

  // Default: No visual needed for basic arithmetic without context
  return { needsVisual: false };
}

/**
 * Batch analyze questions and identify which ones need visuals
 */
export function analyzeQuestionsForVisuals(questions: any[]): {
  totalQuestions: number;
  questionsNeedingVisuals: number;
  questionsWithVisuals: number;
  missingVisuals: any[];
} {
  let questionsNeedingVisuals = 0;
  let questionsWithVisuals = 0;
  const missingVisuals: any[] = [];

  questions.forEach(question => {
    if (question.subject === "math") {
      const analysis = shouldQuestionHaveVisual(question.questionText, question.subject, question.grade);
      
      if (analysis.needsVisual) {
        questionsNeedingVisuals++;
        
        if (!question.hasImage && !question.svgContent) {
          missingVisuals.push({
            id: question.id,
            questionText: question.questionText.substring(0, 80) + "...",
            visualType: analysis.visualType,
            description: analysis.description
          });
        } else {
          questionsWithVisuals++;
        }
      }
    }
  });

  return {
    totalQuestions: questions.length,
    questionsNeedingVisuals,
    questionsWithVisuals,
    missingVisuals
  };
}