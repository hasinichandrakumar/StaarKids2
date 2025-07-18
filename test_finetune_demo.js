/**
 * Fine-Tuning Demo Test
 * Tests the fine-tuning system with direct function calls
 */

async function testFineTuning() {
  console.log("🧪 Testing Fine-Tuned Language Model System...");
  
  try {
    // Import the fine-tuning modules
    const { initializeFineTunedModelTraining, createSTAARFineTuningJob, getFineTunedModelTrainer } = await import('./server/fineTunedModelTrainer.ts');
    
    // Initialize the system
    console.log("📚 Initializing fine-tuning system...");
    await initializeFineTunedModelTraining();
    
    // Get training statistics
    const trainer = getFineTunedModelTrainer();
    const stats = trainer.getTrainingStats();
    
    console.log("📊 Fine-Tuning Training Statistics:");
    console.log(`   Total Training Examples: ${stats.totalTrainingExamples}`);
    console.log(`   By Grade: ${JSON.stringify(stats.byGrade)}`);
    console.log(`   By Subject: ${JSON.stringify(stats.bySubject)}`);
    console.log(`   Active Jobs: ${stats.activeJobs}`);
    console.log(`   Completed Jobs: ${stats.completedJobs}`);
    
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
    console.log("📋 Job Status:");
    console.log(`   ID: ${jobStatus?.id}`);
    console.log(`   Status: ${jobStatus?.status}`);
    console.log(`   Model: ${jobStatus?.model}`);
    console.log(`   Fine-tuned Model: ${jobStatus?.fineTunedModel || 'In progress...'}`);
    console.log(`   Hyperparameters: ${JSON.stringify(jobStatus?.hyperparameters)}`);
    
    if (jobStatus?.metrics) {
      console.log(`   Training Loss: ${jobStatus.metrics.trainLoss}`);
      console.log(`   Validation Loss: ${jobStatus.metrics.validLoss}`);
      console.log(`   Accuracy: ${(jobStatus.metrics.accuracy * 100).toFixed(1)}%`);
    }
    
    // Test enhanced generation
    if (jobStatus?.fineTunedModel) {
      console.log("🎯 Testing question generation with fine-tuned model...");
      
      const { generateWithFineTunedSTAARModel } = await import('./server/fineTunedModelTrainer.ts');
      const question = await generateWithFineTunedSTAARModel(
        jobStatus.fineTunedModel,
        "Generate a multiplication word problem",
        {
          grade: 4,
          subject: 'math',
          category: 'Number & Operations'
        }
      );
      
      console.log("✅ Generated Question with Fine-Tuned Model:");
      console.log(`   Question: ${question.questionText}`);
      console.log(`   Choices: ${JSON.stringify(question.answerChoices)}`);
      console.log(`   Correct Answer: ${question.correctAnswer}`);
      console.log(`   Explanation: ${question.explanation}`);
      console.log(`   Model Confidence: ${(question.modelConfidence * 100).toFixed(1)}%`);
      console.log(`   Fine-tuned Generated: ${question.fineTunedGenerated}`);
      
      if (question.trainingPatterns) {
        console.log(`   Training Patterns Used: ${question.trainingPatterns}`);
      }
    }
    
    // List all jobs
    const allJobs = trainer.getAllFineTuningJobs();
    console.log(`📝 Total Fine-tuning Jobs Created: ${allJobs.length}`);
    
    allJobs.forEach((job, index) => {
      console.log(`   Job ${index + 1}: ${job.id} - ${job.status} (${job.model})`);
    });
    
    console.log("✅ Fine-tuning system test completed successfully!");
    console.log("🎯 System ready for authentic STAAR question generation using fine-tuned models");
    
    return {
      success: true,
      stats,
      jobsCreated: allJobs.length,
      systemReady: true
    };
    
  } catch (error) {
    console.error("❌ Error testing fine-tuning system:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testFineTuning().then(result => {
  console.log("🏁 Test Result:", result);
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error("💥 Test failed:", error);
  process.exit(1);
});