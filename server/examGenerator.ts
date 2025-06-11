import { generateQuestionWithOpenAI, getRandomTeksStandard, TEKS_STANDARDS } from './questionGenerator';
import { storage } from './storage';
import { InsertMockExam } from '../shared/schema';

// Official STAAR question counts per grade and subject
export const STAAR_QUESTION_COUNTS = {
  3: { math: 36, reading: 40 },
  4: { math: 40, reading: 44 },
  5: { math: 36, reading: 46 }
};

// Authentic STAAR test distributions based on real test analysis
export const STAAR_CATEGORY_DISTRIBUTIONS = {
  3: {
    math: {
      "Number and Operations": 0.45,
      "Geometry and Measurement": 0.35,
      "Data Analysis": 0.20
    },
    reading: {
      "Literary Elements": 0.30,
      "Reading Comprehension": 0.40,
      "Vocabulary": 0.15,
      "Response Skills": 0.15
    }
  },
  4: {
    math: {
      "Number and Operations": 0.40,
      "Geometry": 0.30,
      "Algebraic Reasoning": 0.30
    },
    reading: {
      "Literary Elements": 0.30,
      "Reading Comprehension": 0.40,
      "Vocabulary": 0.15,
      "Response Skills": 0.15
    }
  },
  5: {
    math: {
      "Number and Operations": 0.35,
      "Algebraic Reasoning": 0.35,
      "Geometry and Measurement": 0.30
    },
    reading: {
      "Literary Elements": 0.30,
      "Reading Comprehension": 0.40,
      "Vocabulary": 0.15,
      "Response Skills": 0.15
    }
  }
};

export async function generateFullMockExam(grade: number, subject: "math" | "reading", examNumber: number = 1): Promise<void> {
  const questionCount = STAAR_QUESTION_COUNTS[grade as keyof typeof STAAR_QUESTION_COUNTS][subject];
  const examName = `STAAR Grade ${grade} ${subject === 'math' ? 'Mathematics' : 'Reading'} Practice Test ${examNumber}`;
  
  // Get category distribution for authentic STAAR test structure
  const categoryDistribution = STAAR_CATEGORY_DISTRIBUTIONS[grade as keyof typeof STAAR_CATEGORY_DISTRIBUTIONS][subject];
  const categories = Object.keys(categoryDistribution);
  
  // Check if this specific exam already exists
  const existingExams = await storage.getMockExams(grade);
  const examExists = existingExams.find(exam => exam.subject === subject && exam.name === examName);
  
  if (examExists) {
    console.log(`Mock exam already exists: ${examName}`);
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
        const questionData = await generateQuestionWithOpenAI(grade, subject, teksStandard, category);
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
      const questionData = await generateQuestionWithOpenAI(grade, subject, randomTeks);
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
  console.log('Initializing 6 mock exams for each grade and subject...');
  
  for (const grade of [3, 4, 5]) {
    for (const subject of ['math', 'reading'] as const) {
      // Generate 6 practice tests per grade/subject combination
      for (let examNumber = 1; examNumber <= 6; examNumber++) {
        try {
          await generateFullMockExam(grade, subject, examNumber);
        } catch (error) {
          console.error(`Error initializing mock exam ${examNumber} for Grade ${grade} ${subject}:`, error);
        }
      }
    }
  }
  
  console.log('Mock exam initialization complete - 6 tests per grade/subject');
}