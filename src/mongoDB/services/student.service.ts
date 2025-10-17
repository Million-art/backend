import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Conversation, ConversationDocument } from '../schemas/conversation.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Conversation.name) private conversationModel: Model<ConversationDocument>,
  ) {}

  // User Management
  async createUser(userData: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async findByTelegramId(telegramId: number): Promise<UserDocument | null> {
    return await this.userModel.findOne({ telegramId }).exec();
  }

  async updateUser(telegramId: number, updateData: Partial<User>): Promise<UserDocument | null> {
    return await this.userModel.findOneAndUpdate({ telegramId }, updateData, { new: true }).exec();
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  // Premium Management
  async upgradeToPremium(telegramId: number, paymentData?: any): Promise<UserDocument | null> {
    const updateData: Partial<User> = {
      isMarakiPremium: true,
      subscriptionTier: 'premium',
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      paymentMethod: paymentData?.method || 'telegram_stars',
    };

    // Handle different payment methods
    if (paymentData?.method === 'telegram_stars') {
      updateData.telegramStarsUsed = (paymentData.starsUsed || 0);
    }

    return await this.updateUser(telegramId, updateData);
  }

  async downgradeToFree(telegramId: number): Promise<UserDocument | null> {
    return await this.updateUser(telegramId, {
      isMarakiPremium: false,
      subscriptionTier: 'free',
      subscriptionExpiresAt: undefined,
      paymentMethod: 'free',
    });
  }

  // Telegram Stars Payment Methods
  async addTelegramStars(telegramId: number, starsAmount: number): Promise<UserDocument | null> {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return await this.updateUser(telegramId, {
      telegramStarsBalance: (user.telegramStarsBalance || 0) + starsAmount,
    });
  }

  async useTelegramStars(telegramId: number, starsAmount: number): Promise<{ success: boolean; remainingStars: number }> {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return { success: false, remainingStars: 0 };

    const currentBalance = user.telegramStarsBalance || 0;
    if (currentBalance < starsAmount) {
      return { success: false, remainingStars: currentBalance };
    }

    await this.updateUser(telegramId, {
      telegramStarsBalance: currentBalance - starsAmount,
      telegramStarsUsed: (user.telegramStarsUsed || 0) + starsAmount,
    });

    return { success: true, remainingStars: currentBalance - starsAmount };
  }

  // Chapa Payment Methods
  async processChapaPayment(telegramId: number, chapaData: any): Promise<UserDocument | null> {
    return await this.updateUser(telegramId, {
      paymentMethod: 'chapa',
    });
  }

  async getPaymentHistory(telegramId: number): Promise<any> {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return {
      paymentMethod: user.paymentMethod,
      telegramStarsUsed: user.telegramStarsUsed || 0,
      telegramStarsBalance: user.telegramStarsBalance || 0,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpiresAt: user.subscriptionExpiresAt,
    };
  }

  // Usage Tracking
  async checkUsageLimit(telegramId: number, feature: string) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) {
      return { hasAccess: false, remaining: 0, reason: 'User not found' };
    }

    const limits = this.getFeatureLimits(user.subscriptionTier, feature);
    
    if (limits.max === -1) {
      return { hasAccess: true, remaining: -1, tier: user.subscriptionTier };
    }

    const currentUsage = this.getCurrentUsage(user, feature);
    const remaining = Math.max(0, limits.max - currentUsage);
    
    return {
      hasAccess: currentUsage < limits.max,
      remaining,
      tier: user.subscriptionTier,
      currentUsage
    };
  }

  async incrementUsage(telegramId: number, feature: string): Promise<void> {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return;

    const limits = this.getFeatureLimits(user.subscriptionTier, feature);
    if (limits.max === -1) return; // Unlimited

    const currentUsage = this.getCurrentUsage(user, feature);
    if (currentUsage >= limits.max) {
      throw new Error(`Usage limit exceeded for ${feature}`);
    }

    const updateData: Partial<User> = {};
    switch (feature) {
      case 'grammar':
        updateData.dailyGrammarUsage = currentUsage + 1;
        break;
      case 'lesson':
        updateData.weeklyLessonUsage = currentUsage + 1;
        break;
      case 'chat':
        updateData.dailyChatUsage = currentUsage + 1;
        break;
      case 'translation':
        updateData.dailyTranslationUsage = currentUsage + 1;
        break;
    }

    await this.updateUser(telegramId, updateData);
  }

  // Progress Management
  async getStudentProgress(telegramId: number) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    const conversation = await this.conversationModel.findOne({ user: user._id }).exec();
    
    return {
      student: {
        id: user._id,
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        isPremium: user.isPremium, // Telegram's premium
        isMarakiPremium: user.isMarakiPremium, // Our premium
        subscriptionTier: user.subscriptionTier,
        referralCount: user.referral?.count || 0,
      },
      progress: {
        grammarMistakes: conversation?.grammarMistakes?.length || 0,
        lessonsCompleted: conversation?.lessons?.length || 0,
        chatMessages: conversation?.chatHistory?.length || 0,
        totalQuizzesCompleted: user.totalQuizzesCompleted,
        totalMaterialsAccessed: user.totalMaterialsAccessed,
        totalTimeSpent: user.totalTimeSpent,
      }
    };
  }

  // Analytics
  async getStudentStats() {
    const total = await this.userModel.countDocuments();
    const premium = await this.userModel.countDocuments({ isMarakiPremium: true });
    const free = total - premium;
    
    return {
      totalStudents: total,
      premiumStudents: premium,
      freeStudents: free,
      conversionRate: total > 0 ? (premium / total) * 100 : 0
    };
  }

  // Conversation Management
  async getConversation(telegramId: number) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return await this.conversationModel.findOne({ user: user._id }).exec();
  }

  async addGrammarMistake(telegramId: number, mistake: any) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return await this.conversationModel.findOneAndUpdate(
      { user: user._id },
      { $push: { grammarMistakes: mistake } },
      { upsert: true, new: true }
    ).exec();
  }

  async addLesson(telegramId: number, lesson: any) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return await this.conversationModel.findOneAndUpdate(
      { user: user._id },
      { $push: { lessons: lesson } },
      { upsert: true, new: true }
    ).exec();
  }

  async addChatMessage(telegramId: number, chatEntry: any) {
    const user = await this.findByTelegramId(telegramId);
    if (!user) return null;

    return await this.conversationModel.findOneAndUpdate(
      { user: user._id },
      { $push: { chatHistory: chatEntry } },
      { upsert: true, new: true }
    ).exec();
  }

  // Helper Methods
  private getFeatureLimits(tier: string, feature: string) {
    const limits = {
      free: {
        grammar: { max: 5, period: 'daily' },
        lesson: { max: 2, period: 'weekly' },
        chat: { max: 10, period: 'daily' },
        translation: { max: 5, period: 'daily' },
        quiz: { max: 3, period: 'weekly' },
        material: { max: 5, period: 'weekly' }
      },
      premium: {
        grammar: { max: -1, period: 'unlimited' },
        lesson: { max: -1, period: 'unlimited' },
        chat: { max: -1, period: 'unlimited' },
        translation: { max: -1, period: 'unlimited' },
        quiz: { max: -1, period: 'unlimited' },
        material: { max: -1, period: 'unlimited' }
      },
      pro: {
        grammar: { max: -1, period: 'unlimited' },
        lesson: { max: -1, period: 'unlimited' },
        chat: { max: -1, period: 'unlimited' },
        translation: { max: -1, period: 'unlimited' },
        quiz: { max: -1, period: 'unlimited' },
        material: { max: -1, period: 'unlimited' }
      }
    };

    return limits[tier]?.[feature] || limits.free[feature] || { max: 0, period: 'none' };
  }

  private getCurrentUsage(user: UserDocument, feature: string): number {
    switch (feature) {
      case 'grammar':
        return user.dailyGrammarUsage || 0;
      case 'lesson':
        return user.weeklyLessonUsage || 0;
      case 'chat':
        return user.dailyChatUsage || 0;
      case 'translation':
        return user.dailyTranslationUsage || 0;
      default:
        return 0;
    }
  }
}
