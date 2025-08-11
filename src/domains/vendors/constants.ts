import { Vendor } from "./types";

// Developer sheet ID (for testing)
// export const VENDOR_SHEET_ID = "1AjvpYaXI9d_6zO6OTUUVxNT4B7NCNRgAPt80KRltKb0";

// Production sheet ID (commented out for easy switching)
export const VENDOR_SHEET_ID = "1cMAGOIsPl5chA9cP3hYMyn9i3xLJL8bOALG_mygNY0w";

// Table name constants
export const TABLE_NAMES = {
  ROUGH: "Rough",
  FINISH: "Finish",
  OTHER: "Other",
} as const;

export type TableName = (typeof TABLE_NAMES)[keyof typeof TABLE_NAMES];

// Category constants (matching products.ts)
export const VENDOR_CATEGORIES = {
  ROUGH: "ROUGH",
  FINISH: "FINISH",
  BOTH: "BOTH",
  OTHER: "OTHER",
} as const;

export type VendorCategory =
  (typeof VENDOR_CATEGORIES)[keyof typeof VENDOR_CATEGORIES];

// Shared status options for both Rough and Finish tables
export const VENDOR_STATUS_OPTIONS = [
  "New",
  "In progress",
  "Under review",
  "Published",
  "Suspended",
  "Paused",
  "Not contacted",
  "Onboarded",
  "Contacted",
  "Insured",
  "Licensed",
] as const;

export type VendorStatus = (typeof VENDOR_STATUS_OPTIONS)[number];

// Named constants for vendor statuses
export const VENDOR_STATUS = {
  NEW: VENDOR_STATUS_OPTIONS[0],
  IN_PROGRESS: VENDOR_STATUS_OPTIONS[1],
  UNDER_REVIEW: VENDOR_STATUS_OPTIONS[2],
  PUBLISHED: VENDOR_STATUS_OPTIONS[3],
  SUSPENDED: VENDOR_STATUS_OPTIONS[4],
  PAUSED: VENDOR_STATUS_OPTIONS[5],
  NOT_CONTACTED: VENDOR_STATUS_OPTIONS[6],
  ONBOARDED: VENDOR_STATUS_OPTIONS[7],
  CONTACTED: VENDOR_STATUS_OPTIONS[8],
  INSURED: VENDOR_STATUS_OPTIONS[9],
  LICENSED: VENDOR_STATUS_OPTIONS[10],
} as const;

// Table configurations for the vendor sheet - all tables have identical structure
export const VENDOR_TABLES = {
  ROUGH: {
    name: TABLE_NAMES.ROUGH,
    headers: [
      "Name",
      "Type",
      "Email",
      "Location",
      "Phone",
      "Point of Contact",
      "Status",
      "Post date",
      "File",
      "Stars",
      "Notes",
      "Website / Social",
    ],
  },
  FINISH: {
    name: TABLE_NAMES.FINISH,
    headers: [
      "Name",
      "Type",
      "Email",
      "Location",
      "Phone",
      "Point of Contact",
      "Status",
      "Post date",
      "File",
      "Stars",
      "Notes",
      "Website / Social",
    ],
  },
  OTHER: {
    name: TABLE_NAMES.OTHER,
    headers: [
      "Name",
      "Type",
      "Email",
      "Location",
      "Phone",
      "Point of Contact",
      "Status",
      "Post date",
      "File",
      "Stars",
      "Notes",
      "Website / Social",
    ],
  },
} as const;

// Map Vendor fields to their possible form titles (exact matches from Google Forms)
export const VENDOR_FORM_KEYS: Record<keyof Vendor, string[]> = {
  companyName: ["Company Name/ Nombre de la Empresa"],
  contactName: ["Main Contact Name / Persona de Contacto Principal"],
  phone: ["Phone Number/ Número de teléfono"],
  email: ["Email/ Correo electrónico"],
  address: ["Business Address/ Dirección de negocio"],
  roughProducts: ["Type of Products You Offer / Tipo de Productos que Ofrece"],
  finishProducts: ["Type of Products You Offer / Tipo de Productos que Ofrece"],
  otherProducts: ["Type of Products You Offer / Tipo de Productos que Ofrece"],
  websiteOrSocial: ["Website or Social Media"],
  hasShowroom: [
    "Do you have a physical showroom? / ¿Tiene una sala de exhibición física?",
  ],
  offersCustomOrders: [
    "Do you offer Custom Orders? / ¿Ofrece pedidos personalizados?",
  ],
  offersDelivery: [
    "Do you offer delivery to job sites? /  ¿Ofrece entrega en sitios de trabajo?",
  ],
  turnaroundTime: [
    "What's the turnaround for standard orders? / ¿Cuál es el tiempo de entrega para pedidos estándar?",
  ],
  offersContractorPricing: [
    "Do you offer contractor or volume pricing? / ¿Ofrece precios especiales para contratistas o compras al por mayor?",
  ],
  paymentMethods: ["Preferred payment method/ Método de pago"],
  paymentDetails: [
    "Please provide payment information for ACH, Zelle, or Check:\n-If ACH, please provide both routing and account number.\n-If Zelle, please provide phone number or email associated.\n-If Check, please provide the name in which the check is to be made out to. \n/\nProporcione los detalles de pago para ACH, Zelle o Cheque:\n-Para ACH, incluya el número de ruta y el número de cuenta.\n-Para Zelle, el número de teléfono o correo electrónico asociado.\n-Para Cheque, el nombre a quien se debe emitir.",
  ],
  willEmailCatalogs: [
    "If any, please upload any catalogs or brochures to our email: info@aceremodelingtx.com/ Cargue cualquier folleto o catálogo: info@aceremodelingtx.com",
  ],
  comments: ["Any comments or requests/ Cualquier comentario o petición"],
  submittedAt: [], // This is set programmatically
} as const;

// Create a mapping of form titles to their corresponding Vendor fields
export const RAW_TO_VENDOR_KEY: Readonly<Record<string, keyof Vendor>> =
  Object.freeze(
    Object.entries(VENDOR_FORM_KEYS).reduce((acc, [field, labels]) => {
      labels.forEach((label) => {
        acc[label] = field as keyof Vendor;
      });
      return acc;
    }, {} as Record<string, keyof Vendor>)
  );

export const DEFAULT_VENDOR_RESPONSE: Vendor = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  roughProducts: [],
  finishProducts: [],
  otherProducts: [],
  websiteOrSocial: "",
  hasShowroom: undefined,
  offersCustomOrders: undefined,
  offersDelivery: undefined,
  turnaroundTime: "",
  offersContractorPricing: undefined,
  paymentMethods: [],
  paymentDetails: "",
  willEmailCatalogs: undefined,
  comments: "",
  submittedAt: new Date(),
};

// Keywords that indicate placeholder content in Google Sheets
export const PLACEHOLDER_KEYWORDS = [
  "Sample",
  "Example",
  "Test",
  "Demo",
  "Placeholder",
  "N/A",
  "TBD",
  "Click to edit",
  "Enter data",
  "Type here",
  "Add data",
  "Names", // Skip if someone accidentally put "Names" in the data
];

// Smart chip column configuration
export const SMART_CHIP_COLUMNS = {
  EMAIL: "Email",
  LOCATION: "Location",
  WEBSITE: "Website / Social",
} as const;
