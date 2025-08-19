// Core form utilities
export { extractResponse } from "./core/extract-response";
export { createFormHandler } from "./core/base-form-handler";
export {
  processFormResponse,
  validateFormResponse,
  getFieldValue,
  hasFieldValue,
} from "./core/form-processor";

// Form utilities
export * from "./utils/parse-fields";

// Config
export { getFormsConfig } from "./config/config";
export type { FormsIds } from "./config/config";

// Form IDs (new ID-based system)
export {
  FORM_IDS,
  getFormId,
  getItemId,
  getFormItems,
} from "@/config/forms/form-ids";
export type { FormName, FormItemName } from "@/config/forms/form-ids";
