/**
 * Renders table headers and optional description row.
 */
export function renderHeaders(sheet, row, col, columns) {
    const headerValues = columns.map((column) => column.label);
    const headerRange = sheet.getRange(row, col, 1, columns.length);
    headerRange.setValues([headerValues]);
}
/**
 * Gets the number of rows that headers will occupy.
 * This includes the main header row and optional description row.
 */
export function getHeaderRowCount(hasDescription) {
    return hasDescription ? 2 : 1;
}
