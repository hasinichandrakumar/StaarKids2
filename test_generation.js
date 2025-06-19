// Test the enhanced unlimited question generation system
const { generateAuthenticSTAARQuestion } = require('./server/aiQuestionGenerator');

async function testGeneration() {
  console.log('Testing enhanced unlimited question generation...');
  
  try {
    // Test math question generation for each grade
    for (let grade = 3; grade <= 5; grade++) {
      console.log(`\n=== Testing Grade ${grade} Math ===`);
      const mathQuestion = await generateAuthenticSTAARQuestion(
        grade, 
        'math', 
        `${grade}.3A`, 
        'Number & Operations'
      );
      
      console.log('Question:', mathQuestion.questionText);
      console.log('Choices:', mathQuestion.answerChoices);
      console.log('Correct:', mathQuestion.correctAnswer);
      console.log('Explanation:', mathQuestion.explanation);
      console.log('Has Image:', mathQuestion.hasImage);
    }
    
    // Test reading question generation for each grade
    for (let grade = 3; grade <= 5; grade++) {
      console.log(`\n=== Testing Grade ${grade} Reading ===`);
      const readingQuestion = await generateAuthenticSTAARQuestion(
        grade, 
        'reading', 
        `${grade}.6B`, 
        'Comprehension'
      );
      
      console.log('Question:', readingQuestion.questionText);
      console.log('Choices:', readingQuestion.answerChoices);
      console.log('Correct:', readingQuestion.correctAnswer);
      console.log('Explanation:', readingQuestion.explanation);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testGeneration();