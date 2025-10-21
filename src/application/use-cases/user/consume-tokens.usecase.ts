import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../../domain/ports/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class ConsumeTokensUseCase {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(telegramId: number, tokensUsed: number): Promise<UserEntity> {
    const user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if token reset is needed
    const userWithReset = await this.checkAndResetTokenUsage(user);

    // Consume tokens (immutable update)
    const updatedUser = userWithReset.consumeTokens(tokensUsed, tokensUsed);

    return await this.userRepository.update(updatedUser);
  }

  async checkTokenLimit(telegramId: number, estimatedTokens: number): Promise<{
    hasAccess: boolean;
    dailyRemaining: number;
    monthlyRemaining: number;
    dailyUsed: number;
    monthlyUsed: number;
    dailyLimit: number;
    monthlyLimit: number;
    tier: string;
    estimatedTokens: number;
  }> {
    const user = await this.userRepository.findByTelegramId(telegramId);
    if (!user) {
      return { 
        hasAccess: false, 
        dailyRemaining: 0, 
        monthlyRemaining: 0,
        dailyUsed: 0,
        monthlyUsed: 0,
        dailyLimit: 0,
        monthlyLimit: 0,
        tier: 'free',
        estimatedTokens: 0
      };
    }

    // Check if token reset is needed
    await this.checkAndResetTokenUsage(user);

    const limits = user.getTokenLimits();
    const dailyUsed = user.dailyTokensUsed || 0;
    const monthlyUsed = user.monthlyTokensUsed || 0;

    // Check both daily and monthly limits
    const dailyRemaining = Math.max(0, limits.dailyTokens - dailyUsed);
    const monthlyRemaining = Math.max(0, limits.monthlyTokens - monthlyUsed);

    const hasDailyAccess = dailyUsed + estimatedTokens <= limits.dailyTokens;
    const hasMonthlyAccess = monthlyUsed + estimatedTokens <= limits.monthlyTokens;
    const hasAccess = hasDailyAccess && hasMonthlyAccess;

    return {
      hasAccess,
      dailyRemaining,
      monthlyRemaining,
      dailyUsed,
      monthlyUsed,
      dailyLimit: limits.dailyTokens,
      monthlyLimit: limits.monthlyTokens,
      tier: user.subscriptionTier,
      estimatedTokens
    };
  }

  private async checkAndResetTokenUsage(user: UserEntity): Promise<UserEntity> {
    const now = new Date();
    const lastReset = user.lastTokenReset || new Date(0);

    // Check if it's a new day (reset daily tokens at midnight)
    const isNewDay = now.toDateString() !== lastReset.toDateString();

    // Check if it's a new month (reset monthly tokens)
    const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

    if (isNewDay || isNewMonth) {
      return user.resetTokenUsage();
    }

    return user;
  }
}
