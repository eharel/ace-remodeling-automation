// src/lib/env/env.ts
export const RUN_ENVS = ["development", "staging", "production"] as const;
export type EnvName = (typeof RUN_ENVS)[number];

export function isEnvName(v: unknown): v is EnvName {
  return typeof v === "string" && (RUN_ENVS as readonly string[]).includes(v);
}

export function normalizeEnv(v: unknown): EnvName {
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "dev") return "development";
    if (s === "prod") return "production";
    if ((RUN_ENVS as readonly string[]).includes(s)) return s as EnvName;
  }
  return "development";
}
