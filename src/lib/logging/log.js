import { getRunContext } from "./run-context";
// per-execution global min level
let GLOBAL_MIN_LEVEL = "info";
export function setGlobalLogLevel(level) {
    GLOBAL_MIN_LEVEL = level;
}
export function createLogger(module, options = {}) {
    const minLevel = options.level ?? GLOBAL_MIN_LEVEL;
    const boundBase = options.bound;
    function levelValue(l) {
        switch (l) {
            case "debug":
                return 10;
            case "info":
                return 20;
            case "warn":
                return 30;
            case "error":
                return 40;
        }
    }
    function shouldLog(level) {
        return levelValue(level) >= levelValue(minLevel);
    }
    function write(level, msg, fields) {
        if (!shouldLog(level))
            return;
        // NEW: merge preset (bound) fields first; call-site overrides bound on conflicts
        const mergedFields = boundBase
            ? fields
                ? { ...boundBase, ...fields }
                : boundBase
            : fields;
        const ts = new Date().toISOString();
        const mod = module ? ` [${module}]` : "";
        const ctx = getRunContext();
        const corr = ctx ? ` (req ${ctx.reqId} ${ctx.env})` : "";
        const json = mergedFields ? " " + safeJson(mergedFields) : "";
        const line = `${ts} ${level.toUpperCase()}${mod}${corr} ${msg}${json}`;
        switch (level) {
            case "warn":
                console.warn(line);
                break;
            case "error":
                console.error(line);
                break;
            default:
                console.info(line); // "debug" & "info"
        }
    }
    /** Spans: START/END with duration at info level */
    function start(operation, fields) {
        write("info", `START ${operation}`, fields);
        const t0 = Date.now();
        let ended = false;
        return {
            end(endFields) {
                if (ended)
                    return; // idempotent
                ended = true;
                const ms = Date.now() - t0;
                write("info", `END ${operation}`, { ...endFields, ms });
            },
        };
    }
    return {
        debug: (m, f) => write("debug", m, f),
        info: (m, f) => write("info", m, f),
        warn: (m, f) => write("warn", m, f),
        error: (m, f) => write("error", m, f),
        start,
    };
}
/** Shared default logger (no module tag, default level=info). */
export const log = createLogger();
// Helper: turn unknown error into structured fields
export function errFields(err) {
    if (err instanceof Error) {
        return { name: err.name, message: err.message, stack: err.stack };
    }
    return { error: String(err) };
}
// Safer JSON: handles Error + circular references
function safeJson(obj) {
    try {
        const seen = new WeakSet();
        const replacer = (_key, value) => {
            if (value instanceof Error) {
                return { name: value.name, message: value.message, stack: value.stack };
            }
            if (value && typeof value === "object") {
                if (seen.has(value))
                    return "[Circular]";
                seen.add(value);
            }
            return value;
        };
        return JSON.stringify(obj, replacer);
    }
    catch {
        return '"<unserializable fields>"';
    }
}
// Mask common PII patterns in a string. Opt-in at call sites.
export function maskPII(s) {
    if (typeof s !== "string")
        return String(s);
    return (s
        // emails
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
        // phone-like sequences (loose, international-ish)
        .replace(/\b(?:\+?\d[\d\s().-]{6,}\d)\b/g, "[phone]"));
}
