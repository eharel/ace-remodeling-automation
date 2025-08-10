/**
 * Onboarding domain utility functions
 */

import { OnboardingFormData } from "../types";

/**
 * Validates onboarding form data
 */
export function validateOnboardingData(data: OnboardingFormData): boolean {
  // Basic validation - ensure required fields are present
  if (
    !data.contactInfo.name ||
    !data.contactInfo.email ||
    !data.contactInfo.phone
  ) {
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactInfo.email)) {
    return false;
  }

  // Validate payment method is selected
  if (!data.paymentDetails.paymentMethod) {
    return false;
  }

  return true;
}

/**
 * Formats onboarding data for display
 */
export function formatOnboardingData(data: OnboardingFormData): string {
  return `
Contact Information:
- Name: ${data.contactInfo.name}
- Email: ${data.contactInfo.email}
- Phone: ${data.contactInfo.phone}
- Address: ${data.contactInfo.address || "Not provided"}
- Company: ${data.contactInfo.company || "Not provided"}

Payment Details:
- Method: ${data.paymentDetails.paymentMethod}
- Account Number: ${data.paymentDetails.accountNumber || "Not provided"}
- Routing Number: ${data.paymentDetails.routingNumber || "Not provided"}
- Card Number: ${data.paymentDetails.cardNumber || "Not provided"}
- Expiration: ${data.paymentDetails.expirationDate || "Not provided"}
- CVV: ${data.paymentDetails.cvv || "Not provided"}

Additional Notes: ${data.additionalNotes || "None"}
Submission Date: ${data.submissionDate}
  `.trim();
}
