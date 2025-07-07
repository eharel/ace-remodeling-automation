export type ColumnFormat = "currency" | "text" | "number" | "percent" | "date";
export type ColumnAlignment = "left" | "center" | "right";

export type BaseColumn<TContext = any> = {
  label: string;
  valueFn?: (ctx: TContext) => any;
  format?: ColumnFormat;
  align?: ColumnAlignment;
};
