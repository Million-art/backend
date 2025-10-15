import { QuizEntity } from '../entities/quiz.entity';

export abstract class QuizRepository {
  abstract save(quiz: QuizEntity): Promise<QuizEntity>;
  abstract findById(id: string): Promise<QuizEntity | null>;
  abstract findAll(): Promise<QuizEntity[]>;
  abstract findByCategory(category: string): Promise<QuizEntity[]>;
  abstract findByDifficulty(difficulty: string): Promise<QuizEntity[]>;
  abstract findActive(): Promise<QuizEntity[]>;
  abstract softDelete(id: string): Promise<void>;
}
