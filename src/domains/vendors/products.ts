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

// NOTE: Form and sheet dropdowns now match exactly - single source of truth
// Form options include both English and Spanish versions
export const PRODUCT_CATALOG: ProductDef[] = [
  // OTHER CATEGORY
  {
    key: "ALL",
    formLabels: ["All", "Todos"],
    category: VENDOR_CATEGORIES.BOTH,
    roughTypes: ["All"],
    finishTypes: ["All"],
  },
  {
    key: "BUILDING_SUPPLIES",
    formLabels: ["Building Supplies", "Materiales de construcción"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Building Supplies"],
  },
  {
    key: "CONCRETE",
    formLabels: ["Concrete", "Concreto"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Concrete"],
  },
  {
    key: "DRYWALL",
    formLabels: ["Drywall", "Panel de yeso"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Drywall"],
  },
  {
    key: "FABRICATOR",
    formLabels: ["Fabricator", "Fabricante"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Fabricator"],
  },
  {
    key: "FLOORS",
    formLabels: ["Floors", "Pisos"],
    category: VENDOR_CATEGORIES.BOTH,
    roughTypes: ["Floors"],
    finishTypes: ["Floors"],
  },
  {
    key: "FRAMING",
    formLabels: ["Framing", "Estructura"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Framing"],
  },
  {
    key: "INSULATION",
    formLabels: ["Insulation", "Aislamiento"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Insulation"],
  },
  {
    key: "METAL",
    formLabels: ["Metal"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Metal"],
  },
  {
    key: "ROOFS",
    formLabels: ["Roofs", "Techos"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Roofs"],
  },
  {
    key: "SHOWROOM",
    formLabels: ["Showroom", "Sala de exposición"],
    category: VENDOR_CATEGORIES.BOTH,
    roughTypes: ["Showroom"],
    finishTypes: ["Showroom"],
  },
  {
    key: "WOOD",
    formLabels: ["Wood", "Madera"],
    category: VENDOR_CATEGORIES.ROUGH,
    roughTypes: ["Wood"],
  },

  // FINISH CATEGORY
  {
    key: "APPLIANCES",
    formLabels: ["Appliances", "Electrodomésticos"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Appliances"],
  },
  {
    key: "CABINETRY",
    formLabels: ["Cabinetry", "Gabinetes"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Cabinetry"],
  },
  {
    key: "CARPET",
    formLabels: ["Carpet", "Alfombra"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Carpet"],
  },
  {
    key: "COUNTERTOPS",
    formLabels: ["Countertops", "Encimeras"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Countertops"],
  },
  {
    key: "DOORS",
    formLabels: ["Doors", "Puertas"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Doors"],
  },
  {
    key: "DRAWERS",
    formLabels: ["Drawers", "Cajones"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Drawers"],
  },
  {
    key: "FLOORS_FINISH",
    formLabels: ["Floors", "Pisos"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Floors"],
  },
  {
    key: "GATES_FENCES_ELECTRIC",
    formLabels: ["Gates • Fences • Electric", "Portones • Cercas • Eléctrico"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Gates • Fences • Electric"],
  },
  {
    key: "HARDWOOD",
    formLabels: ["Hardwood", "Madera dura"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Hardwood"],
  },
  {
    key: "LUMBER",
    formLabels: ["Lumber", "Madera aserrada"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Lumber"],
  },
  {
    key: "PAINT",
    formLabels: ["Paint", "Pintura"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Paint"],
  },
  {
    key: "PLYWOOD",
    formLabels: ["Plywood", "Madera contrachapada"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Plywood"],
  },
  {
    key: "SHOWROOM_FINISH",
    formLabels: ["Showroom", "Sala de exposición"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Showroom"],
  },
  {
    key: "SLABS_GRANITE_MARBLE",
    formLabels: [
      "Slabs • Granite • Marble • Quartz",
      "Losas • Granito • Mármol • Cuarzo",
    ],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Slabs • Granite • Marble • Quartz"],
  },
  {
    key: "SUPPLIER",
    formLabels: ["Supplier", "Proveedor"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Supplier"],
  },
  {
    key: "TILES",
    formLabels: ["Tiles", "Azulejos"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Tiles"],
  },
  {
    key: "VINYL",
    formLabels: ["Vinyl", "Vinilo"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Vinyl"],
  },
  {
    key: "WALLPAPER",
    formLabels: ["Wallpaper", "Papel tapiz"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Wallpaper"],
  },
  {
    key: "WINDOWS",
    formLabels: ["Windows", "Ventanas"],
    category: VENDOR_CATEGORIES.FINISH,
    finishTypes: ["Windows"],
  },

  // OTHER - goes to separate tab
  {
    key: "OTHER",
    formLabels: ["Other", "Otro"],
    category: VENDOR_CATEGORIES.OTHER,
    roughTypes: ["Other"],
    finishTypes: ["Other"],
  },
];

// fast lookup: label -> ProductDef
export const PRODUCT_BY_LABEL: Record<string, ProductDef> =
  PRODUCT_CATALOG.reduce((acc, def) => {
    def.formLabels.forEach((l) => (acc[l] = def));
    return acc;
  }, {} as Record<string, ProductDef>);
