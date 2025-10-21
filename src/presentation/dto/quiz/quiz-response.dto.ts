import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, Difficulty } from '../../../domain/interfaces/quiz.domain.enums';

export class QuestionOptionResponseDto {
  @ApiProperty({ description: 'Option ID' })
  id: string;

  @ApiProperty({ description: 'Option text' })
  optionText: string;

  @ApiProperty({ description: 'Whether this option is correct' })
  isCorrect: boolean;

  @ApiProperty({ description: 'Order index' })
  orderIndex: number;

  @ApiProperty({ description: 'Whether option is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Number of times this option was selected' })
  selectionCount: number;
}

export class QuestionResponseDto {
  @ApiProperty({ description: 'Question ID' })
  id: string;

  @ApiProperty({ description: 'Quiz ID' })
  quizId: string;

  @ApiProperty({ description: 'Question text' })
  questionText: string;

  @ApiPropertyOptional({ description: 'Question explanation' })
  explanation?: string;

  @ApiProperty({ description: 'Question type', enum: QuestionType })
  questionType: QuestionType;

  @ApiProperty({ description: 'Question difficulty', enum: Difficulty })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Points for this question' })
  points: number;

  @ApiProperty({ description: 'Order index' })
  orderIndex: number;

  @ApiProperty({ description: 'Whether question is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether question is required' })
  isRequired: boolean;

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  timeLimitSeconds?: number;

  @ApiProperty({ description: 'Total attempts' })
  totalAttempts: number;

  @ApiProperty({ description: 'Correct attempts' })
  correctAttempts: number;

  @ApiProperty({ description: 'Average time in seconds' })
  averageTimeSeconds: number;

  @ApiProperty({ description: 'Question options', type: [QuestionOptionResponseDto] })
  options: QuestionOptionResponseDto[];

  @ApiProperty({ description: 'Success rate percentage' })
  successRate: number;

  @ApiProperty({ description: 'Difficulty level based on success rate' })
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

export class QuizResponseDto {
  @ApiProperty({ description: 'Quiz ID' })
  id: string;

  @ApiProperty({ description: 'Quiz title' })
  title: string;

  @ApiPropertyOptional({ description: 'Quiz description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Quiz category' })
  category?: string;

  @ApiProperty({ description: 'Quiz difficulty', enum: Difficulty })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiProperty({ description: 'Passing score percentage' })
  passingScorePercentage: number;

  @ApiProperty({ description: 'Maximum attempts allowed' })
  maxAttempts: number;

  @ApiProperty({ description: 'Whether quiz is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether questions are randomized' })
  isRandomized: boolean;

  @ApiProperty({ description: 'Whether to show correct answers' })
  showCorrectAnswers: boolean;

  @ApiProperty({ description: 'Whether to show explanations' })
  showExplanations: boolean;

  @ApiPropertyOptional({ description: 'Created by user' })
  createdBy?: string;

  @ApiPropertyOptional({ description: 'Last modified by user' })
  lastModifiedBy?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Quiz questions', type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];

  @ApiProperty({ description: 'Total number of questions' })
  totalQuestions: number;

  @ApiProperty({ description: 'Total points available' })
  totalPoints: number;

  @ApiProperty({ description: 'Number of active questions' })
  activeQuestions: number;
}

export class QuizListResponseDto {
  @ApiProperty({ description: 'List of quizzes', type: [QuizResponseDto] })
  data: QuizResponseDto[];

  @ApiProperty({ description: 'Total number of quizzes' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}
