import { QuestionType, Difficulty } from '../../domain/interfaces/enums';
import { 
  Column, 
  Entity, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

// ========================================
// QUIZ ENTITY (Main Quiz Container)
// ========================================
@Entity('quizzes')
@Index(['isActive', 'createdAt'])
export class QuizModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.EASY })
  difficulty: Difficulty;

  // Quiz Settings
  @Column({ type: 'int', default: 30 })
  durationMinutes: number;

  @Column({ type: 'int', default: 70 })
  passingScorePercentage: number;

  @Column({ type: 'int', default: 0 })
  maxAttempts: number; // 0 = unlimited

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isRandomized: boolean;

  @Column({ type: 'boolean', default: true })
  showCorrectAnswers: boolean;

  @Column({ type: 'boolean', default: true })
  showExplanations: boolean;

  // Metadata
  @Column({ type: 'varchar', length: 50, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastModifiedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => QuestionModel, question => question.quiz, { cascade: true })
  questions: QuestionModel[];

  @OneToMany(() => QuizAttemptModel, attempt => attempt.quiz)
  attempts: QuizAttemptModel[];
}

// ========================================
// QUESTION ENTITY (Individual Questions)
// ========================================
@Entity('questions')
@Index(['quizId', 'orderIndex'])
@Index(['questionType', 'difficulty'])
export class QuestionModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quizId: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'enum', enum: QuestionType })
  questionType: QuestionType;

  @Column({ type: 'enum', enum: Difficulty, default: Difficulty.EASY })
  difficulty: Difficulty;

  @Column({ type: 'int', default: 1 })
  points: number;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Question Settings
  @Column({ type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ type: 'int', nullable: true })
  timeLimitSeconds: number; // null = no time limit

  // Analytics
  @Column({ type: 'int', default: 0 })
  totalAttempts: number;

  @Column({ type: 'int', default: 0 })
  correctAttempts: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  averageTimeSeconds: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => QuizModel, quiz => quiz.questions)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizModel;

  @OneToMany(() => QuestionOptionModel, option => option.question, { cascade: true })
  options: QuestionOptionModel[];

  @OneToMany(() => QuestionAttemptModel, attempt => attempt.question)
  attempts: QuestionAttemptModel[];
}

// ========================================
// QUESTION OPTIONS ENTITY (Answer Choices)
// ========================================
@Entity('question_options')
@Index(['questionId', 'orderIndex'])
export class QuestionOptionModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  questionId: string;

  @Column({ type: 'text' })
  optionText: string;

  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Analytics
  @Column({ type: 'int', default: 0 })
  selectionCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => QuestionModel, question => question.options)
  @JoinColumn({ name: 'questionId' })
  question: QuestionModel;

  // Note: QuestionAttemptModel references this option via selectedOptionId
}

// ========================================
// QUIZ ATTEMPTS ENTITY (User Quiz Sessions)
// ========================================
@Entity('quiz_attempts')
@Index(['userId', 'quizId'])
@Index(['completedAt'])
export class QuizAttemptModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quizId: string;

  @Column({ type: 'varchar', length: 100 })
  userId: string; // Could be telegramId, email, etc.

  @Column({ type: 'varchar', length: 50, nullable: true })
  userType: string; // 'student', 'admin', etc.

  // Attempt Status
  @Column({ type: 'enum', enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' })
  status: 'in_progress' | 'completed' | 'abandoned';

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  // Scoring
  @Column({ type: 'int', default: 0 })
  totalQuestions: number;

  @Column({ type: 'int', default: 0 })
  answeredQuestions: number;

  @Column({ type: 'int', default: 0 })
  correctAnswers: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  scorePercentage: number;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', default: 0 })
  earnedPoints: number;

  @Column({ type: 'boolean', default: false })
  isPassed: boolean;

  // Time Tracking
  @Column({ type: 'int', nullable: true })
  timeSpentSeconds: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => QuizModel, quiz => quiz.attempts)
  @JoinColumn({ name: 'quizId' })
  quiz: QuizModel;

  @OneToMany(() => QuestionAttemptModel, questionAttempt => questionAttempt.quizAttempt, { cascade: true })
  questionAttempts: QuestionAttemptModel[];
}

// ========================================
// QUESTION ATTEMPTS ENTITY (Individual Question Answers)
// ========================================
@Entity('question_attempts')
@Index(['quizAttemptId', 'questionId'])
export class QuestionAttemptModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  quizAttemptId: string;

  @Column({ type: 'uuid' })
  questionId: string;

  @Column({ type: 'uuid', nullable: true })
  selectedOptionId: string; // For multiple choice

  @Column({ type: 'text', nullable: true })
  textAnswer: string; // For text/fill-in questions

  @Column({ type: 'boolean', nullable: true })
  booleanAnswer: boolean; // For true/false questions

  // Scoring
  @Column({ type: 'boolean', default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  pointsEarned: number;

  @Column({ type: 'int', default: 0 })
  maxPoints: number;

  // Time Tracking
  @Column({ type: 'int', nullable: true })
  timeSpentSeconds: number;

  @Column({ type: 'timestamp' })
  answeredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => QuizAttemptModel, quizAttempt => quizAttempt.questionAttempts)
  @JoinColumn({ name: 'quizAttemptId' })
  quizAttempt: QuizAttemptModel;

  @ManyToOne(() => QuestionModel, question => question.attempts)
  @JoinColumn({ name: 'questionId' })
  question: QuestionModel;

  @ManyToOne(() => QuestionOptionModel)
  @JoinColumn({ name: 'selectedOptionId' })
  selectedOption: QuestionOptionModel;
}
