/**
 * Onboarding domain types
 */

export interface OnboardingContactInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
}

export interface OnboardingPaymentDetails {
  paymentMethod: string;
  accountNumber?: string;
  routingNumber?: string;
  cardNumber?: string;
  expirationDate?: string;
  cvv?: string;
}

export interface OnboardingFormData {
  contactInfo: OnboardingContactInfo;
  paymentDetails: OnboardingPaymentDetails;
  additionalNotes?: string;
  submissionDate: string;
}

export interface OnboardingFormResponse {
  [key: string]: string;
}
