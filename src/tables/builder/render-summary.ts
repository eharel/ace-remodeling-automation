import { BaseColumn } from "@shared/columns";
import {
  OPERATION_SYMBOLS,
  StylizeOptions,
  SummaryOperation,
  SummaryOperationsMap,
  ValueFormat,
} from "@shared/styles";

/**
 * Renders a summary row with calculated values based on the provided operations.
 * Returns the row index of the rendered summary row.
 */
export function renderSummaryRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dataStartRow: number,
  dataEndRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  summaryRowOps: SummaryOperationsMap,
  options?: StylizeOptions<any>
): number {
  // Create column mapping for quick lookups
  const colMap: Record<string, number> = {};
  columns.forEach((col, index) => {
    colMap[col.key] = index;
  });

  // Helper function to get column values from the data range
  const getColumnValues = (key: string): number[] => {
    const colIdx = colMap[key];
    if (colIdx === undefined) return [];

    const colRange = sheet.getRange(
      dataStartRow,
      startCol + colIdx,
      dataEndRow - dataStartRow + 1,
      1
    );
    const values = colRange.getValues().flat();
    return values.filter((val) => typeof val === "number" && !isNaN(val));
  };

  // Helper function to sum values
  const getSum = (key: string): number | string => {
    const values = getColumnValues(key);
    if (values.length === 0) return "";
    return values.reduce((acc, val) => acc + val, 0);
  };

  // Helper function to average values
  const getAverage = (key: string): number | string => {
    const values = getColumnValues(key);
    if (values.length === 0) return "";
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
    return avg; // Return the actual number for proper formatting later
  };

  // Initialize summary row
  const summaryRow = Array(columns.length).fill("");
  // Use the provided summaryTitle or default to "📊 Summary"
  summaryRow[0] =
    options?.summaryTitle !== undefined ? options.summaryTitle : "📊 Summary";

  // Apply operations to each column based on the specified operation type
  for (const [key, opConfig] of Object.entries(summaryRowOps)) {
    const colIdx = colMap[key];
    if (colIdx === undefined || opConfig === undefined) continue;

    // Extract operation and format from config
    let operation: SummaryOperation;
    let format: ValueFormat = "number";
    let decimals = 0;

    if (typeof opConfig === "string") {
      operation = opConfig;

      const colFormat = columns[colIdx].format;
      format = isValueFormat(colFormat) ? colFormat : "number";

      decimals = resolveDecimals(opConfig, columns[colIdx], format);
    } else if (opConfig && typeof opConfig === "object") {
      operation = opConfig.operation;
      format = opConfig.format || "number";

      // Priority: opConfig.decimals > column.formatDecimals > format defaults
      decimals = resolveDecimals(opConfig, columns[colIdx], format);
    } else {
      continue; // Skip if opConfig is invalid
    }

    // Skip columns with 'none' operation
    if (operation === "none") continue;

    // Apply the appropriate operation
    let value: number | string = "";
    switch (operation) {
      case "sum":
        value = getSum(key);
        break;
      case "avg":
        value = getAverage(key);
        break;
    }

    // Skip if no value
    if (value === "") continue;

    // Format the value based on the specified format
    const formattedValue = formatSummaryValue(value, format, decimals);

    // Add the operation symbol as a prefix
    const symbol = OPERATION_SYMBOLS[operation];
    if (symbol) {
      summaryRow[colIdx] = `${symbol} ${formattedValue}`;
    } else {
      summaryRow[colIdx] = formattedValue;
    }
  }

  const summaryRowIndex = dataEndRow + 1;
  const summaryRange = sheet.getRange(
    summaryRowIndex,
    startCol,
    1,
    columns.length
  );

  // Set the values
  summaryRange.setValues([summaryRow]);

  // Apply styling to the entire summary row
  applySummaryRowStyling(sheet, summaryRowIndex, startCol, columns);

  return summaryRowIndex;
}

function resolveDecimals(
  opConfig: unknown,
  column: BaseColumn<any, any, any>,
  format: ValueFormat
): number {
  let resolved: number;

  if (
    typeof opConfig === "object" &&
    opConfig &&
    Object.prototype.hasOwnProperty.call(opConfig, "decimals")
  ) {
    resolved = (opConfig as any).decimals;
  } else if (column.formatDecimals !== undefined) {
    resolved = column.formatDecimals;
  } else {
    resolved = format === "percent" || format === "currency" ? 2 : 0;
  }

  // Logger.log(
  //   "→ resolveDecimals | format: %s | config.decimals: %s | column.formatDecimals: %s | result: %s",
  //   format,
  //   typeof opConfig === "object" && opConfig ? (opConfig as any).decimals : "-",
  //   column.formatDecimals,
  //   resolved
  // );

  return Math.floor(resolved); // Ensure integer
}

/**
 * Formats a summary value based on the specified format and decimal places.
 */
export function formatSummaryValue(
  value: number | string,
  format: ValueFormat,
  decimals: number
): string {
  decimals = Math.floor(decimals); // 💡 ensure it's a clean integer

  if (typeof value !== "number") {
    Logger.log("Non-number summary value: %s", value);
    return String(value);
  }

  switch (format) {
    case "currency":
      return `$${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    case "percent":
      return `${(value * 100).toFixed(decimals)}%`;
    case "number":
      return value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    default:
      return String(value);
  }
}

/**
 * Applies consistent styling to the summary row.
 */
function applySummaryRowStyling(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  summaryRowIndex: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[]
): void {
  const summaryRange = sheet.getRange(
    summaryRowIndex,
    startCol,
    1,
    columns.length
  );

  // Apply styling to the entire summary row
  summaryRange
    .setFontSize(9)
    .setFontStyle("italic")
    .setFontColor("#444444") // Dark gray that works well with the gray background
    .setBackground("#f3f3f3"); // Light gray background

  // Set first cell (Summary label) to left alignment
  sheet
    .getRange(summaryRowIndex, startCol, 1, 1)
    .setHorizontalAlignment("left");

  // Apply column-specific alignments to the rest of the cells
  for (let i = 1; i < columns.length; i++) {
    const column = columns[i];
    const alignment = column.align || "right"; // Default to right alignment for numeric columns
    sheet
      .getRange(summaryRowIndex, startCol + i, 1, 1)
      .setHorizontalAlignment(alignment);
  }
}

function isValueFormat(format: unknown): format is ValueFormat {
  return (
    format === "currency" ||
    format === "percent" ||
    format === "number" ||
    format === "text"
  );
}
