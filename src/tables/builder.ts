import { BaseColumn } from "@shared/columns";
import {
  OPERATION_SYMBOLS,
  StylizeOptions,
  SummaryOperation,
  SummaryOperationsMap,
  TableInfo,
  ValueFormat,
} from "@shared/styles";
import { stylizeTable } from "@shared/styles";

export type GenerateTableParams<
  RowType extends Record<string, any>,
  T extends string
> = {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  rows: RowType[];
  startRow: number;
  startCol: number;
  columns: BaseColumn<any, any, any>[];
  summaryRowOps: SummaryOperationsMap;
  options?: StylizeOptions<T>;
  title?: string;
};

export function generateAndStylizeTableFromRows<
  RowType extends Record<string, any>,
  T extends string
>(params: GenerateTableParams<RowType, T>): TableInfo {
  const {
    sheet,
    rows,
    startRow,
    startCol,
    columns,
    summaryRowOps,
    options = {},
    title,
  } = params;

  const table = generateTableFromRows({
    sheet,
    rows,
    startRow,
    startCol,
    columns,
    summaryRowOps,
    options,
    title,
  });

  const keyToIndex = new Map(columns.map((col, i) => [col.key, i]));
  stylizeTable(sheet, table, columns, keyToIndex, options);

  for (const stylizer of options.customStylizers ?? []) {
    stylizer(sheet, table);
  }

  return table;
}

function generateTableFromRows<RowType extends Record<string, any>>({
  sheet,
  rows,
  startRow,
  startCol,
  columns,
  summaryRowOps,
  options,
  title,
}: GenerateTableParams<RowType, any>): TableInfo {
  let rowIndex = startRow;

  if (title) {
    addTableTitle(sheet, rowIndex, startCol, title, columns);
    rowIndex++;
  }

  const hasHeader = options?.hasHeaders ?? true;

  const headerRow = hasHeader ? rowIndex : undefined;
  if (hasHeader) {
    addTableHeaders(sheet, rowIndex, startCol, columns);
    rowIndex++;
  }

  const hasDescription = options?.showDescription ?? true;
  const descriptionRow = hasHeader ? rowIndex : undefined;
  if (hasDescription && hasHeader) {
    rowIndex++; // extra row for description
  }

  const dataStartRow = rowIndex;

  const fallbackRowSpan = options?.rowSpan ?? 1;
  const rowSpanMap = options?.rowSpanMap;

  const values = rows.map((row) => columns.map((col) => row[col.key] ?? ""));

  // 1. Determine span per row
  const rowSpans = rows.map((row) => {
    const key = row.quarter ?? row.groupKey ?? ""; // fallback logic
    return rowSpanMap?.[key] ?? fallbackRowSpan;
  });

  // 2. Write rows using cumulative row index
  let currentRow = dataStartRow;
  for (let i = 0; i < values.length; i++) {
    const rowValues = values[i];
    const span = rowSpans[i];

    sheet
      .getRange(currentRow, startCol, 1, columns.length)
      .setValues([rowValues]);

    if (span > 1) {
      for (let j = 0; j < columns.length; j++) {
        sheet
          .getRange(currentRow, startCol + j, span, 1)
          .mergeVertically()
          .setVerticalAlignment("middle");
      }
    }

    currentRow += span;
  }

  // 3. Final row after all written values
  const dataEndRow = currentRow - 1;

  const summaryRow =
    Object.keys(summaryRowOps).length > 0
      ? addTableSummaryRow(
          sheet,
          dataStartRow,
          dataEndRow,
          startCol,
          columns,
          summaryRowOps,
          options
        )
      : undefined;

  return {
    title,
    startRow,
    startCol,
    headerRow,
    dataStartRow,
    dataEndRow,
    summaryRow,
    endRow: summaryRow ?? dataEndRow,
    endCol: startCol + columns.length - 1,
  };
}

function addTableTitle(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  title: string,
  columns: BaseColumn<any, any, any>[]
) {
  sheet.getRange(row, col).setValue(title).setFontWeight("bold");
  sheet
    .getRange(row, col, 1, columns.length)
    .merge()
    .setHorizontalAlignment("center")
    .setFontSize(12)
    .setFontWeight("bold");
}

function addTableHeaders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  col: number,
  columns: BaseColumn<any, any, any>[]
) {
  const labels = columns.map((col) => col.label);
  sheet.getRange(row, col, 1, labels.length).setValues([labels]);
}

function addTableSummaryRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  dataStartRow: number,
  dataEndRow: number,
  startCol: number,
  columns: BaseColumn<any, any, any>[],
  summaryRowOps: SummaryOperationsMap,
  options?: StylizeOptions
): number {
  const numRows = dataEndRow - dataStartRow + 1;
  const colMap = Object.fromEntries(columns.map((col, i) => [col.key, i]));

  // Helper function to get column values
  const getColumnValues = (key: string): number[] => {
    const colIdx = colMap[key];
    if (colIdx === undefined) return [];
    return sheet
      .getRange(dataStartRow, startCol + colIdx, numRows, 1)
      .getValues()
      .flat()
      .map((val) => (typeof val === "number" ? val : Number(val)))
      .filter((val) => typeof val === "number" && !isNaN(val));
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
    } else if (opConfig && typeof opConfig === "object") {
      operation = opConfig.operation;
      format = opConfig.format || "number";
      decimals =
        opConfig.decimals !== undefined
          ? opConfig.decimals
          : format === "percent"
          ? 2
          : format === "currency"
          ? 2
          : 0;
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
    let formattedValue: string;
    if (typeof value === "number") {
      switch (format) {
        case "currency":
          formattedValue = `$${value.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}`;
          break;
        case "percent":
          formattedValue = `${(value * 100).toFixed(decimals)}%`;
          break;
        case "number":
          formattedValue = value.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
          break;
        default:
          formattedValue = String(value);
      }
    } else {
      formattedValue = String(value);
    }

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

  return summaryRowIndex;
}
