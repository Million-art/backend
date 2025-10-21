import { UserDomainInterface } from '../interfaces/user.domain.interface';
import { SubscriptionTier, PaymentMethod } from '../interfaces/user.domain.enums';

export class UserEntity implements UserDomainInterface {
  public readonly id: string;
  public readonly telegramId: number;
  public readonly username?: string;
  public readonly firstName?: string;
  public readonly lastName?: string;
  public readonly isPremium: boolean;
  public readonly isMarakiPremium: boolean;
  public readonly isBot: boolean;
  public readonly level: string;
  public readonly referredBy?: number;
  public readonly referral: {
    count: number;
    usersTelegramId: number[];
  };
  public readonly subscriptionTier: SubscriptionTier;
  public readonly subscriptionExpiresAt?: Date;
  public readonly paymentMethod: PaymentMethod;
  public readonly dailyTokensUsed: number;
  public readonly monthlyTokensUsed: number;
  public readonly lastTokenReset: Date;
  public readonly totalQuizzesCompleted: number;
  public readonly totalMaterialsAccessed: number;
  public readonly totalTimeSpent: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    telegramId: number,
    username?: string,
    firstName?: string,
    lastName?: string,
    isPremium: boolean = false,
    isMarakiPremium: boolean = false,
    isBot: boolean = false,
    level: string = 'beginner',
    referredBy?: number,
    referral: { count: number; usersTelegramId: number[] } = { count: 0, usersTelegramId: [] },
    subscriptionTier: SubscriptionTier = SubscriptionTier.Free,
    subscriptionExpiresAt?: Date,
    paymentMethod: PaymentMethod = PaymentMethod.Free,
    dailyTokensUsed: number = 0,
    monthlyTokensUsed: number = 0,
    lastTokenReset: Date = new Date(),
    totalQuizzesCompleted: number = 0,
    totalMaterialsAccessed: number = 0,
    totalTimeSpent: number = 0,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.telegramId = telegramId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isPremium = isPremium;
    this.isMarakiPremium = isMarakiPremium;
    this.isBot = isBot;
    this.level = level;
    this.referredBy = referredBy;
    this.referral = referral;
    this.subscriptionTier = subscriptionTier;
    this.subscriptionExpiresAt = subscriptionExpiresAt;
    this.paymentMethod = paymentMethod;
    this.dailyTokensUsed = dailyTokensUsed;
    this.monthlyTokensUsed = monthlyTokensUsed;
    this.lastTokenReset = lastTokenReset;
    this.totalQuizzesCompleted = totalQuizzesCompleted;
    this.totalMaterialsAccessed = totalMaterialsAccessed;
    this.totalTimeSpent = totalTimeSpent;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('User Id is required');
    }
    if (!this.telegramId || this.telegramId <= 0) {
      throw new Error('Valid Telegram ID is required');
    }
    if (!this.level) {
      throw new Error('User level is required');
    }
    if (!this.subscriptionTier) {
      throw new Error('Subscription tier is required');
    }
    if (!this.paymentMethod) {
      throw new Error('Payment method is required');
    }
  }

  public static create(
    telegramId: number,
    username?: string,
    firstName?: string,
    lastName?: string,
    referredBy?: number,
  ): UserEntity {
    const id = crypto.randomUUID();
    return new UserEntity(
      id,
      telegramId,
      username,
      firstName,
      lastName,
      false,
      false,
      false,
      'beginner',
      referredBy,
    );
  }

  public updateProfile(
    username?: string,
    firstName?: string,
    lastName?: string,
  ): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      username !== undefined ? username : this.username,
      firstName !== undefined ? firstName : this.firstName,
      lastName !== undefined ? lastName : this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public upgradeToPremium(
    subscriptionTier: SubscriptionTier,
    subscriptionExpiresAt: Date,
    paymentMethod: PaymentMethod,
  ): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      true, // isMarakiPremium
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      subscriptionTier,
      subscriptionExpiresAt,
      paymentMethod,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public downgradeToFree(): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      false, // isMarakiPremium
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      SubscriptionTier.Free,
      undefined, // subscriptionExpiresAt
      PaymentMethod.Free,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public addReferral(referredUserId: number): UserEntity {
    if (this.referral.usersTelegramId.includes(referredUserId)) {
      return this; // Already referred this user
    }

    const newReferralList = [...this.referral.usersTelegramId, referredUserId];
    const newReferral = {
      count: this.referral.count + 1,
      usersTelegramId: newReferralList,
    };

    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      newReferral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public consumeTokens(dailyTokens: number, monthlyTokens: number): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      this.dailyTokensUsed + dailyTokens,
      this.monthlyTokensUsed + monthlyTokens,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public resetTokenUsage(): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      0, // dailyTokensUsed
      0, // monthlyTokensUsed
      new Date(), // lastTokenReset
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public incrementQuizCompleted(): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted + 1,
      this.totalMaterialsAccessed,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public incrementMaterialAccessed(): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed + 1,
      this.totalTimeSpent,
      this.createdAt,
      this.updatedAt,
    );
  }

  public addTimeSpent(minutes: number): UserEntity {
    return new UserEntity(
      this.id,
      this.telegramId,
      this.username,
      this.firstName,
      this.lastName,
      this.isPremium,
      this.isMarakiPremium,
      this.isBot,
      this.level,
      this.referredBy,
      this.referral,
      this.subscriptionTier,
      this.subscriptionExpiresAt,
      this.paymentMethod,
      this.dailyTokensUsed,
      this.monthlyTokensUsed,
      this.lastTokenReset,
      this.totalQuizzesCompleted,
      this.totalMaterialsAccessed,
      this.totalTimeSpent + minutes,
      this.createdAt,
      this.updatedAt,
    );
  }

  public isTokenLimitExceeded(dailyLimit: number, monthlyLimit: number): boolean {
    return this.dailyTokensUsed >= dailyLimit || this.monthlyTokensUsed >= monthlyLimit;
  }

  public getTokenLimits() {
    const limits = {
      [SubscriptionTier.Free]: { dailyTokens: 1000, monthlyTokens: 10000 },
      [SubscriptionTier.Premium]: { dailyTokens: 10000, monthlyTokens: 100000 },
      [SubscriptionTier.Pro]: { dailyTokens: 50000, monthlyTokens: 500000 }
    };
    return limits[this.subscriptionTier] || limits[SubscriptionTier.Free];
  }
}