import { stylizeTable } from "@shared/styles";
import { renderTitle, renderSplitTitle } from "./render-title";
import { renderHeaders } from "./render-headers";
import { renderRows } from "./render-rows";
import { renderSummaryRow } from "./render-summary";
/**
 * Generates and stylizes a complete table with optional title, headers, data rows, and summary.
 * This is the main entry point that handles both generation and styling.
 */
export function generateAndStylizeTableFromRows(params) {
    const { sheet, rows, startRow, startCol, columns, summaryRowOps, options = {}, title, splitTitle, } = params;
    // Generate the table structure
    const table = generateTableFromRows({
        sheet,
        rows,
        startRow,
        startCol,
        columns,
        summaryRowOps,
        options,
        title,
        splitTitle,
    });
    // Apply styling to the table
    const keyToIndex = new Map(columns.map((col, i) => [col.key, i]));
    stylizeTable(sheet, table, columns, keyToIndex, options);
    // Apply any custom stylizers
    for (const stylizer of options.customStylizers ?? []) {
        stylizer(sheet, table);
    }
    return table;
}
/**
 * Generates a table structure without applying styling.
 * Returns TableInfo with all the positioning details.
 */
export function generateTableFromRows({ sheet, rows, startRow, startCol, columns, summaryRowOps, options, title, splitTitle, }) {
    let rowIndex = startRow;
    // Render title if provided
    if (title) {
        if (splitTitle) {
            const { frozenColumns, styling } = splitTitle;
            renderSplitTitle(sheet, rowIndex, startCol, title, columns, frozenColumns, styling);
            rowIndex++;
        }
        else {
            renderTitle(sheet, rowIndex, startCol, title, columns);
            rowIndex++;
        }
    }
    // Render headers if enabled
    const hasHeader = options?.hasHeaders ?? true;
    const headerRow = hasHeader ? rowIndex : undefined;
    if (hasHeader) {
        renderHeaders(sheet, rowIndex, startCol, columns);
        rowIndex++;
    }
    // Account for description row if enabled
    const hasDescription = options?.showDescription ?? true;
    const descriptionRow = hasHeader ? rowIndex : undefined;
    if (hasDescription && hasHeader) {
        rowIndex++; // extra row for description
    }
    // Render data rows
    const dataStartRow = rowIndex;
    const dataEndRow = renderRows(sheet, dataStartRow, startCol, rows, columns, options);
    // Render summary row if operations are provided
    const summaryRow = Object.keys(summaryRowOps).length > 0
        ? renderSummaryRow(sheet, dataStartRow, dataEndRow, startCol, columns, summaryRowOps, options)
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
