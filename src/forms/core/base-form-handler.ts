import { extractResponse } from "./extract-response";
import { createLogger, errFields } from "../../lib/logging/log";
import type { FormsIds } from "../config/config";

export interface FormDataWithMetadata<T> {
  data: T;
  uuid: string;
  submittedAt: string;
}

export interface FormHandlerConfig<T> {
  parseFunction: (rawData: Record<string, string>) => T;
  saveFunction: (
    data: FormDataWithMetadata<T>,
    sheetId: string,
    tabName: string
  ) => void;
  loggerModule: string;
  formIdKey: keyof FormsIds;
  sheetIdKey: keyof FormsIds;
  tabKey: keyof FormsIds;
}

/**
 * Creates a standardized form handler that follows the same pattern
 * for extracting, parsing, and saving form data
 */
export function createFormHandler<T>(config: FormHandlerConfig<T>) {
  return function handleForm(
    e: GoogleAppsScript.Events.FormsOnFormSubmit,
    ids: FormsIds
  ) {
    const log = createLogger(config.loggerModule, {
      bound: { formId: ids[config.formIdKey] as string },
    });
    const span = log.start("Handle form submission");

    let error: Error | undefined;
    try {
      // Extract raw form data
      log.info("Extracting raw form data");
      const rawFormData = extractResponse(e);

      // Parse the raw data into structured type
      log.info("Parsing form data");
      const parsedData = config.parseFunction(rawFormData);

      // Add metadata for traceability
      const formDataWithMetadata: FormDataWithMetadata<T> = {
        data: parsedData,
        uuid: Utilities.getUuid(),
        submittedAt: new Date().toISOString(),
      };

      // Save to Google Sheets
      const sheetId = ids[config.sheetIdKey] as string;
      const tabName = ids[config.tabKey] as string;

      config.saveFunction(formDataWithMetadata, sheetId, tabName);

      log.info("Saved data to sheet", {
        sheetId,
        tab: tabName,
      });
    } catch (err) {
      error = err as Error;
      log.error("Error processing form", errFields(error));
      throw error;
    } finally {
      span.end({ success: !error });
    }
  };
}
