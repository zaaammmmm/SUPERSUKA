// Hanya izinkan path relatif internal (mencegah open redirect).
export function safeReturnTo(value: string | string[] | undefined): string | null {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v) return null;
  if (!v.startsWith("/") || v.startsWith("//") || v.includes("\\")) return null;
  return v;
}
