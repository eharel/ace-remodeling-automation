import { BaseColumn } from "@sheets/columns";
import { StylizeOptions } from "@sheets/styles";

/**
 * Renders data rows with optional rowSpan merging for grouped data.
 */
export function renderRows<RowType extends Record<string, any>>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  startRow: number,
  startCol: number,
  rows: RowType[],
  columns: BaseColumn<any, any, any>[],
  options?: StylizeOptions<any>
): number {
  const fallbackRowSpan = options?.rowSpan ?? 1;
  const rowSpanMap = options?.rowSpanMap;

  // Convert rows to values matrix
  const values = rows.map((row) => columns.map((col) => row[col.key] ?? ""));

  // Calculate row spans for each row
  const rowSpans = rows.map((row) => {
    const key = row.quarter ?? row.groupKey ?? "";
    return rowSpanMap?.[key] ?? fallbackRowSpan;
  });

  let currentRow = startRow;

  // Render each row with appropriate spanning
  for (let i = 0; i < values.length; i++) {
    const rowValues = values[i];
    const span = rowSpans[i];

    // Set the row values
    sheet
      .getRange(currentRow, startCol, 1, columns.length)
      .setValues([rowValues]);

    // Apply vertical merging if span > 1
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

  // Return the last row index (exclusive)
  return currentRow - 1;
}
