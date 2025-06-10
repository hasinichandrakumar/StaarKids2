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
      // Handle both Google OAuth and Replit auth users
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      // Handle both Google OAuth and Replit auth users
      const userId = req.user.claims?.sub || req.user.id;
      const updates = updateUserSchema.parse(req.body);
      
      const updatedUser = await storage.updateUserProfile(userId, updates);
      res.json(updatedUser);
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
      
      if (![3, 4, 5].includes(grade) || !['math', 'reading'].includes(subject)) {
        return res.status(400).json({ message: "Invalid grade or subject" });
      }

      // Get all questions for grade and subject
      let questions = await storage.getQuestionsByGradeAndSubject(grade, subject);
      
      // Shuffle and limit questions for variety
      if (questions.length > 0) {
        questions = questions.sort(() => Math.random() - 0.5).slice(0, 10);
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const accuracy = await storage.getOverallAccuracy(userId);
      res.json(accuracy);
    } catch (error) {
      console.error("Error fetching overall accuracy:", error);
      res.status(500).json({ message: "Failed to fetch accuracy data" });
    }
  });

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
      res.status(500).json({ message: "Failed to fetch accuracy data" });
    }
  });

  // Stats overview route
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
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
      const userId = req.user.claims.sub;
      
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
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
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

  // Classroom code management routes
  app.post('/api/classroom/create', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create classroom codes" });
      }

      const { className, grade, subject } = req.body;
      
      if (!className || !grade) {
        return res.status(400).json({ message: "Classroom name and grade are required" });
      }

      const classroom = await storage.createClassroomCode({
        teacherId: userId,
        organizationId: user.organizationId,
        className,
        grade: parseInt(grade),
        subject: subject || 'both',
        isActive: true
      });

      res.json(classroom);
    } catch (error) {
      console.error("Error creating classroom code:", error);
      res.status(500).json({ message: "Failed to create classroom code" });
    }
  });

  app.get('/api/classroom/teacher', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
    } catch (error) {
      console.error("Error joining classroom:", error);
      if (error.message.includes('not found')) {
        res.status(404).json({ message: "Invalid classroom code" });
      } else if (error.message.includes('already enrolled')) {
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
      if (error.message.includes('not found')) {
        res.status(404).json({ message: "Child account not found with this email" });
      } else if (error.message.includes('not a student')) {
        res.status(400).json({ message: "Account is not a student account" });
      } else if (error.message.includes('already linked')) {
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

  const httpServer = createServer(app);
  return httpServer;
}