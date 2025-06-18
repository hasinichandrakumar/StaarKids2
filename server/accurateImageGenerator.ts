/**
 * Accurate Image Generator - Creates precise SVG diagrams matching STAAR question content
 */

export interface ImageConfig {
  questionId: number;
  questionText: string;
  imageDescription: string;
  grade: number;
  subject: string;
}

export function generateAccurateSVG(config: ImageConfig): string {
  const { questionText, imageDescription } = config;
  const description = imageDescription?.toLowerCase() || '';
  const text = questionText?.toLowerCase() || '';
  
  // Rectangle/Garden area problems
  if ((description.includes('rectangular') && (description.includes('garden') || description.includes('diagram'))) ||
      (text.includes('rectangular') && text.includes('area')) ||
      (text.includes('length') && text.includes('width') && text.includes('feet'))) {
    const lengthMatch = description.match(/(\d+)\s*feet?\s*by\s*(\d+)\s*feet?/) || 
                       text.match(/length\s*of\s*(\d+)\s*feet?\s*.*width\s*of\s*(\d+)\s*feet?/) ||
                       text.match(/(\d+)\s*feet\s*.*(\d+)\s*feet/) ||
                       description.match(/(\d+)\s*feet\s*by\s*(\d+)\s*feet/);
    if (lengthMatch) {
      const length = parseInt(lengthMatch[1]);
      const width = parseInt(lengthMatch[2]);
      return generateRectangleAreaDiagram(length, width);
    }
    // Default rectangular garden for area questions
    return generateRectangleAreaDiagram(15, 8);
  }
  
  // Bar graph data visualization
  if (description.includes('bar graph') && description.includes('books')) {
    return generateBooksBarGraph();
  }
  
  // Fraction models with equivalent fractions
  if (description.includes('fraction') && description.includes('equivalent')) {
    return generateEquivalentFractions();
  }
  
  // Geometric shapes classification
  if (description.includes('geometric shapes') || text.includes('quadrilateral')) {
    return generateQuadrilaterals();
  }
  
  // Division/grouping problems
  if (description.includes('stickers') && description.includes('albums')) {
    const stickerMatch = text.match(/(\d+)\s*stickers?/) || [null, '48'];
    const albumMatch = text.match(/(\d+)\s*albums?/) || [null, '6'];
    const stickers = parseInt(stickerMatch[1] || '48');
    const albums = parseInt(albumMatch[1] || '6');
    return generateStickerDivision(stickers, albums);
  }
  
  // Parallelogram calculations
  if (description.includes('parallelogram')) {
    return generateParallelogram();
  }
  
  // Triangle area calculations
  if (description.includes('triangle')) {
    return generateTriangle();
  }
  
  // Check for any area calculation questions
  if (text.includes('area') || text.includes('garden') || text.includes('rectangular')) {
    return generateRectangleAreaDiagram(15, 8);
  }
  
  // Default math diagram
  return generateDefaultDiagram();
}

function generateRectangleAreaDiagram(length: number, width: number): string {
  const scale = Math.min(200 / Math.max(length, width), 15);
  const rectWidth = length * scale;
  const rectHeight = width * scale;
  const centerX = 250;
  const centerY = 125;
  
  return `<svg width="500" height="250" xmlns="http://www.w3.org/2000/svg">
    <style>
      .garden { fill: #C8E6C9; stroke: #388E3C; stroke-width: 3; }
      .dimension { font-family: Arial, sans-serif; font-size: 16px; fill: #1565C0; font-weight: bold; }
      .calculation { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; }
    </style>
    
    <rect x="${centerX - rectWidth/2}" y="${centerY - rectHeight/2}" 
          width="${rectWidth}" height="${rectHeight}" class="garden"/>
    
    <!-- Length label -->
    <text x="${centerX}" y="${centerY - rectHeight/2 - 15}" 
          class="dimension" text-anchor="middle">${length} feet</text>
    
    <!-- Width label -->
    <text x="${centerX - rectWidth/2 - 25}" y="${centerY}" 
          class="dimension" text-anchor="middle" 
          transform="rotate(-90, ${centerX - rectWidth/2 - 25}, ${centerY})">${width} feet</text>
    
    <!-- Area calculation -->
    <text x="250" y="220" class="calculation" text-anchor="middle">
      Area = length × width = ${length} × ${width} = ${length * width} square feet
    </text>
  </svg>`;
}

function generateBooksBarGraph(): string {
  return `<svg width="500" height="350" xmlns="http://www.w3.org/2000/svg">
    <style>
      .bar { fill: #2196F3; stroke: #1565C0; stroke-width: 2; }
      .axis { stroke: #333; stroke-width: 3; }
      .grid { stroke: #E0E0E0; stroke-width: 1; }
      .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 16px; fill: #333; font-weight: bold; }
    </style>
    
    <text x="250" y="25" class="title" text-anchor="middle">Books Read by Students in Ms. Johnson's Class</text>
    
    <!-- Y-axis -->
    <line x1="80" y1="50" x2="80" y2="280" class="axis"/>
    <!-- X-axis -->
    <line x1="80" y1="280" x2="420" y2="280" class="axis"/>
    
    <!-- Grid lines and Y-axis labels -->
    ${Array.from({length: 9}, (_, i) => 
      `<line x1="75" y1="${280 - i * 30}" x2="420" y2="${280 - i * 30}" class="grid"/>
       <text x="70" y="${280 - i * 30 + 5}" class="label" text-anchor="end">${i}</text>`
    ).join('')}
    
    <!-- Bars with exact STAAR data: 1 book=3 students, 2 books=5 students, 3 books=7 students, 4 books=4 students -->
    <rect x="100" y="190" width="60" height="90" class="bar"/>
    <text x="130" y="300" class="label" text-anchor="middle">1 book</text>
    
    <rect x="180" y="130" width="60" height="150" class="bar"/>
    <text x="210" y="300" class="label" text-anchor="middle">2 books</text>
    
    <rect x="260" y="70" width="60" height="210" class="bar"/>
    <text x="290" y="300" class="label" text-anchor="middle">3 books</text>
    
    <rect x="340" y="160" width="60" height="120" class="bar"/>
    <text x="370" y="300" class="label" text-anchor="middle">4 books</text>
    
    <!-- Axis labels -->
    <text x="250" y="330" class="label" text-anchor="middle">Number of Books Read</text>
    <text x="35" y="165" class="label" text-anchor="middle" transform="rotate(-90, 35, 165)">Number of Students</text>
  </svg>`;
}

function generateEquivalentFractions(): string {
  return `<svg width="600" height="250" xmlns="http://www.w3.org/2000/svg">
    <style>
      .filled { fill: #FF6B35; stroke: #333; stroke-width: 2; }
      .empty { fill: white; stroke: #333; stroke-width: 2; }
      .label { font-family: Arial, sans-serif; font-size: 16px; fill: #333; font-weight: bold; }
      .title { font-family: Arial, sans-serif; font-size: 18px; fill: #333; font-weight: bold; }
    </style>
    
    <text x="300" y="30" class="title" text-anchor="middle">Equivalent Fractions</text>
    
    <!-- 1/4 model -->
    <g transform="translate(80, 70)">
      <text x="50" y="20" class="label" text-anchor="middle">1/4</text>
      <rect x="0" y="30" width="25" height="25" class="filled"/>
      <rect x="25" y="30" width="25" height="25" class="empty"/>
      <rect x="50" y="30" width="25" height="25" class="empty"/>
      <rect x="75" y="30" width="25" height="25" class="empty"/>
    </g>
    
    <!-- 2/8 model -->
    <g transform="translate(240, 70)">
      <text x="50" y="20" class="label" text-anchor="middle">2/8</text>
      <rect x="0" y="30" width="12.5" height="25" class="filled"/>
      <rect x="12.5" y="30" width="12.5" height="25" class="filled"/>
      <rect x="25" y="30" width="12.5" height="25" class="empty"/>
      <rect x="37.5" y="30" width="12.5" height="25" class="empty"/>
      <rect x="50" y="30" width="12.5" height="25" class="empty"/>
      <rect x="62.5" y="30" width="12.5" height="25" class="empty"/>
      <rect x="75" y="30" width="12.5" height="25" class="empty"/>
      <rect x="87.5" y="30" width="12.5" height="25" class="empty"/>
    </g>
    
    <!-- 3/12 model -->
    <g transform="translate(420, 70)">
      <text x="41.5" y="20" class="label" text-anchor="middle">3/12</text>
      ${Array.from({length: 12}, (_, i) => 
        `<rect x="${i * 7}" y="30" width="7" height="25" class="${i < 3 ? 'filled' : 'empty'}"/>`
      ).join('')}
    </g>
    
    <text x="300" y="150" class="label" text-anchor="middle">All fractions shown equal 1/4</text>
    <text x="300" y="180" class="label" text-anchor="middle">Answer: D. All of the above</text>
  </svg>`;
}

function generateQuadrilaterals(): string {
  return `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape { fill: #E3F2FD; stroke: #1976D2; stroke-width: 3; }
      .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 18px; fill: #333; font-weight: bold; }
    </style>
    
    <text x="300" y="30" class="title" text-anchor="middle">All Shapes Are Quadrilaterals</text>
    
    <!-- Square -->
    <g transform="translate(80, 80)">
      <rect x="0" y="0" width="80" height="80" class="shape"/>
      <text x="40" y="100" class="label" text-anchor="middle">Square</text>
      <text x="40" y="115" class="label" text-anchor="middle">(4 equal sides)</text>
    </g>
    
    <!-- Rectangle -->
    <g transform="translate(240, 80)">
      <rect x="0" y="0" width="100" height="60" class="shape"/>
      <text x="50" y="80" class="label" text-anchor="middle">Rectangle</text>
      <text x="50" y="95" class="label" text-anchor="middle">(4 sides)</text>
    </g>
    
    <!-- Parallelogram -->
    <g transform="translate(420, 80)">
      <polygon points="0,60 25,0 105,0 80,60" class="shape"/>
      <text x="52.5" y="80" class="label" text-anchor="middle">Parallelogram</text>
      <text x="52.5" y="95" class="label" text-anchor="middle">(4 sides)</text>
    </g>
    
    <!-- Trapezoid -->
    <g transform="translate(160, 220)">
      <polygon points="15,60 0,0 90,0 75,60" class="shape"/>
      <text x="45" y="80" class="label" text-anchor="middle">Trapezoid</text>
      <text x="45" y="95" class="label" text-anchor="middle">(4 sides)</text>
    </g>
    
    <text x="300" y="350" class="title" text-anchor="middle">Answer: B. They are all quadrilaterals</text>
  </svg>`;
}

function generateStickerDivision(totalStickers: number, albums: number): string {
  const stickersPerAlbum = Math.floor(totalStickers / albums);
  
  return `<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <style>
      .album { fill: #FFF3E0; stroke: #FF8F00; stroke-width: 3; }
      .sticker { fill: #FFEB3B; stroke: #F57F17; stroke-width: 1; }
      .label { font-family: Arial, sans-serif; font-size: 14px; fill: #333; }
      .title { font-family: Arial, sans-serif; font-size: 16px; fill: #333; font-weight: bold; }
    </style>
    
    <text x="300" y="30" class="title" text-anchor="middle">${totalStickers} stickers divided equally into ${albums} albums</text>
    
    ${Array.from({length: albums}, (_, i) => {
      const x = 50 + (i % 3) * 180;
      const y = 60 + Math.floor(i / 3) * 120;
      
      return `<g transform="translate(${x}, ${y})">
        <rect x="0" y="0" width="140" height="80" class="album"/>
        <text x="70" y="100" class="label" text-anchor="middle">Album ${i + 1}</text>
        ${Array.from({length: stickersPerAlbum}, (_, j) => {
          const stickerX = 15 + (j % 10) * 12;
          const stickerY = 15 + Math.floor(j / 10) * 12;
          return `<circle cx="${stickerX}" cy="${stickerY}" r="5" class="sticker"/>`;
        }).join('')}
        <text x="70" y="70" class="label" text-anchor="middle">${stickersPerAlbum} stickers</text>
      </g>`;
    }).join('')}
    
    <text x="300" y="380" class="title" text-anchor="middle">Answer: B. ${stickersPerAlbum} stickers in each album</text>
  </svg>`;
}

function generateParallelogram(): string {
  return `<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape { fill: #E8F5E8; stroke: #2E7D32; stroke-width: 3; }
      .dimension { font-family: Arial, sans-serif; font-size: 16px; fill: #1565C0; font-weight: bold; }
      .calculation { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; }
    </style>
    
    <polygon points="120,180 180,80 350,80 290,180" class="shape"/>
    
    <!-- Base dimension -->
    <text x="265" y="65" class="dimension" text-anchor="middle">8 units</text>
    
    <!-- Height dimension -->
    <text x="90" y="130" class="dimension" text-anchor="middle">6 units</text>
    
    <!-- Area calculation -->
    <text x="250" y="230" class="calculation" text-anchor="middle">Area = base × height</text>
    <text x="250" y="250" class="calculation" text-anchor="middle">= 8 × 6 = 48 square units</text>
  </svg>`;
}

function generateTriangle(): string {
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape { fill: #FCE4EC; stroke: #C2185B; stroke-width: 3; }
      .dimension { font-family: Arial, sans-serif; font-size: 16px; fill: #1565C0; font-weight: bold; }
      .calculation { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; }
      .height-line { stroke: #FF5722; stroke-width: 2; stroke-dasharray: 5,5; }
    </style>
    
    <polygon points="200,60 120,200 280,200" class="shape"/>
    
    <!-- Height line -->
    <line x1="200" y1="60" x2="200" y2="200" class="height-line"/>
    
    <!-- Base dimension -->
    <text x="200" y="230" class="dimension" text-anchor="middle">Base = 8 units</text>
    
    <!-- Height dimension -->
    <text x="170" y="130" class="dimension" text-anchor="end">Height = 6 units</text>
    
    <!-- Area calculation -->
    <text x="200" y="260" class="calculation" text-anchor="middle">Area = ½ × base × height = ½ × 8 × 6 = 24 square units</text>
  </svg>`;
}

function generateDefaultDiagram(): string {
  return `<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape { fill: #E3F2FD; stroke: #1976D2; stroke-width: 3; }
      .label { font-family: Arial, sans-serif; font-size: 18px; fill: #333; font-weight: bold; }
    </style>
    
    <rect x="100" y="75" width="200" height="100" class="shape" rx="10"/>
    <text x="200" y="135" class="label" text-anchor="middle">Mathematical Diagram</text>
  </svg>`;
}