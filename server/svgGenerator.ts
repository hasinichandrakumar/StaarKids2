/**
 * SVG diagram generator for math and reading questions
 * Creates authentic visual elements for STAAR-style questions
 */

export function getQuestionSVG(questionText: string, imageDescription: string | null, grade: number, year?: number): string {
  // Parse question type from text and description
  const questionType = detectQuestionType(questionText, imageDescription);
  
  switch (questionType) {
    case 'geometry-shapes':
      return generateGeometryShapesSVG(questionText, imageDescription);
    case 'geometry-area':
      return generateAreaDiagramSVG(questionText, imageDescription);
    case 'fractions':
      return generateFractionsDiagramSVG(questionText, imageDescription);
    case 'data-graph':
      return generateDataGraphSVG(questionText, imageDescription);
    case 'number-line':
      return generateNumberLineSVG(questionText, imageDescription);
    case 'word-problem':
      return generateWordProblemSVG(questionText, imageDescription);
    default:
      return generateGenericDiagramSVG(questionText, imageDescription);
  }
}

function detectQuestionType(questionText: string, imageDescription: string | null): string {
  const text = (questionText + ' ' + (imageDescription || '')).toLowerCase();
  
  if (text.includes('quadrilateral') || text.includes('rectangle') || text.includes('square') || text.includes('triangle')) {
    return 'geometry-shapes';
  }
  if (text.includes('area') || text.includes('perimeter') || text.includes('length') && text.includes('width')) {
    return 'geometry-area';
  }
  if (text.includes('fraction') || text.includes('parts') || text.includes('shaded')) {
    return 'fractions';
  }
  if (text.includes('graph') || text.includes('chart') || text.includes('data')) {
    return 'data-graph';
  }
  if (text.includes('number line') || text.includes('point')) {
    return 'number-line';
  }
  return 'word-problem';
}

function generateGeometryShapesSVG(questionText: string, imageDescription: string | null): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .shape { fill: #e3f2fd; stroke: #1976d2; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
        </style>
      </defs>
      
      <!-- Rectangle -->
      <rect x="50" y="50" width="80" height="60" class="shape"/>
      <text x="90" y="85" class="label" text-anchor="middle">Rectangle</text>
      
      <!-- Square -->
      <rect x="150" y="50" width="60" height="60" class="shape"/>
      <text x="180" y="85" class="label" text-anchor="middle">Square</text>
      
      <!-- Trapezoid -->
      <polygon points="280,110 320,110 310,50 290,50" class="shape"/>
      <text x="300" y="85" class="label" text-anchor="middle">Trapezoid</text>
      
      <!-- Triangle -->
      <polygon points="90,180 120,230 60,230" class="shape"/>
      <text x="90" y="250" class="label" text-anchor="middle">Triangle</text>
      
      <!-- Parallelogram -->
      <polygon points="180,180 240,180 220,230 160,230" class="shape"/>
      <text x="200" y="250" class="label" text-anchor="middle">Parallelogram</text>
      
      <text x="200" y="20" class="label" text-anchor="middle" font-weight="bold">Various Quadrilaterals</text>
    </svg>
  `;
}

function generateAreaDiagramSVG(questionText: string, imageDescription: string | null): string {
  // Extract dimensions from question text
  const lengthMatch = questionText.match(/(\d+)\s*feet?\s*(?:long|length)/i);
  const widthMatch = questionText.match(/(\d+)\s*feet?\s*(?:wide|width)/i);
  
  const length = lengthMatch ? parseInt(lengthMatch[1]) : 12;
  const width = widthMatch ? parseInt(widthMatch[1]) : 8;
  
  const scale = Math.min(300 / length, 200 / width);
  const rectWidth = length * scale;
  const rectHeight = width * scale;
  
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .garden { fill: #c8e6c9; stroke: #388e3c; stroke-width: 2; }
          .dimension { font-family: Arial, sans-serif; font-size: 14px; fill: #1976d2; font-weight: bold; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #666; }
        </style>
      </defs>
      
      <!-- Garden rectangle -->
      <rect x="50" y="50" width="${rectWidth}" height="${rectHeight}" class="garden"/>
      
      <!-- Length dimension -->
      <line x1="50" y1="${50 + rectHeight + 20}" x2="${50 + rectWidth}" y2="${50 + rectHeight + 20}" stroke="#1976d2" stroke-width="2"/>
      <line x1="50" y1="${50 + rectHeight + 15}" x2="50" y2="${50 + rectHeight + 25}" stroke="#1976d2" stroke-width="2"/>
      <line x1="${50 + rectWidth}" y1="${50 + rectHeight + 15}" x2="${50 + rectWidth}" y2="${50 + rectHeight + 25}" stroke="#1976d2" stroke-width="2"/>
      <text x="${50 + rectWidth/2}" y="${50 + rectHeight + 35}" class="dimension" text-anchor="middle">${length} feet</text>
      
      <!-- Width dimension -->
      <line x1="25" y1="50" x2="25" y2="${50 + rectHeight}" stroke="#1976d2" stroke-width="2"/>
      <line x1="20" y1="50" x2="30" y2="50" stroke="#1976d2" stroke-width="2"/>
      <line x1="20" y1="${50 + rectHeight}" x2="30" y2="${50 + rectHeight}" stroke="#1976d2" stroke-width="2"/>
      <text x="15" y="${50 + rectHeight/2}" class="dimension" text-anchor="middle" transform="rotate(-90, 15, ${50 + rectHeight/2})">${width} feet</text>
      
      <text x="200" y="20" class="dimension" text-anchor="middle">Rectangular Garden</text>
      <text x="200" y="280" class="label" text-anchor="middle">Area = length × width = ${length} × ${width} = ${length * width} square feet</text>
    </svg>
  `;
}

function generateFractionsDiagramSVG(questionText: string, imageDescription: string | null): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .whole { fill: #fff3e0; stroke: #f57c00; stroke-width: 2; }
          .shaded { fill: #ffcc02; stroke: #f57c00; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
        </style>
      </defs>
      
      <!-- Circle divided into 8 parts, 3 shaded -->
      <g transform="translate(100, 150)">
        <circle cx="0" cy="0" r="60" class="whole"/>
        <!-- Pie slices -->
        <path d="M 0,0 L 60,0 A 60,60 0 0,1 42.43,42.43 Z" class="shaded"/>
        <path d="M 0,0 L 42.43,42.43 A 60,60 0 0,1 0,60 Z" class="shaded"/>
        <path d="M 0,0 L 0,60 A 60,60 0 0,1 -42.43,42.43 Z" class="shaded"/>
        <!-- Division lines -->
        <line x1="0" y1="0" x2="60" y2="0" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="42.43" y2="42.43" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="0" y2="60" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="-42.43" y2="42.43" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="-60" y2="0" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="-42.43" y2="-42.43" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="0" y2="-60" stroke="#f57c00" stroke-width="1"/>
        <line x1="0" y1="0" x2="42.43" y2="-42.43" stroke="#f57c00" stroke-width="1"/>
      </g>
      
      <text x="100" y="50" class="label" text-anchor="middle">3/8 shaded</text>
      
      <!-- Rectangle divided into parts -->
      <g transform="translate(280, 100)">
        <rect x="0" y="0" width="80" height="40" class="whole"/>
        <rect x="0" y="0" width="20" height="40" class="shaded"/>
        <rect x="20" y="0" width="20" height="40" class="shaded"/>
        <!-- Division lines -->
        <line x1="20" y1="0" x2="20" y2="40" stroke="#f57c00" stroke-width="1"/>
        <line x1="40" y1="0" x2="40" y2="40" stroke="#f57c00" stroke-width="1"/>
        <line x1="60" y1="0" x2="60" y2="40" stroke="#f57c00" stroke-width="1"/>
      </g>
      
      <text x="320" y="170" class="label" text-anchor="middle">2/4 = 1/2</text>
      
      <text x="200" y="20" class="label" text-anchor="middle" font-weight="bold">Fraction Representations</text>
    </svg>
  `;
}

function generateDataGraphSVG(questionText: string, imageDescription: string | null): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .bar { fill: #42a5f5; stroke: #1976d2; stroke-width: 1; }
          .axis { stroke: #333; stroke-width: 2; fill: none; }
          .grid { stroke: #ddd; stroke-width: 1; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
          .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; }
        </style>
      </defs>
      
      <!-- Grid lines -->
      <line x1="60" y1="50" x2="60" y2="220" class="grid"/>
      <line x1="60" y1="220" x2="350" y2="220" class="grid"/>
      
      <!-- Y-axis labels -->
      <text x="50" y="55" class="label" text-anchor="end">20</text>
      <text x="50" y="80" class="label" text-anchor="end">16</text>
      <text x="50" y="105" class="label" text-anchor="end">12</text>
      <text x="50" y="130" class="label" text-anchor="end">8</text>
      <text x="50" y="155" class="label" text-anchor="end">4</text>
      <text x="50" y="180" class="label" text-anchor="end">0</text>
      
      <!-- Bars -->
      <rect x="80" y="130" width="40" height="90" class="bar"/>
      <rect x="140" y="105" width="40" height="115" class="bar"/>
      <rect x="200" y="155" width="40" height="65" class="bar"/>
      <rect x="260" y="80" width="40" height="140" class="bar"/>
      
      <!-- X-axis labels -->
      <text x="100" y="240" class="label" text-anchor="middle">Dogs</text>
      <text x="160" y="240" class="label" text-anchor="middle">Cats</text>
      <text x="220" y="240" class="label" text-anchor="middle">Birds</text>
      <text x="280" y="240" class="label" text-anchor="middle">Fish</text>
      
      <!-- Axes -->
      <line x1="60" y1="50" x2="60" y2="220" class="axis"/>
      <line x1="60" y1="220" x2="350" y2="220" class="axis"/>
      
      <text x="200" y="20" class="title" text-anchor="middle">Favorite Pets Survey</text>
      <text x="25" y="140" class="label" text-anchor="middle" transform="rotate(-90, 25, 140)">Number of Students</text>
    </svg>
  `;
}

function generateNumberLineSVG(questionText: string, imageDescription: string | null): string {
  return `
    <svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .line { stroke: #333; stroke-width: 3; }
          .tick { stroke: #333; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; text-anchor: middle; }
          .point { fill: #f44336; stroke: #d32f2f; stroke-width: 2; }
        </style>
      </defs>
      
      <!-- Number line -->
      <line x1="50" y1="75" x2="350" y2="75" class="line"/>
      
      <!-- Tick marks and labels -->
      <line x1="50" y1="70" x2="50" y2="80" class="tick"/>
      <text x="50" y="100" class="label">0</text>
      
      <line x1="110" y1="70" x2="110" y2="80" class="tick"/>
      <text x="110" y="100" class="label">0.2</text>
      
      <line x1="170" y1="70" x2="170" y2="80" class="tick"/>
      <text x="170" y="100" class="label">0.4</text>
      
      <line x1="230" y1="70" x2="230" y2="80" class="tick"/>
      <text x="230" y="100" class="label">0.6</text>
      
      <line x1="290" y1="70" x2="290" y2="80" class="tick"/>
      <text x="290" y="100" class="label">0.8</text>
      
      <line x1="350" y1="70" x2="350" y2="80" class="tick"/>
      <text x="350" y="100" class="label">1.0</text>
      
      <!-- Point at 0.5 -->
      <circle cx="200" cy="75" r="5" class="point"/>
      <text x="200" y="50" class="label" style="fill: #f44336; font-weight: bold;">0.5</text>
      
      <text x="200" y="30" class="label" style="font-weight: bold;">Point on Number Line</text>
    </svg>
  `;
}

function generateWordProblemSVG(questionText: string, imageDescription: string | null): string {
  return `
    <svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .object { fill: #e1f5fe; stroke: #0277bd; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; text-anchor: middle; }
          .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; text-anchor: middle; }
        </style>
      </defs>
      
      <!-- Glass cases (7 cases) -->
      <g transform="translate(50, 80)">
        ${Array.from({length: 7}, (_, i) => `
          <rect x="${i * 40}" y="0" width="30" height="40" class="object"/>
          <text x="${i * 40 + 15}" y="55" class="label">Case ${i + 1}</text>
        `).join('')}
      </g>
      
      <!-- Feathers representation -->
      <g transform="translate(70, 100)">
        ${Array.from({length: 7}, (_, i) => `
          <g transform="translate(${i * 40}, 0)">
            ${Array.from({length: 6}, (_, j) => `
              <circle cx="${(j % 3) * 3 + 3}" cy="${Math.floor(j / 3) * 6 + 3}" r="1.5" fill="#ff9800"/>
            `).join('')}
          </g>
        `).join('')}
      </g>
      
      <text x="200" y="30" class="title">42 feathers ÷ 7 cases = 6 feathers per case</text>
      <text x="200" y="190" class="label">Each glass case contains an equal number of feathers</text>
    </svg>
  `;
}

function generateGenericDiagramSVG(questionText: string, imageDescription: string | null): string {
  return `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .box { fill: #f5f5f5; stroke: #666; stroke-width: 2; }
          .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; text-anchor: middle; }
        </style>
      </defs>
      
      <rect x="100" y="60" width="200" height="80" class="box"/>
      <text x="200" y="105" class="label">${imageDescription || 'Visual Element'}</text>
      
      <text x="200" y="30" class="label" style="font-weight: bold;">Question Diagram</text>
    </svg>
  `;
}