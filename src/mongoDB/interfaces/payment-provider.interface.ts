import { PaymentProvider, PaymentStatus } from '../schemas/payment.schema';

// Base interfaces
export interface BasePaymentRequest {
  telegramId: number;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  subscriptionTier: string;
  subscriptionDuration: number;
  description?: string;
}

export interface BasePaymentResponse {
  success: boolean;
  transactionId?: string;
  status: PaymentStatus;
  error?: string;
}

export interface BasePaymentVerification {
  transactionId: string;
  providerData: any;
}

// Base interface for all payment providers
export interface BasePaymentProvider {
  readonly provider: PaymentProvider;
  createPayment(request: any): Promise<any>;
  verifyPayment(verification: BasePaymentVerification): Promise<any>;
  getBalance?(telegramId: number): Promise<number>;
  addFunds?(telegramId: number, amount: number): Promise<boolean>;
}

// Telegram Stars specific interfaces
export interface TelegramStarsPaymentRequest extends BasePaymentRequest {
  // Telegram Stars are immediate, no additional fields needed
}

export interface TelegramStarsPaymentResponse extends BasePaymentResponse {
  providerData?: {
    starsUsed: number;
    remainingBalance: number;
  };
}

export interface TelegramStarsProvider {
  readonly provider: PaymentProvider.TELEGRAM_STARS;
  createPayment(request: TelegramStarsPaymentRequest): Promise<TelegramStarsPaymentResponse>;
  verifyPayment(verification: BasePaymentVerification): Promise<TelegramStarsPaymentResponse>;
  getBalance(telegramId: number): Promise<number>;
  addFunds(telegramId: number, amount: number): Promise<boolean>;
}

 
 
  

 
 

export interface StripePaymentResponse extends BasePaymentResponse {
  providerData?: {
    clientSecret?: string;
    paymentIntentId?: string;
    customerId?: string;
  };
  redirectUrl?: string;
}
 

export interface PayPalPaymentResponse extends BasePaymentResponse {
  providerData?: {
    orderId?: string;
    approvalUrl?: string;
  };
  redirectUrl?: string;
}
 

// Union type for all providers (only Telegram Stars for now)
export type PaymentProviderInterface = 
  | TelegramStarsProvider;
  // Future payment providers will be added here when needed
  // | ChapaProvider 
  // | TonProvider 
  // | TeleBirrProvider 
 

// Union types for requests and responses (only Telegram Stars for now)
export type PaymentRequest = 
  | TelegramStarsPaymentRequest;
  // Future payment request types will be added here when needed
  // | ChapaPaymentRequest 
  // | TonPaymentRequest 
  // | TeleBirrPaymentRequest 
 

export type PaymentResponse = 
  | TelegramStarsPaymentResponse;
  // Future payment response types will be added here when needed
  // | ChapaPaymentResponse 
  // | TonPaymentResponse 
  // | TeleBirrPaymentResponse 
 

export interface PaymentProviderConfig {
  provider: PaymentProvider;
  enabled: boolean;
  config: {
    apiKey?: string;
    secretKey?: string;
    webhookSecret?: string;
    baseUrl?: string;
    [key: string]: any;
  };
}
