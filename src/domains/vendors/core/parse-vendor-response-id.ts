import { parseYesNo } from "@/forms/utils/parse-fields";
import { toEnglish } from "@utils/index";
import {
  processFormResponse,
  validateFormResponse,
} from "@/forms/core/form-processor";
import type { Vendor } from "../types";
import { PRODUCT_BY_LABEL } from "../products";
import { VENDOR_CATEGORIES } from "../constants";

/**
 * Categorizes products into rough, finish, and other categories
 */
function categorizeProducts(productsOffered: string): {
  rough: string[];
  finish: string[];
  other: string[];
} {
  const products = productsOffered
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const roughProducts: string[] = [];
  const finishProducts: string[] = [];
  const otherProducts: string[] = [];

  const normalizeLabel = (s: string) =>
    s
      .replace(/[\u2022\u2219]/g, "•")
      .replace(/\s*•\s*/g, " • ")
      .replace(/\s+/g, " ")
      .trim();

  const findProductDef = (englishLabel: string) => {
    const normalized = normalizeLabel(englishLabel);
    // Fast path: direct lookup
    let def = PRODUCT_BY_LABEL[englishLabel];
    if (def) return def;
    // Fallback: normalized match across known labels
    for (const key in PRODUCT_BY_LABEL) {
      if (normalizeLabel(key) === normalized) return PRODUCT_BY_LABEL[key];
    }
    return undefined;
  };

  for (const product of products) {
    const productEnglish = toEnglish(product);
    const def = findProductDef(productEnglish);

    if (!def) {
      // Unknown label → treat as Other to avoid data loss
      otherProducts.push(productEnglish);
      continue;
    }

    // Category-driven split aligned with decideDestinations and type mappers
    if (
      def.category === VENDOR_CATEGORIES.ROUGH ||
      def.category === VENDOR_CATEGORIES.BOTH
    ) {
      roughProducts.push(productEnglish);
    }
    if (
      def.category === VENDOR_CATEGORIES.FINISH ||
      def.category === VENDOR_CATEGORIES.BOTH
    ) {
      finishProducts.push(productEnglish);
    }
    if (def.category === VENDOR_CATEGORIES.OTHER) {
      otherProducts.push(productEnglish);
    }
  }

  return { rough: roughProducts, finish: finishProducts, other: otherProducts };
}

/**
 * Parses vendor form response using ID-based field matching
 */
export function parseVendorResponseById(
  response: GoogleAppsScript.Forms.FormResponse,
  environment: "development" | "production"
): Vendor {
  console.log("🔍 Processing vendor form response with ID-based matching");
  console.log("🔍 Environment:", environment);

  // Process form response using ID-based matching
  const rawData = processFormResponse("vendor", response, environment);

  console.log("🔍 Processed form data:", JSON.stringify(rawData, null, 2));

  // Validate required fields
  validateFormResponse("vendor", response, environment);

  // Categorize products
  const categorizedProducts = categorizeProducts(rawData.productsOffered || "");

  // Map raw data to Vendor interface
  const data: Vendor = {
    companyName: rawData.companyName || "",
    contactName: rawData.contactName || "",
    phone: rawData.phone || "",
    email: rawData.email || "",
    address: rawData.address || "",
    roughProducts:
      categorizedProducts.rough.length > 0
        ? categorizedProducts.rough
        : undefined,
    finishProducts:
      categorizedProducts.finish.length > 0
        ? categorizedProducts.finish
        : undefined,
    otherProducts:
      categorizedProducts.other.length > 0
        ? categorizedProducts.other
        : undefined,
    websiteOrSocial: rawData.websiteOrSocial || undefined,
    hasShowroom: rawData.hasShowroom
      ? parseYesNo(rawData.hasShowroom)
      : undefined,
    offersCustomOrders: rawData.offersCustomOrders
      ? parseYesNo(rawData.offersCustomOrders)
      : undefined,
    offersDelivery: rawData.offersDelivery
      ? parseYesNo(rawData.offersDelivery)
      : undefined,
    turnaroundTime: rawData.turnaroundTime || undefined,
    offersContractorPricing: rawData.offersContractorPricing
      ? parseYesNo(rawData.offersContractorPricing)
      : undefined,
    paymentMethods: rawData.paymentMethods
      ? rawData.paymentMethods.split(",").map((s: string) => s.trim())
      : [],
    paymentDetails: rawData.paymentDetails || "",
    willEmailCatalogs: rawData.willEmailCatalogs
      ? parseYesNo(rawData.willEmailCatalogs)
      : undefined,
    comments: rawData.comments || undefined,
    submittedAt: new Date(),
  };

  console.log("🔍 Final parsed vendor data:", JSON.stringify(data, null, 2));
  return data;
}
