import { BaseColumn } from "../../columns";
import { DashboardColumnKey, DashboardColumnLabel } from "./project-columns";

export interface FieldContext {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>;
  directValueMap: Map<string, any>;
  rowData: any[];
}

export type ProjectColumn = BaseColumn<FieldContext> & {
  key: DashboardColumnKey;
  label: DashboardColumnLabel;
  description?: string;
  help?: string;
  legacyCell?: string;
};
