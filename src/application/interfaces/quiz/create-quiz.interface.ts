import { Question, Difficulty } from '../../../domain/interfaces/quiz.interface';

export interface CreateQuizRequest {
  title: string;
  description?: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
  category?: string;
  difficulty: Difficulty;
}
