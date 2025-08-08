import { Vendor } from "../../types";
import { VENDOR_STATUS_OPTIONS } from "../../constants";
import { formatPhoneNumber } from "@utils/index";
import { PRODUCT_BY_LABEL } from "../../products";

/**
 * Interface for the Rough table row format
 * Matches the actual table structure: Names, Type, Details, Point of Contact, Phone Number, Status, Post date, File, Stars, Notes
 */
export interface RoughTableRow {
  Names: string;
  Type: string; // multi-select rendered as comma+space string
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
  Type: string; // multi-select rendered as comma+space string
  Email: string;
  Location: string; // NOTE: place chip not programmatically settable
  Phone: string;
  "Point of Contact": string;
  Status: string;
  "Post date": string;
  File: string;
  Stars: string;
  Notes: string;
}

/** utility: Sheets wants "A, B, C" for multi-select cells */
function joinForChip(values: string[] | undefined) {
  return values && values.length ? values.join(", ") : "";
}

function english(label: string) {
  // "X / Y" → "X"
  return label.split("/")[0].trim();
}

function mapProductsToRoughTypes(products?: string[]): string[] {
  if (!products?.length) return [];
  const out = new Set<string>();
  for (const p of products) {
    const def = PRODUCT_BY_LABEL[english(p)];
    if (def?.roughTypes) def.roughTypes.forEach((t: string) => out.add(t));
  }
  // sensible fallback if nothing mapped
  return out.size ? [...out] : ["All"];
}

function mapProductsToFinishTypes(products?: string[]): string[] {
  if (!products?.length) return [];
  const out = new Set<string>();
  for (const p of products) {
    const def = PRODUCT_BY_LABEL[english(p)];
    if (def?.finishTypes) def.finishTypes.forEach((t: string) => out.add(t));
  }
  return out.size ? [...out] : ["Supplier"];
}

/**
 * Transforms Vendor data to match the Rough table structure.
 * NOTE: If your Rough "Type" column is single-select, replace the Type line with:
 *   Type: mapProductsToRoughTypes(vendor.roughProducts)[0] ?? "",
 */
export function transformVendorToRoughTable(vendor: Vendor): RoughTableRow {
  // Use all products for Type mapping since we need the original form data
  const allProducts = [
    ...(vendor.roughProducts || []),
    ...(vendor.finishProducts || []),
  ];

  return {
    Names: vendor.companyName,
    Type: joinForChip(mapProductsToRoughTypes(allProducts)),
    Details: "TBD - Need clarification",
    "Point of Contact": "TBD - Need clarification",
    "Phone Number": formatPhoneNumber(vendor.phone, "parentheses"),
    Status: VENDOR_STATUS_OPTIONS[0], // "New"
    "Post date": vendor.submittedAt.toISOString().slice(0, 10), // YYYY-MM-DD
    File: "", // Empty for Rough table
    Stars: "", // Empty for new vendors
    Notes: "TBD - Need clarification",
  };
}

/**
 * Transforms Vendor data to match the Finish table structure.
 */
export function transformVendorToFinishTable(vendor: Vendor): FinishTableRow {
  // Use all products for Type mapping since we need the original form data
  const allProducts = [
    ...(vendor.roughProducts || []),
    ...(vendor.finishProducts || []),
  ];

  return {
    Names: vendor.companyName,
    Type: joinForChip(mapProductsToFinishTypes(allProducts)),
    Email: vendor.email,
    Location: vendor.address, // leave plain or write URL chip elsewhere
    Phone: formatPhoneNumber(vendor.phone, "parentheses"),
    "Point of Contact": vendor.contactName,
    Status: VENDOR_STATUS_OPTIONS[0], // "New"
    "Post date": vendor.submittedAt.toISOString().slice(0, 10), // YYYY-MM-DD
    File: "", // No files submitted via form
    Stars: "", // New vendors start empty
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

/**
 * TEST MODE: Transforms vendor data with placeholder mappings (Rough)
 */
export function transformVendorToRoughTableTest(vendor: Vendor): RoughTableRow {
  // Use all products for Type mapping since we need the original form data
  const allProducts = [
    ...(vendor.roughProducts || []),
    ...(vendor.finishProducts || []),
  ];

  return {
    Names: vendor.companyName,
    Type: joinForChip(mapProductsToRoughTypes(allProducts)),
    Details: "TEST: Will be mapped by employees",
    "Point of Contact": vendor.contactName,
    "Phone Number": formatPhoneNumber(vendor.phone, "parentheses"),
    Status: VENDOR_STATUS_OPTIONS[0], // "New"
    "Post date": vendor.submittedAt.toISOString().slice(0, 10),
    File: "",
    Stars: "",
    Notes: `TEST: ${vendor.comments || "No comments"} | Products: ${
      allProducts.join(", ") || "None"
    }`,
  };
}

/**
 * TEST MODE: Transforms vendor data with placeholder mappings (Finish)
 */
export function transformVendorToFinishTableTest(
  vendor: Vendor
): FinishTableRow {
  // Use all products for Type mapping since we need the original form data
  const allProducts = [
    ...(vendor.roughProducts || []),
    ...(vendor.finishProducts || []),
  ];

  return {
    Names: vendor.companyName,
    Type: joinForChip(mapProductsToFinishTypes(allProducts)),
    Email: vendor.email,
    Location: vendor.address,
    Phone: formatPhoneNumber(vendor.phone, "parentheses"),
    "Point of Contact": vendor.contactName,
    Status: VENDOR_STATUS_OPTIONS[0], // "New"
    "Post date": vendor.submittedAt.toISOString().slice(0, 10),
    File: "",
    Stars: "",
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
