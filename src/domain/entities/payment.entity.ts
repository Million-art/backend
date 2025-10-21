import { PaymentInterface } from '../interfaces/payment.interface';
import { v4 as uuidv4 } from 'uuid';

export class PaymentEntity implements PaymentInterface {
  id: string;
  telegramId: number;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  subscriptionTier: string;
  subscriptionDuration: number;
  description?: string;
  transactionId?: string;
  providerData?: any;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    telegramId: number,
    provider: string,
    amount: number,
    currency: string,
    status: string,
    subscriptionTier: string,
    subscriptionDuration: number,
    description?: string,
    transactionId?: string,
    providerData?: any,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.telegramId = telegramId;
    this.provider = provider;
    this.amount = amount;
    this.currency = currency;
    this.status = status;
    this.subscriptionTier = subscriptionTier;
    this.subscriptionDuration = subscriptionDuration;
    this.description = description;
    this.transactionId = transactionId;
    this.providerData = providerData;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(
    telegramId: number,
    provider: string,
    amount: number,
    currency: string,
    subscriptionTier: string,
    subscriptionDuration: number,
    description?: string,
  ): PaymentEntity {
    return new PaymentEntity(
      uuidv4(),
      telegramId,
      provider,
      amount,
      currency,
      'pending',
      subscriptionTier,
      subscriptionDuration,
      description,
    );
  }

  updateStatus(status: string): PaymentEntity {
    this.status = status;
    this.updatedAt = new Date();
    return this;
  }

  setTransactionId(transactionId: string): PaymentEntity {
    this.transactionId = transactionId;
    this.updatedAt = new Date();
    return this;
  }

  setProviderData(providerData: any): PaymentEntity {
    this.providerData = providerData;
    this.updatedAt = new Date();
    return this;
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isFailed(): boolean {
    return this.status === 'failed';
  }
}
