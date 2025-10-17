import { QuestionType, Difficulty } from '../interfaces/enums';

// ========================================
// DOMAIN ENTITIES (Business Logic)
// ========================================

export interface QuizEntity {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty: Difficulty;
  
  // Settings
  durationMinutes: number;
  passingScorePercentage: number;
  maxAttempts: number;
  isActive: boolean;
  isRandomized: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  
  // Metadata
  createdBy?: string;
  lastModifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
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
  
  // Settings
  isRequired: boolean;
  timeLimitSeconds?: number;
  
  // Analytics
  totalAttempts: number;
  correctAttempts: number;
  averageTimeSeconds: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
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
  
  // Analytics
  selectionCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizAttemptEntity {
  id: string;
  quizId: string;
  userId: string;
  userType?: string;
  
  // Status
  status: 'in_progress' | 'completed' | 'abandoned';
  startedAt?: Date;
  completedAt?: Date;
  
  // Scoring
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  totalPoints: number;
  earnedPoints: number;
  isPassed: boolean;
  
  // Time Tracking
  timeSpentSeconds?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  questionAttempts: QuestionAttemptEntity[];
}

export interface QuestionAttemptEntity {
  id: string;
  quizAttemptId: string;
  questionId: string;
  
  // Answer (one of these will be populated based on question type)
  selectedOptionId?: string;
  textAnswer?: string;
  booleanAnswer?: boolean;
  
  // Scoring
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  
  // Time Tracking
  timeSpentSeconds?: number;
  answeredAt: Date;
  
  createdAt: Date;
}

// ========================================
// VALUE OBJECTS (Immutable Data)
// ========================================

export class QuizSettings {
  constructor(
    public readonly durationMinutes: number,
    public readonly passingScorePercentage: number,
    public readonly maxAttempts: number,
    public readonly isRandomized: boolean,
    public readonly showCorrectAnswers: boolean,
    public readonly showExplanations: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.durationMinutes < 0) {
      throw new Error('Duration cannot be negative');
    }
    if (this.passingScorePercentage < 0 || this.passingScorePercentage > 100) {
      throw new Error('Passing score must be between 0 and 100');
    }
    if (this.maxAttempts < 0) {
      throw new Error('Max attempts cannot be negative');
    }
  }
}

export class QuestionAnalytics {
  constructor(
    public readonly totalAttempts: number,
    public readonly correctAttempts: number,
    public readonly averageTimeSeconds: number
  ) {}

  get successRate(): number {
    return this.totalAttempts > 0 ? (this.correctAttempts / this.totalAttempts) * 100 : 0;
  }

  get difficultyLevel(): 'easy' | 'medium' | 'hard' {
    if (this.successRate >= 80) return 'easy';
    if (this.successRate >= 50) return 'medium';
    return 'hard';
  }
}

// ========================================
// FACTORY FUNCTIONS (For creating entities)
// ========================================

export function createQuizEntity(
  title: string,
  durationMinutes: number,
  passingScorePercentage: number,
  questions: QuestionEntity[],
  difficulty: Difficulty,
  description?: string,
  category?: string,
  maxAttempts: number = 0,
  isRandomized: boolean = false,
  showCorrectAnswers: boolean = true,
  showExplanations: boolean = true,
  createdBy?: string
): QuizEntity {
  const now = new Date();
  
  return {
    id: crypto.randomUUID(),
    title,
    description,
    category,
    difficulty,
    durationMinutes,
    passingScorePercentage,
    maxAttempts,
    isActive: true,
    isRandomized,
    showCorrectAnswers,
    showExplanations,
    createdBy,
    lastModifiedBy: createdBy,
    createdAt: now,
    updatedAt: now,
    questions,
    attempts: [],
  };
}

export function updateQuizEntity(
  existingQuiz: QuizEntity,
  updates: Partial<QuizEntity>
): QuizEntity {
  return {
    ...existingQuiz,
    ...updates,
    updatedAt: new Date(),
  };
}

export function activateQuizEntity(quiz: QuizEntity): QuizEntity {
  if (quiz.isActive) {
    throw new Error('Quiz is already active');
  }
  return updateQuizEntity(quiz, { isActive: true });
}

export function deactivateQuizEntity(quiz: QuizEntity): QuizEntity {
  if (!quiz.isActive) {
    throw new Error('Quiz is already inactive');
  }
  return updateQuizEntity(quiz, { isActive: false });
}

// ========================================
// AGGREGATE ROOTS (Business Logic Containers)
// ========================================

export class QuizAggregate {
  constructor(
    private readonly quiz: QuizEntity,
    private readonly questions: QuestionEntity[]
  ) {}

  get id(): string {
    return this.quiz.id;
  }

  get title(): string {
    return this.quiz.title;
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  get totalPoints(): number {
    return this.questions.reduce((sum, q) => sum + q.points, 0);
  }

  get activeQuestions(): QuestionEntity[] {
    return this.questions.filter(q => q.isActive);
  }

  canStartAttempt(userId: string, existingAttempts: QuizAttemptEntity[]): boolean {
    if (!this.quiz.isActive) return false;
    
    if (this.quiz.maxAttempts > 0) {
      const userAttempts = existingAttempts.filter(a => a.userId === userId);
      if (userAttempts.length >= this.quiz.maxAttempts) return false;
    }
    
    return true;
  }

  calculateScore(questionAttempts: QuestionAttemptEntity[]): {
    totalPoints: number;
    earnedPoints: number;
    percentage: number;
    isPassed: boolean;
  } {
    const totalPoints = this.totalPoints;
    const earnedPoints = questionAttempts.reduce((sum, attempt) => sum + attempt.pointsEarned, 0);
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = percentage >= this.quiz.passingScorePercentage;

    return {
      totalPoints,
      earnedPoints,
      percentage,
      isPassed
    };
  }
}
