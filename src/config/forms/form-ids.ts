/**
 * Form ID configurations for ACE Remodeling forms
 *
 * This structure is designed to be:
 * - Simple to implement now (just IDs)
 * - Ready for future enhancement (metadata, validation, etc.)
 * - Type-safe and maintainable
 */

export const FORM_IDS = {
  vendor: {
    formId: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU", // Dev form ID
    items: {
      // TODO: Replace with actual extracted IDs
      companyName: 0, // "Company Name / Nombre de la Empresa"
      contactName: 0, // "Main Contact Name / Persona de Contacto Principal"
      phone: 0, // "Phone Number / Número de teléfono"
      email: 0, // "Email / Correo electrónico"
      address: 0, // "Business Address / Dirección de negocio"
      productsOffered: 0, // "Type of Products You Offer / Tipo de Productos que Ofrece"
      websiteOrSocial: 0, // "Website or Social Media"
      hasShowroom: 0, // "Do you have a physical showroom? / ¿Tiene una sala de exhibición física?"
      offersCustomOrders: 0, // "Do you offer Custom Orders? / ¿Ofrece pedidos personalizados?"
      offersDelivery: 0, // "Do you offer delivery to job sites? / ¿Ofrece entrega en sitios de trabajo?"
      turnaroundTime: 0, // "What's the turnaround for standard orders? / ¿Cuál es el tiempo de entrega para pedidos estándar?"
      offersContractorPricing: 0, // "Do you offer contractor or volume pricing? / ¿Ofrece precios especiales para contratistas o compras al por mayor?"
      paymentMethods: 0, // "Preferred payment method / Método de pago"
      paymentDetails: 0, // "Please provide payment information for ACH, Zelle, or Check: ..."
      willEmailCatalogs: 0, // "If any, please upload any catalogs or brochures to our email: ..."
      comments: 0, // "Any comments or requests / Cualquier comentario o petición"
    },
  },
  onboarding: {
    formId: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY", // Dev form ID
    items: {
      // TODO: Replace with actual extracted IDs
      name: 0, // "Name / Nombre"
      companyName: 0, // "Company Name / Nombre de la Compañía"
      profession: 0, // "Profession / Profesión"
      insurance: 0, // "Do you have insurance? / Tienes seguransa?"
      phone: 0, // "Phone Number / Número de teléfono"
      email: 0, // "Email / Correo electrónico"
      address: 0, // "Full Home Address / Dirreccion domicilio"
      website: 0, // "Website / Sitio web"
      paymentMethods: 0, // "Preferred payment method / Método de pago"
      paymentInfo: 0, // "Please provide payment information for ACH, Zelle, or Check: ..."
      comments: 0, // "Any comments or requests / Cualquier comentario o petición"
    },
  },
} as const;

// Type helpers for type safety
export type FormName = keyof typeof FORM_IDS;
export type FormItemName<T extends FormName> =
  keyof (typeof FORM_IDS)[T]["items"];

// Helper functions for accessing form data
export function getFormId(formName: FormName): string {
  return FORM_IDS[formName].formId;
}

export function getItemId<T extends FormName>(
  formName: T,
  itemName: FormItemName<T>
): number {
  return FORM_IDS[formName].items[itemName];
}

export function getFormItems(formName: FormName) {
  return FORM_IDS[formName].items;
}

// Future enhancement: This structure can be extended to include metadata
// Example of future structure:
/*
export const FORM_CONFIGS = {
  vendor: {
    formId: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU",
    items: {
      companyName: {
        id: 123456789,
        title: "Company Name / Nombre de la Empresa",
        type: "TEXT",
        required: true,
        validation: { type: "TEXT", errorText: "Company name is required" }
      },
      // ... etc
    }
  }
} as const;
*/
