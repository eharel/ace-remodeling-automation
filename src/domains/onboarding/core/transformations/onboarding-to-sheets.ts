import { OnboardingData } from "../../types";
import { PROFESSION_TO_VENDOR_TYPE_MAPPING } from "../../constants";
import { maskPII } from "@lib/logging/log";
import { formatPhoneNumber } from "@utils/index";

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
 * @param data - The onboarding data
 * @param targetTab - The specific tab this transformation is for
 * @param uuid - Unique identifier for the submission
 * @param submittedAt - ISO timestamp of submission
 */
export function transformOnboardingToTable(
  data: OnboardingData,
  targetTab: string,
  uuid: string,
  submittedAt: string
): OnboardingTableRow {
  // Get professions for this specific tab
  const tabProfessions = data.professionsByTab[targetTab] || [];

  // Map professions to vendor types for this tab
  const vendorTypes: string[] = [];
  for (const prof of tabProfessions) {
    const vendorType = PROFESSION_TO_VENDOR_TYPE_MAPPING[
      prof as keyof typeof PROFESSION_TO_VENDOR_TYPE_MAPPING
    ] || ["Other"];
    vendorTypes.push(...vendorType);
  }

  // Remove duplicates
  const uniqueVendorTypes = [...new Set(vendorTypes)];

  // Map profession to MEP Type if applicable (use first profession for MEP type)
  const firstProfession = tabProfessions[0] || "";
  const mepType =
    MEP_TYPE_MAPPING[firstProfession as keyof typeof MEP_TYPE_MAPPING];
  const typeValue = mepType || ""; // Use MEP type if available, otherwise empty

  return {
    Vendor: data.companyName,
    Contact: data.name,
    "Vendor type": uniqueVendorTypes.join(", "), // Join vendor types for this tab
    Type: typeValue, // Only populated for MEP professions
    Address: data.address,
    Status: "New", // Default status for new submissions
    Insurance: data.hasInsurance ? "Yes" : "No",
    "COI Expiration": "", // Not collected in form
    Phone: formatPhoneNumber(data.phone, "parentheses"),
    Website: "", // Not collected in form
    "Quality of Work": "", // Not collected in form
    Details: data.paymentInfo, // Use payment info as details
    Notes: data.comments || "",
    UUID: uuid,
    "Submitted At": submittedAt,
  };
}
