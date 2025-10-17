import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentStatus } from '../interfaces/enums/payment-status.enum';
import { PaymentProvider } from '../interfaces/enums/payment-provider.enum';
import { SubscriptionTier } from '../interfaces/enums/subscription-tier.enum';
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

  @Prop({ required: true })
  currency: string;

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
    starsUsed?: number;
    starsBalance?: number;
    tonAddress?: string;
    teleBirrAccount?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    paypalOrderId?: string;
    [key: string]: any; // Allow any additional provider-specific fields
  };

  // Payment metadata
  @Prop({ default: null })
  description?: string;

  @Prop({ default: null })
  notes?: string;

  // Refund fields removed as per requirements
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Re-export enums for convenience
export { PaymentStatus, PaymentProvider, SubscriptionTier };

// Indexes for better performance
PaymentSchema.index({ telegramId: 1, status: 1 });
PaymentSchema.index({ provider: 1, status: 1 });
PaymentSchema.index({ expiresAt: 1 });
PaymentSchema.index({ createdAt: -1 });
