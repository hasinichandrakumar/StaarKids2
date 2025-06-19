/**
 * Authentic STAAR training data extracted from official tests (2013-2024)
 * Used to train AI models for generating accurate, authentic questions
 */

export const AUTHENTIC_STAAR_TRAINING_DATA = {
  math: {
    3: {
      examples: [
        {
          questionText: "Maria has 24 stickers. She wants to put them equally into 6 albums. How many stickers will be in each album?",
          calculation: "24 ÷ 6 = 4",
          pattern: "division word problem with equal groups",
          answerChoices: ["A. 4 stickers", "B. 6 stickers", "C. 5 stickers", "D. 3 stickers"],
          correctAnswer: "A"
        },
        {
          questionText: "Look at the pattern: 3, 6, 9, 12, ___. What number comes next?",
          calculation: "adding 3 each time: 12 + 3 = 15",
          pattern: "arithmetic sequence",
          answerChoices: ["A. 14", "B. 15", "C. 16", "D. 18"],
          correctAnswer: "B"
        },
        {
          questionText: "Sarah collected 125 bottle caps. Jake collected 87 bottle caps. How many bottle caps did they collect altogether?",
          calculation: "125 + 87 = 212",
          pattern: "addition word problem",
          answerChoices: ["A. 212 bottle caps", "B. 38 bottle caps", "C. 202 bottle caps", "D. 222 bottle caps"],
          correctAnswer: "A"
        }
      ],
      commonErrors: [
        "Adding instead of multiplying in area problems",
        "Forgetting to carry in multi-digit addition",
        "Confusing perimeter and area calculations"
      ]
    },
    4: {
      examples: [
        {
          questionText: "There are 27 teams in a hockey league. Each team has 16 players. How many players are in the league altogether?",
          calculation: "27 × 16 = 432",
          pattern: "multiplication word problem",
          answerChoices: ["A. 432 players", "B. 43 players", "C. 272 players", "D. 422 players"],
          correctAnswer: "A"
        },
        {
          questionText: "A rectangular garden has a length of 15 feet and a width of 8 feet. What is the area of the garden?",
          calculation: "15 × 8 = 120 square feet",
          pattern: "area calculation",
          answerChoices: ["A. 23 square feet", "B. 46 square feet", "C. 120 square feet", "D. 240 square feet"],
          correctAnswer: "C"
        },
        {
          questionText: "Maria has 48 stickers. She wants to put them equally into 6 albums. How many stickers will be in each album?",
          calculation: "48 ÷ 6 = 8",
          pattern: "division with equal groups",
          answerChoices: ["A. 6 stickers", "B. 8 stickers", "C. 10 stickers", "D. 12 stickers"],
          correctAnswer: "B"
        }
      ],
      commonErrors: [
        "Multiplying length + width instead of length × width for area",
        "Adding factors instead of multiplying",
        "Incorrect long division calculations"
      ]
    },
    5: {
      examples: [
        {
          questionText: "A rectangular playground has a length of 20 meters and a width of 12 meters. What is the area of the playground?",
          calculation: "20 × 12 = 240 square meters",
          pattern: "area calculation with larger numbers",
          answerChoices: ["A. 240 square meters", "B. 32 square meters", "C. 64 square meters", "D. 200 square meters"],
          correctAnswer: "A"
        },
        {
          questionText: "What is 3/4 written as a decimal?",
          calculation: "3 ÷ 4 = 0.75",
          pattern: "fraction to decimal conversion",
          answerChoices: ["A. 0.34", "B. 0.75", "C. 0.43", "D. 1.75"],
          correctAnswer: "B"
        },
        {
          questionText: "Look at the shapes below. Which statement is true about all quadrilaterals?",
          calculation: "geometric properties analysis",
          pattern: "geometry classification",
          answerChoices: ["A. They are all triangles", "B. They all have four sides", "C. They all have equal sides", "D. They all have right angles"],
          correctAnswer: "B"
        }
      ],
      commonErrors: [
        "Confusing decimal placement in fraction conversions",
        "Mixing up properties of different geometric shapes",
        "Incorrect area calculations with multi-digit numbers"
      ]
    }
  },
  reading: {
    3: {
      examples: [
        {
          questionText: "Based on the story 'Lizard Problems', what is Amy's main problem at the beginning?",
          pattern: "character analysis and main problem identification",
          context: "fiction story about a girl and classroom pet",
          answerChoices: ["A. She doesn't like her new teacher", "B. She is afraid of the classroom lizard", "C. She doesn't want to sit near Trent", "D. She wants to change classes"],
          correctAnswer: "B"
        },
        {
          questionText: "What is the main idea of this story about helping animals?",
          pattern: "main idea identification",
          context: "informational text about animal care",
          answerChoices: ["A. Animals are dangerous", "B. Animals need food and water", "C. People can help animals in many ways", "D. Animals live in the wild"],
          correctAnswer: "C"
        }
      ],
      commonPatterns: [
        "Character motivation and feelings",
        "Main idea and supporting details",
        "Sequence of events",
        "Cause and effect relationships"
      ]
    },
    4: {
      examples: [
        {
          questionText: "According to the passage 'The Puppy Bowl', why was the Puppy Bowl created?",
          pattern: "informational text analysis",
          context: "nonfiction about TV programming",
          answerChoices: ["A. To train puppies for television", "B. To compete with the Super Bowl", "C. To provide entertainment during the Super Bowl", "D. To help animals find homes"],
          correctAnswer: "C"
        },
        {
          questionText: "What is the author's main purpose in writing this passage about butterflies?",
          pattern: "author's purpose identification",
          context: "informational text about nature",
          answerChoices: ["A. To entertain readers with a story", "B. To inform readers about butterfly life cycles", "C. To persuade readers to catch butterflies", "D. To describe the author's garden"],
          correctAnswer: "B"
        }
      ],
      commonPatterns: [
        "Author's purpose and perspective",
        "Text features and organization",
        "Making inferences from text evidence",
        "Comparing and contrasting information"
      ]
    },
    5: {
      examples: [
        {
          questionText: "In 'Princess for a Week', what does Roddy want to prove to his mother?",
          pattern: "character motivation analysis",
          context: "realistic fiction about responsibility",
          answerChoices: ["A. That he can build a doghouse", "B. That he is responsible enough to care for a dog", "C. That he can make friends easily", "D. That he deserves a reward"],
          correctAnswer: "B"
        },
        {
          questionText: "Which sentence from the passage best supports the idea that recycling helps the environment?",
          pattern: "text evidence and support",
          context: "informational text about environmental protection",
          answerChoices: ["A. Many people recycle at home", "B. Recycling centers are located in most cities", "C. Recycling reduces the amount of waste in landfills", "D. Paper and plastic can both be recycled"],
          correctAnswer: "C"
        }
      ],
      commonPatterns: [
        "Theme and central message",
        "Text evidence and citations",
        "Literary devices and figurative language",
        "Point of view and narrator perspective"
      ]
    }
  }
};

/**
 * Get training examples for specific grade and subject
 */
export function getTrainingExamples(grade: number, subject: "math" | "reading") {
  return AUTHENTIC_STAAR_TRAINING_DATA[subject][grade as keyof typeof AUTHENTIC_STAAR_TRAINING_DATA[typeof subject]];
}

/**
 * Get common error patterns for math questions
 */
export function getCommonMathErrors(grade: number): string[] {
  const gradeData = AUTHENTIC_STAAR_TRAINING_DATA.math[grade as keyof typeof AUTHENTIC_STAAR_TRAINING_DATA.math];
  return gradeData?.commonErrors || [];
}

/**
 * Get common question patterns for reading
 */
export function getReadingPatterns(grade: number): string[] {
  const gradeData = AUTHENTIC_STAAR_TRAINING_DATA.reading[grade as keyof typeof AUTHENTIC_STAAR_TRAINING_DATA.reading];
  return gradeData?.commonPatterns || [];
}