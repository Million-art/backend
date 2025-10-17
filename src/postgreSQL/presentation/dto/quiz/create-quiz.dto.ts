import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, IsEnum, ValidateNested, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, Difficulty } from '../../../domain/interfaces/enums';

export class CreateQuestionOptionDto {
  @ApiProperty({ description: 'Option text' })
  @IsString()
  optionText: string;

  @ApiProperty({ description: 'Order index of the option' })
  @IsNumber()
  orderIndex: number;

  @ApiProperty({ description: 'Whether this option is correct' })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({ description: 'Question text' })
  @IsString()
  questionText: string;

  @ApiPropertyOptional({ description: 'Explanation for the answer' })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiProperty({ enum: QuestionType, description: 'Question type' })
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @ApiProperty({ enum: Difficulty, description: 'Question difficulty' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ description: 'Points for this question' })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ description: 'Order index of the question' })
  @IsNumber()
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  @IsOptional()
  @IsNumber()
  timeLimitSeconds?: number;

  @ApiProperty({ type: [CreateQuestionOptionDto], description: 'Question options' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  options: CreateQuestionOptionDto[];
}

export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Quiz description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Quiz category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ enum: Difficulty, description: 'Quiz difficulty' })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ description: 'Duration in minutes' })
  @IsNumber()
  @Min(1)
  @Max(300)
  durationMinutes: number;

  @ApiProperty({ description: 'Passing score percentage' })
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScorePercentage: number;

  @ApiPropertyOptional({ description: 'Maximum attempts allowed' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAttempts?: number;

  @ApiPropertyOptional({ description: 'Whether to randomize questions' })
  @IsOptional()
  @IsBoolean()
  isRandomized?: boolean;

  @ApiPropertyOptional({ description: 'Whether to show correct answers' })
  @IsOptional()
  @IsBoolean()
  showCorrectAnswers?: boolean;

  @ApiPropertyOptional({ description: 'Whether to show explanations' })
  @IsOptional()
  @IsBoolean()
  showExplanations?: boolean;

  @ApiProperty({ type: [CreateQuestionDto], description: 'Quiz questions' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
