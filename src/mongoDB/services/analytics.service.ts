import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

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

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getTelegramUserAnalytics(): Promise<TelegramUserAnalytics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      marakiPremiumUsers,
      levelStats,
      subscriptionStats,
      recentUsers,
      usageStats,
      engagementStats
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ 
        $or: [
          { lastUsageReset: { $gte: thirtyDaysAgo } },
          { 'referral.count': { $gt: 0 } }
        ]
      }),
      this.userModel.countDocuments({ isPremium: true }),
      this.userModel.countDocuments({ isMarakiPremium: true }),
      this.userModel.aggregate([
        {
          $group: {
            _id: '$level',
            count: { $sum: 1 }
          }
        }
      ]),
      this.userModel.aggregate([
        {
          $group: {
            _id: '$subscriptionTier',
            count: { $sum: 1 }
          }
        }
      ]),
      this.userModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      this.userModel.aggregate([
        {
          $group: {
            _id: null,
            avgDailyGrammar: { $avg: '$dailyGrammarUsage' },
            avgWeeklyLesson: { $avg: '$weeklyLessonUsage' },
            avgDailyChat: { $avg: '$dailyChatUsage' },
            avgDailyTranslation: { $avg: '$dailyTranslationUsage' }
          }
        }
      ]),
      this.userModel.aggregate([
        {
          $group: {
            _id: null,
            totalQuizzes: { $sum: '$totalQuizzesCompleted' },
            totalMaterials: { $sum: '$totalMaterialsAccessed' },
            totalTime: { $sum: '$totalTimeSpent' }
          }
        }
      ])
    ]);

    // Process level breakdown
    const levelBreakdown = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };
    levelStats.forEach(stat => {
      if (stat._id in levelBreakdown) {
        levelBreakdown[stat._id] = stat.count;
      }
    });

    // Process subscription breakdown
    const subscriptionBreakdown = {
      free: 0,
      premium: 0,
      pro: 0
    };
    subscriptionStats.forEach(stat => {
      if (stat._id in subscriptionBreakdown) {
        subscriptionBreakdown[stat._id] = stat.count;
      }
    });

    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      marakiPremiumUsers,
      levelBreakdown,
      subscriptionBreakdown,
      recentUsers,
      averageUsage: {
        dailyGrammarUsage: Math.round(usageStats[0]?.avgDailyGrammar || 0),
        weeklyLessonUsage: Math.round(usageStats[0]?.avgWeeklyLesson || 0),
        dailyChatUsage: Math.round(usageStats[0]?.avgDailyChat || 0),
        dailyTranslationUsage: Math.round(usageStats[0]?.avgDailyTranslation || 0)
      },
      engagement: {
        totalQuizzesCompleted: engagementStats[0]?.totalQuizzes || 0,
        totalMaterialsAccessed: engagementStats[0]?.totalMaterials || 0,
        totalTimeSpent: engagementStats[0]?.totalTime || 0
      }
    };
  }

  async getTelegramUserSummary(): Promise<TelegramUserSummary> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalUsers,
      activeUsers,
      premiumUsers,
      levelStats,
      subscriptionStats
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ 
        $or: [
          { lastUsageReset: { $gte: thirtyDaysAgo } },
          { 'referral.count': { $gt: 0 } }
        ]
      }),
      this.userModel.countDocuments({ isPremium: true }),
      this.userModel.aggregate([
        {
          $group: {
            _id: '$level',
            count: { $sum: 1 }
          }
        }
      ]),
      this.userModel.aggregate([
        {
          $group: {
            _id: '$subscriptionTier',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Process level breakdown
    const levelBreakdown = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };
    levelStats.forEach(stat => {
      if (stat._id in levelBreakdown) {
        levelBreakdown[stat._id] = stat.count;
      }
    });

    // Process subscription breakdown
    const subscriptionBreakdown = {
      free: 0,
      premium: 0,
      pro: 0
    };
    subscriptionStats.forEach(stat => {
      if (stat._id in subscriptionBreakdown) {
        subscriptionBreakdown[stat._id] = stat.count;
      }
    });

    return {
      totalUsers,
      activeUsers,
      premiumUsers,
      levelBreakdown,
      subscriptionBreakdown
    };
  }
}
