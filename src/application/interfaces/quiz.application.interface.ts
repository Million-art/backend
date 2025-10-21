import { QuizEntity } from '../../domain/entities/quiz.entity';

export interface QuizApplicationInterface {
  getAllQuizzes(filters?: {
    category?: string;
    difficulty?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ quizzes: QuizEntity[]; total: number; page: number; limit: number; totalPages: number }>;
  
  getQuizById(id: string): Promise<QuizEntity | null>;
  
  getQuizQuestions(quizId: string): Promise<QuizEntity | null>;
  
  getQuizAttempts(quizId: string, userId: string): Promise<any[]>;
  
  submitQuizAttempt(quizId: string, userId: string, answers: any[]): Promise<any>;
}
