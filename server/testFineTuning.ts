/**
 * Test Fine-Tuning Implementation
 * 
 * This script demonstrates and tests the fine-tuning capabilities for STAAR questions
 */

import { initializeFineTunedModelTraining, createSTAARFineTuningJob, generateWithFineTunedSTAARModel, getFineTunedModelTrainer } from './fineTunedModelTrainer';

async function testFineTuningSystem() {
  console.log("🧪 Testing Fine-Tuned Language Model System...");
  
  try {
    // Initialize the fine-tuning system
    console.log("📚 Initializing fine-tuning system...");
    await initializeFineTunedModelTraining();
    
    // Get training statistics
    const trainer = getFineTunedModelTrainer();
    const stats = trainer.getTrainingStats();
    
    console.log("📊 Training Data Statistics:");
    console.log(`   Total Examples: ${stats.totalTrainingExamples}`);
    console.log(`   By Grade: ${JSON.stringify(stats.byGrade)}`);
    console.log(`   By Subject: ${JSON.stringify(stats.bySubject)}`);
    
    // Create a fine-tuning job for Grade 4 Math
    console.log("🚀 Creating fine-tuning job for Grade 4 Math...");
    const jobId = await createSTAARFineTuningJob({
      modelType: 'gpt-3.5-turbo',
      grade: 4,
      subject: 'math',
      epochs: 3
    });
    
    console.log(`✅ Fine-tuning job created: ${jobId}`);
    
    // Check job status
    const jobStatus = await trainer.getFineTuningJobStatus(jobId);
    console.log("📋 Job Status:", {
      id: jobStatus?.id,
      status: jobStatus?.status,
      model: jobStatus?.model,
      fineTunedModel: jobStatus?.fineTunedModel
    });
    
    // Test generation with fine-tuned model
    if (jobStatus?.fineTunedModel) {
      console.log("🎯 Testing question generation with fine-tuned model...");
      
      const question = await generateWithFineTunedSTAARModel(
        jobStatus.fineTunedModel,
        "Generate a word problem about multiplication",
        {
          grade: 4,
          subject: 'math',
          category: 'Number & Operations'
        }
      );
      
      console.log("✅ Generated Question:");
      console.log(`   Text: ${question.questionText}`);
      console.log(`   Choices: ${JSON.stringify(question.answerChoices)}`);
      console.log(`   Correct: ${question.correctAnswer}`);
      console.log(`   Confidence: ${(question.modelConfidence * 100).toFixed(1)}%`);
      console.log(`   Fine-tuned: ${question.fineTunedGenerated}`);
    }
    
    // List all jobs
    const allJobs = trainer.getAllFineTuningJobs();
    console.log(`📝 Total Fine-tuning Jobs: ${allJobs.length}`);
    
    console.log("✅ Fine-tuning system test completed successfully!");
    
  } catch (error) {
    console.error("❌ Error testing fine-tuning system:", error);
  }
}

export { testFineTuningSystem };