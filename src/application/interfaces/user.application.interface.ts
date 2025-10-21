// Application layer interfaces - use case contracts
export interface CreateUserApplicationRequest {
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  referredBy?: number;
}

export interface UpdateUserApplicationRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  isPremium?: boolean;
  isMarakiPremium?: boolean;
  level?: string;
  subscriptionTier?: string;
  subscriptionExpiresAt?: Date;
  paymentMethod?: string;
  dailyTokensUsed?: number;
  monthlyTokensUsed?: number;
  lastTokenReset?: Date;
  totalQuizzesCompleted?: number;
  totalMaterialsAccessed?: number;
  totalTimeSpent?: number;
}

export interface UpgradeUserApplicationRequest {
  subscriptionTier: string;
  subscriptionDuration: number;
  paymentMethod: string;
}

export interface ConsumeTokensApplicationRequest {
  tokensUsed: number;
}


export interface TokenLimitCheckApplicationResponse {
  hasAccess: boolean;
  dailyRemaining: number;
  monthlyRemaining: number;
  dailyUsed: number;
  monthlyUsed: number;
  dailyLimit: number;
  monthlyLimit: number;
  tier: string;
  estimatedTokens: number;
}
