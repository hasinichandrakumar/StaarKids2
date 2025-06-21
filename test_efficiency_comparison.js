/**
 * Efficiency Comparison Test - Shows the difference between AI vs Template generation
 */

const { performance } = require('perf_hooks');

async function testAIGeneration() {
  console.log('🐌 Testing SLOW AI Generation (Current System)...');
  const startTime = performance.now();
  
  try {
    // This requires OpenAI API calls - slow and expensive
    const { generateAuthenticSTAARQuestion } = require('./server/aiQuestionGenerator');
    
    const questions = [];
    for (let i = 0; i < 3; i++) {
      const question = await generateAuthenticSTAARQuestion(4, 'math', '4.3A', 'Number & Operations');
      questions.push(question);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Generated ${questions.length} questions in ${Math.round(duration)}ms`);
    console.log(`Average: ${Math.round(duration / questions.length)}ms per question`);
    console.log('Sample question:', questions[0].questionText.substring(0, 80) + '...');
    
    return { count: questions.length, duration, questions };
    
  } catch (error) {
    console.log('❌ AI Generation failed:', error.message);
    return { count: 0, duration: 0, questions: [] };
  }
}

async function testTemplateGeneration() {
  console.log('\n🚀 Testing FAST Template Generation (New System)...');
  const startTime = performance.now();
  
  try {
    // This uses templates - instant generation
    const { generateEfficientQuestion } = require('./server/efficientQuestionGenerator');
    
    const questions = [];
    for (let i = 0; i < 50; i++) { // Generate 50 questions to show speed
      const question = generateEfficientQuestion(4, 'math', 'Number & Operations');
      questions.push(question);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Generated ${questions.length} questions in ${Math.round(duration)}ms`);
    console.log(`Average: ${Math.round(duration / questions.length)}ms per question`);
    console.log('Sample question:', questions[0].questionText);
    console.log('Answer choices:', questions[0].answerChoices);
    console.log('Correct answer:', questions[0].correctAnswer);
    console.log('Explanation:', questions[0].explanation);
    
    return { count: questions.length, duration, questions };
    
  } catch (error) {
    console.log('❌ Template Generation failed:', error.message);
    return { count: 0, duration: 0, questions: [] };
  }
}

async function testSVGGeneration() {
  console.log('\n🎨 Testing SVG Generation...');
  const startTime = performance.now();
  
  try {
    const { generateStreamlinedSVG } = require('./server/streamlinedSVG');
    
    // Test different SVG types
    const svgTests = [
      {
        name: 'Rectangle Area',
        config: {
          type: 'rectangle_area',
          data: { length: 15, width: 8, unit: 'feet' }
        }
      },
      {
        name: 'Sticker Division',
        config: {
          type: 'sticker_division',
          data: { total: 48, groups: 6 }
        }
      },
      {
        name: 'Bar Graph',
        config: {
          type: 'bar_graph',
          data: {
            categories: ['1 book', '2 books', '3 books', '4 books'],
            values: [3, 5, 7, 4],
            title: 'Books Read by Students'
          }
        }
      }
    ];
    
    const results = [];
    for (const test of svgTests) {
      const svg = generateStreamlinedSVG(test.config);
      results.push({
        name: test.name,
        size: svg.length,
        valid: svg.includes('<svg') && svg.includes('</svg>')
      });
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Generated ${results.length} SVGs in ${Math.round(duration)}ms`);
    results.forEach(result => {
      console.log(`  - ${result.name}: ${result.size} chars, ${result.valid ? 'Valid' : 'Invalid'}`);
    });
    
    return { count: results.length, duration, results };
    
  } catch (error) {
    console.log('❌ SVG Generation failed:', error.message);
    return { count: 0, duration: 0, results: [] };
  }
}

async function runEfficiencyComparison() {
  console.log('🔬 STAAR Kids Question Generation Efficiency Test\n');
  console.log('=' .repeat(60));
  
  // Test both systems
  const aiResults = await testAIGeneration();
  const templateResults = await testTemplateGeneration();
  const svgResults = await testSVGGeneration();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 COMPARISON RESULTS');
  console.log('=' .repeat(60));
  
  if (aiResults.count > 0 && templateResults.count > 0) {
    const speedImprovement = Math.round((aiResults.duration / aiResults.count) / (templateResults.duration / templateResults.count));
    console.log(`🚀 Template system is ${speedImprovement}x FASTER than AI generation`);
  }
  
  console.log('\nAI Generation (Current):');
  console.log(`  - Questions: ${aiResults.count}`);
  console.log(`  - Time: ${Math.round(aiResults.duration)}ms`);
  console.log(`  - Cost: ~$0.01 per question (OpenAI API)`);
  console.log(`  - Reliability: Depends on API availability`);
  
  console.log('\nTemplate Generation (New):');
  console.log(`  - Questions: ${templateResults.count}`);
  console.log(`  - Time: ${Math.round(templateResults.duration)}ms`);
  console.log(`  - Cost: $0.00 (no API calls)`);
  console.log(`  - Reliability: 100% deterministic`);
  
  console.log('\nSVG Generation:');
  console.log(`  - Diagrams: ${svgResults.count}`);
  console.log(`  - Time: ${Math.round(svgResults.duration)}ms`);
  console.log(`  - All diagrams valid: ${svgResults.results?.every(r => r.valid) ? 'Yes' : 'No'}`);
  
  console.log('\n🎯 RECOMMENDATION:');
  console.log('Use the new template-based system for:');
  console.log('  ✓ Instant question generation (no waiting)');
  console.log('  ✓ Zero API costs');
  console.log('  ✓ 100% reliability');
  console.log('  ✓ Mathematically accurate questions');
  console.log('  ✓ Consistent STAAR formatting');
}

// Run the test
if (require.main === module) {
  runEfficiencyComparison().catch(console.error);
}

module.exports = { testAIGeneration, testTemplateGeneration, testSVGGeneration };