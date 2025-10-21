// Domain layer payment interfaces
export interface PaymentDomainInterface {
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
}

export interface ChapaPaymentRequest {
  telegramId: number;
  amount: number;
  currency: string;
  subscriptionTier: string;
  subscriptionDuration: number;
  description?: string;
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  returnUrl?: string;
  cancelUrl?: string;
}

export interface ChapaPaymentResponse {
  success: boolean;
  transactionId?: string;
  status: string;
  error?: string;
  providerData?: {
    checkoutUrl?: string;
    transactionRef?: string;
    customerId?: string;
  };
  redirectUrl?: string;
}

export interface BasePaymentVerification {
  transactionId: string;
  providerData: any;
}
