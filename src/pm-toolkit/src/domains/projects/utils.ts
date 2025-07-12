import { INACTIVE_STATUSES } from "../../constants";
import { getOrCreateProjectStatusSheet } from "./close-project";

export function startsWithProjectNumber(name: string) {
  return /^\d+\s+/.test(name);
}

export function extractProjectNumber(name: string) {
  const match = name.match(/^(\d{3,4})/);
  return match ? match[1] : null;
}

export function isClosedTabName(name: string) {
  const lower = name.toLowerCase();
  return INACTIVE_STATUSES.some((status) =>
    new RegExp(`\\b${status}\\b`).test(lower)
  );
}

export function getProjectStatusMap() {
  const sheet = getOrCreateProjectStatusSheet();
  const values = sheet.getDataRange().getValues();
  const map = new Map();

  for (let i = 1; i < values.length; i++) {
    const [projectName, status] = values[i];
    const projectNumber = extractProjectNumber(projectName);
    if (projectNumber) {
      map.set(projectNumber, status);
    }
  }

  return map;
}
