import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;
export type QuestionDocument = Question & Document;
export type QuestionOptionDocument = QuestionOption & Document;
export type QuizAttemptDocument = QuizAttempt & Document;
export type QuestionAttemptDocument = QuestionAttempt & Document;

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  MATCHING = 'matching',
  ORDERING = 'ordering',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  category?: string;

  @Prop({ type: String, enum: Object.values(Difficulty), default: Difficulty.EASY })
  difficulty: Difficulty;

  @Prop({ default: 30 })
  durationMinutes: number;

  @Prop({ default: 70 })
  passingScorePercentage: number;

  @Prop({ default: 0 })
  maxAttempts: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isRandomized: boolean;

  @Prop({ default: true })
  showCorrectAnswers: boolean;

  @Prop({ default: true })
  showExplanations: boolean;

  @Prop()
  createdBy?: string;

  @Prop()
  lastModifiedBy?: string;

  @Prop({ type: [{ type: Object }], default: [] })
  questions: Question[];

  @Prop({ type: [{ type: Object }], default: [] })
  attempts?: QuizAttempt[];
}

@Schema({ _id: false })
export class Question {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  questionText: string;

  @Prop()
  explanation?: string;

  @Prop({ type: String, enum: Object.values(QuestionType), required: true })
  questionType: QuestionType;

  @Prop({ type: String, enum: Object.values(Difficulty), default: Difficulty.EASY })
  difficulty: Difficulty;

  @Prop({ default: 1 })
  points: number;

  @Prop({ default: 0 })
  orderIndex: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isRequired: boolean;

  @Prop()
  timeLimitSeconds?: number;

  @Prop({ default: 0 })
  totalAttempts: number;

  @Prop({ default: 0 })
  correctAttempts: number;

  @Prop({ default: 0 })
  averageTimeSeconds: number;

  @Prop({ type: [{ type: Object }], default: [] })
  options: QuestionOption[];

  @Prop({ type: [{ type: Object }], default: [] })
  attempts?: QuestionAttempt[];
}

@Schema({ _id: false })
export class QuestionOption {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  optionText: string;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: 0 })
  orderIndex: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  selectionCount: number;
}

@Schema({ _id: false })
export class QuizAttempt {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  userType?: string;

  @Prop({ type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' })
  status: 'in_progress' | 'completed' | 'abandoned';

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ default: 0 })
  answeredQuestions: number;

  @Prop({ default: 0 })
  correctAnswers: number;

  @Prop({ default: 0 })
  scorePercentage: number;

  @Prop({ default: 0 })
  totalPoints: number;

  @Prop({ default: 0 })
  earnedPoints: number;

  @Prop({ default: false })
  isPassed: boolean;

  @Prop()
  timeSpentSeconds?: number;

  @Prop({ type: [{ type: Object }], default: [] })
  questionAttempts: QuestionAttempt[];
}

@Schema({ _id: false })
export class QuestionAttempt {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  quizAttemptId: string;

  @Prop({ required: true })
  questionId: string;

  @Prop()
  selectedOptionId?: string;

  @Prop()
  textAnswer?: string;

  @Prop()
  booleanAnswer?: boolean;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: 0 })
  pointsEarned: number;

  @Prop({ default: 0 })
  maxPoints: number;

  @Prop()
  timeSpentSeconds?: number;

  @Prop({ required: true })
  answeredAt: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
export const QuestionSchema = SchemaFactory.createForClass(Question);
export const QuestionOptionSchema = SchemaFactory.createForClass(QuestionOption);
export const QuizAttemptSchema = SchemaFactory.createForClass(QuizAttempt);
export const QuestionAttemptSchema = SchemaFactory.createForClass(QuestionAttempt);
