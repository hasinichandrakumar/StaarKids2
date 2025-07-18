/**
 * Model Manager for Grade and Subject-Specific Fine-Tuned Models
 * 
 * Manages separate fine-tuned models for each grade-subject combination:
 * - Grade 3 Math, Grade 3 Reading
 * - Grade 4 Math, Grade 4 Reading  
 * - Grade 5 Math, Grade 5 Reading
 */

import { getFineTunedModelTrainer, createSTAARFineTuningJob } from './fineTunedModelTrainer';

interface ModelRegistry {
  grade: number;
  subject: 'math' | 'reading';
  modelId: string | null;
  jobId: string | null;
  status: 'pending' | 'training' | 'ready' | 'failed';
  accuracy?: number;
  createdAt: number;
  lastUpdated: number;
}

export class ModelManager {
  private models: Map<string, ModelRegistry> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeModelRegistry();
  }

  /**
   * Initialize model registry for all grade-subject combinations
   */
  private initializeModelRegistry(): void {
    const grades = [3, 4, 5];
    const subjects: ('math' | 'reading')[] = ['math', 'reading'];

    for (const grade of grades) {
      for (const subject of subjects) {
        const key = this.getModelKey(grade, subject);
        this.models.set(key, {
          grade,
          subject,
          modelId: null,
          jobId: null,
          status: 'pending',
          createdAt: Date.now(),
          lastUpdated: Date.now()
        });
      }
    }

    console.log(`📚 Initialized model registry for ${this.models.size} grade-subject combinations`);
  }

  /**
   * Create model key for grade-subject combination
   */
  private getModelKey(grade: number, subject: 'math' | 'reading'): string {
    return `grade_${grade}_${subject}`;
  }

  /**
   * Create fine-tuned models for all grade-subject combinations
   */
  async createAllModels(): Promise<void> {
    console.log("🚀 Creating fine-tuned models for all grade-subject combinations...");
    
    const createPromises: Promise<void>[] = [];

    for (const [key, model] of this.models) {
      if (model.status === 'pending') {
        createPromises.push(this.createSingleModel(model.grade, model.subject));
      }
    }

    try {
      await Promise.all(createPromises);
      console.log(`✅ All ${createPromises.length} fine-tuning jobs initiated`);
    } catch (error) {
      console.log("⚠️ Some models may still be initializing");
    }
  }

  /**
   * Create a single fine-tuned model for specific grade and subject
   */
  private async createSingleModel(grade: number, subject: 'math' | 'reading'): Promise<void> {
    const key = this.getModelKey(grade, subject);
    const model = this.models.get(key);
    
    if (!model) return;

    try {
      console.log(`🎯 Creating fine-tuned model for Grade ${grade} ${subject}...`);
      
      const jobId = await createSTAARFineTuningJob({
        modelType: 'gpt-3.5-turbo',
        grade,
        subject,
        epochs: 3
      });

      // Update model registry
      model.jobId = jobId;
      model.status = 'training';
      model.lastUpdated = Date.now();
      
      console.log(`📝 Fine-tuning job created for Grade ${grade} ${subject}: ${jobId}`);
      
      // Check for completion (in development, jobs complete immediately)
      setTimeout(() => this.checkModelStatus(grade, subject), 2000);
      
    } catch (error) {
      console.log(`❌ Failed to create model for Grade ${grade} ${subject}`);
      model.status = 'failed';
      model.lastUpdated = Date.now();
    }
  }

  /**
   * Check status of a specific model
   */
  async checkModelStatus(grade: number, subject: 'math' | 'reading'): Promise<void> {
    const key = this.getModelKey(grade, subject);
    const model = this.models.get(key);
    
    if (!model || !model.jobId) return;

    try {
      const trainer = getFineTunedModelTrainer();
      const jobStatus = await trainer.getFineTuningJobStatus(model.jobId);
      
      if (jobStatus) {
        if (jobStatus.status === 'succeeded' && jobStatus.fineTunedModel) {
          model.modelId = jobStatus.fineTunedModel;
          model.status = 'ready';
          model.accuracy = jobStatus.metrics?.accuracy;
          model.lastUpdated = Date.now();
          
          console.log(`✅ Model ready: Grade ${grade} ${subject} - ${model.modelId}`);
          console.log(`   Accuracy: ${model.accuracy ? (model.accuracy * 100).toFixed(1) : 'N/A'}%`);
        } else if (jobStatus.status === 'failed') {
          model.status = 'failed';
          model.lastUpdated = Date.now();
          console.log(`❌ Model training failed: Grade ${grade} ${subject}`);
        }
      }
    } catch (error) {
      console.log(`⚠️ Could not check status for Grade ${grade} ${subject}`);
    }
  }

  /**
   * Get the best available model for a grade-subject combination
   */
  getModelForGradeSubject(grade: number, subject: 'math' | 'reading'): string | null {
    const key = this.getModelKey(grade, subject);
    const model = this.models.get(key);
    
    if (model?.status === 'ready' && model.modelId) {
      return model.modelId;
    }
    
    return null;
  }

  /**
   * Check if a model is ready for a grade-subject combination
   */
  isModelReady(grade: number, subject: 'math' | 'reading'): boolean {
    const key = this.getModelKey(grade, subject);
    const model = this.models.get(key);
    return model?.status === 'ready' && !!model.modelId;
  }

  /**
   * Get comprehensive status of all models
   */
  getAllModelStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [key, model] of this.models) {
      status[key] = {
        grade: model.grade,
        subject: model.subject,
        status: model.status,
        modelId: model.modelId,
        jobId: model.jobId,
        accuracy: model.accuracy ? (model.accuracy * 100).toFixed(1) + '%' : 'N/A',
        ready: model.status === 'ready',
        lastUpdated: new Date(model.lastUpdated).toISOString()
      };
    }
    
    return status;
  }

  /**
   * Generate question using the appropriate model for grade and subject
   */
  async generateWithSpecificModel(
    grade: number, 
    subject: 'math' | 'reading', 
    prompt: string,
    options: any = {}
  ): Promise<any> {
    const modelId = this.getModelForGradeSubject(grade, subject);
    
    if (modelId) {
      console.log(`🎯 Using fine-tuned model for Grade ${grade} ${subject}: ${modelId}`);
      
      try {
        const { generateWithFineTunedSTAARModel } = await import('./fineTunedModelTrainer');
        return await generateWithFineTunedSTAARModel(modelId, prompt, {
          grade,
          subject,
          category: options.category || 'General'
        });
      } catch (error) {
        console.log(`⚠️ Fine-tuned model unavailable, using neural generation`);
      }
    }
    
    // Fallback to neural generation
    try {
      const { generateNeuralQuestion } = await import('./neuralQuestionGenerator');
      return await generateNeuralQuestion({
        grade,
        subject,
        category: options.category,
        visualComplexity: options.visualComplexity || 'medium',
        authenticityLevel: 0.9
      });
    } catch (error) {
      console.log(`⚠️ Neural generation unavailable, using enhanced generation`);
      
      // Final fallback to enhanced generation
      const { generateAuthenticPatternQuestions } = await import('./workingQuestionGenerator');
      const questions = await generateAuthenticPatternQuestions(grade, subject, 1, options);
      return questions[0];
    }
  }

  /**
   * Get training statistics for all models
   */
  getTrainingStatistics(): any {
    const stats = {
      totalModels: this.models.size,
      byStatus: {
        pending: 0,
        training: 0,
        ready: 0,
        failed: 0
      },
      byGrade: {} as Record<number, number>,
      bySubject: {} as Record<string, number>,
      readyModels: [] as string[],
      averageAccuracy: 0
    };

    let totalAccuracy = 0;
    let accuracyCount = 0;

    for (const [key, model] of this.models) {
      stats.byStatus[model.status]++;
      
      stats.byGrade[model.grade] = (stats.byGrade[model.grade] || 0) + 1;
      stats.bySubject[model.subject] = (stats.bySubject[model.subject] || 0) + 1;
      
      if (model.status === 'ready') {
        stats.readyModels.push(key);
        
        if (model.accuracy) {
          totalAccuracy += model.accuracy;
          accuracyCount++;
        }
      }
    }

    if (accuracyCount > 0) {
      stats.averageAccuracy = totalAccuracy / accuracyCount;
    }

    return stats;
  }

  /**
   * Initialize all models (create if needed)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log("🤖 Initializing Model Manager for all grade-subject combinations...");
    
    // Create all models
    await this.createAllModels();
    
    // Check status of all models periodically
    setInterval(() => {
      for (const [key, model] of this.models) {
        if (model.status === 'training') {
          this.checkModelStatus(model.grade, model.subject);
        }
      }
    }, 10000); // Check every 10 seconds

    this.isInitialized = true;
    console.log("✅ Model Manager initialized successfully");
  }
}

// Global instance
let modelManager: ModelManager | null = null;

export async function initializeModelManager(): Promise<void> {
  if (!modelManager) {
    modelManager = new ModelManager();
    await modelManager.initialize();
  }
}

export function getModelManager(): ModelManager {
  if (!modelManager) {
    throw new Error("Model Manager not initialized");
  }
  return modelManager;
}

export async function generateQuestionWithBestModel(
  grade: number,
  subject: 'math' | 'reading',
  prompt: string,
  options: any = {}
): Promise<any> {
  const manager = getModelManager();
  return manager.generateWithSpecificModel(grade, subject, prompt, options);
}