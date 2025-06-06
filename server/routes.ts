import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPracticeAttemptSchema, insertExamAttemptSchema, updateUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = updateUserSchema.parse(req.body);
      const user = await storage.updateUserProfile(userId, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Question routes
  app.get('/api/questions/:grade/:subject', async (req, res) => {
    try {
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      const { category } = req.query;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      let questions;
      if (category) {
        // Filter questions by TEKS standard category
        questions = await storage.getQuestionsByTeksStandard(grade, subject, category as string);
        
        // If no questions exist for this category, generate them in background and return sample questions immediately
        if (questions.length === 0) {
          console.log(`No questions found for ${grade} ${subject} ${category}, generating in background...`);
          
          // Generate questions in background without blocking the request
          setImmediate(async () => {
            try {
              const { generateQuestionWithPerplexity, getRandomTeksStandard } = await import('./questionGenerator');
              for (let i = 0; i < 3; i++) {
                try {
                  const teksStandard = getRandomTeksStandard(grade, subject as "math" | "reading", category as string);
                  const questionData = await generateQuestionWithPerplexity(grade, subject as "math" | "reading", teksStandard, category as string);
                  await storage.createQuestion(questionData);
                } catch (error) {
                  console.error(`Background question generation error:`, error);
                }
              }
            } catch (error) {
              console.error(`Background generation failed:`, error);
            }
          });
          
          // Return sample questions immediately
          const { SAMPLE_QUESTIONS } = await import('./questionGenerator');
          const sampleQuestions = SAMPLE_QUESTIONS[`grade${grade}` as keyof typeof SAMPLE_QUESTIONS]?.[subject as 'math' | 'reading'] || [];
          questions = sampleQuestions.slice(0, 3);
        }
      } else {
        questions = await storage.getQuestionsByGradeAndSubject(grade, subject);
        
        // If no questions exist at all, return sample questions immediately and generate in background
        if (questions.length === 0) {
          console.log(`No questions found for ${grade} ${subject}, using authentic samples and generating in background...`);
          
          // Generate questions in background without blocking the response
          setImmediate(async () => {
            try {
              const { generateQuestionWithPerplexity, getRandomTeksStandard } = await import('./questionGenerator');
              for (let i = 0; i < 5; i++) {
                try {
                  const teksStandard = getRandomTeksStandard(grade, subject as "math" | "reading");
                  const questionData = await generateQuestionWithPerplexity(grade, subject as "math" | "reading", teksStandard);
                  await storage.createQuestion(questionData);
                } catch (error) {
                  console.error(`Background question generation error:`, error);
                }
              }
            } catch (error) {
              console.error(`Background generation failed:`, error);
            }
          });
          
          // Return authentic sample questions immediately
          const { SAMPLE_QUESTIONS } = await import('./questionGenerator');
          const sampleQuestions = SAMPLE_QUESTIONS[`grade${grade}` as keyof typeof SAMPLE_QUESTIONS]?.[subject as 'math' | 'reading'] || [];
          questions = sampleQuestions.slice(0, 5);
        }
      }
      
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.get('/api/questions/:grade/:subject/:teksStandard', isAuthenticated, async (req, res) => {
    try {
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      const teksStandard = req.params.teksStandard;
      
      const questions = await storage.getQuestionsByTeksStandard(grade, subject, teksStandard);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions by TEKS:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // AI-powered practice question generation
  app.post('/api/questions/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { grade, subject, category, count = 5 } = req.body;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      // Get authentic STAAR questions as examples
      const sampleQuestions = await storage.getQuestionsByGradeAndSubject(grade, subject);
      
      if (!sampleQuestions.length) {
        return res.status(404).json({ message: "No sample questions found" });
      }

      // Use Perplexity AI to generate similar questions
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are an expert Texas STAAR test question generator. Create ${count} authentic practice questions similar to official STAAR ${grade}th grade ${subject} tests${category ? ` focused specifically on ${category}` : ''}. Each question must follow STAAR format exactly with 4 multiple choice options. Return only valid JSON format.`
            },
            {
              role: 'user', 
              content: `Generate ${count} STAAR Grade ${grade} ${subject} practice questions${category ? ` specifically focused on TEKS standard ${category}` : ''} matching these authentic patterns from official Texas Education Agency tests:

${sampleQuestions.slice(0, 3).map((q, i) => `
Example ${i + 1} (TEKS ${q.teksStandard}):
Question: ${q.questionText}
Options: ${JSON.stringify(q.answerChoices)}
Correct Answer: ${q.correctAnswer}
Explanation: ${q.explanation}
`).join('\n')}

${category ? `ALL questions must target TEKS standard ${category} skills and concepts specifically. Use the category name as the exact TEKS standard. ` : ''}Create new questions that test the SAME skills as the examples but with completely different scenarios. Use Texas contexts (cities, schools, sports teams). Follow exact STAAR question structure and format.

Requirements:
- Each question must target the specific TEKS standard requested
- Use real-world Texas scenarios and contexts
- Follow authentic STAAR difficulty and format patterns
- Include clear explanations showing the solution process

Respond with JSON array:
[{
  "questionText": "...",
  "answerChoices": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."}],
  "correctAnswer": "A",
  "explanation": "...",
  "teksStandard": "${category || `${grade}.General`}"
}]`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const aiResponse = await response.json();
      let generatedQuestions;
      
      try {
        generatedQuestions = JSON.parse(aiResponse.choices[0].message.content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse.choices[0].message.content);
        return res.status(500).json({ message: "Failed to generate valid questions" });
      }

      // Save generated questions to database
      const savedQuestions = [];
      for (const q of generatedQuestions) {
        const question = await storage.createQuestion({
          questionText: q.questionText,
          answerChoices: q.answerChoices,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          grade,
          subject,
          year: new Date().getFullYear(),
          teksStandard: q.teksStandard || `${grade}.AI`,
          difficulty: 'medium'
        });
        savedQuestions.push(question);
      }

      res.json(savedQuestions);
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Get available TEKS categories for a grade/subject
  app.get('/api/questions/categories/:grade/:subject', isAuthenticated, async (req, res) => {
    try {
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const { getTeksCategories } = await import('./questionGenerator');
      const categories = getTeksCategories(grade, subject as "math" | "reading");
      
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Generate questions for specific TEKS category
  app.post('/api/questions/generate-category', isAuthenticated, async (req: any, res) => {
    try {
      const { grade, subject, category, count = 5 } = req.body;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const { generateQuestionWithPerplexity, getRandomTeksStandard } = await import('./questionGenerator');
      
      const questions = [];
      for (let i = 0; i < count; i++) {
        try {
          const teksStandard = getRandomTeksStandard(grade, subject as "math" | "reading", category);
          const questionData = await generateQuestionWithPerplexity(grade, subject as "math" | "reading", teksStandard, category);
          
          // Save to database
          const savedQuestion = await storage.createQuestion(questionData);
          questions.push(savedQuestion);
        } catch (error) {
          console.error(`Error generating question ${i + 1}:`, error);
          // Continue with other questions
        }
      }

      if (questions.length === 0) {
        return res.status(500).json({ message: "Failed to generate any questions" });
      }

      res.json(questions);
    } catch (error) {
      console.error("Error generating category questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Practice attempt routes
  app.post('/api/practice/attempt', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = insertPracticeAttemptSchema.parse({
        ...req.body,
        userId,
      });
      
      const attempt = await storage.createPracticeAttempt(attemptData);
      
      // Award starpower for correct answers
      if (attempt.isCorrect) {
        const starpowerEarned = 10; // 10 starpower per correct answer
        await storage.addStarPowerHistory({
          userId,
          amount: starpowerEarned,
          source: 'practice',
          description: 'Correct answer in practice session'
        });
        
        // Update user's total starpower
        const currentUser = await storage.getUser(userId);
        if (currentUser) {
          await storage.updateUserProfile(userId, {
            starPower: (currentUser.starPower || 0) + starpowerEarned
          });
        }
      }
      
      res.json(attempt);
    } catch (error) {
      console.error("Error creating practice attempt:", error);
      res.status(500).json({ message: "Failed to save practice attempt" });
    }
  });

  app.get('/api/practice/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const history = await storage.getUserPracticeHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching practice history:", error);
      res.status(500).json({ message: "Failed to fetch practice history" });
    }
  });

  // Mock exam routes
  app.get('/api/exams', isAuthenticated, async (req, res) => {
    try {
      const grade = req.query.grade ? parseInt(req.query.grade as string) : null;
      
      if (grade && ![3, 4, 5].includes(grade)) {
        return res.status(400).json({ message: "Invalid grade" });
      }

      // If no grade specified, return all exams
      if (!grade) {
        const allExams = [];
        for (const g of [3, 4, 5]) {
          const gradeExams = await storage.getMockExams(g);
          allExams.push(...gradeExams);
        }
        return res.json(allExams);
      }

      const exams = await storage.getMockExams(grade);
      res.json(exams);
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      res.status(500).json({ message: "Failed to fetch mock exams" });
    }
  });

  app.get('/api/exams/:grade', isAuthenticated, async (req, res) => {
    try {
      const grade = parseInt(req.params.grade);
      
      if (![3, 4, 5].includes(grade)) {
        return res.status(400).json({ message: "Invalid grade" });
      }

      const exams = await storage.getMockExams(grade);
      res.json(exams);
    } catch (error) {
      console.error("Error fetching mock exams:", error);
      res.status(500).json({ message: "Failed to fetch mock exams" });
    }
  });

  // Add exam start endpoint
  app.post('/api/exams/:examId/start', isAuthenticated, async (req: any, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const userId = req.user.claims.sub;
      
      // Create exam attempt record
      const attemptData = {
        userId,
        examId,
        totalQuestions: 40, // Standard STAAR exam length
        correctAnswers: 0,
        completed: false,
        score: "0",
        timeSpent: 0
      };
      
      const attempt = await storage.createExamAttempt(attemptData);
      res.json({ success: true, attemptId: attempt.id });
    } catch (error) {
      console.error("Error starting exam:", error);
      res.status(500).json({ message: "Failed to start exam" });
    }
  });

  // Add exam details endpoint
  app.get('/api/exams/details/:examId', isAuthenticated, async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      
      // Get exam details from all grades
      let specificExam = null;
      for (const grade of [3, 4, 5]) {
        const exams = await storage.getMockExams(grade);
        const found = exams.find((e: any) => e.id === examId);
        if (found) {
          specificExam = found;
          break;
        }
      }
      
      if (!specificExam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      // Get authentic STAAR question counts and time limits
      const { STAAR_QUESTION_COUNTS } = await import('./examGenerator');
      const grade = specificExam.grade;
      const subject = specificExam.subject;
      
      const questionCount = STAAR_QUESTION_COUNTS[grade as keyof typeof STAAR_QUESTION_COUNTS]?.[subject as 'math' | 'reading'] || 40;
      const timeLimit = subject === 'math' ? 240 : 240; // 240 minutes (4 hours) for most STAAR tests
      
      // Get questions for this exam
      const questions = await storage.getQuestionsByGradeAndSubject(grade, subject);
      const examQuestions = questions.slice(0, questionCount).map(q => ({
        id: q.id,
        questionText: q.questionText,
        answerChoices: q.answerChoices,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        teksStandard: q.teksStandard
      }));

      const examWithQuestions = {
        ...specificExam,
        questions: examQuestions,
        questionCount,
        timeLimit: timeLimit * 60, // Convert to seconds
        subject: subject.charAt(0).toUpperCase() + subject.slice(1) // Capitalize subject
      };

      res.json(examWithQuestions);
    } catch (error) {
      console.error("Error fetching exam details:", error);
      res.status(500).json({ message: "Failed to fetch exam details" });
    }
  });

  // Initialize mock exams for all grades
  app.post('/api/exams/initialize', async (req, res) => {
    try {
      const { initializeMockExams } = await import('./examGenerator');
      await initializeMockExams();
      res.json({ message: "Mock exams initialized successfully" });
    } catch (error) {
      console.error("Error initializing mock exams:", error);
      res.status(500).json({ message: "Failed to initialize mock exams" });
    }
  });

  app.post('/api/exams/attempt', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = insertExamAttemptSchema.parse({
        ...req.body,
        userId,
      });
      
      const attempt = await storage.createExamAttempt(attemptData);
      res.json(attempt);
    } catch (error) {
      console.error("Error creating exam attempt:", error);
      res.status(500).json({ message: "Failed to start exam attempt" });
    }
  });

  app.get('/api/exams/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const grade = req.query.grade ? parseInt(req.query.grade as string) : null;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (grade && ![3, 4, 5].includes(grade)) {
        return res.status(400).json({ message: "Invalid grade" });
      }
      
      const history = await storage.getUserExamHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching exam history:", error);
      res.status(500).json({ message: "Failed to fetch exam history" });
    }
  });

  // Generate additional mock exams
  app.post('/api/generate-exams', isAuthenticated, async (req: any, res) => {
    try {
      console.log('Starting generation of 6 practice tests per grade/subject...');
      
      const grades = [3, 4, 5];
      const subjects: ('math' | 'reading')[] = ['math', 'reading'];
      let totalGenerated = 0;
      
      for (const grade of grades) {
        for (const subject of subjects) {
          // Generate 6 practice tests per grade/subject combination
          for (let examNumber = 1; examNumber <= 6; examNumber++) {
            try {
              const examName = `STAAR Grade ${grade} ${subject === 'math' ? 'Mathematics' : 'Reading'} Practice Test ${examNumber}`;
              
              // Check if exam already exists
              const existingExams = await storage.getMockExams(grade);
              const examExists = existingExams.find(exam => exam.name === examName);
              
              if (!examExists) {
                const questionCount = subject === 'math' 
                  ? (grade === 3 ? 36 : grade === 4 ? 40 : 36)
                  : (grade === 3 ? 40 : grade === 4 ? 44 : 46);

                await storage.createMockExam({
                  name: examName,
                  grade,
                  subject,
                  totalQuestions: questionCount,
                  timeLimit: subject === 'math' ? 240 : 180
                });
                
                totalGenerated++;
                console.log(`Generated: ${examName}`);
              }
            } catch (error) {
              console.error(`Error generating exam ${examNumber} for Grade ${grade} ${subject}:`, error);
            }
          }
        }
      }
      
      res.json({ 
        message: `Mock exams generated successfully. Created ${totalGenerated} new exams.`,
        totalGenerated 
      });
    } catch (error) {
      console.error('Error generating mock exams:', error);
      res.status(500).json({ message: "Failed to generate mock exams" });
    }
  });

  // Nova AI Chat endpoint
  app.post('/api/nova-chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, grade } = req.body;
      
      if (!message || !grade) {
        return res.status(400).json({ message: "Message and grade are required" });
      }

      // Create a kid-friendly prompt for Nova
      const prompt = `You are Nova, a friendly AI learning buddy for ${grade}th grade students preparing for STAAR tests. 
      
      Your personality:
      - Enthusiastic and encouraging, providing detailed explanations
      - Use simple language appropriate for ${grade}th graders
      - Be supportive and patient
      - Include occasional star emojis ⭐ but don't overuse them
      - Give specific, helpful advice about math and reading with step-by-step explanations
      - Provide detailed responses (4-6 sentences) that thoroughly explain concepts
      - Break down complex ideas into simple steps
      - Use examples and analogies that ${grade}th graders can understand
      
      Student message: "${message}"
      
      Respond as Nova would, being helpful and encouraging about their STAAR test preparation. Give detailed explanations with clear steps.`;

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
              content: prompt
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "Hi there! I'm having trouble thinking right now. Can you try asking me again? ⭐";

      res.json({ response: aiResponse });
    } catch (error) {
      console.error('Error in Nova chat:', error);
      res.status(500).json({ response: "Sorry, I'm having trouble right now. Let's try again! ⭐" });
    }
  });

  // Progress and stats routes
  app.get('/api/progress/:grade', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const grade = parseInt(req.params.grade);
      
      if (![3, 4, 5].includes(grade)) {
        return res.status(400).json({ message: "Invalid grade" });
      }

      const progress = await storage.getUserProgress(userId, grade);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get('/api/stats/:grade/:subject', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const stats = await storage.getUserStats(userId, grade, subject);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Star Power statistics route
  app.get('/api/star-power/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getStarPowerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching star power stats:", error);
      res.status(500).json({ message: "Failed to fetch star power statistics" });
    }
  });

  // Overall accuracy tracking route
  app.get('/api/accuracy/overall', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accuracy = await storage.getOverallAccuracy(userId);
      res.json(accuracy);
    } catch (error) {
      console.error("Error fetching overall accuracy:", error);
      res.status(500).json({ message: "Failed to fetch overall accuracy statistics" });
    }
  });

  // Module-specific accuracy route
  app.get('/api/accuracy/:grade/:subject', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const accuracy = await storage.getModuleAccuracy(userId, grade, subject);
      res.json(accuracy);
    } catch (error) {
      console.error("Error fetching module accuracy:", error);
      res.status(500).json({ message: "Failed to fetch module accuracy statistics" });
    }
  });

  // AI Study Assistant routes
  app.post('/api/chat/explain', isAuthenticated, async (req: any, res) => {
    try {
      const { question, userAnswer, correctAnswer, grade, subject } = req.body;
      
      const prompt = `You are a helpful tutor for Texas ${grade}th grade ${subject}. A student answered "${userAnswer}" but the correct answer is "${correctAnswer}" for this question: "${question}". 

Please provide a clear, age-appropriate explanation in 2-3 sentences that:
1. Explains why the correct answer is right
2. Helps the student understand the concept
3. Encourages them to keep learning

Keep your response simple and encouraging for a ${grade}th grader.`;

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
              content: 'You are a patient, encouraging tutor for elementary students preparing for STAAR tests in Texas.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      const explanation = data.choices[0].message.content;

      res.json({ explanation });
    } catch (error) {
      console.error('Error generating explanation:', error);
      res.status(500).json({ message: 'Failed to generate explanation' });
    }
  });

  app.post('/api/chat/help', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, grade, subject } = req.body;
      
      const prompt = `Explain ${topic} to a ${grade}th grade student in Texas studying for the STAAR ${subject} test. Use simple language, examples, and encourage practice. Keep it brief and helpful.`;

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
              content: 'You are a helpful tutor for Texas elementary students. Provide clear, age-appropriate explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      const help = data.choices[0].message.content;

      res.json({ help });
    } catch (error) {
      console.error('Error generating help:', error);
      res.status(500).json({ message: 'Failed to generate help' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
