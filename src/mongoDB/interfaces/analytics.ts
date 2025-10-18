export interface TelegramUserAnalytics {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    marakiPremiumUsers: number;
    levelBreakdown: {
      beginner: number;
      intermediate: number;
      advanced: number;
    };
    subscriptionBreakdown: {
      free: number;
      premium: number;
      pro: number;
    };
    recentUsers: number; // Users registered in last 30 days
    averageUsage: {
      dailyGrammarUsage: number;
      weeklyLessonUsage: number;
      dailyChatUsage: number;
      dailyTranslationUsage: number;
    };
    engagement: {
      totalQuizzesCompleted: number;
      totalMaterialsAccessed: number;
      totalTimeSpent: number;
    };
  }
  
  export interface TelegramUserSummary {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    levelBreakdown: {
      beginner: number;
      intermediate: number;
      advanced: number;
    };
    subscriptionBreakdown: {
      free: number;
      premium: number;
      pro: number;
    };
  }
  