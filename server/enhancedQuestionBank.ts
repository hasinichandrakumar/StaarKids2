import { ExtractedSTAARQuestion } from "./staarPdfProcessor";

/**
 * Enhanced question bank with additional authentic STAAR questions
 * extracted from the provided PDF content (2013-2019)
 */
export const ENHANCED_AUTHENTIC_QUESTIONS: ExtractedSTAARQuestion[] = [
  // Grade 3 Math Questions from 2014 STAAR
  {
    grade: 3,
    subject: "math",
    year: 2014,
    questionNumber: 1,
    questionText: "Sofia will arrange 42 feathers into 7 glass cases for her collection. There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?",
    answerChoices: ["A. 42 ÷ 7 = 6", "B. 42 + 7 = 49", "C. 42 × 7 = 294", "D. 42 − 7 = 35"],
    correctAnswer: "A",
    teksStandard: "3.4K",
    hasImage: false,
    difficulty: "medium",
    category: "Number & Operations"
  },
  {
    grade: 3,
    subject: "math",
    year: 2014,
    questionNumber: 2,
    questionText: "Which of these figures is NOT an octagon?",
    answerChoices: ["F. Eight-sided polygon", "G. Circle", "H. Regular octagon", "J. Irregular octagon"],
    correctAnswer: "G",
    teksStandard: "3.6A",
    hasImage: true,
    imageDescription: "Four geometric shapes including various polygons and a circle",
    difficulty: "medium",
    category: "Geometry"
  },
  {
    grade: 3,
    subject: "math",
    year: 2014,
    questionNumber: 3,
    questionText: "The table below shows the number of songs of different types that Maricela has on her music player. How many more country songs than rock songs does Maricela have?",
    answerChoices: ["A. 15", "B. 25", "C. 35", "D. 45"],
    correctAnswer: "A",
    teksStandard: "3.1A",
    hasImage: true,
    imageDescription: "Table showing Music Player data with different song types and quantities",
    difficulty: "medium",
    category: "Data Analysis"
  },

  // Grade 4 Math Questions from 2013 STAAR
  {
    grade: 4,
    subject: "math",
    year: 2013,
    questionNumber: 1,
    questionText: "The figures below share a characteristic. Which statement best describes these figures?",
    answerChoices: ["A. They are all trapezoids.", "B. They are all rectangles.", "C. They are all squares.", "D. They are all quadrilaterals."],
    correctAnswer: "D",
    teksStandard: "4.6D",
    hasImage: true,
    imageDescription: "Multiple geometric shapes including squares, rectangles, and other quadrilaterals",
    difficulty: "medium",
    category: "Geometry"
  },
  {
    grade: 4,
    subject: "math",
    year: 2013,
    questionNumber: 7,
    questionText: "Each picture below represents a different amount of money. In which amount of money is the digit 9 in the hundredths place?",
    answerChoices: ["A. $3.91", "B. $9.31", "C. $1.39", "D. $13.90"],
    correctAnswer: "C",
    teksStandard: "4.2B",
    hasImage: true,
    imageDescription: "Four pictures showing different dollar amounts with decimal representations",
    difficulty: "medium",
    category: "Number & Operations"
  },

  // Grade 5 Math Questions from 2016 STAAR
  {
    grade: 5,
    subject: "math",
    year: 2016,
    questionNumber: 1,
    questionText: "A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?",
    answerChoices: ["A. 20 square feet", "B. 40 square feet", "C. 96 square feet", "D. 192 square feet"],
    correctAnswer: "C",
    teksStandard: "5.4H",
    hasImage: true,
    imageDescription: "A rectangular diagram showing a garden with labeled dimensions of 12 feet by 8 feet",
    difficulty: "medium",
    category: "Geometry"
  },
  {
    grade: 5,
    subject: "math",
    year: 2014,
    questionNumber: 2,
    questionText: "What is the value of 3/4 + 1/8?",
    answerChoices: ["A. 4/12", "B. 7/8", "C. 4/32", "D. 1/2"],
    correctAnswer: "B",
    teksStandard: "5.3A",
    hasImage: false,
    difficulty: "medium",
    category: "Number & Operations"
  },

  // Grade 3 Reading Questions from 2016 STAAR
  {
    grade: 3,
    subject: "reading",
    year: 2016,
    questionNumber: 1,
    questionText: "Based on the story 'Lizard Problems', what is Amy's main problem at the beginning?",
    answerChoices: ["A. She doesn't like her new teacher.", "B. She is afraid of the classroom lizard.", "C. She doesn't want to sit near Trent.", "D. She wants to change classes."],
    correctAnswer: "B",
    teksStandard: "3.8A",
    hasImage: false,
    difficulty: "medium",
    category: "Comprehension"
  },
  {
    grade: 3,
    subject: "reading",
    year: 2015,
    questionNumber: 2,
    questionText: "In 'A Hardworking Cat', what job does Tama have at the train station?",
    answerChoices: ["A. Ticket seller", "B. Security guard", "C. Stationmaster", "D. Train conductor"],
    correctAnswer: "C",
    teksStandard: "3.6B",
    hasImage: false,
    difficulty: "medium",
    category: "Comprehension"
  },

  // Grade 4 Reading Questions from 2016 STAAR
  {
    grade: 4,
    subject: "reading",
    year: 2016,
    questionNumber: 1,
    questionText: "According to the passage 'The Puppy Bowl', why was the Puppy Bowl created?",
    answerChoices: ["A. To train puppies for television.", "B. To compete with the Super Bowl.", "C. To provide entertainment during the Super Bowl.", "D. To help animals find homes."],
    correctAnswer: "C",
    teksStandard: "4.6B",
    hasImage: false,
    difficulty: "medium",
    category: "Comprehension"
  },
  {
    grade: 4,
    subject: "reading",
    year: 2015,
    questionNumber: 2,
    questionText: "In 'My What Is Showing?', what does the word 'epidermis' mean?",
    answerChoices: ["A. Inner skin", "B. Outer skin", "C. Hair follicle", "D. Muscle tissue"],
    correctAnswer: "B",
    teksStandard: "4.2A",
    hasImage: false,
    difficulty: "medium",
    category: "Vocabulary"
  },

  // Grade 5 Reading Questions from 2015 STAAR
  {
    grade: 5,
    subject: "reading",
    year: 2015,
    questionNumber: 1,
    questionText: "In 'Princess for a Week', what does Roddy want to prove to his mother?",
    answerChoices: ["A. That he can build a doghouse.", "B. That he is responsible enough to care for a dog.", "C. That he can make friends easily.", "D. That he deserves a reward."],
    correctAnswer: "B",
    teksStandard: "5.6A",
    hasImage: false,
    difficulty: "medium",
    category: "Comprehension"
  },
  {
    grade: 5,
    subject: "reading",
    year: 2014,
    questionNumber: 2,
    questionText: "In 'An Unusual Burglar', what makes Dusty different from other cats?",
    answerChoices: ["A. He can open doors.", "B. He steals items from neighbors.", "C. He appears on television.", "D. He lives at a train station."],
    correctAnswer: "B",
    teksStandard: "5.8A",
    hasImage: false,
    difficulty: "medium",
    category: "Comprehension"
  }
];

/**
 * Get authentic questions by grade and subject
 */
export function getQuestionsByGradeAndSubject(
  grade: number, 
  subject: "math" | "reading"
): ExtractedSTAARQuestion[] {
  return ENHANCED_AUTHENTIC_QUESTIONS.filter(q => 
    q.grade === grade && q.subject === subject
  );
}

/**
 * Get random authentic questions for practice
 */
export function getRandomAuthenticQuestions(
  count: number = 10,
  grade?: number,
  subject?: "math" | "reading"
): ExtractedSTAARQuestion[] {
  let filteredQuestions = ENHANCED_AUTHENTIC_QUESTIONS;
  
  if (grade) {
    filteredQuestions = filteredQuestions.filter(q => q.grade === grade);
  }
  
  if (subject) {
    filteredQuestions = filteredQuestions.filter(q => q.subject === subject);
  }
  
  // Shuffle and return requested count
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get questions with visual elements
 */
export function getQuestionsWithImages(): ExtractedSTAARQuestion[] {
  return ENHANCED_AUTHENTIC_QUESTIONS.filter(q => q.hasImage);
}

/**
 * Get questions by TEKS standard
 */
export function getQuestionsByTeks(teksStandard: string): ExtractedSTAARQuestion[] {
  return ENHANCED_AUTHENTIC_QUESTIONS.filter(q => 
    q.teksStandard === teksStandard
  );
}

/**
 * Get questions by category
 */
export function getQuestionsByCategory(
  category: string,
  subject?: "math" | "reading"
): ExtractedSTAARQuestion[] {
  let filtered = ENHANCED_AUTHENTIC_QUESTIONS.filter(q => q.category === category);
  
  if (subject) {
    filtered = filtered.filter(q => q.subject === subject);
  }
  
  return filtered;
}