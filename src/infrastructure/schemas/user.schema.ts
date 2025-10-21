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

  // Payment method
  @Prop({ type: String, enum: ['chapa', 'free'], default: 'free' })
  paymentMethod: string;

  // Token-based usage tracking
  @Prop({ default: 0 })
  dailyTokensUsed: number;

  @Prop({ default: 0 })
  monthlyTokensUsed: number;

  @Prop({ default: Date.now })
  lastTokenReset: Date;



  // Progress tracking
  @Prop({ default: 0 })
  totalQuizzesCompleted: number;

  @Prop({ default: 0 })
  totalMaterialsAccessed: number;
  totalTimeSpent: number;

}

export const UserSchema = SchemaFactory.createForClass(User);
