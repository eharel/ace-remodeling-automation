// src/lib/env/env.ts
export const RUN_ENVS = ["development", "staging", "production"];
export function isEnvName(v) {
    return typeof v === "string" && RUN_ENVS.includes(v);
}
export function normalizeEnv(v) {
    if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (s === "dev")
            return "development";
        if (s === "prod")
            return "production";
        if (RUN_ENVS.includes(s))
            return s;
    }
    return "development";
}
