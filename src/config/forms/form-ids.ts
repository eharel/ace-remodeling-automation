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
    development: {
      formId: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU", // Dev vendor form ID
      items: {
        companyName: 227649005, // "Company Name/ Nombre de la Empresa"
        contactName: 1633920210, // "Main Contact Name / Persona de Contacto Principal"
        phone: 1846923513, // "Phone Number/ Número de teléfono"
        email: 30947553, // "Email/ Correo electrónico"
        address: 2051311867, // "Business Address/ Dirección de negocio"
        productsOffered: 790080973, // "Type of Products You Offer / Tipo de Productos que Ofrece"
        websiteOrSocial: 1770822543, // "Website or Social Media"
        hasShowroom: 446028017, // "Do you have a physical showroom? / ¿Tiene una sala de exhibición física?"
        offersCustomOrders: 886176780, // "Do you offer Custom Orders? / ¿Ofrece pedidos personalizados?"
        offersDelivery: 136785426, // "Do you offer delivery to job sites? /  ¿Ofrece entrega en sitios de trabajo?"
        turnaroundTime: 99959376, // "What's the turnaround for standard orders? / ¿Cuál es el tiempo de entrega para pedidos estándar?"
        offersContractorPricing: 1821869200, // "Do you offer contractor or volume pricing? / ¿Ofrece precios especiales para contratistas o compras al por mayor?"
        paymentMethods: 2068215162, // "Preferred payment method/ Método de pago"
        paymentDetails: 1872625365, // "Please provide payment information for ACH, Zelle, or Check: ..."
        willEmailCatalogs: 1592354860, // "If any, please upload any catalogs or brochures to our email: info@aceremodelingtx.com/ Cargue cualquier folleto o catálogo: info@aceremodelingtx.com"
        comments: 1603973448, // "Any comments or requests/ Cualquier comentario o petición"
      },
    },
    production: {
      formId: "1RJvElIltYNylJMebgqCn_1AsqlkhcVA3lkRU1rseUwY", // Production vendor form ID
      items: {
        companyName: 227649005, // "Company Name/ Nombre de la Empresa"
        contactName: 1633920210, // "Main Contact Name / Persona de Contacto Principal"
        phone: 1846923513, // "Phone Number/ Número de teléfono"
        email: 30947553, // "Email/ Correo electrónico"
        address: 2051311867, // "Business Address/ Dirección de negocio"
        productsOffered: 790080973, // "Type of Products You Offer / Tipo de Productos que Ofrece"
        websiteOrSocial: 1770822543, // "Website or Social Media"
        hasShowroom: 446028017, // "Do you have a physical showroom? / ¿Tiene una sala de exhibición física?"
        offersCustomOrders: 886176780, // "Do you offer Custom Orders? / ¿Ofrece pedidos personalizados?"
        offersDelivery: 136785426, // "Do you offer delivery to job sites? /  ¿Ofrece entrega en sitios de trabajo?"
        turnaroundTime: 99959376, // "What's the turnaround for standard orders? / ¿Cuál es el tiempo de entrega para pedidos estándar?"
        offersContractorPricing: 1821869200, // "Do you offer contractor or volume pricing? / ¿Ofrece precios especiales para contratistas o compras al por mayor?"
        paymentMethods: 2068215162, // "Preferred payment method/ Método de pago"
        paymentDetails: 1872625365, // "Please provide payment information for ACH, Zelle, or Check: ..."
        willEmailCatalogs: 1592354860, // "If any, please upload any catalogs or brochures to our email: info@aceremodelingtx.com/ Cargue cualquier folleto o catálogo: info@aceremodelingtx.com"
        comments: 1603973448, // "Any comments or requests/ Cualquier comentario o petición"
      },
    },
  },
  onboarding: {
    development: {
      formId: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY",
      items: {
        name: 1633920210, // "Name / Nombre"
        companyName: 227649005, // "Company Name / Nombre de la Compañía"
        profession: 790080973, // "Profession/ Profesión"
        insurance: 1770822543, // "Do you have insurance?/ Tienes seguransa?"
        phone: 1846923513, // "Phone Number/ Número de teléfono"
        email: 30947553, // "Email / Correo electrónico"
        address: 2051311867, // "Full Home Address/Dirreccion domicilio"
        website: 840202789, // "Website / Sitio web"
        paymentMethods: 2068215162, // "Preferred payment method/ Método de pago"
        paymentInfo: 1872625365, // "Please provide payment information for ACH, Zelle, or Check: ..."
        comments: 1603973448, // "Any comments or requests/ Cualquier comentario o petición"
      },
    },
    production: {
      formId: "1FHMyMzeYcja8SmLHlLABX53GSX8s-vyBrEkahX3RxWw",
      items: {
        name: 1633920210, // "Name / Nombre"
        companyName: 227649005, // "Company Name/ Nombre de la Compañía"
        profession: 790080973, // "Profession/ Profesión"
        insurance: 1770822543, // "Do you have insurance?/ Tienes seguransa?"
        insuranceUpload: 446028017, // "If yes, upload a copy of your insurance to our email: info@aceremodelingtx.com / Si es así, suba una copia de su seguro aquí: info@aceremodelingtx.com"
        phone: 1846923513, // "Phone Number/ Número de teléfono"
        email: 30947553, // "Email/ Correo electrónico"
        address: 2051311867, // "Full Home Address/ Dirreccion domicilio"
        website: 732621165, // "Website / Sitio web"
        paymentMethods: 2068215162, // "Preferred payment method/ Método de pago"
        paymentInfo: 1872625365, // "Please provide payment information for ACH, Zelle, or Check: ..."
        comments: 1603973448, // "Any comments or requests/ Cualquier comentario o petición"
      },
    },
  },
} as const;

// Type helpers for type safety
export type FormName = keyof typeof FORM_IDS;
export type FormEnvironment = "development" | "production";
export type FormItemName<T extends FormName> =
  | keyof (typeof FORM_IDS)[T]["development"]["items"]
  | keyof (typeof FORM_IDS)[T]["production"]["items"];

// Helper functions for accessing form data
export function getFormId(
  formName: FormName,
  environment: FormEnvironment = "development"
): string {
  return FORM_IDS[formName][environment].formId;
}

export function getItemId<T extends FormName>(
  formName: T,
  itemName: FormItemName<T>,
  environment: FormEnvironment = "development"
): number {
  const items = FORM_IDS[formName][environment].items;
  return items[itemName as keyof typeof items];
}

export function getFormItems(
  formName: FormName,
  environment: FormEnvironment = "development"
) {
  return FORM_IDS[formName][environment].items;
}

// Future enhancement: This structure can be extended to include metadata
// Example of future structure:
/*
export const FORM_CONFIGS = {
  vendor: {
    development: {
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
  }
} as const;
*/
