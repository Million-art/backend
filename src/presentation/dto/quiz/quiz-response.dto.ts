import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, Difficulty } from '../../../domain/interfaces/enums';

export class QuestionResponseDto {
  @ApiProperty({ description: 'Question ID' })
  id: string;

  @ApiProperty({ description: 'Question text' })
  question: string;

  @ApiProperty({ enum: QuestionType, description: 'Question type' })
  type: QuestionType;

  @ApiPropertyOptional({ type: [String], description: 'Answer options for multiple choice questions' })
  options?: string[];

  @ApiProperty({ description: 'Correct answer' })
  correctAnswer: string | number;

  @ApiProperty({ description: 'Points for this question' })
  points: number;

  @ApiPropertyOptional({ description: 'Explanation for the answer' })
  explanation?: string;
}

export class QuizResponseDto {
  @ApiProperty({ description: 'Quiz ID' })
  id: string;

  @ApiProperty({ description: 'Quiz title' })
  title: string;

  @ApiPropertyOptional({ description: 'Quiz description' })
  description?: string;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Total number of questions' })
  totalQuestions: number;

  @ApiProperty({ description: 'Passing score percentage' })
  passingScore: number;

  @ApiProperty({ description: 'Whether the quiz is active' })
  isActive: boolean;

  @ApiProperty({ type: [QuestionResponseDto], description: 'Quiz questions' })
  questions: QuestionResponseDto[];

  @ApiPropertyOptional({ description: 'Quiz category' })
  category?: string;

  @ApiProperty({ enum: Difficulty, description: 'Quiz difficulty level' })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
