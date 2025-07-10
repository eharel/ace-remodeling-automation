import { BaseColumn } from "../../columns";
import { DashboardColumnKey, DashboardColumnLabel } from "./columns";

export type ProjectDashboardRow = {
  [key in DashboardColumnKey]?: any;
};

export interface ProjectContext {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>;
  directValueMap: Map<string, any>;
  rowData: ProjectDashboardRow;
}

export type ProjectColumn = BaseColumn<
  ProjectContext,
  DashboardColumnKey,
  DashboardColumnLabel
> & {
  legacyCell?: string;
};
