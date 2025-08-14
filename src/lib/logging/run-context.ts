// Runtime list + TS literals (single source of truth)
export const RUN_ENVS = ["development", "staging", "production"] as const;
export type RunEnv = (typeof RUN_ENVS)[number];

// Per-execution context shape
export type RunContext = {
  reqId: string; // correlation id
  env: RunEnv; // normalized environment
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
export function withRunContext<T>(fn: () => T, env: RunEnv): T {
  const reqId = Utilities.getUuid();
  try {
    setRunContext({ reqId, env });
    return fn();
  } finally {
    clearRunContext();
  }
}

/* ---- Optional guards (use at external boundaries if needed) ---- */

export function isRunEnv(v: unknown): v is RunEnv {
  return typeof v === "string" && (RUN_ENVS as readonly string[]).includes(v);
}

export function normalizeRunEnv(v: unknown): RunEnv {
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "dev") return "development";
    if (s === "prod") return "production";
    if ((RUN_ENVS as readonly string[]).includes(s)) return s as RunEnv;
  }
  return "development"; // safe fallback
}
