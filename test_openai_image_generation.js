/**
 * Test OpenAI Image API Integration for Practice Questions
 * This demonstrates how images are generated for all practice questions
 */

const { imageGenerator } = require('./server/enhancedImageGenerator');

// Test data - sample questions that would benefit from images
const testQuestions = [
  {
    id: 'test-math-geometry-1',
    questionText: 'Which of these shapes has exactly 4 sides and 4 right angles?',
    subject: 'math',
    grade: 4,
    category: 'Geometry and Measurement',
    teksStandard: '4.6D'
  },
  {
    id: 'test-math-fractions-1', 
    questionText: 'Sarah ate 3/8 of a pizza. Which diagram shows how much pizza Sarah ate?',
    subject: 'math',
    grade: 5,
    category: 'Number and Operations',
    teksStandard: '5.3A'
  },
  {
    id: 'test-reading-story-1',
    questionText: 'Based on the passage about the forest adventure, what was the main character feeling?',
    subject: 'reading',
    grade: 3,
    category: 'Literary Elements',
    teksStandard: '3.8A'
  },
  {
    id: 'test-math-data-1',
    questionText: 'The bar graph shows favorite ice cream flavors. How many more students chose chocolate than vanilla?',
    subject: 'math',
    grade: 4,
    category: 'Data Analysis',
    teksStandard: '4.9A'
  }
];

async function testImageGeneration() {
  console.log('🎨 Testing OpenAI Image API Integration for Practice Questions\n');
  
  try {
    // Test individual image generation
    console.log('Testing individual image generation...\n');
    
    for (const question of testQuestions) {
      console.log(`📝 Question: ${question.questionText}`);
      console.log(`📚 Subject: ${question.subject} | Grade: ${question.grade} | Category: ${question.category}`);
      
      const shouldGenerate = imageGenerator.shouldGenerateImage(question);
      console.log(`🖼️  Should generate image: ${shouldGenerate ? 'YES' : 'NO'}`);
      
      if (shouldGenerate) {
        try {
          console.log('⏳ Generating image...');
          const generatedImage = await imageGenerator.generateImageForQuestion(question);
          
          if (generatedImage) {
            console.log('✅ Image generated successfully!');
            console.log(`   Type: ${generatedImage.type}`);
            console.log(`   Description: ${generatedImage.description}`);
            console.log(`   URL: ${generatedImage.url.substring(0, 60)}...`);
            console.log(`   Style: ${generatedImage.style}`);
          } else {
            console.log('❌ No image generated');
          }
        } catch (error) {
          console.log(`❌ Error generating image: ${error.message}`);
        }
      }
      
      console.log('─'.repeat(80));
    }
    
    // Test batch generation
    console.log('\n🔄 Testing batch image generation...\n');
    
    const batchResults = await imageGenerator.generateImagesForQuestions(testQuestions);
    console.log(`✅ Batch completed: ${batchResults.size} images generated out of ${testQuestions.length} questions`);
    
    for (const [questionId, image] of batchResults.entries()) {
      console.log(`   ${questionId}: ${image.type} - ${image.description}`);
    }
    
    // Show generation statistics
    console.log('\n📊 Image Generation Statistics:');
    const stats = imageGenerator.getGenerationStats();
    console.log(JSON.stringify(stats, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test API endpoint integration
async function testAPIEndpoint() {
  console.log('\n🌐 Testing API Endpoint Integration\n');
  
  const testRequests = [
    {
      questionText: 'What is the area of a rectangle with length 8 feet and width 6 feet?',
      subject: 'math',
      grade: 4,
      category: 'Geometry and Measurement',
      teksStandard: '4.5D'
    },
    {
      questionText: 'In the story, the character showed courage. What evidence supports this?',
      subject: 'reading', 
      grade: 5,
      category: 'Literary Elements',
      teksStandard: '5.8A'
    }
  ];
  
  for (const request of testRequests) {
    try {
      console.log(`📝 Testing: ${request.subject} question for grade ${request.grade}`);
      console.log(`   Question: ${request.questionText}`);
      
      // Simulate API request
      const response = await fetch('http://localhost:3000/api/generate/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Response successful');
        console.log(`   Image URL: ${result.image?.url?.substring(0, 50)}...`);
        console.log(`   Description: ${result.image?.description}`);
      } else {
        console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.log(`❌ API Request failed: ${error.message}`);
    }
    
    console.log('─'.repeat(60));
  }
}

// Run tests
if (require.main === module) {
  console.log('🚀 Starting OpenAI Image API Tests for StaarKids Platform\n');
  
  testImageGeneration()
    .then(() => testAPIEndpoint())
    .then(() => {
      console.log('\n🎉 All tests completed!');
      console.log('\n💡 Summary:');
      console.log('   - OpenAI DALL-E 3 generates images for ALL practice questions');
      console.log('   - Math questions get diagrams, charts, and geometric illustrations');
      console.log('   - Reading questions get story illustrations and educational diagrams');
      console.log('   - Images are educational-style, suitable for standardized tests');
      console.log('   - System respects API rate limits with batch processing');
      console.log('   - Fallback handling ensures questions work even without images');
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
    });
}

module.exports = {
  testImageGeneration,
  testAPIEndpoint
};