import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-string' })
  id: string;

  @ApiProperty({ description: 'Telegram user ID', example: 123456789 })
  telegramId: number;

  @ApiPropertyOptional({ description: 'Telegram username', example: 'john_doe' })
  username?: string;

  @ApiPropertyOptional({ description: 'User first name', example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'User last name', example: 'Doe' })
  lastName?: string;

  @ApiProperty({ description: 'Is Telegram premium user', example: false })
  isPremium: boolean;

  @ApiProperty({ description: 'Is Maraki premium user', example: false })
  isMarakiPremium: boolean;

  @ApiProperty({ description: 'Is bot user', example: false })
  isBot: boolean;

  @ApiProperty({ description: 'User level', example: 'beginner' })
  level: string;

  @ApiPropertyOptional({ description: 'Referrer Telegram ID', example: 987654321 })
  referredBy?: number;

  @ApiProperty({ description: 'Referral information' })
  referral: {
    count: number;
    usersTelegramId: number[];
  };

  @ApiProperty({ description: 'Subscription tier', example: 'free' })
  subscriptionTier: string;

  @ApiPropertyOptional({ description: 'Subscription expiration date' })
  subscriptionExpiresAt?: Date;

  @ApiProperty({ description: 'Payment method', example: 'free' })
  paymentMethod: string;

  @ApiProperty({ description: 'Daily tokens used', example: 0 })
  dailyTokensUsed: number;

  @ApiProperty({ description: 'Monthly tokens used', example: 0 })
  monthlyTokensUsed: number;

  @ApiProperty({ description: 'Last token reset date' })
  lastTokenReset: Date;

  @ApiProperty({ description: 'Total quizzes completed', example: 0 })
  totalQuizzesCompleted: number;

  @ApiProperty({ description: 'Total materials accessed', example: 0 })
  totalMaterialsAccessed: number;

  @ApiProperty({ description: 'Total time spent in minutes', example: 0 })
  totalTimeSpent: number;

  @ApiProperty({ description: 'User creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date;
}
