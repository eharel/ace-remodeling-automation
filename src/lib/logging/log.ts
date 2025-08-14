import { getRunContext } from "./run-context";

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogFields = Record<string, unknown>;

// per-execution global min level
let GLOBAL_MIN_LEVEL: LogLevel = "info";
export function setGlobalLogLevel(level: LogLevel) {
  GLOBAL_MIN_LEVEL = level;
}

export type Logger = {
  debug: (msg: string, fields?: LogFields) => void;
  info: (msg: string, fields?: LogFields) => void;
  warn: (msg: string, fields?: LogFields) => void;
  error: (msg: string, fields?: LogFields) => void;

  /** Start a span (logs START ...), returns an object with end() that logs END ... with duration (ms). */
  start: (
    operation: string,
    fields?: LogFields
  ) => { end: (fields?: LogFields) => void };
};

export type LoggerOptions = {
  /** Minimum level to emit. Defaults to "info". */
  level?: LogLevel;
};

export function createLogger(
  module?: string,
  options: LoggerOptions = {}
): Logger {
  const minLevel: LogLevel = options.level ?? GLOBAL_MIN_LEVEL;

  function levelValue(l: LogLevel): number {
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
  function shouldLog(level: LogLevel): boolean {
    return levelValue(level) >= levelValue(minLevel);
  }

  function write(level: LogLevel, msg: string, fields?: LogFields): void {
    if (!shouldLog(level)) return;
    const ts = new Date().toISOString();
    const mod = module ? ` [${module}]` : "";
    const ctx = getRunContext();
    const corr = ctx ? ` (req ${ctx.reqId} ${ctx.env})` : "";
    const json = fields ? " " + safeJson(fields) : "";
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
  function start(operation: string, fields?: LogFields) {
    write("info", `START ${operation}`, fields);
    const t0 = Date.now();
    let ended = false;
    return {
      end(endFields?: LogFields) {
        if (ended) return; // idempotent
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

function safeJson(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '"<unserializable fields>"';
  }
}
