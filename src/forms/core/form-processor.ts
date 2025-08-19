/**
 * Form processor using ID-based field matching
 *
 * This replaces the string-based field matching with robust ID-based processing
 * that works regardless of question text changes.
 */

import {
  FORM_IDS,
  FormName,
  FormItemName,
  getItemId,
} from "@/config/forms/form-ids";

/**
 * Process form response using ID-based field matching
 *
 * @param formName - The name of the form (e.g., 'vendor', 'onboarding')
 * @param response - The Google Apps Script form response
 * @param environment - The environment to use for field mapping
 * @returns Object with field names as keys and values as strings
 */
export function processFormResponse<T extends FormName>(
  formName: T,
  response: GoogleAppsScript.Forms.FormResponse,
  environment: "development" | "production" = "development"
): Record<FormItemName<T>, string> {
  const formConfig = FORM_IDS[formName][environment];
  const itemResponses = response.getItemResponses();
  const result: any = {};

  // Initialize all fields with empty strings
  Object.keys(formConfig.items).forEach((itemName) => {
    result[itemName] = "";
  });

  // Process each response item
  itemResponses.forEach((itemResponse) => {
    const itemId = itemResponse.getItem().getId();
    const value = itemResponse.getResponse();

    // Find which item this ID corresponds to
    for (const [itemName, id] of Object.entries(formConfig.items)) {
      if (id === itemId) {
        // Convert value to string, handling arrays (checkboxes)
        result[itemName] = Array.isArray(value)
          ? value.join(", ")
          : String(value);
        break;
      }
    }
  });

  return result;
}

/**
 * Validate that all required fields are present in the response
 *
 * @param formName - The name of the form
 * @param response - The Google Apps Script form response
 * @returns Validation result with errors array
 */
export function validateFormResponse<T extends FormName>(
  formName: T,
  response: GoogleAppsScript.Forms.FormResponse,
  environment: "development" | "production" = "development"
): { isValid: boolean; errors: string[] } {
  const formConfig = FORM_IDS[formName][environment];
  const itemResponses = response.getItemResponses();
  const errors: string[] = [];

  // Get all response IDs
  const responseIds = itemResponses.map((item) => item.getItem().getId());

  // Check for missing required fields (for now, we'll assume all fields are required)
  // In the future, this can be enhanced with metadata about which fields are required
  for (const [itemName, itemId] of Object.entries(formConfig.items)) {
    if (!responseIds.includes(itemId as number)) {
      errors.push(`Missing required field: ${itemName}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get a specific field value by ID
 *
 * @param formName - The name of the form
 * @param itemName - The name of the field
 * @param response - The Google Apps Script form response
 * @returns The field value as string, or empty string if not found
 */
export function getFieldValue<T extends FormName>(
  formName: T,
  itemName: FormItemName<T>,
  response: GoogleAppsScript.Forms.FormResponse
): string {
  const itemId = getItemId(formName, itemName);
  const itemResponses = response.getItemResponses();

  for (const itemResponse of itemResponses) {
    if (itemResponse.getItem().getId() === itemId) {
      const value = itemResponse.getResponse();
      return Array.isArray(value) ? value.join(", ") : String(value);
    }
  }

  return "";
}

/**
 * Check if a specific field is present in the response
 *
 * @param formName - The name of the form
 * @param itemName - The name of the field
 * @param response - The Google Apps Script form response
 * @returns True if the field is present and has a value
 */
export function hasFieldValue<T extends FormName>(
  formName: T,
  itemName: FormItemName<T>,
  response: GoogleAppsScript.Forms.FormResponse
): boolean {
  const value = getFieldValue(formName, itemName, response);
  return value.trim() !== "";
}
