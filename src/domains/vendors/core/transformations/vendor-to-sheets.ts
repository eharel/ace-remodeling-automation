import { Vendor } from "../../types";
import {
  VENDOR_STATUS_OPTIONS,
  FORM_TO_ROUGH_TYPE_MAP,
  FORM_TO_FINISH_TYPE_MAP,
} from "../../constants";

/**
 * Interface for the Rough table row format
 * Matches the actual table structure: Names, Type, Details, Point of Contact, Phone Number, Status, Post date, File, Stars, Notes
 */
export interface RoughTableRow {
  Names: string;
  Type: string;
  Details: string;
  "Point of Contact": string;
  "Phone Number": string;
  Status: string;
  "Post date": string;
  File: string;
  Stars: string;
  Notes: string;
}

/**
 * Interface for the Finish table row format
 * Matches the actual table structure: Names, Type, Email, Location, Phone, Point of Contact, Status, Post date, File, Stars, Notes
 */
export interface FinishTableRow {
  Names: string;
  Type: string;
  Email: string;
  Location: string;
  Phone: string;
  "Point of Contact": string;
  Status: string;
  "Post date": string;
  File: string;
  Stars: string;
  Notes: string;
}

/**
 * Maps vendor products from form options to the Rough table Type dropdown options
 * Form options are bilingual: "English / Spanish"
 */
function mapProductsToRoughType(products: string[] | undefined): string {
  if (!products || products.length === 0) return "";

  // Check each product against our mapping
  for (const product of products) {
    // Extract English part before the "/" if it exists
    const englishPart = product.split("/")[0].trim();

    // Try exact match first
    if (FORM_TO_ROUGH_TYPE_MAP[englishPart]) {
      return FORM_TO_ROUGH_TYPE_MAP[englishPart];
    }

    // Try partial matching for cases like "Iron & Metal"
    for (const [formKey, tableValue] of Object.entries(
      FORM_TO_ROUGH_TYPE_MAP
    )) {
      if (englishPart.includes(formKey) || formKey.includes(englishPart)) {
        return tableValue;
      }
    }
  }

  // If no match found, return "All" as default
  return "All";
}

/**
 * Maps vendor products from form options to the Finish table Type dropdown options
 * Form options are bilingual: "English / Spanish"
 */
function mapProductsToFinishType(products: string[] | undefined): string {
  if (!products || products.length === 0) return "";

  // Check each product against our mapping
  for (const product of products) {
    // Extract English part before the "/" if it exists
    const englishPart = product.split("/")[0].trim();

    // Try exact match first
    if (FORM_TO_FINISH_TYPE_MAP[englishPart]) {
      return FORM_TO_FINISH_TYPE_MAP[englishPart];
    }

    // Try partial matching for cases like "Iron & Metal"
    for (const [formKey, tableValue] of Object.entries(
      FORM_TO_FINISH_TYPE_MAP
    )) {
      if (englishPart.includes(formKey) || formKey.includes(englishPart)) {
        return tableValue;
      }
    }
  }

  // If no match found, return "Supplier" as default for Finish table
  return "Supplier";
}

/**
 * Transforms Vendor data to match the Rough table structure
 */
export function transformVendorToRoughTable(vendor: Vendor): RoughTableRow {
  return {
    Names: vendor.companyName,
    Type: mapProductsToRoughType(vendor.productsOffered),
    Details: "TBD - Need clarification", // Placeholder until clarified
    "Point of Contact": "TBD - Need clarification", // Placeholder until clarified
    "Phone Number": vendor.phone,
    Status: VENDOR_STATUS_OPTIONS[0], // "New" - first option in the array
    "Post date": vendor.submittedAt.toISOString().slice(0, 10), // YYYY-MM-DD
    File: vendor.websiteOrSocial || "",
    Stars: "", // Empty for new vendors
    Notes: "TBD - Need clarification", // Placeholder until clarified
  };
}

/**
 * Transforms Vendor data to match the Finish table structure
 */
export function transformVendorToFinishTable(vendor: Vendor): FinishTableRow {
  return {
    Names: vendor.companyName,
    Type: mapProductsToFinishType(vendor.productsOffered),
    Email: vendor.email,
    Location: vendor.address,
    Phone: vendor.phone,
    "Point of Contact": vendor.contactName,
    Status: VENDOR_STATUS_OPTIONS[0], // "New" - first option in the array
    "Post date": vendor.submittedAt.toISOString().slice(0, 10), // YYYY-MM-DD
    File: vendor.websiteOrSocial || "",
    Stars: "", // Empty for new vendors
    Notes: [
      vendor.comments,
      `Has Showroom: ${vendor.hasShowroom ? "Yes" : "No"}`,
      `Custom Orders: ${vendor.offersCustomOrders ? "Yes" : "No"}`,
      `Delivery: ${vendor.offersDelivery ? "Yes" : "No"}`,
      `Turnaround: ${vendor.turnaroundTime || "Not specified"}`,
      `Contractor Pricing: ${vendor.offersContractorPricing ? "Yes" : "No"}`,
      `Payment Methods: ${vendor.paymentMethods.join(", ")}`,
      `Payment Details: ${vendor.paymentDetails}`,
      `Email Catalogs: ${vendor.willEmailCatalogs ? "Yes" : "No"}`,
    ]
      .filter(Boolean)
      .join(" | "),
  };
}
