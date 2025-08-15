# Logging (GAS)

A tiny, structured logger for Google Apps Script with:

- levels (`debug` | `info` | `warn` | `error`)
- per-execution context `(reqId, env)`
- spans (`start()`/`end()` with duration)
- bound (preset) fields
- structured error logging (`errFields`)
- env normalization at the entrypoint

> Console size in GAS is ~50KB; older lines can be truncated. Keep logs purposeful.

---

## 1) Quick start

```ts
import { createLogger } from "@/lib/logging/log";

const log = createLogger("MyModule");
log.info("Hello world", { foo: 123 });
// 2025-... INFO [MyModule] (req <uuid> development) Hello world {"foo":123}
```

### With bound fields

```ts
const log = createLogger("Vendor", { bound: { formId } });
log.info("Extracting raw form data"); // auto-adds {"formId": "..."}
log.info("Saved vendor", { sheetId, tab: "Vendors" });
```

### Spans

```ts
const span = log.start("Handle vendor form"); // logs START
try {
  // work...
  span.end({ success: true }); // logs END with {"ms": ...}
} catch (e) {
  span.end({ success: false });
  throw e;
}
```

### Errors (structured)

```ts
import { errFields } from "@/lib/logging/log";

try {
  // ...
} catch (error) {
  log.error("Unhandled error", errFields(error));
  throw error;
}
```

### PII Masking

```ts
import { maskPII } from "@/lib/logging/log";

log.info("User submitted form", {
  email: maskPII("john.doe@example.com"), // → "[email]"
  phone: maskPII("+1 (555) 123-4567"), // → "[phone]"
  name: "John Doe", // safe to log as-is
});
```

---

## 2) Entry points: env + run context

Normalize `env` **once**, then wrap the whole run so every line shares a `(req <uuid> <env>)` prefix.

```ts
import { normalizeEnv, type EnvName } from "@/lib/env/env";
import { withRunContext } from "@/lib/logging/run-context";
import { createLogger, setGlobalLogLevel } from "@/lib/logging/log";

const levelForEnv = (env: EnvName) =>
  env === "development" || env === "staging" ? "debug" : "info";

export function onFormSubmit(
  e: GoogleAppsScript.Events.FormsOnFormSubmit,
  mode?: EnvName
) {
  const env = normalizeEnv(mode); // "dev"/"prod" → normalized

  return withRunContext(() => {
    // sets reqId/env for this run
    setGlobalLogLevel(levelForEnv(env)); // global min level per execution

    const log = createLogger("FormRouter");
    log.info("Received form submission", { env });
    // ...do work...
  }, env);
}
```

---

## 3) API surface

### `createLogger(module?: string, options?: LoggerOptions): Logger`

**`LoggerOptions`**

- `level?: LogLevel` — minimum level (defaults to global min)
- `bound?: LogFields` — preset fields merged into every line

**`Logger` methods**

- `debug/info/warn/error(msg, fields?)`
- `start(operation, fields?) → { end(fields?) }`

  - `end()` is idempotent and adds `{"ms": <duration>}`

**Global helpers**

- `setGlobalLogLevel(level: LogLevel)`
  Sets min level for the current execution (`withRunContext` run).
- `errFields(error: unknown) → LogFields`
  Serializes `Error` as `{ name, message, stack }`; otherwise `{ error: String(err) }`.
- `maskPII(s: string) → string`
  Masks emails and phone numbers in strings. Opt-in at call sites.

**Types**

- `LogLevel = "debug" | "info" | "warn" | "error"`
- `LogFields = Record<string, unknown>`

---

## 4) Patterns we use

### Vendors handler (bound fields + span)

```ts
import { createLogger, errFields } from "@/lib/logging/log";

export function handleVendorForm(e, ids) {
  const log = createLogger("Vendor", { bound: { formId: ids.VENDOR_FORM } });
  const span = log.start("Handle vendor form");

  let error: Error | undefined;
  try {
    log.info("Extracting raw form data");
    const raw = e.response.getItemResponses().reduce(/* ... */);
    const vendor = parseVendorResponse(raw);

    log.debug("Parsed vendor data", { name: vendor.companyName }); // avoid full PII
    saveVendorDataToSheet(vendor, ids.VENDOR_SHEET, ids.VENDOR_TAB);

    log.info("Saved vendor to sheet", {
      sheetId: ids.VENDOR_SHEET,
      tab: ids.VENDOR_TAB,
    });
  } catch (err) {
    error = err as Error;
    log.error("Error processing vendor form", errFields(error));
    throw error;
  } finally {
    span.end({ success: !error });
  }
}
```

### Router (structured errors, single env)

```ts
import { normalizeEnv } from "@/lib/env/env";
import { withRunContext } from "@/lib/logging/run-context";
import { createLogger, setGlobalLogLevel, errFields } from "@/lib/logging/log";

export function onFormSubmit(e, mode?) {
  const env = normalizeEnv(mode);
  return withRunContext(() => {
    setGlobalLogLevel(
      env === "development" || env === "staging" ? "debug" : "info"
    );

    const log = createLogger("FormRouter");
    log.info("Received form submission", { env });

    try {
      // ... your routing and ID checks ...
    } catch (error) {
      log.error("Error processing form", errFields(error));
      throw error;
    }
  }, env);
}
```

---

## 5) Conventions

- **PII:** Keep PII out of logs. Use `maskPII()` for emails/phones, prefer short identifiers (e.g., `{ name: vendor.companyName }`, not full payloads).
- **Levels:**

  - `debug` — noisy, dev/staging only
  - `info` — high-level steps and results
  - `warn` — unexpected but recoverable
  - `error` — execution failed or changed flow

- **One span per major operation**; nested spans are fine.
- **One structured error per request** from the router catch.

---

## 6) Troubleshooting

- **No bound fields showing?**
  Ensure `createLogger(..., { bound })` is used and that `log.ts` merges `bound` with call-site fields (`{ ...bound, ...fields }`).
- **Two error lines for one failure?**
  Don’t `log.error` before throwing; let the outer `catch` do the single structured line.
- **In prod, `debug` missing?**
  That’s expected—global min level is `info`. In dev/staging it’s `debug`.

---

## 7) Future (optional)

- Log level override via Script Property (temporary ops switch).
- Child loggers (`[Vendor:save]`) / `log.with({ ... })` convenience.
- ~~PII masking helper~~ ✅ **Added**: `maskPII()` for emails/phones.
- Secondary transport (e.g., write key events to a Sheet) for persistence.

---

## 8) Commit style (50/72)

```
feat(logging): add bound fields support

Merge preset logger fields with call-site fields so common context
(formId, sheetId) appears on every line; call-site values override.
```
