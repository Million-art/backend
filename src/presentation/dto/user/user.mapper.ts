import { UserEntity } from '../../../domain/entities/user.entity';
import { UserResponseDto } from './user-response.dto';
import { TokenUsageResponseDto } from './token-usage-response.dto';

export class UserMapper {
  static toResponseDto(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isPremium: user.isPremium,
      isMarakiPremium: user.isMarakiPremium,
      isBot: user.isBot,
      level: user.level,
      referredBy: user.referredBy,
      referral: user.referral,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
      paymentMethod: user.paymentMethod,
      dailyTokensUsed: user.dailyTokensUsed,
      monthlyTokensUsed: user.monthlyTokensUsed,
      lastTokenReset: user.lastTokenReset,
      totalQuizzesCompleted: user.totalQuizzesCompleted,
      totalMaterialsAccessed: user.totalMaterialsAccessed,
      totalTimeSpent: user.totalTimeSpent,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toTokenUsageResponseDto(user: UserEntity): TokenUsageResponseDto {
    const limits = user.getTokenLimits();
    const dailyUsed = user.dailyTokensUsed || 0;
    const monthlyUsed = user.monthlyTokensUsed || 0;
    
    const dailyRemaining = Math.max(0, limits.dailyTokens - dailyUsed);
    const monthlyRemaining = Math.max(0, limits.monthlyTokens - monthlyUsed);

    return {
      tier: user.subscriptionTier,
      daily: {
        used: dailyUsed,
        limit: limits.dailyTokens,
        remaining: dailyRemaining,
        percentage: Math.round((dailyUsed / limits.dailyTokens) * 100)
      },
      monthly: {
        used: monthlyUsed,
        limit: limits.monthlyTokens,
        remaining: monthlyRemaining,
        percentage: Math.round((monthlyUsed / limits.monthlyTokens) * 100)
      },
      lastReset: user.lastTokenReset
    };
  }
}
