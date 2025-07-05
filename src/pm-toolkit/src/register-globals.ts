/**
 * Automatically registers functions on the global scope for Apps Script.
 *
 * @param exports An object where keys are the global function names and values are the functions
 */
export function registerGlobals(exports: Record<string, Function>) {
  for (const [name, fn] of Object.entries(exports)) {
    (globalThis as any)[name] = fn;
  }
}
