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
    !data.contactInfo.company ||
    !data.contactInfo.profession.length ||
    !data.contactInfo.insurance ||
    !data.contactInfo.phone ||
    !data.contactInfo.email ||
    !data.contactInfo.address ||
    !data.paymentDetails.paymentMethod.length ||
    !data.paymentDetails.paymentInfo
  ) {
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactInfo.email)) {
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
- Company: ${data.contactInfo.company}
- Profession: ${data.contactInfo.profession.join(", ")}
- Insurance: ${data.contactInfo.insurance}
- Phone: ${data.contactInfo.phone}
- Email: ${data.contactInfo.email}
- Address: ${data.contactInfo.address}

Payment Details:
- Method: ${data.paymentDetails.paymentMethod.join(", ")}
- Payment Information: ${data.paymentDetails.paymentInfo}

Comments: ${data.comments || "None"}
Submission Date: ${data.submissionDate}
  `.trim();
}
