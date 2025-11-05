export function toIsoWithOffset(d: Date) {
  // Build an ISO-8601 timestamp including the local timezone offset (e.g. 2025-11-04T12:34:56+02:00)
  const pad = (n: number) => String(Math.abs(Math.floor(n))).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const tzMin = d.getTimezoneOffset();
  const sign = tzMin <= 0 ? '+' : '-';
  const absMin = Math.abs(tzMin);
  const tzHours = pad(Math.floor(absMin / 60));
  const tzMinutes = pad(absMin % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${tzHours}:${tzMinutes}`;
}
