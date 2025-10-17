import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument, PaymentProvider, PaymentStatus, SubscriptionTier } from '../schemas/payment.schema';
import { 
  PaymentProviderInterface, 
  PaymentRequest, 
  PaymentResponse, 
  BasePaymentVerification 
} from '../interfaces/payment-provider.interface';
import { TelegramStarsProvider } from '../providers/telegram-stars.provider';
import { StudentService } from './student.service';

@Injectable()
export class PaymentService {
  private providers: Map<PaymentProvider, PaymentProviderInterface> = new Map();

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly studentService: StudentService,
    private readonly telegramStarsProvider: TelegramStarsProvider,
  ) {
    // Register payment providers (only Telegram Stars for now)
    this.providers.set(PaymentProvider.TELEGRAM_STARS, this.telegramStarsProvider);
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const provider = this.providers.get(request.provider as PaymentProvider);
    if (!provider) {
      throw new BadRequestException(`Payment provider ${request.provider} not supported`);
    }

    // Create payment record
    const payment = new this.paymentModel({
      telegramId: request.telegramId,
      provider: request.provider,
      amount: request.amount,
      currency: request.currency,
      subscriptionTier: request.subscriptionTier,
      subscriptionDuration: request.subscriptionDuration,
      expiresAt: new Date(Date.now() + request.subscriptionDuration * 24 * 60 * 60 * 1000),
      description: request.description,
      status: PaymentStatus.PENDING
    });

    await payment.save();

    try {
      // Process payment with provider
      const result = await provider.createPayment(request);
      
      // Update payment record
      payment.status = result.status;
      payment.providerData = result.providerData || {};
      if (result.transactionId) {
        payment.providerData.transactionId = result.transactionId;
      }
      await payment.save();

      return result;
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      payment.notes = error.message;
      await payment.save();
      
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message
      };
    }
  }

  async verifyPayment(transactionId: string, provider: PaymentProvider): Promise<PaymentResponse> {
    const payment = await this.paymentModel.findOne({ 
      'providerData.transactionId': transactionId,
      provider 
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const paymentProvider = this.providers.get(provider);
    if (!paymentProvider) {
      throw new BadRequestException(`Payment provider ${provider} not supported`);
    }

    const verification: BasePaymentVerification = {
      transactionId,
      providerData: payment.providerData
    };

    const result = await paymentProvider.verifyPayment(verification);
    
    // Update payment status
    payment.status = result.status;
    payment.providerData = { ...payment.providerData, ...result.providerData };
    await payment.save();

    // If payment is completed, upgrade user
    if (result.success && result.status === PaymentStatus.COMPLETED) {
      await this.studentService.upgradeToPremium(payment.telegramId, {
        method: provider,
        ...payment.providerData
      });
    }

    return result;
  }

  // Refund functionality removed as per requirements

  async getPaymentHistory(telegramId: number, limit: number = 10): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ telegramId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getPaymentById(paymentId: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async getActiveSubscriptions(telegramId: number): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({
        telegramId,
        status: PaymentStatus.COMPLETED,
        expiresAt: { $gt: new Date() }
      })
      .sort({ expiresAt: -1 })
      .exec();
  }

  async getAvailableProviders(): Promise<PaymentProvider[]> {
    return Array.from(this.providers.keys());
  }

  async getProviderBalance(telegramId: number, provider: PaymentProvider): Promise<number> {
    const paymentProvider = this.providers.get(provider);
    if (!paymentProvider || !paymentProvider.getBalance) {
      return 0;
    }
    return paymentProvider.getBalance(telegramId);
  }

  async addProviderFunds(telegramId: number, provider: PaymentProvider, amount: number): Promise<boolean> {
    const paymentProvider = this.providers.get(provider);
    if (!paymentProvider || !paymentProvider.addFunds) {
      return false;
    }
    return paymentProvider.addFunds(telegramId, amount);
  }

  // Webhook handlers for different providers
  async handleWebhook(provider: PaymentProvider, webhookData: any): Promise<void> {
    const { transactionId, status } = webhookData;
    
    if (status === 'completed' || status === 'success') {
      await this.verifyPayment(transactionId, provider);
    } else if (status === 'failed' || status === 'cancelled') {
      const payment = await this.paymentModel.findOne({ 
        'providerData.transactionId': transactionId 
      });
      if (payment) {
        payment.status = PaymentStatus.FAILED;
        await payment.save();
      }
    }
  }
}
