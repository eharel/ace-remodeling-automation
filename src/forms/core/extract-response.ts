import { canonicalizeTitle } from "../utils/canonicalize-title";

export function extractResponse(
  e: GoogleAppsScript.Events.FormsOnFormSubmit
): Record<string, string> {
  const responses = e.response.getItemResponses();
  const result: Record<string, string> = {};

  for (const item of responses) {
    const rawTitle = item.getItem().getTitle();
    const title = canonicalizeTitle(rawTitle); // normalize here
    const answer = item.getResponse();

    result[title] = Array.isArray(answer)
      ? answer.join(", ").trim()
      : String(answer).trim();
  }

  return result;
}
