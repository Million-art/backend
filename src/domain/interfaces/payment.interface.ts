export interface PaymentInterface {
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

export interface CreatePaymentRequest {
  telegramId: number;
  provider: string;
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

export interface UpdatePaymentRequest {
  status?: string;
  transactionId?: string;
  providerData?: any;
}

export interface PaymentVerificationRequest {
  transactionId: string;
  providerData?: any;
}
