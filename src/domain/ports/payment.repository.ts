import { PaymentEntity } from '../entities/payment.entity';

export interface PaymentRepository {
  save(payment: PaymentEntity): Promise<PaymentEntity>;
  findById(id: string): Promise<PaymentEntity | null>;
  findByTransactionId(transactionId: string): Promise<PaymentEntity | null>;
  findByTelegramId(telegramId: number): Promise<PaymentEntity[]>;
  findAll(): Promise<PaymentEntity[]>;
  update(id: string, payment: Partial<PaymentEntity>): Promise<PaymentEntity | null>;
  delete(id: string): Promise<void>;
  findByStatus(status: string): Promise<PaymentEntity[]>;
  findByProvider(provider: string): Promise<PaymentEntity[]>;
  findBySubscriptionTier(tier: string): Promise<PaymentEntity[]>;
}
