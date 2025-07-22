import { dashboardKeys, inputKeys } from "./keys";
import { dashboardLabels } from "./labels";

// 🧠 TYPE ALIASES
export type InputKey = keyof typeof inputKeys;
export type DashboardKey = keyof typeof dashboardKeys;
export type DashboardLabel = (typeof dashboardLabels)[DashboardKey];

// 🔁 MAPPINGS
export const KEYS_BY_LABEL: Record<DashboardLabel, DashboardKey> =
  Object.fromEntries(
    Object.entries(dashboardLabels).map(([k, v]) => [v, k])
  ) as Record<DashboardLabel, DashboardKey>;

export const LABELS_BY_KEY: Record<DashboardKey, DashboardLabel> =
  dashboardLabels;
