import { Level, SubscriptionTier, PaymentMethod } from './enums/user.enum';

export interface UserInterface {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  isPremium: boolean;
  isMarakiPremium: boolean;
  isBot: boolean;
  level: Level;
  referredBy?: number;
  referral: {
    count: number;
    usersTelegramId: number[];
  };
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  paymentMethod: PaymentMethod;
  dailyTokensUsed: number;
  monthlyTokensUsed: number;
  lastTokenReset: Date;
  totalQuizzesCompleted: number;
  totalMaterialsAccessed: number;
  totalTimeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  referredBy?: number;
}

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  isPremium?: boolean;
  isMarakiPremium?: boolean;
  level?: Level;
  subscriptionTier?: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  paymentMethod?: PaymentMethod;
  dailyTokensUsed?: number;
  monthlyTokensUsed?: number;
  lastTokenReset?: Date;
  totalQuizzesCompleted?: number;
  totalMaterialsAccessed?: number;
  totalTimeSpent?: number;
}