import { BaseColumn } from "@shared/columns";
import { DashboardColumnKey, DashboardColumnLabel } from "./columns";
import { PROJECT_DATA_FIELDS } from "./fields";

export type ProjectDashboardRow = {
  [key in DashboardColumnKey]?: any;
};

export interface ProjectContext {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  extractedProjectData: ExtractedProjectData;
}

export type ProjectColumn = BaseColumn<
  ProjectContext,
  DashboardColumnKey,
  DashboardColumnLabel
> & {
  legacyCell?: string;
};

export interface ProjectTransformContext {
  rawData: ExtractedProjectData;
  rowData: ProjectDashboardRow;
}

// In types.ts
export type ProjectFieldKey = (typeof PROJECT_DATA_FIELDS)[number]["key"];

export type ExtractedProjectData = {
  [K in ProjectFieldKey]: number | string | null;
};
