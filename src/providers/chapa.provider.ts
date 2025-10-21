import { Injectable } from '@nestjs/common';
import { 
  ChapaPaymentRequest, 
  ChapaPaymentResponse, 
  BasePaymentVerification 
} from '../domain/interfaces/payment.domain.interface';
import axios from 'axios';

@Injectable()
export class ChapaProvider {
  readonly provider = 'chapa';
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.CHAPA_API_KEY || '';
    this.baseUrl = process.env.CHAPA_BASE_URL || 'https://api.chapa.co/v1';
  }

  async createPayment(request: ChapaPaymentRequest): Promise<ChapaPaymentResponse> {
    try {
      const chapaRequest = {
        amount: request.amount,
        currency: request.currency,
        email: request.customerInfo?.email || 'customer@example.com',
        first_name: request.customerInfo?.firstName || 'Customer',
        last_name: request.customerInfo?.lastName || 'User',
        phone_number: request.customerInfo?.phone || '+251900000000',
        tx_ref: `maraki_${Date.now()}_${request.telegramId}`,
        callback_url: `${process.env.BACKEND_URL}/api/payments/chapa/callback`,
        return_url: request.returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
        customization: {
          title: 'Maraki English Learning',
          description: request.description || 'Premium Subscription'
        }
      };

      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, chapaRequest, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        return {
          success: true,
          transactionId: response.data.data.tx_ref,
          status: 'pending',
          providerData: {
            checkoutUrl: response.data.data.checkout_url,
            transactionRef: response.data.data.tx_ref,
            customerId: request.telegramId.toString()
          },
          redirectUrl: response.data.data.checkout_url
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: response.data.message || 'Payment initialization failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Payment initialization failed'
      };
    }
  }

  async verifyPayment(verification: BasePaymentVerification): Promise<ChapaPaymentResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/transaction/verify/${verification.transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (response.data.status === 'success' && response.data.data.status === 'success') {
        return {
          success: true,
          transactionId: verification.transactionId,
          status: 'completed',
          providerData: {
            transactionRef: verification.transactionId,
            customerId: response.data.data.customer?.email
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: 'Payment verification failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Payment verification failed'
      };
    }
  }
}
