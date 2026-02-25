export function safeParseJson(str) {
  try {
    return typeof str === 'string' ? JSON.parse(str) : str
  } catch {
    return []
  }
}
