import { InjectRepository } from '@nestjs/typeorm';
import { QuizRepository } from '../../domain/ports/quiz.repository';
import { QuizModel } from '../models/quiz.model';
import { Repository } from 'typeorm';
import { QuizEntity } from '../../domain/entities/quiz.entity';

export class QuizRepositoryImpl implements QuizRepository {
  constructor(
    @InjectRepository(QuizModel)
    private quizRepository: Repository<QuizModel>,
  ) {}

  async save(quiz: QuizEntity): Promise<QuizEntity> {
    const newQuiz = this.quizRepository.create({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      totalQuestions: quiz.totalQuestions,
      passingScore: quiz.passingScore,
      isActive: quiz.isActive,
      questions: quiz.questions,
      category: quiz.category,
      difficulty: quiz.difficulty,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    });
    const savedQuiz = await this.quizRepository.save(newQuiz);
    return this.mapToEntity(savedQuiz);
  }

  async findById(id: string): Promise<QuizEntity | null> {
    const ormQuiz = await this.quizRepository.findOne({
      where: { id, isActive: true },
    });

    if (!ormQuiz) return null;

    return this.mapToEntity(ormQuiz);
  }

  async findAll(): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async findByCategory(category: string): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { category, isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async findByDifficulty(difficulty: string): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { difficulty: difficulty as any, isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async findActive(): Promise<QuizEntity[]> {
    const ormQuizzes = await this.quizRepository.find({
      where: { isActive: true },
    });
    return ormQuizzes.map(quiz => this.mapToEntity(quiz));
  }

  async softDelete(id: string): Promise<void> {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (quiz) {
      quiz.isActive = false;
      await this.quizRepository.save(quiz);
    }
  }

  private mapToEntity(ormQuiz: QuizModel): QuizEntity {
    return new QuizEntity(
      ormQuiz.id,
      ormQuiz.title,
      ormQuiz.duration,
      ormQuiz.totalQuestions,
      ormQuiz.passingScore,
      ormQuiz.questions,
      ormQuiz.difficulty,
      ormQuiz.isActive,
      ormQuiz.description,
      ormQuiz.category,
      ormQuiz.createdAt,
      ormQuiz.updatedAt,
    );
  }
}
