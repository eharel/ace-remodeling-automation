import { createEnvResolver, EnvName } from "./env-types";

const toEnvOrUndef = (v?: string | null): EnvName | undefined => {
  if (v === "production" || v === "staging" || v === "development") return v;
  return undefined; // important: don't coerce to 'development' here
};

const toEnvOrDev = (v?: string | null): EnvName =>
  toEnvOrUndef(v) ?? "development";

export function makeGasEnvResolver() {
  const props = PropertiesService.getScriptProperties();
  return createEnvResolver(
    () => toEnvOrDev(props.getProperty("WORKSPACE_ENV")), // main breaker
    (domain) => toEnvOrUndef(props.getProperty(`ENV_${domain.toUpperCase()}`)) // room switch
  );
}
