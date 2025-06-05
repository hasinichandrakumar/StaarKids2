import {
  users,
  questions,
  practiceAttempts,
  mockExams,
  mockExamQuestions,
  examAttempts,
  userProgress,
  starPowerHistory,
  type User,
  type UpsertUser,
  type Question,
  type InsertQuestion,
  type PracticeAttempt,
  type InsertPracticeAttempt,
  type MockExam,
  type InsertMockExam,
  type ExamAttempt,
  type InsertExamAttempt,
  type UserProgress,
  type InsertUserProgress,
  type StarPowerHistory,
  type InsertStarPowerHistory,
  type UpdateUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, avg, count, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, updates: UpdateUser): Promise<User>;
  
  // Question operations
  getQuestionsByGradeAndSubject(grade: number, subject: string): Promise<Question[]>;
  getQuestionsByTeksStandard(grade: number, subject: string, teksStandard: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Practice attempt operations
  createPracticeAttempt(attempt: InsertPracticeAttempt): Promise<PracticeAttempt>;
  getUserPracticeHistory(userId: string, limit?: number): Promise<PracticeAttempt[]>;
  
  // Mock exam operations
  getMockExams(grade: number): Promise<MockExam[]>;
  createMockExam(exam: InsertMockExam): Promise<MockExam>;
  createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt>;
  getUserExamHistory(userId: string, limit?: number): Promise<ExamAttempt[]>;
  
  // Progress tracking
  getUserProgress(userId: string, grade: number): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserStats(userId: string, grade: number, subject: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    averageScore: number;
    improvementTrend: number;
    categoryStats: Array<{
      category: string;
      totalQuestions: number;
      correctAnswers: number;
      accuracy: number;
      lastAttempted: Date | null;
    }>;
  }>;
  
  // Star Power tracking
  addStarPowerHistory(entry: InsertStarPowerHistory): Promise<StarPowerHistory>;
  getStarPowerStats(userId: string): Promise<{
    dailyStarPower: number;
    weeklyStarPower: number;
    allTimeStarPower: number;
  }>;
  
  // Enhanced accuracy tracking
  getOverallAccuracy(userId: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    overallAccuracy: number;
    mathAccuracy: number;
    readingAccuracy: number;
    gradeBreakdown: Array<{
      grade: number;
      attempts: number;
      correct: number;
      accuracy: number;
    }>;
  }>;
  getModuleAccuracy(userId: string, grade: number, subject: string): Promise<{
    overallAccuracy: number;
    teksStandardStats: Array<{
      teksStandard: string;
      totalQuestions: number;
      correctAnswers: number;
      accuracy: number;
      lastAttempted: Date | null;
    }>;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, updates: UpdateUser): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Question operations
  async getQuestionsByGradeAndSubject(grade: number, subject: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(and(eq(questions.grade, grade), eq(questions.subject, subject)))
      .limit(20);
  }

  async getQuestionsByTeksStandard(grade: number, subject: string, teksStandard: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.grade, grade),
          eq(questions.subject, subject),
          eq(questions.teksStandard, teksStandard)
        )
      )
      .limit(10);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db
      .insert(questions)
      .values(question)
      .returning();
    return newQuestion;
  }

  // Practice attempt operations
  async createPracticeAttempt(attempt: InsertPracticeAttempt): Promise<PracticeAttempt> {
    const [newAttempt] = await db
      .insert(practiceAttempts)
      .values(attempt)
      .returning();
    
    // Update user's star power if correct
    if (attempt.isCorrect && !attempt.skipped) {
      const pointsEarned = (attempt.hintsUsed || 0) === 0 ? 60 : Math.max(20, 60 - ((attempt.hintsUsed || 0) * 10));
      await db
        .update(users)
        .set({
          starPower: sql`${users.starPower} + ${pointsEarned}`,
        })
        .where(eq(users.id, attempt.userId));
    }
    
    return newAttempt;
  }

  async getUserPracticeHistory(userId: string, limit: number = 10): Promise<PracticeAttempt[]> {
    return await db
      .select()
      .from(practiceAttempts)
      .where(eq(practiceAttempts.userId, userId))
      .orderBy(desc(practiceAttempts.createdAt))
      .limit(limit);
  }

  // Mock exam operations
  async getMockExams(grade: number): Promise<MockExam[]> {
    return await db
      .select()
      .from(mockExams)
      .where(eq(mockExams.grade, grade))
      .orderBy(desc(mockExams.createdAt));
  }

  async createMockExam(exam: InsertMockExam): Promise<MockExam> {
    const [newExam] = await db
      .insert(mockExams)
      .values(exam)
      .returning();
    return newExam;
  }

  async createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt> {
    const [newAttempt] = await db
      .insert(examAttempts)
      .values(attempt)
      .returning();
    return newAttempt;
  }

  async getUserExamHistory(userId: string, limit: number = 10): Promise<ExamAttempt[]> {
    return await db
      .select({
        id: examAttempts.id,
        userId: examAttempts.userId,
        examId: examAttempts.examId,
        score: examAttempts.score,
        totalQuestions: examAttempts.totalQuestions,
        correctAnswers: examAttempts.correctAnswers,
        timeSpent: examAttempts.timeSpent,
        completed: examAttempts.completed,
        startedAt: examAttempts.startedAt,
        completedAt: examAttempts.completedAt,
        examName: mockExams.name,
        examSubject: mockExams.subject,
      })
      .from(examAttempts)
      .innerJoin(mockExams, eq(examAttempts.examId, mockExams.id))
      .where(eq(examAttempts.userId, userId))
      .orderBy(desc(examAttempts.startedAt))
      .limit(limit) as any;
  }

  // Progress tracking
  async getUserProgress(userId: string, grade: number): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.grade, grade)));
  }

  async updateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId),
          eq(userProgress.grade, progress.grade),
          eq(userProgress.subject, progress.subject),
          eq(userProgress.teksStandard, progress.teksStandard)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({
          ...progress,
          updatedAt: new Date(),
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values(progress)
        .returning();
      return newProgress;
    }
  }

  async getUserStats(userId: string, grade: number, subject: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    averageScore: number;
    improvementTrend: number;
    categoryStats: Array<{
      category: string;
      totalQuestions: number;
      correctAnswers: number;
      accuracy: number;
      lastAttempted: Date | null;
    }>;
  }> {
    // Get overall stats
    const stats = await db
      .select({
        totalAttempts: count(),
        correctAttempts: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
        averageScore: avg(sql<number>`CASE WHEN ${practiceAttempts.isCorrect} = true THEN 100 ELSE 0 END`),
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(
        and(
          eq(practiceAttempts.userId, userId),
          eq(questions.grade, grade),
          eq(questions.subject, subject)
        )
      );

    // Get recent performance (last 20 attempts) for more accurate current skill level
    const recentAttempts = await db
      .select({
        isCorrect: practiceAttempts.isCorrect,
        createdAt: practiceAttempts.createdAt,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(
        and(
          eq(practiceAttempts.userId, userId),
          eq(questions.grade, grade),
          eq(questions.subject, subject)
        )
      )
      .orderBy(desc(practiceAttempts.createdAt))
      .limit(20);

    // Calculate weighted average score giving more weight to recent attempts
    let weightedScore = 0;
    let totalWeight = 0;
    
    if (recentAttempts.length > 0) {
      recentAttempts.forEach((attempt, index) => {
        // More recent attempts get higher weight (20, 19, 18, ... 1)
        const weight = recentAttempts.length - index;
        weightedScore += (attempt.isCorrect ? 100 : 0) * weight;
        totalWeight += weight;
      });
      
      // If we have recent data, use weighted average, otherwise fall back to overall average
      const recentWeightedAverage = totalWeight > 0 ? weightedScore / totalWeight : 0;
      
      // Blend recent performance (70%) with overall performance (30%) for stability
      const blendedScore = recentAttempts.length >= 10 
        ? (recentWeightedAverage * 0.7) + ((Number(stats[0]?.averageScore) || 0) * 0.3)
        : Number(stats[0]?.averageScore) || 0;
      
      stats[0].averageScore = blendedScore;
    }

    const result = stats[0];
    
    // Get category-specific statistics
    const categoryStats = await db
      .select({
        teksStandard: questions.teksStandard,
        totalQuestions: count(),
        correctAnswers: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
        lastAttempted: sql<Date>`MAX(${practiceAttempts.createdAt})`,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(
        and(
          eq(practiceAttempts.userId, userId),
          eq(questions.grade, grade),
          eq(questions.subject, subject)
        )
      )
      .groupBy(questions.teksStandard);

    const categoryStatsFormatted = categoryStats.map(stat => ({
      category: stat.teksStandard,
      totalQuestions: stat.totalQuestions,
      correctAnswers: stat.correctAnswers,
      accuracy: stat.totalQuestions > 0 ? Math.round((stat.correctAnswers / stat.totalQuestions) * 100) : 0,
      lastAttempted: stat.lastAttempted
    }));

    return {
      totalAttempts: result.totalAttempts || 0,
      correctAttempts: Number(result.correctAttempts) || 0,
      averageScore: Number(result.averageScore) || 0,
      improvementTrend: 0, // TODO: Calculate trend over time
      categoryStats: categoryStatsFormatted
    };
  }

  // Star Power tracking
  async addStarPowerHistory(entry: InsertStarPowerHistory): Promise<StarPowerHistory> {
    const [newEntry] = await db
      .insert(starPowerHistory)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getStarPowerStats(userId: string): Promise<{
    dailyStarPower: number;
    weeklyStarPower: number;
    allTimeStarPower: number;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());

    // Get daily star power (earned today)
    const dailyResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${starPowerHistory.amount}), 0)`
      })
      .from(starPowerHistory)
      .where(
        and(
          eq(starPowerHistory.userId, userId),
          sql`${starPowerHistory.date} >= ${startOfDay}`,
          sql`${starPowerHistory.amount} > 0` // Only count earned star power
        )
      );

    // Get weekly star power (earned this week)
    const weeklyResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${starPowerHistory.amount}), 0)`
      })
      .from(starPowerHistory)
      .where(
        and(
          eq(starPowerHistory.userId, userId),
          sql`${starPowerHistory.date} >= ${startOfWeek}`,
          sql`${starPowerHistory.amount} > 0` // Only count earned star power
        )
      );

    // Get all-time star power (total earned ever)
    const allTimeResult = await db
      .select({
        total: sql<number>`COALESCE(SUM(${starPowerHistory.amount}), 0)`
      })
      .from(starPowerHistory)
      .where(
        and(
          eq(starPowerHistory.userId, userId),
          sql`${starPowerHistory.amount} > 0` // Only count earned star power
        )
      );

    return {
      dailyStarPower: Number(dailyResult[0]?.total) || 0,
      weeklyStarPower: Number(weeklyResult[0]?.total) || 0,
      allTimeStarPower: Number(allTimeResult[0]?.total) || 0,
    };
  }

  // Enhanced accuracy tracking
  async getOverallAccuracy(userId: string): Promise<{
    totalAttempts: number;
    correctAttempts: number;
    overallAccuracy: number;
    mathAccuracy: number;
    readingAccuracy: number;
    gradeBreakdown: Array<{
      grade: number;
      attempts: number;
      correct: number;
      accuracy: number;
    }>;
  }> {
    // Overall statistics
    const overallStats = await db
      .select({
        totalAttempts: count(),
        correctAttempts: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(eq(practiceAttempts.userId, userId));

    // Math vs Reading statistics
    const subjectStats = await db
      .select({
        subject: questions.subject,
        totalAttempts: count(),
        correctAttempts: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(eq(practiceAttempts.userId, userId))
      .groupBy(questions.subject);

    // Grade breakdown
    const gradeStats = await db
      .select({
        grade: questions.grade,
        totalAttempts: count(),
        correctAttempts: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(eq(practiceAttempts.userId, userId))
      .groupBy(questions.grade);

    const overall = overallStats[0];
    const mathStats = subjectStats.find(s => s.subject === 'math');
    const readingStats = subjectStats.find(s => s.subject === 'reading');

    return {
      totalAttempts: overall?.totalAttempts || 0,
      correctAttempts: Number(overall?.correctAttempts) || 0,
      overallAccuracy: overall?.totalAttempts > 0 ? Math.round((Number(overall.correctAttempts) / overall.totalAttempts) * 100) : 0,
      mathAccuracy: mathStats && mathStats.totalAttempts > 0 ? Math.round((Number(mathStats.correctAttempts) / mathStats.totalAttempts) * 100) : 0,
      readingAccuracy: readingStats && readingStats.totalAttempts > 0 ? Math.round((Number(readingStats.correctAttempts) / readingStats.totalAttempts) * 100) : 0,
      gradeBreakdown: gradeStats.map(stat => ({
        grade: stat.grade,
        attempts: stat.totalAttempts,
        correct: Number(stat.correctAttempts),
        accuracy: stat.totalAttempts > 0 ? Math.round((Number(stat.correctAttempts) / stat.totalAttempts) * 100) : 0,
      })),
    };
  }

  async getModuleAccuracy(userId: string, grade: number, subject: string): Promise<{
    overallAccuracy: number;
    teksStandardStats: Array<{
      teksStandard: string;
      totalQuestions: number;
      correctAnswers: number;
      accuracy: number;
      lastAttempted: Date | null;
    }>;
  }> {
    // Overall accuracy for this grade/subject
    const overallStats = await db
      .select({
        totalAttempts: count(),
        correctAttempts: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(
        and(
          eq(practiceAttempts.userId, userId),
          eq(questions.grade, grade),
          eq(questions.subject, subject)
        )
      );

    // TEKS standard breakdown
    const teksStats = await db
      .select({
        teksStandard: questions.teksStandard,
        totalQuestions: count(),
        correctAnswers: sql<number>`SUM(CASE WHEN ${practiceAttempts.isCorrect} = true THEN 1 ELSE 0 END)`,
        lastAttempted: sql<Date>`MAX(${practiceAttempts.createdAt})`,
      })
      .from(practiceAttempts)
      .innerJoin(questions, eq(practiceAttempts.questionId, questions.id))
      .where(
        and(
          eq(practiceAttempts.userId, userId),
          eq(questions.grade, grade),
          eq(questions.subject, subject)
        )
      )
      .groupBy(questions.teksStandard);

    const overall = overallStats[0];
    const overallAccuracy = overall?.totalAttempts > 0 ? Math.round((Number(overall.correctAttempts) / overall.totalAttempts) * 100) : 0;

    return {
      overallAccuracy,
      teksStandardStats: teksStats.map(stat => ({
        teksStandard: stat.teksStandard,
        totalQuestions: stat.totalQuestions,
        correctAnswers: Number(stat.correctAnswers),
        accuracy: stat.totalQuestions > 0 ? Math.round((Number(stat.correctAnswers) / stat.totalQuestions) * 100) : 0,
        lastAttempted: stat.lastAttempted,
      })),
    };
  }
}

export const storage = new DatabaseStorage();
