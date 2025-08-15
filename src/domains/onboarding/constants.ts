/**
 * Onboarding domain constants
 */

export const FORM_FIELDS = {
  name: "Name / Nombre",
  company_name: "Company Name/ Nombre de la Compañía",
  professions: "Profession/ Profesión",
  insurance: "Do you have insurance?/ Tienes seguransa?",
  phone: "Phone Number/ Número de teléfono",
  email: "Email/ Correo electrónico",
  address: "Full Home Address/ Dirreccion domicilio", // keep exact spelling from form
  payment_methods: "Preferred payment method/ Método de pago",
  payment_info:
    "Please provide payment information for ACH, Zelle, or Check: / Proporcione los detalles de pago para ACH, Zelle o Cheque:", // full bilingual prompt
  comments: "Any comments or requests/ Cualquier comentario o petición",
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
