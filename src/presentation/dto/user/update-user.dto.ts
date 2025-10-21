import { IsOptional, IsString, IsBoolean, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Telegram username', example: 'john_doe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ description: 'User first name', example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User last name', example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Is Telegram premium user', example: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({ description: 'Is Maraki premium user', example: false })
  @IsOptional()
  @IsBoolean()
  isMarakiPremium?: boolean;

  @ApiPropertyOptional({ description: 'User level', example: 'beginner' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Subscription tier', example: 'free' })
  @IsOptional()
  @IsString()
  subscriptionTier?: string;

  @ApiPropertyOptional({ description: 'Subscription expiration date' })
  @IsOptional()
  @IsDateString()
  subscriptionExpiresAt?: Date;

  @ApiPropertyOptional({ description: 'Payment method', example: 'free' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Daily tokens used', example: 0 })
  @IsOptional()
  @IsNumber()
  dailyTokensUsed?: number;

  @ApiPropertyOptional({ description: 'Monthly tokens used', example: 0 })
  @IsOptional()
  @IsNumber()
  monthlyTokensUsed?: number;

  @ApiPropertyOptional({ description: 'Last token reset date' })
  @IsOptional()
  @IsDateString()
  lastTokenReset?: Date;

  @ApiPropertyOptional({ description: 'Total quizzes completed', example: 0 })
  @IsOptional()
  @IsNumber()
  totalQuizzesCompleted?: number;

  @ApiPropertyOptional({ description: 'Total materials accessed', example: 0 })
  @IsOptional()
  @IsNumber()
  totalMaterialsAccessed?: number;

  @ApiPropertyOptional({ description: 'Total time spent in minutes', example: 0 })
  @IsOptional()
  @IsNumber()
  totalTimeSpent?: number;
}
