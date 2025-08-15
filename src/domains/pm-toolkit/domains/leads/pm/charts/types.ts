import { TableInfo } from "@sheets/styles";
import { ChartPosition } from "../../../../charts/positioner";

export type ChartFunction = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  position: ChartPosition,
  monthlyTableInfo: TableInfo,
  quarterlyTableInfo: TableInfo
) => void;
