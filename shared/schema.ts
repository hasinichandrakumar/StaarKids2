import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
  serial,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Staarkid specific fields
  currentGrade: integer("current_grade").default(4),
  starPower: integer("star_power").default(0),
  avatarType: varchar("avatar_type").default("fox"),
  avatarColor: varchar("avatar_color").default("#FF5B00"),
  userRank: varchar("user_rank").default("Cadet"),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  grade: integer("grade").notNull(),
  subject: varchar("subject").notNull(), // "math" or "reading"
  teksStandard: varchar("teks_standard").notNull(),
  questionText: text("question_text").notNull(),
  answerChoices: jsonb("answer_choices").notNull(), // Array of {id, text}
  correctAnswer: varchar("correct_answer").notNull(),
  explanation: text("explanation"),
  difficulty: varchar("difficulty").default("medium"), // easy, medium, hard
  year: integer("year"), // STAAR test year
  createdAt: timestamp("created_at").defaultNow(),
});

export const practiceAttempts = pgTable("practice_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  selectedAnswer: varchar("selected_answer"),
  isCorrect: boolean("is_correct").notNull(),
  hintsUsed: integer("hints_used").default(0),
  timeSpent: integer("time_spent"), // in seconds
  skipped: boolean("skipped").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mockExams = pgTable("mock_exams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  grade: integer("grade").notNull(),
  subject: varchar("subject").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeLimit: integer("time_limit"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

export const mockExamQuestions = pgTable("mock_exam_questions", {
  examId: integer("exam_id").notNull().references(() => mockExams.id),
  questionId: integer("question_id").notNull().references(() => questions.id),
  order: integer("order").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.examId, table.questionId] }),
}));

export const examAttempts = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  examId: integer("exam_id").notNull().references(() => mockExams.id),
  score: decimal("score", { precision: 5, scale: 2 }),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  timeSpent: integer("time_spent"), // in minutes
  completed: boolean("completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  grade: integer("grade").notNull(),
  subject: varchar("subject").notNull(),
  teksStandard: varchar("teks_standard").notNull(),
  totalAttempts: integer("total_attempts").default(0),
  correctAttempts: integer("correct_attempts").default(0),
  averageScore: decimal("average_score", { precision: 5, scale: 2 }).default("0"),
  lastPracticed: timestamp("last_practiced"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  practiceAttempts: many(practiceAttempts),
  examAttempts: many(examAttempts),
  userProgress: many(userProgress),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  practiceAttempts: many(practiceAttempts),
  mockExamQuestions: many(mockExamQuestions),
}));

export const practiceAttemptsRelations = relations(practiceAttempts, ({ one }) => ({
  user: one(users, {
    fields: [practiceAttempts.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [practiceAttempts.questionId],
    references: [questions.id],
  }),
}));

export const mockExamsRelations = relations(mockExams, ({ many }) => ({
  mockExamQuestions: many(mockExamQuestions),
  examAttempts: many(examAttempts),
}));

export const mockExamQuestionsRelations = relations(mockExamQuestions, ({ one }) => ({
  exam: one(mockExams, {
    fields: [mockExamQuestions.examId],
    references: [mockExams.id],
  }),
  question: one(questions, {
    fields: [mockExamQuestions.questionId],
    references: [questions.id],
  }),
}));

export const examAttemptsRelations = relations(examAttempts, ({ one }) => ({
  user: one(users, {
    fields: [examAttempts.userId],
    references: [users.id],
  }),
  exam: one(mockExams, {
    fields: [examAttempts.examId],
    references: [mockExams.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertPracticeAttemptSchema = createInsertSchema(practiceAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertMockExamSchema = createInsertSchema(mockExams).omit({
  id: true,
  createdAt: true,
});

export const insertExamAttemptSchema = createInsertSchema(examAttempts).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

// Update user schema for profile updates
export const updateUserSchema = createInsertSchema(users).pick({
  currentGrade: true,
  avatarType: true,
  avatarColor: true,
}).partial();

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type PracticeAttempt = typeof practiceAttempts.$inferSelect;
export type InsertPracticeAttempt = z.infer<typeof insertPracticeAttemptSchema>;
export type MockExam = typeof mockExams.$inferSelect;
export type InsertMockExam = z.infer<typeof insertMockExamSchema>;
export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
