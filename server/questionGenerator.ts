import { InsertQuestion } from "../shared/schema";

// TEKS Standards mapping for question categories
export const TEKS_STANDARDS = {
  3: {
    math: {
      "Number and Operations": ["3.2A", "3.2B", "3.2C", "3.2D"],
      "Algebraic Reasoning": ["3.4A", "3.4B", "3.4C", "3.4D", "3.4E"],
      "Geometry and Measurement": ["3.6A", "3.6B", "3.6C", "3.6D", "3.7A", "3.7B", "3.7C", "3.7D", "3.7E"],
      "Data Analysis": ["3.8A", "3.8B"]
    },
    reading: {
      "Reading Comprehension": ["3.6A", "3.6B", "3.6C", "3.6D", "3.6E", "3.6F", "3.6G", "3.6H"],
      "Literary Elements": ["3.7A", "3.7B", "3.7C", "3.7D"],
      "Author's Purpose": ["3.9A", "3.9B", "3.9C", "3.9D"],
      "Genre Features": ["3.8A", "3.8B", "3.8C", "3.8D"]
    }
  },
  4: {
    math: {
      "Number and Operations": ["4.2A", "4.2B", "4.2C", "4.2D", "4.2E", "4.2F", "4.2G", "4.2H"],
      "Algebraic Reasoning": ["4.4A", "4.4B", "4.4C", "4.4D", "4.4E", "4.4F", "4.4G"],
      "Geometry and Measurement": ["4.5A", "4.5B", "4.5C", "4.5D", "4.6A", "4.6B", "4.6C", "4.6D", "4.7A", "4.7B", "4.7C", "4.7D", "4.7E"],
      "Data Analysis": ["4.9A", "4.9B"]
    },
    reading: {
      "Reading Comprehension": ["4.6A", "4.6B", "4.6C", "4.6D", "4.6E", "4.6F", "4.6G", "4.6H"],
      "Literary Elements": ["4.7A", "4.7B", "4.7C", "4.7D", "4.7E", "4.7F"],
      "Author's Purpose": ["4.9A", "4.9B", "4.9C", "4.9D"],
      "Genre Features": ["4.8A", "4.8B", "4.8C"]
    }
  },
  5: {
    math: {
      "Number and Operations": ["5.2A", "5.2B", "5.2C", "5.3A", "5.3B", "5.3C", "5.3D", "5.3E", "5.3F", "5.3G", "5.3H", "5.3I", "5.3J", "5.3K", "5.3L"],
      "Algebraic Reasoning": ["5.4A", "5.4B", "5.4C", "5.4D", "5.4E", "5.4F"],
      "Geometry and Measurement": ["5.5A", "5.6A", "5.6B", "5.7A", "5.8A", "5.8B", "5.8C"],
      "Data Analysis": ["5.9A", "5.9B", "5.9C"]
    },
    reading: {
      "Reading Comprehension": ["5.6A", "5.6B", "5.6C", "5.6D", "5.6E", "5.6F", "5.6G", "5.6H", "5.6I"],
      "Literary Elements": ["5.7A", "5.7B", "5.7C", "5.7D"],
      "Author's Purpose": ["5.9A", "5.9B", "5.9C", "5.9D", "5.9E"],
      "Genre Features": ["5.8A", "5.8B", "5.8C"]
    }
  }
};

// Sample questions extracted from STAAR documents to use as examples
export const SAMPLE_QUESTIONS = {
  3: {
    math: [
      {
        teks: "3.2A",
        question: "Jake has 24 stickers. He gives away 8 stickers. How many stickers does Jake have left?",
        choices: ["A) 16", "B) 32", "C) 8", "D) 18"],
        correct: "A",
        explanation: "Subtract: 24 - 8 = 16 stickers remaining."
      }
    ],
    reading: [
      {
        teks: "3.6A",
        question: "Based on the story, what can you conclude about Jake's feelings toward computers?",
        choices: ["A) He is afraid of them", "B) He enjoys using them", "C) He thinks they are too difficult", "D) He prefers books"],
        correct: "B",
        explanation: "The text states 'I've always liked computers' which shows Jake enjoys using them."
      }
    ]
  },
  4: {
    math: [
      {
        teks: "4.2A",
        question: "Rita bought three and forty-eight hundredths pounds of bananas. How is this written in expanded notation?",
        choices: ["F) (3 × 1) + (4 × 0.1) + (8 × 0.01)", "G) (3 × 100) + (4 × 10) + (8 × 1)", "H) (3 × 1) + (4 × 0.01) + (8 × 0.1)", "J) (3 × 100) + (4 × 0.1) + (8 × 0.01)"],
        correct: "F",
        explanation: "3.48 = (3 × 1) + (4 × 0.1) + (8 × 0.01)"
      }
    ],
    reading: [
      {
        teks: "4.6A",
        question: "What is the main idea of the passage about William Wrigley Jr.?",
        choices: ["A) Soap was his first business", "B) Good advertising helps businesses succeed", "C) Wrigley's clever ideas made gum popular", "D) Chicago was a good place for business"],
        correct: "C",
        explanation: "The passage focuses on how Wrigley's innovative marketing ideas led to gum's popularity."
      }
    ]
  },
  5: {
    math: [
      {
        teks: "5.3A",
        question: "What is 2/3 ÷ 1/6?",
        choices: ["A) 2/18", "B) 4", "C) 1/9", "D) 8"],
        correct: "B",
        explanation: "2/3 ÷ 1/6 = 2/3 × 6/1 = 12/3 = 4"
      }
    ],
    reading: [
      {
        teks: "5.6A",
        question: "Based on the article about R2, what can you infer about the future of space exploration?",
        choices: ["A) Humans will stop going to space", "B) Robots will replace all astronauts", "C) Technology will continue to assist astronauts", "D) Space missions will become less important"],
        correct: "C",
        explanation: "The article shows how R2 assists astronauts, suggesting technology will continue supporting human space exploration."
      }
    ]
  }
};

export async function generateQuestionWithPerplexity(
  grade: number,
  subject: "math" | "reading",
  teksStandard: string,
  category?: string
): Promise<Omit<InsertQuestion, "id" | "createdAt">> {
  const sampleQuestions = SAMPLE_QUESTIONS[grade as keyof typeof SAMPLE_QUESTIONS]?.[subject] || [];
  const exampleQuestion = sampleQuestions.find(q => q.teks === teksStandard) || sampleQuestions[0];
  
  const prompt = `Generate a ${grade}th grade ${subject} question aligned with Texas TEKS standard ${teksStandard}${category ? ` in the category "${category}"` : ''}.

Based on actual STAAR test patterns, create a question that:
1. Matches the complexity level of ${grade}th grade students
2. Follows the exact format of Texas STAAR assessments
3. Aligns with TEKS standard ${teksStandard}
4. Includes 4 multiple choice answers (A, B, C, D for grades 3-4; F, G, H, J for some grade 4-5 questions)
5. Has a clear explanation for the correct answer

${exampleQuestion ? `Use this example as a style reference:
Question: ${exampleQuestion.question}
Choices: ${exampleQuestion.choices.join(", ")}
Correct: ${exampleQuestion.correct}
Explanation: ${exampleQuestion.explanation}` : ''}

For ${subject} questions:
${subject === 'math' ? `- Use real-world contexts (sports, shopping, measurement, etc.)
- Include computational problems appropriate for grade ${grade}
- Focus on problem-solving strategies
- Use clear, unambiguous mathematical language` : `- Base questions on reading comprehension
- Include literary analysis appropriate for grade ${grade}
- Focus on reading strategies and text analysis
- Use age-appropriate vocabulary and themes`}

Return ONLY a JSON object with this exact format:
{
  "grade": ${grade},
  "subject": "${subject}",
  "teksStandard": "${teksStandard}",
  "questionText": "The main question text here",
  "answerChoices": [
    {"id": "A", "text": "First answer choice"},
    {"id": "B", "text": "Second answer choice"},
    {"id": "C", "text": "Third answer choice"},
    {"id": "D", "text": "Fourth answer choice"}
  ],
  "correctAnswer": "A",
  "explanation": "Clear explanation of why this answer is correct",
  "difficulty": "easy|medium|hard",
  "year": 2024
}`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Texas educator who creates STAAR-aligned assessment questions. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from Perplexity API');
    }

    // Try to parse the JSON response
    let questionData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Perplexity response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate and format the response
    return {
      grade: questionData.grade || grade,
      subject: questionData.subject || subject,
      teksStandard: questionData.teksStandard || teksStandard,
      questionText: questionData.questionText || '',
      answerChoices: questionData.answerChoices || [],
      correctAnswer: questionData.correctAnswer || 'A',
      explanation: questionData.explanation || '',
      difficulty: questionData.difficulty || 'medium',
      year: questionData.year || 2024
    };

  } catch (error) {
    console.error('Error generating question with Perplexity:', error);
    
    // Fallback to a template-based question if API fails
    return generateFallbackQuestion(grade, subject, teksStandard, category);
  }
}

function generateFallbackQuestion(
  grade: number,
  subject: "math" | "reading",
  teksStandard: string,
  category?: string
): Omit<InsertQuestion, "id" | "createdAt"> {
  const sampleQuestions = SAMPLE_QUESTIONS[grade as keyof typeof SAMPLE_QUESTIONS]?.[subject] || [];
  const template = sampleQuestions[0];
  
  if (!template) {
    // Ultimate fallback
    return {
      grade,
      subject,
      teksStandard,
      questionText: `This is a ${grade}th grade ${subject} question for TEKS ${teksStandard}.`,
      answerChoices: [
        { id: "A", text: "Option A" },
        { id: "B", text: "Option B" },
        { id: "C", text: "Option C" },
        { id: "D", text: "Option D" }
      ],
      correctAnswer: "A",
      explanation: "This is the correct answer explanation.",
      difficulty: "medium",
      year: 2024
    };
  }

  return {
    grade,
    subject,
    teksStandard,
    questionText: template.question,
    answerChoices: template.choices.map((choice, index) => ({
      id: String.fromCharCode(65 + index), // A, B, C, D
      text: choice.replace(/^[A-J]\)\s*/, '') // Remove existing letter prefixes
    })),
    correctAnswer: template.correct,
    explanation: template.explanation,
    difficulty: "medium",
    year: 2024
  };
}

export function getRandomTeksStandard(grade: number, subject: "math" | "reading", category?: string): string {
  const standards = TEKS_STANDARDS[grade as keyof typeof TEKS_STANDARDS]?.[subject];
  if (!standards) return `${grade}.1A`;
  
  if (category && standards[category as keyof typeof standards]) {
    const categoryStandards = standards[category as keyof typeof standards] as string[];
    return categoryStandards[Math.floor(Math.random() * categoryStandards.length)];
  }
  
  // Get all standards from all categories
  const allStandards = Object.values(standards).flat();
  return allStandards[Math.floor(Math.random() * allStandards.length)];
}

export function getTeksCategories(grade: number, subject: "math" | "reading"): string[] {
  const standards = TEKS_STANDARDS[grade as keyof typeof TEKS_STANDARDS]?.[subject];
  return standards ? Object.keys(standards) : [];
}