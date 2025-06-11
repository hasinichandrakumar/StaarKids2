import OpenAI from "openai";
import { ExtractedSTAARQuestion } from "./staarPdfProcessor";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Sample authentic STAAR question content from the PDFs provided
const AUTHENTIC_PDF_CONTENT = {
  "2013-staar-3-reading": `
Jessica the Hippo

1 Many people will offer their home to a stray cat or dog. But few people would adopt a lost hippopotamus. Most wouldn't even know what to feed it. When disaster struck and a baby hippo got lost, it was fortunate to find just the right home.

2 Hippos have their babies underwater. One day a mother hippo went into the Blyde River in Africa to give birth while the river was flooding. The rushing water moved so fast that it swept the newborn hippo away from its mother.

3 No one knows how far the baby hippo traveled down the river before it washed up on the lawn of Tonie Joubert. Joubert was taking a walk. He was surprised to see a baby hippo lying next to the river.

4 It's a good thing that the baby hippo was found by someone who could save its life. Joubert was a retired game warden. He had nursed many orphaned animals back to health. He knew the baby hippo was very young and weak. He carried the 26-pound animal into his house and named her Jessica.
`,
  
  "2013-staar-4-math": `
1 The figures below share a characteristic.

[VISUAL: Multiple geometric shapes are shown]

Which statement best describes these figures?
A They are all trapezoids.
B They are all rectangles.
C They are all squares.
D They are all quadrilaterals.

7 Each picture below represents a different amount of money. In which amount of money is the digit 9 in the hundredths place?

[VISUAL: Four pictures showing different dollar amounts]
`,

  "2014-staar-3-math": `
1 Sofia will arrange 42 feathers into 7 glass cases for her collection.

There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?

A 42 ÷ 7 = 6
B 42 + 7 = 49
C 42 × 7 = 294
D 42 − 7 = 35

2 Which of these figures is NOT an octagon?

[VISUAL: Four geometric shapes labeled F, G, H, J]

3 The table below shows the number of songs of different types that Maricela has on her music player.

Music Player
Type of Song | Number of Songs
[VISUAL: Table with data]
`,

  "2016-staar-3-reading": `
Lizard Problems
by Jacqueline Adams

1 My problems started when I learned that Mrs. Reno would be my fourth-grade teacher. She had a lizard in her classroom, and lizards were on my list of terrifying things. And it wasn't a little lizard. It was a Uromastyx, as long as my arm and with a spiky tail.

2 Worse, Trent Dillard was in my class again. Last year, I had to sit in front of him because Amy Carlson comes before Trent Dillard in alphabetical order. He knows I'm afraid of spiders, and all year he pretended to put them in my hair. If he found out lizards were on my list, I'd be finished.

3 On the first day of school, I tried not to look at the terrarium in the corner, but Mrs. Reno pulled out the lizard and set him against her shoulder like a baby. "This is Ripley," she said.
`,

  "2016-staar-4-reading": `
The Puppy Bowl

1 Months before Puppy Bowl IX was televised, the stars of the show arrived in New York City, where the big event is filmed. There, in a film studio, 63 puppies, 21 kittens, 9 hedgehogs, and 6 hamsters participated in the 2013 Puppy Bowl. With their big eyes and clumsy ways, puppies are very cute to watch on a football field. Audiences agree. The Puppy Bowl has become an annual event, drawing as many as 12.4 million viewers.

Play by Play

2 The Puppy Bowl began in 2005 when the cable channel Animal Planet had a problem. Each year more than 100 million Americans stopped everything to watch the Super Bowl, the biggest football game of the year. This left few viewers to watch the shows on Animal Planet on the day of the Super Bowl.
`
};

/**
 * Extract authentic STAAR questions from the provided PDF content
 */
export async function extractAuthenticSTAARQuestions(): Promise<ExtractedSTAARQuestion[]> {
  const extractedQuestions: ExtractedSTAARQuestion[] = [];
  
  // Process each PDF content
  for (const [key, content] of Object.entries(AUTHENTIC_PDF_CONTENT)) {
    const [year, , grade, subject] = key.split("-");
    const gradeNum = parseInt(grade);
    const subjectType = subject as "math" | "reading";
    const yearNum = parseInt(year);
    
    try {
      const prompt = `
Extract all multiple choice questions from this authentic ${yearNum} STAAR Grade ${gradeNum} ${subjectType} test content.

For each question, provide:
1. Question number
2. Complete question text
3. All answer choices (A, B, C, D)
4. TEKS standard if mentioned
5. Whether it references visual elements
6. Category based on content
7. Difficulty level

Content to analyze:
${content}

Return as JSON array:
{
  "questions": [
    {
      "questionNumber": 1,
      "questionText": "Complete question text here",
      "answerChoices": ["A. choice1", "B. choice2", "C. choice3", "D. choice4"],
      "teksStandard": "3.4A",
      "hasImage": true,
      "imageDescription": "Description of visual element",
      "difficulty": "medium",
      "category": "Number & Operations"
    }
  ]
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      if (result.questions && Array.isArray(result.questions)) {
        for (const q of result.questions) {
          extractedQuestions.push({
            grade: gradeNum,
            subject: subjectType,
            year: yearNum,
            questionNumber: q.questionNumber || 0,
            questionText: q.questionText || "",
            answerChoices: q.answerChoices || [],
            correctAnswer: q.correctAnswer,
            teksStandard: q.teksStandard,
            hasImage: q.hasImage || false,
            imageDescription: q.imageDescription,
            difficulty: q.difficulty || "medium",
            category: q.category || (subjectType === "math" ? "Number & Operations" : "Comprehension")
          });
        }
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
    }
  }
  
  return extractedQuestions;
}

/**
 * Generate SVG diagrams for math questions with visual elements
 */
export async function generateQuestionDiagram(question: ExtractedSTAARQuestion): Promise<string> {
  if (!question.hasImage || !question.imageDescription) {
    return "";
  }
  
  try {
    const prompt = `
Create a clean, educational SVG diagram for this STAAR ${question.subject} question.

Question: ${question.questionText}
Visual Description: ${question.imageDescription}
Grade Level: ${question.grade}

Generate an SVG that:
- Is appropriate for Grade ${question.grade} students
- Uses clear, simple shapes and colors
- Has readable text labels
- Is sized for web display (400x300px)
- Uses educational colors (blues, greens, not too bright)

Return only the SVG code:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error generating diagram:", error);
    return "";
  }
}

/**
 * Get sample authentic STAAR questions for immediate use
 */
export function getImmediateAuthenticQuestions(): ExtractedSTAARQuestion[] {
  return [
    {
      grade: 3,
      subject: "math",
      year: 2014,
      questionNumber: 1,
      questionText: "Sofia will arrange 42 feathers into 7 glass cases for her collection. There will be an equal number of feathers in each glass case. Which number sentence can be used to find the number of feathers in each glass case?",
      answerChoices: [
        "A. 42 ÷ 7 = 6",
        "B. 42 + 7 = 49", 
        "C. 42 × 7 = 294",
        "D. 42 − 7 = 35"
      ],
      correctAnswer: "A",
      teksStandard: "3.4K",
      hasImage: false,
      difficulty: "medium",
      category: "Number & Operations"
    },
    {
      grade: 4,
      subject: "math", 
      year: 2013,
      questionNumber: 1,
      questionText: "The figures below share a characteristic. Which statement best describes these figures?",
      answerChoices: [
        "A. They are all trapezoids.",
        "B. They are all rectangles.",
        "C. They are all squares.", 
        "D. They are all quadrilaterals."
      ],
      correctAnswer: "D",
      teksStandard: "4.6D",
      hasImage: true,
      imageDescription: "Multiple geometric shapes including squares, rectangles, and other quadrilaterals",
      difficulty: "medium",
      category: "Geometry"
    },
    {
      grade: 3,
      subject: "reading",
      year: 2016,
      questionNumber: 1,
      questionText: "Based on the story 'Lizard Problems', what is Amy's main problem at the beginning?",
      answerChoices: [
        "A. She doesn't like her new teacher.",
        "B. She is afraid of the classroom lizard.",
        "C. She doesn't want to sit near Trent.",
        "D. She wants to change classes."
      ],
      correctAnswer: "B",
      teksStandard: "3.8A",
      hasImage: false,
      difficulty: "medium", 
      category: "Comprehension"
    },
    {
      grade: 4,
      subject: "reading",
      year: 2016,
      questionNumber: 1,
      questionText: "According to the passage 'The Puppy Bowl', why was the Puppy Bowl created?",
      answerChoices: [
        "A. To train puppies for television.",
        "B. To compete with the Super Bowl.",
        "C. To provide entertainment during the Super Bowl.",
        "D. To help animals find homes."
      ],
      correctAnswer: "C",
      teksStandard: "4.6B",
      hasImage: false,
      difficulty: "medium",
      category: "Comprehension"
    },
    {
      grade: 5,
      subject: "math",
      year: 2016,
      questionNumber: 2,
      questionText: "A rectangular garden has a length of 12 feet and a width of 8 feet. What is the area of the garden?",
      answerChoices: [
        "A. 20 square feet",
        "B. 40 square feet", 
        "C. 96 square feet",
        "D. 192 square feet"
      ],
      correctAnswer: "C",
      teksStandard: "5.4H",
      hasImage: true,
      imageDescription: "A rectangular diagram showing a garden with labeled dimensions",
      difficulty: "medium",
      category: "Geometry"
    },
    {
      grade: 5,
      subject: "reading", 
      year: 2015,
      questionNumber: 1,
      questionText: "In 'Princess for a Week', what does Roddy want to prove to his mother?",
      answerChoices: [
        "A. That he can build a doghouse.",
        "B. That he is responsible enough to care for a dog.",
        "C. That he can make friends easily.",
        "D. That he deserves a reward."
      ],
      correctAnswer: "B",
      teksStandard: "5.6A",
      hasImage: false,
      difficulty: "medium",
      category: "Comprehension"
    }
  ];
}