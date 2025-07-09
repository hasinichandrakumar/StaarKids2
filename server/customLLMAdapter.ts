/**
 * Custom LLM Adapter - Flexible integration for any LLM provider
 * Supports OpenAI, Anthropic, Hugging Face, local models, and custom APIs
 */

import { InsertQuestion } from "@shared/schema";

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'huggingface' | 'ollama' | 'custom';
  apiUrl?: string;
  apiKey?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

export interface LLMResponse {
  success: boolean;
  content?: string;
  error?: string;
  tokensUsed?: number;
  cost?: number;
}

export class CustomLLMAdapter {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  /**
   * Generate STAAR question using custom LLM
   */
  async generateQuestion(
    grade: number,
    subject: "math" | "reading",
    teksStandard: string,
    category?: string
  ): Promise<InsertQuestion | null> {
    try {
      const prompt = this.createSTAARPrompt(grade, subject, teksStandard, category);
      const response = await this.callLLM(prompt);
      
      if (!response.success || !response.content) {
        console.error('LLM generation failed:', response.error);
        return null;
      }

      return this.parseQuestionResponse(response.content, grade, subject, teksStandard, category);
    } catch (error) {
      console.error('Custom LLM error:', error);
      return null;
    }
  }

  /**
   * Call the configured LLM provider
   */
  private async callLLM(prompt: string): Promise<LLMResponse> {
    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(prompt);
      case 'anthropic':
        return this.callAnthropic(prompt);
      case 'huggingface':
        return this.callHuggingFace(prompt);
      case 'ollama':
        return this.callOllama(prompt);
      case 'custom':
        return this.callCustomAPI(prompt);
      default:
        throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
  }

  /**
   * OpenAI API integration
   */
  private async callOpenAI(prompt: string): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      return { success: false, error: 'OpenAI API key required' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model || 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: this.config.maxTokens || 1200,
          temperature: this.config.temperature || 0.7,
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'OpenAI API error' };
      }

      return {
        success: true,
        content: data.choices[0].message.content,
        tokensUsed: data.usage?.total_tokens,
        cost: this.calculateOpenAICost(data.usage?.total_tokens || 0)
      };
    } catch (error) {
      return { success: false, error: `OpenAI request failed: ${error}` };
    }
  }

  /**
   * Anthropic Claude API integration
   */
  private async callAnthropic(prompt: string): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      return { success: false, error: 'Anthropic API key required' };
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model || 'claude-3-sonnet-20240229',
          max_tokens: this.config.maxTokens || 1200,
          temperature: this.config.temperature || 0.7,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || 'Anthropic API error' };
      }

      return {
        success: true,
        content: data.content[0].text,
        tokensUsed: data.usage?.output_tokens,
        cost: this.calculateAnthropicCost(data.usage?.output_tokens || 0)
      };
    } catch (error) {
      return { success: false, error: `Anthropic request failed: ${error}` };
    }
  }

  /**
   * Hugging Face API integration
   */
  private async callHuggingFace(prompt: string): Promise<LLMResponse> {
    if (!this.config.apiKey) {
      return { success: false, error: 'Hugging Face API key required' };
    }

    try {
      const response = await fetch(
        this.config.apiUrl || `https://api-inference.huggingface.co/models/${this.config.model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: this.config.maxTokens || 1200,
              temperature: this.config.temperature || 0.7,
              return_full_text: false
            }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Hugging Face API error' };
      }

      return {
        success: true,
        content: data[0]?.generated_text || data.generated_text,
        tokensUsed: data.details?.tokens?.length,
        cost: 0 // Often free for inference API
      };
    } catch (error) {
      return { success: false, error: `Hugging Face request failed: ${error}` };
    }
  }

  /**
   * Ollama local model integration
   */
  private async callOllama(prompt: string): Promise<LLMResponse> {
    try {
      const response = await fetch(
        this.config.apiUrl || 'http://localhost:11434/api/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.config.model,
            prompt: prompt,
            stream: false,
            options: {
              temperature: this.config.temperature || 0.7,
              num_predict: this.config.maxTokens || 1200
            }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Ollama API error' };
      }

      return {
        success: true,
        content: data.response,
        tokensUsed: data.eval_count,
        cost: 0 // Local models are free
      };
    } catch (error) {
      return { success: false, error: `Ollama request failed: ${error}` };
    }
  }

  /**
   * Custom API integration
   */
  private async callCustomAPI(prompt: string): Promise<LLMResponse> {
    if (!this.config.apiUrl) {
      return { success: false, error: 'Custom API URL required' };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: prompt,
          model: this.config.model,
          max_tokens: this.config.maxTokens || 1200,
          temperature: this.config.temperature || 0.7
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error || 'Custom API error' };
      }

      return {
        success: true,
        content: data.response || data.content || data.text,
        tokensUsed: data.tokens_used,
        cost: data.cost || 0
      };
    } catch (error) {
      return { success: false, error: `Custom API request failed: ${error}` };
    }
  }

  /**
   * Create STAAR-specific prompt for any LLM
   */
  private createSTAARPrompt(
    grade: number,
    subject: "math" | "reading",
    teksStandard: string,
    category?: string
  ): string {
    return `Create an authentic STAAR ${subject} question for grade ${grade} students.

Requirements:
- Follow Texas TEKS standard: ${teksStandard}
- Category: ${category || (subject === "math" ? "Problem Solving" : "Comprehension")}
- Use authentic STAAR format and difficulty
- Include 4 multiple choice options (A, B, C, D)
- Provide clear explanation for correct answer
- Ensure mathematical accuracy for math questions

Respond with JSON format:
{
  "questionText": "The question text",
  "answerChoices": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
  "correctAnswer": "A",
  "explanation": "Detailed explanation of why the answer is correct",
  "hasImage": false,
  "imageDescription": null
}`;
  }

  /**
   * Parse LLM response into question format
   */
  private parseQuestionResponse(
    content: string,
    grade: number,
    subject: "math" | "reading",
    teksStandard: string,
    category?: string
  ): InsertQuestion | null {
    try {
      const parsed = JSON.parse(content);
      
      return {
        grade,
        subject,
        teksStandard,
        questionText: parsed.questionText,
        answerChoices: parsed.answerChoices,
        correctAnswer: parsed.correctAnswer,
        explanation: parsed.explanation,
        category: category || (subject === "math" ? "Problem Solving" : "Comprehension"),
        difficulty: "medium",
        isFromRealSTAAR: false,
        year: new Date().getFullYear(),
        hasImage: parsed.hasImage || false,
        imageDescription: parsed.imageDescription
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return null;
    }
  }

  /**
   * Calculate cost estimates
   */
  private calculateOpenAICost(tokens: number): number {
    // GPT-4 pricing (approximate)
    return (tokens / 1000) * 0.03;
  }

  private calculateAnthropicCost(tokens: number): number {
    // Claude pricing (approximate)
    return (tokens / 1000) * 0.015;
  }
}

/**
 * Factory function to create LLM adapter based on environment
 */
export function createLLMAdapter(): CustomLLMAdapter {
  // Check environment variables for LLM configuration
  const provider = (process.env.LLM_PROVIDER as any) || 'openai';
  
  const config: LLMConfig = {
    provider,
    apiKey: process.env.LLM_API_KEY || process.env.OPENAI_API_KEY,
    apiUrl: process.env.LLM_API_URL,
    model: process.env.LLM_MODEL || getDefaultModel(provider),
    maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1200'),
    temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7')
  };

  return new CustomLLMAdapter(config);
}

function getDefaultModel(provider: string): string {
  switch (provider) {
    case 'openai': return 'gpt-4';
    case 'anthropic': return 'claude-3-sonnet-20240229';
    case 'huggingface': return 'microsoft/DialoGPT-large';
    case 'ollama': return 'llama2';
    default: return 'gpt-4';
  }
}