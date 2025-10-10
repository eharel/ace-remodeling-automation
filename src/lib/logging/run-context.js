// Module-local storage (safe per GAS execution)
let CURRENT = null;
export function setRunContext(ctx) {
    CURRENT = ctx;
}
export function getRunContext() {
    return CURRENT;
}
export function clearRunContext() {
    CURRENT = null;
}
/**
 * Set a fresh {reqId, env} for the duration of fn() and always clean up.
 * Usage:
 *   return withRunContext(() => { ... }, "development");
 */
export function withRunContext(fn, env) {
    const reqId = Utilities.getUuid();
    try {
        setRunContext({ reqId, env });
        return fn();
    }
    finally {
        clearRunContext();
    }
}
