import { Vendor } from "../types";

/**
 * Validates vendor data for completeness and correctness
 * TODO: Implement validation logic
 */
export function validateVendor(vendor: Vendor): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // TODO: Add validation logic
  // - Check required fields
  // - Validate email format
  // - Validate phone format
  // - Check for minimum required data

  return {
    isValid: errors.length === 0,
    errors,
  };
}
