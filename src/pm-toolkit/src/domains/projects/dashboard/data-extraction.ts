// 📁 projects/dashboard/extract-project-data.ts

import { ExtractedProjectData, ProjectFieldKey } from "./types";
import { getValueFromNamedOrLegacy } from "./utils";
import { buildDirectValueMap } from "./utils";
import { toNullableNumber } from "../../../utils";
import { setDashboardStatus } from "./utils";
import { toA1Notation } from "../../../utils/helpers";
import { PROJECT_DATA_FIELDS } from "./fields";
import { DASHBOARD_KEYS } from "./columns";

export function extractAllProjectData(
  activeSheets: GoogleAppsScript.Spreadsheet.Sheet[],
  namedRangesBySheet: Map<
    string,
    Map<string, GoogleAppsScript.Spreadsheet.Range>
  >,
  dashboardSheet: GoogleAppsScript.Spreadsheet.Sheet,
  beginningRow: number,
  beginningCol: number
): ExtractedProjectData[] {
  const extractedRows: ExtractedProjectData[] = [];

  for (let i = 0; i < activeSheets.length; i++) {
    const sheet = activeSheets[i];
    setDashboardStatus(
      dashboardSheet,
      `📊 Extracting Active Projects... (${i + 1}/${activeSheets.length})`,
      toA1Notation(beginningCol, beginningRow)
    );

    const namedRangeMap = namedRangesBySheet.get(sheet.getName()) ?? new Map();
    const extracted = extractProjectData(sheet, namedRangeMap);
    extractedRows.push(extracted);

    // Logger.log(`📄 Extracted data from [${sheet.getName()}]:`);
    // Logger.log(JSON.stringify(extracted, null, 2));
  }

  return extractedRows;
}

export function extractProjectData(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>
): ExtractedProjectData {
  const directValueMap = buildDirectValueMap(sheet);

  // Logger.log(`\n🔍🔍🔍 LEGACY VALUE MAP — ${sheet.getName()} 🔍🔍🔍`);
  // for (const [cell, value] of directValueMap.entries()) {
  //   Logger.log(`   🧱 ${cell} → ${value}`);
  // }
  // Logger.log(`🟰 END OF MAP FOR: ${sheet.getName()} 🟰\n`);

  const tabName = sheet.getName();

  const result: Partial<ExtractedProjectData> = {};

  for (const field of PROJECT_DATA_FIELDS) {
    const key = field.key;

    let value: string | number | null;

    if (key === DASHBOARD_KEYS.PROJECT_NO) {
      const match = tabName.match(/^(\d+)\s+/);
      value = match?.[1] ?? "N/A";
    } else if (key === DASHBOARD_KEYS.CLIENT_NAME) {
      const match = tabName.match(/^\d+\s+(.+)$/);
      value = match?.[1] ?? "N/A";
    } else {
      // TypeScript narrows here automatically
      const namedRange = field.namedRange;
      const raw = getValueFromNamedOrLegacy(
        namedRangeMap,
        directValueMap,
        namedRange,
        key
      );
      value = toNullableNumber(raw);
    }

    result[key] = value;
  }

  return result as ExtractedProjectData;
}
