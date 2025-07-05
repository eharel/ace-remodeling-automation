export interface FieldContext {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  namedRangeMap: Map<string, GoogleAppsScript.Spreadsheet.Range>;
  directValueMap: Map<string, any>;
  rowData: any[];
}

export interface ProjectField {
  dbHeader: string;
  valueFn?: (fieldContext: FieldContext) => any;
}
