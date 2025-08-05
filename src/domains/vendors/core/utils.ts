/**
 * Converts "Yes"/"No" form values to boolean
 */
export function parseYesNo(value: string): boolean | undefined {
  if (value === "Yes") return true;
  if (value === "No") return false;
  return undefined;
}
