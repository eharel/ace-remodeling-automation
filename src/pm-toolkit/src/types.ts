export type StylizeOptions<T extends string = string> = {
  colorKeys?: readonly T[];
  zebra?: boolean;
  showDescription?: boolean;
  rowSpan?: number;
  rowSpanMap?: Record<string, number>;
  customStylizers?: ((
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    table: TableInfo
  ) => void)[];
  columnWidths?: Partial<Record<string, number>>;
};

export type TableInfo = {
  title?: string;
  startRow: number;
  startCol: number;
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
  summaryRow?: number;

  endRow: number;
  endCol: number;
};
