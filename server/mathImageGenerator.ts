/**
 * Math Image Generator - Creates SVG diagrams for math questions
 * Generates authentic visual elements that match STAAR test formats
 */

export interface MathImageConfig {
  questionId: number;
  questionType: string;
  grade: number;
  subject: string;
  imageDescription: string;
}

export function generateMathSVG(config: MathImageConfig): string {
  const { questionType, imageDescription } = config;
  
  // Generate SVG based on question type and description
  if (imageDescription?.includes('fraction')) {
    return generateFractionModelSVG();
  } else if (imageDescription?.includes('bar graph')) {
    return generateBarGraphSVG();
  } else if (imageDescription?.includes('rectangular')) {
    return generateRectangleSVG();
  } else if (imageDescription?.includes('geometric shapes')) {
    return generateGeometricShapesSVG();
  } else if (imageDescription?.includes('division')) {
    return generateDivisionModelSVG();
  } else if (imageDescription?.includes('trapezoid')) {
    return generateTrapezoidSVG();
  } else {
    return generateDefaultMathSVG();
  }
}

function generateFractionModelSVG(): string {
  return `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape-fill { fill: #FF5B00; stroke: #333; stroke-width: 2; }
      .shape-empty { fill: white; stroke: #333; stroke-width: 2; }
      .text-label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
    </style>
    
    <!-- First fraction model: 1/4 -->
    <g transform="translate(20, 20)">
      <text x="40" y="15" class="text-label">1/4</text>
      <rect x="0" y="20" width="80" height="20" class="shape-fill"/>
      <rect x="0" y="40" width="80" height="20" class="shape-empty"/>
      <rect x="0" y="60" width="80" height="20" class="shape-empty"/>
      <rect x="0" y="80" width="80" height="20" class="shape-empty"/>
    </g>
    
    <!-- Second fraction model: 2/8 -->
    <g transform="translate(140, 20)">
      <text x="40" y="15" class="text-label">2/8</text>
      <rect x="0" y="20" width="20" height="80" class="shape-fill"/>
      <rect x="20" y="20" width="20" height="80" class="shape-fill"/>
      <rect x="40" y="20" width="20" height="80" class="shape-empty"/>
      <rect x="60" y="20" width="20" height="80" class="shape-empty"/>
      <rect x="0" y="100" width="20" height="20" class="shape-empty"/>
      <rect x="20" y="100" width="20" height="20" class="shape-empty"/>
      <rect x="40" y="100" width="20" height="20" class="shape-empty"/>
      <rect x="60" y="100" width="20" height="20" class="shape-empty"/>
    </g>
    
    <!-- Third fraction model: 3/12 -->
    <g transform="translate(260, 20)">
      <text x="40" y="15" class="text-label">3/12</text>
      <circle cx="10" cy="35" r="8" class="shape-fill"/>
      <circle cx="30" cy="35" r="8" class="shape-fill"/>
      <circle cx="50" cy="35" r="8" class="shape-fill"/>
      <circle cx="70" cy="35" r="8" class="shape-empty"/>
      <circle cx="10" cy="55" r="8" class="shape-empty"/>
      <circle cx="30" cy="55" r="8" class="shape-empty"/>
      <circle cx="50" cy="55" r="8" class="shape-empty"/>
      <circle cx="70" cy="55" r="8" class="shape-empty"/>
      <circle cx="10" cy="75" r="8" class="shape-empty"/>
      <circle cx="30" cy="75" r="8" class="shape-empty"/>
      <circle cx="50" cy="75" r="8" class="shape-empty"/>
      <circle cx="70" cy="75" r="8" class="shape-empty"/>
    </g>
    
    <text x="200" y="170" class="text-label" text-anchor="middle">All models show equivalent fractions equal to 1/4</text>
  </svg>`;
}

function generateBarGraphSVG(): string {
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <style>
      .bar { fill: #FF5B00; stroke: #333; stroke-width: 1; }
      .axis { stroke: #333; stroke-width: 2; }
      .text-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #333; }
    </style>
    
    <!-- Title -->
    <text x="200" y="25" class="title" text-anchor="middle">Books Read by Students</text>
    
    <!-- Y-axis -->
    <line x1="50" y1="50" x2="50" y2="220" class="axis"/>
    
    <!-- X-axis -->
    <line x1="50" y1="220" x2="350" y2="220" class="axis"/>
    
    <!-- Y-axis labels -->
    <text x="45" y="55" class="text-label" text-anchor="end">8</text>
    <text x="45" y="80" class="text-label" text-anchor="end">7</text>
    <text x="45" y="105" class="text-label" text-anchor="end">6</text>
    <text x="45" y="130" class="text-label" text-anchor="end">5</text>
    <text x="45" y="155" class="text-label" text-anchor="end">4</text>
    <text x="45" y="180" class="text-label" text-anchor="end">3</text>
    <text x="45" y="205" class="text-label" text-anchor="end">2</text>
    <text x="45" y="225" class="text-label" text-anchor="end">0</text>
    
    <!-- Bars -->
    <!-- 1 book: 4 students -->
    <rect x="70" y="155" width="50" height="65" class="bar"/>
    <text x="95" y="240" class="text-label" text-anchor="middle">1 book</text>
    
    <!-- 2 books: 6 students -->
    <rect x="140" y="105" width="50" height="115" class="bar"/>
    <text x="165" y="240" class="text-label" text-anchor="middle">2 books</text>
    
    <!-- 3 books: 8 students -->
    <rect x="210" y="55" width="50" height="165" class="bar"/>
    <text x="235" y="240" class="text-label" text-anchor="middle">3 books</text>
    
    <!-- 4 books: 3 students -->
    <rect x="280" y="180" width="50" height="40" class="bar"/>
    <text x="305" y="240" class="text-label" text-anchor="middle">4 books</text>
    
    <!-- Axis labels -->
    <text x="200" y="270" class="text-label" text-anchor="middle">Number of Books</text>
    <text x="25" y="135" class="text-label" text-anchor="middle" transform="rotate(-90, 25, 135)">Students</text>
  </svg>`;
}

function generateRectangleSVG(): string {
  return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <style>
      .rectangle { fill: #FCC201; stroke: #333; stroke-width: 2; opacity: 0.7; }
      .dimension { stroke: #333; stroke-width: 1; }
      .text-label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #333; }
    </style>
    
    <!-- Title -->
    <text x="150" y="25" class="title" text-anchor="middle">Rectangular Garden</text>
    
    <!-- Rectangle -->
    <rect x="75" y="60" width="150" height="80" class="rectangle"/>
    
    <!-- Dimension lines -->
    <!-- Top dimension line -->
    <line x1="75" y1="45" x2="225" y2="45" class="dimension"/>
    <line x1="75" y1="40" x2="75" y2="50" class="dimension"/>
    <line x1="225" y1="40" x2="225" y2="50" class="dimension"/>
    <text x="150" y="40" class="text-label" text-anchor="middle">15 feet</text>
    
    <!-- Side dimension line -->
    <line x1="240" y1="60" x2="240" y2="140" class="dimension"/>
    <line x1="235" y1="60" x2="245" y2="60" class="dimension"/>
    <line x1="235" y1="140" x2="245" y2="140" class="dimension"/>
    <text x="255" y="105" class="text-label" text-anchor="middle">8 feet</text>
    
    <!-- Formula -->
    <text x="150" y="170" class="text-label" text-anchor="middle">Area = length × width</text>
    <text x="150" y="185" class="text-label" text-anchor="middle">Area = 15 × 8 = 120 square feet</text>
  </svg>`;
}

function generateGeometricShapesSVG(): string {
  return `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape { fill: #10B981; stroke: #333; stroke-width: 2; opacity: 0.8; }
      .text-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #333; }
    </style>
    
    <!-- Title -->
    <text x="200" y="20" class="title" text-anchor="middle">Quadrilaterals</text>
    
    <!-- Square -->
    <rect x="30" y="40" width="60" height="60" class="shape"/>
    <text x="60" y="115" class="text-label" text-anchor="middle">Square</text>
    
    <!-- Rectangle -->
    <rect x="130" y="50" width="80" height="40" class="shape"/>
    <text x="170" y="105" class="text-label" text-anchor="middle">Rectangle</text>
    
    <!-- Parallelogram -->
    <polygon points="250,50 320,50 340,90 270,90" class="shape"/>
    <text x="295" y="105" class="text-label" text-anchor="middle">Parallelogram</text>
    
    <!-- Trapezoid -->
    <polygon points="50,130 110,130 100,170 60,170" class="shape"/>
    <text x="80" y="185" class="text-label" text-anchor="middle">Trapezoid</text>
    
    <!-- Rhombus -->
    <polygon points="200,130 230,150 200,170 170,150" class="shape"/>
    <text x="200" y="185" class="text-label" text-anchor="middle">Rhombus</text>
    
    <!-- Note -->
    <text x="200" y="195" class="text-label" text-anchor="middle">All shapes above are quadrilaterals (4-sided polygons)</text>
  </svg>`;
}

function generateDivisionModelSVG(): string {
  return `<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
    <style>
      .item { fill: #FF5B00; stroke: #333; stroke-width: 1; }
      .group-box { fill: none; stroke: #333; stroke-width: 2; stroke-dasharray: 5,5; }
      .text-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #333; }
    </style>
    
    <!-- Title -->
    <text x="200" y="20" class="title" text-anchor="middle">48 stickers divided into 6 equal groups</text>
    
    <!-- Group 1 -->
    <rect x="20" y="40" width="110" height="30" class="group-box"/>
    <circle cx="35" cy="55" r="5" class="item"/>
    <circle cx="50" cy="55" r="5" class="item"/>
    <circle cx="65" cy="55" r="5" class="item"/>
    <circle cx="80" cy="55" r="5" class="item"/>
    <circle cx="95" cy="55" r="5" class="item"/>
    <circle cx="110" cy="55" r="5" class="item"/>
    <circle cx="125" cy="55" r="5" class="item"/>
    <circle cx="35" cy="75" r="5" class="item"/>
    <text x="75" y="90" class="text-label" text-anchor="middle">Group 1: 8 stickers</text>
    
    <!-- Group 2 -->
    <rect x="150" y="40" width="110" height="30" class="group-box"/>
    <circle cx="165" cy="55" r="5" class="item"/>
    <circle cx="180" cy="55" r="5" class="item"/>
    <circle cx="195" cy="55" r="5" class="item"/>
    <circle cx="210" cy="55" r="5" class="item"/>
    <circle cx="225" cy="55" r="5" class="item"/>
    <circle cx="240" cy="55" r="5" class="item"/>
    <circle cx="255" cy="55" r="5" class="item"/>
    <circle cx="165" cy="75" r="5" class="item"/>
    <text x="205" y="90" class="text-label" text-anchor="middle">Group 2: 8 stickers</text>
    
    <!-- Group 3 -->
    <rect x="280" y="40" width="110" height="30" class="group-box"/>
    <circle cx="295" cy="55" r="5" class="item"/>
    <circle cx="310" cy="55" r="5" class="item"/>
    <circle cx="325" cy="55" r="5" class="item"/>
    <circle cx="340" cy="55" r="5" class="item"/>
    <circle cx="355" cy="55" r="5" class="item"/>
    <circle cx="370" cy="55" r="5" class="item"/>
    <circle cx="385" cy="55" r="5" class="item"/>
    <circle cx="295" cy="75" r="5" class="item"/>
    <text x="335" y="90" class="text-label" text-anchor="middle">Group 3: 8 stickers</text>
    
    <!-- Group 4 -->
    <rect x="20" y="110" width="110" height="30" class="group-box"/>
    <circle cx="35" cy="125" r="5" class="item"/>
    <circle cx="50" cy="125" r="5" class="item"/>
    <circle cx="65" cy="125" r="5" class="item"/>
    <circle cx="80" cy="125" r="5" class="item"/>
    <circle cx="95" cy="125" r="5" class="item"/>
    <circle cx="110" cy="125" r="5" class="item"/>
    <circle cx="125" cy="125" r="5" class="item"/>
    <circle cx="35" cy="145" r="5" class="item"/>
    <text x="75" y="160" class="text-label" text-anchor="middle">Group 4: 8 stickers</text>
    
    <!-- Group 5 -->
    <rect x="150" y="110" width="110" height="30" class="group-box"/>
    <circle cx="165" cy="125" r="5" class="item"/>
    <circle cx="180" cy="125" r="5" class="item"/>
    <circle cx="195" cy="125" r="5" class="item"/>
    <circle cx="210" cy="125" r="5" class="item"/>
    <circle cx="225" cy="125" r="5" class="item"/>
    <circle cx="240" cy="125" r="5" class="item"/>
    <circle cx="255" cy="125" r="5" class="item"/>
    <circle cx="165" cy="145" r="5" class="item"/>
    <text x="205" y="160" class="text-label" text-anchor="middle">Group 5: 8 stickers</text>
    
    <!-- Group 6 -->
    <rect x="280" y="110" width="110" height="30" class="group-box"/>
    <circle cx="295" cy="125" r="5" class="item"/>
    <circle cx="310" cy="125" r="5" class="item"/>
    <circle cx="325" cy="125" r="5" class="item"/>
    <circle cx="340" cy="125" r="5" class="item"/>
    <circle cx="355" cy="125" r="5" class="item"/>
    <circle cx="370" cy="125" r="5" class="item"/>
    <circle cx="385" cy="125" r="5" class="item"/>
    <circle cx="295" cy="145" r="5" class="item"/>
    <text x="335" y="160" class="text-label" text-anchor="middle">Group 6: 8 stickers</text>
    
    <!-- Equation -->
    <text x="200" y="190" class="title" text-anchor="middle">48 ÷ 6 = 8</text>
    <text x="200" y="210" class="text-label" text-anchor="middle">Each group has 8 stickers</text>
  </svg>`;
}

function generateTrapezoidSVG(): string {
  return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <style>
      .trapezoid { fill: #8B5CF6; stroke: #333; stroke-width: 2; opacity: 0.8; }
      .dimension { stroke: #333; stroke-width: 1; }
      .text-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #333; }
    </style>
    
    <!-- Title -->
    <text x="150" y="25" class="title" text-anchor="middle">Trapezoid</text>
    
    <!-- Trapezoid -->
    <polygon points="100,60 200,60 220,120 80,120" class="trapezoid"/>
    
    <!-- Dimension lines -->
    <!-- Top base -->
    <line x1="100" y1="45" x2="200" y2="45" class="dimension"/>
    <line x1="100" y1="40" x2="100" y2="50" class="dimension"/>
    <line x1="200" y1="40" x2="200" y2="50" class="dimension"/>
    <text x="150" y="40" class="text-label" text-anchor="middle">8 units</text>
    
    <!-- Bottom base -->
    <line x1="80" y1="135" x2="220" y2="135" class="dimension"/>
    <line x1="80" y1="130" x2="80" y2="140" class="dimension"/>
    <line x1="220" y1="130" x2="220" y2="140" class="dimension"/>
    <text x="150" y="150" class="text-label" text-anchor="middle">12 units</text>
    
    <!-- Height -->
    <line x1="250" y1="60" x2="250" y2="120" class="dimension"/>
    <line x1="245" y1="60" x2="255" y2="60" class="dimension"/>
    <line x1="245" y1="120" x2="255" y2="120" class="dimension"/>
    <text x="265" y="95" class="text-label" text-anchor="middle">6 units</text>
    
    <!-- Formula -->
    <text x="150" y="175" class="text-label" text-anchor="middle">Area = ½ × (base₁ + base₂) × height</text>
    <text x="150" y="190" class="text-label" text-anchor="middle">Area = ½ × (8 + 12) × 6 = 60 square units</text>
  </svg>`;
}

function generateDefaultMathSVG(): string {
  return `<svg width="300" height="150" xmlns="http://www.w3.org/2000/svg">
    <style>
      .placeholder { fill: #f3f4f6; stroke: #d1d5db; stroke-width: 2; stroke-dasharray: 5,5; }
      .text-label { font-family: Arial, sans-serif; font-size: 14px; fill: #6b7280; }
    </style>
    
    <rect x="50" y="30" width="200" height="90" class="placeholder"/>
    <text x="150" y="80" class="text-label" text-anchor="middle">Math Diagram</text>
    <text x="150" y="100" class="text-label" text-anchor="middle">Visual element for this question</text>
  </svg>`;
}