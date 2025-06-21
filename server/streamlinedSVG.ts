/**
 * Streamlined SVG Generator - Fast, deterministic visual generation
 * Maps question types directly to SVG templates without complex pattern matching
 */

export interface SVGConfig {
  type: string;
  data: any;
  width?: number;
  height?: number;
}

export function generateStreamlinedSVG(config: SVGConfig): string {
  const { type, data, width = 400, height = 300 } = config;

  switch (type) {
    case 'rectangle_area':
      return generateRectangleAreaSVG(data.length, data.width, data.unit || 'feet', width, height);
    
    case 'sticker_division':
      return generateStickerGroupsSVG(data.total, data.groups, width, height);
    
    case 'bar_graph':
      return generateBarGraphSVG(data.categories, data.values, data.title, width, height);
    
    case 'fraction_models':
      return generateFractionModelsSVG(data.fractions, width, height);
    
    case 'geometric_shapes':
      return generateGeometricShapesSVG(data.shapes, width, height);
    
    case 'number_line':
      return generateNumberLineSVG(data.start, data.end, data.marked, width, height);
    
    default:
      return generateDefaultSVG(width, height);
  }
}

function generateRectangleAreaSVG(length: number, width: number, unit: string, svgWidth: number, svgHeight: number): string {
  const scale = Math.min((svgWidth - 100) / length, (svgHeight - 100) / width, 12);
  const rectWidth = length * scale;
  const rectHeight = width * scale;
  const startX = (svgWidth - rectWidth) / 2;
  const startY = (svgHeight - rectHeight) / 2;

  return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .garden { fill: #90EE90; stroke: #2D5A3D; stroke-width: 2; }
      .dimension { font-family: Arial, sans-serif; font-size: 12px; fill: #333; font-weight: bold; }
      .dimension-line { stroke: #666; stroke-width: 1; marker-end: url(#arrowhead); }
      .title { font-family: Arial, sans-serif; font-size: 14px; fill: #2D5A3D; font-weight: bold; text-anchor: middle; }
    </style>
    
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#666"/>
      </marker>
    </defs>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="25" class="title">Rectangular Garden</text>
    
    <!-- Garden rectangle -->
    <rect x="${startX}" y="${startY}" width="${rectWidth}" height="${rectHeight}" class="garden"/>
    
    <!-- Length dimension (bottom) -->
    <line x1="${startX}" y1="${startY + rectHeight + 20}" x2="${startX + rectWidth}" y2="${startY + rectHeight + 20}" class="dimension-line"/>
    <text x="${startX + rectWidth/2}" y="${startY + rectHeight + 35}" text-anchor="middle" class="dimension">${length} ${unit}</text>
    
    <!-- Width dimension (left) -->
    <line x1="${startX - 20}" y1="${startY}" x2="${startX - 20}" y2="${startY + rectHeight}" class="dimension-line"/>
    <text x="${startX - 30}" y="${startY + rectHeight/2}" text-anchor="middle" class="dimension" transform="rotate(-90, ${startX - 30}, ${startY + rectHeight/2})">${width} ${unit}</text>
    
    <!-- Area label -->
    <text x="${startX + rectWidth/2}" y="${startY + rectHeight/2}" text-anchor="middle" class="dimension">Area = ${length} × ${width}</text>
    <text x="${startX + rectWidth/2}" y="${startY + rectHeight/2 + 15}" text-anchor="middle" class="dimension">= ${length * width} square ${unit}</text>
  </svg>`;
}

function generateStickerGroupsSVG(total: number, groups: number, svgWidth: number, svgHeight: number): string {
  const stickersPerGroup = total / groups;
  const groupWidth = Math.min(80, (svgWidth - 40) / groups);
  const groupHeight = 60;
  const stickerSize = 4;
  const startY = 40;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .sticker { fill: #FFD700; stroke: #DAA520; stroke-width: 1; }
      .group-box { fill: none; stroke: #666; stroke-width: 2; stroke-dasharray: 3,3; }
      .label { font-family: Arial, sans-serif; font-size: 11px; fill: #333; text-anchor: middle; }
      .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; text-anchor: middle; }
    </style>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="25" class="title">${total} Stickers Divided into ${groups} Albums</text>`;

  for (let group = 0; group < groups; group++) {
    const x = 20 + group * (groupWidth + 10);
    
    // Group box
    svg += `<rect x="${x}" y="${startY}" width="${groupWidth}" height="${groupHeight}" class="group-box"/>`;
    
    // Stickers in this group
    for (let sticker = 0; sticker < stickersPerGroup; sticker++) {
      const stickerX = x + 5 + (sticker % 8) * (stickerSize + 1);
      const stickerY = startY + 5 + Math.floor(sticker / 8) * (stickerSize + 1);
      svg += `<circle cx="${stickerX + stickerSize/2}" cy="${stickerY + stickerSize/2}" r="${stickerSize/2}" class="sticker"/>`;
    }
    
    // Label
    svg += `<text x="${x + groupWidth/2}" y="${startY + groupHeight + 15}" class="label">Album ${group + 1}</text>`;
    svg += `<text x="${x + groupWidth/2}" y="${startY + groupHeight + 28}" class="label">${stickersPerGroup} stickers</text>`;
  }
  
  svg += `</svg>`;
  return svg;
}

function generateBarGraphSVG(categories: string[], values: number[], title: string, svgWidth: number, svgHeight: number): string {
  const margin = { top: 60, right: 40, bottom: 60, left: 60 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;
  const maxValue = Math.max(...values);
  const barWidth = chartWidth / categories.length * 0.8;
  const barSpacing = chartWidth / categories.length * 0.2;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .bar { fill: #4A90E2; stroke: #2E5C8A; stroke-width: 1; }
      .axis { stroke: #333; stroke-width: 2; }
      .axis-text { font-family: Arial, sans-serif; font-size: 11px; fill: #333; text-anchor: middle; }
      .value-label { font-family: Arial, sans-serif; font-size: 10px; fill: #333; text-anchor: middle; }
      .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; text-anchor: middle; }
      .y-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; text-anchor: middle; }
    </style>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="25" class="title">${title}</text>
    
    <!-- Y-axis -->
    <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" class="axis"/>
    
    <!-- X-axis -->
    <line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" class="axis"/>
    
    <!-- Y-axis labels -->
    <text x="${margin.left - 15}" y="${margin.top + chartHeight/2}" class="y-label" transform="rotate(-90, ${margin.left - 15}, ${margin.top + chartHeight/2})">Number of Students</text>`;

  // Draw bars and labels
  categories.forEach((category, i) => {
    const barHeight = (values[i] / maxValue) * chartHeight;
    const x = margin.left + i * (barWidth + barSpacing) + barSpacing/2;
    const y = margin.top + chartHeight - barHeight;
    
    // Bar
    svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" class="bar"/>`;
    
    // Value label on top of bar
    svg += `<text x="${x + barWidth/2}" y="${y - 5}" class="value-label">${values[i]}</text>`;
    
    // Category label below x-axis
    svg += `<text x="${x + barWidth/2}" y="${margin.top + chartHeight + 20}" class="axis-text">${category}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

function generateFractionModelsSVG(fractions: Array<{numerator: number, denominator: number}>, svgWidth: number, svgHeight: number): string {
  const modelWidth = 80;
  const modelHeight = 80;
  const spacing = 20;
  const totalWidth = fractions.length * modelWidth + (fractions.length - 1) * spacing;
  const startX = (svgWidth - totalWidth) / 2;
  const startY = 60;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .filled { fill: #FF6B6B; stroke: #E55555; stroke-width: 1; }
      .empty { fill: #F8F9FA; stroke: #DEE2E6; stroke-width: 1; }
      .fraction-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; text-anchor: middle; font-weight: bold; }
      .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; text-anchor: middle; }
    </style>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="25" class="title">Equivalent Fractions</text>`;

  fractions.forEach((fraction, index) => {
    const x = startX + index * (modelWidth + spacing);
    const partHeight = modelHeight / fraction.denominator;
    
    // Fraction label
    svg += `<text x="${x + modelWidth/2}" y="${startY - 10}" class="fraction-label">${fraction.numerator}/${fraction.denominator}</text>`;
    
    // Draw fraction parts
    for (let part = 0; part < fraction.denominator; part++) {
      const partY = startY + part * partHeight;
      const isFilled = part < fraction.numerator;
      svg += `<rect x="${x}" y="${partY}" width="${modelWidth}" height="${partHeight}" class="${isFilled ? 'filled' : 'empty'}"/>`;
    }
  });

  svg += `</svg>`;
  return svg;
}

function generateGeometricShapesSVG(shapes: string[], svgWidth: number, svgHeight: number): string {
  const shapeSize = 60;
  const spacing = 20;
  const totalWidth = shapes.length * shapeSize + (shapes.length - 1) * spacing;
  const startX = (svgWidth - totalWidth) / 2;
  const startY = 80;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .shape { fill: #A8E6CF; stroke: #56C596; stroke-width: 2; }
      .shape-label { font-family: Arial, sans-serif; font-size: 11px; fill: #333; text-anchor: middle; }
      .title { font-family: Arial, sans-serif; font-size: 14px; fill: #333; font-weight: bold; text-anchor: middle; }
    </style>
    
    <!-- Title -->
    <text x="${svgWidth/2}" y="25" class="title">Geometric Shapes</text>`;

  shapes.forEach((shape, index) => {
    const x = startX + index * (shapeSize + spacing);
    
    switch (shape.toLowerCase()) {
      case 'square':
        svg += `<rect x="${x}" y="${startY}" width="${shapeSize}" height="${shapeSize}" class="shape"/>`;
        break;
      case 'rectangle':
        svg += `<rect x="${x}" y="${startY + 10}" width="${shapeSize}" height="${shapeSize - 20}" class="shape"/>`;
        break;
      case 'triangle':
        svg += `<polygon points="${x + shapeSize/2},${startY} ${x},${startY + shapeSize} ${x + shapeSize},${startY + shapeSize}" class="shape"/>`;
        break;
      case 'circle':
        svg += `<circle cx="${x + shapeSize/2}" cy="${startY + shapeSize/2}" r="${shapeSize/2}" class="shape"/>`;
        break;
      default:
        svg += `<rect x="${x}" y="${startY}" width="${shapeSize}" height="${shapeSize}" class="shape"/>`;
    }
    
    // Shape label
    svg += `<text x="${x + shapeSize/2}" y="${startY + shapeSize + 20}" class="shape-label">${shape}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

function generateNumberLineSVG(start: number, end: number, marked: number[], svgWidth: number, svgHeight: number): string {
  const margin = 60;
  const lineLength = svgWidth - 2 * margin;
  const lineY = svgHeight / 2;
  const range = end - start;

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .number-line { stroke: #333; stroke-width: 3; }
      .tick { stroke: #333; stroke-width: 2; }
      .marked-tick { stroke: #E74C3C; stroke-width: 3; }
      .number-label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; text-anchor: middle; }
      .marked-label { font-family: Arial, sans-serif; font-size: 12px; fill: #E74C3C; text-anchor: middle; font-weight: bold; }
    </style>
    
    <!-- Number line -->
    <line x1="${margin}" y1="${lineY}" x2="${margin + lineLength}" y2="${lineY}" class="number-line"/>`;

  // Draw ticks and labels
  for (let i = start; i <= end; i++) {
    const x = margin + ((i - start) / range) * lineLength;
    const isMarked = marked.includes(i);
    
    svg += `<line x1="${x}" y1="${lineY - 10}" x2="${x}" y2="${lineY + 10}" class="${isMarked ? 'marked-tick' : 'tick'}"/>`;
    svg += `<text x="${x}" y="${lineY + 25}" class="${isMarked ? 'marked-label' : 'number-label'}">${i}</text>`;
  }

  svg += `</svg>`;
  return svg;
}

function generateDefaultSVG(svgWidth: number, svgHeight: number): string {
  return `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .bg { fill: #F8F9FA; stroke: #DEE2E6; stroke-width: 1; }
      .text { font-family: Arial, sans-serif; font-size: 14px; fill: #6C757D; text-anchor: middle; }
    </style>
    
    <rect width="${svgWidth}" height="${svgHeight}" class="bg"/>
    <text x="${svgWidth/2}" y="${svgHeight/2}" class="text">Mathematical Diagram</text>
  </svg>`;
}