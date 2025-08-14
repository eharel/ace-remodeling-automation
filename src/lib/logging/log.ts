// src/lib/logging/log.ts

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogFields = Record<string, unknown>;

export type Logger = {
  debug: (msg: string, fields?: LogFields) => void;
  info: (msg: string, fields?: LogFields) => void;
  warn: (msg: string, fields?: LogFields) => void;
  error: (msg: string, fields?: LogFields) => void;
};

export type LoggerOptions = {
  /** Minimum level to emit. Defaults to "info". */
  level?: LogLevel;
};

/** Factory function — create a module-scoped logger with a min-level filter. */
export function createLogger(
  module?: string,
  options: LoggerOptions = {}
): Logger {
  const minLevel: LogLevel = options.level ?? "info";

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
    const json = fields ? " " + safeJson(fields) : "";
    const line = `${ts} ${level.toUpperCase()}${mod} ${msg}${json}`;

    switch (level) {
      case "warn":
        console.warn(line);
        break;
      case "error":
        console.error(line);
        break;
      default:
        console.info(line); // "debug" & "info" go here
    }
  }

  return {
    debug: (m, f) => write("debug", m, f),
    info: (m, f) => write("info", m, f),
    warn: (m, f) => write("warn", m, f),
    error: (m, f) => write("error", m, f),
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
