export function extractResponse(e) {
    const responses = e.response.getItemResponses();
    const result = {};
    for (const item of responses) {
        const title = item.getItem().getTitle();
        const answer = item.getResponse();
        if (Array.isArray(answer)) {
            result[title] = answer.join(", ").trim();
        }
        else {
            result[title] = String(answer).trim();
        }
    }
    return result;
}
