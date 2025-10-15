import { QuizInterface, Question } from '../interfaces/quiz.interface';
import { Difficulty } from '../interfaces/enums';

export class QuizEntity implements QuizInterface {
  public readonly id: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly duration: number;
  public readonly totalQuestions: number;
  public readonly passingScore: number;
  public readonly isActive: boolean;
  public readonly questions: Question[];
  public readonly category?: string;
  public readonly difficulty: Difficulty;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    title: string,
    duration: number,
    totalQuestions: number,
    passingScore: number,
    questions: Question[],
    difficulty: Difficulty,
    isActive: boolean = true,
    description?: string,
    category?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.totalQuestions = totalQuestions;
    this.passingScore = passingScore;
    this.isActive = isActive;
    this.questions = questions;
    this.category = category;
    this.difficulty = difficulty;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Quiz Id is required');
    }
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Quiz title is required');
    }
    if (this.duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }
    if (this.totalQuestions <= 0) {
      throw new Error('Total questions must be greater than 0');
    }
    if (this.passingScore < 0 || this.passingScore > 100) {
      throw new Error('Passing score must be between 0 and 100');
    }
    if (!this.questions || this.questions.length === 0) {
      throw new Error('Quiz must have at least one question');
    }
    if (this.questions.length !== this.totalQuestions) {
      throw new Error('Questions count must match total questions');
    }
  }

  public static create(
    title: string,
    duration: number,
    totalQuestions: number,
    passingScore: number,
    questions: Question[],
    difficulty: Difficulty,
    description?: string,
    category?: string,
  ): QuizEntity {
    const id = crypto.randomUUID();
    return new QuizEntity(
      id,
      title,
      duration,
      totalQuestions,
      passingScore,
      questions,
      difficulty,
      true,
      description,
      category,
    );
  }

  public updateQuiz(
    title?: string,
    description?: string,
    duration?: number,
    totalQuestions?: number,
    passingScore?: number,
    questions?: Question[],
    category?: string,
    difficulty?: Difficulty,
  ): QuizEntity {
    const newTotalQuestions = totalQuestions || this.totalQuestions;
    const newQuestions = questions || this.questions;
    
    if (newQuestions.length !== newTotalQuestions) {
      throw new Error('Questions count must match total questions');
    }

    return new QuizEntity(
      this.id,
      title || this.title,
      duration || this.duration,
      newTotalQuestions,
      passingScore || this.passingScore,
      newQuestions,
      difficulty || this.difficulty,
      this.isActive,
      description !== undefined ? description : this.description,
      category !== undefined ? category : this.category,
      this.createdAt,
      new Date(),
    );
  }

  public activateQuiz(): QuizEntity {
    if (this.isActive) {
      throw new Error('Quiz is already active');
    }
    return new QuizEntity(
      this.id,
      this.title,
      this.duration,
      this.totalQuestions,
      this.passingScore,
      this.questions,
      this.difficulty,
      true,
      this.description,
      this.category,
      this.createdAt,
      new Date(),
    );
  }

  public deactivateQuiz(): QuizEntity {
    if (!this.isActive) {
      throw new Error('Quiz is already inactive');
    }
    return new QuizEntity(
      this.id,
      this.title,
      this.duration,
      this.totalQuestions,
      this.passingScore,
      this.questions,
      this.difficulty,
      false,
      this.description,
      this.category,
      this.createdAt,
      new Date(),
    );
  }
}
