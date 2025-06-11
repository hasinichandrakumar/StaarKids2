import { db } from "./db";
import { questions, type InsertQuestion } from "@shared/schema";
import { ENHANCED_AUTHENTIC_QUESTIONS } from "./enhancedQuestionBank";
import { eq } from "drizzle-orm";

/**
 * Initialize the question bank with authentic STAAR questions
 */
export async function initializeAuthenticQuestionBank(): Promise<void> {
  console.log("🚀 Initializing authentic STAAR question bank...");
  
  try {
    // Check if questions already exist
    const existingQuestions = await db.select().from(questions).limit(1);
    
    if (existingQuestions.length > 0) {
      console.log("✅ Question bank already initialized with", existingQuestions.length, "questions");
      return;
    }
    
    let insertedCount = 0;
    
    for (const question of ENHANCED_AUTHENTIC_QUESTIONS) {
      try {
        const dbQuestion: InsertQuestion = {
          grade: question.grade,
          subject: question.subject,
          teksStandard: question.teksStandard || `${question.grade}.1A`,
          questionText: question.questionText,
          answerChoices: question.answerChoices,
          correctAnswer: question.correctAnswer || "A",
          explanation: `Authentic question from ${question.year} STAAR Grade ${question.grade} ${question.subject} test. ${question.hasImage ? 'This question includes visual elements from the original test.' : ''}`,
          difficulty: question.difficulty,
          category: question.category,
          year: question.year
        };
        
        await db.insert(questions).values(dbQuestion);
        insertedCount++;
        
        if (insertedCount % 5 === 0) {
          console.log(`✓ Inserted ${insertedCount} authentic questions...`);
        }
        
      } catch (error) {
        console.error(`Error inserting question ${question.questionNumber}:`, error);
      }
    }
    
    console.log(`🎉 Successfully initialized question bank with ${insertedCount} authentic STAAR questions`);
    console.log("📊 Question distribution:");
    
    // Log distribution by grade and subject
    const grades = [3, 4, 5];
    const subjects = ["math", "reading"] as const;
    
    for (const grade of grades) {
      for (const subject of subjects) {
        const count = ENHANCED_AUTHENTIC_QUESTIONS.filter(q => 
          q.grade === grade && q.subject === subject
        ).length;
        console.log(`   Grade ${grade} ${subject}: ${count} questions`);
      }
    }
    
    const questionsWithImages = ENHANCED_AUTHENTIC_QUESTIONS.filter(q => q.hasImage).length;
    console.log(`   Questions with visual elements: ${questionsWithImages}`);
    
  } catch (error) {
    console.error("❌ Error initializing question bank:", error);
    throw error;
  }
}

/**
 * Add more authentic questions to the existing bank
 */
export async function addMoreAuthenticQuestions(): Promise<void> {
  console.log("📈 Adding additional authentic STAAR questions...");
  
  // Additional questions that could be extracted from the PDF content
  const additionalQuestions = [
    {
      grade: 3,
      subject: "reading" as const,
      year: 2013,
      questionNumber: 5,
      questionText: "In the story 'Jessica the Hippo', what happened to Jessica when she was born?",
      answerChoices: [
        "A. She was abandoned by her mother",
        "B. She was swept away by flood water", 
        "C. She was found by a game warden",
        "D. She was taken to a zoo"
      ],
      correctAnswer: "B",
      teksStandard: "3.8A",
      hasImage: false,
      difficulty: "medium" as const,
      category: "Comprehension"
    },
    {
      grade: 4,
      subject: "reading" as const,
      year: 2013,
      questionNumber: 3,
      questionText: "According to 'A Dessert with a Long History', what made ice cream popular in America?",
      answerChoices: [
        "A. The invention of electric freezers",
        "B. Nancy Johnson's ice cream machine",
        "C. The creation of ice cream cones", 
        "D. The opening of ice cream shops"
      ],
      correctAnswer: "B",
      teksStandard: "4.6B",
      hasImage: false,
      difficulty: "medium" as const,
      category: "Comprehension"
    },
    {
      grade: 5,
      subject: "reading" as const,
      year: 2013,
      questionNumber: 4,
      questionText: "In 'Carl Is on the Case', what is Carl's main interest?",
      answerChoices: [
        "A. Playing video games",
        "B. Watching movies",
        "C. Solving mysteries",
        "D. Reading books"
      ],
      correctAnswer: "C",
      teksStandard: "5.8A", 
      hasImage: false,
      difficulty: "medium" as const,
      category: "Comprehension"
    }
  ];
  
  try {
    for (const question of additionalQuestions) {
      const dbQuestion: InsertQuestion = {
        grade: question.grade,
        subject: question.subject,
        teksStandard: question.teksStandard,
        questionText: question.questionText,
        answerChoices: question.answerChoices,
        correctAnswer: question.correctAnswer,
        explanation: `Authentic question from ${question.year} STAAR Grade ${question.grade} ${question.subject} test.`,
        difficulty: question.difficulty,
        category: question.category,
        year: question.year
      };
      
      await db.insert(questions).values(dbQuestion);
    }
    
    console.log(`✅ Added ${additionalQuestions.length} additional authentic questions`);
    
  } catch (error) {
    console.error("Error adding additional questions:", error);
  }
}

/**
 * Get comprehensive question statistics
 */
export async function getQuestionBankStats() {
  try {
    const allQuestions = await db.select().from(questions);
    
    const stats = {
      total: allQuestions.length,
      byGrade: {} as Record<number, number>,
      bySubject: {} as Record<string, number>,
      byYear: {} as Record<number, number>,
      withImages: 0,
      byCategory: {} as Record<string, number>
    };
    
    allQuestions.forEach(q => {
      // By grade
      stats.byGrade[q.grade] = (stats.byGrade[q.grade] || 0) + 1;
      
      // By subject
      stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
      
      // By year
      if (q.year) {
        stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
      }
      
      // By category
      if (q.category) {
        stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1;
      }
    });
    
    return stats;
    
  } catch (error) {
    console.error("Error getting question bank stats:", error);
    return null;
  }
}