import { QuizEntity } from '../entities/quiz.entity';

export interface QuizRepository {
  findAll(filters?: {
    category?: string;
    difficulty?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ quizzes: QuizEntity[]; total: number }>;
  
  findById(id: string): Promise<QuizEntity | null>;
  
  findByCategory(category: string): Promise<QuizEntity[]>;
  
  findByDifficulty(difficulty: string): Promise<QuizEntity[]>;
  
  findActiveQuizzes(): Promise<QuizEntity[]>;
  
  save(quiz: QuizEntity): Promise<QuizEntity>;
  
  update(id: string, quiz: Partial<QuizEntity>): Promise<QuizEntity | null>;
  
  delete(id: string): Promise<boolean>;
}
