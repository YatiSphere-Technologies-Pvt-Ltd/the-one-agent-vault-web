/** "sha256:9f2c41…e81a": keep the algorithm, the first 6 and the last 4 hex digits. */
export function truncateHash(hash: string, head = 6, tail = 4): string {
  const colon = hash.indexOf(":");
  const algo = colon >= 0 ? hash.slice(0, colon) : "";
  const body = colon >= 0 ? hash.slice(colon + 1) : hash;
  const short = body.length <= head + tail + 1 ? body : `${body.slice(0, head)}…${body.slice(-tail)}`;
  return algo ? `${algo}:${short}` : short;
}

/** Format an ISO timestamp for display; non-ISO strings are returned unchanged. */
export function formatDateTime(value: string, locale?: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

/** "5 min ago", "in 2 days". Falls back to the input for non-ISO strings. */
export function formatRelativeTime(value: string, locale?: string, now: number = Date.now()): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return value;
  const seconds = Math.round((time - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
  const abs = Math.abs(seconds);
  if (abs < 60) return rtf.format(seconds, "second");
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(seconds / 86400), "day");
  return formatDateTime(value, locale);
}

/** 1536 → "1.5 KB". */
export function formatBytes(bytes: number, locale?: string): string {
  const units = ["byte", "kilobyte", "megabyte"] as const;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return new Intl.NumberFormat(locale, { style: "unit", unit: units[unit], unitDisplay: "short", maximumFractionDigits: 1 }).format(value);
}
