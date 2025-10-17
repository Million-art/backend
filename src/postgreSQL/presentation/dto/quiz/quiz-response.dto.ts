import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionType, Difficulty } from '../../../domain/interfaces/enums';

// ========================================
// REQUEST DTOs (Input)
// ========================================

export class CreateQuizDto {
  @ApiProperty({ description: 'Quiz title' })
  title: string;

  @ApiPropertyOptional({ description: 'Quiz description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Quiz category' })
  category?: string;

  @ApiProperty({ enum: Difficulty, description: 'Quiz difficulty' })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiProperty({ description: 'Passing score percentage' })
  passingScorePercentage: number;

  @ApiPropertyOptional({ description: 'Maximum attempts allowed' })
  maxAttempts?: number;

  @ApiPropertyOptional({ description: 'Whether to randomize questions' })
  isRandomized?: boolean;

  @ApiPropertyOptional({ description: 'Whether to show correct answers' })
  showCorrectAnswers?: boolean;

  @ApiPropertyOptional({ description: 'Whether to show explanations' })
  showExplanations?: boolean;
}

export class CreateQuestionOptionDto {
  @ApiProperty({ description: 'Option text' })
  optionText: string;

  @ApiProperty({ description: 'Whether this option is correct' })
  isCorrect: boolean;

  @ApiProperty({ description: 'Order index' })
  orderIndex: number;
}

export class CreateQuestionDto {
  @ApiProperty({ description: 'Question text' })
  questionText: string;

  @ApiPropertyOptional({ description: 'Question explanation' })
  explanation?: string;

  @ApiProperty({ enum: QuestionType, description: 'Question type' })
  questionType: QuestionType;

  @ApiProperty({ enum: Difficulty, description: 'Question difficulty' })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Points for this question' })
  points: number;

  @ApiProperty({ description: 'Order index in quiz' })
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  timeLimitSeconds?: number;

  @ApiProperty({ type: [CreateQuestionOptionDto], description: 'Answer options' })
  options: CreateQuestionOptionDto[];
}

export class StartQuizAttemptDto {
  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiPropertyOptional({ description: 'User type' })
  userType?: string;
}

export class SubmitQuestionAnswerDto {
  @ApiProperty({ description: 'Question ID' })
  questionId: string;

  @ApiPropertyOptional({ description: 'Selected option ID (for multiple choice)' })
  selectedOptionId?: string;

  @ApiPropertyOptional({ description: 'Text answer (for text questions)' })
  textAnswer?: string;

  @ApiPropertyOptional({ description: 'Boolean answer (for true/false)' })
  booleanAnswer?: boolean;

  @ApiPropertyOptional({ description: 'Time spent on question in seconds' })
  timeSpentSeconds?: number;
}

// ========================================
// RESPONSE DTOs (Output)
// ========================================

export class QuestionOptionResponseDto {
  @ApiProperty({ description: 'Option ID' })
  id: string;

  @ApiProperty({ description: 'Option text' })
  optionText: string;

  @ApiProperty({ description: 'Order index' })
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Whether this option is correct (only shown after submission)' })
  isCorrect?: boolean;

  @ApiPropertyOptional({ description: 'Selection count (for analytics)' })
  selectionCount?: number;
}

export class QuestionResponseDto {
  @ApiProperty({ description: 'Question ID' })
  id: string;

  @ApiProperty({ description: 'Question text' })
  questionText: string;

  @ApiPropertyOptional({ description: 'Question explanation' })
  explanation?: string;

  @ApiProperty({ enum: QuestionType, description: 'Question type' })
  questionType: QuestionType;

  @ApiProperty({ enum: Difficulty, description: 'Question difficulty' })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Points for this question' })
  points: number;

  @ApiProperty({ description: 'Order index in quiz' })
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Time limit in seconds' })
  timeLimitSeconds?: number;

  @ApiProperty({ type: [QuestionOptionResponseDto], description: 'Answer options' })
  options: QuestionOptionResponseDto[];

  @ApiPropertyOptional({ description: 'Total attempts (for analytics)' })
  totalAttempts?: number;

  @ApiPropertyOptional({ description: 'Correct attempts (for analytics)' })
  correctAttempts?: number;

  @ApiPropertyOptional({ description: 'Success rate percentage (for analytics)' })
  successRate?: number;
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

  @ApiProperty({ enum: Difficulty, description: 'Quiz difficulty' })
  difficulty: Difficulty;

  @ApiProperty({ description: 'Duration in minutes' })
  durationMinutes: number;

  @ApiProperty({ description: 'Passing score percentage' })
  passingScorePercentage: number;

  @ApiProperty({ description: 'Maximum attempts allowed' })
  maxAttempts: number;

  @ApiProperty({ description: 'Whether the quiz is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether questions are randomized' })
  isRandomized: boolean;

  @ApiProperty({ description: 'Whether to show correct answers' })
  showCorrectAnswers: boolean;

  @ApiProperty({ description: 'Whether to show explanations' })
  showExplanations: boolean;

  @ApiProperty({ description: 'Total number of questions' })
  totalQuestions: number;

  @ApiProperty({ description: 'Total points available' })
  totalPoints: number;

  @ApiProperty({ type: [QuestionResponseDto], description: 'Quiz questions' })
  questions: QuestionResponseDto[];

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class QuizAttemptResponseDto {
  @ApiProperty({ description: 'Attempt ID' })
  id: string;

  @ApiProperty({ description: 'Quiz ID' })
  quizId: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Attempt status' })
  status: 'in_progress' | 'completed' | 'abandoned';

  @ApiPropertyOptional({ description: 'Start time' })
  startedAt?: Date;

  @ApiPropertyOptional({ description: 'Completion time' })
  completedAt?: Date;

  @ApiProperty({ description: 'Total questions' })
  totalQuestions: number;

  @ApiProperty({ description: 'Answered questions' })
  answeredQuestions: number;

  @ApiProperty({ description: 'Correct answers' })
  correctAnswers: number;

  @ApiProperty({ description: 'Score percentage' })
  scorePercentage: number;

  @ApiProperty({ description: 'Total points available' })
  totalPoints: number;

  @ApiProperty({ description: 'Points earned' })
  earnedPoints: number;

  @ApiProperty({ description: 'Whether the attempt passed' })
  isPassed: boolean;

  @ApiPropertyOptional({ description: 'Time spent in seconds' })
  timeSpentSeconds?: number;
}

export class QuestionAttemptResponseDto {
  @ApiProperty({ description: 'Attempt ID' })
  id: string;

  @ApiProperty({ description: 'Question ID' })
  questionId: string;

  @ApiPropertyOptional({ description: 'Selected option ID' })
  selectedOptionId?: string;

  @ApiPropertyOptional({ description: 'Text answer' })
  textAnswer?: string;

  @ApiPropertyOptional({ description: 'Boolean answer' })
  booleanAnswer?: boolean;

  @ApiProperty({ description: 'Whether the answer is correct' })
  isCorrect: boolean;

  @ApiProperty({ description: 'Points earned' })
  pointsEarned: number;

  @ApiProperty({ description: 'Maximum points' })
  maxPoints: number;

  @ApiPropertyOptional({ description: 'Time spent in seconds' })
  timeSpentSeconds?: number;

  @ApiProperty({ description: 'Answer timestamp' })
  answeredAt: Date;
}

// ========================================
// ANALYTICS DTOs
// ========================================

export class QuestionAnalyticsDto {
  @ApiProperty({ description: 'Question ID' })
  questionId: string;

  @ApiProperty({ description: 'Question text' })
  questionText: string;

  @ApiProperty({ description: 'Total attempts' })
  totalAttempts: number;

  @ApiProperty({ description: 'Correct attempts' })
  correctAttempts: number;

  @ApiProperty({ description: 'Success rate percentage' })
  successRate: number;

  @ApiProperty({ description: 'Average time in seconds' })
  averageTime: number;

  @ApiProperty({ description: 'Difficulty level based on success rate' })
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

export class QuizAnalyticsDto {
  @ApiProperty({ description: 'Quiz ID' })
  quizId: string;

  @ApiProperty({ description: 'Total attempts' })
  totalAttempts: number;

  @ApiProperty({ description: 'Completed attempts' })
  completedAttempts: number;

  @ApiProperty({ description: 'Average score percentage' })
  averageScore: number;

  @ApiProperty({ description: 'Pass rate percentage' })
  passRate: number;

  @ApiProperty({ description: 'Average completion time in seconds' })
  averageCompletionTime: number;

  @ApiProperty({ type: [QuestionAnalyticsDto], description: 'Question analytics' })
  questionAnalytics: QuestionAnalyticsDto[];
}
