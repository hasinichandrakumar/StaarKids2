import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupGoogleAuth } from "./googleAuth";
import { insertPracticeAttemptSchema, insertExamAttemptSchema, updateUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("Registering routes...");
  
  // Test endpoint to verify API routes are working
  app.get("/api/test", (req, res) => {
    console.log("=== API TEST ENDPOINT REACHED ===");
    res.json({ message: "API routes are working", timestamp: new Date().toISOString() });
  });
  
  // CRITICAL: Add OAuth callback route using API prefix to bypass Vite
  app.get("/api/oauth/google/callback", async (req, res) => {
    console.log("=== OAUTH GOOGLE CALLBACK REACHED ===");
    console.log("Query params:", req.query);
    
    const { code, error } = req.query;
    
    if (error) {
      console.error("OAuth error:", error);
      return res.redirect("/?error=oauth_error");
    }
    
    if (!code) {
      console.error("No authorization code received");
      return res.redirect("/?error=no_code");
    }

    try {
      const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
      const redirectUri = "https://staarkids.org/api/oauth/google/callback";

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokens = await tokenResponse.json();
      console.log("Token response status:", tokenResponse.status);
      
      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", tokens);
        return res.redirect("/?error=token_exchange_failed");
      }

      // Get user info
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const googleUser = await userResponse.json();
      console.log("Google user info:", googleUser);
      
      if (!userResponse.ok) {
        console.error("Failed to get user info:", googleUser);
        return res.redirect("/?error=user_info_failed");
      }

      // Create or update user in database
      const { storage } = await import("./storage");
      const user = await storage.upsertUser({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || "",
        lastName: googleUser.family_name || "",
        profileImageUrl: googleUser.picture || "",
      });

      // Set session
      (req.session as any).userId = user.id;
      console.log("Session updated with user ID:", user.id);
      
      res.redirect("/");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/?error=callback_error");
    }
  });

  // Get authentic STAAR questions for homepage with diverse visual questions
  app.get("/api/sample-questions", async (req, res) => {
    try {
      const { getHomepageAuthenticQuestions } = await import("./populateAuthenticQuestions");
      const { generateDiverseSTAARQuestions } = await import("./diverseQuestionGenerator");
      
      // Get base authentic questions
      const authenticQuestions = getHomepageAuthenticQuestions();
      
      // Generate additional diverse questions with visual elements
      const diverseQuestions = [];
      for (const grade of [3, 4, 5]) {
        for (const subject of ["math", "reading"] as const) {
          const questions = await generateDiverseSTAARQuestions(grade, subject, 2);
          diverseQuestions.push(...questions);
        }
      }
      
      // Convert diverse questions to the expected format
      const formattedDiverseQuestions = diverseQuestions.map((q, index) => ({
        id: 1000 + index, // Start from 1000 to avoid conflicts
        grade: q.grade,
        subject: q.subject,
        teksStandard: q.teksStandard,
        questionText: q.questionText,
        answerChoices: Array.isArray(q.answerChoices) 
          ? q.answerChoices.map(choice => `${choice.id}. ${choice.text}`)
          : [],
        correctAnswer: q.correctAnswer,
        category: q.category || "General",
        isFromRealSTAAR: q.isFromRealSTAAR || false,
        year: q.year || 2024,
        hasImage: q.hasImage || false,
        imageDescription: q.imageDescription
      }));
      
      // Combine authentic and diverse questions, ensuring good mix of visual questions
      const allQuestions = [...authenticQuestions, ...formattedDiverseQuestions];
      
      res.json(allQuestions);
    } catch (error) {
      console.error("Error fetching diverse STAAR questions:", error);
      res.status(500).json({ message: "Failed to fetch sample questions" });
    }
  });

  // Get questions from database with filtering
  app.get("/api/questions", async (req, res) => {
    try {
      const { grade, subject, category, limit = "10" } = req.query;
      const { db } = await import("./db");
      const { questions } = await import("@shared/schema");
      const { eq, and } = await import("drizzle-orm");
      
      const conditions = [];
      
      if (grade) {
        conditions.push(eq(questions.grade, parseInt(grade as string)));
      }
      
      if (subject) {
        conditions.push(eq(questions.subject, subject as string));
      }
      
      if (category) {
        conditions.push(eq(questions.category, category as string));
      }
      
      const result = await db.select().from(questions)
        .where(conditions.length > 0 ? (conditions.length === 1 ? conditions[0] : and(...conditions)) : undefined)
        .limit(parseInt(limit as string)) as any;
      res.json(result);
      
    } catch (error) {
      console.error("Error fetching questions from database:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Get question bank statistics
  app.get("/api/questions/stats", async (req, res) => {
    try {
      const { getQuestionBankStats } = await import("./initializeQuestionBank");
      const stats = await getQuestionBankStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching question bank stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Get SVG diagrams for questions with visual elements
  app.get("/api/question-svg/:questionId", async (req, res) => {
    try {
      const { getQuestionSVG } = await import("./svgGenerator");
      const { getHomepageAuthenticQuestions } = await import("./populateAuthenticQuestions");
      
      const questionId = parseInt(req.params.questionId);
      
      // First check authentic questions
      const authenticQuestions = getHomepageAuthenticQuestions();
      let question = authenticQuestions.find(q => q.id === questionId);
      
      // If not found in authentic questions, generate fallback visual content
      if (!question) {
        console.log("Generating visual content for question ID:", questionId);
      }
      
      // If still not found, generate a fallback SVG based on question ID
      if (!question) {
        const fallbackQuestionData = {
          questionText: "Visual diagram for this question",
          imageDescription: "Mathematical or reading comprehension visual element",
          grade: Math.floor((questionId % 3) + 3), // Grade 3-5
          year: 2024
        };
        
        const svg = getQuestionSVG(
          fallbackQuestionData.questionText,
          fallbackQuestionData.imageDescription,
          fallbackQuestionData.grade,
          fallbackQuestionData.year
        );
        
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
        return;
      }
      
      if (!question.hasImage) {
        return res.status(404).json({ message: "Question has no visual elements" });
      }
      
      const svg = getQuestionSVG(
        question.questionText, 
        question.imageDescription || "Visual element for this question", 
        question.grade, 
        question.year
      );
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(svg);
    } catch (error) {
      console.error("Error generating question SVG:", error);
      res.status(500).json({ message: "Failed to generate diagram" });
    }
  });

  // Demo mode routes - provide sample data without authentication
  app.get("/api/demo/stats", (req, res) => {
    res.json({
      totalQuestions: 245,
      correctAnswers: 189,
      accuracy: 77,
      streak: 5,
      timeSpent: 3420,
      recentSessions: 12,
      mathAccuracy: 75,
      readingAccuracy: 80,
      weeklyProgress: [65, 70, 72, 75, 77, 80, 77]
    });
  });

  app.get("/api/demo/star-power/stats", (req, res) => {
    res.json({
      currentStarPower: 1250,
      totalEarned: 3420,
      rank: "Explorer",
      nextRankThreshold: 1500,
      dailyGoal: 50,
      dailyProgress: 35,
      achievements: ["First Victory", "Math Master", "Reading Champion"],
      weeklyStats: [45, 60, 55, 70, 65, 75, 35]
    });
  });

  app.get("/api/demo/accuracy", (req, res) => {
    res.json({
      overall: 77,
      math: 75,
      reading: 80,
      recent: [70, 75, 80, 77, 82, 75, 78],
      byCategory: {
        "Number & Operations": 78,
        "Geometry": 72,
        "Measurement": 80,
        "Data Analysis": 75,
        "Comprehension": 82,
        "Vocabulary": 76
      }
    });
  });

  // AI Question Generation API
  app.post("/api/questions/generate", async (req, res) => {
    try {
      const { grade, subject, count = 1, category, teksStandard, includeVisual = false } = req.body;
      
      if (![3, 4, 5].includes(grade) || !["math", "reading"].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const { generateAuthenticPatternQuestions } = await import("./workingQuestionGenerator");
      
      const questions = await generateAuthenticPatternQuestions(grade, subject, Math.min(count, 20), {
        category,
        teksStandard
      });

      res.json({ questions, generated: questions.length });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  // Generate practice set with mixed questions
  app.post("/api/practice/generate", async (req, res) => {
    try {
      const { grade, subject, count = 5, difficulty = "mixed" } = req.body;
      
      if (![3, 4, 5].includes(grade) || !["math", "reading"].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const { generateMixedPracticeQuestions } = await import("./workingQuestionGenerator");
      
      const result = await generateMixedPracticeQuestions(grade, subject, count);
      res.json(result);
    } catch (error) {
      console.error("Error generating practice set:", error);
      res.status(500).json({ message: "Failed to generate practice set" });
    }
  });

  // Math SVG image generation endpoint
  app.get('/api/question-svg/:questionId', async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      
      // Get question details to determine image type
      const question = await storage.getQuestionById(questionId);
      
      if (!question || !question.hasImage) {
        return res.status(404).json({ message: "Image not found" });
      }

      const { generateMathSVG } = require("./mathImageGenerator");
      
      const imageConfig = {
        questionId,
        questionType: question.category || "default",
        grade: question.grade,
        subject: question.subject,
        imageDescription: question.imageDescription || ""
      };
      
      const svgContent = generateMathSVG(imageConfig);
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(svgContent);
    } catch (error) {
      console.error("Error generating math SVG:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  // Add test route to verify routing works
  app.get("/test-route", (req, res) => {
    console.log("=== TEST ROUTE REACHED ===");
    res.json({ message: "Test route working", path: req.path });
  });

  async function handleGoogleCallback(req: any, res: any) {
    
    const { code, error } = req.query;
    
    if (error) {
      console.error("OAuth error:", error);
      return res.redirect("/?error=oauth_error");
    }
    
    if (!code) {
      console.error("No authorization code received");
      return res.redirect("/?error=no_code");
    }

    try {
      const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
      const redirectUri = "https://staarkids.org/api/oauth/google/callback";

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokens = await tokenResponse.json();
      console.log("Token response status:", tokenResponse.status);
      
      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", tokens);
        return res.redirect("/?error=token_exchange_failed");
      }

      // Get user info
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const googleUser = await userResponse.json();
      console.log("Google user info:", googleUser);
      
      if (!userResponse.ok) {
        console.error("Failed to get user info:", googleUser);
        return res.redirect("/?error=user_info_failed");
      }

      // Create or update user in database
      const { storage } = await import("./storage");
      const user = await storage.upsertUser({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || "",
        lastName: googleUser.family_name || "",
        profileImageUrl: googleUser.picture || "",
      });

      // Set session
      (req.session as any).userId = user.id;
      console.log("Session updated with user ID:", user.id);
      
      res.redirect("/");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.redirect("/?error=callback_error");
    }
  }
  
  // Initialize authentic STAAR question bank
  const { initializeAuthenticQuestionBank } = await import("./initializeQuestionBank");
  await initializeAuthenticQuestionBank();

  // Auth middleware (Replit auth)
  console.log("Setting up Replit auth...");
  await setupAuth(app);
  
  // Setup Google OAuth routes for login
  console.log("Setting up Google OAuth login routes...");
  setupGoogleAuth(app);
  
  // Add our clean Google OAuth route with a completely different path
  app.get("/api/google-auth", (req, res) => {
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const redirectUri = "https://staarkids.org/api/oauth/google/callback";
    
    console.log("=== WORKING GOOGLE OAUTH ROUTE ===");
    console.log("Client ID:", `"${clientId}"`);
    
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const authUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=profile%20email&access_type=offline&prompt=consent`;
    
    console.log("Working OAuth URL:", authUrl);
    res.redirect(authUrl);
  });
  
  // Also add to the conflicting route as backup
  app.get("/api/auth/google", (req, res) => {
    const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
    const redirectUri = "https://staarkids.org/api/oauth/google/callback";
    
    console.log("=== BACKUP GOOGLE OAUTH ROUTE ===");
    console.log("Client ID:", `"${clientId}"`);
    
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const authUrl = `${baseUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=profile%20email&access_type=offline&prompt=consent`;
    
    console.log("Backup OAuth URL:", authUrl);
    res.redirect(authUrl);
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      // Handle different authentication methods
      let userId: string;
      
      // Direct Google OAuth session
      if (req.session?.userId) {
        userId = req.session.userId;
      }
      // Passport-based auth (Replit or Google)
      else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      }
      else {
        return res.status(401).json({ message: "No user found" });
      }
      
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      // Handle different authentication methods
      let userId: string;
      
      // Direct Google OAuth session
      if (req.session?.userId) {
        userId = req.session.userId;
      }
      // Passport-based auth (Replit or Google)
      else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      }
      else {
        return res.status(401).json({ message: "No user found" });
      }
      
      const updates = updateUserSchema.parse(req.body);
      const updatedUser = await storage.updateUserProfile(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Question routes with diverse visual content
  app.get('/api/questions/:grade/:subject', async (req, res) => {
    try {
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      // Get stored questions first
      let storedQuestions = await storage.getQuestionsByGradeAndSubject(grade, subject);
      
      // Generate additional diverse visual questions for variety
      const { generateDiverseSTAARQuestions } = await import("./diverseQuestionGenerator");
      const diverseQuestions = await generateDiverseSTAARQuestions(grade, subject as "math" | "reading", 5);
      
      // Convert diverse questions to the expected format
      const formattedDiverseQuestions = diverseQuestions.map((q, index) => ({
        ...q,
        id: 10000 + Date.now() + index, // Unique ID for session
        answerChoices: Array.isArray(q.answerChoices) 
          ? q.answerChoices.map(choice => ({ id: choice.id, text: choice.text }))
          : [],
        createdAt: new Date()
      }));
      
      // Combine stored and diverse questions
      const allQuestions = [...storedQuestions, ...formattedDiverseQuestions];
      
      // Shuffle and limit questions for variety, ensuring mix of visual and text
      const shuffled = allQuestions.sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, 10);
      
      res.json(selectedQuestions);
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

  // Demo mode practice attempt - no authentication required
  app.post('/api/demo/practice/attempt', async (req, res) => {
    try {
      const { questionId, selectedAnswer, isCorrect, timeSpent, hintsUsed } = req.body;
      
      // Return mock response for demo mode
      res.json({
        id: Math.floor(Math.random() * 10000),
        questionId,
        selectedAnswer,
        isCorrect,
        timeSpent: timeSpent || 30,
        hintsUsed: hintsUsed || 0,
        createdAt: new Date().toISOString(),
        message: "Demo practice attempt recorded"
      });
    } catch (error) {
      console.error("Error in demo practice attempt:", error);
      res.status(500).json({ message: "Failed to record demo practice attempt" });
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
      res.status(500).json({ message: "Failed to record practice attempt" });
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
  app.get('/api/exams/:grade', async (req, res) => {
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

  // Start exam endpoint
  app.post('/api/exams/:examId/start', isAuthenticated, async (req: any, res) => {
    try {
      const examId = parseInt(req.params.examId);
      const userId = req.user.claims.sub;
      
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }

      // Check if exam exists
      const exam = await storage.getMockExamById(examId);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }

      // Create exam attempt
      const attempt = await storage.createExamAttempt({
        userId,
        examId,
        totalQuestions: exam.totalQuestions,
        correctAnswers: 0,
        completed: false
      });

      res.json({ 
        success: true, 
        attemptId: attempt.id,
        examId,
        timeLimit: exam.timeLimit 
      });
    } catch (error) {
      console.error("Error starting exam:", error);
      res.status(500).json({ message: "Failed to start exam" });
    }
  });

  // Get exam details with questions
  app.get('/api/exams/details/:examId', async (req, res) => {
    try {
      const examId = parseInt(req.params.examId);
      
      if (isNaN(examId)) {
        return res.status(400).json({ message: "Invalid exam ID" });
      }

      const examDetails = await storage.getExamWithQuestions(examId);
      
      if (!examDetails) {
        return res.status(404).json({ message: "Exam not found" });
      }

      res.json(examDetails);
    } catch (error) {
      console.error("Error fetching exam details:", error);
      res.status(500).json({ message: "Failed to fetch exam details" });
    }
  });

  // Get detailed exam attempt results
  app.get('/api/exam-attempts/:attemptId/details', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptId = parseInt(req.params.attemptId);
      
      if (isNaN(attemptId)) {
        return res.status(400).json({ message: "Invalid attempt ID" });
      }

      const details = await storage.getExamAttemptDetails(attemptId);
      
      if (!details) {
        return res.status(404).json({ message: "Exam attempt not found" });
      }

      // Verify the attempt belongs to the current user
      if (details.attempt.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(details);
    } catch (error) {
      console.error("Error fetching exam attempt details:", error);
      res.status(500).json({ message: "Failed to fetch exam attempt details" });
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

  // StarPower routes
  app.get('/api/star-power/stats', isAuthenticated, async (req: any, res) => {
    try {
      // Handle different authentication methods
      let userId: string;
      
      if (req.session?.userId) {
        userId = req.session.userId;
      } else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      } else {
        return res.status(401).json({ message: "No user found" });
      }
      
      const stats = await storage.getStarPowerStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching star power stats:", error);
      res.status(500).json({ message: "Failed to fetch star power stats" });
    }
  });

  // Accuracy tracking routes
  app.get('/api/accuracy', isAuthenticated, async (req: any, res) => {
    try {
      // Handle different authentication methods
      let userId: string;
      
      if (req.session?.userId) {
        userId = req.session.userId;
      } else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      } else {
        return res.status(401).json({ message: "No user found" });
      }
      
      const accuracy = await storage.getOverallAccuracy(userId);
      res.json(accuracy);
    } catch (error) {
      console.error("Error fetching overall accuracy:", error);
      res.status(500).json({ message: "Failed to fetch accuracy data" });
    }
  });

  app.get('/api/accuracy/:grade/:subject', isAuthenticated, async (req: any, res) => {
    try {
      // Handle different authentication methods
      let userId: string;
      
      if (req.session?.userId) {
        userId = req.session.userId;
      } else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      } else {
        return res.status(401).json({ message: "No user found" });
      }
      
      const grade = parseInt(req.params.grade);
      const subject = req.params.subject;
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      const accuracy = await storage.getModuleAccuracy(userId, grade, subject);
      res.json(accuracy);
    } catch (error) {
      console.error("Error fetching module accuracy:", error);
      res.status(500).json({ message: "Failed to fetch accuracy data" });
    }
  });

  // Stats overview route
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      // Handle different authentication methods
      let userId: string;
      
      if (req.session?.userId) {
        userId = req.session.userId;
      } else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      } else {
        return res.status(401).json({ message: "No user found" });
      }
      
      // Get overall accuracy across all grades
      const overallAccuracy = await storage.getOverallAccuracy(userId);
      
      res.json({
        overallAccuracy: overallAccuracy.overallAccuracy,
        mathAccuracy: overallAccuracy.mathAccuracy,
        readingAccuracy: overallAccuracy.readingAccuracy,
        totalAttempts: overallAccuracy.totalAttempts,
        correctAttempts: overallAccuracy.correctAttempts,
        gradeBreakdown: overallAccuracy.gradeBreakdown
      });
    } catch (error) {
      console.error("Error fetching overall stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Multi-role account management routes
  app.patch('/api/user/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role, organizationData, studentId } = req.body;
      
      if (!['student', 'parent', 'teacher'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const additionalData: any = {};
      if (role === 'teacher' && organizationData) {
        additionalData.organizationData = organizationData;
      }
      if (role === 'parent' && studentId) {
        additionalData.studentId = studentId;
      }

      const updatedUser = await storage.updateUserRole(userId, role, additionalData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Test endpoint for switching roles (development only)
  app.post('/api/test/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!['student', 'parent', 'teacher'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // For testing purposes, create a mock organization for teacher role
      let organizationId = null;
      if (role === 'teacher') {
        const testOrg = await storage.createOrganization({
          id: `test_org_${Date.now()}`,
          name: "Test Elementary School",
          type: "school",
          email: "test@testeducation.com",
          phone: "(555) 123-4567",
          address: "123 Test St, Austin, TX 78701",
          isVerified: true
        });
        organizationId = testOrg.id;

        // Create test students for the organization
        for (let i = 1; i <= 5; i++) {
          const grade = 3 + (i % 3); // Grades 3, 4, 5
          const testStudent = await storage.upsertUser({
            id: `org_student_${i}_${organizationId}`,
            email: `student${i}@${organizationId}.demo.com`,
            firstName: `Student`,
            lastName: `${i}`,
            currentGrade: grade,
            starPower: 50 + (i * 30),
            role: "student"
          });

          // Link to organization
          await storage.linkStudentToOrganization(testStudent.id, organizationId, userId);
        }
      }

      // Create test student accounts for parent role
      if (role === 'parent') {
        // Create 2 test student accounts and link them to this parent
        const testStudent1 = await storage.upsertUser({
          id: `test_student_1_${userId}`,
          email: `alex.student@demo.com`,
          firstName: "Alex",
          lastName: "Johnson",
          currentGrade: 3,
          starPower: 150,
          role: "student"
        });

        const testStudent2 = await storage.upsertUser({
          id: `test_student_2_${userId}`,
          email: `sam.student@demo.com`,
          firstName: "Sam",
          lastName: "Johnson", 
          currentGrade: 4,
          starPower: 200,
          role: "student"
        });

        // Link students to parent
        await storage.linkStudentToParent(testStudent1.id, userId);
        await storage.linkStudentToParent(testStudent2.id, userId);
      }

      // Update user role
      const updatedUser = await storage.updateUserProfile(userId, {
        role,
        organizationId
      });

      res.json({ message: `Role changed to ${role}`, user: updatedUser });
    } catch (error) {
      console.error("Error changing test role:", error);
      res.status(500).json({ message: "Failed to change role" });
    }
  });

  // Get students for parent account
  app.get('/api/parent/students', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'parent') {
        return res.status(403).json({ message: "Access denied - parent account required" });
      }

      const students = await storage.getStudentsByParent(userId);
      res.json(students);
    } catch (error) {
      console.error("Error fetching parent's students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get students for organization/teacher account
  app.get('/api/organization/students', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' || !user.organizationId) {
        return res.status(403).json({ message: "Access denied - teacher account required" });
      }

      const students = await storage.getStudentsByOrganization(user.organizationId);
      res.json(students);
    } catch (error) {
      console.error("Error fetching organization students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get organization details
  app.get('/api/organization/:id', isAuthenticated, async (req: any, res) => {
    try {
      const organizationId = req.params.id;
      const organization = await storage.getOrganization(organizationId);
      
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      res.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  // Nova chat endpoint
  app.post('/api/nova-chat', isAuthenticated, async (req: any, res) => {
    try {
      const { message, grade } = req.body;
      
      // Handle different authentication methods
      let userId: string;
      
      // Direct Google OAuth session
      if (req.session?.userId) {
        userId = req.session.userId;
      }
      // Passport-based auth (Replit or Google)
      else if (req.user) {
        userId = req.user.claims?.sub || req.user.id;
      }
      else {
        return res.status(401).json({ message: "No user found" });
      }
      
      if (!message || !grade) {
        return res.status(400).json({ message: "Message and grade are required" });
      }

      // Get user stats for personalized responses
      const userStats = await storage.getUserStats(userId, grade, 'math');
      const readingStats = await storage.getUserStats(userId, grade, 'reading');
      
      const prompt = `You are Nova, a friendly and encouraging AI learning buddy for Texas elementary students preparing for STAAR tests. You help with grades 3-5 Math and Reading.

PERSONALITY: You are enthusiastic, supportive, and use age-appropriate language. You love celebrating student progress and giving detailed explanations. You frequently mention StarPower rewards for correct answers.

STUDENT CONTEXT:
- Grade: ${grade}
- Math accuracy: ${userStats.averageScore || 0}%
- Reading accuracy: ${readingStats.averageScore || 0}%
- Total attempts: ${userStats.totalAttempts + readingStats.totalAttempts}

RESPONSE GUIDELINES:
- Keep responses under 150 words
- Use encouraging, grade-appropriate language
- Reference STAAR test concepts when relevant
- Mention StarPower rewards for motivation
- Provide specific study tips when asked
- If asked about math, focus on TEKS standards for grade ${grade}
- If asked about reading, focus on comprehension and vocabulary

Student message: "${message}"

Respond as Nova would, being helpful and encouraging while staying in character.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const novaResponse = data.choices?.[0]?.message?.content || "I'm having trouble thinking right now. Can you try asking me again?";

      res.json({ response: novaResponse });
    } catch (error) {
      console.error("Error in Nova chat:", error);
      res.json({ 
        response: "Hi there! I'm Nova, your learning buddy! I'm here to help you with your STAAR test prep. I love giving detailed explanations and celebrating your progress with StarPower rewards! What would you like to work on today?" 
      });
    }
  });

  // Teacher classroom management routes
  app.post('/api/teacher/classrooms', isAuthenticated, async (req: any, res) => {
    try {
      // Handle both Google OAuth and Replit auth users
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create classrooms" });
      }

      const { className, grade, subject, maxStudents } = req.body;
      
      if (!className || !grade) {
        return res.status(400).json({ message: "Classroom name and grade are required" });
      }

      // Generate a unique classroom code
      const code = storage.generateClassroomCode();

      const classroom = await storage.createClassroomCode({
        code,
        teacherId: userId,
        organizationId: user.organizationId,
        className,
        grade: parseInt(grade),
        subject: subject || 'both',
        maxStudents: maxStudents || 30,
        isActive: true
      });

      res.json(classroom);
    } catch (error) {
      console.error("Error creating classroom:", error);
      res.status(500).json({ message: "Failed to create classroom" });
    }
  });

  app.get('/api/teacher/classrooms', isAuthenticated, async (req: any, res) => {
    try {
      // Handle both Google OAuth and Replit auth users
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const classrooms = await storage.getClassroomsByTeacher(userId);
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  // Legacy classroom route - keeping for compatibility
  app.get('/api/classroom/teacher', isAuthenticated, async (req: any, res) => {
    try {
      // Handle both Google OAuth and Replit auth users
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Access denied" });
      }

      const classrooms = await storage.getClassroomsByTeacher(userId);
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching teacher classrooms:", error);
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  app.post('/api/classroom/join', isAuthenticated, async (req: any, res) => {
    try {
      // Handle both Google OAuth and Replit auth users
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'student') {
        return res.status(403).json({ message: "Only students can join classrooms" });
      }

      const { classroomCode } = req.body;
      
      if (!classroomCode) {
        return res.status(400).json({ message: "Classroom code is required" });
      }

      const enrollment = await storage.joinClassroom(userId, classroomCode.toUpperCase());
      res.json(enrollment);
    } catch (error: any) {
      console.error("Error joining classroom:", error);
      if (error.message?.includes('not found')) {
        res.status(404).json({ message: "Invalid classroom code" });
      } else if (error.message?.includes('already enrolled')) {
        res.status(409).json({ message: "Already enrolled in this classroom" });
      } else {
        res.status(500).json({ message: "Failed to join classroom" });
      }
    }
  });

  app.get('/api/classroom/student', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'student') {
        return res.status(403).json({ message: "Access denied" });
      }

      const classrooms = await storage.getStudentClassrooms(userId);
      res.json(classrooms);
    } catch (error) {
      console.error("Error fetching student classrooms:", error);
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  // Parent-child linking routes
  app.post('/api/parent/link-child', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'parent') {
        return res.status(403).json({ message: "Only parents can link children" });
      }

      const { childEmail } = req.body;
      
      if (!childEmail) {
        return res.status(400).json({ message: "Child's email is required" });
      }

      const relation = await storage.linkChildToParent(childEmail, userId);
      res.json(relation);
    } catch (error) {
      console.error("Error linking child to parent:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('not found')) {
        res.status(404).json({ message: "Child account not found with this email" });
      } else if (errorMessage.includes('not a student')) {
        res.status(400).json({ message: "Account is not a student account" });
      } else if (errorMessage.includes('already linked')) {
        res.status(409).json({ message: "Child is already linked to this parent account" });
      } else {
        res.status(500).json({ message: "Failed to link child" });
      }
    }
  });

  app.get('/api/parent/children', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'parent') {
        return res.status(403).json({ message: "Access denied" });
      }

      const children = await storage.getChildrenByParent(userId);
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.get('/api/parent/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'parent') {
        return res.status(403).json({ message: "Access denied" });
      }

      const dashboardData = await storage.getParentDashboardData(userId);
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching parent dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // OAuth processing endpoint
  app.post("/api/oauth/process", async (req, res) => {
    console.log("=== PROCESSING OAUTH CODE ===");
    const { code } = req.body;
    
    if (!code) {
      console.error("No authorization code provided");
      return res.json({ success: false, error: "no_code" });
    }

    try {
      const clientId = "360300053613-74ena5t9acsmeq4fd5sn453nfcaovljq.apps.googleusercontent.com";
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET_STAARKIDS!.trim();
      const redirectUri = "https://staarkids.org/?callback=google";

      console.log("Starting token exchange with Google...");
      
      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokens = await tokenResponse.json();
      console.log("Token response status:", tokenResponse.status);
      
      if (!tokenResponse.ok) {
        console.error("Token exchange failed:", tokens);
        return res.json({ success: false, error: "token_exchange_failed" });
      }

      console.log("Getting user info from Google...");
      // Get user info
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const googleUser = await userResponse.json();
      console.log("Google user info received for:", googleUser.email);
      
      if (!userResponse.ok) {
        console.error("Failed to get user info:", googleUser);
        return res.json({ success: false, error: "user_info_failed" });
      }

      // Store user in database
      console.log("Creating/updating user in database...");
      const user = await storage.upsertUser({
        id: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || '',
        lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
        profileImageUrl: googleUser.picture,
      });
      
      console.log("User stored successfully:", user.email);

      // Create session for the user
      const session = req.session as any;
      session.userId = user.id;
      session.googleUser = googleUser;
      
      console.log("OAuth flow completed successfully!");
      
      res.json({ 
        success: true, 
        email: googleUser.email,
        name: googleUser.name || '',
        userId: user.id
      });
      
    } catch (error) {
      console.error("OAuth processing error:", error);
      res.json({ success: false, error: "processing_failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}