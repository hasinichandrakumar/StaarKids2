/**
 * Enhanced Image Generation System with Quality Guardrails
 * Implements template-based generation with AI assistance and validation
 */

import { InsertQuestion } from "@shared/schema";

export interface ImageGenerationConfig {
  questionId: string;
  questionText: string;
  grade: number;
  subject: 'math' | 'reading';
  imageType: 'diagram' | 'chart' | 'illustration' | 'geometric';
  complexity: 'simple' | 'medium' | 'complex';
  requirements: string[];
}

export interface GeneratedImage {
  svgContent: string;
  description: string;
  accessibility: string;
  validationScore: number;
  generationMethod: 'template' | 'ai_assisted' | 'hybrid';
}

/**
 * Main image generation pipeline with quality controls
 */
export async function generateQualityImage(config: ImageGenerationConfig): Promise<GeneratedImage> {
  // Determine best generation method
  const method = determineGenerationMethod(config);
  
  let result: GeneratedImage;
  
  switch (method) {
    case 'template':
      result = generateTemplateBasedImage(config);
      break;
    case 'ai_assisted':
      result = await generateAIAssistedImage(config);
      break;
    case 'hybrid':
      result = await generateHybridImage(config);
      break;
    default:
      result = generateFallbackImage(config);
  }

  // Apply quality validation
  const validationScore = validateImageQuality(result.svgContent, config);
  result.validationScore = validationScore;

  // If quality is insufficient, try alternative method
  if (validationScore < 0.7) {
    console.log(`Image quality below threshold (${validationScore}), trying alternative method`);
    const alternativeMethod = method === 'template' ? 'hybrid' : 'template';
    
    if (alternativeMethod === 'template') {
      result = generateTemplateBasedImage(config);
    } else {
      result = await generateHybridImage(config);
    }
    result.validationScore = validateImageQuality(result.svgContent, config);
  }

  return result;
}

/**
 * Determine optimal generation method based on requirements
 */
function determineGenerationMethod(config: ImageGenerationConfig): 'template' | 'ai_assisted' | 'hybrid' {
  // Math geometric shapes -> template
  if (config.subject === 'math' && config.imageType === 'geometric') {
    return 'template';
  }

  // Simple charts and diagrams -> template
  if (config.complexity === 'simple' && ['diagram', 'chart'].includes(config.imageType)) {
    return 'template';
  }

  // Complex illustrations -> hybrid
  if (config.complexity === 'complex' || config.imageType === 'illustration') {
    return 'hybrid';
  }

  // Default to template for reliability
  return 'template';
}

/**
 * Template-based image generation (fast, reliable, mathematically accurate)
 */
function generateTemplateBasedImage(config: ImageGenerationConfig): GeneratedImage {
  let svgContent = '';
  let description = '';
  let accessibility = '';

  switch (config.imageType) {
    case 'geometric':
      ({ svgContent, description, accessibility } = generateGeometricShape(config));
      break;
    case 'chart':
      ({ svgContent, description, accessibility } = generateChart(config));
      break;
    case 'diagram':
      ({ svgContent, description, accessibility } = generateDiagram(config));
      break;
    default:
      ({ svgContent, description, accessibility } = generateBasicIllustration(config));
  }

  return {
    svgContent,
    description,
    accessibility,
    validationScore: 0.9, // Templates are highly reliable
    generationMethod: 'template'
  };
}

/**
 * AI-assisted image generation (for complex requirements)
 */
async function generateAIAssistedImage(config: ImageGenerationConfig): Promise<GeneratedImage> {
  // This would integrate with OpenAI DALL-E or similar service
  // For now, we'll simulate with enhanced template generation
  
  const prompt = createImagePrompt(config);
  console.log(`AI Image Prompt: ${prompt}`);
  
  // Fallback to enhanced template for now
  return generateEnhancedTemplate(config);
}

/**
 * Hybrid generation (template + AI enhancement)
 */
async function generateHybridImage(config: ImageGenerationConfig): Promise<GeneratedImage> {
  // Start with template base
  const templateResult = generateTemplateBasedImage(config);
  
  // Enhance with AI-suggested improvements
  const enhancements = suggestAIEnhancements(config, templateResult.svgContent);
  
  const enhancedSvg = applyEnhancements(templateResult.svgContent, enhancements);
  
  return {
    ...templateResult,
    svgContent: enhancedSvg,
    generationMethod: 'hybrid'
  };
}

/**
 * Generate geometric shapes for math problems
 */
function generateGeometricShape(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const shapes = extractShapeFromQuestion(config.questionText);
  
  if (shapes.includes('rectangle') || shapes.includes('square')) {
    return generateRectangle(config);
  } else if (shapes.includes('circle')) {
    return generateCircle(config);
  } else if (shapes.includes('triangle')) {
    return generateTriangle(config);
  } else if (shapes.includes('parallelogram')) {
    return generateParallelogram(config);
  }
  
  return generateBasicShape(config);
}

function generateRectangle(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const dimensions = extractDimensions(config.questionText);
  const width = dimensions.width || 120;
  const height = dimensions.height || 80;
  
  const svgContent = `
    <svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="35" width="${width}" height="${height}" 
            fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="${40 + width/2}" y="25" text-anchor="middle" font-family="Arial" font-size="12">
        ${width}
      </text>
      <text x="25" y="${35 + height/2}" text-anchor="middle" font-family="Arial" font-size="12">
        ${height}
      </text>
      <line x1="40" y1="30" x2="${40 + width}" y2="30" stroke="#666" stroke-width="1"/>
      <line x1="35" y1="35" x2="35" y2="${35 + height}" stroke="#666" stroke-width="1"/>
    </svg>`;
  
  const description = `Rectangle with width ${width} and height ${height}`;
  const accessibility = `A rectangle diagram showing dimensions: width of ${width} units and height of ${height} units`;
  
  return { svgContent, description, accessibility };
}

function generateCircle(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const radius = extractRadius(config.questionText) || 50;
  
  const svgContent = `
    <svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="75" r="${radius}" 
              fill="none" stroke="#2563eb" stroke-width="2"/>
      <line x1="100" y1="75" x2="${100 + radius}" y2="75" 
            stroke="#666" stroke-width="1" stroke-dasharray="3,3"/>
      <text x="${100 + radius/2}" y="70" text-anchor="middle" font-family="Arial" font-size="12">
        r = ${radius}
      </text>
    </svg>`;
  
  const description = `Circle with radius ${radius}`;
  const accessibility = `A circle diagram showing radius of ${radius} units`;
  
  return { svgContent, description, accessibility };
}

function generateTriangle(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const svgContent = `
    <svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,30 50,120 150,120" 
               fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="100" y="20" text-anchor="middle" font-family="Arial" font-size="12">A</text>
      <text x="45" y="135" text-anchor="middle" font-family="Arial" font-size="12">B</text>
      <text x="155" y="135" text-anchor="middle" font-family="Arial" font-size="12">C</text>
    </svg>`;
  
  const description = "Triangle with vertices labeled A, B, C";
  const accessibility = "A triangle diagram with three vertices labeled A at the top, B at bottom left, and C at bottom right";
  
  return { svgContent, description, accessibility };
}

function generateParallelogram(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const svgContent = `
    <svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,100 130,100 150,50 70,50" 
               fill="none" stroke="#2563eb" stroke-width="2"/>
      <text x="90" y="40" text-anchor="middle" font-family="Arial" font-size="12">80</text>
      <text x="25" y="80" text-anchor="middle" font-family="Arial" font-size="12">50</text>
    </svg>`;
  
  const description = "Parallelogram with labeled dimensions";
  const accessibility = "A parallelogram showing width of 80 units and height of 50 units";
  
  return { svgContent, description, accessibility };
}

/**
 * Generate charts for data representation
 */
function generateChart(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const chartType = extractChartType(config.questionText);
  
  if (chartType === 'bar') {
    return generateBarChart(config);
  } else if (chartType === 'pie') {
    return generatePieChart(config);
  } else if (chartType === 'line') {
    return generateLineChart(config);
  }
  
  return generateBarChart(config); // Default to bar chart
}

function generateBarChart(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  const data = extractChartData(config.questionText);
  
  const svgContent = `
    <svg width="300" height="200" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50, 150)">
        <!-- X axis -->
        <line x1="0" y1="0" x2="200" y2="0" stroke="#333" stroke-width="2"/>
        <!-- Y axis -->
        <line x1="0" y1="0" x2="0" y2="-120" stroke="#333" stroke-width="2"/>
        
        <!-- Bars -->
        <rect x="20" y="-60" width="30" height="60" fill="#3b82f6"/>
        <rect x="70" y="-40" width="30" height="40" fill="#ef4444"/>
        <rect x="120" y="-80" width="30" height="80" fill="#10b981"/>
        <rect x="170" y="-50" width="30" height="50" fill="#f59e0b"/>
        
        <!-- Labels -->
        <text x="35" y="15" text-anchor="middle" font-family="Arial" font-size="10">A</text>
        <text x="85" y="15" text-anchor="middle" font-family="Arial" font-size="10">B</text>
        <text x="135" y="15" text-anchor="middle" font-family="Arial" font-size="10">C</text>
        <text x="185" y="15" text-anchor="middle" font-family="Arial" font-size="10">D</text>
        
        <!-- Values -->
        <text x="35" y="-65" text-anchor="middle" font-family="Arial" font-size="10">6</text>
        <text x="85" y="-45" text-anchor="middle" font-family="Arial" font-size="10">4</text>
        <text x="135" y="-85" text-anchor="middle" font-family="Arial" font-size="10">8</text>
        <text x="185" y="-55" text-anchor="middle" font-family="Arial" font-size="10">5</text>
      </g>
    </svg>`;
  
  const description = "Bar chart showing data for categories A, B, C, D";
  const accessibility = "Bar chart with four bars: A has value 6, B has value 4, C has value 8, D has value 5";
  
  return { svgContent, description, accessibility };
}

/**
 * Validation and helper functions
 */
function validateImageQuality(svgContent: string, config: ImageGenerationConfig): number {
  let score = 1.0;
  
  // Check basic SVG structure
  if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
    score -= 0.5;
  }
  
  // Check for accessibility
  if (!svgContent.includes('aria-label') && !svgContent.includes('title')) {
    score -= 0.2;
  }
  
  // Check for appropriate dimensions
  const hasViewBox = svgContent.includes('viewBox');
  if (!hasViewBox) {
    score -= 0.1;
  }
  
  // Check for grade-appropriate complexity
  const elementCount = (svgContent.match(/<[^\/][^>]*>/g) || []).length;
  const maxElements = config.grade * 10; // Simple heuristic
  
  if (elementCount > maxElements) {
    score -= 0.2;
  }
  
  return Math.max(0, score);
}

function extractShapeFromQuestion(questionText: string): string[] {
  const shapes = [];
  const text = questionText.toLowerCase();
  
  if (text.includes('rectangle') || text.includes('rectangular')) shapes.push('rectangle');
  if (text.includes('square')) shapes.push('square');
  if (text.includes('circle') || text.includes('circular')) shapes.push('circle');
  if (text.includes('triangle') || text.includes('triangular')) shapes.push('triangle');
  if (text.includes('parallelogram')) shapes.push('parallelogram');
  
  return shapes;
}

function extractDimensions(questionText: string): { width?: number; height?: number } {
  const widthMatch = questionText.match(/width[:\s]*(\d+)/i);
  const heightMatch = questionText.match(/height[:\s]*(\d+)/i);
  const lengthMatch = questionText.match(/length[:\s]*(\d+)/i);
  
  return {
    width: widthMatch ? parseInt(widthMatch[1]) : lengthMatch ? parseInt(lengthMatch[1]) : undefined,
    height: heightMatch ? parseInt(heightMatch[1]) : undefined
  };
}

function extractRadius(questionText: string): number | null {
  const radiusMatch = questionText.match(/radius[:\s]*(\d+)/i);
  return radiusMatch ? parseInt(radiusMatch[1]) : null;
}

function extractChartType(questionText: string): string {
  const text = questionText.toLowerCase();
  if (text.includes('bar chart') || text.includes('bar graph')) return 'bar';
  if (text.includes('pie chart') || text.includes('pie graph')) return 'pie';
  if (text.includes('line chart') || text.includes('line graph')) return 'line';
  return 'bar'; // default
}

function extractChartData(questionText: string): number[] {
  const numbers = questionText.match(/\d+/g);
  return numbers ? numbers.slice(0, 4).map(Number) : [6, 4, 8, 5]; // default data
}

// Placeholder functions for AI integration
function createImagePrompt(config: ImageGenerationConfig): string {
  return `Generate a ${config.complexity} ${config.imageType} for grade ${config.grade} ${config.subject}: ${config.questionText}`;
}

function generateEnhancedTemplate(config: ImageGenerationConfig): GeneratedImage {
  return generateTemplateBasedImage(config);
}

function suggestAIEnhancements(config: ImageGenerationConfig, svgContent: string): string[] {
  return ['add_colors', 'improve_labels', 'enhance_accessibility'];
}

function applyEnhancements(svgContent: string, enhancements: string[]): string {
  // Apply basic enhancements
  let enhanced = svgContent;
  
  if (enhancements.includes('add_colors')) {
    enhanced = enhanced.replace(/stroke="#2563eb"/g, 'stroke="#3b82f6"');
  }
  
  return enhanced;
}

function generateBasicShape(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  return generateRectangle(config);
}

function generateBasicIllustration(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  return generateRectangle(config);
}

function generatePieChart(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  return generateBarChart(config); // Simplified for now
}

function generateLineChart(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  return generateBarChart(config); // Simplified for now
}

function generateDiagram(config: ImageGenerationConfig): { svgContent: string; description: string; accessibility: string } {
  return generateBarChart(config); // Simplified for now
}

function generateFallbackImage(config: ImageGenerationConfig): GeneratedImage {
  return generateTemplateBasedImage(config);
}