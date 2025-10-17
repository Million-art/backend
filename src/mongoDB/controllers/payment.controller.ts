import { Controller, Get, Post, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { PaymentProvider, PaymentStatus } from '../schemas/payment.schema';
import type { PaymentRequest } from '../interfaces/payment-provider.interface';

@ApiTags('payments')
@Controller('api/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  async createPayment(@Body() request: PaymentRequest) {
    try {
      return await this.paymentService.createPayment(request);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify/:provider')
  @ApiOperation({ summary: 'Verify payment status' })
  @ApiParam({ name: 'provider', enum: PaymentProvider })
  async verifyPayment(
    @Param('provider') provider: PaymentProvider,
    @Body() body: { transactionId: string }
  ) {
    try {
      return await this.paymentService.verifyPayment(body.transactionId, provider);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Refund functionality removed as per requirements

  @Get('history/:telegramId')
  @ApiOperation({ summary: 'Get payment history for user' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPaymentHistory(
    @Param('telegramId') telegramId: number,
    @Query('limit') limit?: number
  ) {
    return await this.paymentService.getPaymentHistory(telegramId, limit || 10);
  }

  @Get('subscriptions/:telegramId')
  @ApiOperation({ summary: 'Get active subscriptions for user' })
  async getActiveSubscriptions(@Param('telegramId') telegramId: number) {
    return await this.paymentService.getActiveSubscriptions(telegramId);
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get available payment providers' })
  async getAvailableProviders() {
    return await this.paymentService.getAvailableProviders();
  }

  @Get('balance/:telegramId/:provider')
  @ApiOperation({ summary: 'Get user balance for specific provider' })
  @ApiParam({ name: 'provider', enum: PaymentProvider })
  async getProviderBalance(
    @Param('telegramId') telegramId: number,
    @Param('provider') provider: PaymentProvider
  ) {
    const balance = await this.paymentService.getProviderBalance(telegramId, provider);
    return { provider, balance };
  }

  @Post('funds/:telegramId/:provider')
  @ApiOperation({ summary: 'Add funds to user account for specific provider' })
  @ApiParam({ name: 'provider', enum: PaymentProvider })
  async addProviderFunds(
    @Param('telegramId') telegramId: number,
    @Param('provider') provider: PaymentProvider,
    @Body() body: { amount: number }
  ) {
    const success = await this.paymentService.addProviderFunds(telegramId, provider, body.amount);
    return { success, provider, amount: body.amount };
  }

  // Webhook endpoints for different providers (commented out for future use)
  // @Post('webhook/chapa')
  // @ApiOperation({ summary: 'Chapa payment webhook' })
  // async chapaWebhook(@Body() webhookData: any) {
  //   await this.paymentService.handleWebhook(PaymentProvider.CHAPA, webhookData);
  //   return { status: 'success' };
  // }

  // @Post('webhook/telebirr')
  // @ApiOperation({ summary: 'TeleBirr payment webhook' })
  // async teleBirrWebhook(@Body() webhookData: any) {
  //   await this.paymentService.handleWebhook(PaymentProvider.TELE_BIRR, webhookData);
  //   return { status: 'success' };
  // }

  // @Post('webhook/ton')
  // @ApiOperation({ summary: 'TON payment webhook' })
  // async tonWebhook(@Body() webhookData: any) {
  //   await this.paymentService.handleWebhook(PaymentProvider.TON, webhookData);
  //   return { status: 'success' };
  // }

  // @Post('webhook/stripe')
  // @ApiOperation({ summary: 'Stripe payment webhook' })
  // async stripeWebhook(@Body() webhookData: any) {
  //   await this.paymentService.handleWebhook(PaymentProvider.STRIPE, webhookData);
  //   return { status: 'success' };
  // }
}
