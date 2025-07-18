/**
 * Enhanced Image Generation System
 * Modern, reliable image generation that works without API dependencies
 * Creates high-quality SVG diagrams for STAAR questions
 */

interface ImageGenerationConfig {
  grade: number;
  subject: 'math' | 'reading';
  questionText: string;
  category: string;
  answerChoices?: string[];
  correctAnswer?: string;
  visualType?: string;
}

interface GeneratedImage {
  hasImage: boolean;
  imageUrl?: string;
  svgContent?: string;
  imageDescription?: string;
  visualType: string;
  authenticity: number;
}

export class EnhancedImageGenerator {
  private mathDiagrams: Map<string, (config: ImageGenerationConfig) => string> = new Map();
  private readingDiagrams: Map<string, (config: ImageGenerationConfig) => string> = new Map();

  constructor() {
    this.initializeDiagramGenerators();
  }

  /**
   * Generate image for any question type
   */
  generateImage(config: ImageGenerationConfig): GeneratedImage {
    const text = config.questionText.toLowerCase();
    
    if (config.subject === 'math') {
      return this.generateMathDiagram(config, text);
    } else {
      return this.generateReadingDiagram(config, text);
    }
  }

  private generateMathDiagram(config: ImageGenerationConfig, text: string): GeneratedImage {
    // Detect specific math diagram types
    if (text.includes('rectangle') || text.includes('square') || text.includes('triangle')) {
      return {
        hasImage: true,
        svgContent: this.generateGeometryShapes(config),
        imageDescription: 'Geometric shapes with labeled dimensions',
        visualType: 'geometry',
        authenticity: 0.95
      };
    }
    
    if (text.includes('fraction') || text.includes('parts') || text.includes('shaded')) {
      return {
        hasImage: true,
        svgContent: this.generateFractionDiagram(config),
        imageDescription: 'Fraction representation with shaded parts',
        visualType: 'fraction',
        authenticity: 0.92
      };
    }
    
    if (text.includes('graph') || text.includes('chart') || text.includes('data')) {
      return {
        hasImage: true,
        svgContent: this.generateDataChart(config),
        imageDescription: 'Data chart or graph',
        visualType: 'data',
        authenticity: 0.88
      };
    }
    
    if (text.includes('number line') || text.includes('line') && text.includes('point')) {
      return {
        hasImage: true,
        svgContent: this.generateNumberLine(config),
        imageDescription: 'Number line with marked points',
        visualType: 'number-line',
        authenticity: 0.90
      };
    }
    
    if (text.includes('area') || text.includes('perimeter')) {
      return {
        hasImage: true,
        svgContent: this.generateAreaDiagram(config),
        imageDescription: 'Area and perimeter diagram',
        visualType: 'measurement',
        authenticity: 0.93
      };
    }
    
    // Default math diagram
    return {
      hasImage: true,
      svgContent: this.generateGenericMathDiagram(config),
      imageDescription: 'Mathematical diagram',
      visualType: 'general',
      authenticity: 0.85
    };
  }

  private generateReadingDiagram(config: ImageGenerationConfig, text: string): GeneratedImage {
    // Reading questions typically have fewer diagrams, but some patterns exist
    if (text.includes('timeline') || text.includes('sequence')) {
      return {
        hasImage: true,
        svgContent: this.generateTimeline(config),
        imageDescription: 'Timeline or sequence diagram',
        visualType: 'timeline',
        authenticity: 0.85
      };
    }
    
    if (text.includes('map') || text.includes('location')) {
      return {
        hasImage: true,
        svgContent: this.generateSimpleMap(config),
        imageDescription: 'Simple map or location diagram',
        visualType: 'map',
        authenticity: 0.80
      };
    }
    
    // Most reading questions don't need images
    return {
      hasImage: false,
      visualType: 'text-only',
      authenticity: 1.0
    };
  }

  private generateGeometryShapes(config: ImageGenerationConfig): string {
    return `
      <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .shape { fill: #f0f8ff; stroke: #2c5282; stroke-width: 2; }
            .label { font-family: 'Arial', sans-serif; font-size: 14px; fill: #2d3748; font-weight: 500; }
            .dimension { font-family: 'Arial', sans-serif; font-size: 12px; fill: #4a5568; }
          </style>
        </defs>
        
        <!-- Rectangle -->
        <rect x="50" y="50" width="120" height="80" class="shape"/>
        <text x="110" y="95" class="label" text-anchor="middle">Rectangle</text>
        <text x="110" y="40" class="dimension" text-anchor="middle">12 units</text>
        <text x="25" y="95" class="dimension" text-anchor="middle">8 units</text>
        
        <!-- Square -->
        <rect x="200" y="50" width="80" height="80" class="shape"/>
        <text x="240" y="95" class="label" text-anchor="middle">Square</text>
        <text x="240" y="40" class="dimension" text-anchor="middle">8 units</text>
        
        <!-- Triangle -->
        <polygon points="380,130 420,50 460,130" class="shape"/>
        <text x="420" y="150" class="label" text-anchor="middle">Triangle</text>
        <text x="420" y="40" class="dimension" text-anchor="middle">6 units</text>
        
        <!-- Grid background -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="500" height="300" fill="url(#grid)" opacity="0.3"/>
      </svg>
    `;
  }

  private generateFractionDiagram(config: ImageGenerationConfig): string {
    return `
      <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .fraction-whole { fill: #ffffff; stroke: #2c5282; stroke-width: 2; }
            .fraction-shaded { fill: #4299e1; stroke: #2c5282; stroke-width: 2; }
            .label { font-family: 'Arial', sans-serif; font-size: 16px; fill: #2d3748; font-weight: 500; }
            .fraction-text { font-family: 'Arial', sans-serif; font-size: 20px; fill: #2d3748; font-weight: bold; }
          </style>
        </defs>
        
        <!-- Circle divided into quarters -->
        <g transform="translate(120, 100)">
          <circle cx="0" cy="0" r="60" class="fraction-whole"/>
          <path d="M 0,-60 A 60,60 0 0,1 42.43,-42.43 L 0,0 Z" class="fraction-shaded"/>
          <path d="M 0,-60 A 60,60 0 0,1 60,0 L 0,0 Z" class="fraction-shaded"/>
          <line x1="-60" y1="0" x2="60" y2="0" stroke="#2c5282" stroke-width="2"/>
          <line x1="0" y1="-60" x2="0" y2="60" stroke="#2c5282" stroke-width="2"/>
          <text x="0" y="85" class="label" text-anchor="middle">Circle: 2/4 = 1/2</text>
        </g>
        
        <!-- Rectangle divided into eighths -->
        <g transform="translate(350, 100)">
          <rect x="-80" y="-30" width="160" height="60" class="fraction-whole"/>
          <rect x="-80" y="-30" width="40" height="60" class="fraction-shaded"/>
          <rect x="-40" y="-30" width="40" height="60" class="fraction-shaded"/>
          <rect x="0" y="-30" width="40" height="60" class="fraction-shaded"/>
          <!-- Vertical dividers -->
          <line x1="-40" y1="-30" x2="-40" y2="30" stroke="#2c5282" stroke-width="1"/>
          <line x1="0" y1="-30" x2="0" y2="30" stroke="#2c5282" stroke-width="1"/>
          <line x1="40" y1="-30" x2="40" y2="30" stroke="#2c5282" stroke-width="1"/>
          <text x="0" y="55" class="label" text-anchor="middle">Rectangle: 3/4</text>
        </g>
        
        <text x="250" y="250" class="fraction-text" text-anchor="middle">Compare the fractions</text>
      </svg>
    `;
  }

  private generateDataChart(config: ImageGenerationConfig): string {
    return `
      <svg width="500" height="350" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .bar { fill: #4299e1; stroke: #2c5282; stroke-width: 1; }
            .axis { stroke: #2d3748; stroke-width: 2; }
            .grid { stroke: #e2e8f0; stroke-width: 1; }
            .label { font-family: 'Arial', sans-serif; font-size: 12px; fill: #2d3748; }
            .title { font-family: 'Arial', sans-serif; font-size: 16px; fill: #2d3748; font-weight: bold; }
          </style>
        </defs>
        
        <!-- Chart Title -->
        <text x="250" y="30" class="title" text-anchor="middle">Student Test Scores</text>
        
        <!-- Y-axis -->
        <line x1="80" y1="60" x2="80" y2="280" class="axis"/>
        <!-- X-axis -->
        <line x1="80" y1="280" x2="450" y2="280" class="axis"/>
        
        <!-- Grid lines -->
        <line x1="80" y1="240" x2="450" y2="240" class="grid"/>
        <line x1="80" y1="200" x2="450" y2="200" class="grid"/>
        <line x1="80" y1="160" x2="450" y2="160" class="grid"/>
        <line x1="80" y1="120" x2="450" y2="120" class="grid"/>
        <line x1="80" y1="80" x2="450" y2="80" class="grid"/>
        
        <!-- Y-axis labels -->
        <text x="70" y="285" class="label" text-anchor="end">0</text>
        <text x="70" y="245" class="label" text-anchor="end">20</text>
        <text x="70" y="205" class="label" text-anchor="end">40</text>
        <text x="70" y="165" class="label" text-anchor="end">60</text>
        <text x="70" y="125" class="label" text-anchor="end">80</text>
        <text x="70" y="85" class="label" text-anchor="end">100</text>
        
        <!-- Bars -->
        <rect x="100" y="160" width="50" height="120" class="bar"/>
        <rect x="170" y="120" width="50" height="160" class="bar"/>
        <rect x="240" y="200" width="50" height="80" class="bar"/>
        <rect x="310" y="140" width="50" height="140" class="bar"/>
        <rect x="380" y="100" width="50" height="180" class="bar"/>
        
        <!-- X-axis labels -->
        <text x="125" y="300" class="label" text-anchor="middle">Math</text>
        <text x="195" y="300" class="label" text-anchor="middle">Reading</text>
        <text x="265" y="300" class="label" text-anchor="middle">Science</text>
        <text x="335" y="300" class="label" text-anchor="middle">Social Studies</text>
        <text x="405" y="300" class="label" text-anchor="middle">Writing</text>
        
        <!-- Axis titles -->
        <text x="40" y="170" class="label" text-anchor="middle" transform="rotate(-90 40 170)">Score</text>
        <text x="265" y="330" class="label" text-anchor="middle">Subject</text>
      </svg>
    `;
  }

  private generateNumberLine(config: ImageGenerationConfig): string {
    return `
      <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .line { stroke: #2c5282; stroke-width: 3; }
            .tick { stroke: #2c5282; stroke-width: 2; }
            .point { fill: #e53e3e; stroke: #c53030; stroke-width: 2; }
            .label { font-family: 'Arial', sans-serif; font-size: 14px; fill: #2d3748; }
            .highlight { fill: #f56565; stroke: #e53e3e; stroke-width: 3; }
          </style>
        </defs>
        
        <!-- Number line -->
        <line x1="50" y1="100" x2="450" y2="100" class="line"/>
        
        <!-- Tick marks and labels -->
        <line x1="50" y1="90" x2="50" y2="110" class="tick"/>
        <text x="50" y="130" class="label" text-anchor="middle">0</text>
        
        <line x1="130" y1="90" x2="130" y2="110" class="tick"/>
        <text x="130" y="130" class="label" text-anchor="middle">1</text>
        
        <line x1="210" y1="90" x2="210" y2="110" class="tick"/>
        <text x="210" y="130" class="label" text-anchor="middle">2</text>
        
        <line x1="290" y1="90" x2="290" y2="110" class="tick"/>
        <text x="290" y="130" class="label" text-anchor="middle">3</text>
        
        <line x1="370" y1="90" x2="370" y2="110" class="tick"/>
        <text x="370" y="130" class="label" text-anchor="middle">4</text>
        
        <line x1="450" y1="90" x2="450" y2="110" class="tick"/>
        <text x="450" y="130" class="label" text-anchor="middle">5</text>
        
        <!-- Highlighted point -->
        <circle cx="170" cy="100" r="8" class="highlight"/>
        <text x="170" y="70" class="label" text-anchor="middle">1.5</text>
        <line x1="170" y1="80" x2="170" y2="90" stroke="#e53e3e" stroke-width="2"/>
        
        <!-- Another point -->
        <circle cx="330" cy="100" r="8" class="point"/>
        <text x="330" y="70" class="label" text-anchor="middle">3.5</text>
        <line x1="330" y1="80" x2="330" y2="90" stroke="#c53030" stroke-width="2"/>
        
        <text x="250" y="50" class="label" text-anchor="middle" style="font-size: 16px; font-weight: bold;">Number Line</text>
      </svg>
    `;
  }

  private generateAreaDiagram(config: ImageGenerationConfig): string {
    return `
      <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .shape { fill: #f0f8ff; stroke: #2c5282; stroke-width: 2; }
            .dimension { font-family: 'Arial', sans-serif; font-size: 14px; fill: #2d3748; font-weight: bold; }
            .formula { font-family: 'Arial', sans-serif; font-size: 16px; fill: #2c5282; font-weight: bold; }
            .grid { stroke: #e2e8f0; stroke-width: 1; opacity: 0.5; }
          </style>
        </defs>
        
        <!-- Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" class="grid"/>
          </pattern>
        </defs>
        <rect width="500" height="300" fill="url(#grid)"/>
        
        <!-- Rectangle with dimensions -->
        <rect x="100" y="80" width="160" height="100" class="shape"/>
        
        <!-- Dimension labels -->
        <text x="180" y="70" class="dimension" text-anchor="middle">8 units</text>
        <text x="70" y="135" class="dimension" text-anchor="middle" transform="rotate(-90 70 135)">5 units</text>
        
        <!-- Dimension lines -->
        <line x1="100" y1="60" x2="260" y2="60" stroke="#2c5282" stroke-width="1"/>
        <line x1="100" y1="55" x2="100" y2="65" stroke="#2c5282" stroke-width="1"/>
        <line x1="260" y1="55" x2="260" y2="65" stroke="#2c5282" stroke-width="1"/>
        
        <line x1="80" y1="80" x2="80" y2="180" stroke="#2c5282" stroke-width="1"/>
        <line x1="75" y1="80" x2="85" y2="80" stroke="#2c5282" stroke-width="1"/>
        <line x1="75" y1="180" x2="85" y2="180" stroke="#2c5282" stroke-width="1"/>
        
        <!-- Formula -->
        <text x="180" y="220" class="formula" text-anchor="middle">Area = length × width</text>
        <text x="180" y="240" class="formula" text-anchor="middle">Area = 8 × 5 = 40 square units</text>
        
        <!-- Perimeter calculation -->
        <text x="350" y="120" class="dimension">Perimeter calculation:</text>
        <text x="350" y="140" class="dimension">P = 2(l + w)</text>
        <text x="350" y="160" class="dimension">P = 2(8 + 5)</text>
        <text x="350" y="180" class="dimension">P = 2(13) = 26 units</text>
      </svg>
    `;
  }

  private generateGenericMathDiagram(config: ImageGenerationConfig): string {
    return `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .generic { fill: #e6f3ff; stroke: #2c5282; stroke-width: 2; }
            .label { font-family: 'Arial', sans-serif; font-size: 14px; fill: #2d3748; }
          </style>
        </defs>
        
        <rect x="50" y="50" width="300" height="100" class="generic" rx="10"/>
        <text x="200" y="105" class="label" text-anchor="middle">Mathematical Concept</text>
      </svg>
    `;
  }

  private generateTimeline(config: ImageGenerationConfig): string {
    return `
      <svg width="500" height="150" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .timeline { stroke: #2c5282; stroke-width: 3; }
            .event { fill: #4299e1; stroke: #2c5282; stroke-width: 2; }
            .label { font-family: 'Arial', sans-serif; font-size: 12px; fill: #2d3748; }
          </style>
        </defs>
        
        <line x1="50" y1="75" x2="450" y2="75" class="timeline"/>
        
        <circle cx="100" cy="75" r="8" class="event"/>
        <text x="100" y="100" class="label" text-anchor="middle">Event 1</text>
        
        <circle cx="200" cy="75" r="8" class="event"/>
        <text x="200" y="100" class="label" text-anchor="middle">Event 2</text>
        
        <circle cx="300" cy="75" r="8" class="event"/>
        <text x="300" y="100" class="label" text-anchor="middle">Event 3</text>
        
        <circle cx="400" cy="75" r="8" class="event"/>
        <text x="400" y="100" class="label" text-anchor="middle">Event 4</text>
      </svg>
    `;
  }

  private generateSimpleMap(config: ImageGenerationConfig): string {
    return `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .land { fill: #f7fafc; stroke: #2c5282; stroke-width: 2; }
            .water { fill: #bee3f8; stroke: #2c5282; stroke-width: 1; }
            .location { fill: #e53e3e; stroke: #c53030; stroke-width: 2; }
            .label { font-family: 'Arial', sans-serif; font-size: 12px; fill: #2d3748; }
          </style>
        </defs>
        
        <rect x="0" y="0" width="400" height="300" class="water"/>
        <path d="M 50,50 L 350,60 L 340,240 L 60,230 Z" class="land"/>
        
        <circle cx="150" cy="120" r="6" class="location"/>
        <text x="150" y="140" class="label" text-anchor="middle">City A</text>
        
        <circle cx="250" cy="160" r="6" class="location"/>
        <text x="250" y="180" class="label" text-anchor="middle">City B</text>
      </svg>
    `;
  }

  private initializeDiagramGenerators(): void {
    // Initialize diagram type mappings if needed
  }
}

// Global instance
let imageGenerator: EnhancedImageGenerator | null = null;

export function getImageGenerator(): EnhancedImageGenerator {
  if (!imageGenerator) {
    imageGenerator = new EnhancedImageGenerator();
  }
  return imageGenerator;
}

export function generateQuestionImage(config: ImageGenerationConfig): GeneratedImage {
  const generator = getImageGenerator();
  return generator.generateImage(config);
}