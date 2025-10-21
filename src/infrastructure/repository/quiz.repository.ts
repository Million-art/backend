import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from '../schemas/quiz.schema';
import { QuizRepository as IQuizRepository } from '../../domain/ports/quiz.repository';
import { QuizEntity } from '../../domain/entities/quiz.entity';
import { QuestionEntity, QuestionOptionEntity } from '../../domain/entities/quiz.entity';
import { QuestionType, Difficulty } from '../../domain/interfaces/quiz.domain.enums';

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
  ) {}

  async findAll(filters?: {
    category?: string;
    difficulty?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ quizzes: QuizEntity[]; total: number }> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [quizzes, total] = await Promise.all([
      this.quizModel.find(query).skip(skip).limit(limit).exec(),
      this.quizModel.countDocuments(query).exec(),
    ]);

    return {
      quizzes: quizzes.map(quiz => this.convertToEntity(quiz)),
      total,
    };
  }

  async findById(id: string): Promise<QuizEntity | null> {
    const quiz = await this.quizModel.findOne({ id }).exec();
    return quiz ? this.convertToEntity(quiz) : null;
  }

  async findByCategory(category: string): Promise<QuizEntity[]> {
    const quizzes = await this.quizModel.find({ category, isActive: true }).exec();
    return quizzes.map(quiz => this.convertToEntity(quiz));
  }

  async findByDifficulty(difficulty: string): Promise<QuizEntity[]> {
    const quizzes = await this.quizModel.find({ difficulty, isActive: true }).exec();
    return quizzes.map(quiz => this.convertToEntity(quiz));
  }

  async findActiveQuizzes(): Promise<QuizEntity[]> {
    const quizzes = await this.quizModel.find({ isActive: true }).exec();
    return quizzes.map(quiz => this.convertToEntity(quiz));
  }

  async save(quiz: QuizEntity): Promise<QuizEntity> {
    const quizDoc = this.convertToDocument(quiz);
    const savedQuiz = await this.quizModel.create(quizDoc);
    return this.convertToEntity(savedQuiz);
  }

  async update(id: string, quiz: Partial<QuizEntity>): Promise<QuizEntity | null> {
    const updatedQuiz = await this.quizModel.findOneAndUpdate(
      { id },
      { $set: this.convertToDocument(quiz) },
      { new: true }
    ).exec();
    
    return updatedQuiz ? this.convertToEntity(updatedQuiz) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.quizModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  private convertToEntity(quizDoc: any): QuizEntity {
    // Use MongoDB _id as fallback if id field is missing
    const entityId = quizDoc.id || quizDoc._id?.toString();
    
    if (!entityId) {
      throw new Error(`Quiz document missing both id and _id fields: ${JSON.stringify(quizDoc)}`);
    }

    return new QuizEntity(
      entityId,
      quizDoc.title,
      quizDoc.difficulty,
      quizDoc.durationMinutes,
      quizDoc.passingScorePercentage,
      quizDoc.questions?.map(q => this.convertQuestionToEntity(q)) || [],
      quizDoc.description,
      quizDoc.category,
      quizDoc.maxAttempts,
      quizDoc.isActive,
      quizDoc.isRandomized,
      quizDoc.showCorrectAnswers,
      quizDoc.showExplanations,
      quizDoc.createdBy,
      quizDoc.lastModifiedBy,
      quizDoc.attempts || [],
      quizDoc.createdAt,
      quizDoc.updatedAt,
    );
  }

  private convertQuestionToEntity(questionDoc: any): QuestionEntity {
    return new QuestionEntity(
      questionDoc.id,
      questionDoc.quizId,
      questionDoc.questionText,
      questionDoc.questionType,
      questionDoc.difficulty,
      questionDoc.points,
      questionDoc.orderIndex,
      questionDoc.options?.map(opt => this.convertOptionToEntity(opt)) || [],
      questionDoc.isActive,
      questionDoc.explanation,
      questionDoc.isRequired,
      questionDoc.timeLimitSeconds,
      questionDoc.totalAttempts,
      questionDoc.correctAttempts,
      questionDoc.averageTimeSeconds,
      questionDoc.attempts || [],
      questionDoc.createdAt,
      questionDoc.updatedAt,
    );
  }

  private convertOptionToEntity(optionDoc: any): QuestionOptionEntity {
    return new QuestionOptionEntity(
      optionDoc.id,
      optionDoc.questionId,
      optionDoc.optionText,
      optionDoc.isCorrect,
      optionDoc.orderIndex,
      optionDoc.isActive,
      optionDoc.selectionCount,
      optionDoc.createdAt,
      optionDoc.updatedAt,
    );
  }

  private convertToDocument(quiz: QuizEntity | Partial<QuizEntity>): any {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      passingScorePercentage: quiz.passingScorePercentage,
      maxAttempts: quiz.maxAttempts,
      isActive: quiz.isActive,
      isRandomized: quiz.isRandomized,
      showCorrectAnswers: quiz.showCorrectAnswers,
      showExplanations: quiz.showExplanations,
      createdBy: quiz.createdBy,
      lastModifiedBy: quiz.lastModifiedBy,
      questions: quiz.questions?.map(q => this.convertQuestionToDocument(q)) || [],
      attempts: quiz.attempts || [],
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }

  private convertQuestionToDocument(question: QuestionEntity): any {
    return {
      id: question.id,
      quizId: question.quizId,
      questionText: question.questionText,
      explanation: question.explanation,
      questionType: question.questionType,
      difficulty: question.difficulty,
      points: question.points,
      orderIndex: question.orderIndex,
      isActive: question.isActive,
      isRequired: question.isRequired,
      timeLimitSeconds: question.timeLimitSeconds,
      totalAttempts: question.totalAttempts,
      correctAttempts: question.correctAttempts,
      averageTimeSeconds: question.averageTimeSeconds,
      options: question.options?.map(opt => this.convertOptionToDocument(opt)) || [],
      attempts: question.attempts || [],
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private convertOptionToDocument(option: QuestionOptionEntity): any {
    return {
      id: option.id,
      questionId: option.questionId,
      optionText: option.optionText,
      isCorrect: option.isCorrect,
      orderIndex: option.orderIndex,
      isActive: option.isActive,
      selectionCount: option.selectionCount,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    };
  }
}
