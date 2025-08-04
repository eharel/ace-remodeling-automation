export function getCheckboxValues(field) {
    return field
        .split(",")
        .map((val) => val.trim())
        .filter(Boolean);
}
export function parseDateField(input) {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
}
export function getFileUploadUrls(field) {
    return field
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.startsWith("http"));
}
