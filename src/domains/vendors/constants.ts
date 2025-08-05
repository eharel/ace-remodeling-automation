import { Vendor } from "./types";

export const VENDOR_SHEET_ID = "1cMAGOIsPl5chA9cP3hYMyn9i3xLJL8bOALG_mygNY0w";

// Map Vendor fields to their possible form titles (exact matches from Google Forms)
export const VENDOR_FORM_KEYS: Record<keyof Vendor, string[]> = {
  companyName: ["Company Name/ Nombre de la Empresa"],
  contactName: ["Main Contact Name / Persona de Contacto Principal"],
  phone: ["Phone Number/ Número de teléfono"],
  email: ["Email/ Correo electrónico"],
  website: ["Website or Social Media"],
  bio: [
    "Business Address/ Dirección de negocio",
    "Any comments or requests/ Cualquier comentario o petición",
    "Preferred payment method/ Método de pago",
    "Please provide payment information for ACH, Zelle, or Check:\n-If ACH, please provide both routing and account number.\n-If Zelle, please provide phone number or email associated.\n-If Check, please provide the name in which the check is to be made out to. \n/\nProporcione los detalles de pago para ACH, Zelle o Cheque:\n-Para ACH, incluya el número de ruta y el número de cuenta.\n-Para Zelle, el número de teléfono o correo electrónico asociado.\n-Para Cheque, el nombre a quien se debe emitir.",
  ],
  materials: ["Type of Products You Offer / Tipo de Productos que Ofrece"],
  certifications: [
    "Do you have a physical showroom? / ¿Tiene una sala de exhibición física?",
    "Do you offer Custom Orders? / ¿Ofrece pedidos personalizados?",
    "Do you offer delivery to job sites? /  ¿Ofrece entrega en sitios de trabajo?",
    "What's the turnaround for standard orders? / ¿Cuál es el tiempo de entrega para pedidos estándar?",
    "Do you offer contractor or volume pricing? / ¿Ofrece precios especiales para contratistas o compras al por mayor?",
  ],
  tradeType: ["Type of Products You Offer / Tipo de Productos que Ofrece"],
  submittedAt: [], // This is set programmatically
  uploads: [
    "If any, please upload any catalogs or brochures to our email: info@aceremodelingtx.com/ Cargue cualquier folleto o catálogo: info@aceremodelingtx.com",
  ],
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
  website: "",
  bio: "",
  materials: [],
  certifications: [],
  tradeType: "",
  submittedAt: new Date(),
  uploads: [],
};
