export function extractResponse(
  e: GoogleAppsScript.Events.FormsOnFormSubmit
): Record<string, string> {
  const responses = e.response.getItemResponses();
  const result: Record<string, string> = {};

  for (const item of responses) {
    const title = item.getItem().getTitle();
    const answer = item.getResponse();

    if (Array.isArray(answer)) {
      result[title] = answer.join(", ").trim();
    } else {
      result[title] = String(answer).trim();
    }
  }

  return result;
}
