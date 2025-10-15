import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum, ValidateNested, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, Difficulty } from '../../../domain/interfaces/enums';

export class QuestionDto {
  @ApiProperty({ description: 'Question ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Question text' })
  @IsString()
  question: string;

  @ApiProperty({ enum: QuestionType, description: 'Question type' })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional({ type: [String], description: 'Answer options for multiple choice questions' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({ description: 'Correct answer' })
  @IsNotEmpty()
  correctAnswer: string | number;

  @ApiProperty({ description: 'Points for this question' })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiPropertyOptional({ description: 'Explanation for the answer' })
  @IsOptional()
  @IsString()
  explanation?: string;
}

export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Quiz description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  @Max(300)
  duration: number;

  @ApiProperty({ description: 'Total number of questions' })
  @IsNumber()
  @Min(1)
  totalQuestions: number;

  @ApiProperty({ description: 'Passing score percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiPropertyOptional({ description: 'Whether the quiz is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [QuestionDto], description: 'Quiz questions' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @ApiPropertyOptional({ description: 'Quiz category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ enum: Difficulty, description: 'Quiz difficulty level' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
