import { QuestionEntity } from '../../../domain/entities/quiz.entity';
import { Difficulty } from '../../../domain/interfaces/enums';

export interface CreateQuizRequest {
  title: string;
  description?: string;
  durationMinutes: number;
  passingScorePercentage: number;
  maxAttempts?: number;
  questions: QuestionEntity[];
  category?: string;
  difficulty: Difficulty;
  isRandomized?: boolean;
  showCorrectAnswers?: boolean;
  showExplanations?: boolean;
}
