import { QuizDomainInterface } from '../interfaces/quiz.domain.interface';
import { QuestionType, Difficulty } from '../interfaces/quiz.domain.enums';

export class QuizEntity implements QuizDomainInterface {
  public readonly id: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly category?: string;
  public readonly difficulty: Difficulty;
  public readonly durationMinutes: number;
  public readonly passingScorePercentage: number;
  public readonly maxAttempts: number;
  public readonly isActive: boolean;
  public readonly isRandomized: boolean;
  public readonly showCorrectAnswers: boolean;
  public readonly showExplanations: boolean;
  public readonly createdBy?: string;
  public readonly lastModifiedBy?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly questions: QuestionEntity[];
  public readonly attempts?: QuizAttemptEntity[];

  constructor(
    id: string,
    title: string,
    difficulty: Difficulty,
    durationMinutes: number,
    passingScorePercentage: number,
    questions: QuestionEntity[],
    description?: string,
    category?: string,
    maxAttempts: number = 0,
    isActive: boolean = true,
    isRandomized: boolean = false,
    showCorrectAnswers: boolean = true,
    showExplanations: boolean = true,
    createdBy?: string,
    lastModifiedBy?: string,
    attempts?: QuizAttemptEntity[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.difficulty = difficulty;
    this.durationMinutes = durationMinutes;
    this.passingScorePercentage = passingScorePercentage;
    this.maxAttempts = maxAttempts;
    this.isActive = isActive;
    this.isRandomized = isRandomized;
    this.showCorrectAnswers = showCorrectAnswers;
    this.showExplanations = showExplanations;
    this.createdBy = createdBy;
    this.lastModifiedBy = lastModifiedBy;
    this.questions = questions;
    this.attempts = attempts;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Quiz ID is required');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Quiz title is required');
    }
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

  public static create(
    title: string,
    difficulty: Difficulty,
    durationMinutes: number,
    passingScorePercentage: number,
    questions: QuestionEntity[],
    description?: string,
    category?: string,
    maxAttempts: number = 0,
    isRandomized: boolean = false,
    showCorrectAnswers: boolean = true,
    showExplanations: boolean = true,
    createdBy?: string,
  ): QuizEntity {
    const id = crypto.randomUUID();
    return new QuizEntity(
      id,
      title,
      difficulty,
      durationMinutes,
      passingScorePercentage,
      questions,
      description,
      category,
      maxAttempts,
      true, // isActive
      isRandomized,
      showCorrectAnswers,
      showExplanations,
      createdBy,
      createdBy, // lastModifiedBy
      [], // attempts
    );
  }

  public get totalQuestions(): number {
    return this.questions.length;
  }

  public get totalPoints(): number {
    return this.questions.reduce((sum, question) => sum + question.points, 0);
  }

  public get activeQuestions(): QuestionEntity[] {
    return this.questions.filter(question => question.isActive);
  }

  public canStartAttempt(userId: string, existingAttempts: QuizAttemptEntity[] = []): boolean {
    if (!this.isActive) return false;
    
    if (this.maxAttempts > 0) {
      const userAttempts = existingAttempts.filter(attempt => attempt.userId === userId);
      if (userAttempts.length >= this.maxAttempts) return false;
    }
    
    return true;
  }

  public calculateScore(questionAttempts: QuestionAttemptEntity[]): {
    totalPoints: number;
    earnedPoints: number;
    percentage: number;
    isPassed: boolean;
  } {
    const totalPoints = this.totalPoints;
    const earnedPoints = questionAttempts.reduce((sum, attempt) => sum + attempt.pointsEarned, 0);
    const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const isPassed = percentage >= this.passingScorePercentage;

    return {
      totalPoints,
      earnedPoints,
      percentage,
      isPassed
    };
  }
}

export class QuestionEntity {
  public readonly id: string;
  public readonly quizId: string;
  public readonly questionText: string;
  public readonly explanation?: string;
  public readonly questionType: QuestionType;
  public readonly difficulty: Difficulty;
  public readonly points: number;
  public readonly orderIndex: number;
  public readonly isActive: boolean;
  public readonly isRequired: boolean;
  public readonly timeLimitSeconds?: number;
  public readonly totalAttempts: number;
  public readonly correctAttempts: number;
  public readonly averageTimeSeconds: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly options: QuestionOptionEntity[];
  public readonly attempts?: QuestionAttemptEntity[];

  constructor(
    id: string,
    quizId: string,
    questionText: string,
    questionType: QuestionType,
    difficulty: Difficulty,
    points: number,
    orderIndex: number,
    options: QuestionOptionEntity[],
    isActive: boolean = true,
    explanation?: string,
    isRequired: boolean = false,
    timeLimitSeconds?: number,
    totalAttempts: number = 0,
    correctAttempts: number = 0,
    averageTimeSeconds: number = 0,
    attempts?: QuestionAttemptEntity[],
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.quizId = quizId;
    this.questionText = questionText;
    this.explanation = explanation;
    this.questionType = questionType;
    this.difficulty = difficulty;
    this.points = points;
    this.orderIndex = orderIndex;
    this.isActive = isActive;
    this.isRequired = isRequired;
    this.timeLimitSeconds = timeLimitSeconds;
    this.totalAttempts = totalAttempts;
    this.correctAttempts = correctAttempts;
    this.averageTimeSeconds = averageTimeSeconds;
    this.options = options;
    this.attempts = attempts;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public get successRate(): number {
    return this.totalAttempts > 0 ? (this.correctAttempts / this.totalAttempts) * 100 : 0;
  }

  public get difficultyLevel(): 'easy' | 'medium' | 'hard' {
    if (this.successRate >= 80) return 'easy';
    if (this.successRate >= 50) return 'medium';
    return 'hard';
  }
}

export class QuestionOptionEntity {
  public readonly id: string;
  public readonly questionId: string;
  public readonly optionText: string;
  public readonly isCorrect: boolean;
  public readonly orderIndex: number;
  public readonly isActive: boolean;
  public readonly selectionCount: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    questionId: string,
    optionText: string,
    isCorrect: boolean,
    orderIndex: number,
    isActive: boolean = true,
    selectionCount: number = 0,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.questionId = questionId;
    this.optionText = optionText;
    this.isCorrect = isCorrect;
    this.orderIndex = orderIndex;
    this.isActive = isActive;
    this.selectionCount = selectionCount;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

export class QuizAttemptEntity {
  public readonly id: string;
  public readonly quizId: string;
  public readonly userId: string;
  public readonly userType?: string;
  public readonly status: 'in_progress' | 'completed' | 'abandoned';
  public readonly startedAt?: Date;
  public readonly completedAt?: Date;
  public readonly totalQuestions: number;
  public readonly answeredQuestions: number;
  public readonly correctAnswers: number;
  public readonly scorePercentage: number;
  public readonly totalPoints: number;
  public readonly earnedPoints: number;
  public readonly isPassed: boolean;
  public readonly timeSpentSeconds?: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly questionAttempts: QuestionAttemptEntity[];

  constructor(
    id: string,
    quizId: string,
    userId: string,
    status: 'in_progress' | 'completed' | 'abandoned',
    totalQuestions: number,
    answeredQuestions: number,
    correctAnswers: number,
    scorePercentage: number,
    totalPoints: number,
    earnedPoints: number,
    isPassed: boolean,
    questionAttempts: QuestionAttemptEntity[],
    userType?: string,
    startedAt?: Date,
    completedAt?: Date,
    timeSpentSeconds?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.quizId = quizId;
    this.userId = userId;
    this.userType = userType;
    this.status = status;
    this.startedAt = startedAt;
    this.completedAt = completedAt;
    this.totalQuestions = totalQuestions;
    this.answeredQuestions = answeredQuestions;
    this.correctAnswers = correctAnswers;
    this.scorePercentage = scorePercentage;
    this.totalPoints = totalPoints;
    this.earnedPoints = earnedPoints;
    this.isPassed = isPassed;
    this.timeSpentSeconds = timeSpentSeconds;
    this.questionAttempts = questionAttempts;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }
}

export class QuestionAttemptEntity {
  public readonly id: string;
  public readonly quizAttemptId: string;
  public readonly questionId: string;
  public readonly selectedOptionId?: string;
  public readonly textAnswer?: string;
  public readonly booleanAnswer?: boolean;
  public readonly isCorrect: boolean;
  public readonly pointsEarned: number;
  public readonly maxPoints: number;
  public readonly timeSpentSeconds?: number;
  public readonly answeredAt: Date;
  public readonly createdAt: Date;

  constructor(
    id: string,
    quizAttemptId: string,
    questionId: string,
    isCorrect: boolean,
    pointsEarned: number,
    maxPoints: number,
    answeredAt: Date,
    selectedOptionId?: string,
    textAnswer?: string,
    booleanAnswer?: boolean,
    timeSpentSeconds?: number,
    createdAt?: Date,
  ) {
    this.id = id;
    this.quizAttemptId = quizAttemptId;
    this.questionId = questionId;
    this.selectedOptionId = selectedOptionId;
    this.textAnswer = textAnswer;
    this.booleanAnswer = booleanAnswer;
    this.isCorrect = isCorrect;
    this.pointsEarned = pointsEarned;
    this.maxPoints = maxPoints;
    this.timeSpentSeconds = timeSpentSeconds;
    this.answeredAt = answeredAt;
    this.createdAt = createdAt || new Date();
  }
}
