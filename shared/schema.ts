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
  // Role-based access fields
  role: varchar("role").default("student"), // student, parent, teacher
  organizationId: varchar("organization_id"),
  parentId: varchar("parent_id"), // For student accounts linked to parents
  isVerified: boolean("is_verified").default(false), // For teacher/organization verification
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
  category: varchar("category"), // Question category for organization
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

export const starPowerHistory = pgTable("star_power_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(), // positive for earned, negative for spent
  source: varchar("source").notNull(), // "practice", "exam", "achievement", "purchase"
  description: varchar("description"), // what they earned/spent it on
  date: timestamp("date").defaultNow(),
});

// Organizations table for schools and tutoring centers
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "school", "tutoring_center", "district"
  email: varchar("email").unique(),
  phone: varchar("phone"),
  address: text("address"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Classroom codes for teachers to create and students to join
export const classroomCodes = pgTable("classroom_codes", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 8 }).notNull().unique(), // 8-character code
  teacherId: varchar("teacher_id").notNull().references(() => users.id),
  organizationId: varchar("organization_id").references(() => organizations.id),
  className: varchar("class_name").notNull(),
  grade: integer("grade").notNull(),
  subject: varchar("subject"), // "math", "reading", or "both"
  isActive: boolean("is_active").default(true),
  maxStudents: integer("max_students").default(30),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Optional expiration date
});

// Students enrolled in classrooms
export const classroomEnrollments = pgTable("classroom_enrollments", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  classroomId: integer("classroom_id").notNull().references(() => classroomCodes.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  isActive: boolean("is_active").default(true),
}, (table) => ({
  uniqueEnrollment: index("unique_student_classroom").on(table.studentId, table.classroomId),
}));

// Student-parent relationships
export const studentParentRelations = pgTable("student_parent_relations", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull().references(() => users.id),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  relationshipType: varchar("relationship_type").default("parent"), // parent, guardian, etc.
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Organization-student relationships  
export const organizationStudentRelations = pgTable("organization_student_relations", {
  id: serial("id").primaryKey(),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  teacherId: varchar("teacher_id").references(() => users.id),
  classroomId: varchar("classroom_id"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  practiceAttempts: many(practiceAttempts),
  examAttempts: many(examAttempts),
  userProgress: many(userProgress),
  starPowerHistory: many(starPowerHistory),
  // Parent-student relationships
  parentRelations: many(studentParentRelations, { relationName: "parent" }),
  studentRelations: many(studentParentRelations, { relationName: "student" }),
  // Organization relationships
  organizationRelations: many(organizationStudentRelations),
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
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

export const starPowerHistoryRelations = relations(starPowerHistory, ({ one }) => ({
  user: one(users, {
    fields: [starPowerHistory.userId],
    references: [users.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  students: many(organizationStudentRelations),
  teachers: many(users),
}));

export const studentParentRelationsRelations = relations(studentParentRelations, ({ one }) => ({
  student: one(users, {
    fields: [studentParentRelations.studentId],
    references: [users.id],
    relationName: "student",
  }),
  parent: one(users, {
    fields: [studentParentRelations.parentId],
    references: [users.id],
    relationName: "parent",
  }),
}));

export const organizationStudentRelationsRelations = relations(organizationStudentRelations, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationStudentRelations.organizationId],
    references: [organizations.id],
  }),
  student: one(users, {
    fields: [organizationStudentRelations.studentId],
    references: [users.id],
  }),
  teacher: one(users, {
    fields: [organizationStudentRelations.teacherId],
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

export const insertStarPowerHistorySchema = createInsertSchema(starPowerHistory).omit({
  id: true,
  date: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertClassroomCodeSchema = createInsertSchema(classroomCodes).omit({
  id: true,
  createdAt: true,
});

export const insertClassroomEnrollmentSchema = createInsertSchema(classroomEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertStudentParentRelationSchema = createInsertSchema(studentParentRelations).omit({
  id: true,
  createdAt: true,
});

export const insertOrganizationStudentRelationSchema = createInsertSchema(organizationStudentRelations).omit({
  id: true,
  enrolledAt: true,
});

// Update user schema for profile updates
export const updateUserSchema = createInsertSchema(users).pick({
  currentGrade: true,
  avatarType: true,
  avatarColor: true,
  starPower: true,
  role: true,
  organizationId: true,
  parentId: true,
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
export type StarPowerHistory = typeof starPowerHistory.$inferSelect;
export type InsertStarPowerHistory = z.infer<typeof insertStarPowerHistorySchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type ClassroomCode = typeof classroomCodes.$inferSelect;
export type InsertClassroomCode = z.infer<typeof insertClassroomCodeSchema>;
export type ClassroomEnrollment = typeof classroomEnrollments.$inferSelect;
export type InsertClassroomEnrollment = z.infer<typeof insertClassroomEnrollmentSchema>;
export type StudentParentRelation = typeof studentParentRelations.$inferSelect;
export type InsertStudentParentRelation = z.infer<typeof insertStudentParentRelationSchema>;
export type OrganizationStudentRelation = typeof organizationStudentRelations.$inferSelect;
export type InsertOrganizationStudentRelation = z.infer<typeof insertOrganizationStudentRelationSchema>;
