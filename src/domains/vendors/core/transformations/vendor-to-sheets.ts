import { Vendor } from "../../types";
import { VENDOR_STATUS_OPTIONS } from "../../constants";
import { formatPhoneNumber } from "@utils/index";

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

/** Sheets expects comma+space to represent multi-select values in one cell */
function formatForMultiSelect(options: string[] | undefined): string {
  return options && options.length ? options.join(", ") : "";
}

/**
 * Maps form products → Rough “Type” options (returns ALL matches as an array).
 * Form options are bilingual: "English / Spanish" → we strip to English before mapping.
 */
function mapProductsToRoughTypes(products: string[] | undefined): string[] {
  if (!products || products.length === 0) return [];

  const mapped = new Set<string>();

  for (const product of products) {
    const english = product.split("/")[0].trim();

    switch (english) {
      case "Cabinets":
        mapped.add("Wood");
        break;
      case "Countertops":
        mapped.add("Building Supplies");
        break;
      case "Flooring":
        mapped.add("Floors");
        break;
      case "Tile":
        mapped.add("Building Supplies");
        break;
      case "Doors":
        mapped.add("Wood");
        break;
      case "Hardware":
        mapped.add("Metal");
        break;
      case "Glass":
        mapped.add("Building Supplies");
        break;
      case "Plumbing Fixtures":
        mapped.add("Building Supplies");
        break;
      case "Lighting":
        mapped.add("Building Supplies");
        break;
      case "Paint":
        mapped.add("Building Supplies");
        break;
      case "Drywall":
        mapped.add("Drywall");
        break;
      case "Stucco":
        mapped.add("Building Supplies");
        break;
      case "Siding":
        mapped.add("Building Supplies");
        break;
      case "Fence":
        mapped.add("Building Supplies");
        break;
      case "Gutter":
        mapped.add("Roofs");
        break;
      case "Decking":
        mapped.add("Wood");
        break;
      case "Roofing":
        mapped.add("Roofs");
        break;
      case "Stone":
        mapped.add("Building Supplies");
        break;
      case "Iron & Metal":
      case "Iron":
      case "Metal":
        mapped.add("Metal");
        break;
      case "Other":
        mapped.add("All");
        break;
      default:
        console.warn(`⚠️ Unknown product type: ${english}`);
        mapped.add("All");
        break;
    }
  }

  return Array.from(mapped);
}

/**
 * Maps form products → Finish “Type” options (returns ALL matches as an array).
 */
function mapProductsToFinishTypes(products: string[] | undefined): string[] {
  if (!products || products.length === 0) return [];

  const mapped = new Set<string>();

  for (const product of products) {
    const english = product.split("/")[0].trim();

    switch (english) {
      case "Cabinets":
        mapped.add("Cabinetry");
        break;
      case "Countertops":
        mapped.add("Countertops");
        break;
      case "Flooring":
        mapped.add("Floors");
        break;
      case "Tile":
        mapped.add("Tiles");
        break;
      case "Doors":
        mapped.add("Doors");
        break;
      case "Hardware":
        mapped.add("Supplier");
        break;
      case "Glass":
        mapped.add("Windows");
        break;
      case "Plumbing Fixtures":
      case "Lighting":
        mapped.add("Appliances");
        break;
      case "Paint":
      case "Drywall":
      case "Stucco":
        mapped.add("Paint");
        break;
      case "Siding":
      case "Gutter":
      case "Roofing":
        mapped.add("Vinyl");
        break;
      case "Fence":
      case "Iron & Metal":
      case "Iron":
      case "Metal":
        mapped.add("Gates / Fences / Electric");
        break;
      case "Decking":
        mapped.add("Floors");
        break;
      case "Stone":
        mapped.add("Slabs / Granite / Marble / Quartz");
        break;
      case "Other":
        mapped.add("Supplier");
        break;
      default:
        console.warn(`⚠️ Unknown product type: ${english}`);
        mapped.add("Supplier");
        break;
    }
  }

  return Array.from(mapped);
}

/**
 * Transforms Vendor data to match the Rough table structure.
 * NOTE: If your Rough "Type" column is single-select, replace the Type line with:
 *   Type: mapProductsToRoughTypes(vendor.productsOffered)[0] ?? "",
 */
export function transformVendorToRoughTable(vendor: Vendor): RoughTableRow {
  return {
    Names: vendor.companyName,
    Type: formatForMultiSelect(mapProductsToRoughTypes(vendor.productsOffered)),
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
  return {
    Names: vendor.companyName,
    Type: formatForMultiSelect(
      mapProductsToFinishTypes(vendor.productsOffered)
    ),
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
  return {
    Names: vendor.companyName,
    Type: formatForMultiSelect(mapProductsToRoughTypes(vendor.productsOffered)),
    Details: "TEST: Will be mapped by employees",
    "Point of Contact": vendor.contactName,
    "Phone Number": formatPhoneNumber(vendor.phone, "parentheses"),
    Status: VENDOR_STATUS_OPTIONS[0], // "New"
    "Post date": vendor.submittedAt.toISOString().slice(0, 10),
    File: "",
    Stars: "",
    Notes: `TEST: ${vendor.comments || "No comments"} | Products: ${
      vendor.productsOffered?.join(", ") || "None"
    }`,
  };
}

/**
 * TEST MODE: Transforms vendor data with placeholder mappings (Finish)
 */
export function transformVendorToFinishTableTest(
  vendor: Vendor
): FinishTableRow {
  return {
    Names: vendor.companyName,
    Type: formatForMultiSelect(
      mapProductsToFinishTypes(vendor.productsOffered)
    ),
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
