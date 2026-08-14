/**
 * Small shared utilities. Named exports only — add functions here as
 * they earn a second caller.
 */

/** "2026-03-15" -> "15 Mars 2026" (month capitalized to match the design). */
export function formatDate(iso: string, locale: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  const formatted = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return formatted.replace(
    /\p{L}+/u,
    (month) => month.charAt(0).toUpperCase() + month.slice(1),
  );
}
