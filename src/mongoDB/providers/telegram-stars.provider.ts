import { Injectable } from '@nestjs/common';
import { 
  TelegramStarsProvider as ITelegramStarsProvider,
  TelegramStarsPaymentRequest, 
  TelegramStarsPaymentResponse, 
  BasePaymentVerification 
} from '../interfaces/payment-provider.interface';
import { PaymentProvider, PaymentStatus } from '../schemas/payment.schema';
import { StudentService } from '../services/student.service';

@Injectable()
export class TelegramStarsProvider implements ITelegramStarsProvider {
  readonly provider = PaymentProvider.TELEGRAM_STARS;

  constructor(private readonly studentService: StudentService) {}

  async createPayment(request: TelegramStarsPaymentRequest): Promise<TelegramStarsPaymentResponse> {
    try {
      const user = await this.studentService.findByTelegramId(request.telegramId);
      if (!user) {
        return {
          success: false,
          status: PaymentStatus.FAILED,
          error: 'User not found'
        };
      }

      const currentBalance = user.telegramStarsBalance || 0;
      if (currentBalance < request.amount) {
        return {
          success: false,
          status: PaymentStatus.FAILED,
          error: 'Insufficient Telegram Stars balance'
        };
      }

      // Deduct stars from balance
      const result = await this.studentService.useTelegramStars(request.telegramId, request.amount);
      
      if (!result.success) {
        return {
          success: false,
          status: PaymentStatus.FAILED,
          error: 'Failed to deduct Telegram Stars'
        };
      }

      return {
        success: true,
        transactionId: `stars_${Date.now()}_${request.telegramId}`,
        status: PaymentStatus.COMPLETED,
        providerData: {
          starsUsed: request.amount,
          remainingBalance: result.remainingStars
        }
      };
    } catch (error) {
      return {
        success: false,
        status: PaymentStatus.FAILED,
        error: error.message
      };
    }
  }

  async verifyPayment(verification: BasePaymentVerification): Promise<TelegramStarsPaymentResponse> {
    // Telegram Stars payments are immediate, so verification is simple
    return {
      success: true,
      transactionId: verification.transactionId,
      status: PaymentStatus.COMPLETED,
      providerData: verification.providerData
    };
  }

  // Refund functionality removed as per requirements

  async getBalance(telegramId: number): Promise<number> {
    const user = await this.studentService.findByTelegramId(telegramId);
    return user?.telegramStarsBalance || 0;
  }

  async addFunds(telegramId: number, amount: number): Promise<boolean> {
    try {
      await this.studentService.addTelegramStars(telegramId, amount);
      return true;
    } catch (error) {
      return false;
    }
  }
}
