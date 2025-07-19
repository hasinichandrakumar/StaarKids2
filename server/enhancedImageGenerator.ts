/**
 * ENHANCED IMAGE GENERATOR using OpenAI Image API
 * Generates visual content for ALL practice questions
 * Works alongside authentic STAAR images for complete visual support
 */

import OpenAI from 'openai';
import { InsertQuestion } from '@shared/schema';

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. Do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ImageGenerationRequest {
  questionText: string;
  subject: 'math' | 'reading';
  grade: number;
  category: string;
  teksStandard?: string;
  style: 'educational' | 'staar-authentic' | 'diagram' | 'illustration';
}

interface GeneratedImage {
  url: string;
  description: string;
  type: 'diagram' | 'chart' | 'graph' | 'illustration' | 'map' | 'photo';
  prompt: string;
  style: string;
  isAIGenerated: true;
}

/**
 * Generate images for practice questions using OpenAI Image API
 */
export class EnhancedImageGenerator {
  
  /**
   * Generate an image for a math question
   */
  async generateMathImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    const prompt = this.createMathImagePrompt(request);
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      return {
        url: response.data[0].url,
        description: this.extractDescriptionFromPrompt(prompt),
        type: this.determineMathImageType(request.category),
        prompt,
        style: request.style,
        isAIGenerated: true
      };
    } catch (error) {
      console.error('Error generating math image:', error);
      throw new Error(`Failed to generate math image: ${error.message}`);
    }
  }

  /**
   * Generate an image for a reading question
   */
  async generateReadingImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    const prompt = this.createReadingImagePrompt(request);
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      return {
        url: response.data[0].url,
        description: this.extractDescriptionFromPrompt(prompt),
        type: this.determineReadingImageType(request.category),
        prompt,
        style: request.style,
        isAIGenerated: true
      };
    } catch (error) {
      console.error('Error generating reading image:', error);
      throw new Error(`Failed to generate reading image: ${error.message}`);
    }
  }

  /**
   * Create optimized prompt for math questions
   */
  private createMathImagePrompt(request: ImageGenerationRequest): string {
    const baseStyle = "Clean educational diagram style, similar to standardized test materials, simple and clear";
    const gradeAppropriate = `appropriate for grade ${request.grade} students`;
    
    let specificPrompt = "";
    
    // Category-specific prompts
    switch (request.category.toLowerCase()) {
      case 'geometry':
      case 'geometry and measurement':
        specificPrompt = `Geometric shapes and figures diagram: ${request.questionText}. Show clear shapes with labels and measurements where appropriate.`;
        break;
        
      case 'fractions':
      case 'number and operations':
        specificPrompt = `Mathematical diagram showing fractions or number operations: ${request.questionText}. Use circles, rectangles, or number lines to visualize the concept.`;
        break;
        
      case 'data analysis':
      case 'data and probability':
        specificPrompt = `Clean bar chart, line graph, or data visualization: ${request.questionText}. Educational style with clear labels and easy-to-read formatting.`;
        break;
        
      case 'measurement':
        specificPrompt = `Measurement diagram: ${request.questionText}. Show rulers, clocks, or measurement tools with clear markings.`;
        break;
        
      case 'algebra':
      case 'algebraic reasoning':
        specificPrompt = `Pattern or algebraic concept visualization: ${request.questionText}. Use tables, grids, or visual patterns.`;
        break;
        
      default:
        specificPrompt = `Educational math diagram: ${request.questionText}. Clear visual representation of the mathematical concept.`;
    }
    
    return `${specificPrompt} ${baseStyle}, ${gradeAppropriate}, white background, high contrast, suitable for standardized testing environment`;
  }

  /**
   * Create optimized prompt for reading questions
   */
  private createReadingImagePrompt(request: ImageGenerationRequest): string {
    const baseStyle = "Educational illustration style, suitable for standardized reading assessments";
    const gradeAppropriate = `appropriate for grade ${request.grade} students`;
    
    let specificPrompt = "";
    
    // Category-specific prompts for reading
    switch (request.category.toLowerCase()) {
      case 'literary elements':
      case 'story elements':
        specificPrompt = `Story illustration supporting the reading passage: characters, setting, or plot elements from ${request.questionText}`;
        break;
        
      case 'informational text':
      case 'expository':
        specificPrompt = `Educational diagram or illustration supporting informational text: ${request.questionText}. Scientific or factual visual.`;
        break;
        
      case 'poetry':
      case 'literary devices':
        specificPrompt = `Artistic but educational illustration representing poetic or literary concepts from ${request.questionText}`;
        break;
        
      case 'vocabulary':
        specificPrompt = `Visual vocabulary support: illustration showing the meaning or context of words from ${request.questionText}`;
        break;
        
      default:
        specificPrompt = `Reading comprehension support illustration: visual representation of concepts from ${request.questionText}`;
    }
    
    return `${specificPrompt}. ${baseStyle}, ${gradeAppropriate}, clean and professional, suitable for educational testing`;
  }

  /**
   * Determine image type for math questions
   */
  private determineMathImageType(category: string): 'diagram' | 'chart' | 'graph' | 'illustration' {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('data') || categoryLower.includes('probability')) {
      return 'chart';
    } else if (categoryLower.includes('graph') || categoryLower.includes('coordinate')) {
      return 'graph';
    } else if (categoryLower.includes('geometry') || categoryLower.includes('measurement')) {
      return 'diagram';
    } else {
      return 'illustration';
    }
  }

  /**
   * Determine image type for reading questions
   */
  private determineReadingImageType(category: string): 'illustration' | 'diagram' | 'map' | 'photo' {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('informational') || categoryLower.includes('expository')) {
      return 'diagram';
    } else if (categoryLower.includes('geography') || categoryLower.includes('social studies')) {
      return 'map';
    } else {
      return 'illustration';
    }
  }

  /**
   * Extract description from the generated prompt
   */
  private extractDescriptionFromPrompt(prompt: string): string {
    // Extract the main concept from the prompt
    const firstSentence = prompt.split('.')[0];
    return firstSentence.replace(/^(Clean |Educational |Mathematical |Story )/, '').trim();
  }

  /**
   * Generate image for any practice question automatically
   */
  async generateImageForQuestion(question: InsertQuestion): Promise<GeneratedImage | null> {
    try {
      const request: ImageGenerationRequest = {
        questionText: question.questionText,
        subject: question.subject,
        grade: question.grade,
        category: question.category,
        teksStandard: question.teksStandard,
        style: 'educational'
      };

      if (question.subject === 'math') {
        return await this.generateMathImage(request);
      } else if (question.subject === 'reading') {
        return await this.generateReadingImage(request);
      }

      return null;
    } catch (error) {
      console.error(`Error generating image for question ${question.id}:`, error);
      return null;
    }
  }

  /**
   * Batch generate images for multiple questions
   */
  async generateImagesForQuestions(questions: InsertQuestion[]): Promise<Map<string, GeneratedImage>> {
    const results = new Map<string, GeneratedImage>();
    
    // Process questions in batches to respect API rate limits
    const batchSize = 3;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (question) => {
        const image = await this.generateImageForQuestion(question);
        if (image) {
          results.set(question.id, image);
        }
        return { questionId: question.id, image };
      });

      try {
        await Promise.all(batchPromises);
        
        // Small delay between batches to respect rate limits
        if (i + batchSize < questions.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error in batch ${Math.floor(i / batchSize) + 1}:`, error);
      }
    }
    
    return results;
  }

  /**
   * Check if a question should have an image generated
   */
  shouldGenerateImage(question: InsertQuestion): boolean {
    // Always generate images for math questions
    if (question.subject === 'math') return true;
    
    // Generate images for specific reading categories
    if (question.subject === 'reading') {
      const visualReadingCategories = [
        'informational text',
        'story elements',
        'literary elements',
        'vocabulary',
        'expository'
      ];
      
      return visualReadingCategories.some(category => 
        question.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    return false;
  }

  /**
   * Get image generation statistics
   */
  getGenerationStats() {
    return {
      supportedSubjects: ['math', 'reading'],
      supportedImageTypes: ['diagram', 'chart', 'graph', 'illustration', 'map'],
      maxImageSize: '1024x1024',
      model: 'dall-e-3',
      rateLimit: '3 images per batch',
      qualityLevel: 'standard'
    };
  }
}

// Export singleton instance
export const imageGenerator = new EnhancedImageGenerator();