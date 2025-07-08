// Comprehensive verification of unlimited question generation accuracy
const { generateAuthenticSTAARQuestion } = require('./server/aiQuestionGenerator');

function validateMathCalculations(question) {
  const questionText = question.questionText.toLowerCase();
  const numbers = questionText.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  
  console.log(`Validating: ${question.questionText}`);
  console.log(`Numbers found: ${numbers}`);
  
  // Check multiplication problems
  if (questionText.includes('multiply') || questionText.includes('×') || questionText.includes('times')) {
    if (numbers.length >= 2) {
      const expectedProduct = numbers[0] * numbers[1];
      console.log(`Expected product: ${expectedProduct}`);
      
      const answerNumbers = question.answerChoices.map(choice => 
        choice.match(/\d+(?:\.\d+)?/)?.[0]
      ).filter(Boolean).map(Number);
      
      console.log(`Answer choices contain: ${answerNumbers}`);
      
      if (!answerNumbers.includes(expectedProduct)) {
        console.error(`❌ CALCULATION ERROR: Expected ${expectedProduct} not found in choices`);
        return false;
      }
      console.log(`✅ Multiplication calculation verified`);
    }
  }
  
  // Check area calculations
  if (questionText.includes('area') && questionText.includes('rectangle')) {
    if (numbers.length >= 2) {
      const expectedArea = numbers[0] * numbers[1];
      console.log(`Expected area: ${expectedArea}`);
      
      const answerNumbers = question.answerChoices.map(choice => 
        choice.match(/\d+(?:\.\d+)?/)?.[0]
      ).filter(Boolean).map(Number);
      
      if (!answerNumbers.includes(expectedArea)) {
        console.error(`❌ AREA CALCULATION ERROR: Expected ${expectedArea} not found in choices`);
        return false;
      }
      console.log(`✅ Area calculation verified`);
    }
  }
  
  // Check division problems
  if (questionText.includes('divide') || questionText.includes('÷') || questionText.includes('equally')) {
    if (numbers.length >= 2) {
      const expectedQuotient = numbers[0] / numbers[1];
      console.log(`Expected quotient: ${expectedQuotient}`);
      
      const answerNumbers = question.answerChoices.map(choice => 
        choice.match(/\d+(?:\.\d+)?/)?.[0]
      ).filter(Boolean).map(Number);
      
      if (!answerNumbers.includes(expectedQuotient)) {
        console.error(`❌ DIVISION ERROR: Expected ${expectedQuotient} not found in choices`);
        return false;
      }
      console.log(`✅ Division calculation verified`);
    }
  }
  
  return true;
}

function validateSTAARFormatting(question) {
  console.log(`Checking STAAR formatting for: ${question.subject} question`);
  
  // Check answer choices format (A, B, C, D)
  const expectedFormat = ['A', 'B', 'C', 'D'];
  const actualFormat = question.answerChoices.map(choice => choice.charAt(0));
  
  if (JSON.stringify(actualFormat) !== JSON.stringify(expectedFormat)) {
    console.error(`❌ FORMAT ERROR: Expected A,B,C,D format, got ${actualFormat}`);
    return false;
  }
  
  // Check correct answer is valid
  if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
    console.error(`❌ ANSWER ERROR: Invalid correct answer ${question.correctAnswer}`);
    return false;
  }
  
  // Check explanation exists
  if (!question.explanation || question.explanation.length < 10) {
    console.error(`❌ EXPLANATION ERROR: Missing or insufficient explanation`);
    return false;
  }
  
  console.log(`✅ STAAR formatting verified`);
  return true;
}

async function runComprehensiveValidation() {
  console.log('🔍 Starting comprehensive validation of unlimited question generation...\n');
  
  const testCases = [
    { grade: 3, subject: 'math', category: 'Number & Operations' },
    { grade: 4, subject: 'math', category: 'Measurement' },
    { grade: 5, subject: 'math', category: 'Geometry' },
    { grade: 3, subject: 'reading', category: 'Comprehension' },
    { grade: 4, subject: 'reading', category: 'Literary Analysis' },
    { grade: 5, subject: 'reading', category: 'Informational Text' }
  ];
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    console.log(`\n📝 Testing Grade ${testCase.grade} ${testCase.subject} - ${testCase.category}`);
    console.log('=' .repeat(60));
    
    try {
      const question = await generateAuthenticSTAARQuestion(
        testCase.grade,
        testCase.subject,
        `${testCase.grade}.3A`,
        testCase.category
      );
      
      console.log(`Question: ${question.questionText}`);
      console.log(`Choices: ${JSON.stringify(question.answerChoices)}`);
      console.log(`Correct: ${question.correctAnswer}`);
      console.log(`Explanation: ${question.explanation}`);
      
      let testPassed = true;
      
      // Validate STAAR formatting
      if (!validateSTAARFormatting(question)) {
        testPassed = false;
      }
      
      // Validate math calculations if it's a math question
      if (testCase.subject === 'math') {
        if (!validateMathCalculations(question)) {
          testPassed = false;
        }
      }
      
      if (testPassed) {
        console.log(`✅ Grade ${testCase.grade} ${testCase.subject} - PASSED`);
        passedTests++;
      } else {
        console.log(`❌ Grade ${testCase.grade} ${testCase.subject} - FAILED`);
      }
      
    } catch (error) {
      console.error(`❌ Error testing Grade ${testCase.grade} ${testCase.subject}:`, error.message);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 VALIDATION SUMMARY`);
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`Success Rate: ${Math.round((passedTests/totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED - Unlimited question generation is working correctly!');
  } else {
    console.log('⚠️  Some tests failed - Review the issues above');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  runComprehensiveValidation();
}

module.exports = { validateMathCalculations, validateSTAARFormatting, runComprehensiveValidation };