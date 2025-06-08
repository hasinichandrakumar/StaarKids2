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

  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  const httpServer = createServer(app);
  return httpServer;
}