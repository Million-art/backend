// Domain layer interfaces - pure business logic
export interface UserDomainInterface {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  isPremium: boolean;
  isMarakiPremium: boolean;
  isBot: boolean;
  level: string;
  referredBy?: number;
  referral: {
    count: number;
    usersTelegramId: number[];
  };
  subscriptionTier: string;
  subscriptionExpiresAt?: Date;
  paymentMethod: string;
  dailyTokensUsed: number;
  monthlyTokensUsed: number;
  lastTokenReset: Date;
  totalQuizzesCompleted: number;
  totalMaterialsAccessed: number;
  totalTimeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}
