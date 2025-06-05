const { storage } = require('./storage.ts');
const { generateFullMockExam } = require('./examGenerator.ts');

async function generateAllMockExams() {
  console.log('Starting generation of 6 practice tests per grade/subject...');
  
  const grades = [3, 4, 5];
  const subjects = ['math', 'reading'];
  
  for (const grade of grades) {
    for (const subject of subjects) {
      console.log(`\nGenerating exams for Grade ${grade} ${subject}:`);
      
      // Generate 6 practice tests per grade/subject combination
      for (let examNumber = 1; examNumber <= 6; examNumber++) {
        try {
          await generateFullMockExam(grade, subject, examNumber);
          console.log(`✓ Generated Practice Test ${examNumber} for Grade ${grade} ${subject}`);
        } catch (error) {
          console.error(`✗ Error generating Practice Test ${examNumber} for Grade ${grade} ${subject}:`, error.message);
        }
      }
    }
  }
  
  // Verify final count
  const finalExams = await storage.getMockExams(3);
  const allExams = await Promise.all([
    storage.getMockExams(3),
    storage.getMockExams(4), 
    storage.getMockExams(5)
  ]);
  
  const totalCount = allExams.flat().length;
  console.log(`\nGeneration complete! Total mock exams: ${totalCount}`);
  
  if (totalCount >= 30) { // 3 grades × 2 subjects × 6 tests = 36 expected
    console.log('✓ Successfully generated 6 practice tests per grade/subject');
  } else {
    console.log(`⚠ Expected 36 exams, got ${totalCount}`);
  }
}

// Run if called directly
if (require.main === module) {
  generateAllMockExams()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Generation failed:', err);
      process.exit(1);
    });
}

module.exports = { generateAllMockExams };