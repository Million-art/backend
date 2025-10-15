import { QuestionType, Difficulty } from './enums';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
}

export interface QuizInterface {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  isActive: boolean;
  questions: Question[];
  category?: string;
  difficulty: Difficulty;
  createdAt: Date;
  updatedAt: Date;
}

// Re-export enums for easier importing
export { QuestionType, Difficulty } from './enums';
