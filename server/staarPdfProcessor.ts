import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ExtractedSTAARQuestion {
  grade: number;
  subject: "math" | "reading";
  year: number;
  questionNumber: number;
  questionText: string;
  answerChoices: string[];
  correctAnswer?: string;
  teksStandard?: string;
  hasImage: boolean;
  imageDescription?: string;
  difficulty: "low" | "medium" | "high";
  category: string;
}

// STAAR PDF files available in attached_assets
export const AVAILABLE_STAAR_PDFS = [
  { file: "2017-staar-3-math-test_1749609061982.pdf", grade: 3, subject: "math", year: 2017 },
  { file: "2017-staar-3-reading-test_1749609061982.pdf", grade: 3, subject: "reading", year: 2017 },
  { file: "2017-staar-4-math-test_1749609061982.pdf", grade: 4, subject: "math", year: 2017 },
  { file: "2017-staar-4-reading-test_1749609061982.pdf", grade: 4, subject: "reading", year: 2017 },
  { file: "2017-staar-5-math-test_1749609061982.pdf", grade: 5, subject: "math", year: 2017 },
  { file: "2017-staar-5-reading-test_1749609061982.pdf", grade: 5, subject: "reading", year: 2017 },
  { file: "2018-staar-3-math-test_1749609061982.pdf", grade: 3, subject: "math", year: 2018 },
  { file: "2018-staar-3-reading-released-test_1749609061982.pdf", grade: 3, subject: "reading", year: 2018 },
  { file: "2018-staar-4-math-test_1749609061982.pdf", grade: 4, subject: "math", year: 2018 },
  { file: "2018-staar-4-reading-test_1749609061982.pdf", grade: 4, subject: "reading", year: 2018 },
  { file: "2018-staar-5-math-test_1749609061982.pdf", grade: 5, subject: "math", year: 2018 },
  { file: "2018-staar-5-reading-test_1749609061982.pdf", grade: 5, subject: "reading", year: 2018 },
  { file: "2019-staar-3-math-test_1749609061982.pdf", grade: 3, subject: "math", year: 2019 },
  { file: "2019-staar-3-reading-test_1749609061982.pdf", grade: 3, subject: "reading", year: 2019 },
  { file: "2019-staar-4-math-test_1749609061982.pdf", grade: 4, subject: "math", year: 2019 },
  { file: "2019-staar-4-reading-test_1749609061982.pdf", grade: 4, subject: "reading", year: 2019 },
  { file: "2019-staar-5-math-test_1749609061982.pdf", grade: 5, subject: "math", year: 2019 },
  { file: "2019-staar-5-reading-test_1749609061982.pdf", grade: 5, subject: "reading", year: 2019 },
  { file: "2019-staar-5-reading-test-2_1749609061982.pdf", grade: 5, subject: "reading", year: 2019 }
] as const;

/**
 * Extract questions from STAAR PDF content using OpenAI
 * This function processes the provided PDF text content to identify and extract
 * authentic STAAR questions with proper formatting and metadata
 */
export async function extractQuestionsFromPDFContent(
  pdfContent: string,
  grade: number,
  subject: "math" | "reading",
  year: number
): Promise<ExtractedSTAARQuestion[]> {
  try {
    const prompt = `
You are an expert at extracting and analyzing STAAR test questions from official Texas Education Agency test documents.

Analyze this ${year} STAAR Grade ${grade} ${subject} test content and extract all the multiple choice questions.

For each question you find, provide:
1. Question text (complete and accurate)
2. All answer choices (A, B, C, D)
3. Question number from the test
4. TEKS standard if mentioned
5. Whether the question references visual elements (charts, diagrams, images)
6. Difficulty level (low/medium/high based on grade appropriateness)
7. Category based on content area

IMPORTANT GUIDELINES:
- Extract ONLY authentic questions that appear in the test
- Maintain exact wording from the original test
- Include all answer choices exactly as written
- Note if questions reference visual elements like "the model below" or "the chart shows"
- For reading questions, include relevant passage context
- Categorize math questions by topic (Number & Operations, Algebraic Reasoning, Geometry, Data Analysis)
- Categorize reading questions by skill (Comprehension, Vocabulary, Literary Analysis, Text Features)

Return your response as a JSON array with this structure:
{
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "What is 7 × 8?",
      "answerChoices": ["A. 54", "B. 56", "C. 63", "D. 64"],
      "teksStandard": "3.4A",
      "hasImage": false,
      "imageDescription": null,
      "difficulty": "medium",
      "category": "Number & Operations"
    }
  ]
}

PDF Content to analyze:
${pdfContent.substring(0, 15000)} // Limit content to avoid token limits
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1 // Low temperature for consistency
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.questions || !Array.isArray(result.questions)) {
      console.warn(`No questions extracted from ${subject} grade ${grade} year ${year}`);
      return [];
    }

    // Transform to our interface format
    return result.questions.map((q: any): ExtractedSTAARQuestion => ({
      grade,
      subject,
      year,
      questionNumber: q.questionNumber || 0,
      questionText: q.questionText || "",
      answerChoices: q.answerChoices || [],
      correctAnswer: q.correctAnswer,
      teksStandard: q.teksStandard,
      hasImage: q.hasImage || false,
      imageDescription: q.imageDescription,
      difficulty: q.difficulty || "medium",
      category: q.category || (subject === "math" ? "Number & Operations" : "Comprehension")
    }));

  } catch (error) {
    console.error(`Error extracting questions from ${subject} grade ${grade} year ${year}:`, error);
    return [];
  }
}

/**
 * Process multiple PDF contents to build a comprehensive question bank
 */
export async function buildSTAARQuestionBank(pdfContents: { content: string; metadata: any }[]): Promise<ExtractedSTAARQuestion[]> {
  const allQuestions: ExtractedSTAARQuestion[] = [];
  
  console.log(`Processing ${pdfContents.length} STAAR test documents...`);
  
  for (const { content, metadata } of pdfContents) {
    const questions = await extractQuestionsFromPDFContent(
      content,
      metadata.grade,
      metadata.subject,
      metadata.year
    );
    
    allQuestions.push(...questions);
    console.log(`Extracted ${questions.length} questions from ${metadata.year} Grade ${metadata.grade} ${metadata.subject}`);
    
    // Add small delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Total questions extracted: ${allQuestions.length}`);
  return allQuestions;
}

/**
 * Generate SVG diagrams for math questions that reference visual elements
 */
export async function generateMathDiagram(questionText: string, imageDescription: string): Promise<string> {
  try {
    const prompt = `
Create an SVG diagram for this STAAR math question. The SVG should be educational, clear, and appropriate for elementary students.

Question: ${questionText}
Description: ${imageDescription}

Generate clean, simple SVG code that illustrates the mathematical concept. Use:
- Clear geometric shapes
- Appropriate colors (primary colors, not too bright)
- Readable text labels
- Proper scaling for web display
- Standard SVG format

Return only the SVG code, no explanation.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating math diagram:", error);
    return "";
  }
}

/**
 * Enhanced question generation using authentic STAAR patterns
 */
export async function generateSTAARStyleQuestion(
  grade: number,
  subject: "math" | "reading",
  teksStandard: string,
  category: string,
  questionBank: ExtractedSTAARQuestion[]
): Promise<ExtractedSTAARQuestion | null> {
  try {
    // Find similar questions from our authentic bank for pattern reference
    const similarQuestions = questionBank.filter(q => 
      q.grade === grade && 
      q.subject === subject && 
      (q.category === category || q.teksStandard === teksStandard)
    ).slice(0, 3);

    const examples = similarQuestions.map(q => 
      `Question: ${q.questionText}\nAnswers: ${q.answerChoices.join(", ")}`
    ).join("\n\n");

    const prompt = `
Generate a new STAAR-style question for Grade ${grade} ${subject} based on TEKS standard ${teksStandard} in the ${category} category.

Use these authentic STAAR questions as style references:
${examples}

Create a question that:
- Matches the authentic STAAR format and difficulty level
- Uses age-appropriate language for Grade ${grade}
- Follows TEKS standard ${teksStandard} requirements
- Has 4 multiple choice answers (A, B, C, D)
- Includes one clearly correct answer
- Uses realistic scenarios appropriate for elementary students

Return as JSON:
{
  "questionText": "Your question here",
  "answerChoices": ["A. choice1", "B. choice2", "C. choice3", "D. choice4"],
  "correctAnswer": "B",
  "difficulty": "medium",
  "hasImage": false
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      grade,
      subject,
      year: new Date().getFullYear(),
      questionNumber: 0,
      questionText: result.questionText,
      answerChoices: result.answerChoices,
      correctAnswer: result.correctAnswer,
      teksStandard,
      hasImage: result.hasImage || false,
      imageDescription: result.imageDescription,
      difficulty: result.difficulty || "medium",
      category
    };

  } catch (error) {
    console.error("Error generating STAAR-style question:", error);
    return null;
  }
}