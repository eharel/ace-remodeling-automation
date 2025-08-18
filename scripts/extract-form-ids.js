/**
 * Simple Google Apps Script to extract form question IDs
 *
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Replace the form IDs below with your actual form IDs
 * 5. Run the extractFormIds() function
 * 6. Copy the output and update src/config/forms/form-ids.ts
 */

// Replace these with your actual form IDs
const FORM_IDS = {
  vendor: "1ZJjubXrTZY32t4XDYzfCtruf5kdsrNrl2e8RFURGjhU", // Dev vendor form
  onboarding: "1j7FMuDRHRQ47ee_M5yZCrjW8gEIoMG7y8XehaIM7RjY", // Dev onboarding form
};

/**
 * Extract IDs from a single form
 */
function extractFormIds(formId, formName) {
  try {
    const form = FormApp.openById(formId);
    const items = form.getItems();

    console.log(`\n=== ${formName.toUpperCase()} FORM ===`);
    console.log(`Form ID: ${formId}`);
    console.log(`Form Title: ${form.getTitle()}`);
    console.log("\nQuestion IDs:");

    const extractedData = {};

    items.forEach((item, index) => {
      const id = item.getId();
      const title = item.getTitle();
      const type = item.getType().toString();

      console.log(`${index + 1}. ID: ${id}`);
      console.log(`   Title: "${title}"`);
      console.log(`   Type: ${type}`);
      console.log("---");

      // Store for potential export
      extractedData[`item_${index + 1}`] = {
        id: id,
        title: title,
        type: type,
      };
    });

    return extractedData;
  } catch (error) {
    console.error(`Error extracting from ${formName} form:`, error.message);
    return null;
  }
}

/**
 * Extract IDs from all forms
 */
function extractAllFormIds() {
  console.log("Starting form ID extraction...\n");

  const results = {};

  for (const [formName, formId] of Object.entries(FORM_IDS)) {
    results[formName] = extractFormIds(formId, formName);
  }

  console.log("\n=== EXTRACTION COMPLETE ===");
  console.log("Copy the IDs above and update src/config/forms/form-ids.ts");

  return results;
}

/**
 * Generate TypeScript code for the extracted IDs
 */
function generateTypeScriptCode() {
  const results = extractAllFormIds();

  console.log("\n=== TYPESCRIPT CODE ===");
  console.log("Copy this into src/config/forms/form-ids.ts:");
  console.log("\n// Replace the items objects with:");

  for (const [formName, data] of Object.entries(results)) {
    if (data) {
      console.log(`\n// ${formName} form items:`);
      console.log("items: {");

      Object.entries(data).forEach(([key, item]) => {
        // Create a clean field name from the title
        const fieldName = createFieldName(item.title);
        console.log(`  ${fieldName}: ${item.id}, // "${item.title}"`);
      });

      console.log("}");
    }
  }
}

/**
 * Create a clean field name from a question title
 */
function createFieldName(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "") // Remove spaces
    .replace(/^[0-9]/, "") // Remove leading numbers
    .substring(0, 20); // Limit length
}

/**
 * Main function to run
 */
function main() {
  console.log("ACE Remodeling Form ID Extractor");
  console.log("================================");

  // Extract and display IDs
  extractAllFormIds();

  // Generate TypeScript code
  generateTypeScriptCode();
}
