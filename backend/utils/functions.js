export function sanitizeFileName(name) {
  if (typeof name !== "string") {
    return ""; // Return an empty string if the input is not a valid string
  }
  return name.replace(/[\\\/:*?"<>|]/g, "_");
}
