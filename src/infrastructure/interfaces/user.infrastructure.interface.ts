// Infrastructure layer interfaces - data access contracts
export interface UserInfrastructureInterface {
  _id: any;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRepositoryInfrastructureInterface {
  save(user: any): Promise<any>;
  findById(id: string): Promise<any>;
  findByTelegramId(telegramId: number): Promise<any>;
  findAll(): Promise<any[]>;
  update(user: any): Promise<any>;
  delete(id: string): Promise<void>;
}
