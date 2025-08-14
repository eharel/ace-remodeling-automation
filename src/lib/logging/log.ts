export type LogLevel = "info" | "warn" | "error";
export type LogFields = Record<string, unknown>;

export type Logger = {
  info: (msg: string, fields?: LogFields) => void;
  warn: (msg: string, fields?: LogFields) => void;
  error: (msg: string, fields?: LogFields) => void;
};

/** Factory function — create a module-scoped logger */
export function createLogger(module?: string): Logger {
  function write(level: LogLevel, msg: string, fields?: LogFields) {
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
        console.info(line);
    }
  }
  return {
    info: (msg, fields) => write("info", msg, fields),
    warn: (msg, fields) => write("warn", msg, fields),
    error: (msg, fields) => write("error", msg, fields),
  };
}

/** Shared default logger (no module tag) */
export const log = createLogger();

function safeJson(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return '"<unserializable fields>"';
  }
}
