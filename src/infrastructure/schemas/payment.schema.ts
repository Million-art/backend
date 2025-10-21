import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentProvider {
  CHAPA = 'chapa',
  FREE = 'free'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro'
}

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, index: true })
  telegramId: number;

  @Prop({ required: true, enum: Object.values(PaymentProvider) })
  provider: PaymentProvider;

  @Prop({ required: true, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: Object.values(SubscriptionTier) })
  subscriptionTier: SubscriptionTier;

  @Prop({ required: true })
  subscriptionDuration: number; // in days

  @Prop({ default: null })
  expiresAt?: Date;

  // Provider-specific transaction data (flexible structure)
  @Prop({ type: Object, default: {} })
  providerData: {
    transactionId?: string;
    customerId?: string;
    paymentMethod?: string;
    checkoutUrl?: string;
    transactionRef?: string;
    [key: string]: any; // Allow any additional provider-specific fields
  };

  // Payment metadata
  @Prop({ default: null })
  description?: string;

  @Prop({ default: null })
  notes?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
