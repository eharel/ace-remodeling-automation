export type ColumnFormat = "currency" | "text" | "number" | "percent" | "date";
export type Alignment = "left" | "center" | "right";

/**
 * A generic base column that enforces domain-specific key and label types.
 */
export type BaseColumn<
  TContext = any,
  TKey extends string = string,
  TLabel extends string = string
> = {
  key: TKey;
  label: TLabel;
  valueFn: (ctx: TContext) => any;
  format?: ColumnFormat;
  align?: Alignment;
  description?: string;
  help?: string;
};
