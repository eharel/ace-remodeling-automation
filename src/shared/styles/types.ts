export type StylizeOptions<T extends string = string> = {
  colorKeys?: readonly T[];
  zebra?: boolean;
  showDescription?: boolean;
  rowSpan?: number;
  rowSpanMap?: Record<string, number>;
  hasTitle?: boolean;
  hasHeaders?: boolean;
  customStylizers?: ((
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    table: TableInfo
  ) => void)[];
  columnWidths?: Partial<Record<string, number>>;
  summaryTitle?: string; // Optional title for summary row, defaults to "Summary" if not provided
};

export type TableInfo = {
  title?: string;
  startRow: number;
  startCol: number;
  headerRow?: number;
  dataStartRow: number;
  dataEndRow: number;
  summaryRow?: number;

  endRow: number;
  endCol: number;
};
