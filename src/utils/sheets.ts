export interface SplitMergeRangeParams {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  startRow: number;
  startCol: number;
  numRows: number;
  numCols: number;
  frozenColumns: number;
  value: string;
  styling?: {
    background?: string;
    fontSize?: number;
    fontWeight?: GoogleAppsScript.Spreadsheet.FontWeight;
    fontColor?: string;
  };
}

export function applySplitMergeRange(params: SplitMergeRangeParams) {
  const {
    sheet,
    startRow,
    startCol,
    numRows,
    numCols,
    frozenColumns,
    value,
    styling,
  } = params;

  const middleStart = startCol + frozenColumns;
  const middleWidth = numCols - frozenColumns * 2;

  const leftRange = sheet.getRange(startRow, startCol, numRows, frozenColumns);
  const middleRange = sheet.getRange(
    startRow,
    middleStart,
    numRows,
    middleWidth
  );
  const rightRange = sheet.getRange(
    startRow,
    middleStart + middleWidth,
    numRows,
    frozenColumns
  );

  if (styling?.background) {
    sheet
      .getRange(startRow, startCol, numRows, numCols)
      .setBackground(styling.background);
  }

  middleRange
    .merge()
    .setValue(value)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  if (styling?.fontSize) middleRange.setFontSize(styling.fontSize);
  if (styling?.fontWeight) middleRange.setFontWeight(styling.fontWeight);
  if (styling?.fontColor) middleRange.setFontColor(styling.fontColor);

  return middleRange;
}
