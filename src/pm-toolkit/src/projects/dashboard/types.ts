import { DashboardColumnKey } from "./columns";

export interface FieldContext {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>;
  directValueMap: Map<string, any>;
  rowData: any[];
}

export interface ProjectField {
  key: DashboardColumnKey;
  valueFn?: (fieldContext: FieldContext) => any;
}
