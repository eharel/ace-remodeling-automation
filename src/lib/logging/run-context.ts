import { type EnvName } from "../env/env";

// Per-execution context shape
export type RunContext = {
  reqId: string; // correlation id
  env: EnvName; // normalized environment
};

// Module-local storage (safe per GAS execution)
let CURRENT: RunContext | null = null;

export function setRunContext(ctx: RunContext): void {
  CURRENT = ctx;
}

export function getRunContext(): RunContext | null {
  return CURRENT;
}

export function clearRunContext(): void {
  CURRENT = null;
}

/**
 * Set a fresh {reqId, env} for the duration of fn() and always clean up.
 * Usage:
 *   return withRunContext(() => { ... }, "development");
 */
export function withRunContext<T>(fn: () => T, env: EnvName): T {
  const reqId = Utilities.getUuid();
  try {
    setRunContext({ reqId, env });
    return fn();
  } finally {
    clearRunContext();
  }
}
