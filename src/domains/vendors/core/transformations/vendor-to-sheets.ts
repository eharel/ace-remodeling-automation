import { Vendor } from "../../types";
import {
  VENDOR_STATUS_OPTIONS,
  VENDOR_CATEGORIES,
  VENDOR_STATUS,
} from "../../constants";
import { formatPhoneNumber, toEnglish } from "@utils/index";
import { PRODUCT_BY_LABEL } from "../../products";

/**
 * Interface for vendor table row format
 * All tables (Rough, Finish, Other) now have identical structure
 */
export interface VendorTableRow {
  Name: string;
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
  "Website / Social": string;
  UUID: string; // For future two-way sync
  "Submitted At": string; // ISO timestamp for traceability
}

/** utility: Sheets wants "A, B, C" for multi-select cells */
function joinForChip(values: string[] | undefined) {
  return values && values.length ? values.join(", ") : "";
}

/**
 * Generic function to map products to sheet types
 * @param products - Array of product strings from form
 * @param typeKey - Either 'roughTypes' or 'finishTypes'
 * @param fallback - Default value if no mapping found
 */
function mapProductsToTypes(
  products: string[],
  typeKey: "roughTypes" | "finishTypes",
  fallback: string
): string[] {
  if (!products?.length) return [];
  const out = new Set<string>();
  for (const p of products) {
    const def = PRODUCT_BY_LABEL[toEnglish(p)];
    if (def?.[typeKey]) {
      def[typeKey].forEach((t: string) => out.add(t));
    }
  }
  return out.size ? [...out] : [fallback];
}

export function mapProductsToRoughTypes(products?: string[]): string[] {
  return mapProductsToTypes(products || [], "roughTypes", "All");
}

export function mapProductsToFinishTypes(products?: string[]): string[] {
  return mapProductsToTypes(products || [], "finishTypes", "Supplier");
}

export function mapProductsToOtherTypes(products?: string[]): string[] {
  // For Other table, we only want products that are actually "Other" category
  if (!products?.length) return ["Other"];

  const otherProducts = products.filter((product) => {
    const def = PRODUCT_BY_LABEL[toEnglish(product)];
    return def?.category === VENDOR_CATEGORIES.OTHER;
  });

  // If we have Other products, map them to their types, otherwise use fallback
  if (otherProducts.length > 0) {
    return mapProductsToTypes(otherProducts, "roughTypes", "Other");
  }

  return ["Other"];
}

/**
 * Transforms Vendor data to match the standardized table structure.
 * All tables (Rough, Finish, Other) now use the same format.
 */
export function transformVendorToTable(
  vendor: Vendor,
  products: string[],
  typeMapper: (products: string[]) => string[],
  uuid: string,
  submittedAt: string
): VendorTableRow {
  return {
    Name: vendor.companyName,
    Type: joinForChip(typeMapper(products)),
    Email: vendor.email,
    Location: vendor.address,
    Phone: formatPhoneNumber(vendor.phone, "parentheses"),
    "Point of Contact": vendor.contactName,
    Status: VENDOR_STATUS.NEW,
    "Post date": vendor.submittedAt.toISOString().slice(0, 10),
    File: "",
    Stars: "",
    "Website / Social": vendor.websiteOrSocial || "",
    Notes: "",
    UUID: uuid,
    "Submitted At": submittedAt,
  };
}
