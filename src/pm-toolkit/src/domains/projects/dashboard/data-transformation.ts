import { ExtractedProjectData } from "./types";
import { DASHBOARD_KEYS } from "./columns";
import { ProjectDashboardRow } from "./types";
import { ProjectContext } from "./types";
import { DASHBOARD_COLUMNS } from "./columns";

export function transformExtractedDataToDashboardRows(
  extracted: ExtractedProjectData[],
  sheets: GoogleAppsScript.Spreadsheet.Sheet[]
): ProjectDashboardRow[] {
  return extracted.map((data, i) => {
    const sheet = sheets[i];
    const row: ProjectDashboardRow = {
      [DASHBOARD_KEYS.PROJECT_NO]: data[DASHBOARD_KEYS.PROJECT_NO],
      [DASHBOARD_KEYS.CLIENT_NAME]: data[DASHBOARD_KEYS.CLIENT_NAME],
    };

    const ctx: ProjectContext = {
      sheet,
      extractedProjectData: data,
    };

    for (const column of DASHBOARD_COLUMNS) {
      try {
        row[column.key] ??= column.valueFn(ctx);
      } catch (err) {
        row[column.key] = "ERROR";
      }
    }

    return row;
  });
}
