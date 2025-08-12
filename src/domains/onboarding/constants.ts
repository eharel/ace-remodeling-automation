/**
 * Onboarding domain constants
 */

export const ONBOARDING_FORM_FIELDS = {
  // Contact Information
  NAME: "Name / Nombre",
  COMPANY: "Company Name/ Nombre de la Compañía",
  PROFESSION: "Profession/ Profesión",
  INSURANCE: "Do you have insurance?/ Tienes seguransa?",
  PHONE: "Phone Number/ Número de teléfono",
  EMAIL: "Email/ Correo electrónico",
  ADDRESS: "Full Home Address/ Dirreccion domicilio",

  // Payment Details
  PAYMENT_METHOD: "Preferred payment method/ Método de pago",
  PAYMENT_INFO:
    "Please provide payment information for ACH, Zelle, or Check: / Proporcione los detalles de pago para ACH, Zelle o Cheque:",

  // Additional Information
  COMMENTS: "Any comments or requests/ Cualquier comentario o petición",
} as const;

export const PAYMENT_METHODS = {
  ACH: "ACH",
  ZELLE: "Zelle",
  CHECK: "Check",
} as const;

export const PROFESSIONS = {
  CARPENTER: "Carpenter / Carpintero",
  ELECTRICIAN: "Electrician / Electricista",
  PLUMBER: "Plumber / Plomero",
  DRYWALL: "Drywall / Panelese de yeso",
  SHEETROCK: "Sheetrock / Tablarrroquero",
  PAINTER: "Painter / Pintor",
  HVAC: "HVAC",
  FLOORING: "Flooring / Pisos",
  FRAMER: "Framer / Armador",
  ROOFER: "Roofer / Techador",
  STUCCO: "Stucco / Estuco",
  DEMOLITION: "Demolition / Demolición",
  GLAZIER: "Glazier / Vidriero",
  MASONRY: "Masonry / Albañilería",
  LANDSCAPER: "Landscaper / Paisajista",
  POOL_TECHNICIAN: "Pool Technician / Técnico de Albercas",
  WINDOW_DOOR_INSTALLER:
    "Window, Door Installer / Instalador de Ventanas y Puertas",
  PHOTOGRAPHY: "Photography / Fotografía",
  CLEANERS: "Cleaners / Limpieza",
  DESIGNER: "Designer / Diseñador",
  ARCHITECT: "Architect / Arquitecto",
  GENERAL_CONTRACTOR: "General Contractor",
  OTHER: "Other",
} as const;

export const ONBOARDING_SHEET_CONFIG = {
  HEADERS: [
    "Name",
    "Company",
    "Profession",
    "Insurance",
    "Phone",
    "Email",
    "Address",
    "Payment Method",
    "Payment Information",
    "Comments",
    "Submission Date",
  ],
} as const;

export const ONBOARDING_STATUS = {
  NEW: "New",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
} as const;
