export type EnvName = "development" | "staging" | "production";

export interface EnvResolver {
  workspaceDefault(): EnvName;
  domainOverride(domain: string): EnvName | undefined;
  resolve(domain: string): EnvName;
}

export const createEnvResolver = (
  getWorkspace: () => EnvName,
  getDomain: (domain: string) => EnvName | undefined
): EnvResolver => ({
  workspaceDefault: getWorkspace,
  domainOverride: getDomain,
  resolve(domain) {
    return getDomain(domain) ?? getWorkspace();
  },
});
