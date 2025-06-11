import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate educational SVG diagrams for STAAR math questions
 */
export async function generateMathQuestionSVG(
  questionText: string,
  imageDescription: string,
  grade: number
): Promise<string> {
  try {
    const prompt = `
Create a clean, educational SVG diagram for this STAAR Grade ${grade} math question.

Question: ${questionText}
Visual Description: ${imageDescription}

Requirements:
- Generate complete SVG code with viewBox="0 0 400 300"
- Use clear, simple geometric shapes appropriate for Grade ${grade}
- Include readable text labels with font-family="Arial, sans-serif"
- Use educational colors: blues (#4A90E2), greens (#7ED321), oranges (#F5A623)
- Make diagrams clear and mathematically accurate
- Include measurements, labels, or annotations as needed

Examples of what to create:
- Rectangular garden: Draw rectangle with labeled dimensions
- Geometric shapes: Draw clear quadrilaterals, triangles, etc.
- Charts/graphs: Create simple bar charts or data displays
- Mathematical models: Visual representations of math concepts

Return only the complete SVG code with proper structure:
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Your content here -->
</svg>
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    const svgContent = response.choices[0].message.content || "";
    
    // Validate that we got actual SVG content
    if (svgContent.includes("<svg") && svgContent.includes("</svg>")) {
      return svgContent;
    } else {
      return generateFallbackSVG(questionText, imageDescription);
    }
    
  } catch (error) {
    console.error("Error generating SVG diagram:", error);
    return generateFallbackSVG(questionText, imageDescription);
  }
}

/**
 * Generate fallback SVG for when AI generation fails
 */
function generateFallbackSVG(questionText: string, imageDescription: string): string {
  // Create a simple educational placeholder
  return `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="360" height="260" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2" rx="8"/>
  <text x="200" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#495057">
    Visual Element
  </text>
  <text x="200" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6c757d">
    ${imageDescription.substring(0, 40)}...
  </text>
  <circle cx="200" cy="200" r="30" fill="#4A90E2" opacity="0.3"/>
  <rect x="150" y="220" width="100" height="40" fill="#7ED321" opacity="0.3" rx="4"/>
</svg>`;
}

/**
 * Pre-generated SVGs for specific authentic STAAR questions
 */
export const AUTHENTIC_QUESTION_SVGS: { [key: string]: string } = {
  // Grade 4 Quadrilaterals question
  "quadrilaterals_4_2013": `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect x="10" y="10" width="380" height="280" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1" rx="5"/>
  
  <!-- Title -->
  <text x="200" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#212529">
    Geometric Figures
  </text>
  
  <!-- Square -->
  <rect x="50" y="60" width="60" height="60" fill="#4A90E2" stroke="#2c5aa0" stroke-width="2"/>
  <text x="80" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#495057">Square</text>
  
  <!-- Rectangle -->
  <rect x="150" y="70" width="80" height="50" fill="#7ED321" stroke="#5cb85c" stroke-width="2"/>
  <text x="190" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#495057">Rectangle</text>
  
  <!-- Parallelogram -->
  <path d="M 270 70 L 340 70 L 360 120 L 290 120 Z" fill="#F5A623" stroke="#d58512" stroke-width="2"/>
  <text x="315" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#495057">Parallelogram</text>
  
  <!-- Trapezoid -->
  <path d="M 80 170 L 140 170 L 160 220 L 60 220 Z" fill="#BD10E0" stroke="#9013fe" stroke-width="2"/>
  <text x="110" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#495057">Trapezoid</text>
  
  <!-- Rhombus -->
  <path d="M 240 195 L 270 170 L 300 195 L 270 220 Z" fill="#50E3C2" stroke="#00d4aa" stroke-width="2"/>
  <text x="270" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#495057">Rhombus</text>
  
  <!-- Note -->
  <text x="200" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#6c757d">
    All figures shown are quadrilaterals (4-sided shapes)
  </text>
</svg>`,

  // Grade 5 Rectangular Garden
  "rectangular_garden_5_2016": `
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect x="10" y="10" width="380" height="280" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1" rx="5"/>
  
  <!-- Title -->
  <text x="200" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#212529">
    Rectangular Garden
  </text>
  
  <!-- Garden Rectangle -->
  <rect x="100" y="80" width="200" height="120" fill="#7ED321" stroke="#5cb85c" stroke-width="3" opacity="0.7"/>
  
  <!-- Length label (top) -->
  <line x1="100" y1="65" x2="300" y2="65" stroke="#212529" stroke-width="2"/>
  <line x1="100" y1="60" x2="100" y2="70" stroke="#212529" stroke-width="2"/>
  <line x1="300" y1="60" x2="300" y2="70" stroke="#212529" stroke-width="2"/>
  <text x="200" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#212529">
    12 feet
  </text>
  
  <!-- Width label (right) -->
  <line x1="315" y1="80" x2="315" y2="200" stroke="#212529" stroke-width="2"/>
  <line x1="310" y1="80" x2="320" y2="80" stroke="#212529" stroke-width="2"/>
  <line x1="310" y1="200" x2="320" y2="200" stroke="#212529" stroke-width="2"/>
  <text x="335" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#212529">
    8 feet
  </text>
  
  <!-- Area formula -->
  <text x="200" y="235" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#495057">
    Area = length × width
  </text>
  <text x="200" y="255" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#495057">
    Area = 12 × 8 = 96 square feet
  </text>
  
  <!-- Garden details -->
  <circle cx="130" cy="110" r="3" fill="#F5A623"/>
  <circle cx="160" cy="130" r="3" fill="#F5A623"/>
  <circle cx="240" cy="120" r="3" fill="#F5A623"/>
  <circle cx="270" cy="160" r="3" fill="#F5A623"/>
  <text x="200" y="275" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#6c757d">
    ● = Plants in the garden
  </text>
</svg>`
};

/**
 * Get SVG for a specific question based on its characteristics
 */
export function getQuestionSVG(questionText: string, imageDescription?: string, grade?: number, year?: number): string {
  // Check for pre-generated SVGs first
  if (questionText.includes("quadrilaterals") && questionText.includes("figures")) {
    return AUTHENTIC_QUESTION_SVGS["quadrilaterals_4_2013"];
  }
  
  if (questionText.includes("rectangular garden") && questionText.includes("area")) {
    return AUTHENTIC_QUESTION_SVGS["rectangular_garden_5_2016"];
  }
  
  // For other questions with images, return a placeholder that indicates visual content
  if (imageDescription) {
    return generateFallbackSVG(questionText, imageDescription);
  }
  
  return "";
}