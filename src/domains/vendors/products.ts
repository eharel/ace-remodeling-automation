import { VENDOR_CATEGORIES, VendorCategory } from "./constants";

// categories a product contributes to
export type { VendorCategory };

// one record per *form checkbox* option (English side)
export interface ProductDef {
  key: string; // stable internal key
  formLabels: string[]; // labels we accept from the form (English side)
  roughTypes?: string[]; // Rough table "Type" chips to add
  finishTypes?: string[]; // Finish table "Type" chips to add
  category: VendorCategory; // which tables this contributes to
}

// NOTE: use English side only; we already strip "X / Y" to English
export const PRODUCT_CATALOG: ProductDef[] = [
  {
    key: "CABINETS",
    formLabels: ["Cabinets"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Cabinetry"],
  },

  {
    key: "COUNTERTOPS",
    formLabels: ["Countertops"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Countertops"],
  },

  {
    key: "FLOORING",
    formLabels: ["Flooring"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Floors"],
  },

  {
    key: "TILE",
    formLabels: ["Tile"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Tiles"],
  },

  {
    key: "DOORS",
    formLabels: ["Doors"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Doors"],
  },

  {
    key: "HARDWARE",
    formLabels: ["Hardware"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Metal"],
    finishTypes: ["Supplier"],
  }, // can touch both if you want

  {
    key: "GLASS",
    formLabels: ["Glass"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Windows"],
  },

  {
    key: "PLUMBING_FIXTURES",
    formLabels: ["Plumbing Fixtures"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Building Supplies"],
    finishTypes: ["Appliances"],
  },

  {
    key: "LIGHTING",
    formLabels: ["Lighting"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Appliances"],
  },

  {
    key: "PAINT",
    formLabels: ["Paint"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Paint"],
    roughTypes: ["Building Supplies"],
  },

  {
    key: "DRYWALL",
    formLabels: ["Drywall"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Drywall"],
    finishTypes: ["Paint"],
  },

  {
    key: "STUCCO",
    formLabels: ["Stucco"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Paint"],
  },

  {
    key: "SIDING",
    formLabels: ["Siding"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Vinyl"],
  },

  {
    key: "FENCE",
    formLabels: ["Fence"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Gates / Fences / Electric"],
  },

  {
    key: "GUTTER",
    formLabels: ["Gutter"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Roofs"],
    finishTypes: ["Vinyl"],
  },

  {
    key: "DECKING",
    formLabels: ["Decking"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Floors"],
  },

  {
    key: "ROOFING",
    formLabels: ["Roofing"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Roofs"],
    finishTypes: ["Vinyl"],
  },

  {
    key: "STONE",
    formLabels: ["Stone"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Slabs / Granite / Marble / Quartz"],
  },

  {
    key: "IRON_METAL",
    formLabels: ["Iron & Metal", "Iron", "Metal"],
    category: VENDOR_CATEGORIES.BOTH,
    roughTypes: ["Metal"],
    finishTypes: ["Gates / Fences / Electric"],
  },

  {
    key: "OTHER",
    formLabels: ["Other"],
    category: VENDOR_CATEGORIES.BOTH,
    roughTypes: ["All"],
    finishTypes: ["Supplier"],
  },
];

// fast lookup: label -> ProductDef
export const PRODUCT_BY_LABEL: Record<string, ProductDef> =
  PRODUCT_CATALOG.reduce((acc, def) => {
    def.formLabels.forEach((l) => (acc[l] = def));
    return acc;
  }, {} as Record<string, ProductDef>);
