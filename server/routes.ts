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
  app.get('/api/questions/:grade/:subject', isAuthenticated, async (req, res) => {
    try {
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const questions = await storage.getQuestionsByGradeAndSubject(grade, subject);
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

  // Practice attempt routes
  app.post('/api/practice/attempt', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = insertPracticeAttemptSchema.parse({
        ...req.body,
        userId,
      });
      
      const attempt = await storage.createPracticeAttempt(attemptData);
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
      
      if (grade && ![3, 4, 5].includes(grade)) {
        return res.status(400).json({ message: "Invalid grade" });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const history = await storage.getUserExamHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching exam history:", error);
      res.status(500).json({ message: "Failed to fetch exam history" });
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
