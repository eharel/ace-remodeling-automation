import { OnboardingData } from "../../types";
import { maskPII } from "@lib/logging/log";

/**
 * Mapping from profession to MEP Type column values
 */
const MEP_TYPE_MAPPING = {
  Electrician: "Electrical",
  Plumber: "Plumbing",
  HVAC: "Mechanical",
} as const;

/**
 * Interface for onboarding table row format
 * This is the superset structure - tabs can have any subset of these columns
 */
export interface OnboardingTableRow {
  Vendor: string; // Company name
  Contact: string; // Individual name
  "Vendor type": string; // The trade/profession (e.g., Electrician, Roofer)
  Type: string; // Freeform sub-category like Installation/Labor/Material
  Address: string;
  Status: string;
  Insurance: string; // Yes/No
  "COI Expiration": string;
  Phone: string;
  Website: string;
  "Quality of Work": string;
  Details: string;
  Notes: string;
  UUID: string; // For future two-way sync
  "Submitted At": string; // ISO timestamp for traceability
}

/**
 * Transforms OnboardingData to match the standardized table structure
 */
export function transformOnboardingToTable(
  data: OnboardingData,
  uuid: string,
  submittedAt: string
): OnboardingTableRow {
  // Map profession to MEP Type if applicable
  const mepType =
    MEP_TYPE_MAPPING[data.profession as keyof typeof MEP_TYPE_MAPPING];
  const typeValue = mepType || ""; // Use MEP type if available, otherwise empty

  return {
    Vendor: data.companyName,
    Contact: data.name,
    "Vendor type": data.vendorType.join(", "), // Join multiple vendor types with commas
    Type: typeValue, // Only populated for MEP professions
    Address: data.address,
    Status: "New", // Default status for new submissions
    Insurance: data.hasInsurance ? "Yes" : "No",
    "COI Expiration": "", // Not collected in form
    Phone: maskPII(data.phone),
    Website: "", // Not collected in form
    "Quality of Work": "", // Not collected in form
    Details: data.paymentInfo, // Use payment info as details
    Notes: data.comments || "",
    UUID: uuid,
    "Submitted At": submittedAt,
  };
}
