import { QuestionType, Difficulty } from './quiz.domain.enums';

export interface QuizDomainInterface {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty: Difficulty;
  durationMinutes: number;
  passingScorePercentage: number;
  maxAttempts: number;
  isActive: boolean;
  isRandomized: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  createdBy?: string;
  lastModifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  questions: QuestionEntity[];
  attempts?: QuizAttemptEntity[];
}

export interface QuestionEntity {
  id: string;
  quizId: string;
  questionText: string;
  explanation?: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  points: number;
  orderIndex: number;
  isActive: boolean;
  isRequired: boolean;
  timeLimitSeconds?: number;
  totalAttempts: number;
  correctAttempts: number;
  averageTimeSeconds: number;
  createdAt: Date;
  updatedAt: Date;
  options: QuestionOptionEntity[];
  attempts?: QuestionAttemptEntity[];
}

export interface QuestionOptionEntity {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
  isActive: boolean;
  selectionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttemptEntity {
  id: string;
  quizId: string;
  userId: string;
  userType?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt?: Date;
  completedAt?: Date;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  totalPoints: number;
  earnedPoints: number;
  isPassed: boolean;
  timeSpentSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
  questionAttempts: QuestionAttemptEntity[];
}

export interface QuestionAttemptEntity {
  id: string;
  quizAttemptId: string;
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  booleanAnswer?: boolean;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  timeSpentSeconds?: number;
  answeredAt: Date;
  createdAt: Date;
}
