import { db } from "./db";
import { questions, type InsertQuestion } from "@shared/schema";
import { getImmediateAuthenticQuestions } from "./extractQuestionsFromPDFs";

/**
 * Populate database with authentic STAAR questions extracted from official PDFs
 */
export async function populateAuthenticSTAARQuestions(): Promise<void> {
  console.log("Starting population of authentic STAAR questions...");
  
  try {
    // Get authentic questions from extracted PDF content
    const authenticQuestions = getImmediateAuthenticQuestions();
    
    console.log(`Processing ${authenticQuestions.length} authentic STAAR questions...`);
    
    for (const question of authenticQuestions) {
      try {
        // Transform to database format
        const dbQuestion: InsertQuestion = {
          grade: question.grade,
          subject: question.subject,
          teksStandard: question.teksStandard || "",
          questionText: question.questionText,
          answerChoices: question.answerChoices,
          correctAnswer: question.correctAnswer || "",
          explanation: `This is an authentic question from the ${question.year} STAAR Grade ${question.grade} ${question.subject} test.`,
          difficulty: question.difficulty,
          category: question.category,
          year: question.year
        };
        
        // Insert into database
        await db.insert(questions).values(dbQuestion);
        
        console.log(`✓ Inserted: Grade ${question.grade} ${question.subject} - ${question.teksStandard}`);
        
      } catch (error) {
        console.error(`Error inserting question:`, error);
      }
    }
    
    console.log("✅ Successfully populated database with authentic STAAR questions");
    
  } catch (error) {
    console.error("Error during question population:", error);
    throw error;
  }
}

/**
 * Get authentic questions for homepage preview
 */
export function getHomepageAuthenticQuestions() {
  return [
    {
      id: 1,
      grade: 3,
      subject: "math" as const,
      teksStandard: "3.4K",
      questionText: "Sofia will arrange 42 feathers into 7 glass cases for her collection. There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?",
      answerChoices: [
        "A. 42 ÷ 7 = 6",
        "B. 42 + 7 = 49", 
        "C. 42 × 7 = 294",
        "D. 42 − 7 = 35"
      ],
      correctAnswer: "A",
      category: "Number & Operations",
      isFromRealSTAAR: true,
      year: 2014
    },
    {
      id: 2,
      grade: 4,
      subject: "math" as const,
      teksStandard: "4.6D",
      questionText: "The figures below share a characteristic. Which statement best describes these figures?",
      answerChoices: [
        "A. They are all trapezoids.",
        "B. They are all rectangles.",
        "C. They are all squares.", 
        "D. They are all quadrilaterals."
      ],
      correctAnswer: "D",
      category: "Geometry",
      isFromRealSTAAR: true,
      year: 2013,
      hasImage: true,
      imageDescription: "Multiple geometric shapes including squares, rectangles, and other quadrilaterals"
    },
    {
      id: 3,
      grade: 5,
      subject: "math" as const,
      teksStandard: "5.4H",
      questionText: "A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?",
      answerChoices: [
        "A. 20 square feet",
        "B. 40 square feet", 
        "C. 96 square feet",
        "D. 192 square feet"
      ],
      correctAnswer: "C",
      category: "Geometry",
      isFromRealSTAAR: true,
      year: 2016,
      hasImage: true,
      imageDescription: "A rectangular diagram showing a garden with labeled dimensions of 12 feet by 8 feet"
    },
    {
      id: 4,
      grade: 3,
      subject: "reading" as const,
      teksStandard: "3.8A",
      questionText: "Based on the story 'Lizard Problems', what is Amy's main problem at the beginning?",
      answerChoices: [
        "A. She doesn't like her new teacher.",
        "B. She is afraid of the classroom lizard.",
        "C. She doesn't want to sit near Trent.",
        "D. She wants to change classes."
      ],
      correctAnswer: "B",
      category: "Comprehension",
      isFromRealSTAAR: true,
      year: 2016
    },
    {
      id: 5,
      grade: 4,
      subject: "reading" as const,
      teksStandard: "4.6B",
      questionText: "According to the passage 'The Puppy Bowl', why was the Puppy Bowl created?",
      answerChoices: [
        "A. To train puppies for television.",
        "B. To compete with the Super Bowl.",
        "C. To provide entertainment during the Super Bowl.",
        "D. To help animals find homes."
      ],
      correctAnswer: "C",
      category: "Comprehension",
      isFromRealSTAAR: true,
      year: 2016
    },
    {
      id: 6,
      grade: 5,
      subject: "reading" as const,
      teksStandard: "5.6A",
      questionText: "In 'Princess for a Week', what does Roddy want to prove to his mother?",
      answerChoices: [
        "A. That he can build a doghouse.",
        "B. That he is responsible enough to care for a dog.",
        "C. That he can make friends easily.",
        "D. That he deserves a reward."
      ],
      correctAnswer: "B",
      category: "Comprehension",
      isFromRealSTAAR: true,
      year: 2015
    }
  ];
}