import { generateQuestionWithPerplexity, getRandomTeksStandard, TEKS_STANDARDS } from './questionGenerator';
import { storage } from './storage';
import { InsertMockExam } from '../shared/schema';

// Official STAAR question counts per grade and subject
export const STAAR_QUESTION_COUNTS = {
  3: { math: 36, reading: 40 },
  4: { math: 40, reading: 44 },
  5: { math: 36, reading: 46 }
};

export async function generateFullMockExam(grade: number, subject: "math" | "reading"): Promise<void> {
  const questionCount = STAAR_QUESTION_COUNTS[grade as keyof typeof STAAR_QUESTION_COUNTS][subject];
  const examName = `STAAR Grade ${grade} ${subject === 'math' ? 'Mathematics' : 'Reading'} Practice Test`;
  
  // Check if exam already exists
  const existingExams = await storage.getMockExams(grade);
  const examExists = existingExams.find(exam => exam.subject === subject);
  
  if (examExists) {
    console.log(`Mock exam already exists for Grade ${grade} ${subject}`);
    return;
  }

  console.log(`Generating ${questionCount} questions for Grade ${grade} ${subject} mock exam...`);

  // Create the mock exam record
  const mockExam = await storage.createMockExam({
    name: examName,
    grade,
    subject,
    totalQuestions: questionCount,
    timeLimit: subject === 'math' ? 240 : 180 // 4 hours for math, 3 hours for reading
  });

  // Get all TEKS categories for this grade/subject
  const teksCategories = TEKS_STANDARDS[grade as keyof typeof TEKS_STANDARDS]?.[subject];
  if (!teksCategories) {
    throw new Error(`No TEKS standards found for grade ${grade} ${subject}`);
  }

  const allTeksStandards = Object.values(teksCategories).flat();
  const questionsPerStandard = Math.ceil(questionCount / allTeksStandards.length);

  let questionsGenerated = 0;
  const generatedQuestions = [];

  // Generate questions distributed across TEKS standards
  for (const category of Object.keys(teksCategories)) {
    const categoryStandards = teksCategories[category as keyof typeof teksCategories] as string[];
    
    for (const teksStandard of categoryStandards) {
      if (questionsGenerated >= questionCount) break;
      
      try {
        const questionData = await generateQuestionWithPerplexity(grade, subject, teksStandard, category);
        const savedQuestion = await storage.createQuestion(questionData);
        generatedQuestions.push(savedQuestion);
        questionsGenerated++;
        
        console.log(`Generated question ${questionsGenerated}/${questionCount} for ${teksStandard}`);
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating question for ${teksStandard}:`, error);
      }
    }
    
    if (questionsGenerated >= questionCount) break;
  }

  // If we still need more questions, generate additional ones
  while (questionsGenerated < questionCount) {
    try {
      const randomTeks = getRandomTeksStandard(grade, subject);
      const questionData = await generateQuestionWithPerplexity(grade, subject, randomTeks);
      const savedQuestion = await storage.createQuestion(questionData);
      generatedQuestions.push(savedQuestion);
      questionsGenerated++;
      
      console.log(`Generated additional question ${questionsGenerated}/${questionCount}`);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error generating additional question:`, error);
    }
  }

  console.log(`Mock exam generation complete: ${questionsGenerated} questions created for Grade ${grade} ${subject}`);
}

export async function initializeMockExams(): Promise<void> {
  console.log('Initializing mock exams for all grades...');
  
  for (const grade of [3, 4, 5]) {
    for (const subject of ['math', 'reading'] as const) {
      try {
        await generateFullMockExam(grade, subject);
      } catch (error) {
        console.error(`Error initializing mock exam for Grade ${grade} ${subject}:`, error);
      }
    }
  }
  
  console.log('Mock exam initialization complete');
}