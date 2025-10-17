import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Level {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  telegramId: number;

  @Prop({ default: null })
  username?: string;

  @Prop({ default: null })
  firstName?: string;

  @Prop({ default: null })
  lastName?: string;

  @Prop({ default: false })
  isPremium: boolean; // Telegram's premium status

  @Prop({ default: false })
  isMarakiPremium: boolean; // Our own premium subscription status

  @Prop({ default: false })
  isBot: boolean;

  @Prop({ type: String, enum: Object.values(Level), default: Level.Beginner })
  level: Level;

  @Prop({ default: null })
  referredBy?: number;

  @Prop({
    type: {
      count: { type: Number, default: 0 },
      usersTelegramId: { type: [Number], default: [] },
    },
    default: { count: 0, usersTelegramId: [] }
  })
  referral: {
    count: number;
    usersTelegramId: number[];
  };

  // Premium subscription fields
  @Prop({ type: String, enum: ['free', 'premium', 'pro'], default: 'free' })
  subscriptionTier: string;

  @Prop({ default: null })
  subscriptionExpiresAt?: Date;

  // Legacy payment fields (kept for backward compatibility)
  @Prop({ default: 0 })
  telegramStarsUsed: number;

  @Prop({ default: 0 })
  telegramStarsBalance: number;

  @Prop({ type: String, enum: ['telegram_stars', 'chapa', 'ton', 'tele_birr', 'stripe', 'paypal', 'free'], default: 'free' })
  paymentMethod: string;

  // Usage tracking
  @Prop({ default: 0 })
  dailyGrammarUsage: number;

  @Prop({ default: 0 })
  weeklyLessonUsage: number;

  @Prop({ default: 0 })
  dailyChatUsage: number;

  @Prop({ default: 0 })
  dailyTranslationUsage: number;

  @Prop({ default: Date.now })
  lastUsageReset: Date;

  // Mini-app access
  @Prop({ default: null })
  email?: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ default: true })
  miniAppAccess: boolean;

  // Progress tracking
  @Prop({ default: 0 })
  totalQuizzesCompleted: number;

  @Prop({ default: 0 })
  totalMaterialsAccessed: number;

  @Prop({ default: 0 })
  totalTimeSpent: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
